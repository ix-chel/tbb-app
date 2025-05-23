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
        Schema::table('filter_qrs', function (Blueprint $table) {
            $table->string('contact_person')->nullable()->after('notes');
            $table->string('contact_phone')->nullable()->after('contact_person');
            $table->string('contact_email')->nullable()->after('contact_phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('filter_qrs', function (Blueprint $table) {
            $table->dropColumn(['contact_person', 'contact_phone', 'contact_email']);
        });
    }
}; 