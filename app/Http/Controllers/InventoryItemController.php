<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\User;
use App\Models\Store;

class InventoryItemController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): InertiaResponse
    {
        $query = InventoryItem::query();

        // Filter berdasarkan 'search' jika ada
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->input('search') . '%');
        }

        // Filter berdasarkan 'show_low_stock'
        if ($request->input('show_low_stock') === '1') {
            $query->whereNotNull('low_stock_threshold')
                  ->whereColumn('quantity', '<=', 'low_stock_threshold');
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'name');
        $sortDirection = $request->input('sort_direction', 'asc');
        $allowedSorts = ['name', 'quantity', 'sku', 'created_at'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'name';
        }
        if (!in_array(strtolower($sortDirection), ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }
        $query->orderBy($sortBy, $sortDirection);

        $inventoryItems = $query->with('lastUpdater:id,name')
                                ->paginate(12)
                                ->withQueryString();

        // Ambil filter yang aktif untuk dikirim kembali ke frontend
        $activeFilters = $request->only(['search', 'show_low_stock', 'sort_by', 'sort_direction']);

        return Inertia::render('inventory/index', [
            'inventoryItems' => $inventoryItems,
            'filters'        => (object) $activeFilters,
        ]);
    }

    public function create(): InertiaResponse
    {
        $this->authorize('create', InventoryItem::class);
        $managers = User::role(['super-admin', 'admin', 'technician'])->orderBy('name')->get(['id', 'name']);
        $stores = Store::orderBy('name')->get(['id', 'name']);

        return Inertia::render('inventory/create', [
            'managers' => $managers,
            'stores' => $stores,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:filter,mesin,alat,sparepart',
            'sku' => 'required|string|max:255|unique:inventory_items,sku',
            'quantity' => 'required|integer|min:0',
            'unit' => 'required|string|max:50',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'store_id' => 'required|exists:stores,id',
        ]);

        $itemData = array_merge($validated, ['last_updater_id' => Auth::id()]);

        InventoryItem::create($itemData);

        return redirect()->route('inventory.index')
            ->with('message', 'inventory item created.');
    }

    public function show(InventoryItem $inventoryItem): InertiaResponse // Atau RedirectResponse
    {
        // Biasanya tidak ada halaman show terpisah untuk item seperti ini di dashboard
        // Lebih baik redirect ke edit atau index
        // Jika Anda punya policy: $this->authorize('view', $inventoryItem);
        // $inventoryItem->load('lastUpdater:id,name');
        // return Inertia::render('Inventory/Show', ['inventoryItem' => $inventoryItem]);
        return Redirect::route('inventory.edit', $inventoryItem->id); // Sesuaikan nama route
    }

    public function edit(InventoryItem $inventoryItem): InertiaResponse
    {
        $this->authorize('update', $inventoryItem);
        $inventoryItem->load('lastUpdater:id,name');
        $stores = Store::orderBy('name')->get(['id', 'name']);

        return Inertia::render('inventory/edit', [
            'inventoryItem' => $inventoryItem,
            'stores' => $stores,
        ]);
    }

    public function update(Request $request, InventoryItem $inventoryItem): RedirectResponse
    {
        $this->authorize('update', $inventoryItem);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:filter,mesin,alat,sparepart',
            'sku' => ['required', 'string', 'max:255', Rule::unique('inventory_items')->ignore($inventoryItem->id)],
            'quantity' => 'required|integer|min:0',
            'unit' => 'required|string|max:50',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'store_id' => 'required|exists:stores,id',
        ]);

        $itemData = array_merge($validated, ['last_updater_id' => Auth::id()]);

        $inventoryItem->update($itemData);

        return redirect()->route('inventory.index')
            ->with('message', 'inventory item updated.');
    }

    public function destroy(InventoryItem $inventoryItem): RedirectResponse
    {
        $this->authorize('delete', $inventoryItem);
        $inventoryItem->delete();

        return Redirect::route('inventory.index')
            ->with('message', 'inventory item deleted.');
    }
}