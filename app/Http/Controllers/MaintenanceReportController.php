<?php

namespace App\Http\Controllers;

use App\Models\FilterQR;
use App\Models\MaintenanceReport;
use App\Models\Store;
use App\Models\StoreQR;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class MaintenanceReportController extends Controller
{
    public function index(Request $request)
    {
        $query = MaintenanceReport::with(['store', 'technician'])
            ->when($request->search, function ($q) use ($request) {
                $q->whereHas('store', function ($q) use ($request) {
                    $q->where('name', 'like', "%{$request->search}%");
                })->orWhereHas('technician', function ($q) use ($request) {
                    $q->where('name', 'like', "%{$request->search}%");
                });
            })
            ->when($request->status, function ($q) use ($request) {
                $q->where('equipment_status', $request->status);
            })
            ->when($request->start_date, function ($q) use ($request) {
                $q->whereDate('created_at', '>=', $request->start_date);
            })
            ->when($request->end_date, function ($q) use ($request) {
                $q->whereDate('created_at', '<=', $request->end_date);
            })
            ->latest();

        $reports = $query->paginate(10);

        return response()->json([
            'data' => $reports
        ]);
    }
    public function createWithStore(Request $request, $storeId)
    {
        $store = \App\Models\Store::findOrFail($storeId);
        $technicians = \App\Models\User::where('role', 'technician')->get(); // Atur sesuai struktur datamu

        return inertia('MaintenanceReport/Create', [
            'store' => $store,
            'technicians' => $technicians,
        ]);
    }

public function store(Request $request)
    {
        $this->authorize('create', MaintenanceReport::class);

        $validated = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'technician_id' => 'required|exists:users,id',
            'equipment_status' => 'required|in:good,needs_attention,broken',
            'filter_changed' => 'required|boolean',
            'filter_type' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'photos' => 'nullable|array',
            'photos.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'checklist_items' => 'required|array'
        ]);

        $photoPaths = [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('maintenance-photos', 'public');
                $photoPaths[] = $path;
            }
        }

        MaintenanceReport::create([
            'store_id' => $validated['store_id'],
            'technician_id' => $validated['technician_id'],
            'equipment_status' => $validated['equipment_status'],
            'filter_changed' => $validated['filter_changed'],
            'filter_type' => $validated['filter_type'],
            'notes' => $validated['notes'],
            'photo_paths' => $photoPaths,
            'checklist_items' => $validated['checklist_items'],
            'status' => 'pending',
        ]);

        return Redirect::route('dashboard')->with('success', 'Maintenance report submitted successfully.');
    }


    public function export(Request $request)
    {
        $query = MaintenanceReport::with(['store', 'technician'])
            ->when($request->search, function ($q) use ($request) {
                $q->whereHas('store', function ($q) use ($request) {
                    $q->where('name', 'like', "%{$request->search}%");
                })->orWhereHas('technician', function ($q) use ($request) {
                    $q->where('name', 'like', "%{$request->search}%");
                });
            })
            ->when($request->status, function ($q) use ($request) {
                $q->where('equipment_status', $request->status);
            })
            ->when($request->start_date, function ($q) use ($request) {
                $q->whereDate('created_at', '>=', $request->start_date);
            })
            ->when($request->end_date, function ($q) use ($request) {
                $q->whereDate('created_at', '<=', $request->end_date);
            })
            ->latest();

        $reports = $query->get();

        if ($request->format === 'excel') {
            return $this->exportExcel($reports);
        }

        return $this->exportPdf($reports);
    }

    protected function exportExcel($reports)
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Set header
        $sheet->setCellValue('A1', 'Tanggal');
        $sheet->setCellValue('B1', 'Store');
        $sheet->setCellValue('C1', 'Teknisi');
        $sheet->setCellValue('D1', 'Status');
        $sheet->setCellValue('E1', 'Filter Diganti');
        $sheet->setCellValue('F1', 'Catatan');

        // Set data
        $row = 2;
        foreach ($reports as $report) {
            $sheet->setCellValue('A' . $row, $report->created_at->format('d/m/Y H:i'));
            $sheet->setCellValue('B' . $row, $report->store->name);
            $sheet->setCellValue('C' . $row, $report->technician->name);
            $sheet->setCellValue('D' . $row, $this->getStatusText($report->equipment_status));
            $sheet->setCellValue('E' . $row, $report->filter_changed ? $report->filter_type : '-');
            $sheet->setCellValue('F' . $row, $report->notes);
            $row++;
        }

        // Auto size columns
        foreach (range('A', 'F') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $writer = new Xlsx($spreadsheet);
        $filename = 'maintenance-reports.xlsx';
        $path = storage_path('app/public/' . $filename);
        $writer->save($path);

        return response()->download($path)->deleteFileAfterSend();
    }

    protected function exportPdf($reports)
    {
        $pdf = PDF::loadView('exports.maintenance-reports', [
            'reports' => $reports
        ]);

        return $pdf->download('maintenance-reports.pdf');
    }

    protected function getStatusText($status)
    {
        return match($status) {
            'good' => 'Baik',
            'needs_attention' => 'Perlu Perhatian',
            'broken' => 'Rusak',
            default => $status
        };
    }

    public function createqr(Request $request)
    {
        $qrCode = $request->query('qr_code');

        $prefilledStoreId = null;

        $technicians = User::whereHas('roles', fn ($query) => $query->where('name', 'technician'))->get(['id', 'name']);

        if ($qrCode) {
            $qr = FilterQR::with('store')
                    ->where('qr_code', $qrCode)
                    ->first();

            if ($qr) {
                $prefilledStoreId = $qr->store?->id;
            }
        }

        return Inertia::render('maintenancereport/Createqr', [
            'stores' => Store::orderBy('name')->get(['id', 'name']),
            'prefilled_store_id' => $prefilledStoreId,
            'technicians' => $technicians
        ]);
    }

}