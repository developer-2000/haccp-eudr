<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Вопрос клиентского опроса (таблица survey_questions, план §6.12).
 *
 * Допустимые значения {@see self::TYPE_RADIO} и т.д. — единый источник для БД, API и валидации.
 *
 * @property int $id
 * @property string $stable_id Ключ в payload фронта и в answers (например "1", "12_1")
 * @property string $question_text
 * @property string $type Одно из TYPE_*
 * @property int $sort_order
 * @property bool $is_active
 * @property array<int, array{value: string, label: string, is_other?: bool}>|null $options
 * @property array<int, array{heading: string, options: array<int, mixed>}>|null $option_groups
 * @property string|null $subtitle
 * @property string|null $field_caption
 * @property array<string, string>|null $branches Значение ответа → stable_id следующего шага
 * @property bool|null $checkbox_allow_empty
 * @property string|null $other_detail_field_label
 * @property bool|null $country_iso_select
 * @property bool|null $text_multiline
 * @property int|null $text_rows
 * @property bool|null $text_allow_empty
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class SurveyQuestion extends Model
{
    public const TYPE_RADIO = 'radio';

    public const TYPE_CHECKBOX = 'checkbox';

    public const TYPE_SELECT = 'select';

    public const TYPE_TEXT = 'text';

    protected $table = 'survey_questions';

    protected $fillable = [
        'stable_id',
        'question_text',
        'type',
        'sort_order',
        'is_active',
        'options',
        'option_groups',
        'subtitle',
        'field_caption',
        'branches',
        'checkbox_allow_empty',
        'other_detail_field_label',
        'country_iso_select',
        'text_multiline',
        'text_rows',
        'text_allow_empty',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'options' => 'array',
        'option_groups' => 'array',
        'branches' => 'array',
        'checkbox_allow_empty' => 'boolean',
        'country_iso_select' => 'boolean',
        'text_multiline' => 'boolean',
        'text_rows' => 'integer',
        'text_allow_empty' => 'boolean',
    ];

    /**
     * Все допустимые строки колонки type (для Rule::in() и сидеров).
     *
     * @return list<string>
     */
    public static function typeValues(): array
    {
        return [
            self::TYPE_RADIO,
            self::TYPE_CHECKBOX,
            self::TYPE_SELECT,
            self::TYPE_TEXT,
        ];
    }
}
