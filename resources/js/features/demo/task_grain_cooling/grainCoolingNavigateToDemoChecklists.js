import { router as inertiaRouter } from '@inertiajs/vue3';
import { i18n } from '@/i18n';
import { task_grain_cooling } from './config';
import { useGrainCoolingStore } from './grainCoolingDemoEntry';

/**
 * Достаёт локаль из URL-сегмента `/{locale}/...`. Fallback — текущая i18n-локаль или "en".
 * Используется для построения URL перехода на Demo без vue-router.
 */
function resolveLocale() {
    if (typeof window !== 'undefined') {
        const first = window.location.pathname.split('/').filter(Boolean)[0];
        if (typeof first === 'string' && first.length) {
            return first;
        }
    }
    return i18n.global.locale.value || 'en';
}

/**
 * Переход на демо-секцию чек-листов и постановка диплинка — то же, что кнопка «Перейти к задаче» в оповещении и на полосе.
 * Скрывает полосу под шапкой (как и закрытие окна оповещения при переданном `closeToast`).
 * Переход — через Inertia router, без полной перезагрузки страницы; Pinia с `pendingDeepLink` остаётся живым.
 *
 * @param {{ closeToast?: () => void }} [options] — при вызове из оповещения передать `closeToast` (имя из vue3-toastify)
 * @returns {void}
 */
export function navigateGrainCoolingToDemoChecklists(options = {}) {
    if (!task_grain_cooling.scenarioProcessAllowed) {
        return;
    }
    const grain = useGrainCoolingStore();
    if (!grain) {
        return;
    }
    grain.clearNotificationBanner();
    grain.requestOpenTaskOnChecklists(task_grain_cooling.id, task_grain_cooling.niche, {
        autoOpenPending: task_grain_cooling.deepLinkAutoOpenPending,
    });
    if (typeof options.closeToast === 'function') {
        options.closeToast();
    }
    const locale = resolveLocale();
    inertiaRouter.visit(`/${locale}/demo/${task_grain_cooling.demoRouteSection}`, {
        preserveState: true,
        preserveScroll: true,
    });
}
