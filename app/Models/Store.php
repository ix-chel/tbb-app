<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Store extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'phone',
        'company_id',
    ];

    /**
     * Mendapatkan company yang memiliki store ini.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function maintenanceScehudule(): HasMany
    {
        return $this->hasMany(MaintenanceSchedule::class);
    }
}
