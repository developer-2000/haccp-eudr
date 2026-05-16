import { nextTick } from 'vue';
import {
    findMeasurementRowIndexByTime,
    getCurrentMeasurementRowStatus,
} from './grainCoolingMeasurementRow';

const MAX_OPEN_ATTEMPTS = 24;

/**
 * Открытие боковой панели выполнения замера из модалки «Детали задачи» (клик по pending / авто после диплинка).
 * n-modal откладывает монтирование слота — ref на панель часто null на первом тике.
 *
 * @param {object} api
 * @param {() => object|null|undefined} api.getTask
 * @param {object} api.item — строка из `task.measurements` (достаточно `{ time }`)
 * @param {string} [api.source]
 * @param {import('vue').Ref} api.pendingDrawerRef — ref на `TaskExecutionPanelModal`
 * @param {import('vue').Ref<object>} [api.demoStateRef] — для сверки индекса из `task_grain_cooling` с `demoState`
 */
export async function openShowTaskModalPendingDrawer({
    getTask,
    item,
    source: _source = 'неизвестно',
    pendingDrawerRef,
    demoStateRef: _demoStateRef,
}) {
    const task = getTask();
    const statusNow = getCurrentMeasurementRowStatus(task, item);
    if (statusNow !== 'pending') {
        return;
    }
    const idx = findMeasurementRowIndexByTime(task, item);
    const rows = Array.isArray(task?.measurements) ? task.measurements : [];
    const rowForDrawer = idx >= 0 && idx < rows.length ? rows[idx] : null;
    if (!rowForDrawer) {
        return;
    }

    for (let attempt = 0; attempt < MAX_OPEN_ATTEMPTS; attempt++) {
        const inst = pendingDrawerRef.value;
        const openFn = inst?.open;
        if (typeof openFn === 'function') {
            openFn.call(inst, rowForDrawer);
            return;
        }
        await nextTick();
        if (attempt % 6 === 5) {
            await new Promise((r) => {
                requestAnimationFrame(r);
            });
        }
    }
}
