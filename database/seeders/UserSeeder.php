<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User; // Impor model User
use Spatie\Permission\Models\Role;  // Impor model Role
use Illuminate\Support\Facades\Hash; // Impor Hash untuk password
use Illuminate\Support\Facades\DB;   // Optional

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Optional: Nonaktifkan foreign key check
        // DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Hapus data user lama (opsional, hati-hati)
        // User::truncate();

        $roleSuperAdmin = Role::firstOrCreate(['name' => 'super-admin']);
        $roleAdmin = Role::firstOrCreate(['name' => 'admin']);
        $roleTechnician = Role::firstOrCreate(['name' => 'technician']);


        // Buat user super-admin
        $superAdmin = User::create([
            'name' => 'Super Admin TBB',
            'email' => 'superadmin@example.com',
            'password' => Hash::make('superadmin123'),
            'email_verified_at' => now(),
        ]);

        // Assign role ke user
        $superAdmin->assignRole($roleSuperAdmin);

        
        // Buat user Admin
        $admin = User::create([
            'name' => 'Admin TBB',
            'email' => 'admin@example.com',
            'password' => Hash::make('admin123'),
            'email_verified_at' => now(),
        ]);

        $admin->assignRole($roleAdmin);


        User::factory()->count(5)->create()->each(function ($user) use ($roleTechnician) {
                 $user->assignRole($roleTechnician);
        });

        // Assign role ke user

        $this->command->info('Users created and roles assigned successfully!');

        // Optional: Aktifkan kembali foreign key check
        // DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}