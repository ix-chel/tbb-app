# Panduan Setup Mobile untuk Scan QR Code

## Prerequisites
- Node.js dan npm terinstall
- PHP dan Composer terinstall
- Laravel project sudah setup

## Langkah-langkah Setup

### 1. Install Dependencies
```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install

# Install library QR code scanner
npm install html5-qrcode
```

### 2. Konfigurasi Environment
Buat file `.env` dari `.env.example`:
```bash
cp .env.example .env
```

Edit file `.env` dan pastikan konfigurasi berikut:
```env
APP_URL=http://0.0.0.0:8000
APP_ENV=local
APP_DEBUG=true

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tbb_app
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Setup Database
```bash
# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Seed database (optional)
php artisan db:seed
```

### 4. Menjalankan Server

#### Terminal 1 - Laravel Server
```bash
# Jalankan Laravel server dengan host 0.0.0.0 agar bisa diakses dari device lain
php artisan serve --host=0.0.0.0 --port=8000
```

#### Terminal 2 - Vite Development Server
```bash
# Jalankan Vite dengan host flag
npm run dev
```

### 5. Akses dari Smartphone

#### Cara 1: Menggunakan IP Address
1. Cari IP address komputer Anda:
   - Windows: `ipconfig` di Command Prompt
   - Mac/Linux: `ifconfig` atau `ip addr` di Terminal

2. Akses dari smartphone:
   ```
   http://[IP_ADDRESS]:8000
   ```
   Contoh: `http://192.168.1.100:8000`

#### Cara 2: Menggunakan ngrok (Alternatif)
1. Install ngrok: https://ngrok.com/download
2. Jalankan ngrok:
   ```bash
   ngrok http 8000
   ```
3. Akses dari smartphone menggunakan URL yang diberikan ngrok

### 6. Testing Scan QR Code

#### Di Laptop/Desktop:
1. Buka browser dan akses `http://localhost:8000`
2. Login sebagai teknisi
3. Akses halaman scan QR code
4. Klik "Buka Kamera" untuk scan dengan webcam

#### Di Smartphone:
1. Buka browser di smartphone
2. Akses URL sesuai langkah 5
3. Login sebagai teknisi
4. Akses halaman scan QR code
5. Klik "Buka Kamera" untuk scan dengan kamera smartphone
6. Izinkan akses kamera ketika browser meminta

### 7. Troubleshooting

#### Masalah Kamera Tidak Muncul:
- Pastikan browser mengizinkan akses kamera
- Coba refresh halaman
- Pastikan menggunakan HTTPS (untuk production)

#### Masalah Koneksi:
- Pastikan laptop dan smartphone berada dalam jaringan yang sama
- Cek firewall settings
- Pastikan port 8000 tidak diblokir

#### Masalah QR Code Tidak Terdeteksi:
- Pastikan QR code dalam kondisi baik
- Pastikan pencahayaan cukup
- Coba scan dari jarak yang berbeda

### 8. Fitur yang Tersedia

#### Untuk Teknisi:
- Scan QR code dengan kamera smartphone
- Input manual QR code
- Auto-redirect ke halaman maintenance report
- Upload foto maintenance
- Checklist maintenance items

#### Responsive Design:
- Tampilan yang optimal untuk mobile
- Deteksi device mobile otomatis
- UI yang disesuaikan untuk touch screen

### 9. Keamanan

#### Development Mode:
- Pastikan `APP_ENV=local` di `.env`
- Debug mode aktif untuk development
- Tidak untuk production

#### Production:
- Gunakan HTTPS
- Set `APP_ENV=production`
- Nonaktifkan debug mode
- Gunakan domain yang proper

## Catatan Penting

1. **Untuk Development**: Pastikan laptop dan smartphone berada dalam jaringan WiFi yang sama
2. **Browser Support**: Chrome, Safari, Firefox mendukung WebRTC untuk akses kamera
3. **QR Code Format**: Sistem mendukung berbagai format QR code standar
4. **Performance**: Scanner QR code dioptimalkan untuk mobile dengan frame rate yang disesuaikan

## Support

Jika mengalami masalah, cek:
1. Console browser untuk error JavaScript
2. Laravel logs di `storage/logs/laravel.log`
3. Network tab di browser developer tools
4. Pastikan semua dependencies terinstall dengan benar 