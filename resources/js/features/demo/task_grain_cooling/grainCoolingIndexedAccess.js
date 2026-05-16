import { task_grain_cooling } from './config';
import { getGrainCoolingTaskFromDemoState } from './resolveGrainCoolingTaskFromDemoState';

/**
 * Поля `task_grain_cooling`, в которых хранится индекс строки в `task.measurements`.
 */
export const GRAIN_COOLING_MEASUREMENT_INDEX_FIELDS = Object.freeze([
    'measurementIndex',
    'lastProblemAppliedMeasurementIndex',
]);

/**
 * Рабочая схема: задача «Охлаждение зерна» из `demoState` по `task_grain_cooling.id` / `niche`,
 * затем строка замера по числовому индексу в `measurements`.
 *
 * @param {import('vue').Ref<object>} demoStateRef
 * @param {number} measurementRowIndex — индекс в `task.measurements`
 * @returns {{
 *   task: object | null,
 *   measurementRow: object | null,
 *   measurementRowIndex: number,
 *   measurements: unknown[],
 * }}
 */
export function getGrainCoolingTaskAndMeasurementByRowIndex(demoStateRef, measurementRowIndex) {
    const task = getGrainCoolingTaskFromDemoState(demoStateRef);
    const measurements = Array.isArray(task?.measurements) ? task.measurements : [];
    const idx =
        typeof measurementRowIndex === 'number' &&
        Number.isFinite(measurementRowIndex) &&
        measurementRowIndex >= 0
            ? measurementRowIndex
            : -1;
    if (!task || idx < 0) {
        return {
            task,
            measurementRow: null,
            measurementRowIndex: idx,
            measurements,
        };
    }
    if (idx >= measurements.length) {
        return {
            task,
            measurementRow: null,
            measurementRowIndex: idx,
            measurements,
        };
    }
    return {
        task,
        measurementRow: measurements[idx] ?? null,
        measurementRowIndex: idx,
        measurements,
    };
}

/**
 * Индекс строки замера берётся из поля `task_grain_cooling[indexField]`, затем — задача из `demoState` и строка замера.
 *
 * @param {import('vue').Ref<object>} demoStateRef
 * @param {'measurementIndex' | 'lastProblemAppliedMeasurementIndex'} indexField
 */
export function getGrainCoolingTaskAndMeasurementByConfigField(demoStateRef, indexField) {
    const raw = task_grain_cooling[indexField];
    const idx = typeof raw === 'number' && Number.isFinite(raw) && raw >= 0 ? raw : -1;
    if (idx < 0) {
        const task = getGrainCoolingTaskFromDemoState(demoStateRef);
        const measurements = Array.isArray(task?.measurements) ? task.measurements : [];
        return {
            task,
            measurementRow: null,
            measurementRowIndex: -1,
            measurements,
        };
    }
    return getGrainCoolingTaskAndMeasurementByRowIndex(demoStateRef, idx);
}
