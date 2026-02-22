<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ScanQRRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authenticated via Sanctum middleware, no additional policy needed
    }

    public function rules(): array
    {
        return [
            'qr_code' => 'required|string|max:255',
            'notes'   => 'nullable|string|max:1000',
        ];
    }
}
