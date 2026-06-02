<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SampleVisitorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample visitor data for dashboard testing
        $visitors = [
            [
                'session_id' => (string)Str::uuid(),
                'ip_address' => '192.168.1.100',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'browser' => 'Chrome',
                'os' => 'Windows',
                'device_type' => 'desktop',
                'referrer' => 'https://google.com',
                'landing_page' => '/',
                'exit_page' => '/about',
                'page_views' => 5,
                'time_on_site' => 300,
                'first_visit' => now(),
                'last_visit' => now(),
                'is_returning_visitor' => false,
                'pages_visited' => json_encode(['/','/about','/kontak']),
                'country' => 'Indonesia',
                'city' => 'Jakarta'
            ],
            [
                'session_id' => (string)Str::uuid(),
                'ip_address' => '192.168.1.101',
                'user_agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
                'browser' => 'Safari',
                'os' => 'iOS',
                'device_type' => 'mobile',
                'referrer' => 'https://facebook.com',
                'landing_page' => '/',
                'exit_page' => '/produk',
                'page_views' => 8,
                'time_on_site' => 480,
                'first_visit' => now(),
                'last_visit' => now(),
                'is_returning_visitor' => false,
                'pages_visited' => json_encode(['/','/produk','/kontak']),
                'country' => 'Indonesia',
                'city' => 'Bandung'
            ],
            [
                'session_id' => (string)Str::uuid(),
                'ip_address' => '192.168.1.102',
                'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'browser' => 'Chrome',
                'os' => 'macOS',
                'device_type' => 'desktop',
                'referrer' => 'https://linkedin.com',
                'landing_page' => '/karir',
                'exit_page' => '/karir',
                'page_views' => 3,
                'time_on_site' => 180,
                'first_visit' => now()->subHours(2),
                'last_visit' => now(),
                'is_returning_visitor' => true,
                'pages_visited' => json_encode(['/karir','/about']),
                'country' => 'Indonesia',
                'city' => 'Surabaya'
            ],
            [
                'session_id' => (string)Str::uuid(),
                'ip_address' => '192.168.1.103',
                'user_agent' => 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Mobile Safari/537.36',
                'browser' => 'Chrome',
                'os' => 'Android',
                'device_type' => 'mobile',
                'referrer' => '',
                'landing_page' => '/',
                'exit_page' => '/about',
                'page_views' => 2,
                'time_on_site' => 90,
                'first_visit' => now()->subHours(5),
                'last_visit' => now(),
                'is_returning_visitor' => true,
                'pages_visited' => json_encode(['/','/about']),
                'country' => 'Indonesia',
                'city' => 'Medan'
            ],
            [
                'session_id' => (string)Str::uuid(),
                'ip_address' => '192.168.1.104',
                'user_agent' => 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
                'browser' => 'Safari',
                'os' => 'iOS',
                'device_type' => 'tablet',
                'referrer' => 'https://twitter.com',
                'landing_page' => '/',
                'exit_page' => '/produk',
                'page_views' => 12,
                'time_on_site' => 720,
                'first_visit' => now(),
                'last_visit' => now(),
                'is_returning_visitor' => false,
                'pages_visited' => json_encode(['/','/produk','/about','/kontak','/karir']),
                'country' => 'Indonesia',
                'city' => 'Yogyakarta'
            ]
        ];

        foreach ($visitors as $visitor) {
            DB::table('website_visitors')->insert($visitor);
        }

        $this->command->info('Sample visitor data created successfully!');
    }
}
