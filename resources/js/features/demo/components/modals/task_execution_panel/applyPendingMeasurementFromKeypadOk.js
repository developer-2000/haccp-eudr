import { task_grain_cooling } from "@/features/demo/task_grain_cooling/config";
import {
    findMeasurementRowIndexByTime,
    isCurrentMeasurementRowPending,
} from "@/features/demo/task_grain_cooling/grainCoolingMeasurementRow";
import { markGrainCoolingScenarioStoredCompleted } from "@/features/demo/task_grain_cooling/grainCoolingStorageStatus";

/**
 * Читает min/max °C из первого поля задачи типа `temperature` (как в drawer).
 *
 * @param {object|null|undefined} task
 * @returns {{ minC: number|null, maxC: number|null } | null}
 */
function readTemperatureLimitsFromTask(task) {
    const def = task?.taskFieldDefinitions?.[0] ?? null;
    if (!def || def.fieldType !== "temperature") {
        return null;
    }
    const cfg = def.config && typeof def.config === "object" ? def.config : {};
    const minC = Number(cfg.minC);
    const maxC = Number(cfg.maxC);
    return {
        minC: Number.isFinite(minC) ? minC : null,
        maxC: Number.isFinite(maxC) ? maxC : null,
    };
}

/**
 * Единственная точка применения кнопки ✓ экранной клавиатуры (`TaskExecutionTemperatureTimerPanel`):
 * по индексу строки в `task.measurements` пишет значение и меняет `pending` → `success` | `problem`.
 * Логирует индекс и снимок строки до изменения (проверочный вывод в консоль).
 *
 * @param {object} params
 * @param {object|null|undefined} params.task — задача из модалки
 * @param {object|null|undefined} params.measurementRow — ссылка на элемент `measurements[i]` (мутируется in-place)
 * @param {string} params.draft — черновик числа с клавиатуры
 * @param {'temperature'|'timer'|string|null|undefined} params.fieldType — тип поля drawer (`temperature` / `timer`)
 * @returns {boolean} `true`, если запись выполнена и drawer можно закрыть
 */
export function applyPendingMeasurementFromKeypadOk({
    task,
    measurementRow,
    draft,
    fieldType,
}) {
    const m = measurementRow;
    const measurementIndex = m && typeof m === "object" ? findMeasurementRowIndexByTime(task, m) : -1;
    const rowBefore =
        m && typeof m === "object"
            ? { ...m }
            : null;

    if (!m || typeof m !== "object") {
        return false;
    }

    if (!isCurrentMeasurementRowPending(task, m)) {
        return false;
    }

    const raw = String(draft ?? "").trim();
    if (!raw || raw === "-" || raw === "." || raw === "-.") {
        return false;
    }

    const normalized = raw.replace(",", ".");
    const n = Number.parseFloat(normalized);
    if (!Number.isFinite(n)) {
        return false;
    }

    if (fieldType === "timer") {
        const mins = Math.max(0, Math.trunc(n));
        m.value = `${mins} мин`;
        m.status = "success";
        if (task?.id === task_grain_cooling.id) {
            markGrainCoolingScenarioStoredCompleted();
        }
        return true;
    }

    if (fieldType !== "temperature") {
        return false;
    }

    const limits = readTemperatureLimitsFromTask(task);
    const minC = limits?.minC ?? null;
    const maxC = limits?.maxC ?? null;
    const withinMin = minC == null ? true : n >= minC;
    const withinMax = maxC == null ? true : n <= maxC;
    const inRange = withinMin && withinMax;

    const display = String(normalized).replace(".", ",");
    m.value = `${display} °C`;
    const statusOk = limits == null ? true : inRange;
    m.status = statusOk ? "success" : "problem";

    if (task?.id === task_grain_cooling.id) {
        markGrainCoolingScenarioStoredCompleted();
    }
    return true;
}
