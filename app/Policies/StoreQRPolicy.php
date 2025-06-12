<?php

namespace App\Policies;

use App\Models\StoreQR;
use App\Models\User;
use App\Models\Store;
use Illuminate\Auth\Access\HandlesAuthorization;

class StoreQRPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->hasRole(['super_admin', 'admin']);
    }

    public function view(User $user, StoreQR $qr)
    {
        if ($user->hasRole('super_admin')) {
            return true;
        }

        return $user->hasRole('admin') && $user->company_id === $qr->store->company_id;
    }

    public function generate(User $user, Store $store)
    {
        if ($user->hasRole('super_admin')) {
            return true;
        }

        return $user->hasRole('admin') && 
            $user->company_id === $store->company_id && 
            $store->status === 'verified';
    }

    public function download(User $user, StoreQR $qr)
    {
        if ($user->hasRole('super_admin')) {
            return true;
        }

        return $user->hasRole('admin') && $user->company_id === $qr->store->company_id;
    }

    public function update(User $user, StoreQR $qr)
    {
        if ($user->hasRole('super_admin')) {
            return true;
        }

        return $user->hasRole('admin') && $user->company_id === $qr->store->company_id;
    }
} 