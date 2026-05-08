<?php

use App\Http\Controllers\Client\ContactController;
use App\Http\Controllers\Client\SurveyQuestionsController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\Technical\MailTestController;
use App\Services\SeoMetaResolver;
use App\Services\SurveyQuestionsClientService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

$localePattern = implode('|', available_locales());
if ($localePattern === '') {
    $localePattern = 'en';
}

/**
 * Универсальный обработчик публичной Inertia-страницы: рендерит компонент `$component`
 * и подмешивает SEO-данные через `SeoMetaResolver::resolveForInertia()`. Опциональный
 * `$extraPropsResolver` — функция, получающая `$request` и возвращающая дополнительные
 * Inertia-props (например `questions` для Survey, `batchId` для BatchPublic). Используется
 * для всех мигрированных постраничных роутов — убирает дубликат `Inertia::render(...)`.
 */
$inertiaPage = fn (string $component, ?callable $extraPropsResolver = null) => function (Request $request, SeoMetaResolver $seoResolver) use ($component, $extraPropsResolver) {
    $extra = $extraPropsResolver ? $extraPropsResolver($request) : [];

    return Inertia::render($component, array_merge([
        'seo' => $seoResolver->resolveForInertia($request->path(), app()->getLocale()),
    ], $extra));
};

// Смена локали с фронта: body.locale, запись в session и cookie, ответ JSON.
Route::post('/locale', [LocaleController::class, 'set'])
    ->name('locale.set');

// Лёгкий пинг сессии: фронт дёргает при возврате во вкладку, чтобы получить актуальный CSRF
// и понять, жива ли сессия (после простоя >SESSION_LIFETIME Laravel создаст новую).
// Путь вне `api/*` — чтобы не попадать под CORS из config/cors.php.
Route::get('/session/ping', function () {
    return response()
        ->json([
            'status' => 'success',
            'data' => [
                'csrf' => csrf_token(),
            ],
        ])
        ->header('Cache-Control', 'no-store');
})->middleware('throttle:60,1')->name('client.session.ping');

// Корневой URL: рендерит Home без префикса локали. SetLocale middleware сам определяет
// активную локаль (URL → X-Locale → app.locale), canonical в SEO-meta указывает
// на `/{locale}` — Google не индексирует `/` как дубликат `/en`.
Route::get('/', $inertiaPage('Home'))
    ->middleware(['setLocale']);

// Публичная карточка партии закупки (без префикса локали — старые QR-коды).
Route::get('/batch/{batchId}', $inertiaPage('BatchPublic', fn (Request $request) => [
    'batchId' => (string) $request->route('batchId'),
    'print' => $request->boolean('print'),
]))
    ->where('batchId', '[A-Za-z0-9_-]+')
    ->middleware(['setLocale']);

// Публичный дневной отчёт задач (без префикса локали).
Route::get('/report/{date}', $inertiaPage('DailyReportPublic', fn (Request $request) => [
    'date' => (string) $request->route('date'),
    'print' => $request->boolean('print'),
]))
    ->where('date', '[0-9]{4}-[0-9]{2}-[0-9]{2}')
    ->middleware(['setLocale']);

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

// Публичные маршруты с префиксом {locale}, middleware SetLocale.
// Все рендерятся через Inertia; неизвестные пути отдают 404 (catchall'а на legacy больше нет).
Route::group([
    'prefix' => '{locale}',
    'where' => ['locale' => $localePattern],
    'middleware' => ['setLocale'],
], function () use ($inertiaPage) {
    Route::get('/', $inertiaPage('Home'));
    Route::get('/about', $inertiaPage('About'));
    Route::get('/how-it-works', $inertiaPage('HowWorks'));
    Route::get('/privacy-policy', $inertiaPage('PrivacyPolicy'));
    Route::get('/contact', $inertiaPage('Contact'));
    Route::get('/survey', $inertiaPage('Survey', function () {
        // Honeypot: серверный timestamp в шифрованной HttpOnly-куке (TTL 120 мин).
        // Перезаписывается на каждом GET страницы; читается на /survey/submit.
        Cookie::queue(cookie('hp_started_at', (string) now()->timestamp, 120));

        return [
            'questions' => app(SurveyQuestionsClientService::class)->getActiveQuestionsKeyedByStableId(),
        ];
    }));
    Route::get('/demo/{section?}', $inertiaPage('Demo', fn (Request $request) => [
        'section' => (string) ($request->route('section') ?? 'dashboard'),
    ]))->where('section', 'dashboard|checklists|personnel|eudr|reports');
    Route::get('/batch/{batchId}', $inertiaPage('BatchPublic', fn (Request $request) => [
        'batchId' => (string) $request->route('batchId'),
        'print' => $request->boolean('print'),
    ]))->where('batchId', '[A-Za-z0-9_-]+');
    Route::get('/report/{date}', $inertiaPage('DailyReportPublic', fn (Request $request) => [
        'date' => (string) $request->route('date'),
        'print' => $request->boolean('print'),
    ]))->where('date', '[0-9]{4}-[0-9]{2}-[0-9]{2}');
});
