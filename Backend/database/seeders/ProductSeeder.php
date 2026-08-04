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
        if (Product::count() > 0) {
            return;
        }

        $structure = [
            'industrial-medical' => [
                ['id' => 'acetylene', 'image' => 'Acetylene-optimized.webp'],
                ['id' => 'oxygen', 'image' => 'Oxygen-optimized.webp'],
                ['id' => 'nitrogen', 'image' => 'Nitrogen-optimized.webp'],
                ['id' => 'argon', 'image' => 'Argon-optimized.webp'],
                ['id' => 'carbon-dioxide', 'image' => 'CO2_Fix.webp'],
                ['id' => 'hydrogen', 'image' => 'Hidrogen-optimized.webp'],
            ],
            'speciality-mixed' => [
                ['id' => 'helium', 'image' => 'Helium-optimized.webp'],
                ['id' => 'sulfur-hexaflouride', 'image' => 'Sulfur_Hexaflouride.webp'],
                ['id' => 'mixed-gas', 'image' => 'Mix_gas.webp'],
            ],
            'color-code' => [
                ['id' => 'color-code-acetylene', 'image' => 'Acetylene-optimized.webp'],
                ['id' => 'color-code-special', 'image' => 'Special_gas_.webp'],
                ['id' => 'color-code-medical', 'image' => 'Medical_Gas_Cylinder.webp'],
                ['id' => 'color-code-industrial', 'image' => '20260618_134406.webp'],
            ],
            'package' => [
                ['id' => 'package-high-pressure', 'image' => '20260618_134436.webp'],
                ['id' => 'cradle-3x2', 'image' => 'Craddle_3x2.webp'],
                ['id' => 'cradle-4x4', 'image' => 'Craddle_4x4_fixed.webp'],
                ['id' => 'cryogenic-dewars', 'image' => 'Cryogenic_Dewar.webp'],
                ['id' => 'vessel-gas-liquid', 'image' => 'VGL.webp'],
                ['id' => 'microbulk-tank', 'image' => 'Microbulk_.webp'],
                ['id' => 'vertical-storage-tank', 'image' => 'Vertical_Tank.webp'],
            ],
            'assist-gas' => [
                ['id' => 'assist-gas-cradle-4x4', 'image' => 'Assist_Gas_Supply.webp'],
                ['id' => 'microbulk-gas-supply', 'image' => 'Microbulk_Gas_Supply.webp'],
                ['id' => 'storage-tank-gas-supply', 'image' => 'Storage_Tank_Gas.webp'],
            ],
            'cryogenic-transport' => [
                ['id' => 'liquid-filling-transfer', 'image' => 'Liquid_Filling.webp'],
                ['id' => 'cryogenic-iso-tank', 'image' => 'ISO_Tank.webp'],
                ['id' => 'cryogenic-road-tank', 'image' => 'Road_tank.webp'],
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

        $locales = LocaleReader::load();
        $imagesDir = LocaleReader::imagesDir();

        foreach ($structure as $categorySlug => $items) {
            $category = ProductCategory::where('slug', $categorySlug)->first();
            if (!$category) {
                continue;
            }

            foreach ($items as $index => $item) {
                $sourcePath = $imagesDir . '/' . $item['image'];
                $storedPath = 'products/' . $item['id'] . '-' . $item['image'];

                if (file_exists($sourcePath)) {
                    Storage::disk('public')->put($storedPath, file_get_contents($sourcePath));
                }

                $texts = $locales['id']['products']['items'][$item['id']] ?? [];

                Product::create([
                    'product_category_id' => $category->id,
                    'slug' => $item['id'],
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
                ]);
            }
        }
    }
}
