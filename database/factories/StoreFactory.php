<?php

namespace Database\Factories;

use App\Models\Store;
use App\Models\Company; // <-- Import Company
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Store>
 */
class StoreFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company() . ' ' . fake()->randomElement(['Branch', 'Outlet', 'Store']),
            'address' => fake()->address(),
            'phone' => fake()->phoneNumber(),
            'contact_person' => fake()->name(),
            'contact_phone' => fake()->phoneNumber(),
            'contact_email' => fake()->unique()->safeEmail(),
            // Penting: Otomatis buat atau cari Company jika company_id tidak diberikan saat create
            'company_id' => Company::factory(),
        ];
    }
}