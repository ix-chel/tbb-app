<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMaintenanceReportRequest;
use App\Models\MaintenanceReport;
use App\Models\Store;
use App\Services\MaintenanceService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class MaintenanceController extends Controller
{
    use AuthorizesRequests;

    public function __construct(private readonly MaintenanceService $maintenanceService) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', MaintenanceReport::class);

        $reports = $this->maintenanceService->index($request->only(['search', 'status', 'store_id']));
        $stores  = Store::orderBy('name')->get(['id', 'name']);

        return Inertia::render('maintenance/index', [
            'reports' => $reports,
            'filters' => (object) $request->only(['search', 'status', 'store_id']),
            'stores'  => $stores,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', MaintenanceReport::class);

        return Inertia::render('maintenance/create', [
            'stores' => Store::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreMaintenanceReportRequest $request): RedirectResponse
    {
        try {
            $this->maintenanceService->submitReport(
                $request->validated(),
                $request->file('photos') ?? [],
                $request->user()->id
            );
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to submit report. Please try again.']);
        }

        return Redirect::route('maintenance.index')
            ->with('success', 'Maintenance report submitted successfully.');
    }

    public function show(MaintenanceReport $maintenanceReport): Response
    {
        $this->authorize('view', $maintenanceReport);

        return Inertia::render('maintenance/show', [
            'report' => $maintenanceReport->load(['store:id,name,address', 'technician:id,name']),
        ]);
    }

    public function approve(MaintenanceReport $maintenanceReport): RedirectResponse
    {
        $this->authorize('approve', $maintenanceReport);

        $this->maintenanceService->approve($maintenanceReport, request()->user()->id);

        return Redirect::back()->with('success', 'Report approved.');
    }

    public function requestRevision(MaintenanceReport $maintenanceReport): RedirectResponse
    {
        $this->authorize('approve', $maintenanceReport);

        $notes = request()->validate(['notes' => 'nullable|string|max:5000'])['notes'] ?? null;
        $this->maintenanceService->requestRevision($maintenanceReport, request()->user()->id, $notes);

        return Redirect::back()->with('success', 'Revision requested.');
    }

    public function destroy(MaintenanceReport $maintenanceReport): RedirectResponse
    {
        $this->authorize('delete', $maintenanceReport);
        $this->maintenanceService->destroy($maintenanceReport);

        return Redirect::route('maintenance.index')
            ->with('success', 'Report deleted successfully.');
    }
}