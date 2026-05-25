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
        Schema::dropIfExists('chatbot_feedback');
        Schema::create('chatbot_feedback', function (Blueprint $table) {
            $table->id();
            $table->string('user_message');
            $table->text('bot_response');
            $table->string('source'); // local, vector, ai, fallback
            $table->string('intent')->nullable();
            $table->float('confidence')->nullable();
            $table->integer('rating')->nullable();
            $table->text('comment')->nullable();
            $table->boolean('helpful')->nullable();
            $table->text('metadata')->nullable();
            $table->string('session_id')->nullable();
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chatbot_feedback');
    }
};
