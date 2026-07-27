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
        Schema::create('job_vacancies', function (Blueprint $table) {
            $table->id();
            $table->string('title_id');
            $table->string('title_en')->nullable();
            $table->string('title_zh')->nullable();
            $table->string('division_id');
            $table->string('division_en')->nullable();
            $table->string('division_zh')->nullable();
            $table->string('location_id');
            $table->string('location_en')->nullable();
            $table->string('location_zh')->nullable();
            $table->string('type_id')->default('Penuh Waktu');
            $table->string('type_en')->nullable();
            $table->string('type_zh')->nullable();
            $table->string('level_id');
            $table->string('level_en')->nullable();
            $table->string('level_zh')->nullable();
            $table->string('description_id');
            $table->string('description_en')->nullable();
            $table->string('description_zh')->nullable();
            $table->text('full_description_id')->nullable();
            $table->text('full_description_en')->nullable();
            $table->text('full_description_zh')->nullable();
            $table->json('requirements_id')->nullable();
            $table->json('requirements_en')->nullable();
            $table->json('requirements_zh')->nullable();
            $table->date('deadline');
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
        Schema::dropIfExists('job_vacancies');
    }
};
