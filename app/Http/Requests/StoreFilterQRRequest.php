<?php

namespace App\Http\Requests;

use App\Models\InventoryItem;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFilterQRRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\FilterQR::class);
    }

    public function rules(): array
    {
        return [
            'store_id'          => 'required|exists:stores,id',
            'filter_id'         => [
                'required',
                'exists:inventory_items,id',
                function ($attribute, $value, $fail) {
                    $item = InventoryItem::find($value);
                    if (!$item || $item->type !== 'filter') {
                        $fail('The selected item must be a filter type.');
                    }
                },
            ],
            'installation_date' => 'nullable|date',
            'expiry_date'       => 'nullable|date|after:installation_date',
            'notes'             => 'nullable|string',
            'contact_person'    => 'nullable|string|max:255',
            'contact_phone'     => 'nullable|string|max:20',
            'contact_email'     => 'nullable|email|max:255',
        ];
    }
}
