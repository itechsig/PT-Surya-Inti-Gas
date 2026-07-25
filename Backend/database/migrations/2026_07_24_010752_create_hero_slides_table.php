<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero_slides', function (Blueprint $table) {
            $table->id();
            $table->string('title_id');
            $table->string('title_en')->nullable();
            $table->string('title_zh')->nullable();
            $table->string('subtitle_id');
            $table->string('subtitle_en')->nullable();
            $table->string('subtitle_zh')->nullable();
            $table->text('description_id');
            $table->text('description_en')->nullable();
            $table->text('description_zh')->nullable();
            $table->string('image');
            $table->string('cta_path')->nullable();
            $table->unsignedInteger('duration_ms')->default(5000);
            $table->unsignedInteger('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hero_slides');
    }
};
