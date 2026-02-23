<?php

namespace Database\Factories;

use App\Models\StoreQR;
use App\Models\Store;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;

class StoreQRFactory extends Factory
{
    protected $model = StoreQR::class;

    public function definition(): array
    {
        return [
            'store_id'     => Store::factory(),
            'qr_code'      => Str::random(32),
            'qr_path'      => 'qrcodes/' . Str::random(32) . '.png',
            'scan_url'     => 'http://localhost/scan/' . Str::random(32),
            'generated_by' => User::factory(),
            'status'       => 'active',
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => ['status' => 'inactive']);
    }
}
