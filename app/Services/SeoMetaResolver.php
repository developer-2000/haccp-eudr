<?php

namespace App\Services;

/**
 * Определяет SEO мета-теги (title, description, og, twitter) по текущему URL.
 * Читает данные из lang/{locale}/seo.php. Для статических страниц возвращает данные напрямую,
 * для динамических (batch, report) — подставляет параметры из URL.
 * Используется в View Composer для серверного рендеринга мета-тегов в Blade (для ботов, соцсетей).
 */
class SeoMetaResolver
{
    private const SITE_NAME = 'HACCPilot';

    private const DEFAULT_OG_IMAGE = '/images/haccpilot.jpg';

    /**
     * Маппинг URL-сегментов на ключи в lang/{locale}/seo.php.
     */
    private const ROUTE_MAP = [
        ''               => 'home',
        'about'          => 'about',
        'how-it-works'   => 'how_it_works',
        'survey'         => 'survey',
        'demo/dashboard' => 'demo_dashboard',
        'demo/checklists'=> 'demo_checklists',
        'demo/eudr'      => 'demo_eudr',
        'demo/personnel' => 'demo_personnel',
        'demo/reports'   => 'demo_reports',
        'privacy-policy' => 'privacy_policy',
        'contact'        => 'contact',
    ];

    /**
     * Разрешает SEO мета-теги для текущего запроса.
     * Возвращает массив с ключами: title, description, og/twitter теги, canonical, hreflang.
     *
     * @return array<string, mixed>
     */
    public function resolve(string $path, string $locale): array
    {
        $seo = $this->loadSeoData($locale);
        $path = trim($path, '/');

        $localePrefix = $locale . '/';
        if (str_starts_with($path, $localePrefix)) {
            $path = substr($path, strlen($localePrefix));
        } elseif ($path === $locale) {
            $path = '';
        }

        $entry = $this->matchEntry($path, $seo);

        $title = $entry['title'] ?? self::SITE_NAME;
        $description = $entry['description'] ?? '';
        $ogImage = $entry['og_image'] ?? self::DEFAULT_OG_IMAGE;

        $baseUrl = rtrim(config('app.url'), '/');
        $suffix = $path !== '' ? '/' . $path : '';

        return [
            'title'               => $title . ' | ' . self::SITE_NAME,
            'description'         => $description,
            'og_title'            => ($entry['og_title'] ?? $title) . ' | ' . self::SITE_NAME,
            'og_description'      => $entry['og_description'] ?? $description,
            'og_image'            => $ogImage,
            'twitter_title'       => ($entry['twitter_title'] ?? $title) . ' | ' . self::SITE_NAME,
            'twitter_description' => $entry['twitter_description'] ?? $description,
            'og_type'             => 'website',
            'canonical'           => $baseUrl . '/' . $locale . $suffix,
            'hreflang'            => $this->buildHreflang($baseUrl, $suffix),
        ];
    }

    /**
     * Формирует массив hreflang-ссылок для всех доступных локалей + x-default.
     * Каждая языковая версия ссылается на все остальные (полный граф).
     *
     * @return array<int, array{lang: string, href: string}>
     */
    private function buildHreflang(string $baseUrl, string $suffix): array
    {
        $countries = config('site.languages.countries', []);
        $links = [];

        foreach ($countries as $code => $meta) {
            $links[] = [
                'lang' => $meta['hreflang'] ?? $code,
                'href' => $baseUrl . '/' . $code . $suffix,
            ];
        }

        $links[] = ['lang' => 'x-default', 'href' => $baseUrl . '/en' . $suffix];

        return $links;
    }

    /**
     * Загружает массив SEO-переводов из lang/{locale}/seo.php с fallback на en.
     */
    private function loadSeoData(string $locale): array
    {
        $path = lang_path("{$locale}/seo.php");
        if (file_exists($path)) {
            return require $path;
        }

        $fallback = lang_path('en/seo.php');
        return file_exists($fallback) ? require $fallback : [];
    }

    /**
     * Находит подходящую SEO-запись по пути URL.
     * Обрабатывает статические маршруты через ROUTE_MAP,
     * динамические (batch/{id}, report/{date}) — с подстановкой параметров.
     */
    private function matchEntry(string $path, array $seo): array
    {
        if (isset(self::ROUTE_MAP[$path])) {
            return $seo[self::ROUTE_MAP[$path]] ?? [];
        }

        if (preg_match('#^batch/([A-Za-z0-9_-]+)$#', $path, $m)) {
            $entry = $seo['batch_public'] ?? [];
            return $this->interpolate($entry, ['id' => $m[1], 'product' => '']);
        }

        if (preg_match('#^report/(\d{4}-\d{2}-\d{2})$#', $path, $m)) {
            $entry = $seo['report_public'] ?? [];
            return $this->interpolate($entry, ['date' => $m[1], 'company' => '', 'points' => '']);
        }

        if (str_starts_with($path, 'demo/')) {
            $section = substr($path, 5);
            $key = 'demo_' . $section;
            return $seo[$key] ?? $seo['demo_dashboard'] ?? [];
        }

        return $seo['home'] ?? [];
    }

    /**
     * Заменяет плейсхолдеры {key} в строковых значениях массива.
     */
    private function interpolate(array $entry, array $params): array
    {
        $search = [];
        $replace = [];
        foreach ($params as $key => $value) {
            $search[] = '{' . $key . '}';
            $replace[] = $value;
        }

        return array_map(function ($v) use ($search, $replace) {
            return is_string($v) ? str_replace($search, $replace, $v) : $v;
        }, $entry);
    }
}
