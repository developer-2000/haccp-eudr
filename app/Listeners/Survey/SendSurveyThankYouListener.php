<?php

namespace App\Listeners\Survey;

use App\Mail\Survey\SurveyThankYouMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Mail;

/**
 * Отправляет письмо Клиенту благодарности со скидочным кодом через очередь.
 * Диспатчится из SurveyResponseService после первичного сохранения ответов.
 */
class SendSurveyThankYouListener implements ShouldQueue
{
    use Dispatchable;
    use Queueable;
    use InteractsWithQueue;
    use SerializesModels;

    private string $userEmail;
    private string $discountCode;
    private string $userName;
    private string $locale;

    public function __construct(string $userEmail, string $discountCode, string $userName, string $locale)
    {
        $this->userEmail = $userEmail;
        $this->discountCode = $discountCode;
        $this->userName = $userName;
        $this->locale = $locale;
    }

    /**
     * Устанавливает локаль пользователя и отправляет письмо благодарности.
     */
    public function handle(): void
    {
        App::setLocale($this->locale);

        Mail::send(
            new SurveyThankYouMail($this->userEmail, $this->discountCode, $this->userName)
        );
    }
}
