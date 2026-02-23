<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\StoreQR;
use App\Traits\ApiResponseTrait;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
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
    use AuthorizesRequests, ApiResponseTrait;

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
    
    public function storeQRCodes(Store $store): JsonResponse
    {
        $this->authorize('view', $store);
        
        $qrs = $store->qrCodes()
            ->latest()
            ->get();
            
        return response()->json([
            'data' => $qrs
        ]);
    }
    
    public function generate(Store $store): JsonResponse
    {
        $this->authorize('generate', [StoreQR::class, $store]);

        $qrCode  = Str::random(32);
        $scanUrl = url('/scan/' . $qrCode);
        $qrPath  = 'qrcodes/' . $qrCode . '.png';

        $qrCodeObj = new QrCode(
            data: $scanUrl,
            errorCorrectionLevel: \Endroid\QrCode\ErrorCorrectionLevel::High,
        );

        $label  = new Label(text: $store->name);
        $writer = new PngWriter();
        $result = $writer->write($qrCodeObj, null, $label);

        Storage::put($qrPath, $result->getString());

        $storeQR = StoreQR::create([
            'store_id'     => $store->id,
            'qr_code'      => $qrCode,
            'qr_path'      => $qrPath,
            'scan_url'     => $scanUrl,
            'generated_by' => auth()->id(),
            'status'       => 'active',
        ]);

        return $this->created($storeQR, 'QR Code generated successfully');
    }

    public function show(StoreQR $qr): JsonResponse
    {
        $this->authorize('view', $qr);

        return $this->success($qr->load('store'));
    }

    public function download(StoreQR $qr)
    {
        $this->authorize('download', $qr);

        if (!Storage::exists($qr->qr_path)) {
            return $this->notFound('QR code file not found');
        }

        return Storage::download($qr->qr_path, $qr->qr_code . '.png');
    }

    public function toggleStatus(StoreQR $qr): JsonResponse
    {
        $this->authorize('update', $qr);

        if ($qr->status === 'active') {
            $qr->deactivate();
        } else {
            $qr->activate();
        }

        return $this->success($qr->fresh(), 'QR code status updated');
    }
}
 