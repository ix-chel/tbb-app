<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFeedbackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('feedback'));
    }

    public function rules(): array
    {
        return [
            'admin_response' => 'nullable|string|max:5000',
            'status'         => ['required', Rule::in(['new', 'in_progress', 'resolved', 'closed'])],
        ];
    }
}
