<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCompanyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Company::class);
    }

    public function rules(): array
    {
        return [
            'name'                 => 'required|string|max:255',
            'email'                => 'nullable|email|max:255|unique:companies,email',
            'phone'                => 'nullable|string|max:20',
            'address'              => 'nullable|string',
            'registration_number'  => 'nullable|string|max:255|unique:companies,registration_number',
            'contact_person_name'  => 'nullable|string|max:255',
            'contact_person_email' => 'nullable|email|max:255',
            'contact_person_phone' => 'nullable|string|max:20',
        ];
    }
}
