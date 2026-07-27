<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        // Content Manager is being retired; fold any existing accounts into Editor rather than
        // leaving them with a role value the app no longer recognizes.
        DB::table('users')->where('role', 'content_manager')->update(['role' => 'editor']);

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'editor', 'hr', 'super_admin') NOT NULL DEFAULT 'editor'");
        } elseif ($driver === 'pgsql') {
            DB::statement("ALTER TABLE users ALTER COLUMN role SET DEFAULT 'editor'");
        }
    }

    public function down(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'editor', 'content_manager', 'hr', 'super_admin') NOT NULL DEFAULT 'content_manager'");
        } elseif ($driver === 'pgsql') {
            DB::statement("ALTER TABLE users ALTER COLUMN role SET DEFAULT 'content_manager'");
        }
        // Rows already folded into 'editor' are not distinguishable anymore, so they intentionally stay as-is.
    }
};
