<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Seeds the 4 roles and 10 permissions that already exist implicitly today (as hardcoded
     * `role:...` middleware strings scattered across routes/api.php), and maps each role to
     * exactly the permissions its literal role list currently grants — so switching the routes
     * over to permission checks is a behavior-preserving migration, not a silent access change.
     */
    public function up(): void
    {
        $now = now();

        $roles = [
            ['slug' => 'super_admin', 'name' => 'Super Admin', 'is_system' => true],
            ['slug' => 'admin', 'name' => 'Admin', 'is_system' => false],
            ['slug' => 'editor', 'name' => 'Editor', 'is_system' => false],
            ['slug' => 'hr', 'name' => 'HR', 'is_system' => false],
        ];
        foreach ($roles as &$role) {
            $role['created_at'] = $now;
            $role['updated_at'] = $now;
        }
        unset($role);
        DB::table('roles')->insert($roles);

        $permissions = [
            ['slug' => 'users.manage', 'name' => 'Kelola Pengguna', 'group' => 'Administrasi'],
            ['slug' => 'blocked_users.manage', 'name' => 'Kelola IP Diblokir', 'group' => 'Administrasi'],
            ['slug' => 'audit_logs.view', 'name' => 'Lihat Log Aktivitas', 'group' => 'Administrasi'],
            ['slug' => 'chatbot_settings.manage', 'name' => 'Kelola Pengaturan Chatbot', 'group' => 'Administrasi'],
            ['slug' => 'hero_slides.manage', 'name' => 'Kelola Hero Slides', 'group' => 'Konten'],
            ['slug' => 'products.manage', 'name' => 'Kelola Produk', 'group' => 'Konten'],
            ['slug' => 'gallery.manage', 'name' => 'Kelola Galeri', 'group' => 'Konten'],
            ['slug' => 'portfolios.manage', 'name' => 'Kelola Portofolio', 'group' => 'Konten'],
            ['slug' => 'job_vacancies.manage', 'name' => 'Kelola Lowongan Kerja', 'group' => 'Rekrutmen'],
            ['slug' => 'career_applications.manage', 'name' => 'Kelola Lamaran Kerja', 'group' => 'Rekrutmen'],
        ];
        foreach ($permissions as &$permission) {
            $permission['created_at'] = $now;
            $permission['updated_at'] = $now;
        }
        unset($permission);
        DB::table('permissions')->insert($permissions);

        $roleIds = DB::table('roles')->pluck('id', 'slug');
        $permissionIds = DB::table('permissions')->pluck('id', 'slug');

        $grants = [
            'super_admin' => array_keys($permissionIds->toArray()),
            'admin' => [
                'hero_slides.manage', 'products.manage', 'gallery.manage', 'portfolios.manage',
                'job_vacancies.manage', 'career_applications.manage',
            ],
            'editor' => ['hero_slides.manage', 'products.manage', 'gallery.manage', 'portfolios.manage'],
            'hr' => ['job_vacancies.manage', 'career_applications.manage'],
        ];

        $rows = [];
        foreach ($grants as $roleSlug => $permissionSlugs) {
            foreach ($permissionSlugs as $permissionSlug) {
                $rows[] = [
                    'role_id' => $roleIds[$roleSlug],
                    'permission_id' => $permissionIds[$permissionSlug],
                ];
            }
        }
        DB::table('permission_role')->insert($rows);
    }

    public function down(): void
    {
        DB::table('permission_role')->truncate();
        DB::table('permissions')->truncate();
        DB::table('roles')->truncate();
    }
};
