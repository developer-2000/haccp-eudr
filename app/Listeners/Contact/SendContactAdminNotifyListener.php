<?php

namespace App\Listeners\Contact;

use App\Mail\Contact\ContactAdminNotifyMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

/**
 * Отправляет админу (EMAIL_ADMIN) уведомление о новом сообщении из публичной формы Contact.
 * Диспатчится из ContactMessageService::store() после записи в БД.
 */
class SendContactAdminNotifyListener implements ShouldQueue
{
    use Dispatchable;
    use Queueable;
    use InteractsWithQueue;
    use SerializesModels;

    public function __construct(
        private readonly string $userName,
        private readonly string $userEmail,
        private readonly ?string $userCompany,
        private readonly string $userMessage,
        private readonly array $userMeta,
    ) {}

    /**
     * Отправляет письмо на EMAIL_ADMIN с данными формы Contact.
     */
    public function handle(): void
    {


        Mail::send(
            new ContactAdminNotifyMail(
                $this->userName,
                $this->userEmail,
                $this->userCompany,
                $this->userMessage,
                $this->userMeta,
            )
        );
    }
}
