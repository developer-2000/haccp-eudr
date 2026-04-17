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
    private string $respondentEmail;
    private ?string $respondentName;
    private ?string $country;
    private ?string $businessType;

    public function __construct(
        string $eventType,
        string $respondentEmail,
        ?string $respondentName,
        ?string $country,
        ?string $businessType,
    ) {
        $this->eventType = $eventType;
        $this->respondentEmail = $respondentEmail;
        $this->respondentName = $respondentName;
        $this->country = $country;
        $this->businessType = $businessType;
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

        Mail::to($adminEmail)->send(
            new SurveyAdminNotifyMail(
                $this->eventType,
                $this->respondentEmail,
                $this->respondentName,
                $this->country,
                $this->businessType,
            )
        );
    }
}
