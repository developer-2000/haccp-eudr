<?php

namespace App\Mail\Contact;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Письмо Админу о новом сообщении из публичной формы Contact.
 * Диспатчится из SendContactAdminNotifyListener после записи в БД.
 */
class ContactAdminNotifyMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        private readonly string $userName,
        private readonly string $userEmail,
        private readonly ?string $userCompany,
        private readonly string $userMessage,
        private readonly array $userMeta,
    ) {}

    /**
     * Envelope админу: from = наш адрес (SPF/DKIM/DMARC alignment), reply-to = email пользователя.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(
                config('mail.from.address'),
                config('app.name') // вот здесь HACCPilot
            ),
            to: [config('mail.admin_email')],
            replyTo: [],
            subject: '[' . config('app.name') . '] ' . __('contact.admin_subject', [
                'email' => $this->userEmail,
            ]),
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
                'name'        => $this->userName,
                'email'       => $this->userEmail,
                'company'     => $this->userCompany ?? '—',
                'messageText' => $this->userMessage,
                'locale'      => $this->userMeta['locale'] ?? '—',
                'ip'          => $this->userMeta['ip'] ?? '—',
                'userAgent'   => $this->userMeta['user_agent'] ?? '—',
            ],
        );
    }
}
