<?php

namespace App\Http\Requests\Concerns;

/**
 * Переиспользуемый набор нормализаторов входного payload для FormRequest-классов.
 * Применяется в prepareForValidation() публичных форм (Contact, Survey и т.п.),
 * чтобы правила required/max/email работали предсказуемо независимо от формы ввода.
 */
trait NormalizesPayload
{
    /**
     * Приводит значение к строке с trim или null.
     * Пустые строки и whitespace превращаются в null — тогда nullable-правила FormRequest работают корректно,
     * а required корректно ловит "пустые" поля.
     */
    protected function nullableString(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $text = trim((string) $value);

        return $text === '' ? null : $text;
    }

    /**
     * Приводит значение к int или null.
     * Используется для опциональных числовых полей (например, honeypot-таймстемп hp_started_at).
     */
    protected function nullableInt(mixed $value): ?int
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
     * Нормализует email: trim + mb_strtolower. Пустая строка → null.
     * Применяется перед валидацией, чтобы адреса типа "  User@Domain.COM " сохранялись в БД в канонической форме.
     */
    protected function normalizeEmail(mixed $value): ?string
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
