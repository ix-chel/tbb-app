<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\Company; // Import Company
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\User;


class StoreController extends Controller
{
    use AuthorizesRequests;
    public function index(Request $request): InertiaResponse
    {
        $this->authorize('viewAny', Store::class);

        $user = auth()->user();

        $stores = Store::with('company')
            // Jika user adalah client, hanya tampilkan store milik company user
            ->when($user->hasRole('client'), function ($query) use ($user) {
                $query->where('company_id', $user->company_id);
            })
            ->when($request->input('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%")
                    ->orWhereHas('company', fn($q2) => $q2->where('name', 'like', "%{$search}%"));
                });
            })
            ->when($request->input('company_id'), function ($query, $companyId) use ($user) {
                // Jika client, abaikan filter ini karena sudah fix company_id-nya
                if (!$user->hasRole('client')) {
                    $query->where('company_id', $companyId);
                }
            })
            ->orderBy('name')
            ->paginate(12)
            ->withQueryString();

        $companies = $user->hasRole('client')
            ? Company::where('id', $user->company_id)->get(['id', 'name']) // hanya company milik user
            : Company::orderBy('name')->get(['id', 'name']); // semua company untuk admin

        return Inertia::render('stores/index', [
            'stores' => $stores,
            'filters' => $request->only(['search', 'company_id']),
            'companies' => $companies,
        ]);
    }

    public function create(Request $request): InertiaResponse
    {
        $this->authorize('create', Store::class);
        $companies = Company::orderBy('name')->get(['id', 'name']);
        $admins = User::role(['super-admin', 'admin'])->orderBy('name')->get(['id', 'name']);

        return Inertia::render('stores/create', [
            'companies' => $companies,
            'initial_company_id' => $request->query('company_id'),
            'admins' => $admins,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Store::class); // Contoh Policy
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'company_id' => 'required|exists:companies,id', // Wajib pilih company
        ]);

        Store::create($validatedData);

        return Redirect::route('stores.index')->with('message', 'Store created successfully.');
    }

    public function show(Store $store): InertiaResponse
    {
        $this->authorize('view', $store); // Contoh Policy
        $store->load('company'); // Load relasi company
        return Inertia::render('stores/show', [ // Komponen Show opsional
            'store' => $store
        ]);
    }

    public function edit(Store $store): InertiaResponse
    {
       $this->authorize('update', $store); // Contoh Policy
        $store->load('company');
        $companies = Company::orderBy('name')->get(['id', 'name']);

        return Inertia::render('stores/edit', [
            'store' => $store,
            'companies' => $companies,
        ]);
    }

    public function update(Request $request, Store $store): RedirectResponse
    {
        $this->authorize('update', $store); // Contoh Policy
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'company_id' => 'required|exists:companies,id',
        ]);

        $store->update($validatedData);

        return Redirect::route('stores.index')->with('message', 'Store updated successfully.');
        // Atau redirect back: return Redirect::back()->with('message', 'Store updated successfully.');
    }

    public function destroy(Store $store): RedirectResponse
    {
        $this->authorize('delete', $store); // Contoh Policy
        $store->delete();
        return Redirect::route('stores.index')->with('message', 'Store deleted successfully.');
    }
}