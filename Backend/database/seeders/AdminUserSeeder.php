<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $accounts = [
            ['name' => 'Administrator', 'email' => 'admin@suryaintigas.com', 'role' => User::ROLE_ADMINISTRATOR],
            ['name' => 'Editor', 'email' => 'editor@suryaintigas.com', 'role' => User::ROLE_EDITOR],
            ['name' => 'Content Manager', 'email' => 'content@suryaintigas.com', 'role' => User::ROLE_CONTENT_MANAGER],
        ];

        foreach ($accounts as $account) {
            User::firstOrCreate(
                ['email' => $account['email']],
                [
                    'name' => $account['name'],
                    'role' => $account['role'],
                    'password' => Hash::make('Password@123'),
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
