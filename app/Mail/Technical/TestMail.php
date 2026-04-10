<?php

namespace App\Mail\Technical;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TestMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    /**
     * Формирует envelope тестового письма для проверки SMTP.
     * Используется в технической цепочке отправки.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'HACCP SMTP OK'
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
