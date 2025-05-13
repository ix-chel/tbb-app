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

    // Tipe data casting untuk tanggal
    protected $casts = [
        'scheduled_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    // Relasi ke Store
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    // Relasi ke User (Teknisi)
    public function technician(): BelongsTo
    {
        // Nama relasi 'technician' agar lebih jelas
        // Foreign key nya tetap 'user_id'
        return $this->belongsTo(User::class, 'user_id');
    }

    public const STATUSES = ['scheduled', 'in_progress', 'completed', 'cancelled'];

}