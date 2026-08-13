<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            AdminUserSeeder::class,
            TeamMemberSeeder::class,
            ProjectSeeder::class,
            CertificationSeeder::class,
            HeroSlideSeeder::class,
            ProductCategorySeeder::class,
            EquipmentCategorySeeder::class,
            ProductSeeder::class,
            ServicesCategorySeeder::class,
            GalleryItemSeeder::class,
            JobVacancySeeder::class,
            IndustrySeeder::class,
            ServiceTypeSeeder::class,
            PortfolioSeeder::class,
        ]);
    }
}
