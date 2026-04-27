/**
 * Возвращает текущую локаль из URL (`/{locale}/...`) с фолбэком на `en`.
 * Универсальный для legacy SPA (через Vue Router) и Inertia: читает напрямую из
 * `window.location.pathname`, не требует `useRoute()` / `usePage()`.
 * Используется в Header / Footer / NavMenuItem / DropdownMenu / ConsentOverlay,
 * которые рендерятся в обоих контекстах.
 */
export function useCurrentLocale() {
    if (typeof window === "undefined") {
        return "en";
    }
    const segments = window.location.pathname.split("/").filter(Boolean);
    const available = window.availableLocales || [];
    if (available.length > 0 && available.includes(segments[0])) {
        return segments[0];
    }
    if (segments[0] && /^[a-z]{2}$/.test(segments[0])) {
        return segments[0];
    }
    return "en";
}

/**
 * Возвращает текущий путь без префикса локали. Полезен для language-switcher
 * (нужно сохранить текущую страницу при смене языка) и для определения
 * активной ссылки в навигации.
 */
export function useCurrentPathWithoutLocale() {
    if (typeof window === "undefined") {
        return "/";
    }
    const path = window.location.pathname;
    const locale = useCurrentLocale();
    if (path === `/${locale}` || path.startsWith(`/${locale}/`)) {
        return path.slice(locale.length + 1) || "/";
    }
    return path || "/";
}
