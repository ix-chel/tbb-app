<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add new columns to feedback table
        Schema::table('feedback', function (Blueprint $table) {
            if (! Schema::hasColumn('feedback', 'comment')) {
                $table->text('comment')->nullable()->after('type');
            }
            if (! Schema::hasColumn('feedback', 'rating')) {
                $table->integer('rating')->nullable()->after('comment');
            }
            if (! Schema::hasColumn('feedback', 'maintenance_schedule_id')) {
                $table->unsignedBigInteger('maintenance_schedule_id')->nullable()->after('store_id');
            }
        });

        // Migrate data from message to comment (if message still exists)
        if (Schema::hasColumn('feedback', 'message')) {
            DB::statement('UPDATE feedback SET comment = message');

            Schema::table('feedback', function (Blueprint $table) {
                $table->dropColumn(['title', 'message']);
            });
        }
    }

    public function down(): void
    {
        Schema::table('feedback', function (Blueprint $table) {
            // Restore old columns
            if (! Schema::hasColumn('feedback', 'title')) {
                $table->string('title')->nullable();
            }
            if (! Schema::hasColumn('feedback', 'message')) {
                $table->text('message')->nullable();
            }

            // Drop new columns
            $toDrop = [];
            foreach (['comment', 'rating', 'maintenance_schedule_id'] as $col) {
                if (Schema::hasColumn('feedback', $col)) {
                    $toDrop[] = $col;
                }
            }
            if (! empty($toDrop)) {
                $table->dropColumn($toDrop);
            }
        });
    }
};
