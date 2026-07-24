<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_category_id')->constrained()->cascadeOnDelete();
            $table->string('slug')->unique();
            $table->string('name_id');
            $table->string('name_en')->nullable();
            $table->string('name_zh')->nullable();
            $table->text('description_id');
            $table->text('description_en')->nullable();
            $table->text('description_zh')->nullable();
            $table->longText('full_description_id')->nullable();
            $table->longText('full_description_en')->nullable();
            $table->longText('full_description_zh')->nullable();
            $table->string('image');
            $table->json('gallery')->nullable();
            $table->json('specifications')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->unsignedInteger('display_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
