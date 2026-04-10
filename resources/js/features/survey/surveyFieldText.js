/**
 * Текст поля вопроса из API/стаба: ключи `survey.*` → vue-i18n (`window.translations`),
 * иначе строка как есть (русский стаб, легаси).
 *
 * @param {(key: string) => string} t — `useI18n().t`
 * @param {string|null|undefined} value
 * @returns {string}
 */
export function surveyFieldText(t, value) {
    if (value == null || value === "") {
        return "";
    }
    const s = String(value);
    if (s.startsWith("survey.")) {
        return t(s);
    }
    return s;
}

/**
 * Создает переводчик полей опроса, чтобы не дублировать функцию `tr(value)` по компонентам.
 * Используется там, где нужно одинаково обработать i18n-ключ `survey.*` и обычную строку.
 *
 * @param {(key: string) => string} t
 * @returns {(value: string|null|undefined) => string}
 */
export function createSurveyFieldTextTranslator(t) {
    return (value) => surveyFieldText(t, value);
}
