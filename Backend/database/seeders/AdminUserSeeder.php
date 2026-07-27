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
            ['name' => 'Super Admin', 'email' => 'itechsig0510@gmail.com', 'role' => User::ROLE_SUPER_ADMIN],
            ['name' => 'Admin', 'email' => 'admin@suryaintigas.com', 'role' => User::ROLE_ADMIN],
            ['name' => 'Editor', 'email' => 'editor@suryaintigas.com', 'role' => User::ROLE_EDITOR],
            ['name' => 'Fauzan', 'email' => 'fauzanafiflutfiansah04@gmail.com', 'role' => User::ROLE_HR],
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
