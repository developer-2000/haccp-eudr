import { computed } from "vue";
import { task_grain_cooling } from "./config";
import { getGrainCoolingTaskFromDemoState } from "./resolveGrainCoolingTaskFromDemoState";

/**
 * Актуальная задача для UI модалки «Детали задачи»: для `task_grain_cooling.id` — только снимок из `demoState`.
 *
 * @param {{ task: object | null }} props
 * @param {import('vue').Ref<object>} demoStateRef
 */
export function useGrainCoolingShowTaskModalViewTask(props, demoStateRef) {
    return computed(() => {
        const p = props.task;
        if (!p?.id || p.id !== task_grain_cooling.id) {
            return p;
        }
        return getGrainCoolingTaskFromDemoState(demoStateRef) ?? p;
    });
}
