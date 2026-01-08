<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('com_business_types', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('com_business_types');
    }
};

