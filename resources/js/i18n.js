import { createI18n } from "vue-i18n";

export const i18n = createI18n({
    legacy: false,
    locale: window.locale || "en",
    fallbackLocale: "en",
    messages: window.translations || {},
});
