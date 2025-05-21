<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Store;
use App\Models\User;
use App\Models\Company;
use Spatie\Permission\Models\Role;
use Database\Seeders\RolesAndPermissionsSeeder;

class StoreTest extends TestCase
{
    use RefreshDatabase;

    private User $superAdmin;
    private User $admin;
    private User $technician;
    private User $client;
    private Company $company;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesAndPermissionsSeeder::class);
        $this->company = Company::factory()->create();
        
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

    public function test_super_admin_can_view_stores_index()
    {
        $response = $this->actingAs($this->superAdmin)->get(route('stores.index'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('stores/index'));
    }

    public function test_admin_can_view_stores_index()
    {
        $response = $this->actingAs($this->admin)->get(route('stores.index'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('stores/index'));
    }

    public function test_technician_cannot_view_stores_index()
    {
        $response = $this->actingAs($this->technician)->get(route('stores.index'));
        $response->assertStatus(403);
    }

    public function test_client_cannot_view_stores_index()
    {
        $response = $this->actingAs($this->client)->get(route('stores.index'));
        $response->assertStatus(403);
    }

    public function test_admin_can_create_store()
    {
        $response = $this->actingAs($this->admin)->get(route('stores.create'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('stores/create'));
    }

    public function test_super_admin_can_create_store()
    {
        $response = $this->actingAs($this->superAdmin)->get(route('stores.create'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('stores/create'));
    }

    public function test_technician_cannot_create_store()
    {
        $response = $this->actingAs($this->technician)->get(route('stores.create'));
        $response->assertStatus(403);
    }

    public function test_client_cannot_create_store()
    {
        $response = $this->actingAs($this->client)->get(route('stores.create'));
        $response->assertStatus(403);
    }

    public function test_admin_can_store_store()
    {
        $data = [
            'name' => 'Toko Baru',
            'address' => 'Jl. Baru',
            'phone' => '08123456789',
            'company_id' => $this->company->id,
        ];
        $response = $this->actingAs($this->admin)->post(route('stores.store'), $data);
        $response->assertRedirect(route('stores.index'));
        $this->assertDatabaseHas('stores', $data);
    }

    public function test_store_store_validasi_gagal()
    {
        $data = [
            'name' => '', // required
            'company_id' => null, // required
        ];
        $response = $this->actingAs($this->admin)->post(route('stores.store'), $data);
        $response->assertSessionHasErrors(['name', 'company_id']);
    }

    public function test_technician_cannot_store_store()
    {
        $data = [
            'name' => 'Toko Teknisi',
            'address' => 'Jl. Teknisi',
            'phone' => '08123456780',
            'company_id' => $this->company->id,
        ];
        $response = $this->actingAs($this->technician)->post(route('stores.store'), $data);
        $response->assertStatus(403);
        $this->assertDatabaseMissing('stores', ['name' => 'Toko Teknisi']);
    }

    public function test_client_cannot_store_store()
    {
        $data = [
            'name' => 'Toko Client',
            'address' => 'Jl. Client',
            'phone' => '08123456781',
            'company_id' => $this->company->id,
        ];
        $response = $this->actingAs($this->client)->post(route('stores.store'), $data);
        $response->assertStatus(403);
        $this->assertDatabaseMissing('stores', ['name' => 'Toko Client']);
    }

    public function test_admin_can_view_store_detail()
    {
        $store = Store::factory()->create([
            'name' => 'Toko Detail',
            'address' => 'Jl. Detail',
            'phone' => '08123456782',
            'company_id' => $this->company->id,
        ]);
        $response = $this->actingAs($this->admin)->get(route('stores.show', $store));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('stores/show'));
    }

    public function test_technician_can_view_store_detail()
    {
        $store = Store::factory()->create([
            'name' => 'Toko Teknisi',
            'address' => 'Jl. Teknisi',
            'phone' => '08123456783',
            'company_id' => $this->company->id,
        ]);
        $response = $this->actingAs($this->technician)->get(route('stores.show', $store));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('stores/show'));
    }

    public function test_client_can_view_own_store_detail()
    {
        $store = Store::factory()->create([
            
            'company_id' => $this->company->id, // Pastikan store terkait company si client
        ]);
        $response = $this->actingAs($this->client)->get(route('stores.show', $store));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('stores/show'));
    }

    public function test_client_cannot_view_other_company_store_detail()
    {
        $otherCompany = Company::factory()->create();
        $store = Store::factory()->create([
            'name' => 'Toko Lain',
            'address' => 'Jl. Lain',
            'phone' => '08123456785',
            'company_id' => $otherCompany->id,
        ]);
        $response = $this->actingAs($this->client)->get(route('stores.show', $store));
        $response->assertStatus(403);
    }

    public function test_admin_can_edit_store()
    {
        $store = Store::factory()->create([
            'name' => 'Toko Edit',
            'address' => 'Jl. Edit',
            'phone' => '08123456786',
            'company_id' => $this->company->id,
        ]);
        $response = $this->actingAs($this->admin)->get(route('stores.edit', $store));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('stores/edit'));
    }

    public function test_technician_cannot_edit_store()
    {
        $store = Store::factory()->create([
            'name' => 'Toko Edit',
            'address' => 'Jl. Edit',
            'phone' => '08123456787',
            'company_id' => $this->company->id,
        ]);
        $response = $this->actingAs($this->technician)->get(route('stores.edit', $store));
        $response->assertStatus(403);
    }

    public function test_admin_can_update_store()
    {
        $store = Store::factory()->create([
            'name' => 'Toko Update',
            'address' => 'Jl. Update',
            'phone' => '08123456788',
            'company_id' => $this->company->id,
        ]);
        $updateData = [
            'name' => 'Toko Updated',
            'address' => 'Jl. Updated',
            'phone' => '08123456789',
            'company_id' => $this->company->id,
        ];
        $response = $this->actingAs($this->admin)->put(route('stores.update', $store), $updateData);
        $response->assertRedirect(route('stores.index'));
        $this->assertDatabaseHas('stores', $updateData);
    }

    public function test_update_store_validasi_gagal()
    {
        $store = Store::factory()->create([
            'name' => 'Toko Update',
            'address' => 'Jl. Update',
            'phone' => '08123456788',
            'company_id' => $this->company->id,
        ]);
        $updateData = [
            'name' => '', // required
            'company_id' => null, // required
        ];
        $response = $this->actingAs($this->admin)->put(route('stores.update', $store), $updateData);
        $response->assertSessionHasErrors(['name', 'company_id']);
    }

    public function test_technician_cannot_update_store()
    {
        $store = Store::factory()->create([
            'name' => 'Toko Update',
            'address' => 'Jl. Update',
            'phone' => '08123456788',
            'company_id' => $this->company->id,
        ]);
        $updateData = [
            'name' => 'Toko Updated',
            'address' => 'Jl. Updated',
            'phone' => '08123456789',
            'company_id' => $this->company->id,
        ];
        $response = $this->actingAs($this->technician)->put(route('stores.update', $store), $updateData);
        $response->assertStatus(403);
        $this->assertDatabaseMissing('stores', ['name' => 'Toko Updated']);
    }

    public function test_admin_can_delete_store()
    {
        $store = Store::factory()->create([
            'name' => 'Toko Hapus',
            'address' => 'Jl. Hapus',
            'phone' => '08123456790',
            'company_id' => $this->company->id,
        ]);
        $response = $this->actingAs($this->admin)->delete(route('stores.destroy', $store));
        $response->assertRedirect(route('stores.index'));
        $this->assertDatabaseMissing('stores', ['id' => $store->id]);
    }

    public function test_technician_cannot_delete_store()
    {
        $store = Store::factory()->create([
            'name' => 'Toko Hapus',
            'address' => 'Jl. Hapus',
            'phone' => '08123456790',
            'company_id' => $this->company->id,
        ]);
        $response = $this->actingAs($this->technician)->delete(route('stores.destroy', $store));
        $response->assertStatus(403);
        $this->assertDatabaseHas('stores', ['id' => $store->id]);
    }

    public function test_client_cannot_delete_store()
    {
        $store = Store::factory()->create([
            'name' => 'Toko Hapus',
            'address' => 'Jl. Hapus',
            'phone' => '08123456790',
            'company_id' => $this->company->id,
        ]);
        $response = $this->actingAs($this->client)->delete(route('stores.destroy', $store));
        $response->assertStatus(403);
        $this->assertDatabaseHas('stores', ['id' => $store->id]);
    }
}
