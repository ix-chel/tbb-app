<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FilterQR;
use App\Models\Store;
use App\Models\InventoryItem;
use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $totalQR = FilterQR::count();
        $activeQR = FilterQR::where('status', 'active')->count();
        $expiredQR = FilterQR::where('expiry_date', '<', now())->count();
        $expiringSoon = FilterQR::where('status', 'active')
            ->whereNotNull('expiry_date')
            ->where('expiry_date', '<=', now()->addDays(30))
            ->where('expiry_date', '>', now())
            ->count();

        $recentScans = FilterQR::with(['store', 'inventoryItem'])
            ->whereNotNull('last_scan_at')
            ->orderBy('last_scan_at', 'desc')
            ->take(5)
            ->get();

        return view('admin.dashboard', compact(
            'totalQR',
            'activeQR',
            'expiredQR',
            'expiringSoon',
            'recentScans'
        ));
    }

    public function qrList()
    {
        $qrs = FilterQR::with(['store', 'inventoryItem'])
            ->latest()
            ->paginate(10);

        return view('admin.qr.list', compact('qrs'));
    }

    public function generateQR(Request $request)
    {
        $request->validate([
            'store_id' => 'required|exists:stores,id',
            'filter_id' => 'required|exists:inventory_items,id',
            'installation_date' => 'required|date',
            'expiry_date' => 'required|date|after:installation_date',
        ]);

        $qr = FilterQR::create([
            'store_id' => $request->store_id,
            'filter_id' => $request->filter_id,
            'qr_code' => uniqid('QR-'),
            'status' => 'active',
            'installation_date' => $request->installation_date,
            'expiry_date' => $request->expiry_date,
        ]);

        $qrCode = QrCode::format('png')
            ->size(300)
            ->generate(route('qr.scan', $qr->qr_code));

        return response()->json([
            'success' => true,
            'qr' => $qr,
            'qr_code_image' => base64_encode($qrCode)
        ]);
    }

    public function qrDetail($id)
    {
        $qr = FilterQR::with(['store', 'inventoryItem'])
            ->findOrFail($id);

        $scanHistory = $qr->scanHistory()
            ->with('user')
            ->latest()
            ->paginate(10);

        $maintenanceReports = $qr->maintenanceReports()
            ->with('user')
            ->latest()
            ->paginate(10);

        $stats = [
            'total_scans' => $qr->scanHistory()->count(),
            'unique_users' => $qr->scanHistory()->distinct('user_id')->count(),
            'last_scan' => $qr->last_scan_at,
            'days_until_expiry' => $qr->expiry_date ? now()->diffInDays($qr->expiry_date) : null,
        ];

        return view('admin.qr.detail', compact('qr', 'scanHistory', 'maintenanceReports', 'stats'));
    }
} 