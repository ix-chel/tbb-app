<?php

namespace App\Policies;

use App\Models\StoreQR;
use App\Models\User;
use App\Models\Store;
use Illuminate\Auth\Access\HandlesAuthorization;

class StoreQRPolicy
{
    use HandlesAuthorization;

    public function before(User $user, string $ability): bool|null
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }
        return null;
    }

    public function viewAny(User $user)
    {
        return $user->hasRole(['super-admin', 'admin']);
    }

    public function view(User $user, StoreQR $qr)
    {
        return $user->hasRole('admin') && $user->company_id === $qr->store->company_id;
    }

    public function generate(User $user, Store $store)
    {
        return $user->hasRole('admin') && 
            $user->company_id === $store->company_id && 
            $store->status === 'verified';
    }

    public function download(User $user, StoreQR $qr)
    {
        return $user->hasRole('admin') && $user->company_id === $qr->store->company_id;
    }

    public function update(User $user, StoreQR $qr)
    {
        return $user->hasRole('admin') && $user->company_id === $qr->store->company_id;
    }
}
 