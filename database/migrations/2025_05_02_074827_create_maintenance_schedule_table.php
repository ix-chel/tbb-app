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
        Schema::create('maintenance_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade'); // Toko mana yang dijadwalkan
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null'); // Teknisi yang ditugaskan (nullable, bisa jadi belum ditugaskan)
            $table->dateTime('scheduled_at'); // Tanggal dan waktu jadwal
            $table->dateTime('completed_at')->nullable(); // Tanggal dan waktu selesai (nullable)
            $table->text('notes')->nullable(); // Catatan tambahan
            $table->string('status')->default('scheduled'); // Status: scheduled, in_progress, completed, cancelled
            $table->timestamps(); // created_at dan updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_schedules');
    }
};