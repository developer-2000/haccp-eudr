<?php

namespace App\Services;

use Illuminate\Http\Request;

/**
 * Определяет «вторую» локаль для списка языков во фронте (заглушка; в проде — IP/geo).
 */
class LocaleDetector
{
    /**
     * Возвращает код второй локали для переключателя. Сейчас заглушка 'ro'; в проде подставить вызов detectByIp или внешнего сервиса.
     */
    public function detect(Request $request): string
    {
        $fromConfig = 'ro';
        if ($fromConfig !== null && $fromConfig !== '') {
            return $fromConfig;
        }
        return $this->detectByIp($request);
    }

    /**
     * Резервное определение локали без geo (сейчас — fallback_locale из конфига; позже — вызов внешнего сервиса по IP).
     */
    protected function detectByIp(Request $request): string
    {
        return config('app.fallback_locale', 'en');
    }
}
