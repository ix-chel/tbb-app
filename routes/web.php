<?php

// File: routes/web.php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

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
use App\Http\Controllers\StoreQRController;
use App\Http\Controllers\MaintenanceController;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('welcome');
})->name('home');


// Authenticated & verified users
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', function () {
        $user = auth()->user();
        \Log::info('User roles:', $user->getRoleNames()->toArray());
        \Log::info('User permissions:', $user->getAllPermissions()->pluck('name')->toArray());
        return Inertia::render('dashboard');
    })->name('dashboard');

    // ── Super-admin & Admin ─────────────────────────────────────────────────
    Route::middleware(['role:super-admin|admin'])->group(function () {
        // Companies & Users
        Route::resource('companies', CompanyController::class);
        Route::resource('users', UserController::class);

        // Stores: full CRUD for admins; 'show' is exposed below for clients too
        Route::resource('stores', StoreController::class)->except(['show']);

        // Store QR Codes
        Route::get('/stores/qrcodes', [StoreQRController::class, 'index'])->name('stores.qrcodes.index');
        Route::get('/stores/{store}/qrcodes', function ($store) {
            return Inertia::render('admin/stores/[id]/qr-codes', ['storeId' => $store]);
        })->name('stores.qrcodes.store');

        // Filter QR
        Route::get('/FilterQR', [FilterQRController::class, 'index'])->name('FilterQR.index');
        Route::get('/FilterQR/create', [FilterQRController::class, 'create'])->name('FilterQR.create');
        Route::post('/FilterQR', [FilterQRController::class, 'store'])->name('FilterQR.store');
        Route::get('/FilterQR/{filterQR}', [FilterQRController::class, 'show'])->name('FilterQR.show');
        Route::get('/FilterQR/{filterQR}/edit', [FilterQRController::class, 'edit'])->name('FilterQR.edit');
        Route::put('/FilterQR/{filterQR}', [FilterQRController::class, 'update'])->name('FilterQR.update');
        Route::delete('/FilterQR/{filterQR}', [FilterQRController::class, 'destroy'])->name('FilterQR.destroy');
        Route::get('/FilterQR/{filterQR}/download', [FilterQRController::class, 'download'])->name('FilterQR.download');

        // Maintenance Reports
        Route::get('/maintenancereport', [MaintenanceController::class, 'index'])->name('maintenance.index');
        Route::get('/maintenancereport/create', [MaintenanceController::class, 'create'])->name('maintenance.create');
        Route::post('/maintenancereport', [MaintenanceController::class, 'store'])->name('maintenance.store');
        Route::get('/maintenancereport/{maintenanceReport}', [MaintenanceController::class, 'show'])->name('maintenance.show');
        Route::delete('/maintenancereport/{maintenanceReport}', [MaintenanceController::class, 'destroy'])->name('maintenance.destroy');
        Route::post('/maintenancereport/{maintenanceReport}/approve', [MaintenanceController::class, 'approve'])->name('maintenance.approve');
        Route::post('/maintenancereport/{maintenanceReport}/revision', [MaintenanceController::class, 'requestRevision'])->name('maintenance.revision');
    });

    // ── Store detail — also accessible to authenticated clients ─────────────
    // StorePolicy::view() checks company ownership for the 'client' role.
    Route::get('/stores/{store}', [StoreController::class, 'show'])->name('stores.show');

    // ── Technician accessible ───────────────────────────────────────────────
    Route::middleware(['role:super-admin|admin|technician'])->group(function () {
        Route::resource('schedules', MaintenanceScheduleController::class);
        Route::resource('inventory', InventoryItemController::class);
        Route::post('/FilterQR/scan', [FilterQRController::class, 'scan'])->name('FilterQR.scan');
        Route::post('/stores/{store}/maintenancereports', [MaintenanceController::class, 'store'])->name('maintenance.store.by.store');
    });

    // ── All authenticated users ─────────────────────────────────────────────
    Route::resource('feedback', FeedbackController::class);

});

require __DIR__ . '/auth.php';

if (file_exists(__DIR__ . '/settings.php')) {
    require __DIR__ . '/settings.php';
}
