<?php

namespace App\Policies;

use App\Models\MaintenanceReport;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class MaintenanceReportPolicy
{
    use HandlesAuthorization;

    public function before(User $user, string $ability): bool|null
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }
        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasRole(['admin', 'technician']);
    }

    public function view(User $user, MaintenanceReport $report): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        if ($user->hasRole('technician')) {
            return $report->technician_id === $user->id;
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('technician');
    }

    public function update(User $user, MaintenanceReport $report): bool
    {
        return $user->hasRole('admin');
    }

    public function delete(User $user, MaintenanceReport $report): bool
    {
        return $user->hasRole('admin');
    }
} 