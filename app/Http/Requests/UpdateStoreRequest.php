<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('store'));
    }

    public function rules(): array
    {
        return [
            'name'       => 'required|string|max:255',
            'address'    => 'nullable|string',
            'phone'      => 'nullable|string|max:20',
            'company_id' => 'required|exists:companies,id',
            'contact_person' => 'nullable|string|max:255',
            'contact_phone'  => 'nullable|string|max:20',
            'contact_email'  => 'nullable|email|max:255',
        ];
    }
}
