/**
 * Конфиг опроса: типы вопросов, утилиты, копирайт экранов.
 * Вопросы загружаются с API (replaceSurveyQuestionsById), здесь только типы и вспомогательные функции.
 */

/** @typedef {{ value: string, label: string, is_other?: boolean }} SurveyOptionStub */

/**
 * @typedef {{ heading: string, options: SurveyOptionStub[] }} SurveyOptionGroupStub
 */

/**
 * @typedef {Object} SurveyQuestionStub
 * @property {string} id — стабильный id (как в БД), для ответов в payload
 * @property {string} question_text
 * @property {'radio' | 'checkbox' | 'select' | 'text'} type
 * @property {string} [subtitle] — одна короткая строка-подсказка (п. 7.2), без длинных блоков.
 * @property {SurveyOptionStub[]} [options] — плоский список; при `country_iso_select` не задаётся (список стран — `SurveyCountryPicker` + `surveyCountryOptions.js`); иначе при `option_groups` см. {@link surveyQuestionAllOptions}
 * @property {SurveyOptionGroupStub[]} [option_groups] — секции UI (п. 14 опросника); варианты всё равно независимые чекбоксы
 * @property {boolean} [checkbox_allow_empty] — для `checkbox`: можно «Далее» без выбора (п. 6.8)
 * @property {string} [other_detail_field_label] — подпись над textarea для «Другое»
 * @property {Record<string, string>} [branches] — значение ответа → id следующего вопроса (ветвление)
 * @property {string} [field_caption] — подпись под заголовком (например для select: зона касания + пояснение)
 * @property {boolean} [text_multiline] — для `text`: `false` = однострочный input; по умолчанию многострочный textarea
 * @property {number} [text_rows] — для `text` + textarea: число строк (по умолчанию в UI — 4)
 * @property {boolean} [text_allow_empty] — для `text`: «Далее» без ввода (поле необязательное)
 * @property {boolean} [country_iso_select] — для `select`: варианты стран ISO alpha-2 / английские имена (п. 6.10)
 */

/** Экран контактов (аналог полей 14–17). */
export const SURVEY_PAGE_LEAD = {
    title: 'survey.lead.title',
    bullets: [
        'survey.lead.bullet_discount',
        'survey.lead.bullet_access',
        'survey.lead.bullet_influence',
    ],
    /** П. 7.3: явное ожидание перед полями (после вопросов опросника). */
    expectation: 'survey.lead.expectation',
};

/** Экран после отправки (п. 7.5: спокойно, без второго CTA в потоке). */
export const SURVEY_PAGE_SUCCESS = {
    title: 'survey.success.title',
    /** Текст после заголовка; перенос после «песочницу),» — \\n + white-space: pre-line. */
    bodyParagraphs: 'survey.success.body',
    reassurance: 'survey.success.reassurance',
    updateViaEmailHint: 'survey.success.update_hint',
};

/**
 * Живой объект вопросов: пустой до загрузки с API, заполняется через replaceSurveyQuestionsById.
 * @type {Record<string, SurveyQuestionStub>}
 */
const surveyQuestionsByIdLive = {};

/**
 * Упорядоченный массив id вопросов основной линии (без branch-потомков).
 * Формируется динамически при загрузке вопросов с API.
 * @type {string[]}
 */
let mainQuestionIds = [];

/**
 * Id всех branch-потомков (например "12_1", "12_2").
 * Формируется динамически из поля branches загруженных вопросов.
 * @type {Set<string>}
 */
let branchChildIds = new Set();

/**
 * Возвращает текущий объект вопросов.
 */
export function getSurveyQuestionsById() {
    return surveyQuestionsByIdLive;
}

/**
 * Возвращает упорядоченные id вопросов основной линии (без branch-потомков).
 * @returns {string[]}
 */
export function getSurveyMainQuestionIds() {
    return mainQuestionIds;
}

/**
 * Заменяет вопросы данными с бэкенда и пересчитывает порядок основной линии.
 * Вопросы приходят в порядке sort_order, ключ — stable_id.
 * @param {Record<string, object>} next
 */
export function replaceSurveyQuestionsById(next) {
    if (!next || typeof next !== 'object') {
        return;
    }
    if (Object.keys(next).length === 0) {
        return;
    }
    for (const k of Object.keys(surveyQuestionsByIdLive)) {
        delete surveyQuestionsByIdLive[k];
    }
    Object.assign(surveyQuestionsByIdLive, next);

    rebuildDerivedData();
}

/**
 * Пересчитывает вспомогательные структуры на основе загруженных вопросов:
 * основную линию, branch-потомков.
 */
function rebuildDerivedData() {
    const allIds = Object.keys(surveyQuestionsByIdLive);

    branchChildIds = new Set();
    for (const q of Object.values(surveyQuestionsByIdLive)) {
        if (q.branches && typeof q.branches === 'object') {
            for (const childId of Object.values(q.branches)) {
                branchChildIds.add(childId);
            }
        }
    }

    mainQuestionIds = allIds.filter((id) => !branchChildIds.has(id));
}

/**
 * Возвращает id вопроса с ветвлением (у которого есть поле branches) или null.
 * @returns {string|null}
 */
export function getSurveyBranchParentId() {
    for (const q of Object.values(surveyQuestionsByIdLive)) {
        if (q.branches && typeof q.branches === 'object' && Object.keys(q.branches).length > 0) {
            return q.id;
        }
    }
    return null;
}

/**
 * Возвращает массив id branch-потомков для очистки ответов при смене ветки.
 * @returns {string[]}
 */
export function getSurveyBranchChildIds() {
    return [...branchChildIds];
}

/**
 * Все варианты ответа вопроса: плоский `options` или объединение `option_groups`.
 * @param {SurveyQuestionStub | null | undefined} question
 * @returns {SurveyOptionStub[]}
 */
export function surveyQuestionAllOptions(question) {
    if (!question) {
        return [];
    }
    if (Array.isArray(question.option_groups) && question.option_groups.length > 0) {
        const out = [];
        for (const g of question.option_groups) {
            if (Array.isArray(g.options)) {
                out.push(...g.options);
            }
        }
        return out;
    }
    return Array.isArray(question.options) ? question.options : [];
}

/**
 * Ключ в объекте ответов для текста уточнения к варианту «Другое».
 * @param {string} questionId
 * @returns {string}
 */
export function surveyOtherDetailKey(questionId) {
    return `${questionId}__other`;
}

/**
 * Возвращает определение вопроса по id шага (или null для служебных шагов).
 * @param {string} stepId
 * @returns {SurveyQuestionStub | null}
 */
export function getSurveyQuestionByStepId(stepId) {
    return surveyQuestionsByIdLive[stepId] ?? null;
}
