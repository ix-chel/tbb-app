<?php

namespace App\Services;

use App\Models\Store;
use App\Models\Company;
use App\Traits\LogsActivity;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class StoreService
{
    use LogsActivity;

    public function index(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        return Store::with('company')
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('address', 'like', "%{$search}%")
                      ->orWhereHas('company', fn($q) => $q->where('name', 'like', "%{$search}%"));
            })
            ->when($filters['company_id'] ?? null, function ($query, $companyId) {
                $query->where('company_id', $companyId);
            })
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function store(array $data): Store
    {
        $store = Store::create($data);

        $this->logActivity('store.created', ['store_id' => $store->id, 'name' => $store->name]);

        return $store;
    }

    public function update(Store $store, array $data): Store
    {
        $store->update($data);

        $this->logActivity('store.updated', ['store_id' => $store->id]);

        return $store->fresh();
    }

    public function destroy(Store $store): void
    {
        $this->logActivity('store.deleted', ['store_id' => $store->id, 'name' => $store->name]);

        $store->delete();
    }
}
