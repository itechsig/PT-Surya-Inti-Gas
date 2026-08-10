<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Updates the cryogenic-transport category name to Cryogenic Rigged Tank
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::table('product_categories')
            ->where('slug', 'cryogenic-transport')
            ->update([
                'name_id' => 'Transport Rigged Kriogenik',
                'name_en' => 'Cryogenic Rigged Tank',
                'name_zh' => '低温 Rigged 罐运输',
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('product_categories')
            ->where('slug', 'cryogenic-transport')
            ->update([
                'name_id' => 'Transport Kriogenik',
                'name_en' => 'Cryogenic Transport',
                'name_zh' => '低温运输',
            ]);
    }
};
