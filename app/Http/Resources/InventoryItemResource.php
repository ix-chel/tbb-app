<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventoryItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'name'                => $this->name,
            'type'                => $this->type,
            'sku'                 => $this->sku,
            'quantity'            => $this->quantity,
            'unit'                => $this->unit,
            'location'            => $this->location,
            'description'         => $this->description,
            'low_stock_threshold' => $this->low_stock_threshold,
            'is_low_stock'        => $this->isLowStock(),
            'is_out_of_stock'     => $this->isOutOfStock(),
            'store_id'            => $this->store_id,
            'store'               => new StoreResource($this->whenLoaded('store')),
            'last_updated_by'     => $this->whenLoaded('lastUpdater', fn() => [
                'id'   => $this->lastUpdater->id,
                'name' => $this->lastUpdater->name,
            ]),
            'updated_at'          => $this->updated_at?->toIso8601String(),
        ];
    }
}
