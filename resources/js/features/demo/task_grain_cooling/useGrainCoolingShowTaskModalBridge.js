import { shallowRef, watch } from 'vue';
import { useDemoState } from '@/features/demo/composables/useDemoState';
import { task_grain_cooling } from './config';
import { openShowTaskModalPendingDrawer } from './grainCoolingShowTaskModalPendingOpen';
import {
    getGrainCoolingTaskFromDemoState,
    resolveGrainCoolingTaskFromDemoState,
} from './resolveGrainCoolingTaskFromDemoState';
import { useGrainCoolingStore } from './grainCoolingDemoEntry';

/**
 * Связка модалки «Детали задачи» со сценарием оповещения зерна: Pinia, автооткрытие drawer после диплинка, открытие панели по pending.
 * В `ShowTaskModal.vue` — только вызов и короткие аргументы.
 *
 * @param {object} api
 * @param {() => boolean} api.getShow
 * @param {() => object|null|undefined} api.getTask
 * @param {import('vue').ComputedRef<boolean>} api.taskScheduledForFuture
 * @param {import('vue').ComputedRef<boolean>} api.isHotMode
 * @param {import('vue').Ref} api.pendingDrawerRef
 */
export function useGrainCoolingShowTaskModalBridge({
    getShow,
    getTask,
    taskScheduledForFuture,
    isHotMode,
    pendingDrawerRef,
}) {
    const { demoState } = useDemoState();
    const getTaskResolved = () => resolveGrainCoolingTaskFromDemoState(getTask(), demoState);

    const grainCoolingStoreRef = shallowRef(
        task_grain_cooling.scenarioProcessAllowed ? useGrainCoolingStore() : null,
    );
    watch(
        () => task_grain_cooling.scenarioProcessAllowed,
        (allowed) => {
            if (allowed && !grainCoolingStoreRef.value) {
                grainCoolingStoreRef.value = useGrainCoolingStore();
            }
            if (!allowed) {
                grainCoolingStoreRef.value = null;
            }
        },
    );

    async function onOpenPending(item, source = 'unknown') {
        await openShowTaskModalPendingDrawer({
            getTask: getTaskResolved,
            item,
            source,
            pendingDrawerRef,
            demoStateRef: demoState,
        });
    }

    async function tryAutoOpenPendingDrawerAfterDeepLink() {
        /** Нет целевой задачи с pending в демо-состоянии — сценарий не активен, автооткрытие не применимо (без логов). */
        if (!task_grain_cooling.scenarioProcessAllowed) {
            return;
        }
        const grainCoolingStore = grainCoolingStoreRef.value;
        if (!grainCoolingStore) {
            return;
        }
        const show = getShow();
        /** Задача зерна — только из `demoState` по `task_grain_cooling`, иначе снимок из модалки. */
        const task = getGrainCoolingTaskFromDemoState(demoState) ?? getTaskResolved();
        const future = taskScheduledForFuture.value;
        if (!show || !task) {
            return;
        }
        if (future || isHotMode.value) {
            return;
        }
        if (!grainCoolingStore.autoOpenPendingAfterTaskModal) {
            return;
        }
        if (task.id !== task_grain_cooling.id) {
            return;
        }
        /** Сразу после таймера problem: не открывать drawer по «следующему pending» — пользователь видит problem в таблице. */
        if (typeof task_grain_cooling.lastProblemAppliedMeasurementIndex === 'number') {
            task_grain_cooling.lastProblemAppliedMeasurementIndex = null;
            grainCoolingStore.clearAutoOpenPendingAfterTaskModal();
            return;
        }
        const measurements = Array.isArray(task.measurements) ? task.measurements : [];
        const lockedIdx = task_grain_cooling.measurementIndex;
        let pendingItem = null;
        if (typeof lockedIdx === 'number' && lockedIdx >= 0 && lockedIdx < measurements.length) {
            const row = measurements[lockedIdx];
            if (row?.status === 'pending') {
                pendingItem = row;
            }
        }
        if (!pendingItem) {
            const firstIdx = measurements.findIndex((m) => m?.status === 'pending');
            pendingItem = firstIdx >= 0 ? measurements[firstIdx] : null;
        }
        grainCoolingStore.clearAutoOpenPendingAfterTaskModal();
        if (!pendingItem) {
            return;
        }
        await onOpenPending(
            pendingItem,
            'авто: autoOpenPendingAfterTaskModal (после диплинка из тоста)',
        );
    }

    /**
     * Собирает реактивные источники для watch автооткрытия drawer: задача зерна из `checklistsByNiche` (без всего `demoState`),
     * модалка, флаги Pinia и поля `task_grain_cooling`, от которых зависит `tryAutoOpenPendingDrawerAfterDeepLink`.
     *
     * @returns {unknown[]}
     */
    function getGrainCoolingAutoOpenWatchSources() {
        const g = grainCoolingStoreRef.value;
        return [
            task_grain_cooling.scenarioProcessAllowed,
            task_grain_cooling.lastProblemAppliedMeasurementIndex,
            task_grain_cooling.measurementIndex,
            getShow(),
            getTask(),
            getGrainCoolingTaskFromDemoState(demoState),
            taskScheduledForFuture.value,
            isHotMode.value,
            g,
            g?.autoOpenPendingAfterTaskModal,
        ];
    }

    watch(
        getGrainCoolingAutoOpenWatchSources,
        () => {
            if (!task_grain_cooling.scenarioProcessAllowed) {
                return;
            }
            void tryAutoOpenPendingDrawerAfterDeepLink();
        },
        { flush: 'post', immediate: true },
    );

    return {
        onOpenPending,
        tryAutoOpenPendingDrawerAfterDeepLink,
    };
}
