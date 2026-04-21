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

    private string $userEmail;
    private string $userName;
    private string $userLocale;

    public function __construct(
        string $userEmail,
        string $userName,
        string $userLocale
    )
    {
        $this->userEmail = $userEmail;
        $this->userName = $userName;
        $this->userLocale = $userLocale;
    }

    /**
     * Устанавливает локаль пользователя и отправляет письмо подтверждения обновления.
     */
    public function handle(): void
    {
        App::setLocale($this->userLocale);

        Mail::send(
            new SurveyAnswersUpdatedMail($this->userEmail, $this->userName)
        );
    }
}
