<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

/**
 * Генерирует public/sitemap.xml со всеми публичными страницами.
 * Включает hreflang-альтернативы для каждой локали и lastmod.
 * Запуск: php artisan sitemap:generate
 */
class GenerateSitemap extends Command
{
    protected $signature = 'sitemap:generate';

    protected $description = 'Generate public/sitemap.xml with all public pages and hreflang alternates';

    /**
     * Статические пути (без префикса локали).
     */
    private const STATIC_PATHS = [
        ''               => ['changefreq' => 'weekly',  'priority' => '1.0'],
        'about'          => ['changefreq' => 'monthly', 'priority' => '0.7'],
        'how-it-works'   => ['changefreq' => 'monthly', 'priority' => '0.7'],
        'survey'         => ['changefreq' => 'monthly', 'priority' => '0.6'],
        'demo/dashboard' => ['changefreq' => 'weekly',  'priority' => '0.8'],
        'demo/checklists'=> ['changefreq' => 'weekly',  'priority' => '0.8'],
        'demo/eudr'      => ['changefreq' => 'weekly',  'priority' => '0.8'],
        'demo/personnel' => ['changefreq' => 'weekly',  'priority' => '0.7'],
        'demo/reports'   => ['changefreq' => 'weekly',  'priority' => '0.7'],
        'privacy-policy' => ['changefreq' => 'yearly',  'priority' => '0.3'],
        'contact'        => ['changefreq' => 'monthly', 'priority' => '0.5'],
    ];

    public function handle(): int
    {
        $baseUrl = rtrim(config('app.url'), '/');
        $countries = config('site.languages.countries', []);
        $lastmod = now()->toDateString();

        $urls = [];

        foreach (self::STATIC_PATHS as $path => $meta) {
            $suffix = $path !== '' ? '/' . $path : '';
            $alternates = $this->buildAlternates($baseUrl, $suffix, $countries);

            foreach (array_keys($countries) as $code) {
                $loc = $baseUrl . '/' . $code . $suffix;
                $urls[] = $this->buildUrlEntry($loc, $lastmod, $meta, $alternates);
            }
        }

        $xml = $this->buildXml($urls);

        $outputPath = public_path('sitemap.xml');
        file_put_contents($outputPath, $xml);

        $this->info('Sitemap generated: ' . $outputPath . ' (' . count($urls) . ' URLs)');

        return self::SUCCESS;
    }

    /**
     * Формирует массив hreflang-альтернатив для одного URL.
     * Использует поле hreflang из конфига для корректных ISO 639-1 кодов языков.
     *
     * @return array<int, array{locale: string, href: string}>
     */
    private function buildAlternates(string $baseUrl, string $suffix, array $countries): array
    {
        $alternates = [];
        foreach ($countries as $code => $meta) {
            $alternates[] = [
                'locale' => $meta['hreflang'] ?? $code,
                'href'   => $baseUrl . '/' . $code . $suffix,
            ];
        }
        $alternates[] = ['locale' => 'x-default', 'href' => $baseUrl . '/en' . $suffix];

        return $alternates;
    }

    /**
     * Формирует XML-блок одного <url> с lastmod, changefreq, priority и xhtml:link.
     */
    private function buildUrlEntry(string $loc, string $lastmod, array $meta, array $alternates): string
    {
        $lines = [];
        $lines[] = '  <url>';
        $lines[] = '    <loc>' . htmlspecialchars($loc) . '</loc>';
        $lines[] = '    <lastmod>' . $lastmod . '</lastmod>';
        $lines[] = '    <changefreq>' . $meta['changefreq'] . '</changefreq>';
        $lines[] = '    <priority>' . $meta['priority'] . '</priority>';

        foreach ($alternates as $alt) {
            $lines[] = '    <xhtml:link rel="alternate" hreflang="'
                . $alt['locale'] . '" href="' . htmlspecialchars($alt['href']) . '"/>';
        }

        $lines[] = '  </url>';

        return implode("\n", $lines);
    }

    /**
     * Оборачивает массив URL-блоков в полный XML-документ sitemap.
     */
    private function buildXml(array $urls): string
    {
        $header = '<?xml version="1.0" encoding="UTF-8"?>' . "\n"
            . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'
            . ' xmlns:xhtml="http://www.w3.org/1999/xhtml">';

        return $header . "\n" . implode("\n", $urls) . "\n" . '</urlset>' . "\n";
    }
}
