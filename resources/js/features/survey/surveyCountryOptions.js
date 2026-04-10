import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

const englishCountryNamesByAlpha2 = countries.getNames("en", {
    select: "official",
});

/**
 * Собирает плоский список опций вопроса «страна» с сортировкой подписей по правилам английской локали.
 * Используется один раз при загрузке модуля для экспорта {@link SURVEY_ENGLISH_COUNTRY_SELECT_OPTIONS}.
 *
 * @param {Record<string, string>} namesByAlpha2 — объект alpha-2 → официальное английское имя
 * @returns {{ value: string, label: string }[]}
 */
function buildSortedEnglishCountrySelectOptions(namesByAlpha2) {
    return Object.entries(namesByAlpha2)
        .map(([value, label]) => ({ value, label }))
        .sort((a, b) =>
            a.label.localeCompare(b.label, "en", { sensitivity: "base" }),
        );
}

/**
 * Отсортированные опции select/combobox: value = ISO 3166-1 alpha-2, label = официальное имя на английском.
 * Строится один раз при загрузке модуля (п. 6.10.3); дальнейшей пересборки при смене локали SPA нет.
 *
 * @type {ReadonlyArray<{ value: string, label: string }>}
 */
export const SURVEY_ENGLISH_COUNTRY_SELECT_OPTIONS =
    buildSortedEnglishCountrySelectOptions(englishCountryNamesByAlpha2);

/**
 * Возвращает официальные английские названия стран по коду ISO 3166-1 alpha-2.
 * Используется для подписи к сохранённому alpha-2 из БД, валидации кода и обхода по ключам без дублирования словаря.
 *
 * @returns {Record<string, string>}
 */
export function getEnglishCountryNamesByAlpha2() {
    return englishCountryNamesByAlpha2;
}

/**
 * Проверяет, что значение — код ISO 3166-1 alpha-2 из того же словаря `en` official, что и список стран в опросе.
 * Используется в `isSurveyQuestionAnswerValid` (`surveyFlow.js`) для вопросов с `country_iso_select`.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isSurveyCountryAlpha2Valid(value) {
    if (typeof value !== "string" || value === "") {
        return false;
    }
    return Object.prototype.hasOwnProperty.call(
        englishCountryNamesByAlpha2,
        value,
    );
}
