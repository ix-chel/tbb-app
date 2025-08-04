# TBB App - Mobile Development Setup

## Overview
Aplikasi TBB App telah dikonfigurasi untuk mendukung scan QR code dari smartphone melalui localhost. Fitur ini memungkinkan teknisi untuk melakukan scan QR code menggunakan kamera smartphone dan langsung diarahkan ke halaman maintenance report.

## Fitur Mobile yang Tersedia

### 1. Scan QR Code dengan Kamera Smartphone
- Deteksi otomatis device mobile
- Interface yang dioptimalkan untuk touch screen
- Scanner QR code yang responsif
- Auto-redirect setelah scan berhasil

### 2. Responsive Design
- Layout yang menyesuaikan ukuran layar
- Touch-friendly buttons dan controls
- Optimized untuk mobile browser

### 3. Maintenance Report dengan Foto
- Upload foto maintenance
- Checklist maintenance items
- Form yang dioptimalkan untuk mobile

## Setup Development

### Prerequisites
```bash
# Pastikan sudah terinstall
- PHP 8.1+
- Composer
- Node.js 18+
- npm
- MySQL/PostgreSQL
```

### 1. Install Dependencies
```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install

# Install QR code scanner library
npm install html5-qrcode
```

### 2. Environment Setup
```bash
# Copy environment file
cp .env.example .env

# Edit .env file
APP_URL=http://0.0.0.0:8000
APP_ENV=local
APP_DEBUG=true
MOBILE_ACCESS_ENABLED=true
```

### 3. Database Setup
```bash
# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Seed database (optional)
php artisan db:seed
```

### 4. Menjalankan Server

#### Cara 1: Menggunakan Script Batch (Windows)
```bash
# Double click file
start-mobile-dev.bat
```

#### Cara 2: Manual
```bash
# Terminal 1 - Laravel Server
php artisan serve --host=0.0.0.0 --port=8000

# Terminal 2 - Vite Development Server
npm run dev
```

## Akses dari Smartphone

### 1. Cari IP Address Komputer
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
# atau
ip addr
```

### 2. Akses dari Smartphone
```
http://[IP_ADDRESS]:8000
```
Contoh: `http://192.168.1.100:8000`

### 3. Login sebagai Teknisi
- Username: teknisi@example.com
- Password: password

## Testing Scan QR Code

### Di Laptop/Desktop
1. Buka `http://localhost:8000`
2. Login sebagai teknisi
3. Akses menu "QR Code" → "Scan QR Code"
4. Klik "Buka Kamera" untuk scan dengan webcam

### Di Smartphone
1. Buka browser di smartphone
2. Akses URL sesuai IP address komputer
3. Login sebagai teknisi
4. Akses menu "QR Code" → "Scan QR Code"
5. Klik "Buka Kamera" untuk scan dengan kamera smartphone
6. Izinkan akses kamera ketika browser meminta

## Troubleshooting

### Masalah Kamera Tidak Muncul
- Pastikan browser mengizinkan akses kamera
- Coba refresh halaman
- Pastikan menggunakan HTTPS (untuk production)
- Cek console browser untuk error

### Masalah Koneksi
- Pastikan laptop dan smartphone dalam jaringan yang sama
- Cek firewall settings
- Pastikan port 8000 tidak diblokir
- Coba akses dari browser yang berbeda

### Masalah QR Code Tidak Terdeteksi
- Pastikan QR code dalam kondisi baik
- Pastikan pencahayaan cukup
- Coba scan dari jarak yang berbeda
- Pastikan QR code berada dalam frame kamera

### Masalah Performance
- Pastikan koneksi internet stabil
- Coba refresh halaman jika lambat
- Pastikan browser versi terbaru

## Konfigurasi Lanjutan

### CORS Settings
File: `config/cors.php`
```php
'allowed_origins' => [
    'http://localhost:5173',
    'http://0.0.0.0:8000', 
    'http://localhost:8000'
],
'allowed_origins_patterns' => [
    'http://192.168.*.*:8000',
    'http://10.0.*.*:8000',
    'http://172.16.*.*:8000',
],
```

### Mobile Configuration
File: `config/mobile.php`
```php
'enable_mobile_access' => true,
'qr_scanner_config' => [
    'fps' => 10,
    'qrbox' => [
        'mobile' => ['width' => 200, 'height' => 200],
        'desktop' => ['width' => 250, 'height' => 250],
    ],
],
```

## Browser Support

### Desktop
- Chrome (Recommended)
- Firefox
- Safari
- Edge

### Mobile
- Chrome Mobile (Recommended)
- Safari Mobile
- Firefox Mobile
- Samsung Internet

## Security Notes

### Development Mode
- `APP_ENV=local`
- Debug mode aktif
- CORS settings terbuka
- **Tidak untuk production**

### Production Mode
- Gunakan HTTPS
- Set `APP_ENV=production`
- Nonaktifkan debug mode
- Restrict CORS settings
- Gunakan domain yang proper

## Support

Jika mengalami masalah:
1. Cek console browser untuk error JavaScript
2. Cek Laravel logs: `storage/logs/laravel.log`
3. Cek network tab di browser developer tools
4. Pastikan semua dependencies terinstall dengan benar
5. Coba restart server development

## File Structure

```
tbb-app/
├── app/Http/Middleware/MobileAccess.php    # Mobile detection middleware
├── config/mobile.php                       # Mobile configuration
├── resources/js/pages/FilterQR/Scan.tsx    # QR scanner component
├── resources/js/pages/maintenancereport/   # Maintenance report pages
├── start-mobile-dev.bat                    # Windows startup script
├── MOBILE_SETUP_GUIDE.md                   # Detailed setup guide
└── README_MOBILE_SETUP.md                  # This file
``` 