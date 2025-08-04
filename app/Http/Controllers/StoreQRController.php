<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\StoreQR;
use Illuminate\Http\Request;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Color\Color;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel\ErrorCorrectionLevelHigh;
use Endroid\QrCode\RoundBlockSizeMode\RoundBlockSizeModeMargin;
use Endroid\QrCode\Label\Label;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class StoreQRController extends Controller
{
    public function generateQR(Store $store)
    {
        $this->authorize('view', $store);

        // Buat kode QR unik
        $qrCodeValue = Str::uuid()->toString(); // lebih aman daripada random string
        $scanUrl = route('maintenance.scan', ['qr' => $qrCodeValue]);

        // Generate QR code image
        $qrCodeObj = QrCode::create($scanUrl)
            ->setEncoding(new Encoding('UTF-8'))
            ->setErrorCorrectionLevel(new ErrorCorrectionLevelHigh())
            ->setSize(300)
            ->setMargin(10)
            ->setRoundBlockSizeMode(new RoundBlockSizeModeMargin())
            ->setForegroundColor(new Color(0, 0, 0))
            ->setBackgroundColor(new Color(255, 255, 255));

        $label = Label::create($store->name)->setTextColor(new Color(0, 0, 0));
        $writer = new PngWriter();
        $result = $writer->write($qrCodeObj, null, $label);

        // Simpan gambar QR di storage
        $qrPath = 'qrcodes/' . $qrCodeValue . '.png';
        Storage::put($qrPath, $result->getString());

        // Simpan data ke DB
        $storeQR = StoreQR::create([
            'store_id' => $store->id,
            'qr_code' => $qrCodeValue,
            'qr_path' => $qrPath,
            'scan_url' => $scanUrl,
            'status' => 'active'
        ]);

        return response()->json([
            'message' => 'QR Code berhasil dibuat.',
            'qr_code' => $storeQR
        ]);
    }

    public function download($qrId)
    {
        $storeQR = StoreQR::findOrFail($qrId);

        if (!Storage::exists($storeQR->qr_path)) {
            abort(404, 'QR image tidak ditemukan di storage.');
        }

        return response()->download(
            storage_path('app/' . $storeQR->qr_path),
            'qr-code-' . $storeQR->store->id . '.png',
            ['Content-Type' => 'image/png']
        );
    }

    public function index()
    {
        $this->authorize('viewAny', StoreQR::class);

        $qrs = StoreQR::with('store')->latest()->paginate(10);

        return Inertia::render('stores/qrcodes/index', [
            'qrs' => $qrs
        ]);
    }

    public function storeQRCodes(Store $store)
    {
        $this->authorize('view', $store);

        $qrs = $store->qrCodes()->latest()->get();

        return response()->json([
            'data' => $qrs
        ]);
    }

    // opsional: jika route generate belum dipakai
    public function generate(Store $store)
    {
        return $this->generateQR($store);
    }
}
