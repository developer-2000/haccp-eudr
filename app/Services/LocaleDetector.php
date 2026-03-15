<?php

namespace App\Services;

use Illuminate\Http\Request;

/**
 * Определяет «вторую» локаль для списка языков во фронте (браузер Accept-Language; резерв — fallback_locale).
 */
class LocaleDetector
{
    /**
     * Возвращает код второй локали для переключателя: язык браузера (Accept-Language) из допустимых, иначе fallback_locale.
     */
    public function detect(Request $request): string
    {
        $available = array_keys(config('site.languages.countries', []));
        $browser = preferred_language_from_request($request, $available);
        if ($browser !== null && $browser !== '') {
            return $browser;
        }
        return $this->detectByIp($request);
    }

    /**
     * Резерв, когда браузер не отдал подходящий язык (fallback_locale; при необходимости позже — IP/geo).
     */
    protected function detectByIp(Request $request): string
    {
        return config('app.fallback_locale', 'en');
    }
}
