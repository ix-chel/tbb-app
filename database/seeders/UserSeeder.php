<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil role super-admin yang sudah dibuat oleh RolesAndPermissionsSeeder
        $superAdminRole = Role::where('name', 'super-admin')->first();

        if (!$superAdminRole) {
            $this->command->error('Role super-admin tidak ditemukan. Pastikan RolesAndPermissionsSeeder dijalankan terlebih dahulu.');
            return;
        }

        // Buat user super admin
        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'password' => Hash::make('superadmin123'),
            'email_verified_at' => now(),
        ]);

        // Assign role super-admin ke user
        $superAdmin->assignRole($superAdminRole);
    }
} 