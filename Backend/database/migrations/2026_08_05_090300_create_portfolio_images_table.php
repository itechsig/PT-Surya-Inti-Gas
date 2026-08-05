<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolio_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portfolio_id')->constrained()->cascadeOnDelete();
            $table->string('image');
            $table->string('caption')->nullable();
            $table->unsignedInteger('display_order')->default(0);
            $table->timestamps();

            $table->index(['portfolio_id', 'display_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolio_images');
    }
};
