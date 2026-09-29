<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Quality becomes multi-select: a JSON array of grades, e.g. ["UHP","HP"].
     */
    public function up(): void
    {
        // Wrap any existing single value ("UHP") into an array before switching the type.
        $existing = DB::table('products')->whereNotNull('quality')->pluck('quality', 'id');

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('quality');
        });
        Schema::table('products', function (Blueprint $table) {
            $table->json('quality')->nullable()->after('specifications');
        });

        foreach ($existing as $id => $quality) {
            DB::table('products')->where('id', $id)->update(['quality' => json_encode([$quality])]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $existing = DB::table('products')->whereNotNull('quality')->pluck('quality', 'id');

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('quality');
        });
        Schema::table('products', function (Blueprint $table) {
            $table->string('quality', 10)->nullable()->after('specifications');
        });

        foreach ($existing as $id => $quality) {
            $first = json_decode($quality, true)[0] ?? null;
            DB::table('products')->where('id', $id)->update(['quality' => $first]);
        }
    }
};
