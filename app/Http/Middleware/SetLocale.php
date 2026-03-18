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

        // два языка для переключателя: 1) текущая локаль, 2) detected/fallback из списка
        // Важно: если fallback совпал с текущей локалью, берем "любой другой" из доступных.
        $browserLang = $fromBrowser ?? app(LocaleDetector::class)->detect($request);
        $fallbackLocale = config('app.fallback_locale');

        $second = null;
        if (
            $browserLang !== null
            && $browserLang !== $locale
            && isset($countries[$browserLang])
        ) {
            $second = $browserLang;
        } elseif (
            $fallbackLocale
            && $fallbackLocale !== $locale
            && isset($countries[$fallbackLocale])
        ) {
            $second = $fallbackLocale;
        } else {
            foreach ($available as $candidate) {
                if ($candidate !== $locale) {
                    $second = $candidate;
                    break;
                }
            }
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
