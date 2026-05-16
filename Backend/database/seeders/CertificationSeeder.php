<?php

namespace Database\Seeders;

use App\Models\Certification;
use Illuminate\Database\Seeder;

class CertificationSeeder extends Seeder
{
    public function run(): void
    {
        Certification::create([
            'title' => 'ISO 9001:2015',
            'description' => 'Sistem Manajemen Mutu Distributor Gas',
            'icon' => '<CheckCircle2 className="w-8 h-8" />',
            'color' => 'from-blue-500 to-blue-600',
            'bg_color' => 'from-blue-50 to-blue-100',
            'details' => 'Standar internasional untuk manajemen mutu dalam distribusi gas industri dan medis.',
            'valid_period' => '2020-2025',
            'scope' => 'Distributor Gas',
            'order' => 1,
            'is_active' => true,
        ]);

        Certification::create([
            'title' => 'ISO 13485:2016',
            'description' => 'Sistem Manajemen Mutu Gas Medis',
            'icon' => '<ShieldCheck className="w-8 h-8" />',
            'color' => 'from-green-500 to-green-600',
            'bg_color' => 'from-green-50 to-green-100',
            'details' => 'Sertifikasi khusus untuk gas medis dengan standar farmasi dan kesehatan.',
            'valid_period' => '2021-2026',
            'scope' => 'Medical Gas',
            'order' => 2,
            'is_active' => true,
        ]);

        Certification::create([
            'title' => 'Sertifikasi K3',
            'description' => 'Keselamatan & Kesehatan Kerja',
            'icon' => '<Award className="w-8 h-8" />',
            'color' => 'from-purple-500 to-purple-600',
            'bg_color' => 'from-purple-50 to-purple-100',
            'details' => 'Implementasi standar K3 untuk operasional gas bertekanan tinggi.',
            'valid_period' => '2019-2024',
            'scope' => 'Safety Standard',
            'order' => 3,
            'is_active' => true,
        ]);

        Certification::create([
            'title' => 'Izin Distributor Gas',
            'description' => 'Lisensi Resmi Pemerintah',
            'icon' => '<FileCheck className="w-8 h-8" />',
            'color' => 'from-orange-500 to-orange-600',
            'bg_color' => 'from-orange-50 to-orange-100',
            'details' => 'Izin resmi dari pemerintah untuk distribusi gas industri dan medis.',
            'valid_period' => '2004-2024',
            'scope' => 'Distribution License',
            'order' => 4,
            'is_active' => true,
        ]);
    }
}
