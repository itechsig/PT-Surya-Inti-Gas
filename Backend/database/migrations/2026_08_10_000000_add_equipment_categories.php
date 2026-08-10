<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Adds the missing 'equipment' main_category and its sub-categories to the product_categories table.
 * These categories are referenced by products in the ProductSeeder but were missing from the initial
 * ProductCategorySeeder, causing 500 errors when trying to load those products.
 */
return new class extends Migration
{
    public function up(): void
    {
        $categories = [
            [
                'main_category' => 'equipment',
                'slug' => 'assist-gas',
                'name_id' => 'Bantuan Gas',
                'name_en' => 'Assist Gas',
                'name_zh' => '辅助气体',
                'display_order' => 0,
            ],
            [
                'main_category' => 'equipment',
                'slug' => 'cryogenic-transport',
                'name_id' => 'Transport Kriogenik',
                'name_en' => 'Cryogenic Transport',
                'name_zh' => '低温运输',
                'display_order' => 1,
            ],
            [
                'main_category' => 'equipment',
                'slug' => 'regulator-valves',
                'name_id' => 'Regulator & Katup',
                'name_en' => 'Regulator & Valves',
                'name_zh' => '调节器和阀门',
                'display_order' => 2,
            ],
            [
                'main_category' => 'equipment',
                'slug' => 'medical-gas-equipment',
                'name_id' => 'Peralatan Gas Medis',
                'name_en' => 'Medical Gas Equipment',
                'name_zh' => '医用气体设备',
                'display_order' => 3,
            ],
        ];

        foreach ($categories as $category) {
            // Only insert if the category doesn't already exist
            $exists = DB::table('product_categories')
                ->where('slug', $category['slug'])
                ->exists();

            if (!$exists) {
                DB::table('product_categories')->insert($category);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $slugs = ['assist-gas', 'cryogenic-transport', 'regulator-valves', 'medical-gas-equipment'];
        DB::table('product_categories')->whereIn('slug', $slugs)->delete();
    }
};
