<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MaintenanceReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                     => $this->id,
            'store_id'               => $this->store_id,
            'technician_id'          => $this->technician_id,
            'equipment_status'       => $this->equipment_status,
            'filter_changed'         => (bool) $this->filter_changed,
            'filter_type'            => $this->filter_type,
            'notes'                  => $this->notes,
            'filter_condition_notes' => $this->filter_condition_notes,
            'photo_paths'            => $this->photo_paths ? json_decode($this->photo_paths, true) : [],
            'status'                 => $this->status,
            'admin_notes'            => $this->admin_notes,
            'approved_at'            => $this->approved_at?->toIso8601String(),
            'revision_requested_at'  => $this->revision_requested_at?->toIso8601String(),
            'store'                  => new StoreResource($this->whenLoaded('store')),
            'technician'             => $this->whenLoaded('technician', fn() => [
                'id'   => $this->technician->id,
                'name' => $this->technician->name,
            ]),
            'created_at'             => $this->created_at?->toIso8601String(),
            'updated_at'             => $this->updated_at?->toIso8601String(),
        ];
    }
}
