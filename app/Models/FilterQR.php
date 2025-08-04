<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
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
        'contact_email',
    ];

    protected $casts = [
        'last_scan_at' => 'datetime',
        'installation_date' => 'datetime',
        'expiry_date' => 'datetime',
    ];

    // =============================
    // Relasi
    // =============================

    /**
     * Relasi ke store.
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Relasi ke filter (inventory item).
     */
    public function filter(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class, 'filter_id');
    }

    /**
     * Alias (tidak wajib, sudah ada filter())
     * Bisa dihapus jika tidak dibutuhkan ganda.
     */
    public function inventoryItem(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class, 'filter_id');
    }

    /**
     * Relasi ke riwayat scan.
     */
    public function scanHistory(): HasMany
    {
        return $this->hasMany(QRScanHistory::class);
    }

    /**
     * Relasi ke laporan maintenance.
     */
    public function maintenanceReports(): HasMany
    {
        return $this->hasMany(MaintenanceReport::class);
    }

    // =============================
    // Scopes
    // =============================

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeExpired($query)
    {
        return $query->where('expiry_date', '<', now());
    }

    public function scopeExpiringSoon($query)
    {
        return $query->where('status', 'active')
            ->whereNotNull('expiry_date')
            ->whereBetween('expiry_date', [now(), now()->addDays(30)]);
    }

    // =============================
    // Helpers
    // =============================

    public function isExpired(): bool
    {
        return $this->expiry_date && $this->expiry_date->isPast();
    }

    public function isExpiringSoon(int $days = 30): bool
    {
        return $this->status === 'active'
            && $this->expiry_date
            && $this->expiry_date->isFuture()
            && $this->expiry_date->diffInDays(now()) <= $days;
    }
}
