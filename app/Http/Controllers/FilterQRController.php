<?php

namespace App\Http\Controllers;

use App\Http\Requests\ScanQRRequest;
use App\Http\Requests\StoreFilterQRRequest;
use App\Http\Requests\UpdateFilterQRRequest;
use App\Models\FilterQR;
use App\Models\InventoryItem;
use App\Models\Store;
use App\Services\FilterQRService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class FilterQRController extends Controller
{
    use AuthorizesRequests;

    public function __construct(private readonly FilterQRService $filterQRService) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', FilterQR::class);

        $qrs = $this->filterQRService->index($request->only(['search', 'status']));

        return Inertia::render('FilterQR/Index', [
            'qrs'     => $qrs,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', FilterQR::class);

        return Inertia::render('FilterQR/Create', [
            'stores'  => Store::select(['id', 'name', 'address', 'contact_person', 'contact_phone', 'contact_email'])->get(),
            'filters' => InventoryItem::where('type', 'filter')->select(['id', 'name', 'type'])->get(),
        ]);
    }

    public function store(StoreFilterQRRequest $request)
    {
        try {
            $this->filterQRService->create($request->validated());
        } catch (\RuntimeException $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }

        return redirect()->route('FilterQR.index')
            ->with('message', 'QR code created successfully.');
    }

    public function show(FilterQR $filterQR): Response
    {
        $this->authorize('view', $filterQR);

        $filterQR->load(['store', 'filter']);

        return Inertia::render('FilterQR/Show', [
            'qr' => [
                'id'                => $filterQR->id,
                'qr_code'           => $filterQR->qr_code,
                'status'            => $filterQR->status,
                'is_expired'        => $filterQR->isExpired(),
                'installation_date' => $filterQR->installation_date?->toDateString(),
                'expiry_date'       => $filterQR->expiry_date?->toDateString(),
                'last_scan_at'      => $filterQR->last_scan_at?->toIso8601String(),
                'notes'             => $filterQR->notes,
                'contact_person'    => $filterQR->contact_person,
                'contact_phone'     => $filterQR->contact_phone,
                'contact_email'     => $filterQR->contact_email,
                'store_id'          => $filterQR->store_id,
                'store'             => $filterQR->store,
                'filter_id'         => $filterQR->filter_id,
                'filter'            => $filterQR->filter,
            ],
        ]);
    }

    public function edit(FilterQR $filterQR): Response
    {
        $this->authorize('update', $filterQR);

        return Inertia::render('FilterQR/Edit', ['qr' => $filterQR]);
    }

    public function update(UpdateFilterQRRequest $request, FilterQR $filterQR)
    {
        $this->filterQRService->update($filterQR, $request->validated());

        return redirect()->route('FilterQR.show', $filterQR)
            ->with('message', 'QR code updated successfully.');
    }

    public function destroy(FilterQR $filterQR)
    {
        $this->authorize('delete', $filterQR);
        $this->filterQRService->destroy($filterQR);

        return redirect()->route('FilterQR.index')
            ->with('message', 'QR code deleted successfully.');
    }

    /**
     * Scan QR code — accessible via API with Sanctum token.
     */
    public function scan(ScanQRRequest $request)
    {
        try {
            $filterQR = $this->filterQRService->scan($request->validated('qr_code'));
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'QR code not found',
                'data'    => null,
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'QR code scanned successfully',
            'data'    => $filterQR,
        ]);
    }

    public function download(FilterQR $filterQR)
    {
        $this->authorize('view', $filterQR);

        return $this->filterQRService->download($filterQR);
    }
}