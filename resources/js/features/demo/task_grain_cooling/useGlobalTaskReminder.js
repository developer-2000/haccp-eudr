import { h, onMounted, onUnmounted } from "vue";
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
 * Перед входом в `useGlobalTaskReminder` уже выставлен `task_grain_cooling.scenarioProcessAllowed` из demoState.
 */
import { useTaskGrainCoolingStore } from "./taskGrainCoolingStore";
import {
    applyGrainCoolingProblemIfPending,
    getGrainCoolingFirstPendingMeasurementIndex,
    hasGrainCoolingPendingMeasurement,
    syncGrainCoolingPendingMeasurementTimeToUserLocal,
} from "./applyGrainCoolingMeasurement";

/**
 * Один раз за сессию (пока не сработал sessionStorage): при наличии `pending` у целевой задачи —
 * задержка из конфига → тост; затем через `measurementProblemDelayMs` — `problem` у первого
 * замера с **зафиксированным при старте** индексом в `task_grain_cooling.measurementIndex` — только если этот замер всё ещё `pending`.
 *
 * Сначала синхронная проверка `pending` по `demoState` (до Pinia store сценария и до любых таймеров);
 * затем `lockGrainCoolingMeasurementIndex` — индекс первого `pending` в `task_grain_cooling`. Если замеров `pending` нет —
 * composable выходит, хуки не вешаем.
 * Повторная проверка «есть ли ещё pending» — только в колбэке таймера тоста (перед показом); индекс для
 * `problem` не пересчитывается.
 */
export function useGlobalTaskReminder() {
    const { demoState } = useDemoState();

    if (!task_grain_cooling.scenarioProcessAllowed) {
        return;
    }

    const grainStore = useTaskGrainCoolingStore();

    /**
     * Полоса только в том же тике, что и показ тоста — после `toast(...)`; без тоста не вызывать.
     */
    function requestGrainCoolingBannerAfterNotificationSurface() {
        if (!task_grain_cooling.scenarioProcessAllowed) {
            return;
        }
        if (!hasGrainCoolingPendingMeasurement(demoState)) {
            return;
        }
        grainStore.showNotificationBannerAfterToast();
    }

    if (grainStore.notificationLaunched) {
        return;
    }

    const lockedIdx = getGrainCoolingFirstPendingMeasurementIndex(demoState);
    if (lockedIdx < 0) {
        return;
    }
    lockGrainCoolingMeasurementIndex(lockedIdx);

    let toastTimerId = null;
    let problemTimerId = null;
    /** Id тоста «Время выполнить задачу» — закрываем по окончании отсчёта, если пользователь не закрыл раньше. */
    let grainCoolingReminderToastId = null;

    onMounted(() => {
        if (grainStore.notificationLaunched) {
            unlockGrainCoolingMeasurementIndex();
            return;
        }
        toastTimerId = window.setTimeout(() => {
            if (!hasGrainCoolingPendingMeasurement(demoState)) {
                unlockGrainCoolingMeasurementIndex();
                return;
            }
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
    });

    onUnmounted(() => {
        unlockGrainCoolingMeasurementIndex();
        if (toastTimerId !== null) {
            clearTimeout(toastTimerId);
        }
        if (problemTimerId !== null) {
            clearTimeout(problemTimerId);
        }
    });
}
