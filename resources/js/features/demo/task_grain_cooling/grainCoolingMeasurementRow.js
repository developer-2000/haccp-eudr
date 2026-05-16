/**
 * Вспомогательные проверки по строкам замера в контексте сценария «Охлаждение зерна»
 * (модалка деталей, боковая панель, оповещение).
 * Не полагаться на устаревшую ссылку на объект строки после иммутаций в `demoState`.
 */

/**
 * Актуальный статус строки замера в задаче по совпадению `time`.
 *
 * @param {object|null|undefined} task
 * @param {{ time?: unknown }|null|undefined} rowRef — строка замера или минимум `{ time }`
 * @returns {string|null}
 */
export function getCurrentMeasurementRowStatus(task, rowRef) {
    const rows = Array.isArray(task?.measurements) ? task.measurements : [];
    const t = String(rowRef?.time ?? '').trim();
    if (!t) {
        return null;
    }
    const row = rows.find((r) => String(r?.time ?? '').trim() === t);
    return row?.status != null ? String(row.status) : null;
}

/**
 * Удобная проверка перед открытием UI выполнения замера (боковая панель и т.п.).
 *
 * @param {object|null|undefined} task
 * @param {{ time?: unknown }|null|undefined} rowRef
 * @returns {boolean}
 */
export function isCurrentMeasurementRowPending(task, rowRef) {
    return getCurrentMeasurementRowStatus(task, rowRef) === 'pending';
}

/**
 * Индекс строки замера в `task.measurements` по совпадению `time`.
 *
 * @param {object|null|undefined} task
 * @param {{ time?: unknown }|null|undefined} rowRef
 * @returns {number}
 */
export function findMeasurementRowIndexByTime(task, rowRef) {
    const rows = task?.measurements;
    if (!Array.isArray(rows) || !rowRef) {
        return -1;
    }
    return rows.findIndex((row) => String(row?.time ?? '') === String(rowRef?.time ?? ''));
}
