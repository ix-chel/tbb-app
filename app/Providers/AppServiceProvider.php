<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\Company;
use App\Models\Store;
use App\Models\InventoryItem;
use App\Models\Feedback;
use App\Models\MaintenanceSchedule;
use App\Policies\CompanyPolicy;
use App\Policies\StorePolicy;
use App\Policies\InventoryItemPolicy;
use App\Policies\FeedbackPolicy;
use App\Policies\MaintenanceSchedulePolicy;
use Spatie\Permission\Models\Role;

class AppServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Company::class => CompanyPolicy::class,
        Store::class => StorePolicy::class,
        MaintenanceSchedule::class => MaintenanceSchedulePolicy::class,
        InventoryItem::class => InventoryItemPolicy::class,
        Feedback::class => FeedbackPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
} 