<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        Project::create([
            'name' => 'RSUD Sidoarjo',
            'category' => 'Rumah Sakit',
            'location' => 'Sidoarjo, Jawa Timur',
            'year' => '2023',
            'image' => '/images/sig-office.jpg',
            'description' => 'Instalasi sistem gas medis lengkap termasuk oksigen, nitrogen, dan gas anestesi untuk rumah sakit kelas B.',
            'icon' => '<Building2 className="w-6 h-6" />',
            'stats' => [
                'Kapasitas' => '500 Tempat Tidur',
                'Sistem' => 'Central Gas',
                'Standar' => 'ISO 13485'
            ],
            'order' => 1,
            'is_active' => true,
        ]);

        Project::create([
            'name' => 'PT. Industri Metalindo',
            'category' => 'Industri',
            'location' => 'Surabaya, Jawa Timur',
            'year' => '2022',
            'image' => '/images/sig-office3.jpg',
            'description' => 'Supply gas industri untuk proses welding dan cutting dengan sistem distribusi otomatis dan safety monitoring.',
            'icon' => '<Zap className="w-6 h-6" />',
            'stats' => [
                'Volume' => '50 Ton/Bulan',
                'Jenis Gas' => '8 Jenis',
                'Sertifikasi' => 'ISO 9001'
            ],
            'order' => 2,
            'is_active' => true,
        ]);

        Project::create([
            'name' => 'Laser Cutting Center',
            'category' => 'Laser Cutting',
            'location' => 'Balikpapan, Kalimantan Timur',
            'year' => '2024',
            'image' => '/images/sig-armada.jpg',
            'description' => 'Instalasi assist gas system untuk 20 unit laser cutting industri dengan teknologi flow control otomatis.',
            'icon' => '<Shield className="w-6 h-6" />',
            'stats' => [
                'Unit' => '20 Mesin',
                'Kapasitas' => '24/7',
                'Efisiensi' => '+40%'
            ],
            'order' => 3,
            'is_active' => true,
        ]);

        Project::create([
            'name' => 'Farmasi Karya Sehat',
            'category' => 'Rumah Sakit',
            'location' => 'Jakarta Pusat',
            'year' => '2021',
            'image' => '/images/sig-office.jpg',
            'description' => 'Sistem gas farmasi grade untuk produksi obat dengan standar GMP dan sertifikasi farmasi nasional.',
            'icon' => '<Award className="w-6 h-6" />',
            'stats' => [
                'Standar' => 'GMP Certified',
                'Kapasitas' => '10 Ton/Bulan',
                'Quality' => 'Pharma Grade'
            ],
            'order' => 4,
            'is_active' => true,
        ]);
    }
}
