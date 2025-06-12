<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaintenanceReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'filter_qr_id',
        'user_id',
        'report_date',
        'status',
        'description',
        'action_taken',
        'next_maintenance_date',
        'images'
    ];

    protected $casts = [
        'report_date' => 'datetime',
        'next_maintenance_date' => 'datetime',
        'images' => 'array'
    ];

    public function filterQR(): BelongsTo
    {
        return $this->belongsTo(FilterQR::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
} 