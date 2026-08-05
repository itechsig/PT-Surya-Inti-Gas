<?php

namespace Database\Seeders;

use App\Models\Industry;
use Illuminate\Database\Seeder;

class IndustrySeeder extends Seeder
{
    public function run(): void
    {
        if (Industry::count() > 0) {
            return;
        }

        $industries = [
            ['slug' => 'manufacturing', 'name_id' => 'Manufaktur', 'name_en' => 'Manufacturing', 'name_zh' => '制造业', 'display_order' => 1],
            ['slug' => 'food-beverage', 'name_id' => 'Makanan & Minuman', 'name_en' => 'Food & Beverage', 'name_zh' => '食品饮料', 'display_order' => 2],
            ['slug' => 'healthcare', 'name_id' => 'Kesehatan', 'name_en' => 'Healthcare', 'name_zh' => '医疗保健', 'display_order' => 3],
            ['slug' => 'laboratory', 'name_id' => 'Laboratorium', 'name_en' => 'Laboratory', 'name_zh' => '实验室', 'display_order' => 4],
            ['slug' => 'chemical', 'name_id' => 'Kimia', 'name_en' => 'Chemical', 'name_zh' => '化工', 'display_order' => 5],
            ['slug' => 'automotive', 'name_id' => 'Otomotif', 'name_en' => 'Automotive', 'name_zh' => '汽车', 'display_order' => 6],
            ['slug' => 'electronics', 'name_id' => 'Elektronik', 'name_en' => 'Electronics', 'name_zh' => '电子', 'display_order' => 7],
            ['slug' => 'others', 'name_id' => 'Lainnya', 'name_en' => 'Others', 'name_zh' => '其他', 'display_order' => 8],
        ];

        foreach ($industries as $industry) {
            Industry::create($industry);
        }
    }
}