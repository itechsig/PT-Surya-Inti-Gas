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
        Schema::create('gallery_items', function (Blueprint $table) {
            $table->id();
            $table->string('title_id');
            $table->string('title_en')->nullable();
            $table->string('title_zh')->nullable();
            $table->string('description_id');
            $table->string('description_en')->nullable();
            $table->string('description_zh')->nullable();
            $table->text('detailed_description_id')->nullable();
            $table->text('detailed_description_en')->nullable();
            $table->text('detailed_description_zh')->nullable();
            $table->string('category', 50);
            $table->unsignedSmallInteger('year');
            $table->string('size', 20)->default('medium');
            $table->string('image');
            $table->unsignedInteger('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gallery_items');
    }
};
