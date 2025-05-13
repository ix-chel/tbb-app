<?php

namespace App\Policies;

use App\Models\MaintenanceSchedule;
use App\Models\User;

class MaintenanceSchedulePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super-admin', 'Admin', 'technician', 'Client']);
    }

    public function view(User $user, MaintenanceSchedule $schedule): bool
    {
        return $this->canAccessSchedule($user, $schedule);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['super-admin', 'Admin']);
    }

    public function update(User $user, MaintenanceSchedule $schedule): bool
    {
        return $this->canAccessSchedule($user, $schedule);
    }

    public function delete(User $user, MaintenanceSchedule $schedule): bool
    {
        return $user->hasAnyRole(['super-admin', 'Admin']);
    }

    private function canAccessSchedule(User $user, MaintenanceSchedule $schedule): bool
    {
        if ($user->hasAnyRole(['super-admin', 'Admin'])) {
            return true;
        }

        if ($user->hasRole('technician') && $schedule->user_id === $user->id) {
            return true;
        }

        if ($user->hasRole('Client') && $schedule->store && $schedule->store->company_id === $user->company_id) {
            return true;
        }

        return false;
    }
}
