<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Product;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Fix corrupted/duplicate image paths in production
        $fixes = [
            'delivery' => 'products/delivery-Delivery.webp',
            'refilling' => 'products/refilling-Refilling.webp',
            'cryogenic-dewars' => 'products/cryogenic-dewars-Cryogenic_Dewar.webp',
            'vessel-gas-liquid' => 'products/vessel-gas-liquid-VGL.webp',
            'microbulk-tank' => 'products/microbulk-tank-Microbulk_.webp',
            'perbaikan' => 'products/maintenance-Installation.webp',
            'gasalam' => 'products/refilling-Refilling.webp',
        ];

        foreach ($fixes as $slug => $newImage) {
            Product::where('slug', $slug)->update(['image' => $newImage]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert changes if needed
    }
};