<?php

namespace Tests\Feature;

use App\Models\User;
use Spatie\Permission\Models\Role;
use App\Models\Feedback;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FeedbackTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesAndPermissionsSeeder::class);
        
        $this->user = User::factory()->create();
        $this->user->assignRole('client');
    }

    public function test_authenticated_user_can_view_feedback_form()
    {
        $this->actingAs($this->user)
            ->get(route('feedback.create'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('feedback/create'));
    }

    public function test_authenticated_user_can_submit_feedback()
    {
        $store = \App\Models\Store::factory()->create();
        $feedbackData = [
            'store_id' => $store->id,
            'type'    => 'suggestion',
            'comment' => 'This is a test feedback comment',
        ];

        $this->actingAs($this->user)
            ->post(route('feedback.store'), $feedbackData)
            ->assertRedirect(route('dashboard'))
            ->assertSessionHas('success');

        $this->assertDatabaseHas('feedback', [
            'store_id'  => $store->id,
            'type'      => 'suggestion',
            'comment'   => 'This is a test feedback comment',
            'user_id'   => $this->user->id,
        ]);
    }

    public function test_guest_cannot_access_feedback()
    {
        $this->get(route('feedback.create'))->assertRedirect('/login');
        $this->post(route('feedback.store'), [])->assertRedirect('/login');
    }
}
