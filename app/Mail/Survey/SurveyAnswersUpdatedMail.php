<?php

namespace App\Mail\Survey;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Письмо подтверждения успешного обновления ответов опроса.
 * Отправляется через очередь после верификации 4-значного кода и слияния draft в submitted.
 */
class SurveyAnswersUpdatedMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        private readonly string $recipientName,
    ) {}

    /**
     * Формирует конверт письма с темой подтверждения обновления.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
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
                'recipientName' => $this->recipientName,
            ],
        );
    }
}
