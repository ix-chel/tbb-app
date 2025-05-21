<?php

namespace App\Policies;

use App\Models\InventoryItem;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class InventoryItemPolicy
{
    use HandlesAuthorization;

    /**
     * Perform pre-authorization checks.
     */
    public function before(User $user, string $ability): bool|null
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }
        return null;
    }

    /**
     * Determine whether the user can view any models.
     * Siapa bisa lihat daftar inventory? -> Admin, Teknisi
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['super-admin', 'admin', 'technician']);
    }

    /**
     * Determine whether the user can view the model.
     * Siapa bisa lihat detail item? -> Admin, Teknisi
     */
    public function view(User $user, InventoryItem $inventoryItem): bool
    {
        return $user->hasRole(['super-admin', 'admin', 'technician']);
    }

    /**
     * Determine whether the user can create models.
     * Siapa bisa tambah item baru? -> Admin, Teknisi (misal habis pakai)
     */
    public function create(User $user): bool
    {
        return $user->hasRole(['super-admin', 'admin', 'technician']);
    }

    /**
     * Determine whether the user can update the model.
     * Siapa bisa update item (terutama quantity)? -> Admin, Teknisi
     */
    public function update(User $user, InventoryItem $inventoryItem): bool
    {
        return $user->hasRole(['super-admin', 'admin', 'technician']);
    }

    /**
     * Determine whether the user can delete the model.
     * Siapa bisa hapus item? -> Admin
     */
    public function delete(User $user, InventoryItem $inventoryItem): bool
    {
        return $user->hasRole(['super-admin', 'admin']);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, InventoryItem $inventoryItem): bool
    {
        return $user->hasRole(['super-admin', 'admin']);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, InventoryItem $inventoryItem): bool
    {
        return $user->hasRole(['super-admin', 'admin']);
    }
}