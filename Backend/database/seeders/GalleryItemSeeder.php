<?php

namespace Database\Seeders;

use App\Models\GalleryItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class GalleryItemSeeder extends Seeder
{
    /**
     * Mirrors Frontend/src/data/gallery.ts's structure, reading copy from the locale
     * JSON files and copying existing static images into backend storage. External
     * (https://) image URLs are kept as-is instead of being downloaded.
     */
    public function run(): void
    {
        if (GalleryItem::count() > 0) {
            return;
        }

        $structure = [
            ['id' => 'oxygen', 'image' => '/images/products/Oxygen_Fix.webp', 'category' => 'products', 'year' => 2007, 'size' => 'medium'],
            ['id' => 'nitrogen', 'image' => '/images/products/Nitrogen_Fix.webp', 'category' => 'products', 'year' => 2008, 'size' => 'small'],
            ['id' => 'mix-gas', 'image' => '/images/products/Mixed_Gas_Fix.webp', 'category' => 'products', 'year' => 2009, 'size' => 'small'],
            ['id' => 'vertical-tank', 'image' => '/images/products/Vertical_Tank.webp', 'category' => 'package', 'year' => 2010, 'size' => 'tall'],
            ['id' => 'acetylene', 'image' => '/images/products/Acetylene_fix.webp', 'category' => 'products', 'year' => 2011, 'size' => 'medium'],
            ['id' => 'iso-tank', 'image' => '/images/products/ISO_Tank.webp', 'category' => 'package', 'year' => 2012, 'size' => 'wide'],
            ['id' => 'liquid-filling', 'image' => '/images/products/Liquid_Filling.webp', 'category' => 'facility', 'year' => 2013, 'size' => 'large'],
            ['id' => 'microbulk', 'image' => '/images/products/Microbulk.webp', 'category' => 'package', 'year' => 2014, 'size' => 'small'],
            ['id' => 'medical-gas', 'image' => '/images/products/Oxygen_Fix.webp', 'category' => 'products', 'year' => 2015, 'size' => 'medium'],
            ['id' => 'office-view-2', 'image' => '/images/office/office_view2.webp', 'category' => 'facility', 'year' => 2016, 'size' => 'wide'],
            ['id' => 'office-view-3', 'image' => '/images/office/office_view3.webp', 'category' => 'facility', 'year' => 2017, 'size' => 'tall'],
            ['id' => 'gas-cylinder-1', 'image' => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop', 'category' => 'facility', 'year' => 2018, 'size' => 'large'],
            ['id' => 'industrial-plant-1', 'image' => 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=800&fit=crop', 'category' => 'facility', 'year' => 2019, 'size' => 'wide'],
            ['id' => 'welding-1', 'image' => 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&h=800&fit=crop', 'category' => 'products', 'year' => 2020, 'size' => 'medium'],
            ['id' => 'lab-1', 'image' => 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=800&fit=crop', 'category' => 'facility', 'year' => 2021, 'size' => 'small'],
            ['id' => 'delivery-1', 'image' => 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=800&fit=crop', 'category' => 'facility', 'year' => 2022, 'size' => 'tall'],
            ['id' => 'tank-1', 'image' => 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1200&h=800&fit=crop', 'category' => 'package', 'year' => 2023, 'size' => 'large'],
            ['id' => 'valve-1', 'image' => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop', 'category' => 'package', 'year' => 2024, 'size' => 'small'],
            ['id' => 'hospital-1', 'image' => 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=800&fit=crop', 'category' => 'facility', 'year' => 2025, 'size' => 'wide'],
            ['id' => 'quality-1', 'image' => 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=800&fit=crop', 'category' => 'facility', 'year' => 2026, 'size' => 'medium'],
            ['id' => 'training-1', 'image' => 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=800&fit=crop', 'category' => 'facility', 'year' => 2007, 'size' => 'small'],
            ['id' => 'pressure-gauge-1', 'image' => 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&h=800&fit=crop', 'category' => 'package', 'year' => 2009, 'size' => 'small'],
            ['id' => 'factory-1', 'image' => 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=800&fit=crop', 'category' => 'facility', 'year' => 2010, 'size' => 'large'],
            ['id' => 'medical-equipment-1', 'image' => 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=800&fit=crop', 'category' => 'products', 'year' => 2011, 'size' => 'medium'],
            ['id' => 'cryogenic-1', 'image' => 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1200&h=800&fit=crop', 'category' => 'package', 'year' => 2012, 'size' => 'tall'],
            ['id' => 'assembly-1', 'image' => 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&h=800&fit=crop', 'category' => 'facility', 'year' => 2013, 'size' => 'wide'],
            ['id' => 'fire-safety-1', 'image' => 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=800&fit=crop', 'category' => 'facility', 'year' => 2014, 'size' => 'small'],
            ['id' => 'transport-1', 'image' => 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&h=800&fit=crop', 'category' => 'facility', 'year' => 2015, 'size' => 'large'],
            ['id' => 'laboratory-2', 'image' => 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&h=800&fit=crop', 'category' => 'facility', 'year' => 2016, 'size' => 'medium'],
            ['id' => 'regulator-1', 'image' => 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&h=800&fit=crop', 'category' => 'package', 'year' => 2017, 'size' => 'small'],
        ];

        $locales = LocaleReader::load();
        $publicDir = base_path('../Frontend/public');

        foreach ($structure as $index => $item) {
            $texts = $locales['id']['gallery']['items'][$item['id']] ?? [];

            $imagePath = $item['image'];
            if (!str_starts_with($imagePath, 'http')) {
                $sourcePath = $publicDir . $imagePath;
                $storedPath = 'gallery/' . $item['id'] . '-' . basename($imagePath);
                if (file_exists($sourcePath)) {
                    Storage::disk('public')->put($storedPath, file_get_contents($sourcePath));
                    $imagePath = $storedPath;
                }
            }

            GalleryItem::create([
                'title_id' => $texts['title'] ?? $item['id'],
                'title_en' => $locales['en']['gallery']['items'][$item['id']]['title'] ?? null,
                'title_zh' => $locales['zh']['gallery']['items'][$item['id']]['title'] ?? null,
                'description_id' => $texts['description'] ?? '',
                'description_en' => $locales['en']['gallery']['items'][$item['id']]['description'] ?? null,
                'description_zh' => $locales['zh']['gallery']['items'][$item['id']]['description'] ?? null,
                'detailed_description_id' => $texts['detailedDescription'] ?? null,
                'detailed_description_en' => $locales['en']['gallery']['items'][$item['id']]['detailedDescription'] ?? null,
                'detailed_description_zh' => $locales['zh']['gallery']['items'][$item['id']]['detailedDescription'] ?? null,
                'category' => $item['category'],
                'year' => $item['year'],
                'size' => $item['size'],
                'image' => $imagePath,
                'display_order' => $index,
                'is_active' => true,
            ]);
        }
    }
}
