import { reactive } from "vue";



export const task_grain_cooling = reactive({
    /** Уникальный id задачи в демо-чеклистах (`checklistsByNiche[niche]`), совпадает с карточкой CCP. */
    id: "coffee-2",
    /** Ключ ниши в демо-state: `coffee` | `bakery` | `meat`. */
    niche: "coffee",
    /** Название задачи как в `task.title` демо-данных (карточка, модалка, согласованность с сидом). */
    taskTitle: "Охлаждение зерна",
    /**
     * Индекс элемента в массиве `measurements` целевой задачи.
     * В файле изначально `null`; при старте сценария сюда мутируется индекс первого `pending` (`lockGrainCoolingMeasurementIndex`).
     * Таймер `problem` меняет статус только у этого индекса; сброс — `unlockGrainCoolingMeasurementIndex` → снова `null`.
     */
    measurementIndex: null,
    /** Задержка после загрузки SPA: через столько мс показать оповещение и проиграть звук */
    initialToastDelayMs: 60000,
    /** После показа оповещение: через столько мс выставить `problem` у замера с индексом `measurementIndex`, если он ещё `pending`. */
    measurementProblemDelayMs: 300000,
    /** Первая строка текста в глобальном тосте (подзаголовок-сигнал). */
    toastTitle: "Время выполнить задачу",
    /** Вторая строка в тосте — отображаемое имя задачи (как правило = `taskTitle`). */
    toastTaskName: "Охлаждение зерна",
    /** Подпись кнопки закрытия тоста без перехода. */
    toastButtonCloseLabel: "Закрыть",
    /** Подпись кнопки перехода на демо-страницу в секцию чек-листов. */
    toastButtonNavigateLabel: "Перейти к задаче",
    /** Путь к wav от корня сайта (`public/`), воспроизводится при показе тоста. */
    soundUrl: "/sounds/task_completion_notification.wav",
    /** Ключ `sessionStorage` для персиста «глобальное оповещение уже показывали в этой вкладке». */
    sessionStorageKey: "task_grain_cooling",
    /**
     * Для тестов - sessionStorageKey - true
     * В продакшене держать `false`.
     */
    clearGrainCoolingSessionStorageBeforeLoad: false,
    /** Строковый id Pinia-store сценария (первый аргумент `defineStore`). */
    piniaStoreId: "taskGrainCooling",
    /** Имя именованного роута Vue Router при переходе из тоста на демо. */
    demoRouteName: "Demo",
    /** Значение `params.section` при переходе: сегмент URL демо-секции с чек-листами. */
    demoRouteSection: "checklists",
    /** CSS-класс на корне toast vue3-toastify; стили в `task-grain-cooling-toastify.scss`. */
    toastifyToastClassName: "global-task-reminder-toast-wrap",
    /** После перехода по диплинку: запросить автооткрытие drawer по первому `pending` в модалке задачи. */
    deepLinkAutoOpenPending: true,
    /**
     * Заглушка полной схемы: флаг «тост уже показывали» хранится в Pinia + `sessionStorage`.
     * В экспортируемом объекте остаётся `null` как признак «не дублировать сюда рантайм».
     */
    notificationLaunched: null,
    /**
     * Заглушка: ISO-время запуска оповещения — в Pinia после `markNotificationLaunched`.
     */
    notificationLaunchedAt: null,
    /**
     * Заглушка: id задачи для диплинка — фактически в `store.pendingDeepLink.taskId` (обычно = `id`).
     */
    pendingDeepLinkTaskId: null,
    /**
     * Заглушка: ниша диплинка — в `store.pendingDeepLink.niche` (обычно = `niche`).
     */
    pendingDeepLinkNiche: null,
    /**
     * Заглушка: автооткрытие drawer — фактически `store.autoOpenPendingAfterTaskModal`.
     */
    autoOpenPendingAfterTaskModal: null,
    /**
     * Заглушка: полоса под шапкой — фактически `store.notificationBannerActive`.
     */
    notificationBannerActive: null,
    /**
     * Завершился ли отсчёт `measurementProblemDelayMs` после тоста (таймер сработал); пишется в Pinia + `sessionStorage`.
     */
    notificationCountdownCompleted: null,
    /**
     * Рантайм: выставляется в `useGrainCoolingDemoEntry` из `demoState` (есть ли `pending` у целевой задачи).
     * Все проверки сначала смотрят сюда; при `false` Pinia store сценария не создают.
     */
    scenarioProcessAllowed: false,
    /**
     * После перевода замера в `problem` таймером: индекс строки (пока `measurementIndex` уже `null`).
     * Сбрасывается при новом `lockGrainCoolingMeasurementIndex` или после обработки автооткрытия модалки.
     */
    lastProblemAppliedMeasurementIndex: null,
});

/**
 * Записать в `task_grain_cooling.measurementIndex` индекс замера для таймера `problem`.
 *
 * @param {number} index
 * @returns {void}
 */
export function lockGrainCoolingMeasurementIndex(index) {
    task_grain_cooling.lastProblemAppliedMeasurementIndex = null;
    if (typeof index !== "number" || index < 0 || !Number.isFinite(index)) {
        task_grain_cooling.measurementIndex = null;
        return;
    }
    task_grain_cooling.measurementIndex = index;
}

/**
 * Сброс `task_grain_cooling.measurementIndex` в `null` после применения или отмены сценария.
 *
 * @returns {void}
 */
export function unlockGrainCoolingMeasurementIndex() {
    task_grain_cooling.measurementIndex = null;
}
