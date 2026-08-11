<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use Illuminate\Database\Seeder;

class ProductCategorySeeder extends Seeder
{
    /**
     * Mirrors Frontend/src/data/products.ts's category structure, reading display
     * names straight from the locale JSON files so no text is retyped by hand.
     */
    public function run(): void
    {
        // Only skip if all required categories exist
        $requiredSlugs = [
            'industrial-medical', 'speciality-mixed', 'color-code',
            'cradle-2x2', 'cradle-3x2', 'cradle-3x3', 'cradle-4x4', 'cylinder',
            'cryogenic-dewars', 'vessel-gas-liquid', 'microbulk-tank', 'iso-tank', 'lorry-tank',
            'assist-gas', 'cryogenic-transport', 'regulator-valves', 'medical-gas-equipment'
        ];
        
        $existingCount = ProductCategory::whereIn('slug', $requiredSlugs)->count();
        if ($existingCount === count($requiredSlugs)) {
            return;
        }

        $categories = [
            ['main_category' => 'gas', 'slug' => 'industrial-medical', 'order' => 0],
            ['main_category' => 'gas', 'slug' => 'speciality-mixed', 'order' => 1],
            ['main_category' => 'gas', 'slug' => 'color-code', 'order' => 2],
            ['main_category' => 'package', 'slug' => 'cradle-2x2', 'order' => 0],
            ['main_category' => 'package', 'slug' => 'cradle-3x2', 'order' => 1],
            ['main_category' => 'package', 'slug' => 'cradle-3x3', 'order' => 2],
            ['main_category' => 'package', 'slug' => 'cradle-4x4', 'order' => 3],
            ['main_category' => 'package', 'slug' => 'cylinder', 'order' => 4],
            ['main_category' => 'package', 'slug' => 'cryogenic-dewars', 'order' => 5],
            ['main_category' => 'package', 'slug' => 'vessel-gas-liquid', 'order' => 6],
            ['main_category' => 'package', 'slug' => 'microbulk-tank', 'order' => 7],
            ['main_category' => 'package', 'slug' => 'iso-tank', 'order' => 8],
            ['main_category' => 'package', 'slug' => 'lorry-tank', 'order' => 9],
            // Equipment categories (for equipment items that were previously categorized as equipment)
            ['main_category' => 'equipment', 'slug' => 'assist-gas', 'order' => 0],
            ['main_category' => 'equipment', 'slug' => 'cryogenic-transport', 'order' => 1],
            ['main_category' => 'equipment', 'slug' => 'regulator-valves', 'order' => 2],
            ['main_category' => 'equipment', 'slug' => 'medical-gas-equipment', 'order' => 3],
        ];

        $locales = LocaleReader::load();

        foreach ($categories as $category) {
            ProductCategory::updateOrCreate(
                ['slug' => $category['slug']],
                [
                    'main_category' => $category['main_category'],
                    'name_id' => $locales['id']['products']['categories'][$category['slug']] ?? $category['slug'],
                    'name_en' => $locales['en']['products']['categories'][$category['slug']] ?? null,
                    'name_zh' => $locales['zh']['products']['categories'][$category['slug']] ?? null,
                    'display_order' => $category['order'],
                ]
            );
        }
    }
}
