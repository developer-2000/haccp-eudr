import { task_grain_cooling, unlockGrainCoolingMeasurementIndex } from "./config";
import { getGrainCoolingTaskAndMeasurementByRowIndex } from "./grainCoolingIndexedAccess";
import { getGrainCoolingTaskFromDemoState } from "./resolveGrainCoolingTaskFromDemoState";

/**
 * Первый индекс в `measurements`, где `status === 'pending'`, иначе -1.
 * @param {unknown[]} measurements
 * @returns {number}
 */
export function findFirstPendingMeasurementIndex(measurements) {
    if (!Array.isArray(measurements)) {
        return -1;
    }
    return measurements.findIndex((m) => m?.status === "pending");
}

/**
 * Есть ли у демо-задачи из конфига хотя бы один замер со статусом `pending`.
 * Нужен до запуска глобального напоминания и сразу перед показом тоста.
 * Без логов в консоль — чистая проверка (повторные вызовы по времени — норма).
 *
 * @param {import('vue').Ref<object>} demoStateRef
 * @returns {boolean}
 */
export function hasGrainCoolingPendingMeasurement(demoStateRef) {
    return getGrainCoolingFirstPendingMeasurementIndex(demoStateRef) >= 0;
}

/**
 * Синхронизирует `task_grain_cooling.scenarioProcessAllowed` с фактом наличия `pending` у целевой задачи в `demoState`.
 * Вызывать до любого доступа к Pinia store сценария.
 *
 * @param {import('vue').Ref<object>} demoStateRef
 * @returns {void}
 */
export function syncGrainCoolingScenarioProcessAllowed(demoStateRef) {
    task_grain_cooling.scenarioProcessAllowed =
        hasGrainCoolingPendingMeasurement(demoStateRef);
}

/**
 * Индекс первого замера со статусом `pending` у целевой задачи из конфига, иначе `-1`.
 *
 * @param {import('vue').Ref<object>} demoStateRef
 * @returns {number}
 */
export function getGrainCoolingFirstPendingMeasurementIndex(demoStateRef) {
    const task = getGrainCoolingTaskFromDemoState(demoStateRef);
    const measurements = Array.isArray(task?.measurements) ? task.measurements : [];
    return findFirstPendingMeasurementIndex(measurements);
}

/**
 * Локальное время пользователя в формате `HH:mm`, как в сидах замеров.
 *
 * @param {Date} [date]
 * @returns {string}
 */
function formatLocalTimeHHmm(date = new Date()) {
    const h = date.getHours();
    const m = date.getMinutes();
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Перед показом глобального оповещения: в `demoState` у замера с индексом `task_grain_cooling.measurementIndex`
 * подставляет текущее локальное время в поле `time` (иммутабельно), чтобы слот выглядел «сейчас».
 *
 * @param {import('vue').Ref<object>} demoStateRef
 * @returns {boolean} `true`, если `demoState` обновлён
 */
export function syncGrainCoolingPendingMeasurementTimeToUserLocal(demoStateRef) {
    const { id: taskId, niche } = task_grain_cooling;
    const measurementIndex = task_grain_cooling.measurementIndex;

    if (measurementIndex == null || measurementIndex < 0) {
        return false;
    }

    const { task, measurementRow: current, measurements } = getGrainCoolingTaskAndMeasurementByRowIndex(
        demoStateRef,
        measurementIndex,
    );

    if (!task || measurementIndex >= measurements.length || current == null) {
        return false;
    }

    if (current?.status !== "pending") {
        return false;
    }

    const state = demoStateRef.value;
    const tasks = state?.checklistsByNiche?.[niche];
    if (!Array.isArray(tasks)) {
        return false;
    }

    const localTime = formatLocalTimeHHmm(new Date());
    const nextMeasurements = measurements.map((m, idx) =>
        idx === measurementIndex ? { ...m, time: localTime } : m,
    );
    const nextTasks = tasks.map((t) =>
        t.id === taskId ? { ...t, measurements: nextMeasurements } : t,
    );

    demoStateRef.value = {
        ...state,
        checklistsByNiche: {
            ...state.checklistsByNiche,
            [niche]: nextTasks,
        },
    };
    return true;
}

/**
 * Выставляет `problem` только у замера с индексом `task_grain_cooling.measurementIndex`
 * Если к моменту вызова у этого элемента уже не `pending` — не трогает другие замеры и не ищет «следующий» pending.
 *
 * @param {import('vue').Ref<object>} demoStateRef — `demoState` из `useDemoState`
 * @returns {boolean} true, если мутация выполнена
 */
export function applyGrainCoolingProblemIfPending(demoStateRef) {
    // id и ниша целевой задачи — из единого конфига сценария
    const { id: taskId, niche } = task_grain_cooling;
    // Индекс строки замера, зафиксированный при старте таймера (lock), не пересчитываем здесь
    const measurementIndex = task_grain_cooling.measurementIndex;

    // Без валидного индекса менять demoState нельзя — сценарий не привязан к строке замера
    if (measurementIndex == null || measurementIndex < 0) {
        return false;
    }

    // Снимок задачи и массива measurements из demoState по зафиксированному индексу
    const { task, measurementRow: current, measurements } = getGrainCoolingTaskAndMeasurementByRowIndex(
        demoStateRef,
        measurementIndex,
    );

    // Задача с taskId не найдена в нише (или ниша пуста)
    if (!task) {
        unlockGrainCoolingMeasurementIndex();
        return false;
    }

    // Индекс устарел относительно длины массива или строка замера отсутствует
    if (measurementIndex >= measurements.length || current == null) {
        unlockGrainCoolingMeasurementIndex();
        return false;
    }

    // Меняем только pending → problem
    if (current?.status !== "pending") {
        unlockGrainCoolingMeasurementIndex();
        return false;
    }

    const state = demoStateRef.value;
    // Массив карточек задач в нише (копия из demoState для иммутабельного обновления)
    const tasks = state?.checklistsByNiche?.[niche];
    if (!Array.isArray(tasks)) {
        unlockGrainCoolingMeasurementIndex();
        return false;
    }

    // Новый массив measurements: только у нужного индекса status → "problem", остальные строки копируем как есть
    const nextMeasurements = measurements.map((m, idx) =>
        idx === measurementIndex ? { ...m, status: "problem" } : m,
    );
    // Подменяем measurements только у целевой задачи по id
    const nextTasks = tasks.map((t) =>
        t.id === taskId ? { ...t, measurements: nextMeasurements } : t,
    );

    // Иммутабельное обновление корня demoState и вложенного checklistsByNiche[niche]
    demoStateRef.value = {
        ...state,
        checklistsByNiche: {
            ...state.checklistsByNiche,
            [niche]: nextTasks,
        },
    };
    // Сохраняем индекс для UI (drawer/модалка), пока measurementIndex уже сброшен через unlock ниже
    task_grain_cooling.lastProblemAppliedMeasurementIndex = measurementIndex;
    // Снимаем lock: таймер отработал, дальнейшая логика не должна опираться на старый measurementIndex
    unlockGrainCoolingMeasurementIndex();
    return true;
}
