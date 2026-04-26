import { createRouter, createWebHistory } from "vue-router";
import Index from "./basic/Index.vue";
import Home from "./pages/client/Home.vue";

// Тяжёлые/редко открываемые страницы — динамические импорты для code splitting:
// каждая попадёт в свой chunk, главная страница перестанет тащить их в bundle.
const About = () => import("./pages/client/About.vue");
const Survey = () => import("./pages/client/Survey.vue");
const Demo = () => import("./pages/client/Demo.vue");
const HowItWorks = () => import("./pages/client/HowWorks.vue");
const BatchPublic = () => import("./pages/client/BatchPublic.vue");
const DailyReportPublic = () => import("./pages/client/DailyReportPublic.vue");
const PrivacyPolicy = () => import("./pages/client/PrivacyPolicy.vue");
const Contact = () => import("./pages/client/Contact.vue");

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
                component: Survey,
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
                component: Demo,
            },
            {
                path: "privacy-policy",
                name: "PrivacyPolicy",
                component: PrivacyPolicy,
            },
            {
                path: "contact",
                name: "Contact",
                component: Contact,
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }
        if (to.hash) {
            return { el: to.hash, top: 0 };
        }
        return new Promise((resolve) => {
            requestAnimationFrame(() => {
                const scrollEl = document.querySelector(".app-wrapper .main-content");
                if (scrollEl) {
                    scrollEl.scrollTo({ top: 0 });
                    resolve(false);
                    return;
                }
                resolve({ top: 0 });
            });
        });
    },
});

export default router;
