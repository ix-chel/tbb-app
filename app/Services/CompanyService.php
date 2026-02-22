<?php

namespace App\Services;

use App\Models\Company;
use App\Traits\LogsActivity;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CompanyService
{
    use LogsActivity;

    public function index(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        $query = Company::query()
            ->withCount('stores')
            ->with('stores');

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function store(array $data): Company
    {
        $company = Company::create($data);

        $this->logActivity('company.created', ['company_id' => $company->id, 'name' => $company->name]);

        return $company;
    }

    public function update(Company $company, array $data): Company
    {
        $company->update($data);

        $this->logActivity('company.updated', ['company_id' => $company->id]);

        return $company->fresh();
    }

    public function destroy(Company $company): void
    {
        $this->logActivity('company.deleted', ['company_id' => $company->id, 'name' => $company->name]);

        $company->delete();
    }
}
