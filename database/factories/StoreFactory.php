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
            'name' => fake()->company() . ' ' . fake()->randomElement(['Branch', 'Outlet', 'Store']), // Nama toko palsu
            'address' => fake()->address(),
            'phone' => fake()->phoneNumber(),
            // Penting: Otomatis buat atau cari Company jika company_id tidak diberikan saat create
            'company_id' => Company::factory(),
        ];
    }
}