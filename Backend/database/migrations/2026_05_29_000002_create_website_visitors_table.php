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
        Schema::create('website_visitors', function (Blueprint $table) {
            $table->id();
            $table->string('session_id', 255);
            $table->ipAddress('ip_address');
            $table->text('user_agent')->nullable();
            $table->string('browser', 100)->nullable();
            $table->string('os', 100)->nullable();
            $table->string('device_type', 50)->nullable(); // desktop, mobile, tablet
            $table->string('referrer', 500)->nullable();
            $table->string('landing_page', 500)->nullable();
            $table->string('exit_page', 500)->nullable();
            $table->integer('page_views')->default(1);
            $table->integer('time_on_site')->default(0); // in seconds
            $table->timestamp('first_visit')->useCurrent();
            $table->timestamp('last_visit')->useCurrent();
            $table->boolean('is_returning_visitor')->default(false);
            $table->json('pages_visited')->nullable();
            $table->string('country', 100)->nullable();
            $table->string('city', 100)->nullable();
            $table->timestamps();
            
            $table->index('session_id');
            $table->index('ip_address');
            $table->index('first_visit');
            $table->index('last_visit');
            $table->unique('session_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('website_visitors');
    }
};
