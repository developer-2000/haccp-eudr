<?php

namespace App\Mail\Survey;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Письмо Клиенту подтверждения успешного обновления ответов опроса.
 * Отправляется через очередь после верификации 4-значного кода и слияния draft в submitted.
 */
class SurveyAnswersUpdatedMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        private readonly string $userEmail,
        private readonly string $userName,
    ) {}

    /**
     * Envelope пользователю: from = наш адрес (SPF/DKIM/DMARC alignment).
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: config('mail.from.address'),
            to: [$this->userEmail],
            replyTo: [
                config('app.email_admin'),
            ],
            subject: __('survey.email_updated.subject'),
        );
    }

    /**
     * Определяет blade-шаблон и передаёт данные для рендера письма.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.survey.answers-updated',
            with: [
                'recipientName' => $this->userName,
            ],
        );
    }
}
