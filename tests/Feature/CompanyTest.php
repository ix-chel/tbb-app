<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;


class CompanyTest extends TestCase
{
    use RefreshDatabase;

    private User $superAdmin;
    private User $admin;
    private User $client;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed roles dan permissions
        $this->seed(RolesAndPermissionsSeeder::class);

        // Create users with different roles
        $this->superAdmin = User::factory()->create();
        $this->superAdmin->assignRole('super-admin');

        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');

        $this->client = User::factory()->create();
        $this->client->assignRole('client');
    }

    public function test_super_admin_can_view_companies(): void
    {
        $response = $this->actingAs($this->superAdmin)
            ->get(route('companies.index'));

        $response->assertStatus(200);
    }

    public function test_admin_can_view_companies(): void
    {
        $response = $this->actingAs($this->admin)
            ->get(route('companies.index'));

        $response->assertStatus(200);
    }

    public function test_client_cannot_view_companies(): void
    {
        $response = $this->actingAs($this->client)
            ->get(route('companies.index'));

        $response->assertStatus(403);
    }

    public function test_super_admin_can_create_company(): void
    {
        $companyData = Company::factory()->raw();
        $response = $this->actingAs($this->superAdmin)
            ->withSession(['_token' => 'test'])
            ->post(route('companies.store'), array_merge($companyData, ['_token' => 'test']));

        $response->assertRedirect(route('companies.index'));
        $this->assertDatabaseHas('companies', $companyData);
    }

    public function test_admin_can_create_company(): void
    {
        $companyData = Company::factory()->raw();
        $response = $this->actingAs($this->admin)
            ->withSession(['_token' => 'test'])
            ->post(route('companies.store'), array_merge($companyData, ['_token' => 'test']));

        $response->assertRedirect(route('companies.index'));
        $this->assertDatabaseHas('companies', $companyData);
    }

    public function test_client_cannot_create_company(): void
    {
        $companyData = Company::factory()->raw();
        $response = $this->actingAs($this->client)
            ->withSession(['_token' => 'test'])
            ->post(route('companies.store'), array_merge($companyData, ['_token' => 'test']));

        $response->assertStatus(403);
        $this->assertDatabaseMissing('companies', $companyData);
    }

    public function test_super_admin_can_update_company(): void
    {
        $company = Company::factory()->create();
        $updateData = Company::factory()->raw();

        $response = $this->actingAs($this->superAdmin)
            ->withSession(['_token' => 'test'])
            ->put(route('companies.update', $company), array_merge($updateData, ['_token' => 'test']));

        $response->assertRedirect(route('companies.index'));
        $this->assertDatabaseHas('companies', $updateData);
    }

    public function test_admin_can_update_company(): void
    {
        $company = Company::factory()->create();
        $updateData = Company::factory()->raw();

        $response = $this->actingAs($this->admin)
            ->withSession(['_token' => 'test'])
            ->put(route('companies.update', $company), array_merge($updateData, ['_token' => 'test']));

        $response->assertRedirect(route('companies.index'));
        $this->assertDatabaseHas('companies', $updateData);
    }

    public function test_client_cannot_update_company(): void
    {
        $company = Company::factory()->create();
        $updateData = Company::factory()->raw();

        $response = $this->actingAs($this->client)
            ->withSession(['_token' => 'test'])
            ->put(route('companies.update', $company), array_merge($updateData, ['_token' => 'test']));

        $response->assertStatus(403);
        $this->assertDatabaseMissing('companies', $updateData);
    }

    public function test_only_super_admin_can_delete_company(): void
    {
        $company = Company::factory()->create();

        // super-admin can delete
        $response = $this->actingAs($this->superAdmin)
            ->withSession(['_token' => 'test'])
            ->delete(route('companies.destroy', $company), ['_token' => 'test']);

        $response->assertRedirect(route('companies.index'));
        $this->assertDatabaseMissing('companies', ['id' => $company->id]);

        // Admin cannot delete
        $company = Company::factory()->create();
        $response = $this->actingAs($this->admin)
            ->withSession(['_token' => 'test'])
            ->delete(route('companies.destroy', $company), ['_token' => 'test']);

        $response->assertStatus(403);
        $this->assertDatabaseHas('companies', ['id' => $company->id]);
    }

    public function test_client_cannot_delete_company(): void
    {
        $company = Company::factory()->create();

        $response = $this->actingAs($this->client)
            ->withSession(['_token' => 'test'])
            ->delete(route('companies.destroy', $company), ['_token' => 'test']);

        $response->assertStatus(403);
        $this->assertDatabaseHas('companies', ['id' => $company->id]);
    }
}