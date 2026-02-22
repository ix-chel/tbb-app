# Deployment Guide — tbb-app (Ubuntu + Nginx + MySQL + Redis)

## 1. Prerequisites

| Software | Minimum Version |
|-----------|----------------|
| Ubuntu | 22.04 LTS |
| PHP | 8.2+ (+ extensions: mbstring, xml, curl, gd, zip, bcmath, redis, pdo_pgsql) |
| Composer | 2.x |
| Node.js | 20.x |
| PostgreSQL | 15+ |
| Redis | 7.x |
| Nginx | 1.18+ |

## 2. Server Bootstrap

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx postgresql postgresql-contrib redis-server git unzip \
  php8.2-fpm php8.2-mbstring php8.2-xml php8.2-curl php8.2-gd \
  php8.2-zip php8.2-bcmath php8.2-redis php8.2-pgsql
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

## 3. PostgreSQL Setup

```bash
sudo -u postgres psql
```

```sql
CREATE USER tbb_user WITH ENCRYPTED PASSWORD 'STRONG_RANDOM_PASSWORD';
CREATE DATABASE tbb_production OWNER tbb_user ENCODING 'UTF8' LC_COLLATE 'en_US.UTF-8' LC_CTYPE 'en_US.UTF-8';
GRANT ALL PRIVILEGES ON DATABASE tbb_production TO tbb_user;
\q
```

## 4. Clone & Configure

```bash
cd /var/www
sudo git clone https://github.com/your-org/tbb-app.git tbb-app
sudo chown -R www-data:www-data /var/www/tbb-app
cd /var/www/tbb-app

# Install PHP dependencies
composer install --no-dev --optimize-autoloader

# Install JS dependencies and build assets
npm ci && npm run build

# Environment
cp .env.production.example .env
# ── Edit .env: fill DB_PASSWORD, APP_KEY, etc. ──

php artisan key:generate
php artisan storage:link
```

## 5. Database Migration

```bash
php artisan migrate --force
php artisan db:seed --class=RolesAndPermissionsSeeder  # if applicable
```

## 6. Performance Cache

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

> **Important:** Run `php artisan optimize:clear` before any deployment, and `php artisan optimize` after.

## 7. Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/tbb-app/public;
    index index.php;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff2)$ {
        expires max;
        log_not_found off;
    }
}
```

Enable and test:
```bash
sudo ln -s /etc/nginx/sites-available/tbb-app /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### SSL with Certbot

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 8. Queue Worker (Supervisor)

Install Supervisor:
```bash
sudo apt install supervisor
```

Create `/etc/supervisor/conf.d/tbb-worker.conf`:
```ini
[program:tbb-worker]
command=php /var/www/tbb-app/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
directory=/var/www/tbb-app
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/log/supervisor/tbb-worker.log
stopwaitsecs=3600
autostart=true
autorestart=true
```

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start tbb-worker:*
```

## 9. File Permissions

```bash
sudo chown -R www-data:www-data /var/www/tbb-app/storage
sudo chown -R www-data:www-data /var/www/tbb-app/bootstrap/cache
sudo chmod -R 775 /var/www/tbb-app/storage
sudo chmod -R 775 /var/www/tbb-app/bootstrap/cache
```

## 10. Deployment Checklist

- [ ] `APP_DEBUG=false` in `.env`
- [ ] `APP_ENV=production` in `.env`
- [ ] Strong `APP_KEY` generated
- [ ] Redis configured for sessions, cache, and queues
- [ ] `php artisan config:cache` run
- [ ] `php artisan route:cache` run
- [ ] Storage symlink created (`php artisan storage:link`)
- [ ] Migrations run (`php artisan migrate --force`)
- [ ] Supervisor queue workers running
- [ ] SSL certificate active
- [ ] Nginx configured with security headers
- [ ] File permissions set for `www-data`

## 11. Updating in Production (Zero-downtime pattern)

```bash
cd /var/www/tbb-app
php artisan down --secret="your-maintenance-key"

git pull origin main
composer install --no-dev --optimize-autoloader
npm ci && npm run build

php artisan migrate --force
php artisan optimize:clear
php artisan optimize

sudo supervisorctl restart tbb-worker:*

php artisan up
```
