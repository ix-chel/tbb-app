<?php

namespace App\Services;

use App\Models\MaintenanceReport;
use App\Models\Store;
use App\Traits\LogsActivity;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MaintenanceService
{
    use LogsActivity;

    public function index(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return MaintenanceReport::with(['store:id,name', 'technician:id,name'])
            ->when($filters['status'] ?? null, fn($q, $status) => $q->where('status', $status))
            ->when($filters['store_id'] ?? null, fn($q, $id) => $q->where('store_id', $id))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Submit a new maintenance report.
     * Wraps photo upload + DB insert in a transaction for atomicity.
     *
     * @param array             $data         Validated request data
     * @param int               $technicianId Authenticated user ID
     * @param Store|null        $store        Route-model-bound store (if coming via store route)
     * @param UploadedFile[]    $photos       Array of uploaded photo files
     */
    public function submit(array $data, int $technicianId, ?Store $store = null, array $photos = []): MaintenanceReport
    {
        return DB::transaction(function () use ($data, $technicianId, $store, $photos) {
            $photoPaths = [];
            foreach ($photos as $photo) {
                $photoPaths[] = $photo->store('maintenance-photos', 'public');
            }

            $report = MaintenanceReport::create([
                'store_id'       => $store?->id ?? $data['store_id'],
                'technician_id'  => $technicianId,
                'equipment_status'      => $data['equipment_status'],
                'filter_changed'        => $data['filter_changed'],
                'filter_type'           => $data['filter_type'] ?? null,
                'notes'                 => $data['notes'] ?? null,
                'filter_condition_notes' => $data['filter_condition_notes'] ?? null,
                'photo_paths'    => count($photoPaths) ? json_encode($photoPaths) : null,
                'status'         => 'pending',
            ]);

            $this->logActivity('maintenance_report.submitted', [
                'report_id'    => $report->id,
                'store_id'     => $report->store_id,
                'technician_id' => $technicianId,
            ]);

            return $report;
        });
    }

    public function approve(MaintenanceReport $report, int $adminId): MaintenanceReport
    {
        DB::transaction(function () use ($report, $adminId) {
            $report->update([
                'status'      => 'approved',
                'approved_at' => now(),
            ]);

            $this->logActivity('maintenance_report.approved', [
                'report_id' => $report->id,
                'admin_id'  => $adminId,
            ]);
        });

        return $report->fresh();
    }

    public function requestRevision(MaintenanceReport $report, array $data, int $adminId): MaintenanceReport
    {
        DB::transaction(function () use ($report, $data, $adminId) {
            $report->update([
                'status'                   => 'revision_needed',
                'admin_notes'              => $data['admin_notes'],
                'revision_requested_at'    => now(),
            ]);

            $this->logActivity('maintenance_report.revision_requested', [
                'report_id' => $report->id,
                'admin_id'  => $adminId,
            ]);
        });

        return $report->fresh();
    }

    public function destroy(MaintenanceReport $report): void
    {
        DB::transaction(function () use ($report) {
            // Clean up any stored photos
            if ($report->photo_paths) {
                $paths = json_decode($report->photo_paths, true) ?? [];
                foreach ($paths as $path) {
                    Storage::disk('public')->delete($path);
                }
            }
            if ($report->photo_path) {
                Storage::disk('public')->delete($report->photo_path);
            }

            $this->logActivity('maintenance_report.deleted', ['report_id' => $report->id]);

            $report->delete();
        });
    }
}
