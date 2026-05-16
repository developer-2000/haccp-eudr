import { task_grain_cooling } from './config';
import { finalizeGrainCoolingNotificationStorage } from './grainCoolingSessionStorage';
import { useTaskGrainCoolingStore } from './taskGrainCoolingStore';

const KEY = task_grain_cooling.sessionStorageKey;

/**
 * В `sessionStorage` (ключ `task_grain_cooling.sessionStorageKey`) уже записано логическое завершение
 * обновления данных по сценарию: `status: "completed"`. В этом случае **нельзя** выполнять дальнейшие
 * действия сценария (ни lock по pending, ни оповещение, ни таймеры) — только выход.
 *
 * @returns {boolean}
 */
export function isGrainCoolingScenarioStorageCompleted() {
    try {
        if (typeof sessionStorage === 'undefined') {
            return false;
        }
        const raw = sessionStorage.getItem(KEY);
        if (!raw) {
            return false;
        }
        const data = JSON.parse(raw);
        return data?.status === 'completed';
    } catch {
        return false;
    }
}

/**
 * После успешного ввода замера по задаче «Охлаждение зерна»: останавливаем таймеры оповещения,
 * фиксируем в Pinia и **в том же merge**, что и `persistGrainCoolingSession`, — завершение отсчёта
 * (`notificationCountdownCompleted`) и `status: "completed"`, без ожидания таймера `problem`.
 * Итоговая запись только через `finalizeGrainCoolingNotificationStorage` (один лог).
 *
 * @returns {void}
 */
export function markGrainCoolingScenarioStoredCompleted() {
    const cancel = task_grain_cooling.cancelGrainCoolingReminderTimers;
    if (typeof cancel === 'function') {
        cancel();
        task_grain_cooling.cancelGrainCoolingReminderTimers = null;
    }
    task_grain_cooling.scenarioProcessAllowed = false;
    task_grain_cooling.notificationBannerActive = false;

    const completedAt = new Date().toISOString();
    try {
        const store = useTaskGrainCoolingStore();
        store.notificationCountdownCompleted = true;
        store.notificationLogicalCycleCompletedAt = completedAt;
        task_grain_cooling.notificationCountdownCompleted = true;
        store.notificationBannerActive = false;

        finalizeGrainCoolingNotificationStorage({
            ...store.notificationSnapshotForStorage(),
            notificationBannerActive: false,
            notificationCountdownCompleted: true,
            notificationLogicalCycleCompletedAt: completedAt,
            status: 'completed',
        });
    } catch {
        finalizeGrainCoolingNotificationStorage({
            notificationCountdownCompleted: true,
            notificationLogicalCycleCompletedAt: completedAt,
            status: 'completed',
        });
    }
}
