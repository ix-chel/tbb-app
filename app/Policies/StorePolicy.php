<?php

namespace App\Policies;

use App\Models\Store;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class StorePolicy
{
    use HandlesAuthorization;

    /**
     * Perform pre-authorization checks.
     */
    public function before(User $user, string $ability): bool|null
    {
        // super-admin bisa akses semua
        if ($user->hasRole('super-admin')) {
            return true;
        }
        return null;
    }

    /**
     * Determine whether the user can view any models.
     * Siapa bisa lihat daftar semua toko (di index utama)? -> Admin
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['super-admin', 'admin', 'technician', 'client']);
    }

    /**
     * Determine whether the user can view the model.
     * Siapa bisa lihat detail toko spesifik? -> Admin, Teknisi, Client pemilik company toko tsb
     */
    public function view(User $user, Store $store): bool
    {
        if ($user->hasRole(['super-admin', 'admin', 'technician'])) {
            return true;
        }

        if ($user->hasRole('client')) {
            return $store->company_id === $user->company_id;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     * Siapa bisa buat toko baru? -> Admin
     */
    public function create(User $user): bool
    {
        return $user->hasRole(['super-admin', 'admin']);
    }

    /**
     * Determine whether the user can update the model.
     * Siapa bisa update toko? -> Admin
     */
    public function update(User $user, Store $store): bool
    {
        return $user->hasRole(['super-admin', 'admin']);
    }

    /**
     * Determine whether the user can delete the model.
     * Siapa bisa hapus toko? -> Admin
     */
    public function delete(User $user, Store $store): bool
    {
        return $user->hasRole(['super-admin', 'admin']);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Store $store): bool
    {
        return $user->hasRole(['super-admin', 'admin']);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Store $store): bool
    {
        return $user->hasRole(['super-admin', 'admin']);
    }
}