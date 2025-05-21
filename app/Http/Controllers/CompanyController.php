<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia; // <-- Import Inertia
use Inertia\Response; // <-- Import Response type hint
use Illuminate\Http\RedirectResponse; // <-- Import RedirectResponse type hint
use Illuminate\Support\Facades\Redirect; // <-- Import Redirect facade
use Illuminate\Validation\Rule; // <-- Import Rule untuk validasi
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\User;

use Illuminate\Routing\Controller;

class CompanyController extends Controller
{
    use AuthorizesRequests;

    public function __construct()
    {
        $this->middleware('permission:view companies')->only(['index', 'show']);
        $this->middleware('permission:create company')->only(['create', 'store']);
        $this->middleware('permission:update company')->only(['edit', 'update']);
        $this->middleware('permission:delete company')->only('destroy');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response // <-- Return type Inertia Response
    {
        $this->authorize('viewAny', Company::class); // <-- Cek otorisasi viewAny

        $query = Company::query()
            ->withCount('stores') // Menambahkan stores_count
            ->with('stores');     // Eager loading stores

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $companies = $query->paginate(12)->withQueryString();

        $admins = User::role(['super-admin', 'admin'])->orderBy('name')->get(['id', 'name']);

        // Render komponen React 'Companies/Index' dengan props 'companies' dan 'filters'
        return Inertia::render('companies/index', [
            'companies' => $companies,
            'filters' => $request->only(['search']), // Kirim filter aktif ke view
            'admins' => $admins,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response // <-- Return type Inertia Response
    {
        $this->authorize('create', Company::class); // <-- Cek otorisasi create
        // Render komponen React 'Companies/Create'
        return Inertia::render('companies/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse // <-- Return type Redirect
    {
        $this->authorize('create', Company::class); // <-- Cek otorisasi create
        // Validasi (buat lebih lengkap sesuai kebutuhan)
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255|unique:companies,email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'registration_number' => 'nullable|string|max:255|unique:companies,registration_number',
            'contact_person_name' => 'nullable|string|max:255',
            'contact_person_email' => 'nullable|email|max:255',
            'contact_person_phone' => 'nullable|string|max:20',
            // Tambahkan validasi field lain jika perlu
        ]);

        // Buat company baru
        $company = Company::create($validatedData);

        // Redirect ke halaman create store dengan company_id
        if ($request->has('redirect_to_store')) {
            return redirect()->route('stores.create', ['company_id' => $company->id])
                ->with('message', 'Company created successfully. Now you can add stores.');
        }

        return redirect()->route('companies.index')
            ->with('message', 'Company created successfully.');
    }

    /**
     * Display the specified resource.
     * (Opsional untuk CRUD dasar, seringkali langsung ke edit)
     */
    public function show(Company $company): Response // <-- Return type Inertia Response
    {
        $this->authorize('view', $company); // <-- Cek otorisasi view (passing $company) 
        // Render komponen React 'Companies/Show' dengan prop 'company'
        return Inertia::render('companies/show', [
            'company' => $company->load('stores')
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Company $company): Response // <-- Return type Inertia Response
    {
        $this->authorize('update', $company); // <-- Cek otorisasi update
        // Render komponen React 'Companies/Edit' dengan prop 'company'
        return Inertia::render('companies/edit', [
            'company' => $company // Data company otomatis didapat dari Route Model Binding
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Company $company): RedirectResponse // <-- Return type Redirect
    {
        $this->authorize('update', $company); // <-- Cek otorisasi update
        // Validasi (gunakan Rule::unique untuk ignore ID saat ini)
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('companies')->ignore($company->id),
            ],
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'registration_number' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('companies')->ignore($company->id),
            ],
            'contact_person_name' => 'nullable|string|max:255',
            'contact_person_email' => 'nullable|email|max:255',
            'contact_person_phone' => 'nullable|string|max:20',
             // Tambahkan validasi field lain jika perlu
        ]);

        // Update company
        $company->update($validatedData);

        // Redirect kembali ke halaman edit ATAU index dengan flash message
        // return Redirect::back()->with('message', 'Company updated successfully.');
        return Redirect::route('companies.index')->with('message', 'Company updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Company $company): RedirectResponse // <-- Return type Redirect
    {
        $this->authorize('delete', $company); // <-- Cek otorisasi delete
        // Hapus company
        $company->delete();

        // Redirect ke halaman index dengan flash message
        return Redirect::route('companies.index')->with('message', 'Company deleted successfully.');
    }
}