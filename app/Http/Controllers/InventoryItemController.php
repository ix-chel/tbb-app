<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInventoryItemRequest;
use App\Http\Requests\UpdateInventoryItemRequest;
use App\Models\InventoryItem;
use App\Models\User;
use App\Services\InventoryService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class InventoryItemController extends Controller
{
    use AuthorizesRequests;

    public function __construct(private readonly InventoryService $inventoryService) {}

    public function index(Request $request): InertiaResponse
    {
        $filters = $request->only(['search', 'show_low_stock', 'show_out_of_stock']);
        $inventoryItems = $this->inventoryService->index($filters);

        return Inertia::render('inventory/index', [
            'inventoryItems' => $inventoryItems,
            'filters'        => (object) $filters,
        ]);
    }

    public function create(): InertiaResponse
    {
        $this->authorize('create', InventoryItem::class);

        return Inertia::render('inventory/create', [
            'managers' => User::role(['super-admin', 'admin', 'technician'])->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreInventoryItemRequest $request): RedirectResponse
    {
        $this->inventoryService->store($request->validated(), $request->user()->id);

        return redirect()->route('inventory.index')
            ->with('message', 'inventory item created.');
    }

    public function show(InventoryItem $inventory): RedirectResponse
    {
        return Redirect::route('inventory.edit', $inventory->id);
    }

    public function edit(InventoryItem $inventory): InertiaResponse
    {
        $this->authorize('update', $inventory);

        return Inertia::render('inventory/edit', [
            'inventoryItem' => $inventory->load('lastUpdater:id,name'),
        ]);
    }

    public function update(UpdateInventoryItemRequest $request, InventoryItem $inventory): RedirectResponse
    {
        $this->inventoryService->update($inventory, $request->validated(), $request->user()->id);

        return redirect()->route('inventory.index')
            ->with('message', 'inventory item updated.');
    }

    public function destroy(InventoryItem $inventory): RedirectResponse
    {
        $this->authorize('delete', $inventory);
        $this->inventoryService->destroy($inventory);

        return Redirect::route('inventory.index')
            ->with('message', 'inventory item deleted.');
    }
}