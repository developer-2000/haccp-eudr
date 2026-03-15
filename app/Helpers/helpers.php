<?php

/**
 * Возвращает список допустимых кодов локалей из config('site.languages.countries').
 *
 * @return array<int, string> ['en', 'at', 'be', ...]
 */
function available_locales(): array
{
    return array_keys(config('site.languages.countries', []));
}
