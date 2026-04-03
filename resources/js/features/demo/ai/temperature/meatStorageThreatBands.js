/**
 * Справочник полос хранения мяса.
 *
 * Контракт (без mode — только факт °C):
 * - `MEAT_STORAGE_CHILLED_BANDS` — **t ≥ 0 °C** (охлаждённое / холодильник).
 * - `MEAT_STORAGE_FREEZER_BANDS` — **t < 0 °C** (заморозка).
 *
 * Параметр `mode` в resolveMeatStorageBand сохранён для совместимости вызовов; на выбор полосы не влияет.
 * Числовые пороги — в MEAT_STORAGE_TEMP.
 */

export const MEAT_STORAGE_TEMP = Object.freeze({
    chilled: Object.freeze({
        salmonella: 8,
        dangerZone: 5,
        fridgeMeat: 2,
        /** Граница: ≥0 → chilled-таблица, <0 → freezer-таблица */
        juicesFreeze: 0,
    }),
    freezer: Object.freeze({
        surfaceOk: -12,
        standard: -18,
        burn: -25,
    }),
});

const C = MEAT_STORAGE_TEMP.chilled;
const F = MEAT_STORAGE_TEMP.freezer;

/** t ≥ 0 °C. `status`: critical | warning | normal. */
export const MEAT_STORAGE_CHILLED_BANDS = Object.freeze([
    Object.freeze({
        id: "chilled_gt_8",
        temperatureLabel: "> +8°C (свежее мясо)",
        status: "critical",
        threat: "Кишечные палочки и сальмонелла размножаются быстро",
        action: "Мясо портится, утилизация немедленно",
    }),
    Object.freeze({
        id: "chilled_5_8",
        temperatureLabel: "+5…+7°C",
        status: "warning",
        threat: "Начало «опасной зоны» — бактерии просыпаются",
        action: "2-4 часа. Срочно охладить ниже +5°C",
    }),
    Object.freeze({
        id: "chilled_2_5",
        temperatureLabel: "+2…+4°C",
        status: "normal",
        threat: "Всё ок для холодильника",
        action: "Для свежее/нарезанное мясо. Хранение до 5 дней",
    }),
    Object.freeze({
        id: "chilled_0_2",
        temperatureLabel: "0…+1°C",
        status: "normal",
        threat: "В пределах охлаждённого хранения",
        action: "Для фарш/мясной полуфабрикат. Хранение 2-3 дня",
    }),
]);

/** t < 0 °C. */
export const MEAT_STORAGE_FREEZER_BANDS = Object.freeze([
    Object.freeze({
        id: "freezer_gt_m12",
        temperatureLabel: "> −11…-1°C (выше нормы заморозки)",
        status: "warning",
        threat: "Слишком тепло для заморозки — мясо НЕ заморожено",
        action: "Записать отклонение",
    }),
    Object.freeze({
        id: "freezer_m12_m18",
        temperatureLabel: "−12…−18°C",
        status: "normal",
        threat: "Стандарт заморозки мяса",
        action: "Говядина 6-12 месяцев, свинина 4-6 месяцев",
    }),
    Object.freeze({
        id: "freezer_m25_m18",
        temperatureLabel: "−19°…−25C",
        status: "normal",
        threat: "Премиум условия хранения",
        action: "Говядина до 18 месяцев, свинина до 12 месяцев",
    }),
    Object.freeze({
        id: "freezer_lt_m25",
        temperatureLabel: "< −26°C",
        status: "warning",
        threat: "Переохлаждение — мясо сохнет",
        action: "Поднять до −18°C для хранения",
    }),
]);

const CHILLED_I = Object.freeze({
    gt8: 0,
    open5_8: 1,
    closed2_5: 2,
    closed0_2: 3,
});

const FREEZER_I = Object.freeze({
    gtM12: 0,
    m12_m18: 1,
    m25_m18: 2,
    ltM25: 3,
});

/**
 * @param {number} t
 * @returns {Readonly<typeof MEAT_STORAGE_CHILLED_BANDS[number]> | null}
 */
function pickChilledBand(t) {
    if (t > C.salmonella) {
        return MEAT_STORAGE_CHILLED_BANDS[CHILLED_I.gt8];
    }
    if (t > C.dangerZone && t <= C.salmonella) {
        return MEAT_STORAGE_CHILLED_BANDS[CHILLED_I.open5_8];
    }
    if (t >= C.fridgeMeat && t <= C.dangerZone) {
        return MEAT_STORAGE_CHILLED_BANDS[CHILLED_I.closed2_5];
    }
    if (t >= C.juicesFreeze && t < C.fridgeMeat) {
        return MEAT_STORAGE_CHILLED_BANDS[CHILLED_I.closed0_2];
    }
    return null;
}

/**
 * @param {number} t
 * @returns {Readonly<typeof MEAT_STORAGE_FREEZER_BANDS[number]> | null}
 */
function pickFreezerBand(t) {
    if (t > F.surfaceOk) {
        return MEAT_STORAGE_FREEZER_BANDS[FREEZER_I.gtM12];
    }
    if (t >= F.standard && t <= F.surfaceOk) {
        return MEAT_STORAGE_FREEZER_BANDS[FREEZER_I.m12_m18];
    }
    if (t >= F.burn && t < F.standard) {
        return MEAT_STORAGE_FREEZER_BANDS[FREEZER_I.m25_m18];
    }
    if (t < F.burn) {
        return MEAT_STORAGE_FREEZER_BANDS[FREEZER_I.ltM25];
    }
    return null;
}

/**
 * @param {number} t — температура °C
 * @param {string|null|undefined} _mode — не используется; см. контракт в шапке файла
 * @returns {Readonly<typeof MEAT_STORAGE_CHILLED_BANDS[number]> | Readonly<typeof MEAT_STORAGE_FREEZER_BANDS[number]> | null}
 */
export function resolveMeatStorageBand(t, _mode) {
    void _mode;
    if (t >= C.juicesFreeze) {
        return pickChilledBand(t);
    }
    return pickFreezerBand(t);
}

/**
 * @param {number} t
 * @param {string|null|undefined} mode
 * @returns {string|null}
 */
export function resolveMeatStorageThreat(t, mode) {
    const band = resolveMeatStorageBand(t, mode);
    return band ? band.threat : null;
}
