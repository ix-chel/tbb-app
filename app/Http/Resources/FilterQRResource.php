<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FilterQRResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'qr_code'           => $this->qr_code,
            'status'            => $this->status,
            'is_expired'        => $this->isExpired(),
            'is_expiring_soon'  => $this->isExpiringSoon(),
            'installation_date' => $this->installation_date?->toDateString(),
            'expiry_date'       => $this->expiry_date?->toDateString(),
            'last_scan_at'      => $this->last_scan_at?->toIso8601String(),
            'notes'             => $this->notes,
            'contact_person'    => $this->contact_person,
            'contact_phone'     => $this->contact_phone,
            'contact_email'     => $this->contact_email,
            'store_id'          => $this->store_id,
            'filter_id'         => $this->filter_id,
            'store'             => new StoreResource($this->whenLoaded('store')),
            'filter'            => new InventoryItemResource($this->whenLoaded('filter')),
            'created_at'        => $this->created_at?->toIso8601String(),
            'updated_at'        => $this->updated_at?->toIso8601String(),
        ];
    }
}
