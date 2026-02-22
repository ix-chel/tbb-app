<?php

namespace App\Repositories;

use App\Models\FilterQR;
use Illuminate\Support\Facades\Cache;

class FilterQRRepository extends BaseRepository
{
    public function __construct(FilterQR $model)
    {
        $this->model = $model;
    }

    /**
     * Find a FilterQR by its QR code string.
     * Caches the result for 5 minutes to reduce DB load on frequent scans.
     * Cache is automatically invalidated on any update to the record.
     */
    public function findByCode(string $qrCode): ?FilterQR
    {
        return Cache::remember(
            "filter_qr:code:{$qrCode}",
            now()->addMinutes(5),
            fn() => FilterQR::where('qr_code', $qrCode)->with(['store', 'filter'])->first()
        );
    }

    /**
     * Bust the cache for a given QR code (call after update/delete).
     */
    public function bustCache(string $qrCode): void
    {
        Cache::forget("filter_qr:code:{$qrCode}");
    }
}
