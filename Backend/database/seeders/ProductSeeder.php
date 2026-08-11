<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class ProductSeeder extends Seeder
{
    /**
     * Mirrors Frontend/src/data/products.ts's product structure, reading copy from
     * the locale JSON files and copying the existing static images into backend
     * storage, so the cutover to the CMS causes no visual regression.
     */
    public function run(): void
    {
        $structure = [
            'industrial-medical' => [
                ['id' => 'acetylene', 'image' => 'Acetylene_fix.webp'],
                ['id' => 'oxygen', 'image' => 'Oxygen_Fix.webp'],
                ['id' => 'nitrogen', 'image' => 'Nitrogen_Fix.webp'],
                ['id' => 'argon', 'image' => 'Argon_Fix.webp'],
                ['id' => 'carbon-dioxide', 'image' => 'CO2_Fix.webp'],
                ['id' => 'hydrogen', 'image' => 'Hidrogen_Fix.webp'],
            ],
            'speciality-mixed' => [
                ['id' => 'helium', 'image' => 'Helium_Fix.webp'],
                ['id' => 'sulfur-hexaflouride', 'image' => 'SF6_Fix.webp'],
                ['id' => 'mixed-gas', 'image' => 'Mixed_Gas_Fix.webp'],
            ],
            'color-code' => [
                ['id' => 'color-code-acetylene', 'image' => 'Acetylene_fix.webp'],
                ['id' => 'color-code-special', 'image' => 'Special_gas_.webp'],
                ['id' => 'color-code-medical', 'image' => 'Oxygen_Fix.webp'],
                ['id' => 'color-code-industrial', 'image' => '20260618_134406.webp'],
            ],
            'cradle-2x2' => [
                ['id' => 'cradle-2x2', 'image' => 'Craddle_3x2.webp'],
            ],
            'cradle-3x2' => [
                ['id' => 'cradle-3x2', 'image' => 'Craddle_3x2.webp'],
            ],
            'cradle-3x3' => [
                ['id' => 'cradle-3x3', 'image' => 'Craddle_4x4_fixed.webp'],
            ],
            'cradle-4x4' => [
                ['id' => 'cradle-4x4', 'image' => 'Craddle_4x4_fixed.webp'],
            ],
            'cylinder' => [
                ['id' => 'package-high-pressure', 'image' => '20260618_134436.webp'],
            ],
            'cryogenic-dewars' => [
                ['id' => 'cryogenic-dewars', 'image' => 'Cryogenic_Dewar.webp'],
            ],
            'vessel-gas-liquid' => [
                ['id' => 'vessel-gas-liquid', 'image' => 'VGL.webp'],
            ],
            'microbulk-tank' => [
                ['id' => 'microbulk-tank', 'image' => 'Microbulk_.webp'],
            ],
            'iso-tank' => [
                ['id' => 'iso-tank', 'image' => 'ISO_Tank.webp'],
            ],
            'lorry-tank' => [
                ['id' => 'lorry-tank', 'image' => 'Road_tank.webp'],
            ],
            'assist-gas' => [
                ['id' => 'assist-gas-cradle-4x4', 'image' => 'Craddle_4x4_fixed.webp'],
                ['id' => 'microbulk-gas-supply', 'image' => 'Microbulk_Gas_Supply.webp'],
                ['id' => 'storage-tank-gas-supply', 'image' => 'Storage_Tank_Gas.webp'],
            ],
            'cryogenic-transport' => [
                ['id' => 'liquid-filling-transfer', 'image' => 'Liquid_Filling.webp'],
                ['id' => 'cryogenic-iso-tank', 'image' => 'ISO_Tank.webp'],
                ['id' => 'cryogenic-road-tank', 'image' => 'Road_tank.webp'],
                ['id' => 'cryogenic-rigged-tank', 'image' => 'Road_tank.webp'],
            ],
            'regulator-valves' => [
                ['id' => 'cryogenic-gas-valve', 'image' => 'Cryogenic&Valve.webp'],
                ['id' => 'gas-regulator-laser', 'image' => 'Gas_Regulator_For_Cutting.webp'],
                ['id' => 'high-pressure-regulator', 'image' => 'High_Pressure_Regulator.webp'],
                ['id' => 'high-pressure-gas-valve', 'image' => 'High_Pressure_Gas_Valve.webp'],
            ],
            'medical-gas-equipment' => [
                ['id' => 'gdms-systems', 'image' => 'GDMS.webp'],
            ],
        ];

        // Only skip if all products exist (based on slugs)
        $requiredSlugs = [];
        foreach ($structure as $categorySlug => $items) {
            foreach ($items as $item) {
                $requiredSlugs[] = $item['id'];
            }
        }
        
        $existingCount = Product::whereIn('slug', $requiredSlugs)->count();
        if ($existingCount === count($requiredSlugs)) {
            return;
        }

        $locales = LocaleReader::load();
        $imagesDir = LocaleReader::imagesDir();

        foreach ($structure as $categorySlug => $items) {
            $category = ProductCategory::where('slug', $categorySlug)->first();
            if (!$category) {
                // Log or skip if category doesn't exist
                continue;
            }

            foreach ($items as $index => $item) {
                $sourcePath = $imagesDir . '/' . $item['image'];
                $storedPath = 'products/' . $item['id'] . '-' . $item['image'];

                if (file_exists($sourcePath)) {
                    Storage::disk('public')->put($storedPath, file_get_contents($sourcePath));
                }

                $texts = $locales['id']['products']['items'][$item['id']] ?? [];

                Product::updateOrCreate(
                    ['slug' => $item['id']],
                    [
                        'product_category_id' => $category->id,
                        'name_id' => $texts['title'] ?? $item['id'],
                        'name_en' => $locales['en']['products']['items'][$item['id']]['title'] ?? null,
                        'name_zh' => $locales['zh']['products']['items'][$item['id']]['title'] ?? null,
                        'description_id' => $texts['description'] ?? '',
                        'description_en' => $locales['en']['products']['items'][$item['id']]['description'] ?? null,
                        'description_zh' => $locales['zh']['products']['items'][$item['id']]['description'] ?? null,
                        'full_description_id' => $texts['fullDescription'] ?? null,
                        'full_description_en' => $locales['en']['products']['items'][$item['id']]['fullDescription'] ?? null,
                        'full_description_zh' => $locales['zh']['products']['items'][$item['id']]['fullDescription'] ?? null,
                        'image' => $storedPath,
                        'display_order' => $index,
                        'is_featured' => false,
                        'is_published' => true,
                    ]
                );
            }
        }
    }
}
