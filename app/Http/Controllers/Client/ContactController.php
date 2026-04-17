<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Client\ContactSubmitRequest;
use App\Services\ContactMessageService;
use Illuminate\Http\JsonResponse;

class ContactController extends BaseController
{
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
     * Двойной honeypot: скрытое поле hp_company и таймер hp_started_at.
     * Возвращает true, если заполнено скрытое поле (бот) или форма отправлена быстрее 5 секунд
     * с момента открытия (для человека нереальный темп заполнения). Любой из признаков → silent reject.
     */
    private function isHoneypotTriggered(array $payload): bool
    {
        // 1 Возвращает true, если заполнено скрытое поле
        $hpCompany = (string) ($payload['hp_company'] ?? '');
        if ($hpCompany !== '') {
            return true;
        }

        // 2 Возвращает true, если поле не пришло
        $startedAt = (int) ($payload['hp_started_at'] ?? 0);
        if ($startedAt <= 0) {
            return true;
        }

        // 3 Возвращает true, если заполнил письмо бот
        return (now()->timestamp - $startedAt) < 5;
    }
}
