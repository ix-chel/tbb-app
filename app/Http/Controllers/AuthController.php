<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;


class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'device_name' => 'required', // Nama perangkat untuk token (mis. 'mobile_app')
        ]);
    
        $user = User::where('email', $request->email)->first();
    
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Kredensial tidak valid'], 401);
        }
    
        // Ambil peran pengguna (contoh jika menggunakan spatie/laravel-permission)
        $roles = $user->getRoleNames(); // Array berisi nama peran
        if ($roles->isEmpty()) {
             return response()->json(['message' => 'Pengguna tidak memiliki peran yang ditetapkan'], 403);
        }
    
        // Anda bisa membuat token dengan "abilities" berdasarkan peran
        // Ini penting untuk membedakan akses di API
        // Contoh: 'role:Teknisi', 'role:Client'
        $tokenAbilities = $roles->map(function ($role) {
            return 'role:' . $role;
        })->toArray();
    
        $token = $user->createToken($request->device_name, $tokenAbilities)->plainTextToken;
    
        return response()->json([
            'token' => $token,
            'user' => $user, // Anda bisa mengirim data pengguna jika perlu
            'roles' => $roles
        ]);
    }
}
