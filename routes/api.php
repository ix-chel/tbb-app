<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QRScanController;
use App\Http\Controllers\StoreQRController;
use App\Http\Controllers\FilterQRController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StoreController;

// Authentication Routes
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('register', [AuthController::class, 'register']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    // QR Code Routes
    Route::prefix('qrcode')->group(function () {
        Route::post('scan', [FilterQRController::class, 'scan']);
        Route::get('{qr}', [FilterQRController::class, 'show']);
        Route::get('{qr}/history', [QRScanController::class, 'history']);
        Route::post('{qr}/validate', [FilterQRController::class, 'validate']);
        Route::get('/', [FilterQRController::class, 'index']);
    });

    // Store QR Routes
    Route::prefix('stores')->group(function () {
        Route::get('/', [StoreController::class, 'index']);
        Route::get('{store}', [StoreController::class, 'show']);
        Route::get('{store}/qrcodes', [StoreQRController::class, 'storeQRCodes']);
        Route::post('{store}/qrcodes', [StoreQRController::class, 'store']);
        Route::get('qrcode/{qr}', [StoreQRController::class, 'show']);
        Route::put('qrcode/{qr}', [StoreQRController::class, 'update']);
        Route::delete('qrcode/{qr}', [StoreQRController::class, 'destroy']);
        Route::get('qrcode/{qr}/download', [StoreQRController::class, 'downloadQR']);
        Route::post('qrcode/{qr}/regenerate', [StoreQRController::class, 'regenerate']);
    });

    // User Management Routes
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::get('{user}', [UserController::class, 'show']);
        Route::put('{user}', [UserController::class, 'update']);
        Route::get('profile', [UserController::class, 'profile']);
        Route::put('profile', [UserController::class, 'updateProfile']);
        Route::put('password', [UserController::class, 'updatePassword']);
    });
});
