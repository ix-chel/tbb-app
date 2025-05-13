<?php

namespace Database\Factories;

use App\Models\Feedback;
use App\Models\User;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

class FeedbackFactory extends Factory
{
    protected $model = Feedback::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'store_id' => Store::factory(),
            'title' => $this->faker->sentence(),
            'message' => $this->faker->paragraph(),
            'type' => $this->faker->randomElement(['complaint', 'suggestion', 'praise']),
            'status' => $this->faker->randomElement(['pending', 'in_progress', 'resolved', 'closed']),
            'admin_response' => $this->faker->optional()->paragraph(),
            'responded_at' => $this->faker->optional()->dateTime(),
        ];
    }
} 