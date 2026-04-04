/**
 * Справочник полос хранения мяса.
 *
 * Контракт:
 * - `MEAT_STORAGE_CHILLED_BANDS` — **t ≥ 0 °C** (охлаждённое).
 * - `MEAT_STORAGE_FREEZER_BANDS` — **t < 0 °C** (заморозка).
 * - У каждой полосы **`equipmentTargetIds`** — `eq-meat-*` из **`EQUIPMENT_GROUPS`** (`config/tasks.js`).
 * - В задаче **нет** `eq-meat-*` → одна шкала **`DEFAULT_MEAT_AI_PROFILE_FALLBACK`** (−40…+20 °C без зазоров), как у хлеба без `eq-bread-*`.
 * - «Режим» chilled | freezer для AI — по оборудованию задачи (`taskTemperatureAiContext`), если есть мясное оборудование.
 *
 * При наличии `eq-meat-*` параметр **`mode`**: `freezer` → только полосы заморозки (0 °C в морозилке = «слишком тепло»);
 * `chilled` → при t ≥ 0 °C — охлаждённое, при t &lt; 0 °C — шкала заморозки. Без режима — по-старому только по знаку t (≥0 chilled, &lt;0 freezer).
 * Числовые пороги — в `MEAT_STORAGE_TEMP`.
 */

// ═══════════════════════════════════════════════════════════════════════════
// Оборудование мясного цеха (id для `task.equipmentTargetIds`; см. `EQUIPMENT_GROUPS` в `tasks.js`)
// ═══════════════════════════════════════════════════════════════════════════

/** Охлаждённое хранение (+0…+8 °C). */
export const MEAT_CHILLED_EQUIPMENT_IDS = Object.freeze([
    "eq-meat-chilled-room",
    "eq-meat-chilled-cabinet",
    "eq-meat-chilled-display",
    "eq-meat-chilled-semi-finished",
]);

/** Заморозка (< 0 °C). */
export const MEAT_FREEZER_EQUIPMENT_IDS = Object.freeze([
    "eq-meat-freezer-room",
    "eq-meat-shock-freezer",
    "eq-meat-freezer-cabinet",
    "eq-meat-deep-freezer",
]);

// ═══════════════════════════════════════════════════════════════════════════
// Пороги °C по типам хранения (см. полосы ниже)
// ═══════════════════════════════════════════════════════════════════════════

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

/**
 * Строка из `DEFAULT_MEAT_AI_PROFILE_FALLBACK` по °C, если в задаче нет `eq-meat-*`.
 *
 * @param {number} t
 * @returns {Readonly<(typeof DEFAULT_MEAT_AI_PROFILE_FALLBACK)[number]> | null}
 */
export function pickDefaultMeatNoEquipmentBand(t) {
    if (!Number.isFinite(t)) {
        return null;
    }
    const rows = DEFAULT_MEAT_AI_PROFILE_FALLBACK;
    if (t < -25) {
        return rows[0];
    }
    if (t <= -12) {
        return rows[1];
    }
    if (t <= -1) {
        return rows[2];
    }
    if (t <= 1) {
        return rows[3];
    }
    if (t <= 4) {
        return rows[4];
    }
    if (t <= 8) {
        return rows[5];
    }
    return rows[6];
}

// ═══════════════════════════════════════════════════════════════════════════
// Данные: окна CCP и наклон риска для `TemperatureAiAnalyzer` (chilled | freezer)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Окна CCP и наклон риска для `TemperatureAiAnalyzer` (режимы `chilled` | `freezer`).
 * Тексты угроз/действий в UI — только из полос ниже, не отсюда.
 */
export const MEAT_MODE_ANALYZER_PROFILES = Object.freeze({
    chilled: Object.freeze({
        ccpMin: 0,
        ccpMax: 2,
        ccpLabel: "0..2°C (охлажденное мясо, HACCP EU minced meat)",
        riskSlope: 20,
    }),
    freezer: Object.freeze({
        ccpMin: -24,
        ccpMax: -18,
        ccpLabel: "-24..-18°C (морозильник, EU окно хранения)",
        riskSlope: 16,
    }),
});

// ═══════════════════════════════════════════════════════════════════════════
// Полосы: охлаждённое хранение (t ≥ 0 °C)
// ═══════════════════════════════════════════════════════════════════════════

/** Охлаждённое хранение */
export const MEAT_STORAGE_CHILLED_BANDS = Object.freeze([
    Object.freeze({
        id: "chilled_gt_8",
        temperatureLabel: "> +8°C (свежее мясо)",
        status: "critical",
        threat: "Кишечные палочки и сальмонелла размножаются быстро",
        action: "Мясо портится, утилизация немедленно",
        equipmentTargetIds: MEAT_CHILLED_EQUIPMENT_IDS,
    }),
    Object.freeze({
        id: "chilled_5_8",
        temperatureLabel: "+5…+8°C",
        status: "warning",
        threat: "Начало «опасной зоны» — бактерии просыпаются",
        action: "2-4 часа. Срочно охладить ниже +5°C",
        equipmentTargetIds: MEAT_CHILLED_EQUIPMENT_IDS,
    }),
    Object.freeze({
        id: "chilled_2_5",
        temperatureLabel: "+2…+4°C",
        status: "normal",
        threat: "Холодильник в норме",
        action: "Для свежее/нарезанное мясо. Хранение до 5 дней",
        equipmentTargetIds: MEAT_CHILLED_EQUIPMENT_IDS,
    }),
    Object.freeze({
        id: "chilled_0_2",
        temperatureLabel: "0…+1°C",
        status: "normal",
        threat: "В пределах охлаждённого хранения",
        action: "Для фарш/мясной полуфабрикат. Хранение 2-3 дня",
        equipmentTargetIds: MEAT_CHILLED_EQUIPMENT_IDS,
    }),
]);

// ═══════════════════════════════════════════════════════════════════════════
// Полосы: заморозка (t < 0 °C)
// ═══════════════════════════════════════════════════════════════════════════

/** Заморозка */
export const MEAT_STORAGE_FREEZER_BANDS = Object.freeze([
    Object.freeze({
        id: "freezer_gt_m12",
        temperatureLabel: "> -1…−11°C (выше нормы заморозки)",
        status: "warning",
        threat: "Слишком тепло для заморозки — мясо НЕ заморожено",
        action: "Записать отклонение",
        equipmentTargetIds: MEAT_FREEZER_EQUIPMENT_IDS,
    }),
    Object.freeze({
        id: "freezer_m12_m18",
        temperatureLabel: "−12…−18°C",
        status: "normal",
        threat: "Стандарт заморозки мяса",
        action: "Говядина 6-12 месяцев, свинина 4-6 месяцев",
        equipmentTargetIds: MEAT_FREEZER_EQUIPMENT_IDS,
    }),
    Object.freeze({
        id: "freezer_m25_m18",
        temperatureLabel: "−19°…−25C",
        status: "normal",
        threat: "Премиум условия хранения",
        action: "Говядина до 18 месяцев, свинина до 12 месяцев",
        equipmentTargetIds: MEAT_FREEZER_EQUIPMENT_IDS,
    }),
    Object.freeze({
        id: "freezer_lt_m25",
        temperatureLabel: "< −26°C",
        status: "warning",
        threat: "Переохлаждение — мясо сохнет",
        action: "Поднять до −18°C для хранения",
        equipmentTargetIds: MEAT_FREEZER_EQUIPMENT_IDS,
    }),
]);

// ═══════════════════════════════════════════════════════════════════════════
// Default: полный диапазон без привязки к оборудованию (нет `eq-meat-*` в задаче)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default массив температур
 */
export const DEFAULT_MEAT_AI_PROFILE_FALLBACK = Object.freeze([
    Object.freeze({
        id: "meat_deep_freeze_lt_m25",
        processLabel: "Заморозка",
        temperatureLabel: "< −25°C",
        status: "warning",
        threat: "Переохлаждение — мясо сохнет, теряет вес",
        action: "Поднять температуру до −18°C",
    }),
    Object.freeze({
        id: "meat_freeze_m25_m12",
        processLabel: "Заморозка",
        temperatureLabel: "−25…−12°C",
        status: "normal",
        threat: "Правильная заморозка мяса",
        action: "Говядина 6-18 месяцев, свинина 4-12 месяцев",
    }),
    Object.freeze({
        id: "meat_superchilled_m11_0",
        processLabel: "Переохлаждение",
        temperatureLabel: "−11…−1°C",
        status: "warning",
        threat: "Мясо размягчается — не полноценная заморозка",
        action: "Охладить ниже −18°C или разморозить",
    }),
    Object.freeze({
        id: "meat_chilled_0_1",
        processLabel: "Охлаждение",
        temperatureLabel: "0…+1°C",
        status: "normal",
        threat: "Идеально для фарша и полуфабрикатов",
        action: "Хранение 2-3 дня",
    }),
    Object.freeze({
        id: "meat_chilled_2_4",
        processLabel: "Охлаждение",
        temperatureLabel: "+2…+4°C",
        status: "normal",
        threat: "Стандарт холодильника для мяса",
        action: "Свежее/нарезанное мясо — до 5 дней",
    }),
    Object.freeze({
        id: "meat_danger_5_8",
        processLabel: "Охлаждение",
        temperatureLabel: "+5…+8°C",
        status: "warning",
        threat: "Бактерии начинают размножаться",
        action: "Максимум 2-4 часа. Срочно охладить ниже +4°C",
    }),
    Object.freeze({
        id: "meat_critical_gt_8",
        processLabel: "Охлаждение",
        temperatureLabel: "> +8°C",
        status: "critical",
        threat: "Сальмонелла и кишечная палочка размножаются быстро",
        action: "Утилизировать немедленно",
    }),
]);

// ═══════════════════════════════════════════════════════════════════════════
// Внутренние индексы и функции pick* (для `resolveMeatStorageBand`)
// ═══════════════════════════════════════════════════════════════════════════

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
 * @param {string|null|undefined} mode
 * @returns {'freezer'|'chilled'|null}
 */
function normalizeMeatStorageMode(mode) {
    const m = String(mode ?? "").trim().toLowerCase();
    if (m === "freezer" || m === "chilled") {
        return m;
    }
    return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// Оборудование задачи и сопоставление с полосой
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @param {readonly string[]|null|undefined} taskEquipmentTargetIds
 * @returns {boolean}
 */
export function taskHasMeatEquipment(taskEquipmentTargetIds) {
    const ids = Array.isArray(taskEquipmentTargetIds) ? taskEquipmentTargetIds : [];
    return ids.some((id) => String(id).startsWith("eq-meat-"));
}

/**
 * @param {Readonly<{ equipmentTargetIds?: readonly string[] }>|null|undefined} band
 * @param {readonly string[]|null|undefined} taskEquipmentTargetIds
 * @returns {boolean}
 */
export function meatBandMatchesTaskEquipment(band, taskEquipmentTargetIds) {
    if (!taskHasMeatEquipment(taskEquipmentTargetIds)) {
        return true;
    }
    if (!band?.equipmentTargetIds?.length) {
        return true;
    }
    const ids = Array.isArray(taskEquipmentTargetIds) ? taskEquipmentTargetIds : [];
    if (!ids.length) {
        return true;
    }
    return band.equipmentTargetIds.some((id) => ids.includes(id));
}

// ═══════════════════════════════════════════════════════════════════════════
// Экспорт: выбор полосы и текст угрозы
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @param {number} t — температура °C
 * @param {string|null|undefined} mode — `freezer` | `chilled` (см. шапку файла)
 * @returns {Readonly<typeof MEAT_STORAGE_CHILLED_BANDS[number]> | Readonly<typeof MEAT_STORAGE_FREEZER_BANDS[number]> | null}
 */
export function resolveMeatStorageBand(t, mode) {
    if (!Number.isFinite(t)) {
        return null;
    }
    const m = normalizeMeatStorageMode(mode);
    if (m === "freezer") {
        return pickFreezerBand(t);
    }
    if (m === "chilled") {
        if (t >= C.juicesFreeze) {
            return pickChilledBand(t);
        }
        return pickFreezerBand(t);
    }
    if (t >= C.juicesFreeze) {
        return pickChilledBand(t);
    }
    return pickFreezerBand(t);
}

/**
 * Замер °C: есть `eq-meat-*` → полосы хранения (`resolveMeatStorageBand`); нет → `DEFAULT_MEAT_AI_PROFILE_FALLBACK`.
 *
 * @param {number} t
 * @param {readonly string[]|null|undefined} taskEquipmentTargetIds
 * @param {string|null|undefined} mode — учитывается только при наличии мясного оборудования
 * @returns {Readonly<object>|null}
 */
export function resolveMeatRowForTaskMeasurement(t, taskEquipmentTargetIds, mode) {
    if (!Number.isFinite(t)) {
        return null;
    }
    if (taskHasMeatEquipment(taskEquipmentTargetIds)) {
        return resolveMeatStorageBand(t, mode);
    }
    return pickDefaultMeatNoEquipmentBand(t);
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
