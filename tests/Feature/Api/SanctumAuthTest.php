<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SanctumAuthTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);

        $this->user = User::factory()->create();
        $this->user->assignRole('admin');
    }

    public function test_unauthenticated_request_returns_401(): void
    {
        $response = $this->getJson('/api/user');

        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_get_their_own_info(): void
    {
        Sanctum::actingAs($this->user, ['*']);

        $response = $this->getJson('/api/user');

        $response->assertStatus(200)
                 ->assertJsonFragment(['id' => $this->user->id]);
    }

    public function test_api_rejects_invalid_token(): void
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer invalid-token-here',
            'Accept'        => 'application/json',
        ])->getJson('/api/user');

        $response->assertStatus(401);
    }

    public function test_response_structure_is_correct(): void
    {
        Sanctum::actingAs($this->user, ['*']);

        $response = $this->getJson('/api/user');

        $response->assertStatus(200)
                 ->assertJsonStructure(['id', 'name', 'email']);
    }
}
