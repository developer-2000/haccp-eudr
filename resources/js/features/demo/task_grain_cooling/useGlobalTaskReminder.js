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

/** События, по которым браузер разрешает «разблокировать» воспроизведение (политика autoplay). */
const AUDIO_UNLOCK_EVENTS = ["pointerdown", "keydown", "touchstart"];

let sharedReminderAudio = null;
let reminderAudioUnlocked = false;

function getSharedReminderAudio() {
    if (!sharedReminderAudio) {
        sharedReminderAudio = new Audio(task_grain_cooling.soundUrl);
        sharedReminderAudio.preload = "auto";
    }
    return sharedReminderAudio;
}

/**
 * Вызвать один раз из обработчика жеста пользователя (синхронно в цепочке события):
 * тихий `play()` → `pause()` снимает блок autoplay для этого `Audio`, дальше звук из таймера может играть.
 */
function unlockReminderAudioFromUserGesture() {
    if (reminderAudioUnlocked) {
        return;
    }
    const audio = getSharedReminderAudio();
    audio.volume = 0;
    audio.currentTime = 0;
    audio
        .play()
        .then(() => {
            audio.pause();
            audio.currentTime = 0;
            audio.volume = 1;
            reminderAudioUnlocked = true;
            detachReminderAudioUnlockListeners();
        })
        .catch(() => {});
}

function detachReminderAudioUnlockListeners() {
    for (const ev of AUDIO_UNLOCK_EVENTS) {
        window.removeEventListener(ev, unlockReminderAudioFromUserGesture, true);
    }
}

function attachReminderAudioUnlockListeners() {
    for (const ev of AUDIO_UNLOCK_EVENTS) {
        window.addEventListener(ev, unlockReminderAudioFromUserGesture, {
            capture: true,
            passive: true,
        });
    }
}

/**
 * Звук напоминания: один общий `Audio` после разблокировки жестом; иначе autoplay чаще всего глушится.
 */
export function playTaskReminderSound() {
    const audio = getSharedReminderAudio();
    audio.volume = 1;
    audio.currentTime = 0;
    audio.play().catch(() => {});
}

/**
 * Один раз за сессию (пока не сработал sessionStorage): при наличии `pending` у целевой задачи —
 * задержка из конфига → тост + звук; затем через `measurementProblemDelayMs` — `problem` у первого
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
        attachReminderAudioUnlockListeners();
        toastTimerId = window.setTimeout(() => {
            if (!hasGrainCoolingPendingMeasurement(demoState)) {
                unlockGrainCoolingMeasurementIndex();
                detachReminderAudioUnlockListeners();
                return;
            }
            syncGrainCoolingPendingMeasurementTimeToUserLocal(demoState);
            grainStore.markNotificationLaunched();
            playTaskReminderSound();
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
            }, task_grain_cooling.measurementProblemDelayMs);
        }, task_grain_cooling.initialToastDelayMs);
    });

    onUnmounted(() => {
        unlockGrainCoolingMeasurementIndex();
        detachReminderAudioUnlockListeners();
        if (toastTimerId !== null) {
            clearTimeout(toastTimerId);
        }
        if (problemTimerId !== null) {
            clearTimeout(problemTimerId);
        }
    });
}
