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
        private readonly string $name,
        private readonly string $email,
        private readonly ?string $company,
        private readonly string $message,
        private readonly array $userMeta,
    ) {}

    /**
     * Отправляет письмо на EMAIL_ADMIN с данными формы Contact.
     */
    public function handle(): void
    {
        $adminEmail = config('mail.admin_email');
        if (!$adminEmail) {
            return;
        }

        Mail::to($adminEmail)->send(
            new ContactAdminNotifyMail(
                $this->name,
                $this->email,
                $this->company,
                $this->message,
                $this->userMeta,
            )
        );
    }
}
