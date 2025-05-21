<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Spatie\Permission\Models\Role;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class UserController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): InertiaResponse
    {
        $this->authorize('viewAny', User::class);

        $query = User::with(['roles', 'company']);

        // Filter berdasarkan pencarian
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        // Filter berdasarkan role
        if ($request->role) {
            $query->whereHas('roles', function ($q) use ($request) {
                $q->where('name', $request->role);
            });
        }

        // Filter berdasarkan perusahaan
        if ($request->company_id) {
            $query->where('company_id', $request->company_id);
        }

        $users = $query->paginate(10)->withQueryString();

        // Format data users untuk menghindari masalah dengan objek role
        $formattedUsers = $users->through(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name')->toArray(),
                'company' => $user->company ? [
                    'id' => $user->company->id,
                    'name' => $user->company->name,
                ] : null,
            ];
        });

        return Inertia::render('users/index', [
            'users' => $formattedUsers,
            'filters' => $request->only(['search', 'role', 'company_id']),
            'roles' => Role::all()->map(fn ($role) => [
                'value' => $role->name,
                'label' => ucfirst($role->name),
            ]),
            'companies' => Company::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function create(): InertiaResponse
    {
        $this->authorize('create', User::class);

        return Inertia::render('users/create', [
            'roles' => Role::all()->map(fn ($role) => [
                'value' => $role->name,
                'label' => ucfirst($role->name),
            ]),
            'companies' => Company::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', User::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|exists:roles,name',
            'company_id' => 'nullable|exists:companies,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'company_id' => $validated['company_id'],
        ]);

        $user->assignRole($validated['role']);

        return redirect()->route('users.index')
            ->with('message', 'User berhasil dibuat.');
    }

    public function edit(User $user): InertiaResponse
    {
        $this->authorize('update', $user);

        return Inertia::render('users/edit', [
            'user' => $user->load('roles'),
            'roles' => Role::all()->map(fn ($role) => [
                'value' => $role->name,
                'label' => ucfirst($role->name),
            ]),
            'companies' => Company::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|exists:roles,name',
            'company_id' => 'nullable|exists:companies,id',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'company_id' => $validated['company_id'],
        ]);

        if ($validated['password']) {
            $user->update([
                'password' => Hash::make($validated['password']),
            ]);
        }

        $user->syncRoles([$validated['role']]);

        return redirect()->route('users.index')
            ->with('message', 'User berhasil diperbarui.');
    }

    public function destroy(User $user): RedirectResponse
    {
        $this->authorize('delete', $user);

        $user->delete();

        return redirect()->route('users.index')
            ->with('message', 'User berhasil dihapus.');
    }
} 