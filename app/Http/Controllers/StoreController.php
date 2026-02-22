<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStoreRequest;
use App\Http\Requests\UpdateStoreRequest;
use App\Models\Company;
use App\Models\Store;
use App\Models\User;
use App\Services\StoreService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class StoreController extends Controller
{
    use AuthorizesRequests;

    public function __construct(private readonly StoreService $storeService) {}

    public function index(Request $request): InertiaResponse
    {
        $this->authorize('viewAny', Store::class);

        $stores    = $this->storeService->index($request->only(['search', 'company_id']));
        $companies = Company::orderBy('name')->get(['id', 'name']);

        return Inertia::render('stores/index', [
            'stores'    => $stores,
            'filters'   => $request->only(['search', 'company_id']),
            'companies' => $companies,
        ]);
    }

    public function create(Request $request): InertiaResponse
    {
        $this->authorize('create', Store::class);

        return Inertia::render('stores/create', [
            'companies'          => Company::orderBy('name')->get(['id', 'name']),
            'initial_company_id' => $request->query('company_id'),
            'admins'             => User::role(['super-admin', 'admin'])->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreStoreRequest $request): RedirectResponse
    {
        $this->storeService->store($request->validated());

        return Redirect::route('stores.index')->with('message', 'Store created successfully.');
    }

    public function show(Store $store): InertiaResponse
    {
        $this->authorize('view', $store);

        return Inertia::render('stores/show', [
            'store' => $store->load('company'),
        ]);
    }

    public function edit(Store $store): InertiaResponse
    {
        $this->authorize('update', $store);

        return Inertia::render('stores/edit', [
            'store'     => $store->load('company'),
            'companies' => Company::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateStoreRequest $request, Store $store): RedirectResponse
    {
        $this->storeService->update($store, $request->validated());

        return Redirect::route('stores.index')->with('message', 'Store updated successfully.');
    }

    public function destroy(Store $store): RedirectResponse
    {
        $this->authorize('delete', $store);
        $this->storeService->destroy($store);

        return Redirect::route('stores.index')->with('message', 'Store deleted successfully.');
    }
}