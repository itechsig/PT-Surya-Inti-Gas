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
        Schema::table('portfolios', function (Blueprint $table) {
            $table->dropColumn([
                'location_id', 'location_en', 'location_zh',
                'completion_date',
                'product_solution_id', 'product_solution_en', 'product_solution_zh',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('portfolios', function (Blueprint $table) {
            $table->string('location_id')->after('title_zh');
            $table->string('location_en')->nullable()->after('location_id');
            $table->string('location_zh')->nullable()->after('location_en');
            $table->date('completion_date')->after('location_zh');
            $table->string('product_solution_id')->after('completion_date');
            $table->string('product_solution_en')->nullable()->after('product_solution_id');
            $table->string('product_solution_zh')->nullable()->after('product_solution_en');
        });
    }
};
