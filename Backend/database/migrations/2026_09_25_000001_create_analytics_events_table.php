<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * New, self-contained table for the Analytics dashboard enhancement.
 * Does NOT touch website_visitors / product_interactions — those stay exactly as they are.
 * One row per event (page view or a contact-intent click), same append-only shape as
 * product_interactions. Powers Top Pages, Traffic Source, Social & Campaign, the Funnel,
 * and the Events section — all new sections in the existing admin dashboard.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('analytics_events', function (Blueprint $table) {
            $table->id();
            $table->string('session_id')->nullable();
            $table->string('event_type'); // page_view | whatsapp_click | phone_click | email_click | product_view | catalog_download
            $table->string('page', 500)->nullable(); // normalized path, e.g. /produk (locale prefix stripped)
            $table->string('label')->nullable(); // free-form context: product name, link target, etc.
            $table->string('utm_source')->nullable();
            $table->string('utm_medium')->nullable();
            $table->string('utm_campaign')->nullable();
            $table->string('utm_content')->nullable();
            $table->string('referrer', 500)->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['event_type', 'created_at']);
            $table->index(['session_id']);
            $table->index(['page']);
            $table->index(['utm_source', 'utm_campaign']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics_events');
    }
};
