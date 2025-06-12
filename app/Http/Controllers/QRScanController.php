<?php

namespace App\Http\Controllers;

use App\Models\StoreQR;
use App\Models\QRScanHistory;
use Illuminate\Http\Request;

class QRScanController extends Controller
{
    public function scan(Request $request)
    {
        $request->validate([
            'qr_code' => 'required|string|exists:store_qrs,qr_code'
        ]);

        $qr = StoreQR::where('qr_code', $request->qr_code)
            ->where('status', 'active')
            ->firstOrFail();

        // Record scan history
        $scan = QRScanHistory::create([
            'store_qr_id' => $qr->id,
            'user_id' => auth()->id(),
            'scanned_at' => now(),
            'notes' => $request->notes
        ]);

        return response()->json([
            'message' => 'QR Code berhasil discan',
            'data' => [
                'store' => $qr->store,
                'scan' => $scan
            ]
        ]);
    }

    public function history(StoreQR $qr)
    {
        $this->authorize('view', $qr);

        $scans = $qr->scanHistories()
            ->with('scanner')
            ->latest()
            ->paginate(10);

        return response()->json([
            'data' => $scans
        ]);
    }
} 