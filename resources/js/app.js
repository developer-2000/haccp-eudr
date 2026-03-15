import "./bootstrap";
import { createApp } from "vue";
import { createPinia } from "pinia";
import naive from "naive-ui";
import App from "./components/App.vue";
import router from "./router";
import { i18n } from "./i18n";
import { useSiteConfigStore } from "@/stores";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(i18n);
app.use(naive);
app.use(router);

// Синхронизация локали i18n с URL при каждой навигации и перед первым рендером
router.beforeEach((to) => {
    const locale = to.params.locale || window.locale || "en";
    i18n.global.locale.value = locale;
});

const siteConfigStore = useSiteConfigStore();
siteConfigStore.init();

router.isReady().then(() => {
    i18n.global.locale.value =
        router.currentRoute.value.params.locale || window.locale || "en";
    app.mount("#app");
});
