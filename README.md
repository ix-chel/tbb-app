# TBB App — Toya Bumi Bersih

> **A full-stack water-treatment facility maintenance management system** built with **Laravel 12**, **React 19**, **Inertia.js**, and **TailwindCSS 4**.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [User Roles & Permissions](#user-roles--permissions)
- [Database Schema](#database-schema)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [CI/CD](#cicd)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

---

## Overview

**TBB App** (Toya Bumi Bersih) is a web-based facility-maintenance management platform designed to streamline operations for water treatment companies. The system enables administrators to manage client companies, store locations, and service contracts; generates QR codes that technicians scan on-site to log maintenance work; and provides clients with real-time visibility into their maintenance history and schedule.

The mobile companion experience for technicians is located in the `tbb-mobile/` directory (React Native).

---

## Features

| Module | Capabilities |
|---|---|
| **Authentication** | Email/password login, password reset, email verification, role-based session management |
| **Role & Permission Management** | Granular permissions via Spatie Laravel-Permission (super-admin, admin, technician, client) |
| **Company Management** | CRUD for client companies; link companies to users |
| **Store Management** | CRUD for store/location records; contact fields; linked to companies |
| **QR Code — Filter QR** | Generate, download, and print QR codes for filter assets; scan QR to log maintenance; request revision workflow |
| **QR Code — Store QR** | Per-store QR code generation and management |
| **QR Scan History** | Audit trail of every QR code scan event |
| **Maintenance Reports** | Create, review, approve, and reject maintenance reports; photo documentation; approval workflow |
| **Maintenance Scheduling** | Schedule recurring or one-off maintenance jobs and assign to technicians |
| **Inventory Management** | Track inventory items by type; consumption logging linked to maintenance |
| **Feedback** | Clients and internal users can submit feedback |
| **Dashboard & Reports** | Role-specific dashboards with charts (Recharts); export to PDF/Excel |

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| PHP | ^8.2 | Runtime |
| Laravel | ^12.0 | HTTP framework, ORM, queues, scheduler |
| Inertia.js (Laravel adapter) | ^2.0 | Server-driven SPA bridge |
| Laravel Sanctum | ^4.2 | API token & session authentication |
| Spatie Laravel-Permission | ^6.17 | Role & permission management |
| Endroid QR Code | ^6.0 | QR code generation |
| Doctrine DBAL | ^4.2 | Database schema inspection |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.1 | UI library |
| TypeScript | ^5.7 | Type safety |
| Inertia.js (React adapter) | ^2.0 | SPA routing without a separate API |
| TailwindCSS | ^4.0 | Utility-first CSS |
| shadcn/ui (Radix UI) | various | Accessible component primitives |
| Recharts | ^3.1 | Data visualization |
| Zustand | ^5.0 | Client-side state management |
| Axios | ^1.11 | HTTP client |
| Vite | ^6.0 | Build tool & dev server |

### Dev Tools
- ESLint + Prettier — code quality & formatting
- PHPUnit ^11 — backend unit & feature tests
- Laravel Pint — PHP code style fixer
- Concurrently — run PHP & Vite servers together

---

## Architecture

```
Browser / Mobile
      │
      ▼
┌─────────────────────────────────────────┐
│  Laravel 12 (PHP 8.2)                   │
│  ┌──────────┐  ┌────────────────────┐   │
│  │ Inertia  │  │  REST API Routes   │   │
│  │ Routes   │  │  (api.php)         │   │
│  └────┬─────┘  └────────┬───────────┘   │
│       │                 │               │
│  ┌────▼─────────────────▼────────────┐  │
│  │  Controllers (HTTP Layer)         │  │
│  └────────────────┬──────────────────┘  │
│                   │                    │
│  ┌────────────────▼──────────────────┐  │
│  │  Models (Eloquent ORM)            │  │
│  │  Company · Store · User ·         │  │
│  │  FilterQR · StoreQR · Inventory   │  │
│  │  MaintenanceReport · Schedule     │  │
│  └────────────────┬──────────────────┘  │
│                   │                    │
│  ┌────────────────▼──────────────────┐  │
│  │  Database (MySQL / SQLite)        │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
      │
      ▼ (Inertia page props as JSON)
┌─────────────────────────────────────────┐
│  React 19 + TypeScript (Vite)           │
│  Components · Pages · Zustand Store     │
└─────────────────────────────────────────┘
```

The application uses **Inertia.js** for the web frontend, which removes the need for a separate REST API for the main web UI—Laravel renders the initial page and passes typed props directly to React components. A separate `api.php` layer handles the mobile app.

---

## User Roles & Permissions

| Role | Key Capabilities |
|---|---|
| **super-admin** | Full access: companies, stores, users, feedback, all reports, system settings |
| **admin** | Manage technicians, clients, contracts, QR codes, maintenance reports & schedules |
| **technician** | Scan QR codes, submit maintenance reports, view & update assigned schedules, manage inventory |
| **client** | View own maintenance history & schedule, submit maintenance requests, download reports |

Permissions are managed through **Spatie Laravel-Permission** and seeded via `database/seeders/`.

Default credentials (after seeding):
```
Super Admin: superadmin@tbb.com / password
Admin:       admin@tbb.com      / password
```
> ⚠️ Change all default passwords immediately in production.

---

## Database Schema

| Table | Description |
|---|---|
| `users` | Application users, linked to company, role via Spatie |
| `companies` | Client company records |
| `stores` | Store/location records linked to companies |
| `store_qrs` | QR codes assigned to store locations |
| `filter_qrs` | QR codes for individual filter assets; stores contact & revision metadata |
| `qr_scan_histories` | Audit log of every QR scan event |
| `maintenance_reports` | Maintenance job reports with status & approval workflow |
| `maintenance_schedules` | Planned maintenance jobs |
| `inventory_items` | Inventory tracking with item type |
| `feedback` | User-submitted feedback |
| `roles` / `permissions` | Spatie permission tables |
| `personal_access_tokens` | Laravel Sanctum token store (for mobile API) |
| `sessions` / `cache` / `jobs` | Laravel infrastructure tables |

---

## Prerequisites

Before setting up, make sure the following are installed:

- **PHP** 8.2+  (`php -v`)
- **Composer** 2+ (`composer --version`)
- **Node.js** 18+ (`node -v`)
- **npm** 9+ (`npm -v`)
- **MySQL** 8.0+ **or** SQLite (for local dev)
- **Git** (`git --version`)

---

## Installation

### 1. Clone the repository

```bash
git clone <REPOSITORY_URL> tbb-app
cd tbb-app
```

### 2. Install PHP dependencies

```bash
composer install
```

### 3. Install Node dependencies

```bash
npm install
```

### 4. Configure environment

```bash
cp .env.example .env
php artisan key:generate
```

Then edit `.env` to match your local environment (see [Environment Variables](#environment-variables)).

### 5. Set up the database

**SQLite (quick local dev):**
```bash
touch database/database.sqlite
```
Ensure `DB_CONNECTION=sqlite` in `.env`.

**MySQL:**
```sql
CREATE DATABASE tbb_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Update `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` in `.env`.

### 6. Run migrations and seeders

```bash
php artisan migrate
php artisan db:seed
```

### 7. Create storage symlink

```bash
php artisan storage:link
```

---

## Environment Variables

Key variables in `.env` (see `.env.example` for the full list):

```dotenv
APP_NAME=Toya_Bumi_Bersih
APP_ENV=local          # local | production
APP_KEY=               # auto-filled by php artisan key:generate
APP_DEBUG=true         # false in production
APP_URL=http://localhost

# Database
DB_CONNECTION=sqlite   # sqlite | mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=tbb_app
# DB_USERNAME=root
# DB_PASSWORD=

# Session & Cache
SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database

# Mail (use log for local dev)
MAIL_MAILER=log
# MAIL_MAILER=smtp
# MAIL_HOST=smtp.gmail.com
# MAIL_PORT=587
# MAIL_USERNAME=your-email@gmail.com
# MAIL_PASSWORD=your-app-password

# Vite
VITE_APP_NAME="${APP_NAME}"
```

---

## Running the Application

### Development (recommended — runs all services concurrently)

```bash
composer run dev
```

This starts:
- `php artisan serve` on http://localhost:8000
- `php artisan queue:listen`
- `npm run dev` (Vite) on http://localhost:5173

Or run each service manually in separate terminals:

```bash
# Terminal 1 — Laravel
php artisan serve

# Terminal 2 — Queue
php artisan queue:listen --tries=1

# Terminal 3 — Vite
npm run dev
```

Open **http://localhost:8000** in your browser (Inertia serves everything through Laravel).

### SSR mode

```bash
composer run dev:ssr
```

---

## Available Scripts

### PHP / Composer

| Command | Description |
|---|---|
| `composer run dev` | Start all dev services concurrently |
| `composer run dev:ssr` | Start all services in SSR mode |
| `composer run test` | Clear config cache + run PHPUnit tests |
| `php artisan migrate` | Run database migrations |
| `php artisan db:seed` | Run database seeders |
| `php artisan tinker` | Interactive REPL |
| `php artisan pint` | Fix PHP code style |

### Node / npm

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build production assets |
| `npm run build:ssr` | Build assets + SSR bundle |
| `npm run format` | Format `resources/` with Prettier |
| `npm run format:check` | Check formatting |
| `npm run lint` | Lint and auto-fix with ESLint |
| `npm run types` | Type-check TypeScript (no emit) |

---

## Testing

The project uses **PHPUnit 11** for backend tests.

```bash
# Run all tests
composer run test

# Or directly
php artisan test

# Run a specific test file
php artisan test --filter=ExampleTest

# With coverage (requires Xdebug or PCOV)
php artisan test --coverage
```

Test suites are configured in `phpunit.xml`. GitHub Actions (`.github/workflows/tests.yml`) runs these on every push/PR.

---

## CI/CD

Two GitHub Actions workflows are defined in `.github/workflows/`:

| Workflow | File | Trigger | Purpose |
|---|---|---|---|
| **Tests** | `tests.yml` | Push / PR | Runs PHPUnit test suite |
| **Lint** | `lint.yml` | Push / PR | Runs ESLint + PHP Pint checks |

---

## Deployment

### Production checklist

1. **Server requirements:** PHP 8.2+, MySQL 8.0+, Nginx/Apache, Node 18+, Composer 2+
2. **Clone & install on server:**
   ```bash
   git clone <REPOSITORY_URL> /var/www/tbb-app
   cd /var/www/tbb-app
   composer install --optimize-autoloader --no-dev
   npm install && npm run build
   ```
3. **Configure `.env`** for production:
   ```dotenv
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://your-domain.com
   DB_CONNECTION=mysql
   # ... full DB credentials
   ```
4. **Optimize Laravel:**
   ```bash
   php artisan key:generate
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   php artisan migrate --force
   php artisan db:seed --force
   php artisan storage:link
   ```
5. **Set permissions:**
   ```bash
   sudo chown -R www-data:www-data /var/www/tbb-app
   sudo chmod -R 755 /var/www/tbb-app
   sudo chmod -R 775 /var/www/tbb-app/storage /var/www/tbb-app/bootstrap/cache
   ```
6. **Nginx configuration:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/tbb-app/public;

       add_header X-Frame-Options "SAMEORIGIN";
       add_header X-Content-Type-Options "nosniff";

       index index.php;
       charset utf-8;

       location / {
           try_files $uri $uri/ /index.php?$query_string;
       }

       location ~ \.php$ {
           fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
           fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
           include fastcgi_params;
       }

       location ~ /\.(?!well-known).* {
           deny all;
       }
   }
   ```
7. **SSL:** Use Certbot — `sudo certbot --nginx -d your-domain.com`
8. **Scheduler (cron):**
   ```bash
   * * * * * cd /var/www/tbb-app && php artisan schedule:run >> /dev/null 2>&1
   ```
9. **Queue worker (Supervisor recommended):**
   ```bash
   php artisan queue:work --tries=3
   ```

For detailed step-by-step instructions see [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md).

---

## Project Structure

```
tbb-app/
├── app/
│   ├── Http/
│   │   ├── Controllers/       # CompanyController, StoreController, MaintenanceController, FilterQRController, etc.
│   │   └── Middleware/
│   ├── Models/                # Company, Store, User, FilterQR, StoreQR, MaintenanceReport, InventoryItem, Feedback, ...
│   ├── Policies/              # Authorization policies per model
│   └── Providers/
├── bootstrap/
├── config/                    # Laravel config files
├── database/
│   ├── factories/             # Model factories for testing
│   ├── migrations/            # Database migrations
│   └── seeders/               # Role, permission, and default data seeders
├── public/                    # Web root (Vite-compiled assets symlinked here)
├── resources/
│   ├── css/                   # Global styles / Tailwind entry point
│   ├── js/                    # React components and pages (TypeScript)
│   └── views/                 # Blade root template (app.blade.php for Inertia)
├── routes/
│   ├── web.php                # Main web routes (role-guarded)
│   ├── api.php                # API routes (Sanctum, for mobile)
│   ├── auth.php               # Authentication routes
│   └── settings.php           # Settings routes
├── storage/                   # Logs, file uploads, compiled views
├── tests/                     # PHPUnit Feature & Unit tests
├── tbb-mobile/                # React Native mobile app (technician client)
├── .env.example               # Environment template
├── .github/workflows/         # CI: tests.yml, lint.yml
├── composer.json
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── INSTALLATION_GUIDE.md      # Detailed installation & deployment guide (Bahasa Indonesia)
└── USER_GUIDE.md              # End-user guide for all roles (Bahasa Indonesia)
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes following conventional commits: `git commit -m "feat: add QR bulk download"`
4. Ensure lint and tests pass:
   ```bash
   npm run lint && npm run types
   composer run test
   ```
5. Push and open a Pull Request

---

*For end-user documentation in Bahasa Indonesia, see [USER_GUIDE.md](./USER_GUIDE.md).*  
*For detailed installation and deployment instructions, see [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md).*
