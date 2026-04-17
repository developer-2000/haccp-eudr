/**
 * Справочник полос температуры для теста/хлеба по процессам.
 *
 * Режимы (`mode` для `resolveBreadBand`):
 * - `sponge_mix` — опарка / замес
 * - `proofing` — расстойка
 * - `baking` — выпечка (сердцевина / камера печи — один ввод °C, см. `BREAD_TEMP.baking`)
 * - `cooling` — охлаждение буханки (оценка только по °C; «>2 ч» в таблице здесь не моделируется)
 *
 * Поле `status`: `critical` | `warning` | `normal`.
 * Пороги — в `BREAD_TEMP`.
 *
 * У каждой полосы **`equipmentTargetIds`** — те же `id`, что в **`EQUIPMENT_GROUPS`**
 * (`resources/js/config/tasks.js`, группы «Хлеб/тесто — …»).
 */

// ═══════════════════════════════════════════════════════════════════════════
import { i18n } from "@/i18n";
const tt = (...args) => i18n.global.t(...args);

// ═══════════════════════════════════════════════════════════════════════════

/** Опарка / замес. */
export const BREAD_SPONGE_MIX_EQUIPMENT_IDS = Object.freeze([
    "eq-bread-spiral-mixer",
    "eq-bread-preferment-vat",
]);

/** Расстойка. */
export const BREAD_PROOFING_EQUIPMENT_IDS = Object.freeze([
    "eq-bread-proofing-cabinet",
    "eq-bread-proofing-trays",
]);

/** Выпечка. */
export const BREAD_BAKING_EQUIPMENT_IDS = Object.freeze([
    "eq-bread-rotary-oven",
    "eq-bread-crumb-probe",
]);

/** Охлаждение после выпечки. */
export const BREAD_COOLING_EQUIPMENT_IDS = Object.freeze([
    "eq-bread-cooling-conveyor",
    "eq-bread-ventilated-racks",
]);

// ═══════════════════════════════════════════════════════════════════════════
// Пороги °C по режимам (см. полосы ниже)
// ═══════════════════════════════════════════════════════════════════════════

export const BREAD_TEMP = Object.freeze({
    /** Опарка/замес: три полосы — `>35`, `26…34`, `<25` (см. `BREAD_SPONGE_MIX_BANDS`). */
    sponge_mix: Object.freeze({
        gtCritical: 35,
        normalMin: 26,
        normalMax: 34,
        ltWarn: 25,
    }),
    /** Расстойка: три полосы — `>40`, `32…40`, `<30` (см. `BREAD_PROOFING_BANDS`). */
    proofing: Object.freeze({
        gtCritical: 40,
        normalMin: 32,
        normalMax: 40,
        ltWarn: 30,
    }),
    /** Выпечка: четыре полосы — `36…94`, `95…180`, `181…260`, `>260` (см. `BREAD_BAKING_BANDS`). Окно CCP «норма» — `181…260`. */
    baking: Object.freeze({
        /** t < 95 — зона «недопечённое» (в т.ч. &lt;36 °C). */
        undercookBelow: 95,
        sterileUnderbakedMax: 180,
        normalBakeMax: 260,
        overheatAbove: 260,
        ccpMin: 181,
        ccpMax: 260,
    }),
    /** Охлаждение: три полосы — `>35` (>2 ч в таблице не моделируем), `25…35`, `<25` (см. `BREAD_COOLING_BANDS`). */
    cooling: Object.freeze({
        gtCritical: 35,
        normalMin: 25,
        normalMax: 35,
        warnLow: 25,
    }),
});

const SM = BREAD_TEMP.sponge_mix;
const PF = BREAD_TEMP.proofing;
const BK = BREAD_TEMP.baking;
const CL = BREAD_TEMP.cooling;

// ═══════════════════════════════════════════════════════════════════════════
// Функция: эталонное окно «нормы» по режиму (пересечение с допуском задачи в `taskTemperatureAiContext`)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Эталонное окно CCP (норма) по режиму.
 * Порядок по шкале °C: охлаждение → опара → расстойка → выпечка (см. `BREAD_MODE_INFER_ORDER` в `taskTemperatureAiContext.js`).
 *
 * @param {string} mode — `sponge_mix` | `proofing` | `baking` | `cooling`
 * @returns {{ min: number, max: number } | null}
 */
export function getBreadModeCcpWindow(mode) {
    const m = String(mode ?? "")
        .trim()
        .toLowerCase();
    if (m === "sponge_mix") {
        return { min: SM.normalMin, max: SM.normalMax };
    }
    if (m === "proofing") {
        return { min: PF.normalMin, max: PF.normalMax };
    }
    if (m === "baking") {
        return { min: BK.ccpMin, max: BK.ccpMax };
    }
    if (m === "cooling") {
        return { min: CL.normalMin, max: CL.normalMax };
    }
    return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// Полосы по режимам (таблицы; у каждой строки — `equipmentTargetIds`)
// ═══════════════════════════════════════════════════════════════════════════

/** Опарка / замес — ровно три строки исходной таблицы (без дополнительных полос). */
export const BREAD_SPONGE_MIX_BANDS = Object.freeze([
    Object.freeze({
        id: "bread_sponge_gt_35",
        processLabel: tt('demo.bread_bands.process_sponge'),
        temperatureLabel: "> 35°C",
        status: "critical",
        threat: tt('demo.bread_bands.sponge_hot_threat'),
        action: tt('demo.bread_bands.sponge_hot_action'),
        equipmentTargetIds: BREAD_SPONGE_MIX_EQUIPMENT_IDS,
    }),
    Object.freeze({
        id: "bread_sponge_26_34",
        processLabel: tt('demo.bread_bands.process_sponge'),
        temperatureLabel: "26…34°C",
        status: "normal",
        threat: tt('demo.bread_bands.sponge_normal_threat'),
        action: "—",
        equipmentTargetIds: BREAD_SPONGE_MIX_EQUIPMENT_IDS,
    }),
    Object.freeze({
        id: "bread_sponge_lt_25",
        processLabel: tt('demo.bread_bands.process_sponge'),
        temperatureLabel: "< 25°C",
        status: "warning",
        threat: tt('demo.bread_bands.sponge_cold_threat'),
        action: tt('demo.bread_bands.sponge_cold_action'),
        equipmentTargetIds: BREAD_SPONGE_MIX_EQUIPMENT_IDS,
    }),
]);

/** Расстойка — ровно три строки таблицы. */
export const BREAD_PROOFING_BANDS = Object.freeze([
    Object.freeze({
        id: "bread_proof_gt_40",
        processLabel: tt('demo.bread_bands.process_proofing'),
        temperatureLabel: "> 41°C",
        status: "critical",
        threat: tt('demo.bread_bands.proofing_hot_threat'),
        action: tt('demo.bread_bands.proofing_hot_action'),
        equipmentTargetIds: BREAD_PROOFING_EQUIPMENT_IDS,
    }),
    Object.freeze({
        id: "bread_proof_32_40",
        processLabel: tt('demo.bread_bands.process_proofing'),
        temperatureLabel: "32…40°C",
        status: "normal",
        threat: tt('demo.bread_bands.proofing_normal_threat'),
        action: "—",
        equipmentTargetIds: BREAD_PROOFING_EQUIPMENT_IDS,
    }),
    Object.freeze({
        id: "bread_proof_lt_30",
        processLabel: tt('demo.bread_bands.process_proofing'),
        temperatureLabel: "< 31°C",
        status: "warning",
        threat: tt('demo.bread_bands.proofing_cold_threat'),
        action: tt('demo.bread_bands.proofing_cold_action'),
        equipmentTargetIds: BREAD_PROOFING_EQUIPMENT_IDS,
    }),
]);

/** Выпечка — четыре строки (один ввод °C: сердцевина или камера печи). */
export const BREAD_BAKING_BANDS = Object.freeze([
    // 36-94°C — недопечённое
    Object.freeze({
        id: "bread_undercook_36_94",
        processLabel: tt('demo.bread_bands.process_baking'),
        temperatureLabel: "36…94°C",
        status: "critical",
        threat: tt('demo.bread_bands.baking_raw_threat'),
        action: tt('demo.bread_bands.baking_raw_action'),
        equipmentTargetIds: BREAD_BAKING_EQUIPMENT_IDS,
    }),

    // 95-180°C — стерильно, но не выпечено
    Object.freeze({
        id: "bread_sterile_95_180",
        processLabel: tt('demo.bread_bands.process_baking'),
        temperatureLabel: "95…180°C",
        status: "normal",
        threat: tt('demo.bread_bands.baking_sterile_threat'),
        action: tt('demo.bread_bands.baking_sterile_action'),
        equipmentTargetIds: BREAD_BAKING_EQUIPMENT_IDS,
    }),

    // 181-260°C — стандартная выпечка
    Object.freeze({
        id: "bread_bake_normal_181_260",
        processLabel: tt('demo.bread_bands.process_baking'),
        temperatureLabel: "181…260°C",
        status: "normal",
        threat: tt('demo.bread_bands.baking_normal_threat'),
        action: tt('demo.bread_bands.baking_normal_action'),
        equipmentTargetIds: BREAD_BAKING_EQUIPMENT_IDS,
    }),

    // > 260°C — перегрев
    Object.freeze({
        id: "bread_overheat_gt_260",
        processLabel: tt('demo.bread_bands.process_baking'),
        temperatureLabel: "> 260°C",
        status: "warning",
        threat: tt('demo.bread_bands.baking_burn_threat'),
        action: tt('demo.bread_bands.baking_burn_action'),
        equipmentTargetIds: BREAD_BAKING_EQUIPMENT_IDS,
    }),
]);

/** Охлаждение — ровно три строки таблицы (время «>2 ч» — только в подписи, не в логике). */
export const BREAD_COOLING_BANDS = Object.freeze([
    Object.freeze({
        id: "bread_cool_gt_35",
        processLabel: tt('demo.bread_bands.process_cooling'),
        temperatureLabel: "> 35°C (>2ч)",
        status: "critical",
        threat: tt('demo.bread_bands.cooling_hot_threat'),
        action: tt('demo.bread_bands.cooling_hot_action'),
        equipmentTargetIds: BREAD_COOLING_EQUIPMENT_IDS,
    }),
    Object.freeze({
        id: "bread_cool_25_35",
        processLabel: tt('demo.bread_bands.process_cooling'),
        temperatureLabel: "25…35°C",
        status: "normal",
        threat: tt('demo.bread_bands.cooling_normal_threat'),
        action: tt('demo.bread_bands.cooling_normal_action'),
        equipmentTargetIds: BREAD_COOLING_EQUIPMENT_IDS,
    }),
    Object.freeze({
        id: "bread_cool_lt_25",
        processLabel: tt('demo.bread_bands.process_cooling'),
        temperatureLabel: "< 25°C",
        status: "warning",
        threat: tt('demo.bread_bands.cooling_cold_threat'),
        action: tt('demo.bread_bands.cooling_cold_action'),
        equipmentTargetIds: BREAD_COOLING_EQUIPMENT_IDS,
    }),
]);

/** Это Default массив температур в том случае если в задаче не оборудование для хлеба! */
export const DEFAULT_BREAD_AI_PROFILE_FALLBACK = Object.freeze([
    Object.freeze({
        id: "bread_cool_lt_25",
        processLabel: tt('demo.bread_bands.process_cooling'),
        temperatureLabel: "< 25°C",
        status: "warning",
        threat: tt('demo.bread_bands.fallback_cold_threat'),
        action: tt('demo.bread_bands.fallback_cold_action'),
    }),
    Object.freeze({
        id: "bread_cool_25_35",
        processLabel: tt('demo.bread_bands.process_cooling'),
        temperatureLabel: "25…35°C",
        status: "normal",
        threat: tt('demo.bread_bands.fallback_cool_threat'),
        action: tt('demo.bread_bands.fallback_cool_action'),
    }),
    Object.freeze({
        id: "bread_undercook_36_94",
        processLabel: tt('demo.bread_bands.process_baking'),
        temperatureLabel: "36…94°C",
        status: "critical",
        threat: tt('demo.bread_bands.baking_raw_threat'),
        action: tt('demo.bread_bands.baking_raw_action'),
    }),
    Object.freeze({
        id: "bread_sterile_95_180",
        processLabel: tt('demo.bread_bands.process_baking'),
        temperatureLabel: "95…180°C",
        status: "normal",
        threat: tt('demo.bread_bands.baking_sterile_threat'),
        action: tt('demo.bread_bands.baking_sterile_action'),
    }),
    Object.freeze({
        id: "bread_bake_normal_181_260",
        processLabel: tt('demo.bread_bands.process_baking'),
        temperatureLabel: "181…260°C",
        status: "normal",
        threat: tt('demo.bread_bands.baking_normal_threat'),
        action: tt('demo.bread_bands.baking_normal_action'),
    }),
    Object.freeze({
        id: "bread_overheat_gt_260",
        processLabel: tt('demo.bread_bands.process_baking'),
        temperatureLabel: "> 260°C",
        status: "warning",
        threat: tt('demo.bread_bands.baking_burn_threat'),
        action: tt('demo.bread_bands.baking_burn_action'),
    }),
]);

// ═══════════════════════════════════════════════════════════════════════════
// Функция: в задаче есть хотя бы один `eq-bread-*` (по списку оборудования задачи)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @param {readonly string[]|null|undefined} taskEquipmentTargetIds
 * @returns {boolean}
 */
export function taskHasBreadEquipment(taskEquipmentTargetIds) {
    const ids = Array.isArray(taskEquipmentTargetIds) ? taskEquipmentTargetIds : [];
    return ids.some((id) => String(id).startsWith("eq-bread-"));
}

// ═══════════════════════════════════════════════════════════════════════════
// Функция: подбор строки из fallback по °C (когда в задаче нет хлебного оборудования)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Строка из `DEFAULT_BREAD_AI_PROFILE_FALLBACK` по °C, если нет хлебного оборудования в задаче.
 * Зоны: &lt;25 · 25…35 · &lt;95 · 95…180 · 181…260 · &gt;260 (охлаждение, затем выпечка как в `BREAD_BAKING_BANDS`).
 *
 * @param {number} t
 * @returns {Readonly<(typeof DEFAULT_BREAD_AI_PROFILE_FALLBACK)[number]> | null}
 */
export function pickDefaultBreadNoEquipmentBand(t) {
    if (!Number.isFinite(t)) {
        return null;
    }
    const rows = DEFAULT_BREAD_AI_PROFILE_FALLBACK;
    if (t < 25) {
        return rows[0];
    }
    if (t <= 35) {
        return rows[1];
    }
    if (t < BK.undercookBelow) {
        return rows[2];
    }
    if (t <= BK.sterileUnderbakedMax) {
        return rows[3];
    }
    if (t <= BK.normalBakeMax) {
        return rows[4];
    }
    return rows[5];
}

// ═══════════════════════════════════════════════════════════════════════════
// Данные: окна CCP и наклон риска для `TemperatureAiAnalyzer` (режимы с `eq-bread-*`)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Окна CCP и наклон риска для `TemperatureAiAnalyzer` (режимы с `eq-bread-*`). Тексты UI — из полос; без хлеба — `DEFAULT_BREAD_AI_PROFILE_FALLBACK`.
 */
export const BREAD_MODE_ANALYZER_PROFILES = Object.freeze({
    sponge_mix: Object.freeze({
        ccpMin: SM.normalMin,
        ccpMax: SM.normalMax,
        ccpLabel: tt('demo.bread_bands.ccp_sponge_mix'),
        riskSlope: 14,
    }),
    proofing: Object.freeze({
        ccpMin: PF.normalMin,
        ccpMax: PF.normalMax,
        ccpLabel: tt('demo.bread_bands.ccp_proofing'),
        riskSlope: 14,
    }),
    baking: Object.freeze({
        ccpMin: BK.ccpMin,
        ccpMax: BK.ccpMax,
        ccpLabel: tt('demo.bread_bands.ccp_baking'),
        riskSlope: 12,
    }),
    cooling: Object.freeze({
        ccpMin: CL.normalMin,
        ccpMax: CL.normalMax,
        ccpLabel: tt('demo.bread_bands.ccp_cooling'),
        riskSlope: 12,
    }),
});

// ═══════════════════════════════════════════════════════════════════════════
// Внутренние данные (индексы полос) и функции pick* по режиму — для `resolveBreadBand`
// ═══════════════════════════════════════════════════════════════════════════

const SPONGE_I = Object.freeze({
    gt35: 0,
    norm26_34: 1,
    lt25: 2,
});

const PROOF_I = Object.freeze({
    gt40: 0,
    norm32_40: 1,
    lt30: 2,
});

const BAKE_I = Object.freeze({
    undercook: 0,
    sterile95_180: 1,
    normal181_260: 2,
    overheatGt260: 3,
});

const COOLB_I = Object.freeze({
    gt35: 0,
    norm25_35: 1,
    lt25: 2,
});

/**
 * @param {number} t
 * @returns {Readonly<typeof BREAD_SPONGE_MIX_BANDS[number]> | null}
 */
function pickSpongeMixBand(t) {
    if (t > SM.gtCritical) {
        return BREAD_SPONGE_MIX_BANDS[SPONGE_I.gt35];
    }
    if (t >= SM.normalMin && t <= SM.normalMax) {
        return BREAD_SPONGE_MIX_BANDS[SPONGE_I.norm26_34];
    }
    if (t < SM.ltWarn) {
        return BREAD_SPONGE_MIX_BANDS[SPONGE_I.lt25];
    }
    // Промежутки 25…26 °C и 34…35 °C в таблице отдельно не заданы: холод / перегрев.
    if (t >= SM.ltWarn && t < SM.normalMin) {
        return BREAD_SPONGE_MIX_BANDS[SPONGE_I.lt25];
    }
    if (t > SM.normalMax && t <= SM.gtCritical) {
        return BREAD_SPONGE_MIX_BANDS[SPONGE_I.gt35];
    }
    return null;
}

/**
 * @param {number} t
 * @returns {Readonly<typeof BREAD_PROOFING_BANDS[number]> | null}
 */
function pickProofingBand(t) {
    if (t > PF.gtCritical) {
        return BREAD_PROOFING_BANDS[PROOF_I.gt40];
    }
    if (t >= PF.normalMin && t <= PF.normalMax) {
        return BREAD_PROOFING_BANDS[PROOF_I.norm32_40];
    }
    if (t < PF.ltWarn) {
        return BREAD_PROOFING_BANDS[PROOF_I.lt30];
    }
    // 30…32 °C в таблице отдельно не задано — ближе к предупреждению (холод).
    if (t >= PF.ltWarn && t < PF.normalMin) {
        return BREAD_PROOFING_BANDS[PROOF_I.lt30];
    }
    return null;
}

/**
 * @param {number} t
 * @returns {Readonly<typeof BREAD_BAKING_BANDS[number]> | null}
 */
function pickBakingBand(t) {
    if (t < BK.undercookBelow) {
        return BREAD_BAKING_BANDS[BAKE_I.undercook];
    }
    if (t <= BK.sterileUnderbakedMax) {
        return BREAD_BAKING_BANDS[BAKE_I.sterile95_180];
    }
    if (t <= BK.normalBakeMax) {
        return BREAD_BAKING_BANDS[BAKE_I.normal181_260];
    }
    if (t > BK.overheatAbove) {
        return BREAD_BAKING_BANDS[BAKE_I.overheatGt260];
    }
    return null;
}

/**
 * @param {number} t
 * @returns {Readonly<typeof BREAD_COOLING_BANDS[number]> | null}
 */
function pickBreadCoolingBand(t) {
    if (t > CL.gtCritical) {
        return BREAD_COOLING_BANDS[COOLB_I.gt35];
    }
    if (t >= CL.normalMin && t <= CL.normalMax) {
        return BREAD_COOLING_BANDS[COOLB_I.norm25_35];
    }
    if (t < CL.warnLow) {
        return BREAD_COOLING_BANDS[COOLB_I.lt25];
    }
    return null;
}

function normalizeBreadMode(mode) {
    if (mode == null || mode === "") {
        return "proofing";
    }
    const m = String(mode).toLowerCase();
    if (
        m === "sponge_mix" ||
        m === "proofing" ||
        m === "baking" ||
        m === "cooling"
    ) {
        return m;
    }
    return null;
}

/**
 * @param {number} t — °C
 * @param {string|null|undefined} mode — `sponge_mix` | `proofing` | `baking` | `cooling`
 */
export function resolveBreadBand(t, mode) {
    const m = normalizeBreadMode(mode);
    if (m === "sponge_mix") {
        return pickSpongeMixBand(t);
    }
    if (m === "proofing") {
        return pickProofingBand(t);
    }
    if (m === "baking") {
        return pickBakingBand(t);
    }
    if (m === "cooling") {
        return pickBreadCoolingBand(t);
    }
    return null;
}

/**
 * Замер °C по задаче: есть `eq-bread-*` → строка из полос режима (`resolveBreadBand`);
 * нет → `DEFAULT_BREAD_AI_PROFILE_FALLBACK` (`pickDefaultBreadNoEquipmentBand`). Один вход для UI и анализатора.
 *
 * @param {number} t
 * @param {readonly string[]|null|undefined} taskEquipmentTargetIds
 * @param {string|null|undefined} mode — только при наличии хлебного оборудования (см. `resolveTemperatureAiMode`)
 * @returns {Readonly<object>|null}
 */
export function resolveBreadRowForTaskMeasurement(t, taskEquipmentTargetIds, mode) {
    if (!Number.isFinite(t)) {
        return null;
    }
    if (taskHasBreadEquipment(taskEquipmentTargetIds)) {
        return resolveBreadBand(t, mode);
    }
    return pickDefaultBreadNoEquipmentBand(t);
}

/**
 * @param {Readonly<{ equipmentTargetIds?: readonly string[] }>|null|undefined} band
 * @param {readonly string[]|null|undefined} taskEquipmentTargetIds
 * @returns {boolean}
 */
export function breadBandMatchesTaskEquipment(band, taskEquipmentTargetIds) {
    if (!band?.equipmentTargetIds?.length) {
        return true;
    }
    const ids = Array.isArray(taskEquipmentTargetIds) ? taskEquipmentTargetIds : [];
    if (!ids.length) {
        return true;
    }
    return band.equipmentTargetIds.some((id) => ids.includes(id));
}
