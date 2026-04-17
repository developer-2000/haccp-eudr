<?php

namespace App\Mail\Contact;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Письмо админу о новом сообщении из публичной формы Contact.
 * Диспатчится из SendContactAdminNotifyListener после записи в БД.
 */
class ContactAdminNotifyMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        private readonly string $name,
        private readonly string $email,
        private readonly ?string $company,
        private readonly string $message,
        private readonly array $userMeta,
    ) {}

    /**
     * Формирует тему письма с email отправителя для удобной фильтрации в почтовом ящике админа.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '[' . config('app.name') . '] ' . __('contact.admin_subject', ['email' => $this->email]),
        );
    }

    /**
     * Передаёт в blade данные отправителя и технический срез (locale/ip/user_agent из user_meta).
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.contact.admin-notify',
            with: [
                'name'        => $this->name,
                'email'       => $this->email,
                'company'     => $this->company ?? '—',
                'messageText' => $this->message,
                'locale'      => $this->userMeta['locale'] ?? '—',
                'ip'          => $this->userMeta['ip'] ?? '—',
                'userAgent'   => $this->userMeta['user_agent'] ?? '—',
            ],
        );
    }
}
