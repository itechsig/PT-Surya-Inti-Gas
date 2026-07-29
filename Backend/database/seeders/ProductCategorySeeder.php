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
        if (ProductCategory::count() > 0) {
            return;
        }

        $categories = [
            ['main_category' => 'gas', 'slug' => 'industrial-medical', 'order' => 0],
            ['main_category' => 'gas', 'slug' => 'speciality-mixed', 'order' => 1],
            ['main_category' => 'package', 'slug' => 'color-code', 'order' => 0],
            ['main_category' => 'package', 'slug' => 'package', 'order' => 1],
            ['main_category' => 'package', 'slug' => 'assist-gas', 'order' => 2],
            ['main_category' => 'package', 'slug' => 'cryogenic-transport', 'order' => 3],
            ['main_category' => 'package', 'slug' => 'regulator-valves', 'order' => 4],
            ['main_category' => 'package', 'slug' => 'medical-gas-equipment', 'order' => 5],
        ];

        $locales = LocaleReader::load();

        foreach ($categories as $category) {
            ProductCategory::create([
                'main_category' => $category['main_category'],
                'slug' => $category['slug'],
                'name_id' => $locales['id']['products']['categories'][$category['slug']] ?? $category['slug'],
                'name_en' => $locales['en']['products']['categories'][$category['slug']] ?? null,
                'name_zh' => $locales['zh']['products']['categories'][$category['slug']] ?? null,
                'display_order' => $category['order'],
            ]);
        }
    }
}
