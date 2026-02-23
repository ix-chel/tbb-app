<?php

namespace Tests\Feature\Api;

use App\Models\Company;
use App\Models\Store;
use App\Models\StoreQR;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class QRScanTest extends TestCase
{
    use RefreshDatabase;

    private User $technician;
    private User $admin;
    private User $client;
    private Company $company;
    private Store $store;
    private StoreQR $storeQR;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);

        $this->company = Company::factory()->create();

        $this->technician = User::factory()->create(['company_id' => $this->company->id]);
        $this->technician->assignRole('technician');

        $this->admin = User::factory()->create(['company_id' => $this->company->id]);
        $this->admin->assignRole('admin');

        $this->client = User::factory()->create(['company_id' => $this->company->id]);
        $this->client->assignRole('client');

        $this->store = Store::factory()->create(['company_id' => $this->company->id]);

        $this->storeQR = StoreQR::factory()->create([
            'store_id' => $this->store->id,
            'status'   => 'active',
            'qr_code'  => 'TEST_QR_CODE_ACTIVE_12345678',
        ]);
    }

    // --- POST /api/qrcode/scan ---

    public function test_unauthenticated_cannot_scan(): void
    {
        $response = $this->postJson('/api/qrcode/scan', ['qr_code' => $this->storeQR->qr_code]);

        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_scan_valid_qr_code(): void
    {
        Sanctum::actingAs($this->technician, ['*']);

        $response = $this->postJson('/api/qrcode/scan', [
            'qr_code' => $this->storeQR->qr_code,
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data' => ['store', 'scan'],
                 ]);
    }

    public function test_scan_requires_qr_code_field(): void
    {
        Sanctum::actingAs($this->technician, ['*']);

        $response = $this->postJson('/api/qrcode/scan', []);

        $response->assertStatus(422);
    }

    public function test_scan_with_inactive_qr_code_returns_404(): void
    {
        Sanctum::actingAs($this->technician, ['*']);

        $inactiveQR = StoreQR::factory()->inactive()->create([
            'store_id' => $this->store->id,
        ]);

        $response = $this->postJson('/api/qrcode/scan', [
            'qr_code' => $inactiveQR->qr_code,
        ]);

        $response->assertStatus(404);
    }

    public function test_scan_with_nonexistent_qr_code_returns_404(): void
    {
        Sanctum::actingAs($this->technician, ['*']);

        $response = $this->postJson('/api/qrcode/scan', [
            'qr_code' => 'this_qr_code_does_not_exist_xyz',
        ]);

        $response->assertStatus(404);
    }

    public function test_scan_creates_a_qr_scan_history_record(): void
    {
        Sanctum::actingAs($this->technician, ['*']);

        $this->postJson('/api/qrcode/scan', [
            'qr_code' => $this->storeQR->qr_code,
        ]);

        $this->assertDatabaseHas('qr_scan_histories', [
            'store_qr_id' => $this->storeQR->id,
            'user_id'     => $this->technician->id,
        ]);
    }

    // --- GET /api/qrcode/{qr}/history ---

    public function test_unauthenticated_cannot_get_history(): void
    {
        $response = $this->getJson("/api/qrcode/{$this->storeQR->id}/history");

        $response->assertStatus(401);
    }

    public function test_authorized_user_can_view_scan_history(): void
    {
        Sanctum::actingAs($this->admin, ['*']);

        $response = $this->getJson("/api/qrcode/{$this->storeQR->id}/history");

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);
    }

    public function test_history_returns_paginated_data(): void
    {
        Sanctum::actingAs($this->admin, ['*']);

        $response = $this->getJson("/api/qrcode/{$this->storeQR->id}/history");

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         'current_page',
                         'data',
                         'per_page',
                         'total',
                     ],
                 ]);
    }
}
