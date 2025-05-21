<?php

// Buat middleware ini dengan perintah: php artisan make:middleware CheckRole
// File: app/Http/Middleware/CheckRole.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles Nama-nama peran yang diizinkan untuk mengakses rute.
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // 1. Pastikan pengguna sudah login
        if (!Auth::check()) {
            // Jika belum login, arahkan ke halaman login
            return redirect()->route('login');
        }

        // 2. Dapatkan pengguna yang sedang terautentikasi
        $user = Auth::user();

        // 3. Eager load relasi 'role' untuk efisiensi jika belum di-load
        // Ini membantu menghindari query tambahan jika 'role' diakses berulang kali.
        if (!$user->relationLoaded('role')) {
            $user->load('role');
        }

        // 4. Periksa apakah user memiliki salah satu role yang diizinkan
        if ($user->hasAnyRole($roles)) {
            // Jika pengguna memiliki salah satu peran yang diizinkan, lanjutkan permintaan
            return $next($request);
        }

        // 5. Jika pengguna tidak memiliki peran yang sesuai, kirim respons 403 Forbidden.
        //    Anda bisa mengarahkan ke halaman error kustom atau menampilkan pesan.
        abort(403, 'AKSES DITOLAK. Anda tidak memiliki izin untuk mengakses halaman ini.');
    }
}
