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
        'type',
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

 
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

  
    public function lastUpdater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'last_updated_by');
    }

   
    public function scopeLowStock($query)
    {
        return $query->where('quantity', '<=', 10);
    }

 
    public function scopeOutOfStock($query)
    {
        return $query->where('quantity', '=', 0);
    }

 
    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

   
    public function scopeFilters($query)
    {
        return $query->where('type', 'filter');
    }

    
    public function scopeMesin($query)
    {
        return $query->where('type', 'mesin');
    }

   
    public function scopeAlat($query)
    {
        return $query->where('type', 'alat');
    }

  
    public function scopeSparepart($query)
    {
        return $query->where('type', 'sparepart');
    }

    public function scopeByLocation($query, string $location)
    {
        return $query->where('location', 'like', "%{$location}%");
    }

   
    public function isLowStock(): bool
    {
        return $this->low_stock_threshold !== null 
            && $this->quantity <= $this->low_stock_threshold;
    }

   
    public function isOutOfStock(): bool
    {
        return $this->quantity <= 0;
    }
}
