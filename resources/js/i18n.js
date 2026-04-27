import { createI18n } from "vue-i18n";

/**
 * Достаёт `{ locale, translations }` из Inertia `<script data-page>` ещё до
 * `createInertiaApp.setup()`. Нужно, чтобы i18n получил messages немедленно при
 * импорте — иначе module-level код в зависимостях (например `eudrBatchPublic.js`,
 * где статичный объект `DEMO_LIST_META` дёргает `i18n.global.t(...)` при загрузке
 * файла) увидит пустой словарь и отрендерит сами i18n-ключи.
 */
function readInertiaInitial() {
    if (typeof document === "undefined") {
        return { locale: "en", messages: {} };
    }
    const el = document.querySelector('script[data-page="app"][type="application/json"]');
    if (!el?.textContent) {
        return { locale: "en", messages: {} };
    }
    try {
        const page = JSON.parse(el.textContent);
        const locale = page?.props?.locale || "en";
        const translations = page?.props?.translations || {};
        return { locale, messages: translations };
    } catch {
        return { locale: "en", messages: {} };
    }
}

const { locale, messages } = readInertiaInitial();

/**
 * На сервере (`typeof document === "undefined"`) подавляем missing/fallback warnings:
 * SSR-бандл при первичном module-eval вычисляет статичные сиды (eudrBatchPublic.js и пр.),
 * которые дёргают `i18n.global.t(...)` ещё до того, как Inertia передаст реальные
 * translations через shared-props. На рендере страницы словарь уже полный — warnings
 * просто шум в stdout `inertia:start-ssr`. На клиенте предупреждения остаются.
 */
const isServer = typeof document === "undefined";

export const i18n = createI18n({
    legacy: false,
    locale,
    fallbackLocale: "en",
    messages,
    missingWarn: !isServer,
    fallbackWarn: !isServer,
});
