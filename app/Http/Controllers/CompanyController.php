<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCompanyRequest;
use App\Http\Requests\UpdateCompanyRequest;
use App\Models\Company;
use App\Models\User;
use App\Services\CompanyService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    use AuthorizesRequests;

    public function __construct(private readonly CompanyService $companyService)
    {
        $this->middleware('permission:view companies')->only(['index', 'show']);
        $this->middleware('permission:create company')->only(['create', 'store']);
        $this->middleware('permission:update company')->only(['edit', 'update']);
        $this->middleware('permission:delete company')->only('destroy');
    }

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Company::class);

        $companies = $this->companyService->index($request->only(['search']));
        $admins    = User::role(['super-admin', 'admin'])->orderBy('name')->get(['id', 'name']);

        return Inertia::render('companies/index', [
            'companies' => $companies,
            'filters'   => $request->only(['search']),
            'admins'    => $admins,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Company::class);

        return Inertia::render('companies/create');
    }

    public function store(StoreCompanyRequest $request): RedirectResponse
    {
        $company = $this->companyService->store($request->validated());

        if ($request->has('redirect_to_store')) {
            return redirect()->route('stores.create', ['company_id' => $company->id])
                ->with('message', 'Company created successfully. Now you can add stores.');
        }

        return redirect()->route('companies.index')
            ->with('message', 'Company created successfully.');
    }

    public function show(Company $company): Response
    {
        $this->authorize('view', $company);

        return Inertia::render('companies/show', [
            'company' => $company->load('stores'),
        ]);
    }

    public function edit(Company $company): Response
    {
        $this->authorize('update', $company);

        return Inertia::render('companies/edit', [
            'company' => $company,
        ]);
    }

    public function update(UpdateCompanyRequest $request, Company $company): RedirectResponse
    {
        $this->companyService->update($company, $request->validated());

        return Redirect::route('companies.index')
            ->with('message', 'Company updated successfully.');
    }

    public function destroy(Company $company): RedirectResponse
    {
        $this->authorize('delete', $company);
        $this->companyService->destroy($company);

        return Redirect::route('companies.index')
            ->with('message', 'Company deleted successfully.');
    }
}