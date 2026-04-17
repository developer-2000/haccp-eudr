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

import { i18n } from "@/i18n";
const tt = (...args) => i18n.global.t(...args);

// ═══════════════════════════════════════════════════════════════════════════

/**
 * Окна CCP и наклон риска для `TemperatureAiAnalyzer` (режимы `chilled` | `freezer`).
 * Тексты угроз/действий в UI — только из полос ниже, не отсюда.
 */
export const MEAT_MODE_ANALYZER_PROFILES = Object.freeze({
    chilled: Object.freeze({
        ccpMin: 0,
        ccpMax: 2,
        ccpLabel: tt('demo.meat_bands.ccp_chilled'),
        riskSlope: 20,
    }),
    freezer: Object.freeze({
        ccpMin: -24,
        ccpMax: -18,
        ccpLabel: tt('demo.meat_bands.ccp_freezer'),
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
        temperatureLabel: tt('demo.meat_bands.temp_label_fresh_meat'),
        status: "critical",
        threat: tt('demo.meat_bands.chilled_critical_threat'),
        action: tt('demo.meat_bands.chilled_critical_action'),
        equipmentTargetIds: MEAT_CHILLED_EQUIPMENT_IDS,
    }),
    Object.freeze({
        id: "chilled_5_8",
        temperatureLabel: "+5…+8°C",
        status: "warning",
        threat: tt('demo.meat_bands.chilled_warning_threat'),
        action: tt('demo.meat_bands.chilled_warning_action'),
        equipmentTargetIds: MEAT_CHILLED_EQUIPMENT_IDS,
    }),
    Object.freeze({
        id: "chilled_2_5",
        temperatureLabel: "+2…+4°C",
        status: "normal",
        threat: tt('demo.meat_bands.chilled_normal_threat'),
        action: tt('demo.meat_bands.chilled_normal_action'),
        equipmentTargetIds: MEAT_CHILLED_EQUIPMENT_IDS,
    }),
    Object.freeze({
        id: "chilled_0_2",
        temperatureLabel: "0…+1°C",
        status: "normal",
        threat: tt('demo.meat_bands.chilled_low_threat'),
        action: tt('demo.meat_bands.chilled_low_action'),
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
        temperatureLabel: tt('demo.meat_bands.temp_label_above_freezing'),
        status: "warning",
        threat: tt('demo.meat_bands.frozen_warm_threat'),
        action: tt('demo.meat_bands.frozen_warm_action'),
        equipmentTargetIds: MEAT_FREEZER_EQUIPMENT_IDS,
    }),
    Object.freeze({
        id: "freezer_m12_m18",
        temperatureLabel: "−12…−18°C",
        status: "normal",
        threat: tt('demo.meat_bands.frozen_normal_threat'),
        action: tt('demo.meat_bands.frozen_normal_action'),
        equipmentTargetIds: MEAT_FREEZER_EQUIPMENT_IDS,
    }),
    Object.freeze({
        id: "freezer_m25_m18",
        temperatureLabel: "−19°…−25C",
        status: "normal",
        threat: tt('demo.meat_bands.frozen_premium_threat'),
        action: tt('demo.meat_bands.frozen_premium_action'),
        equipmentTargetIds: MEAT_FREEZER_EQUIPMENT_IDS,
    }),
    Object.freeze({
        id: "freezer_lt_m25",
        temperatureLabel: "< −26°C",
        status: "warning",
        threat: tt('demo.meat_bands.frozen_overcool_threat'),
        action: tt('demo.meat_bands.frozen_overcool_action'),
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
        processLabel: tt('demo.meat_bands.process_freezing'),
        temperatureLabel: "< −25°C",
        status: "warning",
        threat: tt('demo.meat_bands.fallback_overcool_threat'),
        action: tt('demo.meat_bands.fallback_overcool_action'),
    }),
    Object.freeze({
        id: "meat_freeze_m25_m12",
        processLabel: tt('demo.meat_bands.process_freezing'),
        temperatureLabel: "−25…−12°C",
        status: "normal",
        threat: tt('demo.meat_bands.fallback_frozen_threat'),
        action: tt('demo.meat_bands.fallback_frozen_action'),
    }),
    Object.freeze({
        id: "meat_superchilled_m11_0",
        processLabel: tt('demo.meat_bands.process_overcooling'),
        temperatureLabel: "−11…−1°C",
        status: "warning",
        threat: tt('demo.meat_bands.fallback_softening_threat'),
        action: tt('demo.meat_bands.fallback_softening_action'),
    }),
    Object.freeze({
        id: "meat_chilled_0_1",
        processLabel: tt('demo.meat_bands.process_cooling'),
        temperatureLabel: "0…+1°C",
        status: "normal",
        threat: tt('demo.meat_bands.fallback_ground_threat'),
        action: tt('demo.meat_bands.fallback_ground_action'),
    }),
    Object.freeze({
        id: "meat_chilled_2_4",
        processLabel: tt('demo.meat_bands.process_cooling'),
        temperatureLabel: "+2…+4°C",
        status: "normal",
        threat: tt('demo.meat_bands.fallback_fridge_threat'),
        action: tt('demo.meat_bands.fallback_fridge_action'),
    }),
    Object.freeze({
        id: "meat_danger_5_8",
        processLabel: tt('demo.meat_bands.process_cooling'),
        temperatureLabel: "+5…+8°C",
        status: "warning",
        threat: tt('demo.meat_bands.fallback_bacteria_threat'),
        action: tt('demo.meat_bands.fallback_bacteria_action'),
    }),
    Object.freeze({
        id: "meat_critical_gt_8",
        processLabel: tt('demo.meat_bands.process_cooling'),
        temperatureLabel: "> +8°C",
        status: "critical",
        threat: tt('demo.meat_bands.fallback_danger_threat'),
        action: tt('demo.meat_bands.fallback_danger_action'),
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

