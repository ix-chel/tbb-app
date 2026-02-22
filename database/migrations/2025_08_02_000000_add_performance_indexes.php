<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add performance indexes to heavily-queried columns.
     *
     * Using ->skipIfExists() pattern: checks before adding so this is safe to run
     * even if some indexes already exist from previous migrations.
     */
    public function up(): void
    {
        // filter_qrs
        Schema::table('filter_qrs', function (Blueprint $table) {
            if (!$this->hasIndex('filter_qrs', 'filter_qrs_store_id_index')) {
                $table->index('store_id');
            }
            if (!$this->hasIndex('filter_qrs', 'filter_qrs_status_index')) {
                $table->index('status');
            }
            if (!$this->hasIndex('filter_qrs', 'filter_qrs_expiry_date_index')) {
                $table->index('expiry_date');
            }
            // qr_code should already be unique; add unique index if missing
            if (!$this->hasIndex('filter_qrs', 'filter_qrs_qr_code_unique')) {
                $table->unique('qr_code');
            }
        });

        // maintenance_reports
        Schema::table('maintenance_reports', function (Blueprint $table) {
            if (!$this->hasIndex('maintenance_reports', 'maintenance_reports_store_id_index')) {
                $table->index('store_id');
            }
            if (!$this->hasIndex('maintenance_reports', 'maintenance_reports_technician_id_index')) {
                $table->index('technician_id');
            }
            if (!$this->hasIndex('maintenance_reports', 'maintenance_reports_status_index')) {
                $table->index('status');
            }
        });

        // inventory_items
        Schema::table('inventory_items', function (Blueprint $table) {
            if (!$this->hasIndex('inventory_items', 'inventory_items_store_id_index')) {
                $table->index('store_id');
            }
            if (!$this->hasIndex('inventory_items', 'inventory_items_type_index')) {
                $table->index('type');
            }
            if (!$this->hasIndex('inventory_items', 'inventory_items_sku_unique')) {
                $table->unique('sku');
            }
        });

        // qr_scan_histories
        Schema::table('qr_scan_histories', function (Blueprint $table) {
            if (!$this->hasIndex('qr_scan_histories', 'qr_scan_histories_store_qr_id_index')) {
                $table->index('store_qr_id');
            }
            if (!$this->hasIndex('qr_scan_histories', 'qr_scan_histories_user_id_index')) {
                $table->index('user_id');
            }
            if (!$this->hasIndex('qr_scan_histories', 'qr_scan_histories_scanned_at_index')) {
                $table->index('scanned_at');
            }
        });

        // stores
        Schema::table('stores', function (Blueprint $table) {
            if (!$this->hasIndex('stores', 'stores_company_id_index')) {
                $table->index('company_id');
            }
        });

        // users
        Schema::table('users', function (Blueprint $table) {
            if (!$this->hasIndex('users', 'users_company_id_index')) {
                $table->index('company_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('filter_qrs', function (Blueprint $table) {
            $table->dropIndexIfExists('filter_qrs_store_id_index');
            $table->dropIndexIfExists('filter_qrs_status_index');
            $table->dropIndexIfExists('filter_qrs_expiry_date_index');
            $table->dropIndexIfExists('filter_qrs_qr_code_unique');
        });

        Schema::table('maintenance_reports', function (Blueprint $table) {
            $table->dropIndexIfExists('maintenance_reports_store_id_index');
            $table->dropIndexIfExists('maintenance_reports_technician_id_index');
            $table->dropIndexIfExists('maintenance_reports_status_index');
        });

        Schema::table('inventory_items', function (Blueprint $table) {
            $table->dropIndexIfExists('inventory_items_store_id_index');
            $table->dropIndexIfExists('inventory_items_type_index');
            $table->dropIndexIfExists('inventory_items_sku_unique');
        });

        Schema::table('qr_scan_histories', function (Blueprint $table) {
            $table->dropIndexIfExists('qr_scan_histories_store_qr_id_index');
            $table->dropIndexIfExists('qr_scan_histories_user_id_index');
            $table->dropIndexIfExists('qr_scan_histories_scanned_at_index');
        });

        Schema::table('stores', function (Blueprint $table) {
            $table->dropIndexIfExists('stores_company_id_index');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndexIfExists('users_company_id_index');
        });
    }

    /**
     * Check if an index exists — driver-aware.
     * PostgreSQL: pg_indexes catalog
     * SQLite: sqlite_master
     * Other drivers (MySQL, MariaDB): information_schema.statistics
     */
    private function hasIndex(string $table, string $indexName): bool
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'pgsql') {
            $result = \DB::selectOne(
                "SELECT 1 FROM pg_indexes WHERE tablename = ? AND indexname = ? LIMIT 1",
                [$table, $indexName]
            );
            return $result !== null;
        }

        if ($driver === 'sqlite') {
            $result = \DB::selectOne(
                "SELECT 1 FROM sqlite_master WHERE type='index' AND tbl_name=? AND name=? LIMIT 1",
                [$table, $indexName]
            );
            return $result !== null;
        }

        // MySQL / MariaDB fallback
        $result = \DB::selectOne(
            "SELECT 1 FROM information_schema.statistics
             WHERE table_schema = DATABASE() AND table_name = ? AND index_name = ? LIMIT 1",
            [$table, $indexName]
        );
        return $result !== null;
    }
};
