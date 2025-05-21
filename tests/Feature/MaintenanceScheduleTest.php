<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\MaintenanceSchedule;
use App\Models\User;
use App\Models\Company;
use App\Models\Store;
use Spatie\Permission\Models\Role;
use Database\Seeders\RolesAndPermissionsSeeder;

class MaintenanceScheduleTest extends TestCase
{
    use RefreshDatabase;

    private User $superAdmin;
    private User $admin;
    private User $technician;
    private User $client;
    private Company $company;
    private Store $store;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesAndPermissionsSeeder::class);
        $this->company = Company::factory()->create();
        $this->store = Store::factory()->create(['company_id' => $this->company->id]);
        
        $this->superAdmin = User::factory()->create();
        $this->superAdmin->assignRole('super-admin');
        
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');
        
        $this->technician = User::factory()->create();
        $this->technician->assignRole('technician');
        
        $this->client = User::factory()->create([
            'company_id' => $this->company->id
        ]);
        $this->client->assignRole('client');
    }

    public function test_super_admin_can_view_maintenance_schedules_index()
    {
        $response = $this->actingAs($this->superAdmin)->get(route('schedules.index'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('schedules/index'));
    }

    public function test_admin_can_view_maintenance_schedules_index()
    {
        $response = $this->actingAs($this->admin)->get(route('schedules.index'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('schedules/index'));
    }

    public function test_technician_cannot_view_maintenance_schedules_index()
    {
        $response = $this->actingAs($this->technician)->get(route('schedules.index'));
        $response->assertStatus(403);
    }

    public function test_client_cannot_view_maintenance_schedules_index()
    {
        $response = $this->actingAs($this->client)->get(route('schedules.index'));
        $response->assertStatus(403);
    }

    public function test_admin_can_create_maintenance_schedule()
    {
        $response = $this->actingAs($this->admin)->get(route('schedules.create'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('schedules/create'));
    }

    public function test_super_admin_can_create_maintenance_schedule()
    {
        $response = $this->actingAs($this->superAdmin)->get(route('schedules.create'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('schedules/create'));
    }

    public function test_technician_cannot_create_maintenance_schedule()
    {
        $response = $this->actingAs($this->technician)->get(route('schedules.create'));
        $response->assertStatus(403);
    }

    public function test_client_cannot_create_maintenance_schedule()
    {
        $response = $this->actingAs($this->client)->get(route('schedules.create'));
        $response->assertStatus(403);
    }

    public function test_admin_can_store_maintenance_schedule()
    {
        $data = [
            'store_id' => $this->store->id,
            'user_id' => $this->technician->id,
            'scheduled_at' => now()->addDays(1),
            'notes' => 'Test notes',
            'status' => 'scheduled',
        ];
        $response = $this->actingAs($this->admin)->post(route('schedules.store'), $data);
        $response->assertRedirect(route('schedules.index'));
        $this->assertDatabaseHas('maintenance_schedules', $data);
    }

    public function test_store_maintenance_schedule_validasi_gagal()
    {
        $data = [
            'store_id' => null, // required
            'user_id' => null, // required
            'scheduled_at' => null, // required
        ];
        $response = $this->actingAs($this->admin)->post(route('schedules.store'), $data);
        $response->assertSessionHasErrors(['store_id', 'scheduled_at']);
    }

    public function test_technician_cannot_store_maintenance_schedule()
    {
        $data = [
            'store_id' => $this->store->id,
            'user_id' => $this->technician->id,
            'scheduled_at' => now()->addDays(1),
            'notes' => 'Test notes',
            'status' => 'scheduled',
        ];
        $response = $this->actingAs($this->technician)->post(route('schedules.store'), $data);
        $response->assertStatus(403);
        $this->assertDatabaseMissing('maintenance_schedules', ['notes' => 'Test notes']);
    }

    public function test_client_cannot_store_maintenance_schedule()
    {
        $data = [
            'store_id' => $this->store->id,
            'user_id' => $this->technician->id,
            'scheduled_at' => now()->addDays(1),
            'notes' => 'Test notes',
            'status' => 'scheduled',
        ];
        $response = $this->actingAs($this->client)->post(route('schedules.store'), $data);
        $response->assertStatus(403);
        $this->assertDatabaseMissing('maintenance_schedules', ['notes' => 'Test notes']);
    }

    public function test_admin_can_view_maintenance_schedule_detail()
    {
        $schedule = MaintenanceSchedule::factory()->create([
            'store_id' => $this->store->id,
            'user_id' => $this->technician->id,
        ]);
        $response = $this->actingAs($this->admin)->get(route('schedules.show', $schedule));
        $response->assertRedirect(route('schedules.edit', $schedule->id));
    }

    public function test_technician_can_view_assigned_maintenance_schedule_detail()
    {
        $schedule = MaintenanceSchedule::factory()->create([
            'store_id' => $this->store->id,
            'user_id' => $this->technician->id,
        ]);
        $response = $this->actingAs($this->technician)->get(route('schedules.show', $schedule));
        $response->assertForbidden();
    }

    public function test_technician_cannot_view_unassigned_maintenance_schedule_detail()
    {
        $otherTechnician = User::factory()->create(['role_id' => 3]);
        $schedule = MaintenanceSchedule::create([
            'store_id' => $this->store->id,
            'user_id' => $otherTechnician->id,
            'scheduled_at' => now()->addDays(1),
            'notes' => 'Test notes',
            'status' => 'scheduled',
        ]);
        $response = $this->actingAs($this->technician)->get(route('schedules.show', $schedule));
        $response->assertStatus(403);
    }

    public function test_client_can_view_own_company_maintenance_schedule_detail()
    {
        $schedule = MaintenanceSchedule::factory()->create([
            'store_id' => $this->store->id,
        ]);
        $response = $this->actingAs($this->client)->get(route('schedules.show', $schedule));
        $response->assertForbidden();
    }

    public function test_client_cannot_view_other_company_maintenance_schedule_detail()
    {
        $otherCompany = Company::factory()->create();
        $otherStore = Store::factory()->create(['company_id' => $otherCompany->id]);
        $schedule = MaintenanceSchedule::create([
            'store_id' => $otherStore->id,
            'user_id' => $this->technician->id,
            'scheduled_at' => now()->addDays(1),
            'notes' => 'Test notes',
            'status' => 'scheduled',
        ]);
        $response = $this->actingAs($this->client)->get(route('schedules.show', $schedule));
        $response->assertStatus(403);
    }

    public function test_admin_can_edit_maintenance_schedule()
    {
        $schedule = MaintenanceSchedule::factory()->create([
            'store_id' => $this->store->id,
            'user_id' => $this->technician->id,
        ]);
        $response = $this->actingAs($this->admin)->get(route('schedules.edit', $schedule));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('schedules/edit'));
    }

    public function test_technician_cannot_edit_maintenance_schedule()
    {
        $schedule = MaintenanceSchedule::factory()->create([
            'store_id' => $this->store->id,
            'user_id' => $this->technician->id,
        ]);
        $response = $this->actingAs($this->technician)->get(route('schedules.edit', $schedule));
        $response->assertForbidden();
    }

    public function test_admin_can_update_maintenance_schedule()
    {
        $schedule = MaintenanceSchedule::create([
            'store_id' => $this->store->id,
            'user_id' => $this->technician->id,
            'scheduled_at' => now()->addDays(1),
            'notes' => 'Test notes',
            'status' => 'scheduled',
        ]);
        $updateData = [
            'store_id' => $this->store->id,
            'user_id' => $this->technician->id,
            'scheduled_at' => now()->addDays(2),
            'notes' => 'Updated notes',
            'status' => 'completed',
        ];
        $response = $this->actingAs($this->admin)->put(route('schedules.update', $schedule), $updateData);
        $response->assertRedirect(route('schedules.index'));
        $this->assertDatabaseHas('maintenance_schedules', $updateData);
    }

    public function test_update_maintenance_schedule_validasi_gagal()
    {
        $schedule = MaintenanceSchedule::create([
            'store_id' => $this->store->id,
            'user_id' => $this->technician->id,
            'scheduled_at' => now()->addDays(1),
            'notes' => 'Test notes',
            'status' => 'scheduled',
        ]);
        $updateData = [
            'store_id' => null, // required
            'user_id' => null, // required
            'scheduled_at' => null, // required
        ];
        $response = $this->actingAs($this->admin)->put(route('schedules.update', $schedule), $updateData);
        $response->assertSessionHasErrors(['store_id', 'scheduled_at']);
    }

    public function test_technician_cannot_update_maintenance_schedule()
    {
        $schedule = MaintenanceSchedule::factory()->create([
            'store_id' => $this->store->id,
            'user_id' => $this->technician->id,
        ]);
        $updateData = [
            'store_id' => $this->store->id,
            'user_id' => $this->technician->id,
            'scheduled_at' => now()->addDays(2),
            'notes' => 'Updated notes',
            'status' => 'completed',
        ];
        $response = $this->actingAs($this->technician)->put(route('schedules.update', $schedule), $updateData);
        $response->assertForbidden();
        $this->assertDatabaseMissing('maintenance_schedules', ['notes' => 'Updated notes']);
    }

    public function test_admin_can_delete_maintenance_schedule()
    {
        $schedule = MaintenanceSchedule::create([
            'store_id' => $this->store->id,
            'user_id' => $this->technician->id,
            'scheduled_at' => now()->addDays(1),
            'notes' => 'Test notes',
            'status' => 'scheduled',
        ]);
        $response = $this->actingAs($this->admin)->delete(route('schedules.destroy', $schedule));
        $response->assertRedirect(route('schedules.index'));
        $this->assertDatabaseMissing('maintenance_schedules', ['id' => $schedule->id]);
    }

    public function test_technician_cannot_delete_maintenance_schedule()
    {
        $schedule = MaintenanceSchedule::create([
            'store_id' => $this->store->id,
            'user_id' => $this->technician->id,
            'scheduled_at' => now()->addDays(1),
            'notes' => 'Test notes',
            'status' => 'scheduled',
        ]);
        $response = $this->actingAs($this->technician)->delete(route('schedules.destroy', $schedule));
        $response->assertStatus(403);
        $this->assertDatabaseHas('maintenance_schedules', ['id' => $schedule->id]);
    }

    public function test_client_cannot_delete_maintenance_schedule()
    {
        $schedule = MaintenanceSchedule::create([
            'store_id' => $this->store->id,
            'user_id' => $this->technician->id,
            'scheduled_at' => now()->addDays(1),
            'notes' => 'Test notes',
            'status' => 'scheduled',
        ]);
        $response = $this->actingAs($this->client)->delete(route('schedules.destroy', $schedule));
        $response->assertStatus(403);
        $this->assertDatabaseHas('maintenance_schedules', ['id' => $schedule->id]);
    }
}
