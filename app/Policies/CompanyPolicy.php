<?php

namespace App\Policies;

use App\Models\Company;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Auth\Access\HandlesAuthorization;

class CompanyPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     * Siapa yang boleh lihat daftar semua company?
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['super-admin', 'admin']);
    }

    /**
     * Determine whether the user can view the model.
     * Siapa yang boleh lihat detail satu company?
     */
    public function view(User $user, Company $company): bool
    {
        return $user->hasRole(['super-admin', 'admin']) || 
               ($user->hasRole('client') && $user->company_id === $company->id);
    }

    /**
     * Determine whether the user can create models.
     * Siapa yang boleh membuat company baru?
     */
    public function create(User $user): bool
    {
        return $user->hasRole(['super-admin', 'admin']);
    }

    /**
     * Determine whether the user can update the model.
     * Siapa yang boleh mengupdate company?
     */
    public function update(User $user, Company $company): bool
    {
        return $user->hasRole(['super-admin', 'admin']);
    }

    /**
     * Determine whether the user can delete the model.
     * Siapa yang boleh menghapus company?
     */
    public function delete(User $user, Company $company): bool
    {
        return $user->hasRole('super-admin');
    }

    /**
     * Determine whether the user can restore the model.
     * (Jika pakai Soft Deletes)
     */
    public function restore(User $user, Company $company): bool
    {
        return $user->hasRole('super-admin');
    }

    /**
     * Determine whether the user can permanently delete the model.
     * (Jika pakai Soft Deletes)
     */
    public function forceDelete(User $user, Company $company): bool
    {
        return $user->hasRole('super-admin');
    }
}