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
        Schema::table('maintenance_reports', function (Blueprint $table) {
            $table->enum('equipment_status', ['good', 'needs_attention', 'broken'])->nullable()->after('technician_id');
            $table->boolean('filter_changed')->default(false)->after('equipment_status');
            $table->string('filter_type')->nullable()->after('filter_changed');
            $table->text('notes')->nullable()->after('filter_type');
            $table->json('photo_paths')->nullable()->after('notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('maintenance_reports', function (Blueprint $table) {
            $table->dropColumn(['equipment_status', 'filter_changed', 'filter_type', 'notes', 'photo_paths']);
        });
    }
};
