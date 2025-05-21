<?php

namespace App\Policies;

use App\Models\FilterQR;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class FilterQRPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super-admin', 'admin', 'technician']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, FilterQR $filterQR): bool
    {
        return $user->hasAnyRole(['super-admin', 'admin', 'technician']);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasAnyRole(['super-admin', 'admin']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, FilterQR $filterQR): bool
    {
        return $user->hasAnyRole(['super-admin', 'admin']);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, FilterQR $filterQR): bool
    {
        return $user->hasAnyRole(['super-admin', 'admin']);
    }
} 