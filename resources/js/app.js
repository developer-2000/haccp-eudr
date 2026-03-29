import "./bootstrap";
import { createApp } from "vue";
import { createPinia } from "pinia";
import naive from "naive-ui";
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import "@/features/demo/task_grain_cooling/task-grain-cooling-toastify.scss";
import App from "./components/App.vue";
import router from "./router";
import { i18n } from "./i18n";
import { useSiteConfigStore } from "@/stores";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(i18n);
app.use(naive);
app.use(Vue3Toastify, {
    position: "top-center",
    autoClose: false,
    hideProgressBar: true,
    limit: 3,
    pauseOnHover: true,
    newestOnTop: true,
    theme: "dark",
});
app.use(router);

const resolveSafeLocale = (candidate) => {
    const knownLocales = Object.keys(i18n.global.messages.value || {});
    if (typeof candidate === "string" && knownLocales.includes(candidate)) {
        return candidate;
    }
    if (typeof window.locale === "string" && knownLocales.includes(window.locale)) {
        return window.locale;
    }
    return knownLocales[0] || "en";
};

// Синхронизация локали i18n с URL при каждой навигации и перед первым рендером
router.beforeEach((to) => {
    i18n.global.locale.value = resolveSafeLocale(to.params.locale);
});

const siteConfigStore = useSiteConfigStore();
siteConfigStore.init();

router.isReady().then(() => {
    i18n.global.locale.value = resolveSafeLocale(
        router.currentRoute.value.params.locale,
    );
    app.mount("#app");
});
