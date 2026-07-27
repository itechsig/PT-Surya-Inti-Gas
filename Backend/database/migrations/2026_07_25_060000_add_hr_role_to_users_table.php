<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'mysql') {
            // Doctrine DBAL can't introspect MySQL enum columns, so raw SQL is used instead of change().
            DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('administrator', 'editor', 'content_manager', 'hr') NOT NULL DEFAULT 'content_manager'");
        } elseif ($driver === 'pgsql') {
            // Laravel's enum() on pgsql is a plain varchar with a CHECK constraint, not a native enum type.
            // Drop the constraint instead of trying to redefine it: allowed values stay enforced by
            // application-level validation (see AuthController), which avoids a migration per new role.
            DB::statement('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check');
        }
    }

    public function down(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        DB::table('users')->where('role', 'hr')->update(['role' => 'content_manager']);

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('administrator', 'editor', 'content_manager') NOT NULL DEFAULT 'content_manager'");
        } elseif ($driver === 'pgsql') {
            DB::statement("ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('administrator', 'editor', 'content_manager'))");
        }
    }
};
