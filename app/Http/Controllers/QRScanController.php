<?php

namespace App\Http\Controllers;

use App\Http\Requests\ScanQRRequest;
use App\Models\StoreQR;
use App\Services\QRScanService;
use App\Traits\ApiResponseTrait;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class QRScanController extends Controller
{
    use AuthorizesRequests, ApiResponseTrait;

    public function __construct(private readonly QRScanService $qrScanService) {}

    /**
     * Scan a Store QR code.
     * QRScanService uses SELECT FOR UPDATE to prevent concurrent duplicate scan entries.
     * N+1 is resolved: store is eager-loaded inside QRScanService::scan().
     */
    public function scan(ScanQRRequest $request): JsonResponse
    {
        try {
            $result = $this->qrScanService->scan(
                $request->validated('qr_code'),
                $request->user()->id,
                $request->validated('notes')
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFound('QR code not found or inactive');
        } catch (\Throwable $e) {
            return $this->error('Scan failed. Please try again.', 500);
        }

        return $this->success([
            'store' => $result['store'],
            'scan'  => $result['scan'],
        ], 'QR Code scanned successfully');
    }

    /**
     * Get scan history for a given StoreQR.
     */
    public function history(Request $request, StoreQR $qr): JsonResponse
    {
        $this->authorize('view', $qr);

        $history = $this->qrScanService->history($qr, (int) $request->query('per_page', 10));

        return $this->success($history);
    }
}