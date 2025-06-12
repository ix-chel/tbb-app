<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StoreQR extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'qr_code',
        'qr_path',
        'scan_url',
        'generated_by',
        'status'
    ];

    /**
     * Relasi ke store
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function generator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }

    public function scanHistories(): HasMany
    {
        return $this->hasMany(QRScanHistory::class);
    }

    public function maintenanceReports(): HasMany
    {
        return $this->hasMany(MaintenanceReport::class);
    }

    public function getLastScanAttribute()
    {
        return $this->scanHistories()->latest()->first();
    }

    public function getScanCountAttribute()
    {
        return $this->scanHistories()->count();
    }

    public function deactivate()
    {
        $this->update(['status' => 'inactive']);
    }

    public function activate()
    {
        $this->update(['status' => 'active']);
    }
} 