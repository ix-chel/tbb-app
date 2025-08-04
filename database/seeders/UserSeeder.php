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

        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('admin123'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole($adminRole);

        $technicianRole = Role::where('name', 'technician')->first();
        $technician = User::create([
            'name' => 'Technician',
            'email' => 'technician@example.com',
            'password' => Hash::make('technician123'),
            'email_verified_at' => now(),
        ]);
        $technician->assignRole($technicianRole);

        $clientRole = Role::where('name', 'client')->first();
        $client = User::create([
            'name' => 'Client',
            'email' => 'client@example.com',
            'password' => Hash::make('client123'),
            'email_verified_at' => now(),
        ]);
        $client->assignRole($clientRole);
    }
} 