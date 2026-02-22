<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StoreResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'address'        => $this->address,
            'phone'          => $this->phone,
            'contact_person' => $this->contact_person,
            'contact_phone'  => $this->contact_phone,
            'contact_email'  => $this->contact_email,
            'company_id'     => $this->company_id,
            'company'        => new CompanyResource($this->whenLoaded('company')),
            'qr_codes_count' => $this->whenCounted('qrCodes'),
            'created_at'     => $this->created_at?->toIso8601String(),
            'updated_at'     => $this->updated_at?->toIso8601String(),
        ];
    }
}
