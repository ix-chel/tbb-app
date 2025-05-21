<?php

namespace App\Http\Controllers;

use App\Models\MaintenanceSchedule;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class MaintenanceScheduleController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): InertiaResponse
    {
        $this->authorize('viewAny', MaintenanceSchedule::class);
        $user = Auth::user();

        $query = MaintenanceSchedule::with(['store', 'technician']);

        // Role-based filter
        if ($user->hasRole('Client')) {
            $query->whereHas('store', fn ($q) => $q->where('company_id', $user->company_id));
        } elseif ($user->hasRole('technician')) {
            $query->where('user_id', $user->id);
        }

        // Input-based filter
        $this->applyFilters($request, $query);

        $schedules = $query->orderBy('scheduled_at', 'asc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('schedules/index', [
            'schedules' => $schedules,
            'filters' => $request->only(['status', 'store_id', 'technician_id', 'date_from', 'date_to']),
            'stores' => Store::orderBy('name')->get(['id', 'name']),
            'technicians' => User::role('technician')->orderBy('name')->get(['id', 'name']),
            'statuses' => MaintenanceSchedule::STATUSES,
        ]);
    }

    public function create(): InertiaResponse
    {
        $this->authorize('create', MaintenanceSchedule::class);

        return Inertia::render('schedules/create', [
            'stores' => Store::orderBy('name')->get(['id', 'name']),
            'technicians' => User::role('technician')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', MaintenanceSchedule::class);
        $data = $this->validateSchedule($request);
        MaintenanceSchedule::create($data);

        return Redirect::route('schedules.index')->with('message', 'Schedule created.');
    }

    public function show(MaintenanceSchedule $schedule): RedirectResponse
    {
        $this->authorize('update', $schedule);
        return Redirect::route('schedules.edit', $schedule->id);
    }

    public function edit(MaintenanceSchedule $schedule): InertiaResponse
    {
        $this->authorize('update', $schedule);
        $schedule->load(['store', 'technician']);

        return Inertia::render('schedules/edit', [
            'schedule' => $schedule,
            'stores' => Store::orderBy('name')->get(['id', 'name']),
            'technicians' => User::role('technician')->orderBy('name')->get(['id', 'name']),
            'statuses' => MaintenanceSchedule::STATUSES,
        ]);
    }

    public function update(Request $request, MaintenanceSchedule $schedule): RedirectResponse
    {
        $this->authorize('update', $schedule);
        $data = $this->validateSchedule($request, true);

        if (($data['status'] ?? null) === 'completed' && !isset($data['completed_at'])) {
            if (is_null($schedule->completed_at)) {
                $data['completed_at'] = now();
            }
        }

        $schedule->update($data);
        return Redirect::route('schedules.index')->with('message', 'Schedule updated.');
    }

    public function destroy(MaintenanceSchedule $schedule): RedirectResponse
    {
        $this->authorize('delete', $schedule);
        $schedule->delete();

        return Redirect::route('schedules.index')->with('message', 'Schedule deleted.');
    }

    // ======================
    // Private helpers below
    // ======================

    private function applyFilters(Request $request, $query): void
    {
        $query
            ->when($request->status, fn ($q, $v) => $q->where('status', $v))
            ->when($request->store_id, fn ($q, $v) => $q->where('store_id', $v))
            ->when($request->technician_id, fn ($q, $v) => $q->where('user_id', $v))
            ->when($request->date_from, fn ($q, $v) => $q->whereDate('scheduled_at', '>=', $v))
            ->when($request->date_to, fn ($q, $v) => $q->whereDate('scheduled_at', '<=', $v));
    }

    private function validateSchedule(Request $request, bool $isUpdate = false): array
    {
        $rules = [
            'store_id' => [$isUpdate ? 'sometimes' : 'required', 'exists:stores,id'],
            'user_id' => ['nullable', 'exists:users,id'],
            'scheduled_at' => [$isUpdate ? 'sometimes' : 'required', 'date'],
            'completed_at' => ['nullable', 'date', 'after_or_equal:scheduled_at'],
            'notes' => ['nullable', 'string'],
            'status' => ['sometimes', 'required', Rule::in(MaintenanceSchedule::STATUSES)],
        ];

        return $request->validate($rules);
    }
}
