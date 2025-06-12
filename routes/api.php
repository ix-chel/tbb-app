<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QRScanController;
use App\Http\Controllers\StoreQRController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    // QR Code Routes
    Route::prefix('qrcode')->group(function () {
        Route::post('scan', [QRScanController::class, 'scan']);
        Route::get('{qr}/history', [QRScanController::class, 'history']);
    });

    // Store QR Routes
    Route::prefix('stores')->group(function () {
        Route::get('{store}/qrcodes', [StoreQRController::class, 'storeQRCodes']);
        Route::post('{store}/qrcode/generate', [StoreQRController::class, 'generate']);
        Route::get('qrcode/{qr}', [StoreQRController::class, 'show']);
        Route::get('qrcode/{qr}/download', [StoreQRController::class, 'download']);
        Route::patch('qrcode/{qr}/toggle-status', [StoreQRController::class, 'toggleStatus']);
    });
});
