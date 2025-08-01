<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaintenanceReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'technician_id',
        'equipment_status',
        'filter_changed',
        'filter_type',
        'notes',
        'photo_paths',
        'status',
        'checklist_items',
        'filter_condition_notes',
        'photo_path',
        'admin_notes',
        'approved_at',
        'revision_requested_at'
    ];

    protected $casts = [
        'filter_changed' => 'boolean',
        'photo_paths' => 'array',
        'checklist_items' => 'array',
        'approved_at' => 'datetime',
        'revision_requested_at' => 'datetime'
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function technician(): BelongsTo
    {
        return $this->belongsTo(User::class, 'technician_id');
    }
} 