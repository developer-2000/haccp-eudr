import { task_grain_cooling } from './config';

/**
 * Задача «Охлаждение зерна» только из `demoState` по `task_grain_cooling.id` / `niche` — единственный источник истины для замеров.
 *
 * @param {import('vue').Ref<object>} demoStateRef
 * @returns {object|null}
 */
export function getGrainCoolingTaskFromDemoState(demoStateRef) {
    const { id, niche } = task_grain_cooling;
    const list = demoStateRef.value?.checklistsByNiche?.[niche];
    if (!Array.isArray(list)) {
        return null;
    }
    return list.find((t) => t?.id === id) ?? null;
}

/**
 * Для модалки: если открыта задача зерна — подставить объект из `demoState`, иначе вернуть переданный `task`.
 *
 * @param {object|null|undefined} task — как в модалке (может быть снимок)
 * @param {import('vue').Ref<object>} demoStateRef
 * @returns {object|null|undefined}
 */
export function resolveGrainCoolingTaskFromDemoState(task, demoStateRef) {
    if (!task?.id || task.id !== task_grain_cooling.id) {
        return task;
    }
    return getGrainCoolingTaskFromDemoState(demoStateRef) ?? task;
}
