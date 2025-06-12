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

    /**
     * Relasi ke store
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Relasi ke filter
     */
    public function filter(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class, 'filter_id');
    }

    /**
     * Relasi ke inventory item
     */
    public function inventoryItem(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class, 'filter_id');
    }

    /**
     * Scope untuk QR code yang aktif
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope untuk QR code yang expired
     */
    public function scopeExpired($query)
    {
        return $query->where('expiry_date', '<', now());
    }

    /**
     * Cek apakah QR code sudah expired
     */
    public function isExpired(): bool
    {
        return $this->expiry_date && $this->expiry_date->isPast();
    }

    /**
     * Scope untuk QR code yang akan expired dalam 30 hari
     */
    public function scopeExpiringSoon($query)
    {
        return $query->where('status', 'active')
            ->whereNotNull('expiry_date')
            ->where('expiry_date', '<=', now()->addDays(30))
            ->where('expiry_date', '>', now());
    }

    /**
     * Cek apakah QR code akan expired dalam X hari
     */
    public function isExpiringSoon(int $days = 30): bool
    {
        return $this->status === 'active' 
            && $this->expiry_date 
            && $this->expiry_date->isFuture()
            && $this->expiry_date->diffInDays(now()) <= $days;
    }

    /**
     * Relasi ke history scan
     */
    public function scanHistory(): HasMany
    {
        return $this->hasMany(QRScanHistory::class);
    }

    /**
     * Relasi ke laporan maintenance
     */
    public function maintenanceReports(): HasMany
    {
        return $this->hasMany(MaintenanceReport::class);
    }
} 