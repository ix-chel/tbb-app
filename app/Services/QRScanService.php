<?php

namespace App\Services;

use App\Models\QRScanHistory;
use App\Models\StoreQR;
use App\Traits\LogsActivity;
use Illuminate\Support\Facades\DB;

class QRScanService
{
    use LogsActivity;

    /**
     * Process a QR code scan atomically.
     *
     * Uses SELECT FOR UPDATE to prevent concurrent scans from racing, which could
     * result in duplicate history entries or inconsistent last_scan_at timestamps.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException when QR not found or inactive
     */
    public function scan(string $qrCode, int $userId, ?string $notes = null): array
    {
        return DB::transaction(function () use ($qrCode, $userId, $notes) {
            /** @var StoreQR $qr */
            $qr = StoreQR::where('qr_code', $qrCode)
                ->where('status', 'active')
                ->lockForUpdate()   // Prevents race condition on concurrent scans
                ->firstOrFail();

            $scan = QRScanHistory::create([
                'store_qr_id' => $qr->id,
                'user_id'     => $userId,
                'scanned_at'  => now(),
                'notes'       => $notes,
            ]);

            $this->logActivity('qr.scanned', [
                'store_qr_id' => $qr->id,
                'qr_code'     => $qrCode,
                'scan_id'     => $scan->id,
            ]);

            return [
                'store' => $qr->load('store')->store,
                'scan'  => $scan,
            ];
        });
    }

    public function history(StoreQR $qr, int $perPage = 10)
    {
        return $qr->scanHistories()
            ->with('scanner:id,name')
            ->latest('scanned_at')
            ->paginate($perPage);
    }
}
