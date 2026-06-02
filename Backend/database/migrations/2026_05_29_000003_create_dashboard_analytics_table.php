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
        Schema::create('dashboard_analytics', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->integer('total_visitors')->default(0);
            $table->integer('unique_visitors')->default(0);
            $table->integer('page_views')->default(0);
            $table->integer('new_contacts')->default(0);
            $table->integer('pending_contacts')->default(0);
            $table->integer('resolved_contacts')->default(0);
            $table->integer('chatbot_interactions')->default(0);
            $table->float('avg_time_on_site')->default(0);
            $table->float('bounce_rate')->default(0);
            $table->json('top_pages')->nullable();
            $table->json('top_referrers')->nullable();
            $table->json('visitor_devices')->nullable();
            $table->json('visitor_locations')->nullable();
            $table->timestamps();
            
            $table->unique('date');
            $table->index('date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dashboard_analytics');
    }
};
