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
            // Superset enum so both the old and new values are valid while rows are migrated.
            DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('administrator', 'admin', 'editor', 'content_manager', 'hr', 'super_admin') NOT NULL DEFAULT 'content_manager'");
        }

        DB::table('users')->where('role', 'administrator')->update(['role' => 'admin']);

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'editor', 'content_manager', 'hr', 'super_admin') NOT NULL DEFAULT 'content_manager'");
        }
        // pgsql already has no CHECK constraint on this column (dropped in the previous migration),
        // so allowed values are enforced purely by application-level validation there.
    }

    public function down(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        DB::table('users')->where('role', 'super_admin')->update(['role' => 'admin']);

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('administrator', 'admin', 'editor', 'content_manager', 'hr') NOT NULL DEFAULT 'content_manager'");
        }

        DB::table('users')->where('role', 'admin')->update(['role' => 'administrator']);

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('administrator', 'editor', 'content_manager', 'hr') NOT NULL DEFAULT 'content_manager'");
        }
    }
};
