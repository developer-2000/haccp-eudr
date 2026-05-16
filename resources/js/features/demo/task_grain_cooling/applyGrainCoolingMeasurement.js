import { task_grain_cooling, unlockGrainCoolingMeasurementIndex } from './config';
import { getGrainCoolingTaskAndMeasurementByRowIndex } from './grainCoolingIndexedAccess';
import { isGrainCoolingScenarioSuppressedForPath } from './grainCoolingPublicRoutes';
import { isGrainCoolingScenarioStorageCompleted } from './grainCoolingStorageStatus';
import { getGrainCoolingTaskFromDemoState } from './resolveGrainCoolingTaskFromDemoState';
import { LS_CONSENT_VERSION } from '@/config/storageNames';

/**
 * Обход `measurements` **по порядку с начала массива** (индекс 0, 1, …): первый элемент со
 * `status === 'pending'` — его индекс; иначе `-1`. С этим индексом дальше работает сценарий (lock / оповещение / смена статуса).
 *
 * @param {unknown[]} measurements
 * @returns {number}
 */
export function findFirstPendingMeasurementIndex(measurements) {
    if (!Array.isArray(measurements)) {
        return -1;
    }
    for (let i = 0; i < measurements.length; i++) {
        if (measurements[i]?.status === 'pending') {
            return i;
        }
    }
    return -1;
}

/**
 * Есть ли у демо-задачи из конфига хотя бы один замер со статусом `pending`.
 * Нужен до запуска глобального напоминания и сразу перед показом оповещения.
 * Без логов в консоль — чистая проверка (повторные вызовы по времени — норма).
 *
 * @param {import('vue').Ref<object>} demoStateRef
 * @returns {boolean}
 */
export function hasGrainCoolingPendingMeasurement(demoStateRef) {
    return getGrainCoolingFirstPendingMeasurementIndex(demoStateRef) >= 0;
}

/**
 * Разрешение сценария (строгий порядок):
 * `true` только если в `measurements` задачи есть `pending` (берётся **первый по порядку с начала массива**).
 * Флаг `status: "completed"` из sessionStorage в этом решении не участвует.
 *
 * @param {import('vue').Ref<object>} demoStateRef
 * @returns {boolean}
 */
export function grainCoolingScenarioShouldRun(demoStateRef) {
    const task = getGrainCoolingTaskFromDemoState(demoStateRef);
    const measurements = Array.isArray(task?.measurements) ? task.measurements : [];
    const firstPendingIndex = findFirstPendingMeasurementIndex(measurements);
    return firstPendingIndex >= 0;
}

/**
 * Синхронизирует флаг `task_grain_cooling.scenarioProcessAllowed`.
 * Сценарий разрешён только при выполнении **всех** условий:
 * 1. Пользователь принял consent-баннер (`LS_CONSENT_VERSION === "true"` в localStorage).
 * 2. У целевой задачи есть хотя бы один замер со статусом `pending` (первый с начала массива).
 * 3. Текущий путь — не публичная страница партии/отчёта (`grainCoolingPublicRoutes`).
 * 4. В `sessionStorage` ещё не зафиксировано логическое завершение сценария (`status: "completed"`).
 *
 * `false` — `useGlobalTaskReminder` не вешает оповещение и таймеры; `useGrainCoolingStore()` может вернуть `null`.
 *
 * @param {import('vue').Ref<object>} demoStateRef
 * @param {string | null | undefined} [pathname] — `window.location.pathname` или Inertia `page.url`.
 * @returns {void}
 */
export function syncGrainCoolingScenarioProcessAllowed(demoStateRef, pathname) {
    const consentAccepted =
        typeof localStorage !== 'undefined' && localStorage.getItem(LS_CONSENT_VERSION) === 'true';

    const dataOk = grainCoolingScenarioShouldRun(demoStateRef);
    const suppressed = pathname ? isGrainCoolingScenarioSuppressedForPath(pathname) : false;
    const storedDone = isGrainCoolingScenarioStorageCompleted();
    task_grain_cooling.scenarioProcessAllowed =
        consentAccepted && dataOk && !suppressed && !storedDone;
}

/**
 * Индекс **первого по порядку в массиве** замера со статусом `pending` у целевой задачи (`coffee-2`), иначе `-1`.
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
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
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

    const {
        task,
        measurementRow: current,
        measurements,
    } = getGrainCoolingTaskAndMeasurementByRowIndex(demoStateRef, measurementIndex);

    if (!task || measurementIndex >= measurements.length || current == null) {
        return false;
    }

    if (current?.status !== 'pending') {
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
    const {
        task,
        measurementRow: current,
        measurements,
    } = getGrainCoolingTaskAndMeasurementByRowIndex(demoStateRef, measurementIndex);

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
    if (current?.status !== 'pending') {
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
        idx === measurementIndex ? { ...m, status: 'problem' } : m,
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
