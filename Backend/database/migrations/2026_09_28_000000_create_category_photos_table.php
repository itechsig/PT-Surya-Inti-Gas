<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Photos shown in place of the lucide icons on the Product.tsx category/sub-category
 * picker cards. Keyed by a fixed string (not a foreign key) because several of these
 * cards are virtual UI groupings with no backing `product_categories` row at all - the
 * 3 main categories (gas/package/services) aren't rows themselves, and Kemasan's 3
 * sub-category cards are a frontend-only grouping by product slug (see
 * PACKAGE_SUBCATEGORY_GROUPS in Product.tsx). A flat key -> image table sidesteps that
 * mismatch instead of forcing every card into the relational category model.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('category_photos', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('image_path')->nullable();
            $table->timestamps();
        });

        // Seed every known picker-card key up front so the admin screen always lists
        // all of them (with a null image, falling back to the icon) rather than only
        // showing rows once someone has uploaded a photo.
        $keys = [
            'main-gas', 'main-package', 'main-services',
            'sub-industrial-medical-speciality', 'sub-liquid', 'sub-related-equipment',
            'sub-package-gas', 'sub-package-liquid', 'sub-package-cylinder',
        ];

        $now = now();
        DB::table('category_photos')->insert(array_map(fn (string $key) => [
            'key' => $key,
            'image_path' => null,
            'created_at' => $now,
            'updated_at' => $now,
        ], $keys));
    }

    public function down(): void
    {
        Schema::dropIfExists('category_photos');
    }
};
