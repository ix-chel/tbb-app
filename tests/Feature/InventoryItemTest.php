<?php

namespace Tests\Feature;

use App\Models\InventoryItem;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class InventoryItemTest extends TestCase
{
    use RefreshDatabase;

    private User $superAdmin;
    private User $admin;
    private User $technician;
    private User $client;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);

        $this->superAdmin = User::factory()->create();
        $this->superAdmin->assignRole('super-admin');
        
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');
        
        $this->technician = User::factory()->create();
        $this->technician->assignRole('technician');
        
        $this->client = User::factory()->create();
        $this->client->assignRole('client');
    }

    // --- INDEX Tests ---
    public function test_super_admin_can_view_inventory_index(): void
    {
        $response = $this->actingAs($this->superAdmin)->get(route('inventory-items.index'));
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page->component('inventory/index'));
    }

    public function test_admin_can_view_inventory_index(): void
    {
        $response = $this->actingAs($this->admin)->get(route('inventory-items.index'));
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page->component('inventory/index'));
    }

    public function test_technician_can_view_inventory_index(): void
    {
        $response = $this->actingAs($this->technician)->get(route('inventory-items.index'));
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page->component('inventory/index'));
    }

    public function test_client_cannot_view_inventory_index(): void
    {
        $response = $this->actingAs($this->client)->get(route('inventory-items.index'));
        $response->assertForbidden();
    }

    // --- CREATE Tests ---
    public function test_admin_can_view_create_inventory_form(): void
    {
        $response = $this->actingAs($this->admin)->get(route('inventory-items.create'));
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page->component('inventory/create'));
    }

    public function test_technician_can_view_create_inventory_form(): void
    {
        $response = $this->actingAs($this->technician)->get(route('inventory-items.create'));
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page->component('inventory/create'));
    }

    public function test_client_cannot_view_create_inventory_form(): void
    {
        $response = $this->actingAs($this->client)->get(route('inventory-items.create'));
        $response->assertForbidden();
    }

    // --- STORE Tests ---
    public function test_admin_can_store_inventory_item(): void
    {
        $itemData = InventoryItem::factory()->type('CF')->make()->toArray();
        $response = $this->actingAs($this->admin)
                         ->post(route('inventory-items.store'), $itemData);

        $response->assertRedirect(route('inventory-items.index'));
        $response->assertSessionHas('message', 'inventory item created.');
        $this->assertDatabaseHas('inventory_items', [
            'name' => 'Carbon Filter',
            'sku' => $itemData['sku'],
            'unit' => 'pcs'
        ]);
    }

    public function test_technician_can_store_inventory_item(): void
    {
        $itemData = InventoryItem::factory()->type('UV')->make()->toArray();
        $response = $this->actingAs($this->technician)
                         ->post(route('inventory-items.store'), $itemData);

        $response->assertRedirect(route('inventory-items.index'));
        $response->assertSessionHas('message', 'inventory item created.');
        $this->assertDatabaseHas('inventory_items', [
            'name' => 'UV Purification',
            'sku' => $itemData['sku'],
            'unit' => 'pcs'
        ]);
    }

    public function test_store_inventory_item_validation_fails(): void
    {
        $response = $this->actingAs($this->admin)
                         ->post(route('inventory-items.store'), ['name' => '']);
        $response->assertSessionHasErrors(['name']);
        $this->assertDatabaseMissing('inventory_items', ['name' => '']);
    }

    public function test_client_cannot_store_inventory_item(): void
    {
        $itemData = InventoryItem::factory()->type('RO')->make()->toArray();
        $response = $this->actingAs($this->client)
                         ->post(route('inventory-items.store'), $itemData);
        $response->assertForbidden();
    }

    // --- EDIT / UPDATE Tests ---
    public function test_admin_can_view_edit_inventory_form(): void
    {
        $item = InventoryItem::factory()->type('CF')->create();
        $response = $this->actingAs($this->admin)->get(route('inventory-items.edit', $item));
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) =>
            $page->component('inventory/edit')
                 ->has('inventoryItem.id', $item->id)
        );
    }

    public function test_admin_can_update_inventory_item(): void
    {
        $item = InventoryItem::factory()->type('UV')->create();
        $updateData = [
            'name' => 'UV Purification Pro',
            'quantity' => 55,
            'location' => 'Rak UV',
        ];

        $response = $this->actingAs($this->admin)
                         ->put(route('inventory-items.update', $item), $updateData);

        $response->assertRedirect(route('inventory-items.index'));
        $response->assertSessionHas('message', 'inventory item updated.');
        $this->assertDatabaseHas('inventory_items', [
            'id' => $item->id,
            'name' => 'UV Purification Pro',
            'quantity' => 55,
            'location' => 'Rak UV'
        ]);
    }

    public function test_technician_can_update_inventory_item(): void
    {
        $item = InventoryItem::factory()->type('RO')->create();
        $updateData = ['quantity' => 10];

        $response = $this->actingAs($this->technician)
                         ->put(route('inventory-items.update', $item), $updateData);

        $response->assertRedirect(route('inventory-items.index'));
        $this->assertDatabaseHas('inventory_items', [
            'id' => $item->id,
            'quantity' => 10
        ]);
    }

    public function test_client_cannot_update_inventory_item(): void
    {
        $item = InventoryItem::factory()->type('PP')->create();
        $updateData = ['name' => 'PP Filter Pro'];
        $response = $this->actingAs($this->client)
                         ->put(route('inventory-items.update', $item), $updateData);
        $response->assertForbidden();
    }

    // --- DELETE Tests ---
    public function test_admin_can_delete_inventory_item(): void
    {
        $item = InventoryItem::factory()->type('CT')->create();
        $response = $this->actingAs($this->admin)
                         ->delete(route('inventory-items.destroy', $item));

        $response->assertRedirect(route('inventory-items.index'));
        $response->assertSessionHas('message', 'inventory item deleted.');
        $this->assertDatabaseMissing('inventory_items', ['id' => $item->id]);
    }

    public function test_technician_cannot_delete_inventory_item(): void
    {
        $item = InventoryItem::factory()->type('PS')->create();
        $response = $this->actingAs($this->technician)
                         ->delete(route('inventory-items.destroy', $item));
        $response->assertForbidden();
    }

    public function test_client_cannot_delete_inventory_item(): void
    {
        $item = InventoryItem::factory()->type('PM')->create();
        $response = $this->actingAs($this->client)
                         ->delete(route('inventory-items.destroy', $item));
        $response->assertForbidden();
    }

    // --- Additional Tests ---
    public function test_low_stock_items_are_visible(): void
    {
        $lowStockItem = InventoryItem::factory()->type('CF')->lowStock()->create();
        $normalStockItem = InventoryItem::factory()->type('UV')->create();

        $response = $this->actingAs($this->admin)
                         ->get(route('inventory-items.index', ['show_low_stock' => true]));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) =>
            $page->component('inventory/index')
                 ->has('inventoryItems.data', 1)
                 ->where('inventoryItems.data.0.id', $lowStockItem->id)
        );
    }

    public function test_out_of_stock_items_are_visible(): void
    {
        $outOfStockItem = InventoryItem::factory()->type('RO')->outOfStock()->create();
        $normalStockItem = InventoryItem::factory()->type('PP')->create();

        $response = $this->actingAs($this->admin)
                         ->get(route('inventory-items.index', ['show_out_of_stock' => true]));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) =>
            $page->component('inventory/index')
                 ->has('inventoryItems.data', 1)
                 ->where('inventoryItems.data.0.id', $outOfStockItem->id)
        );
    }
}