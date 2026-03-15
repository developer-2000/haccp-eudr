<?php

use App\Http\Controllers\LocaleController;
use Illuminate\Support\Facades\Route;

$localePattern = implode('|', available_locales());
if ($localePattern === '') {
    $localePattern = 'en';
}

// Смена локали с фронта: body.locale, запись в session и cookie, ответ JSON.
Route::post('/locale', [LocaleController::class, 'set'])
    ->name('locale.set');

// Редирект корня на /{locale} по session, cookie или config(app.locale).
Route::get('/', [LocaleController::class, 'redirectToLocale']);

// SPA: маршруты с префиксом {locale}, middleware SetLocale, отдача index-client.
Route::group([
    'prefix' => '{locale}',
    'where' => ['locale' => $localePattern],
    'middleware' => ['setLocale'],
], function () {
    Route::get('/', function () {
        return view('index-client');
    });
    Route::get('/{any}', function () {
        return view('index-client');
    })->where('any', '.*');
});



