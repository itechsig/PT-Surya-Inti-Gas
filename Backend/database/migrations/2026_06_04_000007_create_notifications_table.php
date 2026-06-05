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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('type', 100); // new_contact, new_application, warning, approval_request, etc.
            $table->string('title', 255);
            $table->text('message');
            $table->enum('priority', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->enum('status', ['unread', 'read'])->default('unread');
            $table->json('data')->nullable(); // additional notification data
            $table->string('action_url')->nullable(); // link to take action
            $table->string('action_text')->nullable(); // button text for action
            $table->foreignId('related_id')->nullable(); // ID of related entity
            $table->string('related_type', 100)->nullable(); // Type of related entity
            $table->boolean('is_sent')->default(false); // whether email notification was sent
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamp('created_at')->useCurrent();
            
            $table->index('user_id');
            $table->index('type');
            $table->index('status');
            $table->index('priority');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
