<?php

namespace App\Listeners\Survey;

use App\Mail\Survey\SurveyVerificationCodeMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Mail;

/**
 * Отправляет письмо с 4-значным кодом Клиенту подтверждения через очередь.
 * Диспатчится из SurveyResponseService при обновлении ответов (draft-сценарий).
 */
class SendSurveyVerificationCodeListener implements ShouldQueue
{
    use Dispatchable;
    use Queueable;
    use InteractsWithQueue;
    use SerializesModels;

    private string $userEmail;
    private string $verificationCode;
    private string $userLocale;

    public function __construct(string $userEmail, string $verificationCode, string $userLocale)
    {
        $this->userEmail = $userEmail;
        $this->verificationCode = $verificationCode;
        $this->userLocale = $userLocale;
    }

    /**
     * Устанавливает локаль пользователя и отправляет письмо с кодом подтверждения.
     */
    public function handle(): void
    {
        App::setLocale($this->userLocale);

        Mail::send(
            new SurveyVerificationCodeMail($this->userEmail, $this->verificationCode)
        );
    }
}
