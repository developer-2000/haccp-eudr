/**
 * Упрощает строку для поиска по названию страны: NFKC, нижний регистр, снятие диакритик (NFD + combining marks).
 * Используется в combobox страны опроса (п. 6.10.5), чтобы «romania» находило «Romania», «cote» — «Côte d'Ivoire».
 *
 * @param {string} s
 * @returns {string}
 */
export function foldCountrySearchString(s) {
    return s.normalize('NFKC').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

const foldedCountryOptionsCache = new WeakMap();

/**
 * Готовит и кэширует массив стран с нормализованным label для быстрого префиксного поиска.
 * Кэш привязан к ссылке на входной массив `options`.
 *
 * @param {{ value: string, label: string }[]} options
 * @returns {Array<{ source: { value: string, label: string }, foldedLabel: string }>}
 */
function getFoldedCountryOptions(options) {
    const cached = foldedCountryOptionsCache.get(options);
    if (cached) {
        return cached;
    }
    const prepared = options.map((opt) => ({
        source: opt,
        foldedLabel: foldCountrySearchString(opt.label),
    }));
    foldedCountryOptionsCache.set(options, prepared);
    return prepared;
}

/**
 * Возвращает опции стран, у которых название с начала совпадает с запросом (после {@link foldCountrySearchString}).
 * Не ищет подстроку в середине имени — чтобы «ro» давало Romania, а не Cameroon.
 * Пустой запрос — полный список без копирования исходного массива.
 *
 * @param {{ value: string, label: string }[]} options
 * @param {string} queryRaw
 * @returns {{ value: string, label: string }[]}
 */
export function filterCountryOptionsByLabel(options, queryRaw) {
    const q = queryRaw.trim();
    if (!q) {
        return options;
    }
    const needle = foldCountrySearchString(q);
    const prepared = getFoldedCountryOptions(options);
    return prepared.filter((opt) => opt.foldedLabel.startsWith(needle)).map((opt) => opt.source);
}
