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
        Schema::create('maintenance_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('client_id'); // User ID as client
            $table->unsignedBigInteger('company_id')->nullable();
            $table->unsignedBigInteger('store_id')->nullable();
            $table->text('description')->nullable();
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->enum('type', ['preventive', 'corrective', 'emergency', 'upgrade', 'inspection', 'general'])->default('general');
            $table->enum('status', ['pending', 'approved', 'scheduled', 'in_progress', 'completed', 'cancelled', 'rejected'])->default('pending');
            $table->unsignedBigInteger('requested_by'); // User who requested
            $table->unsignedBigInteger('assigned_to')->nullable(); // User assigned to handle
            $table->timestamp('requested_at')->nullable();
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->text('notes')->nullable();
            $table->integer('estimated_duration')->nullable(); // in minutes
            $table->integer('actual_duration')->nullable(); // in minutes
            $table->decimal('cost', 10, 2)->nullable();
            $table->json('equipment_involved')->nullable();
            $table->enum('urgency_level', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->string('category')->nullable();
            $table->date('preferred_date')->nullable();
            $table->string('contact_phone')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Foreign key constraints
            $table->foreign('client_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');
            $table->foreign('requested_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('assigned_to')->references('id')->on('users')->onDelete('set null');

            // Indexes
            $table->index(['status', 'priority']);
            $table->index(['client_id', 'status']);
            $table->index(['company_id', 'status']);
            $table->index(['store_id', 'status']);
            $table->index('requested_at');
            $table->index('scheduled_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_requests');
    }
};
