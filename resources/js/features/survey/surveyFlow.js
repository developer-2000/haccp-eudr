import { isSurveyCountryAlpha2Valid } from './surveyCountryOptions.js';
import {
    getSurveyQuestionsById,
    getSurveyMainQuestionIds,
    getSurveyBranchParentId,
    getSurveyBranchChildIds,
    surveyOtherDetailKey,
    surveyQuestionAllOptions,
} from './surveyQuestionsStub.js';

const LEAD_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

/** Служебный шаг: вступление. */
export const SURVEY_FLOW_STEP_INTRO = 'intro';

/** Служебный шаг: контакты. */
export const SURVEY_FLOW_STEP_LEAD = 'lead';

/** Служебный шаг: завершение. */
export const SURVEY_FLOW_STEP_SUCCESS = 'success';

/** Показ 4 значного цифрового блока верификации кода. */
export const SURVEY_DIGITAL_CODE_VERIFICATION = 'digital_code';

/**
 * Пауза перед автопереходом после одиночного выбора (radio), мс.
 */
export const SURVEY_RADIO_AUTO_ADVANCE_MS = 280;

/**
 * Возвращает id вопроса-родителя ветвления из загруженных данных.
 * Используется в Survey.vue для watcher'а смены ветки.
 * @returns {string|null}
 */
export { getSurveyBranchParentId as SURVEY_BRANCH_PARENT_ID_FN };

/**
 * Вычисляет общее число шагов для прогресс-бара на основе загруженных вопросов.
 * intro + основные вопросы + 1 слот ветки + lead + verification.
 * @returns {number}
 */
export function getSurveyProgressTotal() {
    return getSurveyMainQuestionIds().length + 4;
}

/**
 * По ответу на вопрос с ветвлением возвращает id следующего вопроса ветки.
 * @param {Record<string, unknown>} answers
 * @returns {string|null}
 */
export function resolveBranchStepId(answers) {
    const branchParentId = getSurveyBranchParentId();
    if (!branchParentId) {
        return null;
    }
    const parent = getSurveyQuestionsById()[branchParentId];
    const value = answers[branchParentId];
    if (!parent?.branches || value == null || value === '') {
        return null;
    }
    const nextId = parent.branches[value];
    return typeof nextId === 'string' ? nextId : null;
}

/**
 * Собирает упорядоченный список id экранов на основе загруженных вопросов.
 * @param {boolean} surveySubmitted
 * @param {Record<string, unknown>} answers
 * @returns {string[]}
 */
export function buildVisibleSurveyStepIds(surveySubmitted, answers) {
    if (surveySubmitted) {
        return [SURVEY_FLOW_STEP_SUCCESS];
    }

    const mainIds = getSurveyMainQuestionIds();
    const branchParentId = getSurveyBranchParentId();

    if (!branchParentId) {
        return [
            SURVEY_FLOW_STEP_INTRO,
            ...mainIds,
            SURVEY_FLOW_STEP_LEAD,
            SURVEY_DIGITAL_CODE_VERIFICATION,
        ];
    }

    const parentIdx = mainIds.indexOf(branchParentId);
    const beforeBranch = mainIds.slice(0, parentIdx + 1);
    const afterBranch = mainIds.slice(parentIdx + 1);

    const branch = resolveBranchStepId(answers);
    if (!branch) {
        return [SURVEY_FLOW_STEP_INTRO, ...beforeBranch, SURVEY_DIGITAL_CODE_VERIFICATION];
    }

    return [
        SURVEY_FLOW_STEP_INTRO,
        ...beforeBranch,
        branch,
        ...afterBranch,
        SURVEY_FLOW_STEP_LEAD,
        SURVEY_DIGITAL_CODE_VERIFICATION,
    ];
}

/**
 * Удаляет ответы по всем branch-потомкам после смены ответа на вопрос с ветвлением.
 * @param {Record<string, unknown>} answers
 */
export function clearBranchDerivedAnswers(answers) {
    for (const id of getSurveyBranchChildIds()) {
        delete answers[id];
        delete answers[surveyOtherDetailKey(id)];
    }
}

/**
 * Проверяет, заполнен ли ответ по правилам типа (включая обязательное уточнение для «Другое»).
 * @param {import('./surveyQuestionsStub.js').SurveyQuestionStub | null} question
 * @param {Record<string, unknown>} answers
 * @returns {boolean}
 */
export function isSurveyQuestionAnswerValid(question, answers) {
    // Проверяем, можно ли идти дальше по текущему ответу.
    const id = question.id;
    // Для текстового вопроса: если поле можно пропустить — сразу ок.
    if (question.type === 'text') {
        if (question.text_allow_empty) {
            return true;
        }
        // Если текст обязателен — проверяем, что пользователь что-то ввёл.
        const raw = answers[id];
        return typeof raw === 'string' && raw.trim().length > 0;
    }
    // Для выбора страны проверяем, что код страны выглядит валидно.
    if (question.type === 'select' && question.country_iso_select) {
        return isSurveyCountryAlpha2Valid(answers[id]);
    }
    // Если вариантов ответа нет — шаг нельзя считать заполненным.
    const opts = surveyQuestionAllOptions(question);
    if (!opts.length) {
        return false;
    }
    // Для radio/select нужен один выбранный валидный вариант.
    if (question.type === 'radio' || question.type === 'select') {
        const value = answers[id];
        // Ничего не выбрано — нельзя идти дальше.
        if (value == null || value === '') {
            return false;
        }
        const opt = opts.find((o) => o.value === value);
        // Выбран пункт, которого нет в списке — считаем ответ невалидным.
        if (!opt) {
            return false;
        }
        // Если выбрано "Другое", просим обязательно заполнить уточнение.
        if (opt.is_other) {
            const detail = answers[surveyOtherDetailKey(id)];
            return typeof detail === 'string' && detail.trim().length > 0;
        }
        // Обычный выбранный вариант — этого достаточно.
        return true;
    }
    // Для чекбоксов смотрим массив выбранных пунктов.
    if (question.type === 'checkbox') {
        const arr = answers[id];
        const list = Array.isArray(arr) ? arr : [];
        // Если у вопроса разрешён пустой выбор — пустой список принимаем.
        if (question.checkbox_allow_empty && list.length === 0) {
            return true;
        }
        // Если выбрать нужно хотя бы что-то, пустой список не принимаем.
        if (list.length === 0) {
            return false;
        }
        // Проверяем, выбрали ли пункт "Другое".
        const hasOther = list.some((v) => {
            const opt = opts.find((o) => o.value === v);
            return opt?.is_other === true;
        });
        // Для "Другое" текст уточнения обязателен.
        if (hasOther) {
            const detail = answers[surveyOtherDetailKey(id)];
            return typeof detail === 'string' && detail.trim().length > 0;
        }
        // Если всё выше прошло — ответ валиден.
        return true;
    }
    // Для неизвестного типа вопроса безопасно возвращаем невалидно.
    return false;
}

/**
 * Для radio: можно ли после выбора автоматически перейти дальше (не «Другое» и не пусто).
 * @param {import('./surveyQuestionsStub.js').SurveyQuestionStub | null} question
 * @param {string} selectedValue
 * @returns {boolean}
 */
export function surveyRadioAllowsAutoAdvance(question, selectedValue) {
    // Автопереход разрешаем только для обычного radio-выбора.
    if (question?.type !== 'radio') {
        return false;
    }
    if (selectedValue == null || selectedValue === '') {
        return false;
    }
    const opt = surveyQuestionAllOptions(question).find((o) => o.value === selectedValue);
    return !opt?.is_other;
}

/**
 * Нужна ли явная кнопка «Далее» (мультивыбор, select, свободный текст).
 * @param {import('./surveyQuestionsStub.js').SurveyQuestionStub | null} question
 * @returns {boolean}
 */
export function surveyQuestionUsesNextButton(question) {
    // Для этих типов показываем кнопку "Далее".
    if (!question) {
        return false;
    }
    return question.type === 'checkbox' || question.type === 'select' || question.type === 'text';
}

/**
 * Текст ошибки для поля email на экране lead (п. 6.3) или пустая строка, если значение допустимо.
 * @param {unknown} raw
 * @returns {string}
 */
export function surveyLeadEmailErrorMessage(raw) {
    // Отдаем ключ понятной ошибки, если email пустой или кривой.
    const s = String(raw ?? '').trim();
    if (!s) {
        return 'survey.validation.email_required';
    }
    if (!LEAD_EMAIL_RE.test(s)) {
        return 'survey.validation.email_invalid';
    }
    return '';
}

/**
 * Маскирует email для безопасного вывода в UI без передачи исходного значения.
 * Используется в post-submit экране и связанных подсказках.
 * @param {string} email
 * @returns {string}
 */
export function maskSurveyEmail(email) {
    // Прячем середину email, оставляя только минимально полезный хвост.
    const normalizedEmail = String(email ?? '')
        .trim()
        .toLowerCase();
    const atIndex = normalizedEmail.indexOf('@');
    // Если email кривой или неполный, безопасно возвращаем заглушку.
    if (atIndex <= 0 || atIndex === normalizedEmail.length - 1) {
        return '***';
    }
    const localPart = normalizedEmail.slice(0, atIndex);
    const domainPart = normalizedEmail.slice(atIndex + 1);
    const dotIndex = domainPart.lastIndexOf('.');
    // Если в домене нет нормальной зоны (типа .com), тоже отдаём заглушку.
    if (dotIndex <= 0 || dotIndex === domainPart.length - 1) {
        return '***';
    }
    const domainName = domainPart.slice(0, dotIndex);
    const domainZone = domainPart.slice(dotIndex + 1);
    // Оставляем куски, по которым человек узнает свой email, но полный адрес не виден.
    const localPrefix = localPart.slice(0, Math.min(3, localPart.length));
    const domainTail = domainName.slice(Math.max(0, domainName.length - 3));
    const zoneHead = domainZone;
    return `${localPrefix}*******${domainTail}.${zoneHead}`;
}
