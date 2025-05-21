<?php

// File: routes/web.php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia; // Pastikan Inertia di-import jika digunakan secara langsung
use Illuminate\Support\Facades\Auth; // Import Auth facade

// Import Controllers Anda
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\MaintenanceScheduleController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\InventoryItemController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\AuthController;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Http\Controllers\FilterQRController;



// use App\Http\Controllers\DashboardController; // Uncomment jika Anda punya DashboardController

Route::get('/', function () {
    // Jika pengguna sudah login, mungkin arahkan ke dashboard
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    // Jika belum, tampilkan halaman welcome
    return Inertia::render('welcome'); // Asumsi Anda menggunakan Inertia
})->name('home');


// Grup rute yang memerlukan pengguna untuk login dan terverifikasi (jika menggunakan verifikasi email)
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', function () {
        // Debug information
        $user = auth()->user();
        \Log::info('User roles:', $user->getRoleNames()->toArray());
        \Log::info('User permissions:', $user->getAllPermissions()->pluck('name')->toArray());
        
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Rute untuk super-admin
    Route::middleware(['role:super-admin'])->group(function () {
        Route::resource('companies', CompanyController::class);
        Route::resource('stores', StoreController::class);
        Route::resource('feedback', FeedbackController::class);
    });

    // Rute untuk super-admin dan Admin
    Route::middleware(['role:super-admin|admin'])->group(function () {
        Route::resource('companies', CompanyController::class);
        Route::resource('stores', StoreController::class);
        Route::resource('users', UserController::class);
        
        // QR Code Routes
        Route::get('/filter-qr', [FilterQRController::class, 'index'])->name('filter-qr.index');
        Route::get('/filter-qr/create', [FilterQRController::class, 'create'])->name('filter-qr.create');
        Route::post('/filter-qr', [FilterQRController::class, 'store'])->name('filter-qr.store');
        Route::get('/filter-qr/{filterQR}', [FilterQRController::class, 'show'])->name('filter-qr.show');
        Route::put('/filter-qr/{filterQR}', [FilterQRController::class, 'update'])->name('filter-qr.update');
        Route::delete('/filter-qr/{filterQR}', [FilterQRController::class, 'destroy'])->name('filter-qr.destroy');
    });

    // Rute untuk maintenance schedule (super-admin, admin, dan technician)
    Route::middleware(['role:super-admin|admin|technician'])->group(function () {
        Route::resource('schedules', MaintenanceScheduleController::class);
        Route::post('/filter-qr/scan', [FilterQRController::class, 'scan'])->name('filter-qr.scan');
    });

    // Rute untuk super-admin, admin, dan technician
    Route::middleware(['role:super-admin|admin|technician'])->group(function () {
        Route::resource('inventory', InventoryItemController::class);
    });

    // Rute untuk semua role yang sudah login
    Route::middleware(['auth'])->group(function () {
        Route::resource('feedback', FeedbackController::class);
    });
});

// Memuat file rute autentikasi (login, register, dll.)
// Pastikan path ini benar dan file auth.php berisi definisi rute untuk AuthenticatedSessionController, dll.
require __DIR__.'/auth.php';

// Memuat file rute settings jika ada
if (file_exists(__DIR__.'/settings.php')) {
    require __DIR__.'/settings.php';
}

