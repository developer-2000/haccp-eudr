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

// Публичная карточка партии EUDR (SPA, без префикса локали — как в QR-ссылках /batch/{id}).
Route::get('/batch/{batchId}', function () {
    return view('index-client');
})->where('batchId', '[A-Za-z0-9_-]+');

// Публичный дневной отчёт HACCP + EUDR (SPA, без локали — как в ссылке из Reports).
Route::get('/report/{date}', function () {
    return view('index-client');
})->where('date', '[0-9]{4}-[0-9]{2}-[0-9]{2}');

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



