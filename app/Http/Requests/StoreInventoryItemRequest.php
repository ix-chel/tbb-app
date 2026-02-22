<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInventoryItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\InventoryItem::class);
    }

    public function rules(): array
    {
        return [
            'name'                => 'required|string|max:255',
            'type'                => 'required|string|in:filter,mesin,alat,sparepart',
            'sku'                 => 'required|string|max:255|unique:inventory_items,sku',
            'quantity'            => 'required|integer|min:0',
            'unit'                => 'required|string|max:50',
            'location'            => 'nullable|string|max:255',
            'description'         => 'nullable|string',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'store_id'            => 'required|exists:stores,id',
        ];
    }
}
