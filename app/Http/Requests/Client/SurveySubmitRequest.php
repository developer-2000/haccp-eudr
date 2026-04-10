<?php

namespace App\Http\Requests\Client;

use Illuminate\Foundation\Http\FormRequest;

class SurveySubmitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company' => ['nullable', 'string', 'max:255'],
            'hp_started_at' => ['nullable', 'integer', 'min:0'],
            'contacts' => ['required', 'array'],
            'contacts.name' => ['nullable', 'string', 'max:255'],
            // 🔥 улучшенная валидация email
            'contacts.email' => ['required', 'email:rfc,dns', 'max:255'],
            'contacts.business_name' => ['nullable', 'string', 'max:255'],
            'contacts.phone' => ['nullable', 'string', 'max:255'],
            'contacts.whatsapp' => ['nullable', 'string', 'max:255'],
            'contacts.telegram' => ['nullable', 'string', 'max:255'],

            'answers' => ['required', 'array'],
            'answers.*' => ['nullable'],

            'question_answers' => ['required', 'array'],
            'question_answers.*.id' => ['required', 'string', 'max:64'],
            'question_answers.*.value' => ['nullable'],
            'question_answers.*.other' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * Нормализует структуру payload перед валидацией.
     */
    protected function prepareForValidation(): void
    {
        $contacts = $this->input('contacts');
        if (!is_array($contacts)) {
            $contacts = [];
        }

        $questionAnswers = $this->input('question_answers');
        if (!is_array($questionAnswers)) {
            $questionAnswers = [];
        }

        $normalizedQuestionAnswers = array_map(static function ($row) {
            if (!is_array($row)) {
                return ['id' => '', 'value' => null, 'other' => null];
            }

            return [
                'id' => isset($row['id']) ? (string) $row['id'] : '',
                'value' => $row['value'] ?? null,
                'other' => isset($row['other']) ? (string) $row['other'] : null,
            ];
        }, $questionAnswers);

        $this->merge([
            'company' => $this->nullableString($this->input('company')),
            'hp_started_at' => $this->nullableInt($this->input('hp_started_at')),
            'contacts' => [
                'name' => $contacts['name'] ?? null,
                // 🔥 нормализация email
                'email' => $this->normalizeEmail($contacts['email'] ?? null),
                'business_name' => $contacts['business_name'] ?? null,
                'phone' => $contacts['phone'] ?? null,
                'whatsapp' => $contacts['whatsapp'] ?? null,
                'telegram' => $contacts['telegram'] ?? null,
            ],
            'answers' => is_array($this->input('answers')) ? $this->input('answers') : [],
            'question_answers' => $normalizedQuestionAnswers,
        ]);
    }

    /**
     * Приводит входное значение к строке или null для единообразной валидации.
     */
    private function nullableString(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $text = trim((string) $value);

        return $text === '' ? null : $text;
    }

    /**
     * Приводит входное значение к целому числу или null для единообразной валидации.
     */
    private function nullableInt(mixed $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_numeric($value)) {
            return (int) $value;
        }

        return null;
    }

    /**
     * Нормализация email:
     * - trim
     * - lowercase
     */
    private function normalizeEmail(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $email = trim((string) $value);

        if ($email === '') {
            return null;
        }

        return mb_strtolower($email);
    }
}

