<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Fixes products that have invalid or missing category relationships.
 * Some products may reference categories that don't exist, causing 500 errors
 * when trying to load product details.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Find products that reference non-existent categories
        $invalidProducts = DB::table('products')
            ->leftJoin('product_categories', 'products.product_category_id', '=', 'product_categories.id')
            ->whereNull('product_categories.id')
            ->pluck('products.id');

        if ($invalidProducts->isNotEmpty()) {
            // Delete or disable these products to prevent 500 errors
            DB::table('products')->whereIn('id', $invalidProducts)->delete();
        }

        // Log the action
        if ($invalidProducts->isNotEmpty()) {
            \Log::info('Deleted ' . $invalidProducts->count() . ' products with invalid category relationships');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This migration is one-way - we can't restore deleted products
        // without knowing their original data
    }
};
