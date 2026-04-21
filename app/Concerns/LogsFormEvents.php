<?php

namespace App\Concerns;

use Sentry\Severity;
use Sentry\State\Scope;
use function Sentry\withScope;
use function Sentry\captureMessage;

/**
 * Переиспользуемый репортер событий публичных форм в Sentry.
 * Подключается к контроллерам/сервисам обработки форм, чтобы в дашборде видеть,
 * какие случаи срабатывают (honeypot, rate-limit, дубли) и с какими данными пришёл отправитель.
 */
trait LogsFormEvents
{
    /**
     * Отправляет в Sentry info-сообщение о событии на публичной форме.
     * $message — описание случая на русском, $data — payload формы с данными отправителя.
     * Уровень info: это не ошибка, а наблюдаемое событие для дашборда.
     */
    private function logFormEvent(string $message, array $data): void
    {
        withScope(function (Scope $scope) use ($data, $message) {

            $scope->setLevel(Severity::info());

            $scope->setContext('form_data', $data);

            captureMessage($message);
        });
    }
}
