<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Store extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'phone',
        'email',
        'company_id',
        'status',
        'verified_at',
        'verified_by'
    ];

    protected $casts = [
        'verified_at' => 'datetime',
    ];

    /**
     * Mendapatkan company yang memiliki store ini.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function qrCodes(): HasMany
    {
        return $this->hasMany(StoreQR::class);
    }

    public function maintenanceReports(): HasMany
    {
        return $this->hasMany(MaintenanceReport::class);
    }

    public function verify(User $user)
    {
        $this->update([
            'status' => 'verified',
            'verified_at' => now(),
            'verified_by' => $user->id
        ]);
    }

    public function reject()
    {
        $this->update([
            'status' => 'rejected',
            'verified_at' => null,
            'verified_by' => null
        ]);
    }

    public function maintenanceScehudule(): HasMany
    {
        return $this->hasMany(MaintenanceSchedule::class);
    }
}
