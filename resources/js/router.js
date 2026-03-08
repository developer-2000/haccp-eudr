import { createRouter, createWebHistory } from "vue-router";
import Index from "./basic/Index.vue";
import Home from "./pages/client/Home.vue";
import About from "./pages/client/About.vue";
import Registration from "./pages/client/Auth/Registration.vue";
import Login from "./pages/client/Auth/Login.vue";
import ResetPassword from "./pages/client/Auth/ResetPassword.vue";
import PersonalPanel from "./basic/PersonalPanel.vue";
import AdminIndex from "./pages/admin/Index.vue";
import SettingsHaccp from "./pages/admin/SettingsHaccp.vue";
import { useAuthStore } from "./stores";

const routes = [
    {
        path: "/",
        component: Index,
        children: [
            {
                path: "",
        name: "Home",
        component: Home,
    },
    {
                path: "about",
        name: "About",
        component: About,
    },
    {
                path: "auth/register/account",
        name: "Registration",
        component: Registration,
    },
    {
                path: "auth/login",
        name: "Login",
        component: Login,
    },
    {
                path: "auth/reset-password",
        name: "ResetPassword",
        component: ResetPassword,
            },
        ],
    },
    {
        path: "/personal-panel",
        component: PersonalPanel,
        children: [
            {
                path: "",
        name: "PersonalPanel",
                component: AdminIndex,
            },
            {
                path: "settings-haccp",
                name: "SettingsHaccp",
                component: SettingsHaccp,
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    // ПРОФИЛЬ не завершен
    if (!authStore.isProfileCompleted()) {
        // Запрет доступа к /personal-panel и дальше
        if (to.path.startsWith("/personal-panel")) {
            next("/auth/login");
            return;
        }
    }
    // АВТОРИЗОВАН и ПРОФИЛЬ завершен
    else if (authStore.isProfileCompleted()) {
        // Запрет находится в клиентской части сайта
        if (!to.path.startsWith("/personal-panel")) {
            next("/personal-panel");
            return;
        }
    }

    next();
});

export default router;
