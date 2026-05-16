import { defineStore } from 'pinia';
import { task_grain_cooling } from './config';
import {
    finalizeGrainCoolingNotificationStorage,
    mergeGrainCoolingSessionStorage,
    readGrainCoolingSessionStorage,
} from './grainCoolingSessionStorage';

const STORAGE_KEY = task_grain_cooling.sessionStorageKey;

/**
 * @typedef {{ taskId: string, niche: string } | null} PendingDeepLink
 */

/**
 * Читает из `sessionStorage` флаг «глобальное оповещение уже показывали» и время запуска.
 * Ключ — `task_grain_cooling.sessionStorageKey` из конфига.
 *
 * @returns {{
 *   notificationLaunched: boolean,
 *   notificationLaunchedAt: string | null,
 *   notificationCountdownCompleted: boolean,
 *   notificationFlowLogicallyComplete: boolean,
 *   notificationProblemWindowMs: number | null,
 * } | null}
 *   Распарсенный объект или `null`, если данных нет / `sessionStorage` недоступен / ошибка парсинга.
 *   `notificationFlowLogicallyComplete` — оба: оповещение уже показывали **и** отсчёт после него доведён до конца (`notificationCountdownCompleted`);
 *   иначе после перезагрузки снова полная цепочка (оповещение + новый отсчёт до смены статуса).
 *   Полоса (`notificationBannerActive`) из хранилища **не** восстанавливается — только через `useGlobalTaskReminder`.
 */
function loadPersistedNotification() {
    try {
        if (typeof sessionStorage === 'undefined') {
            return null;
        }

        // Позволяет в тестовом режиме перезагружать страницу для отработки работы задачи
        if (task_grain_cooling.clearGrainCoolingSessionStorageBeforeLoad) {
            sessionStorage.removeItem(STORAGE_KEY);
            return null;
        }

        const data = readGrainCoolingSessionStorage();
        if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
            return null;
        }
        const launched = Boolean(data.notificationLaunched);
        const countdownDone = Boolean(data.notificationCountdownCompleted);
        const scenarioTaskDone = data.status === 'completed';
        /**
         * Полный цикл оповещения: тост + отсчёт до конца **или** пользователь внёс замер раньше таймера
         * (`status: "completed"` в storage через `finalizeGrainCoolingNotificationStorage`).
         */
        const flowComplete = (launched && countdownDone) || scenarioTaskDone;
        const rawWindow = data.notificationProblemWindowMs;
        const notificationProblemWindowMs =
            typeof rawWindow === 'number' && Number.isFinite(rawWindow) && rawWindow >= 0
                ? rawWindow
                : null;
        const out = {
            notificationLaunched: launched,
            notificationLaunchedAt:
                typeof data.notificationLaunchedAt === 'string'
                    ? data.notificationLaunchedAt
                    : null,
            notificationCountdownCompleted: countdownDone,
            notificationFlowLogicallyComplete: flowComplete,
            notificationProblemWindowMs,
            notificationLogicalCycleCompletedAt:
                typeof data.notificationLogicalCycleCompletedAt === 'string'
                    ? data.notificationLogicalCycleCompletedAt
                    : null,
        };
        return out;
    } catch {
        return null;
    }
}

/**
 * Pinia-store сценария «Охлаждение зерна»: персист флага оповещения и очередь диплинка в чек-листы.
 */
export const useTaskGrainCoolingStore = defineStore(task_grain_cooling.piniaStoreId, {
    state: () => {
        const persisted = loadPersistedNotification();
        const logicalComplete = Boolean(persisted?.notificationFlowLogicallyComplete);
        const launchedAtForUi =
            logicalComplete && typeof persisted?.notificationLaunchedAt === 'string'
                ? persisted.notificationLaunchedAt
                : null;
        task_grain_cooling.notificationLaunchedAt = launchedAtForUi;
        task_grain_cooling.notificationBannerActive = false;
        task_grain_cooling.notificationCountdownCompleted = Boolean(
            persisted?.notificationCountdownCompleted,
        );
        const initial = {
            /**
             * Оповещение уже было **для блокировки повторной цепочки** — только если полный цикл в storage завершён
             * (`notificationLaunched` + `notificationCountdownCompleted`), иначе после reload снова оповещение и новый отсчёт.
             */
            notificationLaunched: logicalComplete ?? false,
            /** ISO-время запуска оповещения; только если логически завершённый цикл, иначе `null` (новый отсчёт с нуля). */
            notificationLaunchedAt: launchedAtForUi,
            /**
             * Полоса: только `showNotificationBannerAfterToast()` из `useGlobalTaskReminder` сразу после оповещения (не из sessionStorage при init).
             */
            notificationBannerActive: false,
            /**
             * Отсчёт `measurementProblemDelayMs` после оповещения завершился (попытка смены статуса замера на `problem`).
             */
            notificationCountdownCompleted: Boolean(persisted?.notificationCountdownCompleted),
            /**
             * Запрос на открытие задачи из оповещения или полосы: после перехода на чек-листы
             * `ChecklistsSection` находит задачу и открывает модалку, затем сбрасывает в `null`.
             * @type {PendingDeepLink}
             */
            pendingDeepLink: /** @type {PendingDeepLink} */ (null),
            /**
             * Если `true`, после открытия `ShowTaskModal` нужно программно открыть drawer
             * по первому замеру со статусом `pending` (тот же сценарий, что клик по строке).
             */
            autoOpenPendingAfterTaskModal: false,
            /**
             * Окно до смены статуса на `problem` в мс, зафиксированное при показе оповещения (как у `setTimeout` в `useGlobalTaskReminder`).
             * `null` — до первого показа; после reload подтягивается из sessionStorage.
             */
            notificationProblemWindowMs:
                typeof persisted?.notificationProblemWindowMs === 'number'
                    ? persisted.notificationProblemWindowMs
                    : null,
            /**
             * ISO-время срабатывания таймера после оповещения (единственное «логическое завершение» цикла); пишется только там.
             */
            notificationLogicalCycleCompletedAt:
                typeof persisted?.notificationLogicalCycleCompletedAt === 'string'
                    ? persisted.notificationLogicalCycleCompletedAt
                    : null,
        };
        return initial;
    },

    actions: {
        /**
         * Снимок полей уведомления для merge в sessionStorage (промежуточные записи — без лога «завершен»).
         *
         * @returns {Record<string, unknown>}
         */
        notificationSnapshotForStorage() {
            return {
                notificationLaunched: this.notificationLaunched,
                notificationLaunchedAt: this.notificationLaunchedAt,
                notificationBannerActive: this.notificationBannerActive,
                notificationCountdownCompleted: this.notificationCountdownCompleted,
                notificationProblemWindowMs: this.notificationProblemWindowMs,
                notificationLogicalCycleCompletedAt: this.notificationLogicalCycleCompletedAt,
            };
        },

        /**
         * Промежуточный persist (тост, полоса, сброс до завершения). Только `mergeGrainCoolingSessionStorage`.
         *
         * @returns {void}
         */
        persistGrainCoolingSession() {
            task_grain_cooling.notificationCountdownCompleted = this.notificationCountdownCompleted;
            mergeGrainCoolingSessionStorage(this.notificationSnapshotForStorage());
        },

        /**
         * Фиксирует факт показа глобального оповещения: дальше `useGlobalTaskReminder` не запускает повторно цепочку с нуля.
         * Пишет `notificationLaunched` и ISO-время в state и в `sessionStorage`.
         *
         * @returns {void}
         */
        markNotificationLaunched() {
            this.notificationLaunched = true;
            this.notificationLaunchedAt = new Date().toISOString();
            this.notificationProblemWindowMs = task_grain_cooling.measurementProblemDelayMs;
            task_grain_cooling.notificationLaunchedAt = this.notificationLaunchedAt;
            this.persistGrainCoolingSession();
        },

        /**
         * Показать полосу под шапкой сразу после оповещения (не при старте SPA и не по отдельному таймеру полосы).
         *
         * @returns {void}
         */
        showNotificationBannerAfterToast() {
            if (!task_grain_cooling.scenarioProcessAllowed) {
                return;
            }
            this.notificationBannerActive = true;
            task_grain_cooling.notificationBannerActive = true;
            this.persistGrainCoolingSession();
        },

        /**
         * Скрыть полосу и убрать из sessionStorage.
         *
         * @returns {void}
         */
        clearNotificationBanner() {
            if (!this.notificationBannerActive) {
                return;
            }
            this.notificationBannerActive = false;
            task_grain_cooling.notificationBannerActive = false;
            this.persistGrainCoolingSession();
        },

        /**
         * Отсчёт после оповещения (`measurementProblemDelayMs`) дошёл до конца; вызывается из таймера в `useGlobalTaskReminder`
         * после попытки `applyGrainCoolingProblemIfPending` (смена статуса замера могла произойти или нет — не важно).
         * Единственная точка логического завершения цикла: `notificationCountdownCompleted`, метка времени в storage.
         *
         * @returns {void}
         */
        markNotificationCountdownCompleted() {
            this.notificationCountdownCompleted = true;
            task_grain_cooling.notificationCountdownCompleted = true;
            this.notificationLogicalCycleCompletedAt = new Date().toISOString();
            finalizeGrainCoolingNotificationStorage(this.notificationSnapshotForStorage());
        },

        /**
         * Сохраняет намерение открыть задачу на секции чек-листов (например после клика «Перейти к задаче» в оповещении или на полосе).
         * `ChecklistsSection` по `pendingDeepLink` переключает нишу и открывает модалку.
         *
         * @param {string} taskId — id задачи в `checklistsByNiche[niche]`.
         * @param {string} niche — ключ ниши (`coffee` и т.д.).
         * @param {{ autoOpenPending?: boolean }} [options]
         *   `autoOpenPending: true` — после открытия модалки открыть drawer по первому `pending` замеру.
         * @returns {void}
         */
        requestOpenTaskOnChecklists(taskId, niche, options = {}) {
            if (!task_grain_cooling.scenarioProcessAllowed) {
                return;
            }
            const autoOpenPending = Boolean(options.autoOpenPending);
            this.pendingDeepLink = { taskId, niche };
            this.autoOpenPendingAfterTaskModal = autoOpenPending;
        },

        /**
         * Сбрасывает очередь диплинка после того, как `ChecklistsSection` открыл задачу или решил, что задачи нет.
         *
         * @returns {void}
         */
        clearPendingDeepLink() {
            this.pendingDeepLink = null;
        },

        /**
         * Сбрасывает флаг автооткрытия drawer; вызывается из `ShowTaskModal` после попытки открыть pending.
         *
         * @returns {void}
         */
        clearAutoOpenPendingAfterTaskModal() {
            this.autoOpenPendingAfterTaskModal = false;
        },
    },
});
