<?php

namespace App\Services;

use App\Models\Feedback;
use App\Traits\LogsActivity;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class FeedbackService
{
    use LogsActivity;

    public function index(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        return Feedback::with(['user:id,name', 'store:id,name'])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('comment', 'like', "%{$search}%")
                      ->orWhereHas('user', fn($uq) => $uq->where('name', 'like', "%{$search}%"))
                      ->orWhereHas('store', fn($sq) => $sq->where('name', 'like', "%{$search}%"));
                });
            })
            ->when($filters['type'] ?? null, fn($q, $type) => $q->where('type', $type))
            ->when($filters['status'] ?? null, fn($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function store(array $data, int $userId): Feedback
    {
        $feedback = Feedback::create(array_merge($data, [
            'user_id' => $userId,
            'status'  => 'pending',
        ]));

        $this->logActivity('feedback.submitted', [
            'feedback_id' => $feedback->id,
            'type'        => $feedback->type,
        ]);

        return $feedback;
    }

    public function update(Feedback $feedback, array $data, int $adminId): Feedback
    {
        $feedback->update([
            'admin_response' => $data['admin_response'] ?? null,
            'status'         => $data['status'],
        ]);

        $this->logActivity('feedback.updated', [
            'feedback_id' => $feedback->id,
            'new_status'  => $data['status'],
            'admin_id'    => $adminId,
        ]);

        return $feedback->fresh();
    }

    public function destroy(Feedback $feedback): void
    {
        $this->logActivity('feedback.deleted', ['feedback_id' => $feedback->id]);
        $feedback->delete();
    }
}
