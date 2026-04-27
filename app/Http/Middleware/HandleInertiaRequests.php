<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'inertia';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Возвращает данные, общие для всех Inertia-страниц: текущая локаль, список языков
     * с метаданными, базовая конфигурация сайта, переводы активной локали и flash-сообщения.
     * Используется фронтом через `usePage().props.*` без отдельных API-запросов.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'locale' => fn () => app()->getLocale(),
            'availableLocales' => available_locales(),
            'localeCountries' => config('site.languages.countries', []),
            'localeHreflangMap' => $this->buildHreflangMap(),
            'switcherLocales' => fn () => $request->attributes->get('languagesForFrontend', []),
            'siteConfig' => [
                'name' => config('app.name'),
                'adminEmail' => config('mail.admin_email'),
            ],
            'translations' => fn () => [
                app()->getLocale() => $this->loadLocaleTranslations(app()->getLocale()),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('flash.success'),
                'error' => fn () => $request->session()->get('flash.error'),
            ],
        ];
    }

    /**
     * Читает плоский файл переводов `lang/<locale>.php` для активной локали.
     * Используется в `share()`, чтобы отдать фронту переводы только текущего языка
     * (а не всех 25, как делает legacy SetLocale-middleware при формировании blade).
     *
     * @return array<string, mixed>
     */
    private function loadLocaleTranslations(string $locale): array
    {
        $path = lang_path($locale.'.php');
        if (!file_exists($path)) {
            return [];
        }

        return require $path;
    }

    /**
     * Сворачивает `config('site.languages.countries')` в карту `[code => hreflang]`.
     * Используется в `share()` для отдачи фронту минимальной структуры hreflang
     * без лишних полей (prefix, name) — те уже передаются через `localeCountries`.
     *
     * @return array<string, string>
     */
    private function buildHreflangMap(): array
    {
        $map = [];
        foreach (config('site.languages.countries', []) as $code => $meta) {
            $map[$code] = $meta['hreflang'] ?? $code;
        }

        return $map;
    }
}
