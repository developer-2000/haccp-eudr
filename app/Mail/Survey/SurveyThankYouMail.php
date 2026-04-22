<?php

namespace App\Mail\Survey;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Письмо благодарности Клиенту за заполнение опроса с персональным скидочным кодом.
 * Отправляется через очередь после первичной отправки ответов.
 */
class SurveyThankYouMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        private readonly string $userEmail,
        private readonly string $discountCode,
        private readonly string $userName,
    ) {}

    /**
     * Envelope пользователю: from = наш адрес (SPF/DKIM/DMARC alignment).
     */
    public function envelope(): Envelope
    {
        $subject = $this->userName
            ? __('survey.email.subject_with_name', ['name' => $this->userName])
            : __('survey.email.subject_default');

        return new Envelope(
            from: new Address(
                config('mail.from.address'),
                config('app.name') // вот здесь HACCPilot
            ),
            to: [$this->userEmail],
            replyTo: [
                config('app.email_admin'),
            ],
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
                'recipientName' => $this->userName,
                'siteUrl' => config('app.url'),
            ],
        );
    }
}
