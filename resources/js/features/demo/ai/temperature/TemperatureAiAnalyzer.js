import { DEMO_TEMPERATURE_MEASUREMENT_AI_WARNING_SHAPE } from "@/features/demo/task_grain_cooling/config";
import { resolveMeatStorageBand } from "./meatStorageThreatBands";

/** Порог % риска: `>=` → `ai_status: "problem"`, иначе `"warning"`. См. `AI temperature functions.md`. */
const AI_STATUS_PROBLEM_MIN_RISK_PERCENT = 70;

const TEMPERATURE_PROFILES = Object.freeze({
    /** Тексты угроз/действий для мяса — только в `meatStorageThreatBands.js`; здесь окно CCP и наклон риска. */
    meat: Object.freeze({
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
    }),
    coffee: Object.freeze({
        storage: Object.freeze({
            ccpMin: 15,
            ccpMax: 25,
            ccpLabel: "15..25°C (хранение зерна)",
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
    }),
    bread: Object.freeze({
        proofing: Object.freeze({
            ccpMin: 24,
            ccpMax: 28,
            ccpLabel: "24..28°C (тесто/расстойка)",
            threatHigh: "Перерасстойка и рост микробиологических рисков",
            threatLow: "Недорасстойка и нарушение технологического режима",
            economyHigh: "Потеря выхода и ухудшение качества партии",
            economyLow: "Брак по структуре и повторный цикл производства",
            inspectorHigh: "Отклонение технологического CCP по температуре",
            inspectorLow: "Отклонение технологического CCP по температуре",
            actionHigh: "Снизить температуру камеры и скорректировать цикл",
            actionLow: "Поднять температуру и скорректировать время расстойки",
            riskSlope: 14,
        }),
    }),
});

export class TemperatureAiAnalyzer {
    /**
     * Создает экземпляр анализатора температуры.
     * Используется как единая точка хранения профилей и публичных методов AI-аналитики.
     */
    constructor(options = {}) {
        this.options = options;
    }

    /**
     * Возвращает базовые профили ниш и режимов.
     * Используется как структурный контракт для дальнейшего наполнения нормативами и рисками.
     */
    getProfiles() {
        return TEMPERATURE_PROFILES;
    }

    /**
     * Анализирует температурный показатель относительно диапазона задачи.
     * Используется как основное ядро вычислений AI для модалки задачи.
     */
    analyzeTemperature(params = {}) {
        const {
            niche,
            mode,
            currentValue,
            ccpMin: inputCcpMin,
            ccpMax: inputCcpMax,
        } = params;

        const profileContext = this.resolveProfileContext(niche, mode);
        const current = this.toFiniteNumber(currentValue);
        const ccpMin = this.toFiniteNumber(inputCcpMin);
        const ccpMax = this.toFiniteNumber(inputCcpMax);
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

        const ccpLabel = range.ccpLabel || this.buildRangeLabel(range.ccpMin, range.ccpMax);
        const inRange = current >= range.ccpMin && current <= range.ccpMax;

        if (inRange) {
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
            };
        }

        const direction = current > range.ccpMax ? "too_high" : "too_low";
        const deviationFromLimit =
            direction === "too_high"
                ? current - range.ccpMax
                : range.ccpMin - current;
        const risk = this.calculateRisk(deviationFromLimit, profileContext.profile?.riskSlope);
        const texts = this.resolveOutOfRangeTexts(
            profileContext,
            direction,
            current,
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
            deviationFromLimit: this.roundToTwo(deviationFromLimit),
            risk,
            ...texts,
        };
    }

    /**
     * Тексты при отклонении от CCP: мясо — `meatStorageThreatBands`, иначе поля профиля ниши.
     */
    resolveOutOfRangeTexts(profileContext, direction, temperatureC) {
        if (profileContext.niche === "meat") {
            const band = resolveMeatStorageBand(temperatureC, profileContext.mode);
            return {
                threat: band?.threat ?? null,
                action: band?.action ?? null,
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

    /**
     * Формирует объект предупреждения для UI.
     * Используется для подготовки данных рендера в модалке без бизнес-логики в компоненте.
     */
    getHaccpWarning(params = {}) {
        const analysis = this.analyzeTemperature(params);

        if (!analysis || analysis.status !== "problem") {
            return null;
        }

        const risk = this.clamp(Math.round(analysis.risk ?? 0), 0, 100);
        const ai_status =
            risk >= AI_STATUS_PROBLEM_MIN_RISK_PERCENT ? "problem" : "warning";
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
        const currentFormatted = this.formatTemperatureValue(analysis.value);
        const mag = analysis.deviationFromLimit;
        const deviationFormatted =
            analysis.direction === "too_high"
                ? this.formatTemperatureValue(mag, true)
                : analysis.direction === "too_low"
                  ? this.formatTemperatureValue(-mag, false)
                  : this.formatTemperatureValue(mag, false);

        return {
            ...DEMO_TEMPERATURE_MEASUREMENT_AI_WARNING_SHAPE,
            title: `${headlineWord}: ${risk}%`,
            ai_status,
            risk,
            niche: analysis.niche,
            mode: analysis.mode,
            ccpLabel: analysis.ccpLabel ?? "",
            currentLine: currentFormatted,
            deviationLine: `${directionLabel}: ${deviationFormatted}`,
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

    /**
     * Вердикт AI при попадании в CCP (только ниша `meat`): тексты из `meatStorageThreatBands`.
     * Остальные ниши — `null` (блок AI на строке не показываем).
     */
    getHaccpInRangeDisplay(params = {}) {
        const analysis = this.analyzeTemperature(params);
        if (!analysis || analysis.status !== "ok") {
            return null;
        }
        if (analysis.niche !== "meat") {
            return null;
        }
        const band = resolveMeatStorageBand(analysis.value, analysis.mode);
        if (!band) {
            return null;
        }
        const currentFormatted = this.formatTemperatureValue(analysis.value);
        return {
            ...DEMO_TEMPERATURE_MEASUREMENT_AI_WARNING_SHAPE,
            title: "В пределах CCP",
            ai_status: "ok",
            risk: 0,
            niche: analysis.niche,
            mode: analysis.mode,
            ccpLabel: analysis.ccpLabel ?? "",
            currentLine: currentFormatted,
            deviationLine: "Показание в норме",
            threat: band.threat ?? "",
            economy: "",
            inspector: "",
            action: band.action ?? "",
            direction: "in_range",
            value: analysis.value,
            ccpMin: analysis.ccpMin,
            ccpMax: analysis.ccpMax,
        };
    }

    /**
     * Разрешает целевой профиль по нише и режиму.
     * Используется для безопасного выбора конфигурации с fallback на дефолтный режим ниши.
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
     * Приводит значение к конечному числу.
     * Используется для унификации входных данных и безопасной проверки диапазонов.
     */
    toFiniteNumber(value) {
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

    /**
     * Определяет рабочий диапазон CCP.
     * Используется для приоритета диапазона из задачи и fallback к профилю ниши.
     */
    resolveCcpRange(inputMin, inputMax, profile) {
        const profileMin = this.toFiniteNumber(profile?.ccpMin);
        const profileMax = this.toFiniteNumber(profile?.ccpMax);
        const rangeMin = inputMin ?? profileMin;
        const rangeMax = inputMax ?? profileMax;

        if (rangeMin == null || rangeMax == null) {
            return null;
        }

        if (rangeMin > rangeMax) {
            return null;
        }

        return {
            ccpMin: rangeMin,
            ccpMax: rangeMax,
            ccpLabel: profile?.ccpLabel ?? this.buildRangeLabel(rangeMin, rangeMax),
        };
    }

    /**
     * Рассчитывает риск по отклонению от допустимой границы.
     * Используется для перевода величины отклонения в процентный риск 0..100.
     */
    calculateRisk(deviationFromLimit, riskSlope) {
        const slope = this.toFiniteNumber(riskSlope) ?? 12;
        const rawRisk = Math.round(deviationFromLimit * slope);
        return this.clamp(rawRisk, 1, 100);
    }

    /**
     * Ограничивает значение заданным диапазоном.
     * Используется для защиты итоговых чисел от выхода за допустимые пределы.
     */
    clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    /**
     * Округляет число до двух знаков после запятой.
     * Используется для стабильного отображения числовых отклонений.
     */
    roundToTwo(value) {
        return Math.round(value * 100) / 100;
    }

    /**
     * Форматирует температурное значение для человекочитаемого UI.
     * Используется для единообразного отображения текущего значения и отклонения.
     */
    formatTemperatureValue(value, withPlusSign = true) {
        const numeric = this.toFiniteNumber(value);
        if (numeric == null) {
            return "—";
        }

        const rounded = this.roundToTwo(numeric);
        const sign = rounded > 0 && withPlusSign ? "+" : "";
        return `${sign}${rounded}°C`;
    }

    /**
     * Формирует человекочитаемую подпись диапазона.
     * Используется когда явный label не передан в профиле.
     */
    buildRangeLabel(min, max) {
        return `${min}..${max}°C`;
    }
}

/**
 * Создает экземпляр TemperatureAiAnalyzer.
 * Используется для централизованного и удобного подключения анализатора в UI-слое.
 */
export const createTemperatureAiAnalyzer = (options = {}) =>
    new TemperatureAiAnalyzer(options);
