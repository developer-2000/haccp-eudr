<?php

namespace App\Services;

use App\Concerns\LogsFormEvents;
use App\Listeners\Contact\SendContactAdminNotifyListener;
use App\Models\ContactMessage;
use Illuminate\Support\Facades\DB;
use Throwable;

class ContactMessageService
{
    use LogsFormEvents;

    /**
     * Сохраняет сообщение формы Contact в БД и ставит уведомление админу в очередь.
     * Rate-limit по email и защита от дублей отрабатывают как тихий skip — клиент получает
     * тот же success-ответ, что и при реальном create. Сбой БД/очереди возвращает 'error'.
     *
     * @return array{status: 'created'|'skipped'|'error'}
     */
    public function store(array $payload, array $userMeta): array
    {
        // Тихий skip: rate-limit по email или точный дубль уже есть в БД.
        // Запись не создаём, письмо не шлём; контроллер отдаст generic success.
        // Логирование события в Sentry выполняют сами методы-детекторы.
        if ($this->isRateLimitedByEmail($payload) || $this->isDuplicate($payload)) {
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
            report($e);
            return ['status' => 'error'];
        }

        return ['status' => 'created'];
    }

    /**
     * Проверяет, не отправлялось ли уже сообщение с этого email за последнюю минуту.
     * Защита дополняет throttle по IP: за NAT-ом под одним IP могут сидеть несколько юзеров,
     * а rate-limit по email отсекает повторные отправки конкретного адресата.
     * При срабатывании сам шлёт событие в Sentry с данными отправителя.
     */
    private function isRateLimitedByEmail(array $payload): bool
    {
        $limited = ContactMessage::query()
            ->where('email', $payload['email'])
            ->where('created_at', '>', now()->subMinute())
            ->exists();

//        if ($limited) {
//            $this->logFormEvent('Contact: rate-limit по email — за последнюю минуту уже было сообщение', $payload);
//        }

        return $limited;
    }

    /**
     * Проверяет наличие дубля: точно такой же текст сообщения от того же email уже есть в БД.
     * Защищает от двойного клика, повторных отправок и мусорного replay одной и той же формы.
     * При срабатывании сам шлёт событие в Sentry с данными отправителя.
     */
    private function isDuplicate(array $payload): bool
    {
        $duplicate = ContactMessage::query()
            ->where('email', $payload['email'])
            ->where('message', $payload['message'])
            ->exists();

//        if ($duplicate) {
//            $this->logFormEvent('Contact: точный дубль сообщения от того же email', $payload);
//        }

        return $duplicate;
    }
}
