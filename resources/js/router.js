import { createRouter, createWebHistory } from "vue-router";
import Index from "./basic/Index.vue";
import Home from "./pages/client/Home.vue";
import About from "./pages/client/About.vue";
import SurveyPlaceholder from "./pages/client/SurveyPlaceholder.vue";
import DemoPlaceholder from "./pages/client/DemoPlaceholder.vue";

const routes = [
    { path: "/", redirect: "/en" },
    {
        path: "/:locale",
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
                path: "survey",
                name: "Survey",
                component: SurveyPlaceholder,
            },
            {
                path: "demo",
                name: "Demo",
                component: DemoPlaceholder,
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
