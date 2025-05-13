<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create roles
        $superAdmin = Role::create(['name' => 'super-admin']);
        $admin = Role::create(['name' => 'admin']);
        $technician = Role::create(['name' => 'technician']);
        $client = Role::create(['name' => 'client']);

        // Company permissions
        $viewCompanies = Permission::create(['name' => 'view companies']);
        $createCompany = Permission::create(['name' => 'create company']);
        $updateCompany = Permission::create(['name' => 'update company']);
        $deleteCompany = Permission::create(['name' => 'delete company']);

        // Store permissions
        $viewStores = Permission::create(['name' => 'view stores']);
        $createStore = Permission::create(['name' => 'create store']);
        $updateStore = Permission::create(['name' => 'update store']);
        $deleteStore = Permission::create(['name' => 'delete store']);

        // Inventory permissions
        $viewInventory = Permission::create(['name' => 'view inventory']);
        $createInventory = Permission::create(['name' => 'create inventory']);
        $updateInventory = Permission::create(['name' => 'update inventory']);
        $deleteInventory = Permission::create(['name' => 'delete inventory']);

        // Maintenance Schedule permissions
        $viewSchedules = Permission::create(['name' => 'view schedules']);
        $createSchedule = Permission::create(['name' => 'create schedule']);
        $updateSchedule = Permission::create(['name' => 'update schedule']);
        $deleteSchedule = Permission::create(['name' => 'delete schedule']);

        // Feedback permissions
        $viewFeedback = Permission::create(['name' => 'view feedback']);
        $createFeedback = Permission::create(['name' => 'create feedback']);
        $updateFeedback = Permission::create(['name' => 'update feedback']);
        $deleteFeedback = Permission::create(['name' => 'delete feedback']);

        // Assign permissions to roles

        // Super Admin gets all permissions
        $superAdmin->givePermissionTo(Permission::all());

        // Admin permissions
        $admin->givePermissionTo([
            $viewCompanies, $createCompany, $updateCompany,
            $viewStores, $createStore, $updateStore, $deleteStore,
            $viewInventory, $createInventory, $updateInventory, $deleteInventory,
            $viewSchedules, $createSchedule, $updateSchedule, $deleteSchedule,
            $viewFeedback, $createFeedback, $updateFeedback, $deleteFeedback
        ]);

        // technician permissions
        $technician->givePermissionTo([
            $viewStores,
            $viewInventory,
            $viewSchedules, $updateSchedule,
            $viewFeedback, $createFeedback
        ]);

        // Client permissions
        $client->givePermissionTo([
            $viewStores,
            $viewSchedules,
            $viewFeedback, $createFeedback, $updateFeedback, $deleteFeedback
        ]);
    }
}
