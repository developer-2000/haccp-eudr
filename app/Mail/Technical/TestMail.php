<?php

namespace App\Mail\Technical;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TestMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        private readonly string $toEmail,
    ) {}

    /**
     * Envelope тестового письма: from = наш адрес (SPF/DKIM/DMARC alignment).
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(
                config('mail.from.address'),
                config('app.name') // вот здесь HACCPilot
            ),
            to: [$this->toEmail],
            replyTo: [
                config('app.email_admin'),
            ],
            subject: 'HACCP SMTP OK',
        );
    }

    /**
     * Определяет шаблон письма и данные для отображения.
     * Нужен для фиксации времени и окружения при диагностике.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.technical.test-mail',
            with: [
                'sentAt' => now()->toDateTimeString(),
                'appEnv' => (string) config('app.env'),
            ]
        );
    }
}
