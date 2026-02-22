<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMaintenanceReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\MaintenanceReport::class);
    }

    public function rules(): array
    {
        return [
            'store_id'               => 'sometimes|required|exists:stores,id',
            'equipment_status'       => 'required|in:good,needs_attention,broken',
            'filter_changed'         => 'required|boolean',
            'filter_type'            => 'nullable|string|max:255',
            'notes'                  => 'nullable|string|max:5000',
            'filter_condition_notes' => 'nullable|string|max:5000',
            'photos'                 => 'nullable|array|max:5',
            'photos.*'               => 'image|max:5120', // 5MB per image
        ];
    }
}
