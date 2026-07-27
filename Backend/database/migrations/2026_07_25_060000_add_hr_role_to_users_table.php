<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
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
        } elseif ($driver === 'sqlite') {
            // SQLite's enum() is a CHECK constraint baked into the column definition at creation time;
            // ALTER TABLE can't redefine it directly. Rebuild the column as a plain string so, like
            // pgsql, allowed values are enforced at the application level - otherwise the original
            // CHECK (administrator/editor/content_manager) silently rejects every role added after
            // this point (hr, admin, super_admin) on any SQLite-backed environment, including tests.
            Schema::table('users', function (Blueprint $table) {
                $table->string('role')->default('content_manager')->change();
            });
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
