import { defineStore } from "pinia";
import { task_grain_cooling } from "./config";

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
 * } | null}
 *   Распарсенный объект или `null`, если данных нет / `sessionStorage` недоступен / ошибка парсинга.
 *   `notificationFlowLogicallyComplete` — оба: тост уже был **и** отсчёт после тоста доведён до конца (`notificationCountdownCompleted`);
 *   иначе после перезагрузки снова показываем полную цепочку (тост + новый отсчёт).
 *   Полоса (`notificationBannerActive`) из хранилища **не** восстанавливается — только через `useGlobalTaskReminder`.
 */
function loadPersistedNotification() {
    try {
        if (typeof sessionStorage === "undefined") {
            return null;
        }

        // Позволяет в тестовом режиме перезагружать страницу для отработки работы задачи
        if (task_grain_cooling.clearGrainCoolingSessionStorageBeforeLoad) {
            sessionStorage.removeItem(STORAGE_KEY);
        }

        const raw = sessionStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return null;
        }
        const data = JSON.parse(raw);
        if (!data || typeof data !== "object") {
            return null;
        }
        const launched = Boolean(data.notificationLaunched);
        const countdownDone = Boolean(data.notificationCountdownCompleted);
        /** Не сырой `notificationLaunched`, а «сценарий оповещения довели до конца» — иначе при reload снова тост + таймеры. */
        const flowComplete = launched && countdownDone;
        const out = {
            notificationLaunched: launched,
            notificationLaunchedAt:
                typeof data.notificationLaunchedAt === "string"
                    ? data.notificationLaunchedAt
                    : null,
            notificationCountdownCompleted: countdownDone,
            notificationFlowLogicallyComplete: flowComplete,
        };
        return out;
    } catch (e) {
        return null;
    }
}

/**
 * Сохраняет в `sessionStorage` состояние оповещения (один раз за показ тоста).
 *
 * @param {{ notificationLaunched: boolean, notificationLaunchedAt: string | null, notificationBannerActive?: boolean, notificationCountdownCompleted?: boolean }} payload
 * @returns {void}
 */
function persistNotification(payload) {
    try {
        if (typeof sessionStorage === "undefined") {
            return;
        }
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
        void e;
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
            logicalComplete && typeof persisted?.notificationLaunchedAt === "string"
                ? persisted.notificationLaunchedAt
                : null;
        task_grain_cooling.notificationLaunchedAt = launchedAtForUi;
        task_grain_cooling.notificationBannerActive = false;
        task_grain_cooling.notificationCountdownCompleted = Boolean(
            persisted?.notificationCountdownCompleted,
        );
        return {
            /**
             * «Тост уже был» **для блокировки повторной цепочки** — только если полный цикл в storage завершён
             * (`notificationLaunched` + `notificationCountdownCompleted`), иначе после reload снова тост и новый отсчёт.
             */
            notificationLaunched: logicalComplete ?? false,
            /** ISO-время запуска оповещения; только если логически завершённый цикл, иначе `null` (новый отсчёт с нуля). */
            notificationLaunchedAt: launchedAtForUi,
            /**
             * Полоса: только `showNotificationBannerAfterToast()` из `useGlobalTaskReminder` (не из sessionStorage при init).
             */
            notificationBannerActive: false,
            /**
             * Отсчёт `measurementProblemDelayMs` после тоста завершился (таймер `problem` отработал).
             */
            notificationCountdownCompleted: Boolean(persisted?.notificationCountdownCompleted),
            /**
             * Запрос на открытие задачи из глобального тоста: после перехода на чек-листы
             * `ChecklistsSection` находит задачу и открывает модалку, затем сбрасывает в `null`.
             * @type {PendingDeepLink}
             */
            pendingDeepLink: /** @type {PendingDeepLink} */ (null),
            /**
             * Если `true`, после открытия `ShowTaskModal` нужно программно открыть drawer
             * по первому замеру со статусом `pending` (тот же сценарий, что клик по строке).
             */
            autoOpenPendingAfterTaskModal: false,
        };
    },

    actions: {
        /**
         * Полный снимок сценария в `sessionStorage` (ключ `task_grain_cooling.sessionStorageKey`).
         *
         * @returns {void}
         */
        persistGrainCoolingSession() {
            task_grain_cooling.notificationCountdownCompleted = this.notificationCountdownCompleted;
            persistNotification({
                notificationLaunched: this.notificationLaunched,
                notificationLaunchedAt: this.notificationLaunchedAt,
                notificationBannerActive: this.notificationBannerActive,
                notificationCountdownCompleted: this.notificationCountdownCompleted,
            });
        },

        /**
         * Фиксирует факт показа глобального тоста: дальше `useGlobalTaskReminder` не запускает таймер.
         * Пишет `notificationLaunched` и ISO-время в state и в `sessionStorage`.
         *
         * @returns {void}
         */
        markNotificationLaunched() {
            this.notificationLaunched = true;
            this.notificationLaunchedAt = new Date().toISOString();
            task_grain_cooling.notificationLaunchedAt = this.notificationLaunchedAt;
            this.persistGrainCoolingSession();
        },

        /**
         * Показать полосу под шапкой сразу после показа тоста (не при старте SPA и не по таймеру отсчёта).
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
         * Скрыть полосу и убрать из sessionStorage (сценарий завершён или больше не актуален).
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
         * Отсчёт после тоста (`measurementProblemDelayMs`) дошёл до конца; вызывается из таймера в `useGlobalTaskReminder`
         * после попытки `applyGrainCoolingProblemIfPending`.
         *
         * @returns {void}
         */
        markNotificationCountdownCompleted() {
            this.notificationCountdownCompleted = true;
            task_grain_cooling.notificationCountdownCompleted = true;
            this.persistGrainCoolingSession();
        },

        /**
         * Сохраняет намерение открыть задачу на секции чек-листов (например после клика «Перейти к задаче» в тосте).
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
