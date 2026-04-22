<?php

use App\Http\Controllers\Client\ContactController;
use App\Http\Controllers\Client\SurveyQuestionsController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\Technical\MailTestController;
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

// Публичная карточка партии EUDR (SPA): /batch/{id} без локали (старые QR) и /{locale}/batch/{id} — см. группу `{locale}/{any}` ниже.
Route::get('/batch/{batchId}', function () {
    return view('index-client');
})->where('batchId', '[A-Za-z0-9_-]+');

// Публичный дневной отчёт HACCPilot (SPA): /report/{date} без локали и /{locale}/report/{date} — см. группу `{locale}/{any}` ниже.
Route::get('/report/{date}', function () {
    return view('index-client');
})->where('date', '[0-9]{4}-[0-9]{2}-[0-9]{2}');

// JSON вопросов опроса для SPA: без префикса локали (перевод на клиенте, vue-i18n).
Route::get('/survey/questions', [SurveyQuestionsController::class, 'index'])
    ->middleware('throttle:20,1')
    ->name('client.survey.questions');

// Ответы на вопросы
Route::prefix('survey')->group(function () {
    // Отправка ответов опроса.
    Route::post('submit', [SurveyQuestionsController::class, 'submitAnswersQuestions'])
        ->middleware(['setLocale', 'throttle:10,1'])
        ->name('client.survey.submit');

    Route::post('verify', [SurveyQuestionsController::class, 'verifyCode'])
        ->middleware(['setLocale', 'throttle:10,1'])
        ->name('client.survey.verify');
});

// Отправка сообщения из публичной формы Contact (honeypot + throttle 5/min).
Route::post('/contact', [ContactController::class, 'submit'])
    ->middleware(['setLocale', 'throttle:5,1'])
    ->name('client.contact.submit');

Route::prefix('technical')->as('technical.')->middleware('throttle:30,1')->group(function () {
        // /technical
        Route::get('/', [MailTestController::class, 'index'])->name('index');

        // Тестовая отправка письма
        Route::get('/mail-test', [MailTestController::class, 'index'])->name('mail-test.index');
        Route::post('/mail-test/send', [MailTestController::class, 'send'])->name('mail-test.send');
        Route::post('/mail-test/send-all', [MailTestController::class, 'sendAllQueued'])->name('mail-test.send-all');
    });

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
