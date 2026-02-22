<?php

namespace App\Services;

use App\Models\FilterQR;
use App\Models\InventoryItem;
use App\Models\Store;
use App\Traits\LogsActivity;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Color\Color;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Label\Font\OpenSans;
use Endroid\QrCode\Label\LabelAlignment;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Writer\PngWriter;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FilterQRService
{
    use LogsActivity;

    public function index(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return FilterQR::with(['store', 'filter'])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where('qr_code', 'like', "%{$search}%")
                    ->orWhereHas('store', fn($q) => $q->where('name', 'like', "%{$search}%"));
            })
            ->when($filters['status'] ?? null, fn($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Create a new FilterQR record together with its QR code image.
     * Wrapped in a DB transaction — if file storage fails the DB row is rolled back.
     *
     * @throws \RuntimeException|\Throwable
     */
    public function create(array $data): FilterQR
    {
        return DB::transaction(function () use ($data) {
            $qrCode = Str::uuid()->toString();

            Storage::makeDirectory('qrcodes');

            $result = Builder::create()
                ->writer(new PngWriter())
                ->writerOptions([])
                ->validateResult(false)
                ->data($qrCode)
                ->encoding(new Encoding('ISO-8859-1'))
                ->errorCorrectionLevel(ErrorCorrectionLevel::High)
                ->size(300)
                ->margin(10)
                ->roundBlockSizeMode(RoundBlockSizeMode::Margin)
                ->foregroundColor(new Color(0, 0, 0))
                ->backgroundColor(new Color(255, 255, 255))
                ->labelText('Filter QR Code')
                ->labelFont(new OpenSans(20))
                ->labelAlignment(LabelAlignment::Center)
                ->build();

            $filterQR = FilterQR::create(array_merge($data, [
                'qr_code' => $qrCode,
                'status'  => 'active',
            ]));

            $path = "qrcodes/{$filterQR->id}.png";

            if (!Storage::put($path, $result->getString())) {
                // Throwing inside a DB::transaction causes automatic rollback
                throw new \RuntimeException("Failed to save QR code image to storage path: {$path}");
            }

            $this->logActivity('filter_qr.created', [
                'filter_qr_id' => $filterQR->id,
                'store_id'     => $filterQR->store_id,
            ]);

            return $filterQR;
        });
    }

    /**
     * Record a QR scan — uses a SELECT FOR UPDATE lock to prevent concurrent duplicate scans.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function scan(string $qrCode): FilterQR
    {
        return DB::transaction(function () use ($qrCode) {
            /** @var FilterQR $filterQR */
            $filterQR = FilterQR::where('qr_code', $qrCode)
                ->lockForUpdate()   // Prevents race condition on concurrent scans
                ->firstOrFail();

            $filterQR->update(['last_scan_at' => now()]);

            $this->logActivity('filter_qr.scanned', [
                'filter_qr_id' => $filterQR->id,
                'qr_code'      => $qrCode,
            ]);

            return $filterQR->load(['store', 'filter']);
        });
    }

    public function update(FilterQR $filterQR, array $data): FilterQR
    {
        $filterQR->update($data);

        $this->logActivity('filter_qr.updated', ['filter_qr_id' => $filterQR->id]);

        return $filterQR->fresh(['store', 'filter']);
    }

    public function destroy(FilterQR $filterQR): void
    {
        $this->logActivity('filter_qr.deleted', ['filter_qr_id' => $filterQR->id]);

        Storage::delete("qrcodes/{$filterQR->id}.png");
        // Also clean up legacy path variant that old code used
        Storage::delete("public/qrcodes/{$filterQR->id}.png");

        $filterQR->delete();
    }

    public function download(FilterQR $filterQR): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $path = "qrcodes/{$filterQR->id}.png";

        if (!Storage::exists($path)) {
            abort(404, 'QR code file not found');
        }

        return Storage::download($path, "filter-qr-{$filterQR->id}.png");
    }
}
