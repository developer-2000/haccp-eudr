import router from "@/router";
import { i18n } from "@/i18n";
import { task_grain_cooling } from "./config";
import { useGrainCoolingStore } from "./grainCoolingDemoEntry";

function resolveLocale() {
    const fromRoute = router.currentRoute.value.params.locale;
    if (typeof fromRoute === "string" && fromRoute.length) {
        return fromRoute;
    }
    return i18n.global.locale.value || "en";
}

/**
 * Переход на демо-секцию чек-листов и постановка диплинка — то же, что кнопка «Перейти к задаче» в тосте и на полосе.
 * Скрывает полосу под шапкой (как и закрытие тоста при переданном `closeToast`).
 *
 * @param {{ closeToast?: () => void }} [options] — при вызове из тоста передать `closeToast`
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
    router.push({
        name: task_grain_cooling.demoRouteName,
        params: {
            locale: resolveLocale(),
            section: task_grain_cooling.demoRouteSection,
        },
    });
    if (typeof options.closeToast === "function") {
        options.closeToast();
    }
}
