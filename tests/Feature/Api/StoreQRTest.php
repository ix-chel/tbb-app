<?php

namespace Tests\Feature\Api;

use App\Models\Company;
use App\Models\Store;
use App\Models\StoreQR;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class StoreQRTest extends TestCase
{
    use RefreshDatabase;

    private User $superAdmin;
    private User $admin;
    private User $technician;
    private User $client;
    private Company $company;
    private Store $store;
    private StoreQR $storeQR;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);

        $this->company = Company::factory()->create();

        $this->superAdmin = User::factory()->create(['company_id' => $this->company->id]);
        $this->superAdmin->assignRole('super-admin');

        $this->admin = User::factory()->create(['company_id' => $this->company->id]);
        $this->admin->assignRole('admin');

        $this->technician = User::factory()->create(['company_id' => $this->company->id]);
        $this->technician->assignRole('technician');

        $this->client = User::factory()->create(['company_id' => $this->company->id]);
        $this->client->assignRole('client');

        $this->store = Store::factory()->create(['company_id' => $this->company->id]);

        $this->storeQR = StoreQR::factory()->create([
            'store_id'     => $this->store->id,
            'generated_by' => $this->admin->id,
            'status'       => 'active',
        ]);
    }

    // --- GET /api/stores/{store}/qrcodes ---

    public function test_unauthenticated_cannot_list_store_qrcodes(): void
    {
        $response = $this->getJson("/api/stores/{$this->store->id}/qrcodes");

        $response->assertStatus(401);
    }

    public function test_authorized_user_can_list_qrcodes_for_a_store(): void
    {
        Sanctum::actingAs($this->admin, ['*']);

        $response = $this->getJson("/api/stores/{$this->store->id}/qrcodes");

        $response->assertStatus(200)
                 ->assertJsonStructure(['data']);
    }

    public function test_unauthorized_user_cannot_list_qrcodes_for_another_companys_store(): void
    {
        $otherCompany = Company::factory()->create();
        $otherClient  = User::factory()->create(['company_id' => $otherCompany->id]);
        $otherClient->assignRole('client');

        Sanctum::actingAs($otherClient, ['*']);

        $response = $this->getJson("/api/stores/{$this->store->id}/qrcodes");

        $response->assertStatus(403);
    }

    // --- POST /api/stores/{store}/qrcode/generate ---

    public function test_unauthenticated_cannot_generate_qr(): void
    {
        $response = $this->postJson("/api/stores/{$this->store->id}/qrcode/generate");

        $response->assertStatus(401);
    }

    public function test_admin_can_generate_qr_for_store(): void
    {
        Storage::fake();

        $verifiedStore = Store::factory()->create([
            'company_id' => $this->company->id,
            'status'     => 'verified',
        ]);

        Sanctum::actingAs($this->admin, ['*']);

        $response = $this->postJson("/api/stores/{$verifiedStore->id}/qrcode/generate");

        $response->assertStatus(201)
                 ->assertJsonPath('success', true);
    }

    public function test_generate_creates_store_qr_record(): void
    {
        Storage::fake();

        $verifiedStore = Store::factory()->create([
            'company_id' => $this->company->id,
            'status'     => 'verified',
        ]);

        Sanctum::actingAs($this->admin, ['*']);

        $this->postJson("/api/stores/{$verifiedStore->id}/qrcode/generate");

        $this->assertDatabaseHas('store_qrs', [
            'store_id' => $verifiedStore->id,
        ]);
    }

    // --- GET /api/stores/qrcode/{qr} ---

    public function test_unauthenticated_cannot_show_qr(): void
    {
        $response = $this->getJson("/api/stores/qrcode/{$this->storeQR->id}");

        $response->assertStatus(401);
    }

    public function test_authorized_user_can_show_qr_details(): void
    {
        Sanctum::actingAs($this->admin, ['*']);

        $response = $this->getJson("/api/stores/qrcode/{$this->storeQR->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('data.id', $this->storeQR->id);
    }

    // --- PATCH /api/stores/qrcode/{qr}/toggle-status ---

    public function test_unauthenticated_cannot_toggle_status(): void
    {
        $response = $this->patchJson("/api/stores/qrcode/{$this->storeQR->id}/toggle-status");

        $response->assertStatus(401);
    }

    public function test_admin_can_toggle_qr_status(): void
    {
        Sanctum::actingAs($this->admin, ['*']);

        $response = $this->patchJson("/api/stores/qrcode/{$this->storeQR->id}/toggle-status");

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('data.status', 'inactive');

        // Toggle back
        $response = $this->patchJson("/api/stores/qrcode/{$this->storeQR->id}/toggle-status");

        $response->assertStatus(200)
                 ->assertJsonPath('data.status', 'active');
    }

    public function test_unauthorized_user_cannot_toggle_status(): void
    {
        Sanctum::actingAs($this->client, ['*']);

        $response = $this->patchJson("/api/stores/qrcode/{$this->storeQR->id}/toggle-status");

        $response->assertStatus(403);
    }

    // --- GET /api/stores/qrcode/{qr}/download ---

    public function test_unauthenticated_cannot_download_qr(): void
    {
        $response = $this->getJson("/api/stores/qrcode/{$this->storeQR->id}/download");

        $response->assertStatus(401);
    }

    public function test_authorized_user_can_download_qr(): void
    {
        Storage::fake();
        Storage::put($this->storeQR->qr_path, 'fake-png-content');

        Sanctum::actingAs($this->admin, ['*']);

        $response = $this->get("/api/stores/qrcode/{$this->storeQR->id}/download");

        $response->assertStatus(200);
    }
}
