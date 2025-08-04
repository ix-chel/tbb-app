<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Mobile Development Configuration
    |--------------------------------------------------------------------------
    |
    | Konfigurasi khusus untuk development mobile yang memungkinkan
    | akses dari smartphone melalui localhost
    |
    */

    'enable_mobile_access' => env('MOBILE_ACCESS_ENABLED', true),

    'allowed_ips' => [
        '127.0.0.1',
        'localhost',
        '::1',
        // IP ranges untuk jaringan lokal
        '192.168.0.0/16',
        '10.0.0.0/8',
        '172.16.0.0/12',
    ],

    'qr_scanner_config' => [
        'fps' => 10,
        'qrbox' => [
            'mobile' => [
                'width' => 200,
                'height' => 200,
            ],
            'desktop' => [
                'width' => 250,
                'height' => 250,
            ],
        ],
        'aspectRatio' => 1.0,
    ],

    'mobile_optimizations' => [
        'enable_touch_optimization' => true,
        'enable_swipe_gestures' => true,
        'enable_auto_zoom' => true,
        'enable_vibration_feedback' => false, // Disable untuk development
    ],

    'camera_permissions' => [
        'required' => true,
        'fallback_to_manual' => true,
        'show_permission_guide' => true,
    ],

    'network_config' => [
        'timeout' => 30000, // 30 seconds
        'retry_attempts' => 3,
        'enable_offline_mode' => false,
    ],
]; 