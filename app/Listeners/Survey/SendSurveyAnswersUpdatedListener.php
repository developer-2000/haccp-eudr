<?php

namespace App\Listeners\Survey;

use App\Mail\Survey\SurveyAnswersUpdatedMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Mail;

/**
 * Отправляет письмо подтверждения обновления ответов через очередь.
 * Диспатчится из SurveyResponseService после успешной верификации кода.
 */
class SendSurveyAnswersUpdatedListener implements ShouldQueue
{
    use Dispatchable;
    use Queueable;
    use InteractsWithQueue;
    use SerializesModels;

    private string $email_to;
    private string $recipientName;
    private string $locale;

    public function __construct(string $email_to, string $recipientName, string $locale)
    {
        $this->email_to = $email_to;
        $this->recipientName = $recipientName;
        $this->locale = $locale;
    }

    /**
     * Устанавливает локаль пользователя и отправляет письмо подтверждения обновления.
     */
    public function handle(): void
    {
        App::setLocale($this->locale);

        Mail::to($this->email_to)->send(
            new SurveyAnswersUpdatedMail($this->recipientName)
        );
    }
}
