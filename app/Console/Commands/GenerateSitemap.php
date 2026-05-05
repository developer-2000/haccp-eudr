<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use SimpleXMLElement;
use Carbon\Carbon;

class GenerateSitemap extends Command
{
    protected $signature = 'sitemap:generate';
    protected $description = 'Generate multilingual sitemap';

    public function handle()
    {
        $baseUrl = rtrim(config('app.url'), '/');

        // ✔ ТВОЙ КОНФИГ
        $langs = config('site.languages.countries', []);

        if (empty($langs) || !is_array($langs)) {
            $this->error('Languages config missing: site.languages.countries');
            return 1;
        }

        // ✔ страницы сайта
        $pages = [
            '/',
            '/about',
            '/how-it-works',
            '/survey',
            '/demo/dashboard',
            '/demo/checklists',
            '/demo/eudr',
            '/demo/personnel',
            '/demo/reports',
            '/privacy-policy',
            '/contact',
        ];

        $xml = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><urlset/>');
        $xml->addAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

        $date = Carbon::now()->toDateString();

        foreach ($pages as $page) {
            foreach ($langs as $lang => $meta) {

                $url = $xml->addChild('url');

                // ✔ ВСЕГДА /{lang}/page
                $loc = $baseUrl . '/' . $lang . $page;

                $url->addChild('loc', $loc);
                $url->addChild('lastmod', $date);
                $url->addChild('changefreq', $this->freq($page));
                $url->addChild('priority', $this->priority($page));
            }
        }

        $path = public_path('sitemap.xml');
        $xml->asXML($path);

        $this->info("Sitemap generated: {$path}");

        return 0;
    }

    private function freq($page)
    {
        return match (true) {
            $page === '/' => 'weekly',
            str_contains($page, 'demo') => 'weekly',
            str_contains($page, 'privacy') => 'yearly',
            default => 'monthly',
        };
    }

    private function priority($page)
    {
        return match (true) {
            $page === '/' => '1.0',
            str_contains($page, 'demo') => '0.8',
            str_contains($page, 'contact') => '0.5',
            str_contains($page, 'privacy') => '0.3',
            default => '0.7',
        };
    }
}
