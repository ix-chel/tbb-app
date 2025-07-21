<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaintenanceSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'user_id', // ID Teknisi
        'scheduled_at',
        'completed_at',
        'notes',
        'status',
    ];

   
    protected $casts = [
        'scheduled_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

   
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

  
    public function technician(): BelongsTo
    {
     
        return $this->belongsTo(User::class, 'user_id');
    }

    public const STATUSES = ['scheduled', 'in_progress', 'completed', 'cancelled'];

}