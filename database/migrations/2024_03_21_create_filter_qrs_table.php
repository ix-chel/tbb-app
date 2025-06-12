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
            $table->unsignedBigInteger('store_id');
            $table->unsignedBigInteger('filter_id');
            $table->string('qr_code')->unique();
            $table->enum('status', ['active', 'inactive', 'expired'])->default('active');
            $table->timestamp('last_scan_at')->nullable();
            $table->date('installation_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->text('notes')->nullable();
            // Contact fields are added in a separate migration
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