<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QRScanHistoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'store_qr_id' => $this->store_qr_id,
            'user_id'     => $this->user_id,
            'scanned_at'  => $this->scanned_at?->toIso8601String(),
            'notes'       => $this->notes,
            'scanner'     => $this->whenLoaded('scanner', fn() => [
                'id'   => $this->scanner->id,
                'name' => $this->scanner->name,
            ]),
        ];
    }
}
