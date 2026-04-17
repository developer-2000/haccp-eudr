<?php

namespace App\Services;

use App\Listeners\Contact\SendContactAdminNotifyListener;
use App\Models\ContactMessage;
use Illuminate\Support\Facades\DB;
use Throwable;

class ContactMessageService
{
    /**
     * Сохраняет сообщение формы Contact в БД и ставит уведомление админу в очередь.
     * Rate-limit по email и защита от дублей отрабатывают как тихий skip — клиент получает
     * тот же success-ответ, что и при реальном create. Сбой БД/очереди возвращает 'error'.
     *
     * @return array{status: 'created'|'skipped'|'error'}
     */
    public function store(array $payload, array $userMeta): array
    {
        $email = $payload['email'];
        $messageText = $payload['message'];

        // Тихий skip: rate-limit по email или точный дубль уже есть в БД.
        // Запись не создаём, письмо не шлём; контроллер отдаст generic success.
        if ($this->isRateLimitedByEmail($email) || $this->isDuplicate($email, $messageText)) {
            return ['status' => 'skipped'];
        }

        try {
            DB::transaction(function () use ($payload, $userMeta) {

                // 1 Внести письмо в DB
                ContactMessage::create([
                    'name'      => $payload['name'],
                    'email'     => $payload['email'],
                    'company'   => $payload['company'] ?? null,
                    'message'   => $payload['message'],
                    'user_meta' => $userMeta,
                ]);

                // 2 Уведомить Admin о письме
                SendContactAdminNotifyListener::dispatch(
                    $payload['name'],
                    $payload['email'],
                    $payload['company'] ?? null,
                    $payload['message'],
                    $userMeta,
                );
            });
        }
        catch (Throwable $e) {
            return ['status' => 'error'];
        }

        return ['status' => 'created'];
    }

    /**
     * Проверяет, не отправлялось ли уже сообщение с этого email за последнюю минуту.
     * Защита дополняет throttle по IP: за NAT-ом под одним IP могут сидеть несколько юзеров,
     * а rate-limit по email отсекает повторные отправки конкретного адресата.
     */
    private function isRateLimitedByEmail(string $email): bool
    {
        return ContactMessage::query()
            ->where('email', $email)
            ->where('created_at', '>', now()->subMinute())
            ->exists();
    }

    /**
     * Проверяет наличие дубля: точно такой же текст сообщения от того же email уже есть в БД.
     * Защищает от двойного клика, повторных отправок и мусорного replay одной и той же формы.
     */
    private function isDuplicate(string $email, string $messageText): bool
    {
        return ContactMessage::query()
            ->where('email', $email)
            ->where('message', $messageText)
            ->exists();
    }
}
