<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * HeroSlideSeeder and GalleryItemSeeder create their DB row unconditionally, even when the
 * source image they meant to copy into storage didn't exist under the name they referenced
 * (it had since been renamed - e.g. "Oxygen-optimized.webp" -> "Oxygen_Fix.webp"). That left
 * these rows pointing at files that were never actually written to storage, causing 404s.
 *
 * This repoints just those specific rows at the corrected, now-committed files (see
 * Backend/storage/app/public/hero-slides/ and .../gallery/). Matching is done on the exact
 * stale value the buggy seeder would have written, so this is a no-op for any row an admin
 * already fixed by re-uploading through the dashboard (its image column no longer matches).
 */
return new class extends Migration
{
    public function up(): void
    {
        $heroSlideFixes = [
            'hero-slides/Oxygen-optimized.webp' => 'hero-slides/Oxygen_Fix.webp',
            'hero-slides/Nitrogen-optimized.webp' => 'hero-slides/Nitrogen_Fix.webp',
            'hero-slides/Argon-optimized.webp' => 'hero-slides/Argon_Fix.webp',
        ];

        foreach ($heroSlideFixes as $old => $new) {
            DB::table('hero_slides')->where('image', $old)->update(['image' => $new]);
        }

        $galleryItemFixes = [
            '/images/products/Oxygen-optimized.webp' => 'gallery/oxygen-Oxygen_Fix.webp',
            '/images/products/Nitrogen-optimized.webp' => 'gallery/nitrogen-Nitrogen_Fix.webp',
            '/images/products/Mix_gas.webp' => 'gallery/mix-gas-Mixed_Gas_Fix.webp',
            '/images/products/Acetylene-optimized.webp' => 'gallery/acetylene-Acetylene_fix.webp',
            '/images/products/Medical_Gas_Cylinder.webp' => 'gallery/medical-gas-Oxygen_Fix.webp',
        ];

        foreach ($galleryItemFixes as $old => $new) {
            DB::table('gallery_items')->where('image', $old)->update(['image' => $new]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // One-way: the stale values being replaced pointed at files that never existed,
        // so there is nothing correct to roll back to.
    }
};
