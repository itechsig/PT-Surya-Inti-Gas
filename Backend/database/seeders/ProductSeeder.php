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
                ['id' => 'carbon-monoxide', 'image' => 'CO2_Fix.webp'],
                ['id' => 'propane', 'image' => 'Oxygen_Fix.webp'], // Using Oxygen image as fallback
                ['id' => 'butane', 'image' => 'Oxygen_Fix.webp'], // Using Oxygen image as fallback
            ],
            'speciality-mixed' => [
                ['id' => 'helium', 'image' => 'Helium_Fix.webp'],
                ['id' => 'sulfur-hexaflouride', 'image' => 'SF6_Fix.webp'],
                ['id' => 'mixed-gas', 'image' => 'Mixed_Gas_Fix.webp'],
            ],
            'package' => [
                ['id' => 'cradle-2x2', 'image' => 'Craddle_3x2.webp'],
                ['id' => 'cradle-3x2', 'image' => 'Craddle_3x2.webp'],
                ['id' => 'cradle-3x3', 'image' => 'Craddle_4x4_fixed.webp'],
                ['id' => 'cradle-4x4', 'image' => 'Craddle_4x4_fixed.webp'],
                ['id' => 'package-high-pressure', 'image' => '20260618_134436.webp'],
                ['id' => 'cryogenic-dewars', 'image' => 'Cryogenic_Dewar.webp'],
                ['id' => 'vessel-gas-liquid', 'image' => 'VGL.webp'],
                ['id' => 'microbulk-tank', 'image' => 'Microbulk_.webp'],
                ['id' => 'iso-tank', 'image' => 'ISO_Tank.webp'],
                ['id' => 'lorry-tank', 'image' => 'Road_tank.webp'],
            ],
        ];

        // Only skip if all products exist (based on slugs)
        $requiredSlugs = [];
        foreach ($structure as $categorySlug => $items) {
            foreach ($items as $item) {
                $requiredSlugs[] = $item['id'];
            }
        }
        
        // Add service products to required slugs
        $requiredSlugs[] = 'installation';
        $requiredSlugs[] = 'delivery';
        $requiredSlugs[] = 'refilling';
        $requiredSlugs[] = 'testing';
        $requiredSlugs[] = 'maintenance';
        
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
                
                // For gas items, use specific naming for carbon-monoxide, propane, and butane
                if ($categorySlug === 'industrial-medical') {
                    $gasNames = [
                        'carbon-monoxide' => [
                            'title' => 'Karbon Monoksida (CO)',
                            'description' => 'Gas karbon monoksida untuk aplikasi industri dan medis',
                            'fullDescription' => 'Karbon Monoksida (CO) adalah gas yang digunakan dalam berbagai aplikasi industri dan medis. Dalam industri, CO digunakan dalam proses kimia, metalurgi, dan sebagai bahan baku untuk pembuatan berbagai produk kimia. Dalam medis, CO digunakan dalam terapi oksigen hiperbarik dan dalam beberapa prosedur medis spesifik. PT Surya Inti Gas menyediakan karbon monoksida dengan tingkat kemurnian yang sesuai untuk aplikasi industri dan medis.'
                        ],
                        'propane' => [
                            'title' => 'Propana (C3H8)',
                            'description' => 'Gas propana untuk aplikasi industri dan rumah tangga',
                            'fullDescription' => 'Propana (C3H8) adalah gas hidrokarbon yang banyak digunakan sebagai bahan bakar untuk aplikasi industri dan rumah tangga. Dalam industri, propana digunakan untuk pemotongan logam, pengelasan, dan sebagai bahan bakar untuk forklift dan kendaraan industri. Dalam rumah tangga, propana digunakan untuk memasak, pemanas, dan sebagai bahan bakar kendaraan. PT Surya Inti Gas menyediakan propana dengan kualitas tinggi untuk berbagai aplikasi.'
                        ],
                        'butane' => [
                            'title' => 'Butana (C4H10)',
                            'description' => 'Gas butana untuk aplikasi industri dan rumah tangga',
                            'fullDescription' => 'Butana (C4H10) adalah gas hidrokarbon yang banyak digunakan sebagai bahan bakar untuk aplikasi industri dan rumah tangga. Dalam industri, butana digunakan untuk proses kimia, sebagai bahan bakar untuk torch, dan dalam manufaktur. Dalam rumah tangga, butana digunakan untuk memasak, pemanas, dan sebagai bahan bakar. PT Surya Inti Gas menyediakan butana dengan kualitas tinggi untuk berbagai aplikasi.'
                        ],
                    ];
                    
                    if (isset($gasNames[$item['id']])) {
                        $texts['title'] = $gasNames[$item['id']]['title'];
                        $texts['description'] = $gasNames[$item['id']]['description'];
                        $texts['fullDescription'] = $gasNames[$item['id']]['fullDescription'];
                    }
                }
                
                // For package items, use specific naming
                if ($categorySlug === 'package') {
                    $packageNames = [
                        'cradle-2x2' => 'Cradle (2x2)',
                        'cradle-3x2' => 'Cradle (3x2)',
                        'cradle-3x3' => 'Cradle (3x3)',
                        'cradle-4x4' => 'Cradle (4x4)',
                        'package-high-pressure' => 'Cylinder',
                        'cryogenic-dewars' => 'Cryogenic Dewars',
                        'vessel-gas-liquid' => 'Vessel Gas Liquid',
                        'microbulk-tank' => 'Microbulk Tank',
                        'iso-tank' => 'ISO Tank',
                        'lorry-tank' => 'Rigged Tank',
                    ];
                    
                    if (isset($packageNames[$item['id']])) {
                        $texts['title'] = $packageNames[$item['id']];
                    }
                }

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
