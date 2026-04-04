import { createTemperatureAiAnalyzer } from "./TemperatureAiAnalyzer";
import {
    mapTaskNicheToAnalyzerNiche,
    resolveTaskNicheForTemperatureAi,
    resolveTemperatureAiMode,
} from "./taskTemperatureAiContext";
import {
    parseMeasurementTemperatureCAndSyncRowStatusToCcp,
    readTaskTemperatureMinMaxC,
} from "@/features/demo/domain/checklistTaskModel";

const analyzer = createTemperatureAiAnalyzer();

/**
 * Готовый вердикт AI по замеру хранится только в `task.measurements[].aiWarning` (объект задачи).
 * Если снимок уже есть и соответствует распарсенному °C — не пересчитываем (в т.ч. после load из storage).
 *
 * @param {object} row
 * @param {number} currentC
 * @returns {boolean}
 */
const measurementAiSnapshotMatchesValue = (row, currentC) => {
    const w = row?.aiWarning;
    if (!w || typeof w !== "object") {
        return false;
    }
    if (typeof w.value !== "number" || !Number.isFinite(w.value)) {
        return false;
    }
    return Math.round(w.value * 100) === Math.round(currentC * 100);
};

/**
 * Дополняет `task.aiContext` и только при отсутствии актуального снимка пересчитывает `measurements[].aiWarning`.
 *
 * @param {Record<string, unknown[]>|null|undefined} checklistsByNiche
 * @returns {void}
 */
export function seedChecklistsTemperatureAi(checklistsByNiche) {
    if (!checklistsByNiche || typeof checklistsByNiche !== "object") {
        return;
    }
    for (const nicheKey of Object.keys(checklistsByNiche)) {
        const list = checklistsByNiche[nicheKey];
        if (!Array.isArray(list)) {
            continue;
        }
        for (const task of list) {
            if (!task || typeof task !== "object") {
                continue;
            }
            const limits = readTaskTemperatureMinMaxC(task);
            if (!limits) {
                continue;
            }
            const { minC, maxC, ccpLabel: limitsLabel } = limits;
            const taskNiche = resolveTaskNicheForTemperatureAi(task) ?? nicheKey;
            const analyzerNiche = mapTaskNicheToAnalyzerNiche(taskNiche);
            const measurements = Array.isArray(task.measurements) ? task.measurements : [];
            let lastDisplay = null;
            let lastAiMode = resolveTemperatureAiMode(task, analyzerNiche);
            for (const row of measurements) {
                if (!row || typeof row !== "object") {
                    continue;
                }
                const current =
                    parseMeasurementTemperatureCAndSyncRowStatusToCcp(task, row);
                if (current == null) {
                    if (!Object.prototype.hasOwnProperty.call(row, "aiWarning")) {
                        row.aiWarning = null;
                    }
                    continue;
                }
                if (measurementAiSnapshotMatchesValue(row, current)) {
                    if (row.aiWarning) {
                        lastDisplay = row.aiWarning;
                    }
                    continue;
                }
                const aiMode = resolveTemperatureAiMode(task, analyzerNiche, current);
                lastAiMode = aiMode;
                const aiParams = {
                    niche: analyzerNiche,
                    mode: aiMode,
                    currentValue: current,
                    ccpMin: minC,
                    ccpMax: maxC,
                    equipmentTargetIds: task.equipmentTargetIds,
                };
                const display =
                    row.status === "success"
                        ? analyzer.getHaccpInRangeDisplay(aiParams)
                        : analyzer.getHaccpWarning(aiParams);
                row.aiWarning = display;
                if (display) {
                    lastDisplay = display;
                }
            }
            if (task.aiContext && typeof task.aiContext === "object") {
                task.aiContext = {
                    ...task.aiContext,
                    niche: task.niche ?? taskNiche,
                    mode: lastAiMode,
                    taskType: "temperature",
                    ccpMin: minC,
                    ccpMax: maxC,
                    ccpLabel: lastDisplay?.ccpLabel || limitsLabel || task.aiContext.ccpLabel || "",
                    engine: "temperature-v1",
                    updatedAt: new Date().toISOString(),
                };
            }
        }
    }
}
