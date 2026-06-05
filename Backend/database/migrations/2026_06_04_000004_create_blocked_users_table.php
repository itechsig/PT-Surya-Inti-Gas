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
        Schema::create('blocked_users', function (Blueprint $table) {
            $table->id();
            $table->string('blockable_type', 100); // ip_address, email, user_id
            $table->string('blockable_value', 255);
            $table->text('reason');
            $table->enum('block_type', ['temporary', 'permanent'])->default('temporary');
            $table->timestamp('blocked_at')->useCurrent();
            $table->timestamp('unblocked_at')->nullable();
            $table->foreignId('blocked_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('unblocked_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('ai_recommendation_id')->nullable()->constrained('ai_recommendations')->nullOnDelete();
            $table->boolean('is_active')->default(true);
            $table->integer('warning_count')->default(0);
            $table->json('evidence')->nullable(); // evidence that led to blocking
            $table->text('admin_notes')->nullable();
            $table->timestamps();
            
            $table->index(['blockable_type', 'blockable_value']);
            $table->index('is_active');
            $table->index('blocked_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blocked_users');
    }
};
