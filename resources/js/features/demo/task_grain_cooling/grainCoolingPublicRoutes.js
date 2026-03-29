/**
 * Публичные страницы (карточка партии, дневной отчёт) — без сценария «Охлаждение зерна»:
 * не касаются персонального чек-листа пользователя.
 *
 * @param {import('vue-router').RouteLocationNormalizedLoaded | null | undefined} route
 * @returns {boolean}
 */
export function isGrainCoolingScenarioSuppressedForRoute(route) {
    if (!route) {
        return false;
    }
    const n = route.name;
    if (
        n === "BatchPublic" ||
        n === "BatchPublicRoot" ||
        n === "DailyReportPublic" ||
        n === "DailyReportPublicRoot"
    ) {
        return true;
    }
    const p = route.path || "";
    if (/^\/batch(\/|$)/.test(p)) {
        return true;
    }
    if (/^\/[^/]+\/batch\//.test(p)) {
        return true;
    }
    if (/^\/report\/\d{4}-\d{2}-\d{2}/.test(p)) {
        return true;
    }
    if (/^\/[^/]+\/report\/\d{4}-\d{2}-\d{2}/.test(p)) {
        return true;
    }
    return false;
}
