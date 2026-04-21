<?php

namespace App\Http\Controllers\Technical;

use App\Http\Controllers\Controller;
use App\Listeners\Contact\SendContactAdminNotifyListener;
use App\Listeners\Survey\SendSurveyAdminNotifyListener;
use App\Listeners\Survey\SendSurveyAnswersUpdatedListener;
use App\Listeners\Survey\SendSurveyThankYouListener;
use App\Listeners\Survey\SendSurveyVerificationCodeListener;
use App\Listeners\Technical\QueueTestMailListener;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class MailTestController extends Controller
{
    /**
     * Отображает техническую страницу проверки отправки писем.
     * Используется для ручных e2e-тестов цепочки queue -> mail.
     */
    public function index(): View
    {
        return view('technical.index', [
            'targetEmail' => 'thwglobal2000@gmail.com',
            'adminEmail' => (string)config('mail.admin_email'),
            'mailer' => (string)config('mail.default'),
            'queueConnection' => (string)config('queue.default'),
        ]);
    }

    /**
     * Ставит отправку тестового письма в очередь прямым queued-обработчиком.
     * Нужен для проверки корректной фоновой отправки на тестовой странице.
     */
    public function send(): RedirectResponse
    {
        QueueTestMailListener::dispatch('thwglobal2000@gmail.com');

        return redirect()->route('technical.index')->with('status', 'Запрос на отправку поставлен в очередь.');
    }

    /**
     * Ставит в очередь все 6 типов писем с получателем EMAIL_ADMIN.
     * После выполнения `queue:work` в `jobs/failed_jobs` будет виден каждый Mailable отдельно.
     */
    public function sendAllQueued(): RedirectResponse
    {
        $adminEmail = (string)config('mail.admin_email');
        if ($adminEmail === '') {
            return redirect()->route('technical.index')
                ->with('status', 'EMAIL_ADMIN не задан в .env — очередь не заполнена.');
        }

        QueueTestMailListener::dispatch($adminEmail);

        SendContactAdminNotifyListener::dispatch(
            'Technical Test',
            $adminEmail,
            null,
            'Тестовое сообщение из /technical.',
            [
                'locale'     => 'en',
                'ip'         => '127.0.0.1',
                'user_agent' => 'TechnicalTestHub',
            ],
        );

        SendSurveyAdminNotifyListener::dispatch(
            'created',
            $adminEmail,
            'Technical Test',
            null,
            null,
        );

        SendSurveyThankYouListener::dispatch(
            $adminEmail,
            'TEST-DISCOUNT',
            'Technical Test',
            'en',
        );

        SendSurveyVerificationCodeListener::dispatch(
            $adminEmail,
            '1234',
            'en',
        );

        SendSurveyAnswersUpdatedListener::dispatch(
            $adminEmail,
            'Technical Test',
            'en',
        );

        return redirect()->route('technical.index')
            ->with('status', "В очередь поставлено 6 писем, получатель: {$adminEmail}.");
    }
}
