<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FeedbackResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'type'           => $this->type,
            'rating'         => $this->rating,
            'comment'        => $this->comment,
            'status'         => $this->status,
            'admin_response' => $this->admin_response,
            'user_id'        => $this->user_id,
            'store_id'       => $this->store_id,
            'user'           => $this->whenLoaded('user', fn() => [
                'id'   => $this->user->id,
                'name' => $this->user->name,
            ]),
            'store'          => new StoreResource($this->whenLoaded('store')),
            'created_at'     => $this->created_at?->toIso8601String(),
            'updated_at'     => $this->updated_at?->toIso8601String(),
        ];
    }
}
