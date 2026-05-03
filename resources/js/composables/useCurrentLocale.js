import { usePage } from "@inertiajs/vue3";

/**
 * Возвращает текущую локаль. Источник истины — `usePage().props.locale`
 * (выставляется бэкендом в `HandleInertiaRequests::share()` на основе
 * `App::setLocale()` из middleware `SetLocale`). Работает одинаково в SSR
 * и в браузере, поэтому переключатель языка корректно отображает активный
 * язык на серверном рендере.
 *
 * Фолбэк на `window.location.pathname` оставлен для legacy-SPA контекста,
 * где Inertia не инициализирована и `usePage()` бросает.
 */
export function useCurrentLocale() {
    try {
        const page = usePage();
        const locale = page?.props?.locale;
        if (locale) return locale;
    } catch {
        // Inertia-контекст недоступен (legacy SPA) — идём в URL-фолбэк.
    }

    if (typeof window === "undefined") {
        return "en";
    }

    const segments = window.location.pathname.split("/").filter(Boolean);
    if (segments[0] && /^[a-z]{2}$/.test(segments[0])) {
        return segments[0];
    }
    return "en";
}

/**
 * Возвращает текущий путь без префикса локали. Используется в
 * language-switcher (нужно сохранить страницу при смене языка) и для
 * определения активной ссылки в навигации.
 */
export function useCurrentPathWithoutLocale() {
    const locale = useCurrentLocale();

    let path = "/";
    if (typeof window !== "undefined") {
        path = window.location.pathname || "/";
    } else {
        try {
            path = usePage()?.url || "/";
        } catch {
            path = "/";
        }
    }

    if (path === `/${locale}` || path.startsWith(`/${locale}/`)) {
        return path.slice(locale.length + 1) || "/";
    }
    return path || "/";
}
