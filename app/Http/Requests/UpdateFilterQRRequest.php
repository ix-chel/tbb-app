<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFilterQRRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('filterQR'));
    }

    public function rules(): array
    {
        return [
            'status'         => 'required|in:active,inactive,expired',
            'notes'          => 'nullable|string',
            'contact_person' => 'nullable|string|max:255',
            'contact_phone'  => 'nullable|string|max:20',
            'contact_email'  => 'nullable|email|max:255',
        ];
    }
}
