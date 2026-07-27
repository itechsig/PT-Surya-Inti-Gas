<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('career_applications', function (Blueprint $table) {
            $table->string('alamat')->nullable()->after('no_hp');
            $table->string('pendidikan')->nullable()->after('posisi');
            $table->string('pengalaman')->nullable()->after('pendidikan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('career_applications', function (Blueprint $table) {
            $table->dropColumn(['alamat', 'pendidikan', 'pengalaman']);
        });
    }
};
