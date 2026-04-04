import { DEMO_TEMPERATURE_MEASUREMENT_AI_WARNING_SHAPE } from "@/features/demo/task_grain_cooling/config";
import {
    BREAD_MODE_ANALYZER_PROFILES,
    breadBandMatchesTaskEquipment,
    resolveBreadRowForTaskMeasurement,
    taskHasBreadEquipment,
} from "./breadBands";
import {
    coffeeBandMatchesTaskEquipment,
    resolveCoffeeRowForTaskMeasurement,
    taskHasCoffeeEquipment,
} from "./coffeeBands";
import {
    MEAT_MODE_ANALYZER_PROFILES,
    meatBandMatchesTaskEquipment,
    resolveMeatRowForTaskMeasurement,
    taskHasMeatEquipment,
} from "./meatBands";

/**
 * Окна CCP по режимам только при **`eq-coffee-*`** в задаче.
 * Без кофейного оборудования строки и подписи — только из **`DEFAULT_COFFEE_AI_PROFILE_FALLBACK`** в `coffeeBands.js`.
 */
const COFFEE_TEMPERATURE_PROFILES = Object.freeze({
    storage: Object.freeze({
        ccpMin: 15,
        ccpMax: 24,
        ccpLabel: "15..24°C (хранение зерна, норма)",
        threatHigh: "Перегрев зерна и рост риска качества/микотоксинов",
        threatLow: "Переохлаждение зерна и риск конденсата при циклах",
        economyHigh: "Потеря аромата и стоимости партии",
        economyLow: "Снижение стабильности профиля обжарки",
        inspectorHigh: "Отклонение по условиям хранения сырья",
        inspectorLow: "Отклонение по условиям температурного режима",
        actionHigh: "Стабилизировать температуру склада и проверить вентиляцию",
        actionLow: "Проверить утепление и исключить температурные качели",
        riskSlope: 12,
    }),
    roasting: Object.freeze({
        ccpMin: 195,
        ccpMax: 230,
        ccpLabel: "195..230°C (обжарка)",
        threatHigh: "Перегрев барабана — риск подгорания и акриламида",
        threatLow: "Недожар — сырой вкус и нестабильный экстракт",
        economyHigh: "Потеря партии обжарки",
        economyLow: "Брак по профилю и повторный цикл",
        inspectorHigh: "Отклонение по режиму обжарки",
        inspectorLow: "Отклонение по режиму обжарки",
        actionHigh: "Остановить рост температуры и снизить нагрев",
        actionLow: "Довести профиль до целевого окна",
        riskSlope: 14,
    }),
    cooling: Object.freeze({
        ccpMin: 15,
        ccpMax: 24,
        ccpLabel: "15..24°C (охлаждение после обжарки, норма)",
        threatHigh: "Слишком тепло при охлаждении — догарка и риск плесени",
        threatLow: "Слишком холодно — конденсат в зёрнах",
        economyHigh: "Потеря качества партии",
        economyLow: "Риск порчи при упаковке",
        inspectorHigh: "Отклонение по охлаждению",
        inspectorLow: "Отклонение по охлаждению",
        actionHigh: "Ускорить охлаждение (вентиляция / шок-кулер)",
        actionLow: "Стабилизировать температуру без перегрева/переохлаждения",
        riskSlope: 12,
    }),
});

/** Порог % риска: `>=` → `ai_status: "problem"`, иначе `"warning"`. См. `AI temperature functions.md`. */
const AI_STATUS_PROBLEM_MIN_RISK_PERCENT = 70;

const TEMPERATURE_PROFILES = Object.freeze({
    meat: MEAT_MODE_ANALYZER_PROFILES,
    coffee: COFFEE_TEMPERATURE_PROFILES,
    bread: Object.freeze({
        sponge_mix: BREAD_MODE_ANALYZER_PROFILES.sponge_mix,
        proofing: BREAD_MODE_ANALYZER_PROFILES.proofing,
        baking: BREAD_MODE_ANALYZER_PROFILES.baking,
        cooling: BREAD_MODE_ANALYZER_PROFILES.cooling,
    }),
});

// ═══════════════════════════════════════════════════════════════════════════
// ОБЩЕЕ — чистые функции: числа, риск, подписи (без привязки к нише)
// ═══════════════════════════════════════════════════════════════════════════

function parseFiniteNumber(value) {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : null;
    }

    if (typeof value !== "string") {
        return null;
    }

    const normalized = value.replace(",", ".").trim();
    if (!normalized) {
        return null;
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
}

function clampValue(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function roundToTwoDecimals(value) {
    return Math.round(value * 100) / 100;
}

function buildRangeLabel(min, max) {
    return `${min}..${max}°C`;
}

function calculateRiskFromDeviation(deviationFromLimit, riskSlope) {
    const slope = parseFiniteNumber(riskSlope) ?? 12;
    const rawRisk = Math.round(deviationFromLimit * slope);
    return clampValue(rawRisk, 1, 100);
}

function formatTemperatureValueForUi(value, withPlusSign = true) {
    const numeric = parseFiniteNumber(value);
    if (numeric == null) {
        return "—";
    }

    const rounded = roundToTwoDecimals(numeric);
    const sign = rounded > 0 && withPlusSign ? "+" : "";
    return `${sign}${rounded}°C`;
}

/**
 * Отклонение от диапазона «Суть задачи» (поля min/max задачи). Не влияет на выбор строки полосы в `breadBands.js`.
 *
 * @param {number|null} current
 * @param {number|null} rangeMin
 * @param {number|null} rangeMax
 * @returns {{ line: string }}
 */
function deviationFromTaskCcpRange(current, rangeMin, rangeMax) {
    const min = parseFiniteNumber(rangeMin);
    const max = parseFiniteNumber(rangeMax);
    if (min == null || max == null || current == null || !Number.isFinite(current)) {
        return { line: "" };
    }
    if (current >= min && current <= max) {
        return {
            line: `В диапазоне`,
        };
    }
    if (current > max) {
        const mag = roundToTwoDecimals(current - max);
        return {
            line: `Превышение: ${formatTemperatureValueForUi(mag, true)}`,
        };
    }
    // Ниже min: отклонение со знаком (24 °C при 25…35 → −1 °C), не модуль «+1».
    const delta = roundToTwoDecimals(current - min);
    return {
        line: `Понижение: ${formatTemperatureValueForUi(delta, false)}`,
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// МЯСО — тексты из полос (`meatBands.js`); без `eq-meat-*` — `DEFAULT_MEAT_AI_PROFILE_FALLBACK`
// ═══════════════════════════════════════════════════════════════════════════

function meatOutOfRangeBandTexts(temperatureC, mode, equipmentTargetIds) {
    const band = resolveMeatRowForTaskMeasurement(
        temperatureC,
        equipmentTargetIds,
        mode,
    );
    if (band && !meatBandMatchesTaskEquipment(band, equipmentTargetIds)) {
        return {
            threat: null,
            action: null,
            economy: null,
            inspector: null,
        };
    }
    return {
        threat: band?.threat ?? null,
        action: band?.action ?? null,
        economy: null,
        inspector: null,
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// КОФЕ — `DEFAULT_COFFEE_AI_PROFILE_FALLBACK` без оборудования; при `eq-coffee-*` — полосы + `COFFEE_TEMPERATURE_PROFILES` (локально)
// ═══════════════════════════════════════════════════════════════════════════

function coffeeOutOfRangeBandTexts(
    profileContext,
    direction,
    temperatureC,
    equipmentTargetIds,
) {
    const p = profileContext.profile;
    const high = direction === "too_high";
    const fromCoffeeProfile = () => ({
        threat: high ? p?.threatHigh ?? null : p?.threatLow ?? null,
        economy: high ? p?.economyHigh ?? null : p?.economyLow ?? null,
        inspector: high ? p?.inspectorHigh ?? null : p?.inspectorLow ?? null,
        action: high ? p?.actionHigh ?? null : p?.actionLow ?? null,
    });

    const row = resolveCoffeeRowForTaskMeasurement(
        temperatureC,
        equipmentTargetIds,
        profileContext.mode,
    );
    if (row && !coffeeBandMatchesTaskEquipment(row, equipmentTargetIds)) {
        return fromCoffeeProfile();
    }
    return {
        threat: row?.threat ?? null,
        action: row?.action ?? null,
        economy: null,
        inspector: null,
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// ТЕСТО (хлеб) — полосы `breadTemperatureThreatBands`; без `eq-bread-*` — `DEFAULT_BREAD_AI_PROFILE_FALLBACK`
// ═══════════════════════════════════════════════════════════════════════════

function breadOutOfRangeBandTexts(
    profileContext,
    direction,
    temperatureC,
    equipmentTargetIds,
) {
    const row = resolveBreadRowForTaskMeasurement(
        temperatureC,
        equipmentTargetIds,
        profileContext.mode,
    );
    if (row) {
        return {
            threat: row.threat ?? null,
            action: row.action ?? null,
            economy: null,
            inspector: null,
        };
    }
    const p = profileContext.profile;
    const high = direction === "too_high";
    return {
        threat: high ? p?.threatHigh ?? null : p?.threatLow ?? null,
        economy: high ? p?.economyHigh ?? null : p?.economyLow ?? null,
        inspector: high ? p?.inspectorHigh ?? null : p?.inspectorLow ?? null,
        action: high ? p?.actionHigh ?? null : p?.actionLow ?? null,
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// Прочие ниши — только поля профиля `threat*` / `action*` / …
// ═══════════════════════════════════════════════════════════════════════════

function profileOutOfRangeTexts(profile, direction) {
    const p = profile;
    const high = direction === "too_high";
    return {
        threat: high ? p?.threatHigh ?? null : p?.threatLow ?? null,
        economy: high ? p?.economyHigh ?? null : p?.economyLow ?? null,
        inspector: high ? p?.inspectorHigh ?? null : p?.inspectorLow ?? null,
        action: high ? p?.actionHigh ?? null : p?.actionLow ?? null,
    };
}

/**
 * [МЯСО | КОФЕ | ТЕСТО | …] Тексты при отклонении от CCP: диспетчер по `profileContext.niche`.
 */
function resolveOutOfRangeTextsForNiche(
    profileContext,
    direction,
    temperatureC,
    equipmentTargetIds,
) {
    if (profileContext.niche === "meat") {
        return meatOutOfRangeBandTexts(
            temperatureC,
            profileContext.mode,
            equipmentTargetIds,
        );
    }
    if (profileContext.niche === "coffee") {
        return coffeeOutOfRangeBandTexts(
            profileContext,
            direction,
            temperatureC,
            equipmentTargetIds,
        );
    }
    if (profileContext.niche === "bread") {
        return breadOutOfRangeBandTexts(
            profileContext,
            direction,
            temperatureC,
            equipmentTargetIds,
        );
    }
    return profileOutOfRangeTexts(profileContext.profile, direction);
}

// ═══════════════════════════════════════════════════════════════════════════
// МЯСО | КОФЕ | ТЕСТО — усиление `ai_status` до `problem` при `critical` в полосах
// ═══════════════════════════════════════════════════════════════════════════

function shouldForceProblemForMeatCriticalBand(value, mode, equipmentTargetIds) {
    const row = resolveMeatRowForTaskMeasurement(value, equipmentTargetIds, mode);
    if (!row) {
        return false;
    }
    if (!taskHasMeatEquipment(equipmentTargetIds)) {
        return row.status === "critical";
    }
    return (
        meatBandMatchesTaskEquipment(row, equipmentTargetIds) &&
        row.status === "critical"
    );
}

function shouldForceProblemForCoffeeCriticalBand(value, mode, equipmentTargetIds) {
    const row = resolveCoffeeRowForTaskMeasurement(value, equipmentTargetIds, mode);
    if (!row) {
        return false;
    }
    if (!taskHasCoffeeEquipment(equipmentTargetIds)) {
        return row.status === "critical";
    }
    return (
        coffeeBandMatchesTaskEquipment(row, equipmentTargetIds) &&
        row.status === "critical"
    );
}

function shouldForceProblemForBreadCriticalBand(value, mode, equipmentTargetIds) {
    const row = resolveBreadRowForTaskMeasurement(value, equipmentTargetIds, mode);
    if (!row) {
        return false;
    }
    if (!taskHasBreadEquipment(equipmentTargetIds)) {
        return row.status === "critical";
    }
    return (
        breadBandMatchesTaskEquipment(row, equipmentTargetIds) &&
        row.status === "critical"
    );
}

export class TemperatureAiAnalyzer {
    constructor(options = {}) {
        this.options = options;
    }

    /**
     * [ОБЩЕЕ] Экспорт `TEMPERATURE_PROFILES` для контрактов и тестов.
     */
    getProfiles() {
        return TEMPERATURE_PROFILES;
    }

    // ───────────────────────────────────────────────────────────────────────
    // ОБЩЕЕ — контекст профиля и диапазон CCP
    // ───────────────────────────────────────────────────────────────────────

    /**
     * [ОБЩЕЕ] Ниша + режим → объект профиля из `TEMPERATURE_PROFILES`.
     */
    resolveProfileContext(niche, mode) {
        const normalizedNiche = String(niche ?? "").trim();
        const normalizedMode = String(mode ?? "").trim();
        const nicheConfig = TEMPERATURE_PROFILES[normalizedNiche] ?? null;

        if (!nicheConfig) {
            return {
                niche: normalizedNiche || null,
                mode: normalizedMode || null,
                profile: null,
            };
        }

        if (normalizedMode && nicheConfig[normalizedMode]) {
            return {
                niche: normalizedNiche,
                mode: normalizedMode,
                profile: nicheConfig[normalizedMode],
            };
        }

        const defaultMode = Object.keys(nicheConfig)[0] ?? null;

        return {
            niche: normalizedNiche,
            mode: defaultMode,
            profile: defaultMode ? nicheConfig[defaultMode] : null,
        };
    }

    /**
     * [ОБЩЕЕ] Диапазон из задачи с fallback на профиль ниши.
     */
    resolveCcpRange(inputMin, inputMax, profile) {
        const profileMin = parseFiniteNumber(profile?.ccpMin);
        const profileMax = parseFiniteNumber(profile?.ccpMax);
        const inMin = parseFiniteNumber(inputMin);
        const inMax = parseFiniteNumber(inputMax);
        const rangeMin = inMin ?? profileMin;
        const rangeMax = inMax ?? profileMax;

        if (rangeMin == null || rangeMax == null) {
            return null;
        }

        if (rangeMin > rangeMax) {
            return null;
        }

        const boundsFromTask =
            inMin != null &&
            inMax != null &&
            Number.isFinite(inMin) &&
            Number.isFinite(inMax);
        const ccpLabel = boundsFromTask
            ? buildRangeLabel(rangeMin, rangeMax)
            : profile?.ccpLabel ?? buildRangeLabel(rangeMin, rangeMax);

        return {
            ccpMin: rangeMin,
            ccpMax: rangeMax,
            ccpLabel,
        };
    }

    // ───────────────────────────────────────────────────────────────────────
    // ОБЩЕЕ — ядро анализа по допуску задачи
    // ───────────────────────────────────────────────────────────────────────

    /**
     * [ОБЩЕЕ] Температура относительно CCP задачи; риск и тексты — через диспетчер ниш.
     */
    analyzeTemperature(params = {}) {
        const {
            niche,
            mode,
            currentValue,
            ccpMin: inputCcpMin,
            ccpMax: inputCcpMax,
            equipmentTargetIds,
        } = params;

        const profileContext = this.resolveProfileContext(niche, mode);
        const current = parseFiniteNumber(currentValue);
        const ccpMin = parseFiniteNumber(inputCcpMin);
        const ccpMax = parseFiniteNumber(inputCcpMax);

        if (profileContext.niche === "bread" && current != null) {
            const row = resolveBreadRowForTaskMeasurement(
                current,
                equipmentTargetIds,
                mode,
            );
            if (!row) {
                return {
                    status: "invalid",
                    niche: profileContext.niche,
                    mode: profileContext.mode,
                    value: current,
                    ccpMin: null,
                    ccpMax: null,
                    ccpLabel: profileContext.profile?.ccpLabel ?? "",
                    inRange: null,
                    direction: null,
                    deviationFromLimit: null,
                    risk: 0,
                    threat: null,
                    economy: null,
                    inspector: null,
                    action: null,
                    taskCcpDeviationLine: "",
                };
            }
            const taskRange = this.resolveCcpRange(ccpMin, ccpMax, profileContext.profile);
            const taskCcpDev = deviationFromTaskCcpRange(
                current,
                taskRange?.ccpMin,
                taskRange?.ccpMax,
            );
            const labelFromRow = row.temperatureLabel ?? "";
            const ccpLabelForUi =
                taskRange?.ccpLabel && String(taskRange.ccpLabel).trim() !== ""
                    ? taskRange.ccpLabel
                    : labelFromRow || profileContext.profile?.ccpLabel || "";
            if (row.status === "normal") {
                return {
                    status: "ok",
                    niche: profileContext.niche,
                    mode: profileContext.mode,
                    value: current,
                    ccpMin: taskRange?.ccpMin ?? null,
                    ccpMax: taskRange?.ccpMax ?? null,
                    ccpLabel: ccpLabelForUi,
                    inRange: true,
                    direction: "in_range",
                    deviationFromLimit: 0,
                    risk: 0,
                    threat: null,
                    economy: null,
                    inspector: null,
                    action: null,
                    taskCcpDeviationLine: taskCcpDev.line,
                };
            }
            const riskForUi = row.status === "critical" ? 100 : 55;
            return {
                status: "problem",
                niche: profileContext.niche,
                mode: profileContext.mode,
                value: current,
                ccpMin: taskRange?.ccpMin ?? null,
                ccpMax: taskRange?.ccpMax ?? null,
                ccpLabel: ccpLabelForUi,
                inRange: false,
                direction: row.status === "critical" ? "too_high" : "too_low",
                deviationFromLimit: roundToTwoDecimals(0),
                risk: riskForUi,
                threat: row.threat ?? null,
                economy: null,
                inspector: null,
                action: row.action ?? null,
                taskCcpDeviationLine: taskCcpDev.line,
            };
        }

        // Мясо: вердикт по полосе (`resolveMeatRowForTaskMeasurement`), как хлеб — иначе при попадании в min/max
        // задачи, но не в «норме» полосы, `getHaccpWarning` получал `analysis.status === "ok"` и возвращал `null`.
        if (profileContext.niche === "meat" && current != null) {
            const row = resolveMeatRowForTaskMeasurement(
                current,
                equipmentTargetIds,
                mode,
            );
            if (!row) {
                return {
                    status: "invalid",
                    niche: profileContext.niche,
                    mode: profileContext.mode,
                    value: current,
                    ccpMin: null,
                    ccpMax: null,
                    ccpLabel: profileContext.profile?.ccpLabel ?? "",
                    inRange: null,
                    direction: null,
                    deviationFromLimit: null,
                    risk: 0,
                    threat: null,
                    economy: null,
                    inspector: null,
                    action: null,
                    taskCcpDeviationLine: "",
                };
            }
            const taskRange = this.resolveCcpRange(ccpMin, ccpMax, profileContext.profile);
            const taskCcpDev = deviationFromTaskCcpRange(
                current,
                taskRange?.ccpMin,
                taskRange?.ccpMax,
            );
            const labelFromRow = row.temperatureLabel ?? "";
            const ccpLabelForUi =
                taskRange?.ccpLabel && String(taskRange.ccpLabel).trim() !== ""
                    ? taskRange.ccpLabel
                    : labelFromRow || profileContext.profile?.ccpLabel || "";
            if (row.status === "normal") {
                return {
                    status: "ok",
                    niche: profileContext.niche,
                    mode: profileContext.mode,
                    value: current,
                    ccpMin: taskRange?.ccpMin ?? null,
                    ccpMax: taskRange?.ccpMax ?? null,
                    ccpLabel: ccpLabelForUi,
                    inRange: true,
                    direction: "in_range",
                    deviationFromLimit: 0,
                    risk: 0,
                    threat: null,
                    economy: null,
                    inspector: null,
                    action: null,
                    taskCcpDeviationLine: taskCcpDev.line,
                };
            }
            const riskForUi = row.status === "critical" ? 100 : 55;
            return {
                status: "problem",
                niche: profileContext.niche,
                mode: profileContext.mode,
                value: current,
                ccpMin: taskRange?.ccpMin ?? null,
                ccpMax: taskRange?.ccpMax ?? null,
                ccpLabel: ccpLabelForUi,
                inRange: false,
                direction: row.status === "critical" ? "too_high" : "too_low",
                deviationFromLimit: roundToTwoDecimals(0),
                risk: riskForUi,
                threat: row.threat ?? null,
                economy: null,
                inspector: null,
                action: row.action ?? null,
                taskCcpDeviationLine: taskCcpDev.line,
            };
        }

        if (profileContext.niche === "coffee" && current != null) {
            const row = resolveCoffeeRowForTaskMeasurement(
                current,
                equipmentTargetIds,
                mode,
            );
            if (!row) {
                return {
                    status: "invalid",
                    niche: profileContext.niche,
                    mode: profileContext.mode,
                    value: current,
                    ccpMin: null,
                    ccpMax: null,
                    ccpLabel: profileContext.profile?.ccpLabel ?? "",
                    inRange: null,
                    direction: null,
                    deviationFromLimit: null,
                    risk: 0,
                    threat: null,
                    economy: null,
                    inspector: null,
                    action: null,
                    taskCcpDeviationLine: "",
                };
            }
            const taskRange = this.resolveCcpRange(ccpMin, ccpMax, profileContext.profile);
            const taskCcpDev = deviationFromTaskCcpRange(
                current,
                taskRange?.ccpMin,
                taskRange?.ccpMax,
            );
            const labelFromRow = row.temperatureLabel ?? "";
            const ccpLabelForUi =
                taskRange?.ccpLabel && String(taskRange.ccpLabel).trim() !== ""
                    ? taskRange.ccpLabel
                    : labelFromRow || profileContext.profile?.ccpLabel || "";
            if (row.status === "normal") {
                return {
                    status: "ok",
                    niche: profileContext.niche,
                    mode: profileContext.mode,
                    value: current,
                    ccpMin: taskRange?.ccpMin ?? null,
                    ccpMax: taskRange?.ccpMax ?? null,
                    ccpLabel: ccpLabelForUi,
                    inRange: true,
                    direction: "in_range",
                    deviationFromLimit: 0,
                    risk: 0,
                    threat: null,
                    economy: null,
                    inspector: null,
                    action: null,
                    taskCcpDeviationLine: taskCcpDev.line,
                };
            }
            const riskForUi = row.status === "critical" ? 100 : 55;
            return {
                status: "problem",
                niche: profileContext.niche,
                mode: profileContext.mode,
                value: current,
                ccpMin: taskRange?.ccpMin ?? null,
                ccpMax: taskRange?.ccpMax ?? null,
                ccpLabel: ccpLabelForUi,
                inRange: false,
                direction: row.status === "critical" ? "too_high" : "too_low",
                deviationFromLimit: roundToTwoDecimals(0),
                risk: riskForUi,
                threat: row.threat ?? null,
                economy: null,
                inspector: null,
                action: row.action ?? null,
                taskCcpDeviationLine: taskCcpDev.line,
            };
        }

        const range = this.resolveCcpRange(ccpMin, ccpMax, profileContext.profile);

        if (current == null || range == null) {
            return {
                status: "invalid",
                niche: profileContext.niche,
                mode: profileContext.mode,
                value: current,
                ccpMin: range?.ccpMin ?? null,
                ccpMax: range?.ccpMax ?? null,
                ccpLabel: range?.ccpLabel ?? profileContext.profile?.ccpLabel ?? "",
                inRange: null,
                direction: null,
                deviationFromLimit: null,
                risk: 0,
                threat: null,
                economy: null,
                inspector: null,
                action: null,
            };
        }

        const ccpLabel = range.ccpLabel || buildRangeLabel(range.ccpMin, range.ccpMax);
        const inRange = current >= range.ccpMin && current <= range.ccpMax;

        if (inRange) {
            const taskCcpDev = deviationFromTaskCcpRange(
                current,
                range.ccpMin,
                range.ccpMax,
            );
            return {
                status: "ok",
                niche: profileContext.niche,
                mode: profileContext.mode,
                value: current,
                ccpMin: range.ccpMin,
                ccpMax: range.ccpMax,
                ccpLabel,
                inRange: true,
                direction: "in_range",
                deviationFromLimit: 0,
                risk: 0,
                threat: null,
                economy: null,
                inspector: null,
                action: null,
                taskCcpDeviationLine: taskCcpDev.line,
            };
        }

        const direction = current > range.ccpMax ? "too_high" : "too_low";
        const deviationFromLimit =
            direction === "too_high"
                ? current - range.ccpMax
                : range.ccpMin - current;
        const risk = calculateRiskFromDeviation(
            deviationFromLimit,
            profileContext.profile?.riskSlope,
        );
        const texts = resolveOutOfRangeTextsForNiche(
            profileContext,
            direction,
            current,
            equipmentTargetIds,
        );

        const taskCcpDev = deviationFromTaskCcpRange(
            current,
            range.ccpMin,
            range.ccpMax,
        );
        return {
            status: "problem",
            niche: profileContext.niche,
            mode: profileContext.mode,
            value: current,
            ccpMin: range.ccpMin,
            ccpMax: range.ccpMax,
            ccpLabel,
            inRange: false,
            direction,
            deviationFromLimit: roundToTwoDecimals(deviationFromLimit),
            risk,
            ...texts,
            taskCcpDeviationLine: taskCcpDev.line,
        };
    }

    // ───────────────────────────────────────────────────────────────────────
    // ОБЩЕЕ — UI: предупреждение при отклонении (каркас + МЯСО | КОФЕ для critical)
    // ───────────────────────────────────────────────────────────────────────

    /**
     * [ОБЩЕЕ] Объект для строки замера при `problem` по CCP. Порог риска общий;
     * [МЯСО | КОФЕ | ТЕСТО]: `problem`, если полоса `critical` (кофе/хлеб — при совпадении equipment).
     */
    getHaccpWarning(params = {}) {
        const analysis = this.analyzeTemperature(params);

        if (!analysis || analysis.status !== "problem") {
            return null;
        }

        const risk = clampValue(Math.round(analysis.risk ?? 0), 0, 100);
        let ai_status =
            risk >= AI_STATUS_PROBLEM_MIN_RISK_PERCENT ? "problem" : "warning";
        if (analysis.niche === "meat") {
            if (
                shouldForceProblemForMeatCriticalBand(
                    analysis.value,
                    analysis.mode,
                    params.equipmentTargetIds,
                )
            ) {
                ai_status = "problem";
            }
        } else if (analysis.niche === "coffee") {
            if (
                shouldForceProblemForCoffeeCriticalBand(
                    analysis.value,
                    analysis.mode,
                    params.equipmentTargetIds,
                )
            ) {
                ai_status = "problem";
            }
        } else if (analysis.niche === "bread") {
            if (
                shouldForceProblemForBreadCriticalBand(
                    analysis.value,
                    analysis.mode,
                    params.equipmentTargetIds,
                )
            ) {
                ai_status = "problem";
            }
        }
        const directionLabel =
            analysis.direction === "too_high"
                ? "Превышение"
                : analysis.direction === "too_low"
                  ? "Понижение"
                  : "Отклонение";
        const headlineWord =
            analysis.direction === "too_high"
                ? "ПРЕВЫШЕНИЕ"
                : analysis.direction === "too_low"
                  ? "ПОНИЖЕНИЕ"
                  : "ОТКЛОНЕНИЕ";
        const currentFormatted = formatTemperatureValueForUi(analysis.value);
        const mag = analysis.deviationFromLimit;
        const deviationFormatted =
            analysis.direction === "too_high"
                ? formatTemperatureValueForUi(mag, true)
                : analysis.direction === "too_low"
                  ? formatTemperatureValueForUi(-mag, false)
                  : formatTemperatureValueForUi(mag, false);

        const deviationLineFromTaskCcp =
            (analysis.niche === "bread" ||
                analysis.niche === "meat" ||
                analysis.niche === "coffee") &&
            typeof analysis.taskCcpDeviationLine === "string" &&
            analysis.taskCcpDeviationLine.trim() !== ""
                ? analysis.taskCcpDeviationLine
                : null;
        const deviationLineBread =
            deviationLineFromTaskCcp ?? `${directionLabel}: ${deviationFormatted}`;

        return {
            ...DEMO_TEMPERATURE_MEASUREMENT_AI_WARNING_SHAPE,
            title: `${headlineWord}: ${risk}%`,
            ai_status,
            risk,
            niche: analysis.niche,
            mode: analysis.mode,
            ccpLabel: analysis.ccpLabel ?? "",
            currentLine: currentFormatted,
            deviationLine: deviationLineBread,
            threat: analysis.threat ?? "",
            economy: analysis.economy ?? "",
            inspector: analysis.inspector ?? "",
            action: analysis.action ?? "",
            direction: analysis.direction,
            value: analysis.value,
            ccpMin: analysis.ccpMin,
            ccpMax: analysis.ccpMax,
        };
    }

    // ───────────────────────────────────────────────────────────────────────
    // МЯСО | КОФЕ | ТЕСТО — UI: в норме по CCP, тексты из полос
    // ───────────────────────────────────────────────────────────────────────

    /**
     * [МЯСО | КОФЕ | ТЕСТО] В окне min/max задачи: тексты из полос;
     * [КОФЕ | ТЕСТО] без совпадения equipment — пустые threat/action.
     */
    getHaccpInRangeDisplay(params = {}) {
        const analysis = this.analyzeTemperature(params);
        if (!analysis || analysis.status !== "ok") {
            return null;
        }
        if (
            analysis.niche !== "meat" &&
            analysis.niche !== "coffee" &&
            analysis.niche !== "bread"
        ) {
            return null;
        }
        const currentFormatted = formatTemperatureValueForUi(analysis.value);
        if (analysis.niche === "meat") {
            const row = resolveMeatRowForTaskMeasurement(
                analysis.value,
                params.equipmentTargetIds,
                analysis.mode,
            );
            if (!row) {
                return null;
            }
            const useBandNarrative =
                !taskHasMeatEquipment(params.equipmentTargetIds) ||
                meatBandMatchesTaskEquipment(row, params.equipmentTargetIds);
            const taskDevLine =
                analysis.taskCcpDeviationLine &&
                analysis.taskCcpDeviationLine.trim() !== ""
                    ? analysis.taskCcpDeviationLine
                    : "—";
            return {
                ...DEMO_TEMPERATURE_MEASUREMENT_AI_WARNING_SHAPE,
                title: "В пределах CCP",
                ai_status: "ok",
                risk: 0,
                niche: analysis.niche,
                mode: analysis.mode,
                ccpLabel: analysis.ccpLabel ?? "",
                currentLine: currentFormatted,
                deviationLine: taskDevLine,
                threat: useBandNarrative ? row.threat ?? "" : "",
                economy: "",
                inspector: "",
                action: useBandNarrative ? row.action ?? "" : "",
                direction: "in_range",
                value: analysis.value,
                ccpMin: analysis.ccpMin,
                ccpMax: analysis.ccpMax,
            };
        }
        if (analysis.niche === "bread") {
            const row = resolveBreadRowForTaskMeasurement(
                analysis.value,
                params.equipmentTargetIds,
                analysis.mode,
            );
            if (!row) {
                return null;
            }
            const useBandNarrative =
                !taskHasBreadEquipment(params.equipmentTargetIds) ||
                breadBandMatchesTaskEquipment(row, params.equipmentTargetIds);
            const taskDevLine =
                analysis.taskCcpDeviationLine && analysis.taskCcpDeviationLine.trim() !== ""
                    ? analysis.taskCcpDeviationLine
                    : "—";
            return {
                ...DEMO_TEMPERATURE_MEASUREMENT_AI_WARNING_SHAPE,
                title: "В пределах CCP",
                ai_status: "ok",
                risk: 0,
                niche: analysis.niche,
                mode: analysis.mode,
                ccpLabel: analysis.ccpLabel ?? "",
                currentLine: currentFormatted,
                deviationLine: taskDevLine,
                threat: useBandNarrative ? row.threat ?? "" : "",
                economy: "",
                inspector: "",
                action: useBandNarrative ? row.action ?? "" : "",
                direction: "in_range",
                value: analysis.value,
                ccpMin: analysis.ccpMin,
                ccpMax: analysis.ccpMax,
            };
        }
        if (analysis.niche === "coffee") {
            const row = resolveCoffeeRowForTaskMeasurement(
                analysis.value,
                params.equipmentTargetIds,
                analysis.mode,
            );
            if (!row) {
                return null;
            }
            const useBandNarrative =
                !taskHasCoffeeEquipment(params.equipmentTargetIds) ||
                coffeeBandMatchesTaskEquipment(row, params.equipmentTargetIds);
            const taskDevLine =
                analysis.taskCcpDeviationLine &&
                analysis.taskCcpDeviationLine.trim() !== ""
                    ? analysis.taskCcpDeviationLine
                    : "—";
            return {
                ...DEMO_TEMPERATURE_MEASUREMENT_AI_WARNING_SHAPE,
                title: "В пределах CCP",
                ai_status: "ok",
                risk: 0,
                niche: analysis.niche,
                mode: analysis.mode,
                ccpLabel: analysis.ccpLabel ?? "",
                currentLine: currentFormatted,
                deviationLine: taskDevLine,
                threat: useBandNarrative ? row.threat ?? "" : "",
                economy: "",
                inspector: "",
                action: useBandNarrative ? row.action ?? "" : "",
                direction: "in_range",
                value: analysis.value,
                ccpMin: analysis.ccpMin,
                ccpMax: analysis.ccpMax,
            };
        }
        return null;
    }

    // ───────────────────────────────────────────────────────────────────────
    // ОБЩЕЕ — делегаты к модульным утилитам (совместимость, если вызывали с `this`)
    // ───────────────────────────────────────────────────────────────────────

    /** [ОБЩЕЕ] Парсинг числа для входных данных (делегат к `parseFiniteNumber`). */
    toFiniteNumber(value) {
        return parseFiniteNumber(value);
    }

    /** [ОБЩЕЕ] */
    clamp(value, min, max) {
        return clampValue(value, min, max);
    }

    /** [ОБЩЕЕ] */
    roundToTwo(value) {
        return roundToTwoDecimals(value);
    }

    /** [ОБЩЕЕ] */
    formatTemperatureValue(value, withPlusSign = true) {
        return formatTemperatureValueForUi(value, withPlusSign);
    }

    /** [ОБЩЕЕ] */
    buildRangeLabel(min, max) {
        return buildRangeLabel(min, max);
    }

    /** [ОБЩЕЕ] */
    calculateRisk(deviationFromLimit, riskSlope) {
        return calculateRiskFromDeviation(deviationFromLimit, riskSlope);
    }
}

/**
 * [ОБЩЕЕ] Фабрика экземпляра для UI-слоя.
 */
export const createTemperatureAiAnalyzer = (options = {}) =>
    new TemperatureAiAnalyzer(options);
