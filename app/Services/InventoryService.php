<?php

namespace App\Services;

use App\Models\InventoryItem;
use App\Traits\LogsActivity;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class InventoryService
{
    use LogsActivity;

    public function index(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        $query = InventoryItem::query()->with('lastUpdater:id,name');

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('sku', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (filter_var($filters['show_low_stock'] ?? false, FILTER_VALIDATE_BOOLEAN)) {
            $query->lowStock();
        }

        if (filter_var($filters['show_out_of_stock'] ?? false, FILTER_VALIDATE_BOOLEAN)) {
            $query->outOfStock();
        }

        return $query->orderBy('name')->paginate($perPage)->withQueryString();
    }

    public function store(array $data, int $userId): InventoryItem
    {
        $item = InventoryItem::create(array_merge($data, ['last_updated_by' => $userId]));

        $this->logActivity('inventory.created', [
            'item_id' => $item->id,
            'sku'     => $item->sku,
        ]);

        return $item;
    }

    public function update(InventoryItem $item, array $data, int $userId): InventoryItem
    {
        $item->update(array_merge($data, ['last_updated_by' => $userId]));

        $this->logActivity('inventory.updated', ['item_id' => $item->id]);

        return $item->fresh('lastUpdater');
    }

    /**
     * Atomically adjust quantity to prevent race conditions between concurrent stock updates.
     * Use this instead of manually setting quantity when adjusting stock levels.
     */
    public function adjustQuantity(InventoryItem $item, int $delta): InventoryItem
    {
        return DB::transaction(function () use ($item, $delta) {
            $item->lockForUpdate()->refresh();
            $item->increment('quantity', $delta);

            $this->logActivity('inventory.quantity_adjusted', [
                'item_id' => $item->id,
                'delta'   => $delta,
                'new_qty' => $item->quantity,
            ]);

            return $item->fresh();
        });
    }

    public function destroy(InventoryItem $item): void
    {
        $this->logActivity('inventory.deleted', ['item_id' => $item->id, 'sku' => $item->sku]);
        $item->delete();
    }
}
