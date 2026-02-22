<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCompanyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('company'));
    }

    public function rules(): array
    {
        $company = $this->route('company');

        return [
            'name'                 => 'required|string|max:255',
            'email'                => ['nullable', 'email', 'max:255', Rule::unique('companies')->ignore($company->id)],
            'phone'                => 'nullable|string|max:20',
            'address'              => 'nullable|string',
            'registration_number'  => ['nullable', 'string', 'max:255', Rule::unique('companies')->ignore($company->id)],
            'contact_person_name'  => 'nullable|string|max:255',
            'contact_person_email' => 'nullable|email|max:255',
            'contact_person_phone' => 'nullable|string|max:20',
        ];
    }
}
