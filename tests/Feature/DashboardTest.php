<?php

namespace Tests\Feature;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesAndPermissionsSeeder::class);
    }

    public function test_guests_are_redirected_to_the_login_page()
    {
        $this->get('/dashboard')->assertRedirect('/login');
    }

    public function test_super_admin_can_access_dashboard()
    {
        $user = User::factory()->create();
        $user->assignRole('super-admin');

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('dashboard')
                ->has('auth.user')
                ->where('auth.role_name', 'super-admin')
                ->has('menus')
            );
    }

    public function test_admin_can_access_dashboard()
    {
        $user = User::factory()->create();
        $user->assignRole('admin');

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('dashboard')
                ->has('auth.user')
                ->has('auth.role_name')
                ->where('auth.role_name', 'admin')
                ->has('menus')
            );
    }

    public function test_technician_can_access_dashboard()
    {
        $user = User::factory()->create();
        $user->assignRole('technician');

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('dashboard')
                ->has('auth.user')
                ->has('auth.role_name')
                ->where('auth.role_name', 'technician')
                ->has('menus', 4) // Should have limited menu items based on permissions
            );
    }

    public function test_client_can_access_dashboard()
    {
        $user = User::factory()->create();
        $user->assignRole('client');

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('dashboard')
                ->has('auth.user')
                ->has('auth.role_name')
                ->where('auth.role_name', 'client')
                ->has('menus', 2) // Should have very limited menu items
            );
    }

    public function test_menu_items_are_filtered_based_on_permissions()
    {
        $superAdmin = User::factory()->create();
        $superAdmin->assignRole('super-admin');

        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $technician = User::factory()->create();
        $technician->assignRole('technician');

        $client = User::factory()->create();
        $client->assignRole('client');

        // Super Admin should see all menu items (6: Dashboard, Companies, Stores, Inventory, Maintenance, Feedback)
        $this->actingAs($superAdmin)
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('menus', 5)
            );

        // Admin should see most menu items (5: Dashboard, Companies, Stores, Inventory, Feedback)
        $this->actingAs($admin)
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('menus', 4)
            );

        // Technician should see limited menu items (4: Dashboard, Stores, Maintenance, Feedback)
        $this->actingAs($technician)
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('menus', 3)
            );

        // Client should see very limited menu items (3: Dashboard, Maintenance, Feedback)
        $this->actingAs($client)
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('menus', 2)
            );
    }
}
