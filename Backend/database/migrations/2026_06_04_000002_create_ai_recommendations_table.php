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
        Schema::create('ai_recommendations', function (Blueprint $table) {
            $table->id();
            $table->string('recommendation_type', 100); // block_user, investigate_message, review_application, etc.
            $table->text('title');
            $table->text('description');
            $table->json('evidence')->nullable(); // data supporting the recommendation
            $table->enum('priority', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->enum('status', ['pending', 'approved', 'rejected', 'completed'])->default('pending');
            $table->unsignedBigInteger('target_id')->nullable(); // user_id, contact_id, etc.
            $table->string('target_type', 100)->nullable();
            $table->text('reasoning'); // AI explanation for the recommendation
            $table->json('suggested_action')->nullable(); // detailed action to be taken
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('review_notes')->nullable();
            $table->timestamps();
            
            $table->index('recommendation_type');
            $table->index('priority');
            $table->index('status');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_recommendations');
    }
};
