<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Roles are managed in the `roles` table now, so `users.role` can no longer be a fixed
     * MySQL ENUM(...) — a newly created role would be rejected at the database layer even
     * though the application layer allows it.
     */
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY COLUMN role VARCHAR(50) NOT NULL DEFAULT 'editor'");
        }
        // pgsql/sqlite already store this as a plain string column — nothing to change there.
    }

    public function down(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'editor', 'hr', 'super_admin') NOT NULL DEFAULT 'editor'");
        }
    }
};
