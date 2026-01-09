import "./bootstrap";
import { createApp } from "vue";
import { createPinia } from "pinia";
import naive from "naive-ui";
import App from "./components/App.vue";
import router from "./router";
import { useAuthStore, useSiteConfigStore } from "@/stores";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(naive);
app.use(router);

// Инициализация stores после подключения pinia
const authStore = useAuthStore();
authStore.init();

const siteConfigStore = useSiteConfigStore();
siteConfigStore.init(); // async, но не ждем - загрузку в фоне

app.mount("#app");
