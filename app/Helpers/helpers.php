<?php

use Illuminate\Http\Request;

/**
 * Возвращает список допустимых кодов локалей из config('site.languages.countries').
 *
 * @return array<int, string> ['en', 'at', 'be', ...]
 */
function available_locales(): array
{
    return array_keys(config('site.languages.countries', []));
}

/**
 * Предпочитаемый язык из заголовка Accept-Language, первый совпадающий с $available.
 * Использует Request::getPreferredLanguage() при наличии, иначе парсит заголовок вручную.
 *
 * @param  array<int, string>  $available
 * @return string|null
 */
function preferred_language_from_request(Request $request, array $available): ?string
{
    if (method_exists($request, 'getPreferredLanguage')) {
        $locale = $request->getPreferredLanguage($available);
        return $locale !== '' ? $locale : null;
    }
    $header = $request->header('Accept-Language');
    if (!$header) {
        return null;
    }
    // "ro-RO,ro;q=0.9,en;q=0.8" -> берём первый код (до - или ;), ищем в $available
    $map = [];
    foreach (array_map('trim', explode(',', $header)) as $part) {
        $lang = strtolower(explode(';', $part)[0]);
        $code = explode('-', $lang)[0];
        if (!isset($map[$code])) {
            $map[$code] = $code;
        }
    }
    foreach (array_keys($map) as $code) {
        if (in_array($code, $available)) {
            return $code;
        }
    }
    return null;
}
