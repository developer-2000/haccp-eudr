<?php

namespace App\Mail\Survey;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Уведомление админу о новом или обновлённом ответе опроса.
 * Содержит данные респондента: email, имя, страну, тип бизнеса.
 */
class SurveyAdminNotifyMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        private readonly string $eventType,
        private readonly string $respondentEmail,
        private readonly ?string $respondentName,
        private readonly ?string $country,
        private readonly ?string $businessType,
    ) {}

    /**
     * Формирует конверт письма с темой, зависящей от типа события.
     */
    public function envelope(): Envelope
    {
        $prefix = $this->eventType === 'created' ? 'Создан ответ' : 'Обновлен ответ';

        return new Envelope(
            subject: "[HACCPilot Survey] {$prefix} — {$this->respondentEmail}",
        );
    }

    /**
     * Передаёт данные респондента в шаблон письма.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.survey.admin-notify',
            with: [
                'eventType'      => $this->eventType,
                'respondentEmail' => $this->respondentEmail,
                'respondentName' => $this->respondentName ?? '—',
                'country'        => $this->country ?? '—',
                'businessType'   => $this->businessType ?? '—',
            ],
        );
    }
}
