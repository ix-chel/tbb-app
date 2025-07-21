<?php

namespace App\Models;

use App\Models\InventoryItem;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FilterQR extends Model
{
    use HasFactory;

    protected $table = 'filter_qrs';

    protected $fillable = [
        'store_id',
        'filter_id',
        'qr_code',
        'status',
        'last_scan_at',
        'installation_date',
        'expiry_date',
        'notes',
        'contact_person',
        'contact_phone',
        'contact_email'
    ];

    protected $casts = [
        'last_scan_at' => 'datetime',
        'installation_date' => 'datetime',
        'expiry_date' => 'datetime',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }


    public function filter(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class, 'filter_id');
    }

   
    public function inventoryItem(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class, 'filter_id');
    }


    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }


    public function scopeExpired($query)
    {
        return $query->where('expiry_date', '<', now());
    }

 
    public function isExpired(): bool
    {
        return $this->expiry_date && $this->expiry_date->isPast();
    }

   
    public function scopeExpiringSoon($query)
    {
        return $query->where('status', 'active')
            ->whereNotNull('expiry_date')
            ->where('expiry_date', '<=', now()->addDays(30))
            ->where('expiry_date', '>', now());
    }

   
    public function isExpiringSoon(int $days = 30): bool
    {
        return $this->status === 'active' 
            && $this->expiry_date 
            && $this->expiry_date->isFuture()
            && $this->expiry_date->diffInDays(now()) <= $days;
    }

    
    public function scanHistory(): HasMany
    {
        return $this->hasMany(QRScanHistory::class);
    }

   
    public function maintenanceReports(): HasMany
    {
        return $this->hasMany(MaintenanceReport::class);
    }
} 