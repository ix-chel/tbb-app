<?php

namespace App\Policies;

use App\Models\Feedback;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class FeedbackPolicy
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
     * Siapa bisa lihat SEMUA feedback? -> Admin
     */
    public function viewAny(User $user): bool
    {
        return true; // Semua user yang sudah login bisa melihat daftar feedback
    }

    /**
     * Determine whether the user can view the model.
     * Siapa bisa lihat detail feedback? -> Admin atau Client pembuatnya
     */
    public function view(User $user, Feedback $feedback): bool
    {
        return $user->hasRole(['super-admin', 'admin']) || 
               $feedback->user_id === $user->id;
    }

    /**
     * Determine whether the user can create models.
     * Siapa bisa submit feedback baru? -> Hanya Client
     */
    public function create(User $user): bool
    {
        return true; // Semua user yang sudah login bisa membuat feedback
    }

    /**
     * Determine whether the user can update the model.
     * Siapa bisa update feedback? -> Umumnya tidak bisa, kita return false.
     * Jika perlu, bisa dimodifikasi (misal Admin bisa edit status moderasi)
     */
    public function update(User $user, Feedback $feedback): bool
    {
        return $user->hasRole(['super-admin', 'admin']) || 
               $feedback->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     * Siapa bisa hapus feedback? -> Admin atau Client pembuatnya
     */
    public function delete(User $user, Feedback $feedback): bool
    {
        return $user->hasRole(['super-admin', 'admin']) || 
               $feedback->user_id === $user->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Feedback $feedback): bool
    {
        return $user->hasRole(['super-admin', 'admin']);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Feedback $feedback): bool
    {
        return $user->hasRole(['super-admin', 'admin']);
    }
}