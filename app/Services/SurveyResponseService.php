<?php

namespace App\Services;

use App\Listeners\Survey\SendSurveyAdminNotifyListener;
use App\Listeners\Survey\SendSurveyAnswersUpdatedListener;
use App\Listeners\Survey\SendSurveyThankYouListener;
use App\Listeners\Survey\SendSurveyVerificationCodeListener;
use App\Models\SurveyResponse;
use Illuminate\Support\Str;


class SurveyResponseService
{
    /**
     * Обрабатывает сохранение ответов опроса с ветвлением по email для антиспам-сценария.
     * Метод проверяет существующие записи пользователя, создаёт `submitted` для нового email
     * или поддерживает `draft` для повторной отправки, генерирует verification-данные и
     * возвращает статус/флаги, которые фронт использует для дальнейшего шага подтверждения.
     *
     * @param array<string, mixed> $payload Валидированный payload из SurveySubmitRequest
     * @param array{ip: string|null, user_agent: string|null} $meta Технические данные источника запроса
     * @return array{status: string, update_record: bool, attempt_counter?: int, alert?: string, verification_token?: string}
     */
    public function storeByEmail(array $payload, array $meta): array
    {
        // Подготовка данных для сохранения в DB
        $contacts = $this->extractContacts($payload);
        $answersMap = $this->extractAnswersMap($payload);
        $questionAnswers = $this->extractQuestionAnswers($payload);
        $answersForStorage = $this->buildAnswersForStorage(
            $answersMap,
            $questionAnswers,
            $meta
        );

        $email = (string) $contacts['email'];

        // Получаем все записи по email
        $records = SurveyResponse::where('email', $email)->get();

        // 1. Нет записей → создаём submitted с discount-кодом
        if ($records->isEmpty()) {
            $discountCode = $this->generateDiscountCode();

            $record = SurveyResponse::create(
                $this->buildBaseData($contacts, $answersForStorage) + [
                    'status_responses' => 'submitted',
                    'discount_code' => $discountCode,
                ]
            );

            // Client - Отправка письма при первом ответе на вопросы и код скидки
            SendSurveyThankYouListener::dispatch(
                $email,
                $discountCode,
                $contacts['name'] ?? '',
                app()->getLocale(),
            );

            // Admin - Уведомление о новом ответе
            SendSurveyAdminNotifyListener::dispatch(
                'created',
                $email,
                $contacts['name'] ?? null,
                $this->resolveCountryName($record->country),
                $record->business_type,
            );

            return [
                'status' => 'success',
                'update_record' => false,
            ];
        }

        // 2. Есть draft
        $draft = $records->firstWhere('status_responses', 'draft');

        // 2.1 Ограничение между отправка ответов 1 min
        if ($draft && $draft->updated_at->gt(now()->subMinute())) {
            return [
                'status' => 'warning',
                'update_record' => false,
                'alert' => 'cooldown',
            ];
        }

        $verification_token = $this->generateToken();
        $verification_code = $this->generateVerificationCode();

        // 2.2 Создаём или обновляем draft
        $draft = SurveyResponse::updateOrCreate(
            [
                'email' => $email,
                'status_responses' => 'draft',
            ],
            $this->buildBaseData($contacts, $answersForStorage) + [
                'attempt_counter' => 2,
                'verification_code' => $verification_code,
                'verification_token' => $verification_token,
            ]
        );

        // Client - Отправка письма 4-значный код для обновления draft-записи.
        SendSurveyVerificationCodeListener::dispatch(
            $email,
            (string) $verification_code,
            app()->getLocale(),
        );

        return [
            'status' => 'success',
            'update_record' => true,
            'attempt_counter' => $draft->attempt_counter,
            'verification_token' => $verification_token,
        ];
    }

    /**
     * Верифицирует 4-значный код по токену для обновления draft-записи.
     *
     * @param $request
     * @return array|string[]
     */
    public function verifyCode($request): array
    {
        $validated = $request->validated();

        $token = $validated['token'];
        $code = (int) $validated['code'];

        $draft = SurveyResponse::where('verification_token', $token)
            ->where('status_responses', 'draft')
            ->first();

        // 1 Если запись по `token` не найдена
        if (!$draft) {
            return $this->verifyFailedResponse(__('survey.verify.token_invalid'), 1);
        }
        // 2 Если попытки закончились
        else if ($draft->attempt_counter <= 0) {
            return $this->verifyFailedResponse(__('survey.verify.attempts_exhausted'), 2);
        }
        // 3 Если код введен неверно
        else if ($draft->verification_code !== $code) {
            $draft->decrement('attempt_counter');

            // 3.1 Если попытки закончились
            if ($draft->attempt_counter <= 0) {
                return $this->verifyFailedResponse(__('survey.verify.attempts_exhausted'), 2);
            }

            return $this->verifyFailedResponse(__('survey.verify.code_invalid'), 3);
        }

        // Переносит данные draft-записи, обновляя submitted-запись
        $this->confirmDraftVerification($draft);

        // Client - Отправка после обновления ответов
        SendSurveyAnswersUpdatedListener::dispatch(
            $draft->email,
            $draft->name ?? '',
            app()->getLocale(),
        );

        // Admin - Уведомление об обновлении ответа
        SendSurveyAdminNotifyListener::dispatch(
            'updated',
            $draft->email,
            $draft->name ?? null,
            $this->resolveCountryName($draft->country),
            $draft->business_type,
        );

        return $this->verifyFailedResponse(__('survey.verify.success'), 4, 'success');
    }

    // Генерация 4-значный код для обновления draft-записи.
    private function generateVerificationCode(): string
    {
        return (string) random_int(1000, 9999);
    }

    /**
     * Формирует ответ для Верифицирует 4-значный код по токену
     *
     * @return array
     */
    private function verifyFailedResponse(string $message, int $code = 0, string $status = 'warning'): array
    {
        return [
            'status' => $status,
            'code' => $code,
            'message' => $message,
        ];
    }

    // Генерация массива при создании новой записи
    private function buildBaseData(array $contacts, array $answers): array
    {
        return [
            'name' => $contacts['name'],
            'email' => $contacts['email'],
            'phone' => $contacts['phone'],
            'business_name' => $contacts['business_name'],
            'business_type' => $this->detectBusinessType($answers['answers_map'] ?? []),
            'country' => $this->detectCountry($answers['answers_map'] ?? []),
            'answers' => $answers,
        ];
    }

    // Генерация скидочного кода (HACCP-A7K9Q2)
    private function generateDiscountCode(): string
    {
        return 'HACCP-' . strtoupper(Str::random(10));
    }

    // Генерация токена доступа к попыткам
    private function generateToken(): string
    {
        try {
            return bin2hex(random_bytes(20));
        } catch (\Exception $e) {
            return Str::random(20);
        }
    }

    /**
     * Возвращает блок контактов в нормализованном виде.
     *
     * @param array<string, mixed> $payload
     * @return array{name: ?string, email: string, business_name: ?string, phone: ?string, whatsapp: ?string, telegram: ?string}
     */
    private function extractContacts(array $payload): array
    {
        $contacts = is_array($payload['contacts'] ?? null) ? $payload['contacts'] : [];

        return [
            'name' => $this->nullableString($contacts['name'] ?? null),
            'email' => (string) ($contacts['email'] ?? ''),
            'business_name' => $this->nullableString($contacts['business_name'] ?? null),
            'phone' => $this->nullableString($contacts['phone'] ?? null),
            'whatsapp' => $this->nullableString($contacts['whatsapp'] ?? null),
            'telegram' => $this->nullableString($contacts['telegram'] ?? null),
        ];
    }

    /**
     * Возвращает плоский объект ответов questionId -> value / value[].
     *
     * @param array<string, mixed> $payload
     * @return array<string, mixed>
     */
    private function extractAnswersMap(array $payload): array
    {
        return is_array($payload['answers'] ?? null) ? $payload['answers'] : [];
    }

    /**
     * Возвращает массив ответов с явной привязкой к id вопроса.
     *
     * @param array<string, mixed> $payload
     * @return array<int, array{id: string, value: mixed, other: ?string}>
     */
    private function extractQuestionAnswers(array $payload): array
    {
        $rows = is_array($payload['question_answers'] ?? null)
            ? $payload['question_answers']
            : [];

        $out = [];
        foreach ($rows as $row) {
            if (!is_array($row) || !isset($row['id'])) {
                continue;
            }
            $out[] = [
                'id' => (string) $row['id'],
                'value' => $row['value'] ?? null,
                'other' => $this->nullableString($row['other'] ?? null),
            ];
        }

        return $out;
    }

    /**
     * Формирует JSON-структуру хранения ответов с техническим контекстом.
     * Это делает запись в БД самодостаточной: видно что ответил пользователь и откуда пришёл запрос.
     *
     * @param array<string, mixed> $answersMap
     * @param array<int, array{id: string, value: mixed, other: ?string}> $questionAnswers
     * @param array{ip: string|null, user_agent: string|null} $meta
     * @return array<string, mixed>
     */
    private function buildAnswersForStorage(array $answersMap, array $questionAnswers, array $meta): array
    {
        return [
            'answers_map' => $answersMap,
            'question_answers' => $questionAnswers,
            'meta' => [
                'source' => 'client_survey_page',
                'ip' => $this->nullableString($meta['ip'] ?? null),
                'user_agent' => $this->nullableString($meta['user_agent'] ?? null),
                'submitted_at' => now()->toIso8601String(),
            ],
        ];
    }

    /**
     * Определяет тип бизнеса из ответа на вопрос 1.
     *
     * @param array<string, mixed> $answersMap
     */
    private function detectBusinessType(array $answersMap): ?string
    {
        return $this->nullableString($answersMap['1'] ?? null);
    }

    /**
     * Определяет страну по коду ISO alpha-2 из ответа на вопрос 3.
     *
     * @param array<string, mixed> $answersMap
     */
    private function detectCountry(array $answersMap): ?string
    {
        $raw = $this->nullableString($answersMap['3'] ?? null);
        if ($raw === null) {
            return null;
        }

        return mb_strtoupper($raw);
    }

    /**
     * Переносит данные draft-записи, обновляя submitted-запись
     *
     * @param SurveyResponse $draft
     */
    private function confirmDraftVerification(SurveyResponse $draft): void
    {
        $submitted = SurveyResponse::where('email', $draft->email)
            ->where('status_responses', 'submitted')
            ->first();

        if ($submitted) {
            $submitted->update([
                'name' => $draft->name,
                'phone' => $draft->phone,
                'business_name' => $draft->business_name,
                'business_type' => $draft->business_type,
                'country' => $draft->country,
                'answers' => $draft->answers,
            ]);
        }
    }

    /**
     * Конвертирует ISO alpha-2 код страны в английское название.
     * Читает данные из npm-пакета i18n-iso-countries (тот же источник, что на фронте).
     */
    private function resolveCountryName(?string $code): ?string
    {
        if (!$code) {
            return null;
        }

        $code = mb_strtoupper($code);
        $jsonPath = base_path('node_modules/i18n-iso-countries/langs/en.json');

        if (!file_exists($jsonPath)) {
            return $code;
        }

        $data = json_decode(file_get_contents($jsonPath), true);
        $countries = $data['countries'] ?? [];

        if (isset($countries[$code])) {
            $name = $countries[$code];
            return is_array($name) ? $name[0] : $name;
        }

        return $code;
    }

    /**
     * Приводит значение к строке или null для единообразного хранения.
     */
    private function nullableString(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }
        $text = trim((string) $value);

        return $text === '' ? null : $text;
    }

}

