<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('industry_id')->constrained()->cascadeOnDelete();
            $table->foreignId('service_type_id')->constrained()->cascadeOnDelete();
            $table->string('slug')->unique();

            $table->string('title_id');
            $table->string('title_en')->nullable();
            $table->string('title_zh')->nullable();

            $table->string('location_id');
            $table->string('location_en')->nullable();
            $table->string('location_zh')->nullable();

            $table->date('completion_date');

            $table->string('product_solution_id');
            $table->string('product_solution_en')->nullable();
            $table->string('product_solution_zh')->nullable();

            $table->text('summary_id');
            $table->text('summary_en')->nullable();
            $table->text('summary_zh')->nullable();

            $table->string('thumbnail');

            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            $table->unsignedInteger('display_order')->default(0);
            $table->timestamps();

            $table->index(['industry_id', 'is_published', 'display_order'], 'portfolios_industry_published_order_index');
            $table->index(['service_type_id', 'is_published'], 'portfolios_service_type_published_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolios');
    }
};
