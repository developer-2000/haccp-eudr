<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->foreignId('business_type_id')->nullable()->constrained('com_business_types')->nullOnDelete();
            $table->foreignId('country_id')->nullable()->constrained('com_countries')->nullOnDelete();
            $table->foreignId('employee_count_id')->nullable()->constrained('com_employee_counts')->nullOnDelete();
            $table->foreignId('number_offices_id')->nullable()->constrained('com_number_offices')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['business_type_id']);
            $table->dropForeign(['country_id']);
            $table->dropForeign(['employee_count_id']);
            $table->dropForeign(['number_offices_id']);
        });
        Schema::dropIfExists('companies');
    }
};

