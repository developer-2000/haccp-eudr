<?php

namespace Database\Seeders;

use App\Models\SurveyQuestion;
use Illuminate\Database\Seeder;

class SurveyQuestionsSeeder extends Seeder
{
    /**
     * Для каждой строки из локального массива выполняет updateOrCreate по stable_id (повторный seed без дубликатов).
     */
    public function run(): void
    {
        foreach ($this->questionRows() as $row) {
            SurveyQuestion::query()->updateOrCreate(
                ['stable_id' => $row['stable_id']],
                $row
            );
        }
    }

    /**
     * Возвращает атрибуты для всех stable_id (17 записей). Соответствуют структуре surveyQuestionsStub.js; строки — ключи перевода.
     *
     * @return list<array<string, mixed>>
     */
    private function questionRows(): array
    {
        $R = SurveyQuestion::TYPE_RADIO;
        $C = SurveyQuestion::TYPE_CHECKBOX;
        $S = SurveyQuestion::TYPE_SELECT;
        $T = SurveyQuestion::TYPE_TEXT;

        return [
            [
                'stable_id' => '1',
                'sort_order' => 10,
                'question_text' => $this->qk('1', 'question_text'),
                'type' => $R,
                'is_active' => true,
                'options' => [
                    $this->o('1', 'cafe'),
                    $this->o('1', 'bakery'),
                    $this->o('1', 'meat'),
                    $this->o('1', 'kitchen'),
                    $this->o('1', 'other', true),
                ],
            ],
            [
                'stable_id' => '2',
                'sort_order' => 20,
                'question_text' => $this->qk('2', 'question_text'),
                'type' => $R,
                'is_active' => true,
                'options' => [
                    $this->o('2', '1_5'),
                    $this->o('2', '5_10'),
                    $this->o('2', '10_20'),
                    $this->o('2', '20_plus'),
                ],
            ],
            [
                'stable_id' => '3',
                'sort_order' => 30,
                'question_text' => $this->qk('3', 'question_text'),
                'type' => $S,
                'is_active' => true,
                'options' => null,
                'field_caption' => $this->qk('3', 'field_caption'),
                'country_iso_select' => true,
            ],
            [
                'stable_id' => '4',
                'sort_order' => 40,
                'question_text' => $this->qk('4', 'question_text'),
                'type' => $R,
                'is_active' => true,
                'options' => [
                    $this->o('4', 'paper'),
                    $this->o('4', 'excel'),
                    $this->o('4', 'software'),
                    $this->o('4', 'partial'),
                    $this->o('4', 'other', true),
                ],
            ],
            [
                'stable_id' => '5',
                'sort_order' => 50,
                'question_text' => $this->qk('5', 'question_text'),
                'type' => $R,
                'is_active' => true,
                'options' => [
                    $this->o('5', 'yes'),
                    $this->o('5', 'no'),
                ],
            ],
            [
                'stable_id' => '6',
                'sort_order' => 60,
                'question_text' => $this->qk('6', 'question_text'),
                'type' => $R,
                'is_active' => true,
                'options' => [
                    $this->o('6', 'fully'),
                    $this->o('6', 'partially_ok'),
                    $this->o('6', 'rather_not'),
                    $this->o('6', 'not_at_all'),
                ],
            ],
            [
                'stable_id' => '7',
                'sort_order' => 70,
                'question_text' => $this->qk('7', 'question_text'),
                'type' => $R,
                'is_active' => true,
                'options' => [
                    $this->o('7', 'yes'),
                    $this->o('7', 'maybe'),
                    $this->o('7', 'no'),
                ],
            ],
            [
                'stable_id' => '8',
                'sort_order' => 80,
                'question_text' => $this->qk('8', 'question_text'),
                'type' => $R,
                'is_active' => true,
                'options' => [
                    $this->o('8', 'self'),
                    $this->o('8', 'manager'),
                    $this->o('8', 'staff'),
                    $this->o('8', 'none'),
                    $this->o('8', 'other', true),
                ],
            ],
            [
                'stable_id' => '9',
                'sort_order' => 90,
                'question_text' => $this->qk('9', 'question_text'),
                'type' => $R,
                'is_active' => true,
                'options' => [
                    $this->o('9', 'often'),
                    $this->o('9', 'sometimes'),
                    $this->o('9', 'rarely'),
                    $this->o('9', 'almost_never'),
                ],
            ],
            [
                'stable_id' => '10',
                'sort_order' => 100,
                'question_text' => $this->qk('10', 'question_text'),
                'type' => $R,
                'is_active' => true,
                'options' => [
                    $this->o('10', 'often'),
                    $this->o('10', 'sometimes'),
                    $this->o('10', 'rarely'),
                    $this->o('10', 'never'),
                ],
            ],
            [
                'stable_id' => '11',
                'sort_order' => 110,
                'question_text' => $this->qk('11', 'question_text'),
                'type' => $C,
                'is_active' => true,
                'subtitle' => $this->qk('11', 'subtitle'),
                'options' => [
                    $this->o('11', 'records'),
                    $this->o('11', 'staff_control'),
                    $this->o('11', 'realtime'),
                    $this->o('11', 'inspections'),
                    $this->o('11', 'training'),
                    $this->o('11', 'chaos'),
                    $this->o('11', 'other', true),
                ],
            ],
            [
                'stable_id' => '12',
                'sort_order' => 120,
                'question_text' => $this->qk('12', 'question_text'),
                'type' => $R,
                'is_active' => true,
                'options' => [
                    $this->o('12', 'yes'),
                    $this->o('12', 'no'),
                ],
                'branches' => [
                    'yes' => '12_1',
                    'no' => '12_2',
                ],
            ],
            [
                'stable_id' => '12_1',
                'sort_order' => 121,
                'question_text' => $this->qk('12_1', 'question_text'),
                'type' => $R,
                'is_active' => true,
                'options' => [
                    $this->o('12_1', 'docs'),
                    $this->o('12_1', 'staff'),
                    $this->o('12_1', 'missing_records'),
                    $this->o('12_1', 'overall'),
                    $this->o('12_1', 'other', true),
                ],
            ],
            [
                'stable_id' => '12_2',
                'sort_order' => 122,
                'question_text' => $this->qk('12_2', 'question_text'),
                'type' => $R,
                'is_active' => true,
                'options' => [
                    $this->o('12_2', 'very'),
                    $this->o('12_2', 'rather'),
                    $this->o('12_2', 'not_thought'),
                    $this->o('12_2', 'not_important'),
                ],
            ],
            [
                'stable_id' => '13',
                'sort_order' => 130,
                'question_text' => $this->qk('13', 'question_text'),
                'type' => $R,
                'is_active' => true,
                'options' => [
                    $this->o('13', 'very'),
                    $this->o('13', 'rather'),
                    $this->o('13', 'unsure'),
                    $this->o('13', 'not_important'),
                ],
            ],
            [
                'stable_id' => '14',
                'sort_order' => 140,
                'question_text' => $this->qk('14', 'question_text'),
                'type' => $C,
                'is_active' => true,
                'subtitle' => $this->qk('14', 'subtitle'),
                'checkbox_allow_empty' => true,
                'other_detail_field_label' => $this->qk('14', 'other_detail_field_label'),
                'option_groups' => [
                    [
                        'heading' => $this->qgh('14', 'safety'),
                        'options' => [
                            $this->o('14', 'temp_alerts'),
                            $this->o('14', 'capture_at_moment'),
                            $this->o('14', 'two_person_confirm'),
                        ],
                    ],
                    [
                        'heading' => $this->qgh('14', 'inspection'),
                        'options' => [
                            $this->o('14', 'reports_qr_link'),
                            $this->o('14', 'photo_proof'),
                            $this->o('14', 'full_action_history'),
                        ],
                    ],
                    [
                        'heading' => $this->qgh('14', 'staff'),
                        'options' => [
                            $this->o('14', 'offline_mobile'),
                            $this->o('14', 'voice_input'),
                            $this->o('14', 'biz_templates'),
                        ],
                    ],
                    [
                        'heading' => $this->qgh('14', 'automation'),
                        'options' => [
                            $this->o('14', 'bluetooth_temp'),
                            $this->o('14', 'risk_warnings'),
                            $this->o('14', 'loss_on_violations'),
                        ],
                    ],
                    [
                        'heading' => $this->qgh('14', 'more'),
                        'options' => [
                            $this->o('14', 'internal_staff_tasks'),
                            $this->o('14', 'push_reminders'),
                        ],
                    ],
                    [
                        'heading' => $this->qgh('14', 'other_row'),
                        'options' => [
                            $this->o('14', 'other', true),
                        ],
                    ],
                ],
            ],
            [
                'stable_id' => '15',
                'sort_order' => 150,
                'question_text' => $this->qk('15', 'question_text'),
                'type' => $T,
                'is_active' => true,
                'field_caption' => $this->qk('15', 'field_caption'),
                'text_multiline' => true,
                'text_allow_empty' => true,
            ],
        ];
    }

    /**
     * Собирает ключ поля вопроса: survey.questions.{id}.{field} (совпадает с вложенностью lang/en/survey.php).
     */
    private function qk(string $stableId, string $field): string
    {
        return "survey.questions.{$stableId}.{$field}";
    }

    /**
     * Ключ заголовка секции option_groups для вопроса 14: survey.questions.{id}.group_headings.{slug}.
     */
    private function qgh(string $stableId, string $slug): string
    {
        return "survey.questions.{$stableId}.group_headings.{$slug}";
    }

    /**
     * Элемент опции: value для ответа, label — ключ survey.questions.{id}.options.{value}.
     *
     * @return array{value: string, label: string}|array{value: string, label: string, is_other: true}
     */
    private function o(string $stableId, string $value, bool $isOther = false): array
    {
        $row = [
            'value' => $value,
            'label' => "survey.questions.{$stableId}.options.{$value}",
        ];
        if ($isOther) {
            $row['is_other'] = true;
        }

        return $row;
    }
}
