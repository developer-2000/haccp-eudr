import { createRouter, createWebHistory } from "vue-router";
import Index from "./basic/Index.vue";
import Home from "./pages/client/Home.vue";
import About from "./pages/client/About.vue";
import SurveyPlaceholder from "./pages/client/SurveyPlaceholder.vue";
import DemoPlaceholder from "./pages/client/Demo.vue";
import HowItWorks from "./pages/client/HowWorks.vue";
import BatchPublic from "./pages/client/BatchPublic.vue";
import DailyReportPublic from "./pages/client/DailyReportPublic.vue";

const routes = [
    { path: "/", redirect: "/en" },
    {
        path: "/batch/:batchId",
        name: "BatchPublicRoot",
        component: BatchPublic,
    },
    {
        path: "/report/:date",
        name: "DailyReportPublicRoot",
        component: DailyReportPublic,
    },
    {
        path: "/:locale/batch/:batchId",
        name: "BatchPublic",
        component: BatchPublic,
    },
    {
        path: "/:locale/report/:date",
        name: "DailyReportPublic",
        component: DailyReportPublic,
    },
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
                path: "how-it-works",
                name: "HowItWorks",
                component: HowItWorks,
            },
            {
                path: "survey",
                name: "Survey",
                component: SurveyPlaceholder,
            },
            {
                path: "demo",
                redirect: (to) => ({
                    path: `/${to.params.locale}/demo/dashboard`,
                    replace: true,
                }),
            },
            {
                path: "demo/:section",
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
