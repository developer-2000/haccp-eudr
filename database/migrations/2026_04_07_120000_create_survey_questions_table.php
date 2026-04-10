<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Таблица вопросов опроса (план: Documents/.../plan_survey_page.md §6.12).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('survey_questions', function (Blueprint $table) {
            $table->id();

            // Стабильный id вопроса для фронта и payload: ключ в answers (например "1", "12_1"); не менять при правках текста.
            $table->string('stable_id', 64)->unique();

            // Текст вопроса на экране шага (крупный заголовок).
            $table->text('question_text');

            // Вид ввода: константы TYPE_* в App\Models\SurveyQuestion (radio, checkbox, select, text).
            $table->string('type', 20);

            // Порядок выдачи активных вопросов из API и сортировки в админке (основная линия опроса).
            $table->unsignedSmallInteger('sort_order')->default(0);

            // Показывать ли вопрос в опросе; выключенные строки не отдаём клиенту.
            $table->boolean('is_active')->default(true);

            // Плоский список вариантов для radio/checkbox/select (без групп); value — в ответе, label — в UI; is_other — нужен второй ключ stable_id__other.
            $table->json('options')->nullable();

            // Секции UI для мультивыбора (вопрос 14): массив { heading, options[] }; логика выбора та же, что у плоского options.
            $table->json('option_groups')->nullable();

            // Короткая подсказка под заголовком (например «Можно выбрать несколько вариантов»).
            $table->text('subtitle')->nullable();

            // Подпись к полю ввода или к зоне select (доступность, пояснение).
            $table->text('field_caption')->nullable();

            // Ветвление после ответа: JSON «значение ответа → stable_id следующего шага» (как branches у вопроса 12).
            $table->json('branches')->nullable();

            // Для checkbox: разрешён ли переход «Далее» без выбора; null — трактовать как false при загрузке на фронт, если не оговорено иначе.
            $table->boolean('checkbox_allow_empty')->nullable();

            // Подпись над textarea уточнения для варианта «Другое».
            $table->string('other_detail_field_label', 255)->nullable();

            // Для select: true — список стран ISO alpha-2 с клиентского справочника, без дублирования options в БД.
            $table->boolean('country_iso_select')->nullable();

            // Для type text: многострочное поле (textarea) против однострочного input.
            $table->boolean('text_multiline')->nullable();

            // Для textarea: число видимых строк (высота поля в UI).
            $table->unsignedTinyInteger('text_rows')->nullable();

            // Для type text: можно ли отправить шаг с пустой строкой; null — по правилам фронта по умолчанию.
            $table->boolean('text_allow_empty')->nullable();

            // created_at / updated_at — аудит создания и правок вопроса в админке.
            $table->timestamps();

            // Ускоренная выборка: только активные, в нужном порядке.
            $table->index(['is_active', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('survey_questions');
    }
};
