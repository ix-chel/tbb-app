<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QRScanHistory extends Model
{
    use HasFactory;

    protected $table = 'qr_scan_histories';

    protected $fillable = [
        'store_qr_id',
        'user_id',
        'scanned_at',
        'notes'
    ];

    protected $casts = [
        'scanned_at' => 'datetime'
    ];

    public function storeQR()
    {
        return $this->belongsTo(StoreQR::class, 'store_qr_id');
    }

    public function scanner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function store()
    {
        return $this->storeQR->store();
    }
} 