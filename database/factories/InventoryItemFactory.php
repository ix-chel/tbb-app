<?php

namespace Database\Factories;

use App\Models\InventoryItem;
use App\Models\User;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InventoryItem>
 */
class InventoryItemFactory extends Factory
{
    protected $model = InventoryItem::class;

    private array $itemTypes = [
        'CF' => 'Carbon Filter',
        'UV' => 'UV Purification',
        'RO' => 'RO Membrane',
        'PP' => 'PP Filter',
        'CT' => 'Cartridge',
        'PS' => 'Pressure Switch',
        'PM' => 'Pressure Meter',
        'FT' => 'Flow Meter',
        'TB' => 'Tank Ball',
        'VL' => 'Valve',
        'HT' => 'Housing Tank',
        'PT' => 'Pump',
        'AD' => 'Adapter',
        'CN' => 'Connector',
        'TB' => 'Tubing',
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Generic Filter',
            'sku' => 'XX-' . $this->faker->unique()->numberBetween(1000, 9999),
            'quantity' => $this->faker->numberBetween(0, 100),
            'unit' => 'pcs',
            'location' => $this->faker->city,
            'description' => $this->faker->sentence,
            'store_id' => Store::factory(),
        ];
    }

    /**
     * State untuk item dengan stok rendah
     */
    public function lowStock(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'quantity' => $this->faker->numberBetween(0, 10),
            ];
        });
    }

    /**
     * State untuk item dengan stok habis
     */
    public function outOfStock(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'quantity' => 0,
            ];
        });
    }

    /**
     * State untuk item dengan stok banyak
     */
    public function highStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'quantity' => $this->faker->numberBetween(50, 100),
        ]);
    }

    /**
     * State untuk tipe item tertentu
     */
    public function type(string $type): self
    {
        $types = [
            'CF' => ['name' => 'Carbon Filter', 'sku' => 'CF-' . $this->faker->unique()->numberBetween(1000, 9999)],
            'UV' => ['name' => 'UV Purification', 'sku' => 'UV-' . $this->faker->unique()->numberBetween(1000, 9999)],
            'RO' => ['name' => 'Reverse Osmosis', 'sku' => 'RO-' . $this->faker->unique()->numberBetween(1000, 9999)],
            'PP' => ['name' => 'PP Filter', 'sku' => 'PP-' . $this->faker->unique()->numberBetween(1000, 9999)],
            'CT' => ['name' => 'Cartridge', 'sku' => 'CT-' . $this->faker->unique()->numberBetween(1000, 9999)],
            'PS' => ['name' => 'Pressure Switch', 'sku' => 'PS-' . $this->faker->unique()->numberBetween(1000, 9999)],
            'PM' => ['name' => 'Pressure Meter', 'sku' => 'PM-' . $this->faker->unique()->numberBetween(1000, 9999)],
        ];

        return $this->state(function (array $attributes) use ($type, $types) {
            return $types[$type] ?? $attributes;
        });
    }
}
