import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/Home.vue";
import About from "./pages/About.vue";
import Registration from "./pages/Auth/Registration.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/about",
        name: "About",
        component: About,
    },
    {
        path: "/auth/register/account",
        name: "Registration",
        component: Registration,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
