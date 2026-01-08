import "./bootstrap";
import { createApp } from "vue";
import { createPinia } from "pinia";
import naive from "naive-ui";
import Index from "./components/Index.vue";
import router from "./router";
import { useAuthStore, useSiteConfigStore } from "@/stores";

const app = createApp(Index);
const pinia = createPinia();

app.use(pinia);
app.use(naive);
app.use(router);

// Инициализация stores после подключения pinia
const authStore = useAuthStore();
authStore.init();

const siteConfigStore = useSiteConfigStore();
siteConfigStore.init(); // async, но не ждем - загрузка в фоне

app.mount("#app");
