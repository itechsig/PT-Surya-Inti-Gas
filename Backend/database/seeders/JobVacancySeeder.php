<?php

namespace Database\Seeders;

use App\Models\JobVacancy;
use Illuminate\Database\Seeder;

class JobVacancySeeder extends Seeder
{
    /**
     * Mirrors Frontend/src/data/jobs.ts's structure, reading copy from the locale
     * JSON files so the cutover to the CMS causes no visual regression.
     */
    public function run(): void
    {
        if (JobVacancy::count() > 0) {
            return;
        }

        $structure = [
            ['id' => 1, 'divisionKey' => 'salesMarketing', 'locationKey' => 'sidoarjo', 'levelKey' => 'mid', 'deadline' => '2027-12-30'],
            ['id' => 2, 'divisionKey' => 'technicalOperations', 'locationKey' => 'sidoarjo', 'levelKey' => 'mid', 'deadline' => '2027-12-30'],
            ['id' => 3, 'divisionKey' => 'financeAdmin', 'locationKey' => 'balikpapan', 'levelKey' => 'entry', 'deadline' => '2027-12-30'],
            ['id' => 4, 'divisionKey' => 'logisticsDistribution', 'locationKey' => 'sidoarjo', 'levelKey' => 'entry', 'deadline' => '2027-12-30'],
            ['id' => 5, 'divisionKey' => 'technicalOperations', 'locationKey' => 'sidoarjo', 'levelKey' => 'mid', 'deadline' => '2027-12-30'],
            ['id' => 6, 'divisionKey' => 'salesMarketing', 'locationKey' => 'balikpapan', 'levelKey' => 'mid', 'deadline' => '2027-12-30'],
            ['id' => 7, 'divisionKey' => 'logisticsDistribution', 'locationKey' => 'sidoarjo', 'levelKey' => 'senior', 'deadline' => '2027-12-30'],
            ['id' => 8, 'divisionKey' => 'financeAdmin', 'locationKey' => 'balikpapan', 'levelKey' => 'senior', 'deadline' => '2027-12-30'],
            ['id' => 9, 'divisionKey' => 'technicalOperations', 'locationKey' => 'sidoarjo', 'levelKey' => 'mid', 'deadline' => '2027-12-30'],
        ];

        $locales = LocaleReader::load();

        $get = fn (array $loc, string $path) => data_get($loc, $path);

        foreach ($structure as $index => $item) {
            $id = $item['id'];

            JobVacancy::create([
                'title_id' => $get($locales['id'], "career.jobs.$id.title") ?? "Job $id",
                'title_en' => $get($locales['en'], "career.jobs.$id.title"),
                'title_zh' => $get($locales['zh'], "career.jobs.$id.title"),

                'division_id' => $get($locales['id'], "career.jobDivisions.{$item['divisionKey']}") ?? $item['divisionKey'],
                'division_en' => $get($locales['en'], "career.jobDivisions.{$item['divisionKey']}"),
                'division_zh' => $get($locales['zh'], "career.jobDivisions.{$item['divisionKey']}"),

                'location_id' => $get($locales['id'], "career.jobLocations.{$item['locationKey']}") ?? $item['locationKey'],
                'location_en' => $get($locales['en'], "career.jobLocations.{$item['locationKey']}"),
                'location_zh' => $get($locales['zh'], "career.jobLocations.{$item['locationKey']}"),

                'type_id' => $get($locales['id'], 'career.jobTypes.fullTime') ?? 'Penuh Waktu',
                'type_en' => $get($locales['en'], 'career.jobTypes.fullTime'),
                'type_zh' => $get($locales['zh'], 'career.jobTypes.fullTime'),

                'level_id' => $get($locales['id'], "career.jobLevels.{$item['levelKey']}") ?? $item['levelKey'],
                'level_en' => $get($locales['en'], "career.jobLevels.{$item['levelKey']}"),
                'level_zh' => $get($locales['zh'], "career.jobLevels.{$item['levelKey']}"),

                'description_id' => $get($locales['id'], "career.jobs.$id.description") ?? '',
                'description_en' => $get($locales['en'], "career.jobs.$id.description"),
                'description_zh' => $get($locales['zh'], "career.jobs.$id.description"),

                'full_description_id' => $get($locales['id'], "career.jobs.$id.fullDescription"),
                'full_description_en' => $get($locales['en'], "career.jobs.$id.fullDescription"),
                'full_description_zh' => $get($locales['zh'], "career.jobs.$id.fullDescription"),

                'requirements_id' => $get($locales['id'], "career.jobs.$id.requirements") ?? [],
                'requirements_en' => $get($locales['en'], "career.jobs.$id.requirements"),
                'requirements_zh' => $get($locales['zh'], "career.jobs.$id.requirements"),

                'deadline' => $item['deadline'],
                'display_order' => $index,
                'is_active' => true,
            ]);
        }
    }
}
