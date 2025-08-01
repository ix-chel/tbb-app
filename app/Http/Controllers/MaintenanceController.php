<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\FilterQR;
use App\Models\MaintenanceReport;
use App\Models\StoreQR;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class MaintenanceController extends Controller
{
    use AuthorizesRequests;

    public function scanQR($qrCode)
    {
        $storeQR = StoreQR::where('qr_code', $qrCode)->firstOrFail();
        $store = $storeQR->store;
        
        return Inertia::render('maintenance/report-form', [
            'store' => $store
        ]);
    }
    
    public function submitReport(Request $request, Store $store)
    {
        $this->authorize('create', MaintenanceReport::class);
        
        $validated = $request->validate([
            'checklist_items' => 'required|array',
            'filter_condition_notes' => 'nullable|string',
            'photo' => 'nullable|image|max:2048'
        ]);
        
        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('maintenance-photos', 'public');
        }
        
        $report = MaintenanceReport::create([
            'store_id' => $store->id,
            'technician_id' => auth()->id(),
            'checklist_items' => $validated['checklist_items'],
            'filter_condition_notes' => $validated['filter_condition_notes'],
            'photo_path' => $photoPath,
            'status' => 'pending'
        ]);
        
        return redirect()->route('maintenance.reports.index')
            ->with('message', 'Maintenance report submitted successfully');
    }

    public function store(Request $request, Store $store = null)
    {
        $this->authorize('create', MaintenanceReport::class);
        
        $validated = $request->validate([
            'equipment_status' => 'required|in:good,needs_attention,broken',
            'filter_changed' => 'required|boolean',
            'filter_type' => 'nullable|string',
            'notes' => 'nullable|string',
            'photos.*' => 'nullable|image|max:2048'
        ]);
        
        $photoPaths = [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $photoPaths[] = $photo->store('maintenance-photos', 'public');
            }
        }
        
        $report = MaintenanceReport::create([
            'store_id' => $store ? $store->id : $request->input('store_id'),
            'technician_id' => auth()->id(),
            'equipment_status' => $validated['equipment_status'],
            'filter_changed' => $validated['filter_changed'],
            'filter_type' => $validated['filter_type'],
            'notes' => $validated['notes'],
            'photo_paths' => json_encode($photoPaths),
            'status' => 'pending'
        ]);
        
        return response()->json([
            'message' => 'Maintenance report submitted successfully',
            'report' => $report
        ]);
    }
    
    public function index()
    {
        $this->authorize('viewAny', MaintenanceReport::class);
        
        $reports = MaintenanceReport::with(['store', 'technician'])
            ->latest()
            ->paginate(10);
            
        return Inertia::render('maintenancereport/Index', [
            'reports' => $reports
        ]);
    }
    
    public function approve(MaintenanceReport $report)
    {
        $this->authorize('update', $report);
        
        $report->update([
            'status' => 'approved',
            'approved_at' => now()
        ]);
        
        return back()->with('message', 'Report approved successfully');
    }
    
    public function requestRevision(Request $request, MaintenanceReport $report)
    {
        $this->authorize('update', $report);
        
        $validated = $request->validate([
            'admin_notes' => 'required|string'
        ]);
        
        $report->update([
            'status' => 'revision_needed',
            'admin_notes' => $validated['admin_notes'],
            'revision_requested_at' => now()
        ]);
        
        return back()->with('message', 'Revision requested successfully');
    }
} 