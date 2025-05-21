<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super-admin', 'admin']);
    }

    public function view(User $user, User $model): bool
    {
        return $user->hasAnyRole(['super-admin', 'admin']);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['super-admin', 'admin']);
    }

    public function update(User $user, User $model): bool
    {
        // Super admin bisa update semua user
        if ($user->hasRole('super-admin')) {
            return true;
        }

        // Admin hanya bisa update user yang bukan super-admin
        if ($user->hasRole('admin')) {
            return !$model->hasRole('super-admin');
        }

        return false;
    }

    public function delete(User $user, User $model): bool
    {
        // Super admin bisa hapus semua user kecuali dirinya sendiri
        if ($user->hasRole('super-admin')) {
            return $user->id !== $model->id;
        }

        // Admin hanya bisa hapus user yang bukan super-admin
        if ($user->hasRole('admin')) {
            return !$model->hasRole('super-admin');
        }

        return false;
    }
} 