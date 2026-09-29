<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (! Schema::hasColumn('products', 'quality')) {
                // Gas grade: UHP (Ultra High Purity), HP (High Purity), WG (Welding Grade).
                $table->string('quality', 10)->nullable()->after('specifications');
            }
            if (! Schema::hasColumn('products', 'availability')) {
                // 'available' (Tersedia) or 'out_of_stock' (Kosong).
                $table->string('availability', 20)->default('available')->after('quality');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $existing = array_values(array_filter(
                ['quality', 'availability'],
                fn ($column) => Schema::hasColumn('products', $column)
            ));
            if (! empty($existing)) {
                $table->dropColumn($existing);
            }
        });
    }
};
