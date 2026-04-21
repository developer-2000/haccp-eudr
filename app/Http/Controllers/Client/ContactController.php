<?php

namespace App\Http\Controllers\Client;

use App\Concerns\LogsFormEvents;
use App\Http\Controllers\BaseController;
use App\Http\Requests\Client\ContactSubmitRequest;
use App\Services\ContactMessageService;
use Illuminate\Http\JsonResponse;

class ContactController extends BaseController
{
    use LogsFormEvents;

    /**
     * Принимает сообщение из публичной формы Contact.
     * Валидация выполняется в ContactSubmitRequest. Honeypot-проверка отсекает ботов в silent-режиме —
     * возвращает success без записи в БД, чтобы не палить детект. Сохранение делегировано
     * ContactMessageService::store(); контроллер отвечает только за приём запроса, защиту и ответ.
     */
    public function submit(ContactSubmitRequest $request, ContactMessageService $service): JsonResponse
    {
        $payload = $request->validated();

        if ($this->isHoneypotTriggered($payload)) {
            return $this->getSuccessResponse(__('contact.response_sent_ok'));
        }

        $result = $service->store($payload, [
            'locale'     => app()->getLocale(),
            'ip'         => $request->ip(),
            'user_agent' => (string) $request->userAgent(),
        ]);

        if (($result['status'] ?? null) === 'error') {
            return $this->getErrorResponse(__('contact.response_error'), [], 500);
        }

        return $this->getSuccessResponse(__('contact.response_sent_ok'));
    }

    /**
     * Двойной honeypot: скрытое поле hp_company и клиентский таймер hp_elapsed.
     * Возвращает true, если заполнено скрытое поле (бот) или форма отправлена быстрее 5 секунд
     * с момента открытия (для человека нереальный темп заполнения). Любой из признаков → silent reject.
     * hp_elapsed считается на клиенте, чтобы drift часов сервер/клиент не ломал проверку.
     */
    private function isHoneypotTriggered(array $payload): bool
    {
        $hpCompany = (string) ($payload['hp_company'] ?? '');

        // 1 Возвращает true, если заполнено скрытое поле
        if ($hpCompany !== '') {
//            $this->logFormEvent('Contact: Bot — заполнено скрытое поле hp_company', $payload);
            return true;
        }

        $elapsed = $payload['hp_elapsed'] ?? null;

        // 2 Возвращает true, если поле не пришло (клиент без JS / кривой бот)
        if ($elapsed === null) {
//            $this->logFormEvent('Contact: Bot — отсутствует hp_elapsed', $payload);
            return true;
        }

        // 3 Возвращает true, если заполнил письмо бот (меньше 5 секунд на заполнение)
        if ((int) $elapsed < 5) {
            $this->logFormEvent(
//                "Contact: Bot — форма отправлена быстрее 5 секунд (hp_elapsed={$elapsed})",
                $payload
            );
            return true;
        }

        return false;
    }

}
