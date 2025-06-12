# Panduan Instalasi Manual TBB App

## Persyaratan Sistem
- PHP 8.1 atau lebih tinggi
- Composer
- Node.js 16 atau lebih tinggi
- NPM atau Yarn
- MySQL 8.0 atau lebih tinggi
- Git

## Langkah-langkah Instalasi

### 1. Persiapan Awal
1. Pastikan semua persyaratan sistem sudah terinstal
2. Buka terminal/command prompt
3. Buat folder baru untuk project:
   ```bash
   mkdir tbb-app
   cd tbb-app
   ```

### 2. Mengunduh Kode Sumber
1. Clone repository:
   ```bash
   git clone [URL_REPOSITORY] .
   ```
   Atau download ZIP dari repository dan ekstrak ke folder project

### 3. Konfigurasi Backend (Laravel)
1. Masuk ke folder project:
   ```bash
   cd tbb-app
   ```

2. Install dependensi PHP:
   ```bash
   composer install
   ```

3. Salin file .env:
   ```bash
   cp .env.example .env
   ```

4. Buat database baru di MySQL:
   - Buka phpMyAdmin atau MySQL client
   - Buat database baru dengan nama `tbb_app`
   - Atau gunakan perintah:
     ```sql
     CREATE DATABASE tbb_app;
     ```

5. Konfigurasi file .env:
   - Buka file .env dengan text editor
   - Sesuaikan pengaturan database:
     ```
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=tbb_app
     DB_USERNAME=root
     DB_PASSWORD=
     ```
   - Sesuaikan pengaturan email:
     ```
     MAIL_MAILER=smtp
     MAIL_HOST=smtp.gmail.com
     MAIL_PORT=587
     MAIL_USERNAME=your-email@gmail.com
     MAIL_PASSWORD=your-app-password
     MAIL_ENCRYPTION=tls
     MAIL_FROM_ADDRESS=your-email@gmail.com
     MAIL_FROM_NAME="${APP_NAME}"
     ```

6. Generate application key:
   ```bash
   php artisan key:generate
   ```

7. Jalankan migrasi database:
   ```bash
   php artisan migrate
   ```

8. Jalankan seeder untuk data awal:
   ```bash
   php artisan db:seed
   ```

9. Buat symbolic link untuk storage:
   ```bash
   php artisan storage:link
   ```

### 4. Konfigurasi Frontend (React)
1. Masuk ke folder frontend:
   ```bash
   cd frontend
   ```

2. Install dependensi Node.js:
   ```bash
   npm install
   # atau
   yarn install
   ```

3. Salin file .env:
   ```bash
   cp .env.example .env
   ```

4. Konfigurasi file .env frontend:
   - Buka file .env dengan text editor
   - Sesuaikan URL backend:
     ```
     VITE_API_URL=http://localhost:8000
     ```

### 5. Menjalankan Aplikasi
1. Jalankan backend (Laravel):
   ```bash
   # Di folder utama project
   php artisan serve
   ```

2. Jalankan frontend (React):
   ```bash
   # Di folder frontend
   npm run dev
   # atau
   yarn dev
   ```

3. Buka browser dan akses:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8000

### 6. Akses Aplikasi
1. Buka http://localhost:5173 di browser
2. Login dengan kredensial default:
   - Email: admin@tbb.com
   - Password: password

## Troubleshooting

### Masalah Umum dan Solusi

1. Error "Class not found"
   ```bash
   composer dump-autoload
   ```

2. Error database connection
   - Periksa pengaturan database di .env
   - Pastikan MySQL berjalan
   - Periksa username dan password database

3. Error storage link
   ```bash
   php artisan storage:link --force
   ```

4. Error npm install
   ```bash
   npm cache clean --force
   npm install
   ```

5. Error CORS
   - Pastikan URL di .env frontend sesuai dengan backend
   - Periksa konfigurasi CORS di backend

### Kontak Bantuan
Jika mengalami masalah, silakan hubungi:
- Email: support@tbb.com
- WhatsApp: +62xxx-xxxx-xxxx

## Catatan Penting
1. Jangan lupa untuk mengubah password default setelah login pertama kali
2. Backup database secara berkala
3. Pastikan server memenuhi persyaratan sistem
4. Gunakan environment production untuk deployment
5. Selalu update dependensi ke versi terbaru yang stabil

## Panduan Deployment Website

### 1. Persyaratan Server
- Server dengan spesifikasi minimal:
  - CPU: 2 Core
  - RAM: 4GB
  - Storage: 20GB
- Domain name
- SSL Certificate
- Web server (Nginx/Apache)
- PHP 8.1+
- MySQL 8.0+
- Node.js 16+

### 2. Persiapan Server
1. Update sistem:
   ```bash
   sudo apt update && sudo apt upgrade
   ```

2. Install dependensi:
   ```bash
   sudo apt install nginx mysql-server php8.1-fpm php8.1-mysql php8.1-mbstring php8.1-xml php8.1-curl php8.1-zip unzip git
   ```

3. Install Composer:
   ```bash
   curl -sS https://getcomposer.org/installer | php
   sudo mv composer.phar /usr/local/bin/composer
   ```

4. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

### 3. Konfigurasi Database
1. Buat database dan user:
   ```sql
   CREATE DATABASE tbb_app;
   CREATE USER 'tbb_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON tbb_app.* TO 'tbb_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

### 4. Deployment Backend
1. Clone repository:
   ```bash
   cd /var/www
   sudo git clone [URL_REPOSITORY] tbb-app
   sudo chown -R www-data:www-data tbb-app
   ```

2. Konfigurasi environment:
   ```bash
   cd tbb-app
   cp .env.example .env
   ```

3. Edit .env untuk production:
   ```
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://your-domain.com
   
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=tbb_app
   DB_USERNAME=tbb_user
   DB_PASSWORD=your_password
   
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-app-password
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS=your-email@gmail.com
   MAIL_FROM_NAME="${APP_NAME}"
   ```

4. Install dependensi dan build:
   ```bash
   composer install --optimize-autoloader --no-dev
   php artisan key:generate
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   php artisan migrate --force
   php artisan db:seed --force
   php artisan storage:link
   ```

### 5. Deployment Frontend
1. Build frontend:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. Konfigurasi Nginx untuk frontend:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/tbb-app/frontend/dist;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

### 6. Konfigurasi Nginx untuk Backend
```nginx
server {
    listen 80;
    server_name api.your-domain.com;
    root /var/www/tbb-app/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### 7. Konfigurasi SSL
1. Install Certbot:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. Install SSL certificate:
   ```bash
   sudo certbot --nginx -d your-domain.com -d api.your-domain.com
   ```

### 8. Finalisasi
1. Restart services:
   ```bash
   sudo systemctl restart nginx
   sudo systemctl restart php8.1-fpm
   ```

2. Setup cron job untuk scheduler:
   ```bash
   * * * * * cd /var/www/tbb-app && php artisan schedule:run >> /dev/null 2>&1
   ```

### 9. Monitoring dan Maintenance
1. Setup log monitoring:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   sudo tail -f /var/www/tbb-app/storage/logs/laravel.log
   ```

2. Backup database otomatis:
   ```bash
   # Tambahkan ke crontab
   0 0 * * * mysqldump -u tbb_user -p'your_password' tbb_app > /backup/tbb_app_$(date +\%Y\%m\%d).sql
   ```

### 10. Keamanan
1. Konfigurasi firewall:
   ```bash
   sudo ufw allow 'Nginx Full'
   sudo ufw allow OpenSSH
   sudo ufw enable
   ```

2. Update secara berkala:
   ```bash
   sudo apt update && sudo apt upgrade
   composer update
   npm update
   ```

### 11. Troubleshooting Deployment
1. Cek permission:
   ```bash
   sudo chown -R www-data:www-data /var/www/tbb-app
   sudo chmod -R 755 /var/www/tbb-app
   sudo chmod -R 775 /var/www/tbb-app/storage
   ```

2. Cek log error:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   sudo tail -f /var/www/tbb-app/storage/logs/laravel.log
   ```

3. Restart services jika ada masalah:
   ```bash
   sudo systemctl restart nginx
   sudo systemctl restart php8.1-fpm
   ``` 