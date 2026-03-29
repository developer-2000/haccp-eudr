import { onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useDemoState } from "@/features/demo/composables/useDemoState";
import { syncGrainCoolingScenarioProcessAllowed } from "./applyGrainCoolingMeasurement";
import { task_grain_cooling } from "./config";
import { useTaskGrainCoolingStore } from "./taskGrainCoolingStore";
import { useGlobalTaskReminder } from "./useGlobalTaskReminder";

/** Флаг: `useGrainCoolingDemoEntry()` уже выполнен в текущей сессии SPA. */
let demoGrainCoolingEntryActive = false;

/**
 * Единственная точка входа сценария «Охлаждение зерна».
 * Вызывать один раз из `App.vue` — процесс стартует при заходе на сайт с любой страницы.
 *
 * `task_grain_cooling.scenarioProcessAllowed` — из `demoState` (pending у целевой задачи) **и** маршрута
 * (публичные `/batch/…`, `/report/…` с локалью — без оповещения).
 * Затем `useGlobalTaskReminder()` — при `scenarioProcessAllowed === false` цепочка не стартует;
 * при SPA-переходе на демо-страницу с `true` — стартует.
 */
export function useGrainCoolingDemoEntry() {
    if (demoGrainCoolingEntryActive) {
        return;
    }
    demoGrainCoolingEntryActive = true;

    const { demoState } = useDemoState();
    const route = useRoute();
    const grainStore = useTaskGrainCoolingStore();

    function syncAndReact() {
        syncGrainCoolingScenarioProcessAllowed(demoState, route);
        if (!task_grain_cooling.scenarioProcessAllowed) {
            grainStore.clearNotificationBanner();
            if (typeof task_grain_cooling.cancelGrainCoolingReminderTimers === "function") {
                task_grain_cooling.cancelGrainCoolingReminderTimers();
            }
        }
    }

    syncAndReact();

    watch(
        () => [demoState.value, route.fullPath],
        syncAndReact,
        { deep: true, immediate: false },
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
