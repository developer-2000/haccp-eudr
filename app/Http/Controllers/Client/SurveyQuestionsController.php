<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Client\SurveySubmitRequest;
use App\Http\Requests\Client\SurveyVerifyRequest;
use App\Services\SurveyResponseService;
use Illuminate\Http\JsonResponse;

class SurveyQuestionsController extends BaseController
{
    /**
     * Принимает ответы опроса и сохраняет их в БД через сервис.
     */
    public function submitAnswersQuestions(SurveySubmitRequest $request, SurveyResponseService $surveyResponses): JsonResponse
    {
        $payload = $request->validated();

        // 1 Проверка скрытого поля и таймера для бота
        if ($this->isHoneypotTriggered($payload)) {
            return $this->getSuccessResponse(__('survey.ui.response_saved'));
        }

        $response = $surveyResponses->storeByEmail($payload, [
            'ip' => $request->ip(),
            'user_agent' => (string) $request->userAgent(),
        ]);

        return $this->getSuccessResponse('', $response);
    }

    /**
     * Верифицирует 4-значный код по токену для обновления draft-записи.
     * Принимает token и code, находит draft по токену, сверяет код.
     */
    public function verifyCode(SurveyVerifyRequest $request, SurveyResponseService $surveyResponses): JsonResponse
    {
        $response = $surveyResponses->verifyCode($request);

        return $this->getSuccessResponse('', $response);
    }

    /**
     * Используется для раннего завершения запроса без записи в БД.
     * Если проверочное поле заполнено Или таймер меньше 50 сек
     *
     * @param array<string, mixed> $payload
     */
    private function isHoneypotTriggered(array $payload): bool
    {
        // 1 Поле для бота - если заполнено
        $company = trim((string) ($payload['company'] ?? ''));
        $startedAt = (int) ($payload['hp_started_at'] ?? 0);
        $elapsed = now()->timestamp - $startedAt;

        if ($company !== '') {
            return true;
        }

        // 2 Таймер заполнения ответов для бота - либо бот либо тот кто не думает над вопросами
        $minSeconds = 30;
        if ($startedAt <= 0) {
            return false;
        }

        return $elapsed <= $minSeconds;
    }

}
