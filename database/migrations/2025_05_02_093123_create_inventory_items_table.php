<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Membuat tabel inventory_items.
     */
    public function up(): void
    {
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nama item (Wajib)
            $table->string('sku')->unique()->nullable(); // Stock Keeping Unit (unik, opsional)
            $table->text('description')->nullable(); // Deskripsi item (opsional)
            $table->decimal('quantity', 10, 2)->default(0); // Jumlah stok (10 digit total, 2 desimal), default 0
            $table->string('unit')->nullable(); // Satuan (pcs, liter, box, etc.) (opsional)
            $table->string('location')->nullable(); // Lokasi penyimpanan (opsional)
            $table->integer('low_stock_threshold')->unsigned()->nullable(); // Batas minimum stok (opsional, tidak boleh negatif)
            $table->foreignId('last_updated_by')->nullable()->constrained('users')->onDelete('set null'); // User terakhir yang update (opsional, foreign key ke users)
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->timestamps(); // created_at dan updated_at
        });
    }

    /**
     * Reverse the migrations.
     * Menghapus tabel inventory_items.
     */
    public function down(): void
    {
        // Hapus foreign key dulu jika ada sebelum drop table
        Schema::table('inventory_items', function (Blueprint $table) {
            // Periksa apakah constraint ada sebelum mencoba drop (lebih aman)
            $sm = Schema::getConnection()->getDoctrineSchemaManager();
            $foreignKeys = $sm->listTableForeignKeys('inventory_items');
            $constraintExists = collect($foreignKeys)->contains(function ($fk) {
                return $fk->getForeignColumns() === ['last_updated_by'];
            });

            if ($constraintExists) {
                 // Nama constraint default: namatabel_kolom_foreign
                $table->dropForeign(['last_updated_by']); // Cara drop modern
            }
        });

        Schema::dropIfExists('inventory_items');
    }
};