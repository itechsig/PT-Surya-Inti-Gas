<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_interactions', function (Blueprint $table) {
            $table->id();
            $table->string('product_slug');
            $table->enum('type', ['view', 'whatsapp_click']);
            $table->timestamp('created_at')->useCurrent();

            $table->index(['product_slug', 'type']);
            $table->index(['type', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_interactions');
    }
};
