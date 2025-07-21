<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\StoreQR;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class StoreQRController extends Controller
{
    use AuthorizesRequests;
    
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
}