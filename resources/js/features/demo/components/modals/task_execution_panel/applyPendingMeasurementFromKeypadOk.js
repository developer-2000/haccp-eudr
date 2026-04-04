import { task_grain_cooling } from "@/features/demo/task_grain_cooling/config";
import {
    findMeasurementRowIndexByTime,
    isCurrentMeasurementRowPending,
} from "@/features/demo/task_grain_cooling/grainCoolingMeasurementRow";
import { markGrainCoolingScenarioStoredCompleted } from "@/features/demo/task_grain_cooling/grainCoolingStorageStatus";
import { createTemperatureAiAnalyzer } from "@/features/demo/ai/temperature/TemperatureAiAnalyzer";
import { parseTemperatureFromMeasurementValue } from "@/features/demo/ai/temperature/parseTemperatureFromMeasurementValue";
import {
    mapTaskNicheToAnalyzerNiche,
    resolveTaskNicheForTemperatureAi,
    resolveTemperatureAiMode,
} from "@/features/demo/ai/temperature/taskTemperatureAiContext";
import { resolveBreadRowForTaskMeasurement } from "@/features/demo/ai/temperature/breadBands";
import { resolveCoffeeRowForTaskMeasurement } from "@/features/demo/ai/temperature/coffeeBands";
import { resolveMeatRowForTaskMeasurement } from "@/features/demo/ai/temperature/meatBands";
import { readTaskTemperatureMinMaxC } from "@/features/demo/domain/checklistTaskModel";

const temperatureAiAnalyzer = createTemperatureAiAnalyzer();

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
    // Ссылка на элемент task.measurements[i], который мутируем (из drawer).
    const m = measurementRow;
    // Номер строки в списке замеров: ищем по времени слота (поле time).
    const measurementIndex = m && typeof m === "object" ? findMeasurementRowIndexByTime(task, m) : -1;
    // Копия строки замера до правок — чтобы при необходимости сравнить «было / стало».
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

    // Черновик с экранной клавиатуры до нормализации (строка).
    const raw = String(draft ?? "").trim();
    if (!raw || raw === "-" || raw === "." || raw === "-.") {
        return false;
    }

    // Тот же ввод, но запятая заменена на точку — так из строки надёжнее читается число.
    const normalized = raw.replace(",", ".");
    // Число из черновика: то же, что пользователь ввёл до форматирования в `… °C` для ячейки.
    const n = Number.parseFloat(normalized);
    if (!Number.isFinite(n)) {
        return false;
    }

    if (fieldType === "timer") {
        // Целые минуты из введённого числа (таймер, не температура).
        const mins = Math.max(0, Math.trunc(n));
        m.value = `${mins} мин`;
        m.status = "success";
        m.aiWarning = null;
        // Демо-сценарий «охлаждение зерна»: id задачи из config, чтобы закрыть сценарий в хранилище.
        if (task?.id === task_grain_cooling.id) {
            markGrainCoolingScenarioStoredCompleted();
        }
        return true;
    }

    if (fieldType !== "temperature") {
        return false;
    }

    // Лимиты °C из первого поля типа temperature задачи (или null, если поля нет).
    const limits = readTaskTemperatureMinMaxC(task);
    // Нижняя граница для сравнения с вводом и для AI.
    const minC = limits?.minC ?? null;
    // Верхняя граница для сравнения с вводом и для AI.
    const maxC = limits?.maxC ?? null;
    // Ввод не ниже min (если min задан).
    const withinMin = minC == null ? true : n >= minC;
    // Ввод не выше max (если max задан).
    const withinMax = maxC == null ? true : n <= maxC;
    // Попадание в допуск по обеим границам.
    const inRange = withinMin && withinMax;

    // Ниша задачи: task.niche или эвристика по id (нужна до вердикта по строке).
    const taskNiche = resolveTaskNicheForTemperatureAi(task);
    // Ключ профиля в анализаторе (bakery → bread).
    const analyzerNiche = mapTaskNicheToAnalyzerNiche(taskNiche);

    // Отображаемое значение с запятой как в UI локали задачи.
    const display = String(normalized).replace(".", ",");
    m.value = `${display} °C`;
    const currentValueFromMeasurement = parseTemperatureFromMeasurementValue(m.value);
    const aiMode = resolveTemperatureAiMode(
        task,
        analyzerNiche,
        currentValueFromMeasurement,
    );
    let statusOk = limits == null ? true : inRange;
    if (analyzerNiche === "bread") {
        const bandRow = resolveBreadRowForTaskMeasurement(
            n,
            task?.equipmentTargetIds,
            aiMode,
        );
        if (bandRow) {
            statusOk = bandRow.status === "normal";
        }
    }
    if (analyzerNiche === "meat") {
        const bandRow = resolveMeatRowForTaskMeasurement(
            n,
            task?.equipmentTargetIds,
            aiMode,
        );
        if (bandRow) {
            statusOk = bandRow.status === "normal";
        }
    }
    if (analyzerNiche === "coffee") {
        const bandRow = resolveCoffeeRowForTaskMeasurement(
            n,
            task?.equipmentTargetIds,
            aiMode,
        );
        if (bandRow) {
            statusOk = bandRow.status === "normal";
        }
    }
    m.status = statusOk ? "success" : "problem";
    // Вердикт AI в `m.aiWarning`: при success — мясо из полос «норма», при problem — предупреждение HACCP.
    let aiDisplay = null;
    if (currentValueFromMeasurement != null) {
        aiDisplay = statusOk
            ? temperatureAiAnalyzer.getHaccpInRangeDisplay({
                  niche: analyzerNiche,
                  mode: aiMode,
                  currentValue: currentValueFromMeasurement,
                  ccpMin: minC,
                  ccpMax: maxC,
                  equipmentTargetIds: task?.equipmentTargetIds,
              })
            : temperatureAiAnalyzer.getHaccpWarning({
                  niche: analyzerNiche,
                  mode: aiMode,
                  currentValue: currentValueFromMeasurement,
                  ccpMin: minC,
                  ccpMax: maxC,
                  equipmentTargetIds: task?.equipmentTargetIds,
              });
    }
    m.aiWarning = aiDisplay;
    if (task && typeof task === "object") {
        // Старый aiContext задачи, чтобы не потерять поля при частичном обновлении.
        const previousContext =
            task.aiContext && typeof task.aiContext === "object" ? task.aiContext : {};
        task.aiContext = {
            ...previousContext,
            engine: "temperature-v1",
            niche: taskNiche,
            mode: aiMode,
            taskType: "temperature",
            ccpMin: minC,
            ccpMax: maxC,
            ccpLabel: aiDisplay?.ccpLabel ?? previousContext.ccpLabel ?? "",
            updatedAt: new Date().toISOString(),
        };
    }

    // То же: завершение демо-сценария grain cooling после сохранения температурного замера.
    if (task?.id === task_grain_cooling.id) {
        markGrainCoolingScenarioStoredCompleted();
    }
    return true;
}
