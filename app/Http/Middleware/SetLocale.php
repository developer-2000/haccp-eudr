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

        // Основной и второстепенный языки сайта
        $main = config('app.locale');
        $fallbackLocale = config('app.fallback_locale');

        // Язык браузера (Accept-Language)
        $fromBrowser = preferred_language_from_request($request, $available);

        // ============================================
        // 1. КАКИЕ 2 ЯЗЫКА ОТОБРАЖАТЬ В ПЕРЕКЛЮЧАТЕЛЕ
        // ============================================
        // Всегда: основной (main) + второй язык
        // Правило: если браузер использует язык из списка available И он != main → ставим его вторым
        // Иначе → второстепенный язык сайта (fallback_locale)
        $second = null;

        if ($fromBrowser && $fromBrowser !== $main && isset($countries[$fromBrowser])) {
            $second = $fromBrowser;
        } else {
            $second = $fallbackLocale;
        }

        // Формируем список из 2 языков для фронтенда: [main, second]
        $two = array_values(array_unique(array_filter([$main, $second])));

        $languagesForFrontend = array_map(
            fn($code) => [
                'code' => $code,
                'prefix' => $countries[$code]['prefix'] ?? strtoupper($code),
                'name' => $countries[$code]['name'] ?? strtoupper($code),
            ],
            $two,
        );

        // ============================================
        // 2. КАКОЙ ЯЗЫК ВЫБРАТЬ АКТИВНЫМ (locale)
        // ============================================
        // Приоритет:
        // 1) URL-сегмент {locale} (явное намерение по адресу страницы — /en/, /ro/, ...)
        // 2) Заголовок X-Locale (фронт сам сообщает текущую локаль для POST'ов
        //    без префикса — /survey/submit, /survey/verify и т.п.)
        // 3) Основной язык сайта (main = APP_LOCALE)
        // Session/cookie не используем намеренно — чтобы локаль не «застревала».
        $fromUrl = $request->route('locale');
        $fromHeader = $request->header('X-Locale');

        if ($fromUrl && in_array($fromUrl, $available, true)) {
            $locale = $fromUrl;
        } elseif ($fromHeader && in_array($fromHeader, $available, true)) {
            $locale = $fromHeader;
        } else {
            $locale = $main;
        }

        // Сохраняем в session — пригодится для blade-переключателя языков и подобных мест,
        // на выбор активной локали в этом middleware она не влияет.
        $request->session()->put('locale', $locale);

        App::setLocale($locale);

        // Переводы для фронтенда
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
