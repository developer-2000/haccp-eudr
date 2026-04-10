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
 * Отправляет письмо с 4-значным кодом подтверждения через очередь.
 * Диспатчится из SurveyResponseService при обновлении ответов (draft-сценарий).
 */
class SendSurveyVerificationCodeListener implements ShouldQueue
{
    use Dispatchable;
    use Queueable;
    use InteractsWithQueue;
    use SerializesModels;

    private string $email_to;
    private string $verificationCode;
    private string $locale;

    public function __construct(string $email_to, string $verificationCode, string $locale)
    {
        $this->email_to = $email_to;
        $this->verificationCode = $verificationCode;
        $this->locale = $locale;
    }

    /**
     * Устанавливает локаль пользователя и отправляет письмо с кодом подтверждения.
     */
    public function handle(): void
    {
        App::setLocale($this->locale);

        Mail::to($this->email_to)->send(
            new SurveyVerificationCodeMail($this->verificationCode)
        );
    }
}
