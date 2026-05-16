/**
 * Публичные страницы (карточка партии, дневной отчёт) — без сценария «Охлаждение зерна»:
 * не касаются персонального чек-листа пользователя.
 *
 * @param {string | null | undefined} pathname — `window.location.pathname` или Inertia `page.url`.
 * @returns {boolean}
 */
export function isGrainCoolingScenarioSuppressedForPath(pathname) {
    if (typeof pathname !== 'string' || pathname === '') {
        return false;
    }
    if (/^\/batch(\/|$)/.test(pathname)) {
        return true;
    }
    if (/^\/[^/]+\/batch\//.test(pathname)) {
        return true;
    }
    if (/^\/report\/\d{4}-\d{2}-\d{2}/.test(pathname)) {
        return true;
    }
    if (/^\/[^/]+\/report\/\d{4}-\d{2}-\d{2}/.test(pathname)) {
        return true;
    }
    return false;
}
