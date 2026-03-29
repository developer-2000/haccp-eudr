import { onUnmounted, watch } from "vue";
import { useDemoState } from "@/features/demo/composables/useDemoState";
import {
    hasGrainCoolingPendingMeasurement,
    syncGrainCoolingScenarioProcessAllowed,
} from "./applyGrainCoolingMeasurement";
import { task_grain_cooling } from "./config";
import { useTaskGrainCoolingStore } from "./taskGrainCoolingStore";
import { useGlobalTaskReminder } from "./useGlobalTaskReminder";

/** Флаг: `useGrainCoolingDemoEntry()` уже выполнен в текущей сессии SPA. */
let demoGrainCoolingEntryActive = false;

/**
 * Реакция на изменение `hasGrainCoolingPendingMeasurement`: обновляет `task_grain_cooling.scenarioProcessAllowed`
 * и сбрасывает полосу оповещения при переходе «раньше был pending → сейчас нет» (не при отсутствии прошлого `true`).
 *
 * @param {boolean} hasPending
 * @param {boolean|undefined} hadPending
 * @returns {void}
 */
function reactToGrainCoolingPendingPresenceChange(hasPending, hadPending) {
    task_grain_cooling.scenarioProcessAllowed = hasPending;
    if (hasPending) {
        return;
    }
    if (hadPending !== true) {
        return;
    }
    useTaskGrainCoolingStore().clearNotificationBanner();
}

/**
 * Единственная точка входа сценария «Охлаждение зерна».
 * Вызывать один раз из `App.vue` — процесс стартует при заходе на сайт с любой страницы.
 *
 * Сначала: `task_grain_cooling.scenarioProcessAllowed` из `demoState` (есть ли pending у целевой задачи).
 * Затем `useGlobalTaskReminder()` — при `scenarioProcessAllowed === false` store не подключается.
 */
export function useGrainCoolingDemoEntry() {
    if (demoGrainCoolingEntryActive) {
        return;
    }
    demoGrainCoolingEntryActive = true;

    const { demoState } = useDemoState();
    syncGrainCoolingScenarioProcessAllowed(demoState);
    if (!hasGrainCoolingPendingMeasurement(demoState)) {
        useTaskGrainCoolingStore().clearNotificationBanner();
    }
    watch(
        () => hasGrainCoolingPendingMeasurement(demoState),
        reactToGrainCoolingPendingPresenceChange,
    );

    useGlobalTaskReminder();

    onUnmounted(() => {
        demoGrainCoolingEntryActive = false;
        task_grain_cooling.scenarioProcessAllowed = false;
    });
}

/**
 * Pinia store сценария — только если `task_grain_cooling.scenarioProcessAllowed` и после `useGrainCoolingDemoEntry()`.
 * Иначе `null` (без установки store и без логов sessionStorage / pinia).
 */
export function useGrainCoolingStore() {
    if (!demoGrainCoolingEntryActive) {
        throw new Error(
            "[task_grain_cooling] useGrainCoolingStore: сначала useGrainCoolingDemoEntry() в App.vue",
        );
    }
    if (!task_grain_cooling.scenarioProcessAllowed) {
        return null;
    }
    return useTaskGrainCoolingStore();
}

/**
 * Подписка на `pendingDeepLink` для секции чек-листов. Вызывать из `setup` ChecklistsSection (один раз на экземпляр).
 * Внутренний watch на Pinia подключается только когда `task_grain_cooling.scenarioProcessAllowed === true`
 * (в т.ч. если флаг стал true позже при смене замеров в demoState).
 *
 * @param {() => void | Promise<void>} consumePendingDeepLink — обработчик из секции (открытие модалки по диплинку).
 */
export function registerGrainCoolingChecklistsDeepLinkWatcher(consumePendingDeepLink) {
    let stopPendingDeepLink = null;
    watch(
        () => task_grain_cooling.scenarioProcessAllowed,
        (allowed) => {
            if (stopPendingDeepLink) {
                stopPendingDeepLink();
                stopPendingDeepLink = null;
            }
            if (!allowed) {
                return;
            }
            const grainCoolingStore = useGrainCoolingStore();
            if (!grainCoolingStore) {
                return;
            }
            stopPendingDeepLink = watch(
                () => grainCoolingStore.pendingDeepLink,
                (p) => {
                    if (p) {
                        void consumePendingDeepLink();
                    }
                },
                { flush: "post", immediate: true },
            );
        },
        { immediate: true },
    );
}
