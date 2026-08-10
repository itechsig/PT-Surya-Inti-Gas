<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use Illuminate\Database\Seeder;

/**
 * Adds the missing 'equipment' main_category and its sub-categories to the product_categories table.
 * These categories are referenced by products in the ProductSeeder but were missing from the initial
 * ProductCategorySeeder, causing 500 errors when trying to load those products.
 */
class EquipmentCategorySeeder extends Seeder
{
    public function run(): void
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
            $exists = ProductCategory::where('slug', $category['slug'])->exists();

            if (!$exists) {
                ProductCategory::create($category);
            }
        }
    }
}
