<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('filter_qrs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->onDelete('cascade');
            $table->foreignId('filter_id')->constrained('inventory_items')->onDelete('cascade');
            $table->string('qr_code')->unique();
            $table->enum('status', ['active', 'inactive', 'expired'])->default('active');
            $table->timestamp('last_scan_at')->nullable();
            $table->timestamp('installation_date')->nullable();
            $table->timestamp('expiry_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('filter_qrs');
    }
}; 