<?php

namespace App\Mail\Survey;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Письмо благодарности за заполнение опроса с персональным скидочным кодом.
 * Отправляется через очередь после первичной отправки ответов.
 */
class SurveyThankYouMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        private readonly string $discountCode,
        private readonly string $recipientName,
    ) {}

    /**
     * Формирует конверт письма с темой.
     */
    public function envelope(): Envelope
    {
        $subject = $this->recipientName
            ? __('survey.email.subject_with_name', ['name' => $this->recipientName])
            : __('survey.email.subject_default');

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Определяет blade-шаблон и передаёт данные для рендера письма.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.survey.thank-you',
            with: [
                'discountCode' => $this->discountCode,
                'recipientName' => $this->recipientName,
                'siteUrl' => config('app.url'),
            ],
        );
    }
}
