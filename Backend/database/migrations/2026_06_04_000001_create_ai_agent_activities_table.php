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
        Schema::create('ai_agent_activities', function (Blueprint $table) {
            $table->id();
            $table->string('activity_type', 100); // monitoring, analysis, risk_detection, recommendation
            $table->string('source', 100); // contact_message, career_application, visitor_activity, user_behavior
            $table->unsignedBigInteger('source_id')->nullable();
            $table->string('source_type', 100)->nullable();
            $table->text('description');
            $table->json('metadata')->nullable(); // additional data about the activity
            $table->enum('status', ['completed', 'pending', 'failed'])->default('completed');
            $table->text('error_message')->nullable();
            $table->timestamp('executed_at')->useCurrent();
            $table->timestamps();
            
            $table->index('activity_type');
            $table->index('source');
            $table->index('status');
            $table->index('executed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_agent_activities');
    }
};
