<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Rename the WG (Welding Grade) gas grade to IG (Industrial Grade).
     */
    public function up(): void
    {
        $this->swapGrade('WG', 'IG');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $this->swapGrade('IG', 'WG');
    }

    private function swapGrade(string $from, string $to): void
    {
        DB::table('products')->whereNotNull('quality')->orderBy('id')->each(function ($product) use ($from, $to) {
            $quality = json_decode($product->quality, true);
            if (! is_array($quality) || ! in_array($from, $quality, true)) {
                return;
            }
            $quality = array_map(fn ($grade) => $grade === $from ? $to : $grade, $quality);
            DB::table('products')->where('id', $product->id)->update(['quality' => json_encode(array_values($quality))]);
        });
    }
};
