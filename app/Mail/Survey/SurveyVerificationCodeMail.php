<?php

namespace App\Mail\Survey;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Address;

/**
 * Письмо с 4-значным кодом Клиенту для подтверждения обновления ответов опроса.
 * Отправляется через очередь при повторной отправке ответов с уже существующим email.
 */
class SurveyVerificationCodeMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        private readonly string $userEmail,
        private readonly string $verificationCode,
    ) {}

    /**
     * Envelope пользователю: from = наш адрес (SPF/DKIM/DMARC alignment).
     */
    public function envelope(): Envelope
    {
        return new Envelope(
//            from: config('mail.from.address'),
            from: new Address(
                config('mail.from.address'),
                config('app.name') // вот здесь HACCPilot
            ),
            to: [$this->userEmail],
            replyTo: [
                config('app.email_admin'),
            ],
            subject: __('survey.email_verify.subject'),
        );
    }

    /**
     * Определяет blade-шаблон и передаёт код подтверждения для рендера.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.survey.verification-code',
            with: [
                'verificationCode' => $this->verificationCode,
            ],
        );
    }
}
