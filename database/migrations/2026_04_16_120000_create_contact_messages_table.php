<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Создаёт таблицу contact_messages для хранения сообщений из публичной формы Contact.
     * Индекс по email используется для быстрой выборки повторных писем от одного адреса,
     * индекс по created_at — для сортировки в админских отчётах.
     */
    public function up(): void
    {
        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('company')->nullable();
            $table->text('message');
            $table->string('type_site')->default('demo');
            $table->json('user_meta')->nullable();
            $table->timestamps();

            $table->index('email');
            $table->index('created_at');
        });
    }

    /**
     * Откатывает миграцию: удаляет таблицу contact_messages.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_messages');
    }
};
