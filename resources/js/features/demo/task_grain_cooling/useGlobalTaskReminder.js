import { h, onUnmounted, watch } from "vue";
import { toast } from "vue3-toastify";
import { useDemoState } from "@/features/demo/composables/useDemoState";
import GlobalTaskReminderToast from "./GlobalTaskReminderToast.vue";
import {
    lockGrainCoolingMeasurementIndex,
    task_grain_cooling,
    unlockGrainCoolingMeasurementIndex,
} from "./config";
/**
 * На демо цепочка запускается только из `grainCoolingDemoEntry.js` (`useGrainCoolingDemoEntry`); store здесь — напрямую, чтобы не плодить циклы импорта с обёрткой.
 * Перед входом в `useGlobalTaskReminder` уже выставлен `task_grain_cooling.scenarioProcessAllowed` из demoState и маршрута.
 */
import { useTaskGrainCoolingStore } from "./taskGrainCoolingStore";
import {
    applyGrainCoolingProblemIfPending,
    getGrainCoolingFirstPendingMeasurementIndex,
    hasGrainCoolingPendingMeasurement,
    syncGrainCoolingPendingMeasurementTimeToUserLocal,
} from "./applyGrainCoolingMeasurement";
import { readGrainCoolingSessionStorage } from "./grainCoolingSessionStorage";

/**
 * Один раз за сессию (пока не сработал sessionStorage): при наличии `pending` у целевой задачи —
 * задержка из конфига → глобальное оповещение; затем через `measurementProblemDelayMs` — смена статуса на `problem` у первого
 * замера с **зафиксированным при старте** индексом в `task_grain_cooling.measurementIndex` — только если этот замер всё ещё `pending`.
 *
 * Старт/стоп привязаны к `task_grain_cooling.scenarioProcessAllowed` (в т.ч. при SPA-переходе с публичной страницы на демо).
 */
export function useGlobalTaskReminder() {
    const { demoState } = useDemoState();

    let toastTimerId = null;
    let problemTimerId = null;
    /** Id окна глобального оповещения («Время выполнить задачу») — закрываем по окончании отсчёта, если пользователь не закрыл раньше. */
    let grainCoolingReminderToastId = null;

    function cancelGrainCoolingReminderTimersRegistered() {
        if (toastTimerId !== null) {
            clearTimeout(toastTimerId);
            toastTimerId = null;
        }
        if (problemTimerId !== null) {
            clearTimeout(problemTimerId);
            problemTimerId = null;
        }
        if (
            grainCoolingReminderToastId != null &&
            toast.isActive(grainCoolingReminderToastId)
        ) {
            toast.remove(grainCoolingReminderToastId);
        }
        grainCoolingReminderToastId = null;
        unlockGrainCoolingMeasurementIndex();
    }

    /**
     * Полоса только в том же тике, что и показ оповещения — после `toast(...)`; без показа оповещения не вызывать.
     */
    function requestGrainCoolingBannerAfterNotificationSurface() {
        if (!task_grain_cooling.scenarioProcessAllowed) {
            return;
        }
        if (!hasGrainCoolingPendingMeasurement(demoState)) {
            return;
        }
        const grainStore = useTaskGrainCoolingStore();
        grainStore.showNotificationBannerAfterToast();
    }

    function scheduleReminderChain() {
        if (!task_grain_cooling.scenarioProcessAllowed) {
            return;
        }
        if (toastTimerId !== null || problemTimerId !== null) {
            return;
        }

        const grainStore = useTaskGrainCoolingStore();

        if (grainStore.notificationLaunched) {
            return;
        }

        const lockedIdx = getGrainCoolingFirstPendingMeasurementIndex(demoState);
        if (lockedIdx < 0) {
            return;
        }
        lockGrainCoolingMeasurementIndex(lockedIdx);

        task_grain_cooling.cancelGrainCoolingReminderTimers =
            cancelGrainCoolingReminderTimersRegistered;

        toastTimerId = window.setTimeout(() => {
            toastTimerId = null;
            if (!task_grain_cooling.scenarioProcessAllowed) {
                unlockGrainCoolingMeasurementIndex();
                return;
            }
            if (!hasGrainCoolingPendingMeasurement(demoState)) {
                unlockGrainCoolingMeasurementIndex();
                return;
            }
            const storageSnapshotBeforeToast = readGrainCoolingSessionStorage();
            // console.log(
            //     "Старая запись sessionStorage из прошлой сессии:",
            //     storageSnapshotBeforeToast,
            // );
            syncGrainCoolingPendingMeasurementTimeToUserLocal(demoState);
            grainStore.markNotificationLaunched();
            const problemDelayMs =
                grainStore.notificationProblemWindowMs ??
                task_grain_cooling.measurementProblemDelayMs;
            grainCoolingReminderToastId = toast(
                ({ closeToast }) =>
                    h(GlobalTaskReminderToast, { closeToast }),
                {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: false,
                    closeButton: false,
                    closeOnClick: false,
                    hideProgressBar: true,
                    pauseOnHover: true,
                    draggable: false,
                    icon: false,
                    theme: "dark",
                    toastClassName: task_grain_cooling.toastifyToastClassName,
                },
            );
            requestGrainCoolingBannerAfterNotificationSurface();
            problemTimerId = window.setTimeout(() => {
                problemTimerId = null;
                if (!task_grain_cooling.scenarioProcessAllowed) {
                    return;
                }
                applyGrainCoolingProblemIfPending(demoState);
                if (
                    grainCoolingReminderToastId != null &&
                    toast.isActive(grainCoolingReminderToastId)
                ) {
                    toast.remove(grainCoolingReminderToastId);
                }
                grainCoolingReminderToastId = null;
                grainStore.markNotificationCountdownCompleted();
            }, problemDelayMs);
        }, task_grain_cooling.initialToastDelayMs);
    }

    watch(
        () => task_grain_cooling.scenarioProcessAllowed,
        (allowed) => {
            if (!allowed) {
                task_grain_cooling.cancelGrainCoolingReminderTimers = null;
                cancelGrainCoolingReminderTimersRegistered();
                return;
            }
            scheduleReminderChain();
        },
        { immediate: true },
    );

    onUnmounted(() => {
        task_grain_cooling.cancelGrainCoolingReminderTimers = null;
        cancelGrainCoolingReminderTimersRegistered();
    });
}
