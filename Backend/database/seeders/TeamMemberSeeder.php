<?php

namespace Database\Seeders;

use App\Models\TeamMember;
use Illuminate\Database\Seeder;

class TeamMemberSeeder extends Seeder
{
    public function run(): void
    {
        TeamMember::create([
            'name' => 'Ir. Ahmad Hidayat, S.T., M.T.',
            'role' => 'Direktur Utama',
            'experience' => '20+ Tahun Pengalaman',
            'expertise' => 'Gas Industri & Medis',
            'image' => '/images/sig-office.jpg',
            'bio' => 'Pengalaman luas dalam distribusi gas industri dan medis dengan fokus pada keselamatan dan kualitas.',
            'icon' => '<Award className="w-6 h-6" />',
            'stats' => [
                'Proyek' => '500+',
                'Sertifikasi' => 'ISO 9001',
                'Leadership' => '20+ Tahun'
            ],
            'order' => 1,
            'is_active' => true,
        ]);

        TeamMember::create([
            'name' => 'Dra. Ratna Dewi, S.T., M.M.',
            'role' => 'Direktur Operasional',
            'experience' => '15+ Tahun Pengalaman',
            'expertise' => 'Supply Chain & Logistics',
            'image' => '/images/sig-office3.jpg',
            'bio' => 'Ahli dalam manajemen rantai pasokan gas dan optimasi distribusi untuk industri nasional.',
            'icon' => '<Shield className="w-6 h-6" />',
            'stats' => [
                'Efisiensi' => '+40%',
                'Coverage' => '4 Wilayah',
                'Innovation' => '15+ Tahun'
            ],
            'order' => 2,
            'is_active' => true,
        ]);

        TeamMember::create([
            'name' => 'Ir. Budi Santoso, S.T.',
            'role' => 'Technical Manager',
            'experience' => '12+ Tahun Pengalaman',
            'expertise' => 'Engineering & Safety',
            'image' => '/images/sig-armada.jpg',
            'bio' => 'Spesialis dalam sistem gas bertekanan tinggi dan implementasi standar keselamatan K3.',
            'icon' => '<Zap className="w-6 h-6" />',
            'stats' => [
                'Teknik' => 'Expert',
                'Safety' => '100%',
                'Projects' => '200+'
            ],
            'order' => 3,
            'is_active' => true,
        ]);
    }
}
