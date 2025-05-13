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
        $user = Auth::user()->load('roles'); // Eager load role untuk akses di komponen
        // Anda bisa meneruskan data pengguna dan perannya ke komponen Inertia
        // Untuk logika tampilan dashboard yang berbeda berdasarkan peran,
        // biasanya lebih baik ditangani di sisi frontend (komponen Inertia)
        // atau dengan mengembalikan komponen Inertia yang berbeda dari sini.
        return Inertia::render('dashboard', [
            'auth' => [
                'user' => $user,
                'role_name' => $user->role ? $user->role->name : null,
            ]
        ]);
    })->name('dashboard');

    // Rute untuk super-admin
    Route::middleware(['role:super-admin'])->group(function () {
        Route::resource('companies', CompanyController::class);
        Route::resource('schedules', MaintenanceScheduleController::class);
        Route::resource('stores', StoreController::class);
        Route::resource('inventory', InventoryItemController::class);
        Route::resource('feedback', FeedbackController::class);

    });

    // Rute untuk super-admin dan Admin
    Route::middleware(['role:super-admin|admin'])->group(function () {
        Route::resource('stores', StoreController::class);
        Route::resource('inventory', InventoryItemController::class);
    });

    // Rute untuk technician
    Route::middleware(['role:technician'])->group(function () {
        Route::resource('maintenance', MaintenanceScheduleController::class);
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

