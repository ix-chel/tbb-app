<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFeedbackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Feedback::class);
    }

    public function rules(): array
    {
        return [
            'maintenance_schedule_id' => 'nullable|exists:maintenance_schedules,id',
            'store_id'               => 'nullable|exists:stores,id',
            'type'                   => 'required|string|in:bug_report,suggestion,complaint,compliment',
            'rating'                 => 'nullable|integer|min:1|max:5',
            'comment'                => 'required|string|min:10|max:5000',
        ];
    }
}
