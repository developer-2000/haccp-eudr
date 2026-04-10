<?php

namespace App\Mail\Survey;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Письмо с 4-значным кодом для подтверждения обновления ответов опроса.
 * Отправляется через очередь при повторной отправке ответов с уже существующим email.
 */
class SurveyVerificationCodeMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        private readonly string $verificationCode,
    ) {}

    /**
     * Формирует конверт письма с темой подтверждения.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
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
