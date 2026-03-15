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

const siteConfigStore = useSiteConfigStore();
siteConfigStore.init();

app.mount("#app");
