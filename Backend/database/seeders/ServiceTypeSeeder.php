<?php

namespace Database\Seeders;

use App\Models\ServiceType;
use Illuminate\Database\Seeder;

class ServiceTypeSeeder extends Seeder
{
    public function run(): void
    {
        if (ServiceType::count() > 0) {
            return;
        }

        $serviceTypes = [
            ['slug' => 'distribution', 'name_id' => 'Distribusi', 'name_en' => 'Distribution', 'name_zh' => '分销', 'display_order' => 1],
            ['slug' => 'engineering', 'name_id' => 'Engineering', 'name_en' => 'Engineering', 'name_zh' => '工程', 'display_order' => 2],
            ['slug' => 'installation', 'name_id' => 'Instalasi', 'name_en' => 'Installation', 'name_zh' => '安装', 'display_order' => 3],
            ['slug' => 'maintenance', 'name_id' => 'Maintenance', 'name_en' => 'Maintenance', 'name_zh' => '维护', 'display_order' => 4],
            ['slug' => 'rental', 'name_id' => 'Rental Equipment', 'name_en' => 'Rental', 'name_zh' => '租赁', 'display_order' => 5],
        ];

        foreach ($serviceTypes as $serviceType) {
            ServiceType::create($serviceType);
        }
    }
}