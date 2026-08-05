<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Fix localhost URLs in products table
        DB::statement("
            UPDATE products 
            SET image = REPLACE(image, 'http://localhost/storage/', '')
            WHERE image LIKE 'http://localhost/storage/%'
        ");

        DB::statement("
            UPDATE products 
            SET image = REPLACE(image, 'http://localhost:8000/storage/', '')
            WHERE image LIKE 'http://localhost:8000/storage/%'
        ");

        // Fix gallery array in products table
        $products = DB::table('products')->whereNotNull('gallery')->get();
        foreach ($products as $product) {
            if (is_string($product->gallery)) {
                $gallery = json_decode($product->gallery, true);
                if (is_array($gallery)) {
                    $fixedGallery = array_map(function($path) {
                        return str_replace('http://localhost/storage/', '', $path);
                    }, $gallery);
                    $fixedGallery = array_map(function($path) {
                        return str_replace('http://localhost:8000/storage/', '', $path);
                    }, $fixedGallery);
                    
                    DB::table('products')
                        ->where('id', $product->id)
                        ->update(['gallery' => json_encode($fixedGallery)]);
                }
            }
        }

        // Fix localhost URLs in hero_slides table
        DB::statement("
            UPDATE hero_slides 
            SET image = REPLACE(image, 'http://localhost/storage/', '')
            WHERE image LIKE 'http://localhost/storage/%'
        ");

        DB::statement("
            UPDATE hero_slides 
            SET image = REPLACE(image, 'http://localhost:8000/storage/', '')
            WHERE image LIKE 'http://localhost:8000/storage/%'
        ");

        // Fix localhost URLs in gallery_items table
        DB::statement("
            UPDATE gallery_items 
            SET image = REPLACE(image, 'http://localhost/storage/', '')
            WHERE image LIKE 'http://localhost/storage/%'
        ");

        DB::statement("
            UPDATE gallery_items 
            SET image = REPLACE(image, 'http://localhost:8000/storage/', '')
            WHERE image LIKE 'http://localhost:8000/storage/%'
        ");

        // Fix localhost URLs in portfolios table
        DB::statement("
            UPDATE portfolios 
            SET thumbnail = REPLACE(thumbnail, 'http://localhost/storage/', '')
            WHERE thumbnail LIKE 'http://localhost/storage/%'
        ");

        DB::statement("
            UPDATE portfolios 
            SET thumbnail = REPLACE(thumbnail, 'http://localhost:8000/storage/', '')
            WHERE thumbnail LIKE 'http://localhost:8000/storage/%'
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This migration is one-way and not reversible
        // because we don't know the original URLs
    }
};