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
        $startedAt = (int) $request->cookie('hp_started_at', 0);

        // 1 Проверка скрытого поля и таймера для бота
        if ($this->isHoneypotTriggered($payload, $startedAt)) {
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
     * Honeypot: проверяет скрытое поле company и серверный таймер из шифрованной куки.
     * $startedAt — расшифрованное значение куки hp_started_at, поставленной на GET /survey.
     *
     * @param array<string, mixed> $payload
     */
    private function isHoneypotTriggered(array $payload, int $startedAt): bool
    {
        // 1 Поле для бота - если заполнено
        $company = trim((string) ($payload['company'] ?? ''));
        if ($company !== '') {
            return true;
        }

        // 2 Куки нет (бот без cookies / прямой POST / истёк TTL) — пропускаем
        if ($startedAt <= 0) {
            return false;
        }

        // 3 Таймер: бот либо тот, кто не думает над вопросами
        $minSeconds = (int) config('site.survey.min_seconds');
        return (now()->timestamp - $startedAt) <= $minSeconds;
    }

}
