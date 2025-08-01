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

        // Generate unique QR code
        $qrCode = Str::random(32);
        $scanUrl = route('maintenance.scan', ['qr' => $qrCode]);
        
        // Create QR code
        $qrCodeObj = QrCode::create($scanUrl)
            ->setEncoding(new Encoding('UTF-8'))
            ->setErrorCorrectionLevel(new ErrorCorrectionLevelHigh())
            ->setSize(300)
            ->setMargin(10)
            ->setRoundBlockSizeMode(new RoundBlockSizeModeMargin())
            ->setForegroundColor(new Color(0, 0, 0))
            ->setBackgroundColor(new Color(255, 255, 255));

        // Create generic label
        $label = Label::create($store->name)
            ->setTextColor(new Color(0, 0, 0));

        // Create QR code with label
        $writer = new PngWriter();
        $result = $writer->write($qrCodeObj, null, $label);
            
        // Save QR code image
        $qrPath = 'qrcodes/' . $qrCode . '.png';
        Storage::put('/' . $qrPath, $result->getString());
        
        // Save QR code data
        $storeQR = StoreQR::create([
            'store_id' => $store->id,
            'qr_code' => $qrCode,
            'qr_path' => $qrPath,
            'scan_url' => $scanUrl
        ]);
        
        return response()->json([
            'message' => 'QR Code generated successfully',
            'qr_code' => $storeQR
        ]);
    }
    
    public function downloadQR(Store $store)
    {
        $this->authorize('view', $store);
        
        $storeQR = StoreQR::where('store_id', $store->id)->first();
        
        if (!$storeQR) {
            return response()->json([
                'message' => 'QR Code not found'
            ], 404);
        }
        
        return Storage::download('public/' . $storeQR->qr_path);
    }

    public function index()
    {
        $this->authorize('viewAny', StoreQR::class);
        
        $qrs = StoreQR::with(['store'])
            ->latest()
            ->paginate(10);
            
        return Inertia::render('stores/qrcodes/index', [
            'qrs' => $qrs
        ]);
    }
    
    public function storeQRCodes(Store $store)
    {
        $this->authorize('view', $store);
        
        $qrs = $store->qrCodes()
            ->latest()
            ->get();
            
        return response()->json([
            'data' => $qrs
        ]);
    }
    
    public function generate(Store $store)
    {
        // ... existing code ...
    }
} 