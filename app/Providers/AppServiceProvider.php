<?php

namespace App\Providers;

use App\Services\SeoMetaResolver;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(SeoMetaResolver::class);
    }

    /**
     * Регистрирует View Composer для серверного рендеринга SEO мета-тегов в Blade.
     * Боты и социальные краулеры (Facebook, Telegram, Twitter) получают мета-теги
     * без выполнения JavaScript.
     */
    public function boot(): void
    {
        View::composer('layouts.app', function (\Illuminate\View\View $view) {
            $request = request();
            $locale = app()->getLocale();
            $path = $request->path();

            $resolver = app(SeoMetaResolver::class);
            $seo = $resolver->resolve($path, $locale);

            $view->with('seo', $seo);
        });
    }
}
