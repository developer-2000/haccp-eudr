/**
 * Справочник полос температуры для кофе по процессам.
 *
 * Режимы (`mode` для `resolveCoffeeBand`):
 * - `storage` — хранение зерна
 * - `roasting` — обжарка
 * - `cooling` — охлаждение после обжарки
 *
 * Поле `status` у полосы: `critical` | `warning` | `normal` (внутреннее справочника).
 * Пороги — в `COFFEE_TEMP`.
 *
 * Охлаждение: критическая строка «> +40°C (>10 мин)» в данных — оценка по времени в этом модуле не делается, только по °C (`t > 40`).
 *
 * В задаче **нет** `eq-coffee-*` → одна шкала **`DEFAULT_COFFEE_AI_PROFILE_FALLBACK`** (−20…+300 °C без зазоров), как у мяса без `eq-meat-*`.
 *
 * У каждой полосы поле **`equipmentTargetIds`** — те же `id`, что в **`EQUIPMENT_GROUPS`** (`resources/js/config/tasks.js`, группы «Кофе — …»).
 */

import { i18n } from '@/i18n';
const tt = (...args) => i18n.global.t(...args);

// ═══════════════════════════════════════════════════════════════════════════
// Оборудование
// ═══════════════════════════════════════════════════════════════════════════

/** Хранение зерна — группа «Кофе — хранение». */
export const COFFEE_STORAGE_EQUIPMENT_IDS = Object.freeze([
    'eq-coffee-vacuum-containers',
    'eq-coffee-warehouse-shelving',
    'eq-coffee-grain-canisters',
]);

/** Обжарка — группа «Кофе — обжарка». */
export const COFFEE_ROASTING_EQUIPMENT_IDS = Object.freeze([
    'eq-coffee-roaster',
    'eq-coffee-destoner',
]);

/** Охлаждение — группа «Кофе — охлаждение». */
export const COFFEE_COOLING_EQUIPMENT_IDS = Object.freeze([
    'eq-coffee-bean-cooler',
    'eq-coffee-shock-cooler',
]);

// ═══════════════════════════════════════════════════════════════════════════
// Пороги °C по режимам (см. полосы ниже)
// ═══════════════════════════════════════════════════════════════════════════

export const COFFEE_TEMP = Object.freeze({
    storage: Object.freeze({
        gtCritical: 30,
        /** Нижняя граница зоны предупреждения +25…+30 °C; норма хранения — [normalMin, warnHigh) °C */
        warnHigh: 25,
        normalMin: 15,
    }),
    roasting: Object.freeze({
        gtCritical: 230,
        normalMin: 195,
        normalMax: 230,
        warnMin: 165,
        warnMax: 195,
        ltCritical: 165,
    }),
    cooling: Object.freeze({
        gtCritical: 40,
        /** Нижняя граница зоны «медленное охлаждение» +25…+40 °C; норма — [normalMin, warnLow) °C */
        warnLow: 25,
        warnHigh: 40,
        normalMin: 15,
    }),
});

const S = COFFEE_TEMP.storage;
const R = COFFEE_TEMP.roasting;
const C = COFFEE_TEMP.cooling;

// ═══════════════════════════════════════════════════════════════════════════
// Полосы: хранение (режим `storage`)
// ═══════════════════════════════════════════════════════════════════════════

/** Хранение. `status`: critical | warning | normal. */
/** Хранение кофе HACCP — ПОЛНЫЙ МАССИВ (конкретно для оборудования) */
export const COFFEE_STORAGE_BANDS = Object.freeze([
    Object.freeze({
        id: 'coffee_storage_gt_30',
        processLabel: tt('demo.coffee_bands.process_storage'),
        temperatureLabel: '> +30°C',
        status: 'critical',
        threat: tt('demo.coffee_bands.storage_hot_threat'),
        action: tt('demo.coffee_bands.storage_hot_action'),
        equipmentTargetIds: COFFEE_STORAGE_EQUIPMENT_IDS,
    }),
    Object.freeze({
        id: 'coffee_storage_25_30',
        processLabel: tt('demo.coffee_bands.process_storage'),
        temperatureLabel: '+25…+30°C',
        status: 'warning',
        threat: tt('demo.coffee_bands.storage_warm_threat'),
        action: tt('demo.coffee_bands.storage_warm_action'),
        equipmentTargetIds: COFFEE_STORAGE_EQUIPMENT_IDS,
    }),
    Object.freeze({
        id: 'coffee_storage_15_24',
        processLabel: tt('demo.coffee_bands.process_storage'),
        temperatureLabel: '+15…+24°C',
        status: 'normal',
        threat: tt('demo.coffee_bands.storage_normal_threat'),
        action: tt('demo.coffee_bands.storage_normal_action'),
        equipmentTargetIds: COFFEE_STORAGE_EQUIPMENT_IDS,
    }),
    Object.freeze({
        id: 'coffee_storage_lt_15',
        processLabel: tt('demo.coffee_bands.process_storage'),
        temperatureLabel: '< +15°C',
        status: 'warning',
        threat: tt('demo.coffee_bands.storage_cold_threat'),
        action: tt('demo.coffee_bands.storage_cold_action'),
        equipmentTargetIds: COFFEE_STORAGE_EQUIPMENT_IDS,
    }),
]);
// ═══════════════════════════════════════════════════════════════════════════
// Обжарка (режим `roasting`)
// ═══════════════════════════════════════════════════════════════════════════

/** Обжарка */
export const COFFEE_ROASTING_BANDS = Object.freeze([
    Object.freeze({
        id: 'coffee_roast_gt_230',
        processLabel: tt('demo.coffee_bands.process_roasting'),
        temperatureLabel: '> 230°C',
        status: 'critical',
        threat: tt('demo.coffee_bands.roasting_burn_threat'),
        action: tt('demo.coffee_bands.roasting_burn_action'),
        equipmentTargetIds: COFFEE_ROASTING_EQUIPMENT_IDS,
    }),
    Object.freeze({
        id: 'coffee_roast_195_230',
        processLabel: tt('demo.coffee_bands.process_roasting'),
        temperatureLabel: '195…230°C',
        status: 'normal',
        threat: tt('demo.coffee_bands.roasting_normal_threat'),
        action: '—',
        equipmentTargetIds: COFFEE_ROASTING_EQUIPMENT_IDS,
    }),
    Object.freeze({
        id: 'coffee_roast_165_195',
        processLabel: tt('demo.coffee_bands.process_roasting'),
        temperatureLabel: '165…194°C',
        status: 'warning',
        threat: tt('demo.coffee_bands.roasting_under_threat'),
        action: tt('demo.coffee_bands.roasting_under_action'),
        equipmentTargetIds: COFFEE_ROASTING_EQUIPMENT_IDS,
    }),
    Object.freeze({
        id: 'coffee_roast_lt_165',
        processLabel: tt('demo.coffee_bands.process_roasting'),
        temperatureLabel: '< 165°C',
        status: 'critical',
        threat: tt('demo.coffee_bands.roasting_raw_threat'),
        action: tt('demo.coffee_bands.roasting_raw_action'),
        equipmentTargetIds: COFFEE_ROASTING_EQUIPMENT_IDS,
    }),
]);

// ═══════════════════════════════════════════════════════════════════════════
// Охлаждение после обжарки (режим `cooling`)
// ═══════════════════════════════════════════════════════════════════════════

/** Охлаждение (после обжарки). */
export const COFFEE_COOLING_BANDS = Object.freeze([
    Object.freeze({
        id: 'coffee_cool_gt_40',
        processLabel: tt('demo.coffee_bands.process_cooling'),
        temperatureLabel: tt('demo.coffee_bands.temp_label_cooling_critical'),
        status: 'critical',
        threat: tt('demo.coffee_bands.cooling_hot_threat'),
        action: tt('demo.coffee_bands.cooling_hot_action'),
        equipmentTargetIds: COFFEE_COOLING_EQUIPMENT_IDS,
    }),
    Object.freeze({
        id: 'coffee_cool_25_40',
        processLabel: tt('demo.coffee_bands.process_cooling'),
        temperatureLabel: '+25…+40°C',
        status: 'warning',
        threat: tt('demo.coffee_bands.cooling_warm_threat'),
        action: tt('demo.coffee_bands.cooling_warm_action'),
        equipmentTargetIds: COFFEE_COOLING_EQUIPMENT_IDS,
    }),
    Object.freeze({
        id: 'coffee_cool_15_24',
        processLabel: tt('demo.coffee_bands.process_cooling'),
        temperatureLabel: '+15…+24°C',
        status: 'normal',
        threat: tt('demo.coffee_bands.cooling_normal_threat'),
        action: tt('demo.coffee_bands.cooling_normal_action'),
        equipmentTargetIds: COFFEE_COOLING_EQUIPMENT_IDS,
    }),
    Object.freeze({
        id: 'coffee_cool_lt_15',
        processLabel: tt('demo.coffee_bands.process_cooling'),
        temperatureLabel: '< +15°C',
        status: 'warning',
        threat: tt('demo.coffee_bands.cooling_cold_threat'),
        action: tt('demo.coffee_bands.cooling_cold_action'),
        equipmentTargetIds: COFFEE_COOLING_EQUIPMENT_IDS,
    }),
]);

// ═══════════════════════════════════════════════════════════════════════════
// Default - без специального оборудования
// ═══════════════════════════════════════════════════════════════════════════

/**
 * HACCP КОФЕ — полный диапазон −20…+300 °C без зазоров (без `eq-coffee-*`).
 */
export const DEFAULT_COFFEE_AI_PROFILE_FALLBACK = Object.freeze([
    Object.freeze({
        id: 'coffee_cold_lt_14',
        processLabel: tt('demo.coffee_bands.process_storage_cooling'),
        temperatureLabel: '< +15°C',
        status: 'warning',
        threat: tt('demo.coffee_bands.fallback_cold_threat'),
        action: tt('demo.coffee_bands.fallback_cold_action'),
    }),
    Object.freeze({
        id: 'coffee_ideal_15_24',
        processLabel: tt('demo.coffee_bands.process_storage_cooling'),
        temperatureLabel: '+15…+24°C',
        status: 'normal',
        threat: tt('demo.coffee_bands.fallback_normal_threat'),
        action: tt('demo.coffee_bands.fallback_normal_action'),
    }),
    Object.freeze({
        id: 'coffee_warm_25_40',
        processLabel: tt('demo.coffee_bands.process_storage_cooling'),
        temperatureLabel: '+25…+40°C',
        status: 'warning',
        threat: tt('demo.coffee_bands.fallback_warm_threat'),
        action: tt('demo.coffee_bands.fallback_warm_action'),
    }),
    Object.freeze({
        id: 'coffee_hot_41_194',
        processLabel: tt('demo.coffee_bands.process_roasting_cooling'),
        temperatureLabel: '+41…+194°C',
        status: 'normal',
        threat: tt('demo.coffee_bands.fallback_mid_threat'),
        action: tt('demo.coffee_bands.fallback_mid_action'),
    }),
    Object.freeze({
        id: 'coffee_roast_perfect_195_230',
        processLabel: tt('demo.coffee_bands.process_roasting'),
        temperatureLabel: '195…230°C',
        status: 'normal',
        threat: tt('demo.coffee_bands.fallback_roast_threat'),
        action: tt('demo.coffee_bands.fallback_roast_action'),
    }),
    Object.freeze({
        id: 'coffee_burn_gt_231',
        processLabel: tt('demo.coffee_bands.process_roasting'),
        temperatureLabel: '> +230°C',
        status: 'critical',
        threat: tt('demo.coffee_bands.fallback_burn_threat'),
        action: tt('demo.coffee_bands.fallback_burn_action'),
    }),
]);

/**
 * Строка из `DEFAULT_COFFEE_AI_PROFILE_FALLBACK` по °C (полуинтервалы без зазоров).
 *
 * @param {number} t
 * @returns {Readonly<(typeof DEFAULT_COFFEE_AI_PROFILE_FALLBACK)[number]> | null}
 */
export function pickDefaultCoffeeNoEquipmentBand(t) {
    if (!Number.isFinite(t)) {
        return null;
    }
    const rows = DEFAULT_COFFEE_AI_PROFILE_FALLBACK;
    if (t < 15) {
        return rows[0];
    }
    if (t < 25) {
        return rows[1];
    }
    if (t < 41) {
        return rows[2];
    }
    if (t < 195) {
        return rows[3];
    }
    if (t <= 230) {
        return rows[4];
    }
    return rows[5];
}

// ═══════════════════════════════════════════════════════════════════════════
// Внутренние индексы и функции pick* по режиму — для `resolveCoffeeBand`
// ═══════════════════════════════════════════════════════════════════════════

const STORAGE_I = Object.freeze({
    gt30: 0,
    open25_30: 1,
    closed15_24: 2,
    lt15: 3,
});

const ROAST_I = Object.freeze({
    gt230: 0,
    closed195_230: 1,
    closed165_195: 2,
    lt165: 3,
});

const COOL_I = Object.freeze({
    gt40: 0,
    open25_40: 1,
    closed15_24: 2,
    lt15: 3,
});

/**
 * @param {number} t
 * @returns {Readonly<typeof COFFEE_STORAGE_BANDS[number]> | null}
 */
function pickStorageBand(t) {
    if (t > S.gtCritical) {
        return COFFEE_STORAGE_BANDS[STORAGE_I.gt30];
    }
    if (t >= S.warnHigh && t <= S.gtCritical) {
        return COFFEE_STORAGE_BANDS[STORAGE_I.open25_30];
    }
    if (t >= S.normalMin && t < S.warnHigh) {
        return COFFEE_STORAGE_BANDS[STORAGE_I.closed15_24];
    }
    if (t < S.normalMin) {
        return COFFEE_STORAGE_BANDS[STORAGE_I.lt15];
    }
    return null;
}

/**
 * @param {number} t
 * @returns {Readonly<typeof COFFEE_ROASTING_BANDS[number]> | null}
 */
function pickRoastingBand(t) {
    if (t > R.gtCritical) {
        return COFFEE_ROASTING_BANDS[ROAST_I.gt230];
    }
    if (t >= R.normalMin && t <= R.normalMax) {
        return COFFEE_ROASTING_BANDS[ROAST_I.closed195_230];
    }
    if (t >= R.warnMin && t < R.warnMax) {
        return COFFEE_ROASTING_BANDS[ROAST_I.closed165_195];
    }
    if (t < R.ltCritical) {
        return COFFEE_ROASTING_BANDS[ROAST_I.lt165];
    }
    return null;
}

/**
 * @param {number} t
 * @returns {Readonly<typeof COFFEE_COOLING_BANDS[number]> | null}
 */
function pickCoolingBand(t) {
    if (t > C.gtCritical) {
        return COFFEE_COOLING_BANDS[COOL_I.gt40];
    }
    if (t >= C.warnLow && t <= C.warnHigh) {
        return COFFEE_COOLING_BANDS[COOL_I.open25_40];
    }
    if (t >= C.normalMin && t < C.warnLow) {
        return COFFEE_COOLING_BANDS[COOL_I.closed15_24];
    }
    if (t < C.normalMin) {
        return COFFEE_COOLING_BANDS[COOL_I.lt15];
    }
    return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// Экспорт: выбор полосы и текст угрозы
// ═══════════════════════════════════════════════════════════════════════════

/** Нормализация режима из задачи / профиля. */
function normalizeCoffeeMode(mode) {
    if (mode == null || mode === '') {
        return 'storage';
    }
    const m = String(mode).toLowerCase();
    if (m === 'storage' || m === 'roasting' || m === 'cooling') {
        return m;
    }
    return null;
}

/**
 * @param {number} t — температура °C
 * @param {string|null|undefined} mode — `storage` | `roasting` | `cooling`
 * @returns {Readonly<typeof COFFEE_STORAGE_BANDS[number]> | Readonly<typeof COFFEE_ROASTING_BANDS[number]> | Readonly<typeof COFFEE_COOLING_BANDS[number]> | null}
 */
export function resolveCoffeeBand(t, mode) {
    const m = normalizeCoffeeMode(mode);
    if (m === 'storage') {
        return pickStorageBand(t);
    }
    if (m === 'roasting') {
        return pickRoastingBand(t);
    }
    if (m === 'cooling') {
        return pickCoolingBand(t);
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
export function taskHasCoffeeEquipment(taskEquipmentTargetIds) {
    const ids = Array.isArray(taskEquipmentTargetIds) ? taskEquipmentTargetIds : [];
    return ids.some((id) => String(id).startsWith('eq-coffee-'));
}

/**
 * Тексты полос кофе относятся к конкретным группам оборудования (`equipmentTargetIds` у полосы).
 * Если в задаче выбрано другое оборудование — не подставляем «идеально для зёрен» и т.п.
 * Без `eq-coffee-*` в задаче — как у мяса: полоса допустима для текста (`DEFAULT_COFFEE_AI_PROFILE_FALLBACK`).
 *
 * @param {Readonly<{ equipmentTargetIds?: readonly string[] }>|null|undefined} band
 * @param {readonly string[]|null|undefined} taskEquipmentTargetIds
 * @returns {boolean}
 */
export function coffeeBandMatchesTaskEquipment(band, taskEquipmentTargetIds) {
    if (!taskHasCoffeeEquipment(taskEquipmentTargetIds)) {
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

/**
 * Замер °C: есть `eq-coffee-*` → полосы по режиму (`resolveCoffeeBand`); нет → `DEFAULT_COFFEE_AI_PROFILE_FALLBACK`.
 *
 * @param {number} t
 * @param {readonly string[]|null|undefined} taskEquipmentTargetIds
 * @param {string|null|undefined} mode — учитывается только при наличии кофейного оборудования
 * @returns {Readonly<object>|null}
 */
export function resolveCoffeeRowForTaskMeasurement(t, taskEquipmentTargetIds, mode) {
    if (!Number.isFinite(t)) {
        return null;
    }
    if (taskHasCoffeeEquipment(taskEquipmentTargetIds)) {
        return resolveCoffeeBand(t, mode);
    }
    return pickDefaultCoffeeNoEquipmentBand(t);
}
