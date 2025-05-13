<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InventoryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'sku',
        'quantity',
        'unit',
        'location',
        'description',
        'store_id',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];

    /**
     * Relasi ke store
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Relasi ke user yang terakhir mengupdate item
     */
    public function lastUpdater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'last_updated_by');
    }

    /**
     * Scope untuk item dengan stok rendah
     */
    public function scopeLowStock($query)
    {
        return $query->where('quantity', '<=', 10);
    }

    /**
     * Scope untuk item dengan stok habis
     */
    public function scopeOutOfStock($query)
    {
        return $query->where('quantity', '=', 0);
    }

    /**
     * Scope untuk mencari berdasarkan tipe item
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('sku', 'like', "{$type}-%");
    }

    /**
     * Scope untuk mencari berdasarkan lokasi
     */
    public function scopeByLocation($query, string $location)
    {
        return $query->where('location', 'like', "%{$location}%");
    }

    /**
     * Cek apakah item memiliki stok rendah
     */
    public function isLowStock(): bool
    {
        return $this->low_stock_threshold !== null 
            && $this->quantity <= $this->low_stock_threshold;
    }

    /**
     * Cek apakah item stok habis
     */
    public function isOutOfStock(): bool
    {
        return $this->quantity <= 0;
    }
}
