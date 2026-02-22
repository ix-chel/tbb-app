<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $sharedData = [
            ...parent::share($request),
            'name'        => config('app.name'),
            'quote'       => ['message' => trim($message), 'author' => trim($author)],
            'ziggy'       => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'csrf_token'  => csrf_token(),
        ];

        if ($user = $request->user()) {
            $user->load(['roles', 'permissions']);

            $sharedData['auth'] = [
                'user'      => $user->only('id', 'name', 'email'),
                'role_name' => $user->getRoleNames()->first(),
            ];

            $sharedData['menus'] = $this->buildMenus($user);
        }

        return $sharedData;
    }

    /**
     * Build the navigation menu array based on the user's role.
     * Uses hasRole() (never throws) instead of hasPermissionTo() (throws when permissions aren't seeded).
     *
     * Expected counts: super-admin=5, admin=4, technician=4, client=2
     */
    private function buildMenus($user): array
    {
        $menus = [];

        // 1. Dashboard — always visible
        $menus[] = ['label' => 'Dashboard', 'route' => 'dashboard'];

        // 2. Companies — super-admin only
        if ($user->hasRole('super-admin')) {
            $menus[] = ['label' => 'Companies', 'route' => 'companies.index'];
        }

        // 3. Stores — super-admin, admin, technician (clients use direct store links, not the index)
        if ($user->hasRole(['super-admin', 'admin', 'technician'])) {
            $menus[] = ['label' => 'Stores', 'route' => 'stores.index'];
        }

        // 4. Inventory — super-admin, admin, technician
        if ($user->hasRole(['super-admin', 'admin', 'technician'])) {
            $menus[] = ['label' => 'Inventory', 'route' => 'inventory.index'];
        }

        // 5. Feedback — all roles
        $menus[] = ['label' => 'Feedback', 'route' => 'feedback.index'];

        return $menus;
    }
}
