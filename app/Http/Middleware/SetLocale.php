<?php

namespace App\Http\Middleware;

use App\Services\LocaleDetector;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\View;

/**
 * Выбирает локаль из session/cookie/config,
 * устанавливает App::setLocale и передаёт во view данные для переключателя языков
 * (main + detected, при совпадении — fallback).
 */
class SetLocale
{
    /**
     * Определяет текущую локаль, пишет в session, ставит App::setLocale,
     * формирует localeForFrontend и languagesForFrontend (два языка: main + detect, при одном — fallback из countries)
     * и отдаёт во view.
     */
    public function handle(Request $request, Closure $next)
    {
        $countries = config('site.languages.countries', []);
        $available = available_locales();
        // Язык по умолчанию
        $main = config('app.locale');

        // session → cookie → Accept-Language → main; при недопустимом подставляем main
        $fromSession = $request->session()->get('locale');
        $fromCookie = $request->cookie('locale');
        $fromBrowser = preferred_language_from_request($request, $available);

        $locale = $fromSession ?? $fromCookie ?? $fromBrowser ?? $main;

        if (!in_array($locale, $available)) {
            $locale = $main;
        }

        $request->session()->put('locale', $locale);
        App::setLocale($locale);

        // два языка для переключателя: 1) текущая локаль, 2) всегда язык браузера (если совпадает — fallback)
        $browserLang = $fromBrowser ?? app(LocaleDetector::class)->detect($request);
        $second = ($browserLang !== null && $browserLang !== $locale)
            ? $browserLang
            : (isset($countries['en']) ? 'en' : config('app.fallback_locale'));
        if ($second === $locale || !isset($countries[$second])) {
            $second = $main !== $locale ? $main : config('app.fallback_locale');
        }
        $two = array_values(array_unique(array_filter([$locale, $second])));

        // [['code' => 'en', 'prefix' => 'EN', 'name' => 'English'], ...]
        $codes = array_keys(array_intersect_key($countries, array_flip($two)));
        $languagesForFrontend = array_map(
            fn($code) => [
                'code' => $code,
                'prefix' => $countries[$code]['prefix'] ?? strtoupper($code),
                'name' => $countries[$code]['name'] ?? strtoupper($code),
            ],
            $codes
        );

        $translationsForFrontend = [];
        foreach ($available as $loc) {
            $path = lang_path($loc . '.php');
            if (file_exists($path)) {
                $translationsForFrontend[$loc] = require $path;
            }
        }

        View::share('localeForFrontend', $locale);
        View::share('languagesForFrontend', $languagesForFrontend);
        View::share('translationsForFrontend', $translationsForFrontend);

        return $next($request);
    }
}
