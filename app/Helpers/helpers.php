<?php

use Illuminate\Http\Request;

/**
 * Возвращает список допустимых кодов локалей из config('site.languages.countries').
 *
 * @return array<int, string> ['en', 'de', 'be', ...]
 */
function available_locales(): array
{
    return array_keys(config('site.languages.countries', []));
}

/**
 * Основной (первый) язык браузера из заголовка Accept-Language.
 *
 * Берётся ТОЛЬКО primary-код (первая запись, до «-» и «;»), без перебора
 * q-предпочтений. Если его нет в $available — возвращается null, чтобы
 * вызвавшая сторона могла использовать fallback_locale.
 *
 * Алиасы ISO-кодов (макро → конкретный): 'no' → 'nb' (норвежский букмол),
 * применяются до проверки в $available.
 *
 * Пример: "ru-RU,ru;q=0.9,mt;q=0.8,en;q=0.7" → 'ru' → null (если 'ru' нет в списке).
 *
 * @param  array<int, string>  $available
 * @return string|null
 */
function preferred_language_from_request(Request $request, array $available): ?string
{
    $header = $request->header('Accept-Language');
    if (!$header) {
        return null;
    }
    $first = explode(',', $header)[0];
    $lang = strtolower(trim(explode(';', $first)[0]));
    $code = explode('-', $lang)[0];

    $aliases = ['no' => 'nb'];
    $code = $aliases[$code] ?? $code;

    return in_array($code, $available, true) ? $code : null;
}
