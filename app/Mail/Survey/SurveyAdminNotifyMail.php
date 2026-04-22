<?php

namespace App\Mail\Survey;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Уведомление Админу о новом или обновлённом ответе опроса.
 * Содержит данные респондента: email, имя, страну, тип бизнеса.
 */
class SurveyAdminNotifyMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        private readonly string $adminEmail,
        private readonly string $eventType,
        private readonly string $userEmail,
        private readonly ?string $userName,
        private readonly ?string $userCountry,
        private readonly ?string $businessType,
    ) {}

    /**
     * Envelope админу: from = наш адрес (SPF/DKIM/DMARC alignment), reply-to = email респондента.
     */
    public function envelope(): Envelope
    {
        $prefix = $this->eventType === 'created' ? 'Создан ответ' : 'Обновлен ответ';

        return new Envelope(
            from: new Address(
                config('mail.from.address'),
                config('app.name') // вот здесь HACCPilot
            ),
            to: [$this->adminEmail],
            replyTo: [],
            subject: "[HACCPilot Survey] {$prefix} — {$this->userEmail}",
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
                'respondentEmail' => $this->userEmail,
                'respondentName' => $this->userName ?? '—',
                'country'        => $this->userCountry ?? '—',
                'businessType'   => $this->businessType ?? '—',
            ],
        );
    }
}
