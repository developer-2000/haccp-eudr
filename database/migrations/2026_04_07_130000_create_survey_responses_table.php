<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('survey_responses', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('business_name')->nullable();
            $table->string('business_type')->nullable();
            $table->string('country', 2)->nullable();
            $table->json('answers');
            $table->string('status_responses')->nullable()->default('submitted');
            $table->unsignedTinyInteger('attempt_counter')->nullable()->default(0);
            $table->unsignedSmallInteger('verification_code')->nullable()->default(0);
            $table->string('verification_token')->nullable()->default('');
            $table->string('discount_code')->nullable()->unique();
            $table->boolean('discount_granted')->default(false);
            $table->timestamps();

            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('survey_responses');
    }
};

