<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'registration_number',
        'contact_person_name',
        'contact_person_email',
        'contact_person_phone',
    ];

    /**
     * Mendapatkan semua store yang dimiliki company ini.
     */
    public function stores(): HasMany
    {
        return $this->hasMany(Store::class);
    }

    /**
     * Mendapatkan semua user (client) yang dimiliki company ini.
     */
    public function users(): HasMany
    {
        // Asumsi role 'client' terikat pada company
        return $this->hasMany(User::class);
    }
}