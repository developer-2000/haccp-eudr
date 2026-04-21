<?php

namespace App\Listeners\Survey;

use App\Mail\Survey\SurveyAdminNotifyMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

/**
 * Отправляет уведомление админу (EMAIL_ADMIN) о новом или обновлённом ответе опроса.
 * Диспатчится из SurveyResponseService после отправки письма клиенту.
 */
class SendSurveyAdminNotifyListener implements ShouldQueue
{
    use Dispatchable;
    use Queueable;
    use InteractsWithQueue;
    use SerializesModels;

    private string $eventType;
    private string $userEmail;
    private ?string $userName;
    private ?string $userCountry;
    private ?string $userBusinessType;

    public function __construct(
        string $eventType,
        string $userEmail,
        ?string $userName,
        ?string $userCountry,
        ?string $userBusinessType,
    ) {
        $this->eventType = $eventType;
        $this->userEmail = $userEmail;
        $this->userName = $userName;
        $this->userCountry = $userCountry;
        $this->userBusinessType = $userBusinessType;
    }

    /**
     * Отправляет письмо на EMAIL_ADMIN с данными респондента.
     */
    public function handle(): void
    {
        $adminEmail = config('mail.admin_email');
        if (!$adminEmail) {
            return;
        }

        Mail::send(
            new SurveyAdminNotifyMail(
                $adminEmail,
                $this->eventType,
                $this->userEmail,
                $this->userName,
                $this->userCountry,
                $this->userBusinessType,
            )
        );
    }
}
