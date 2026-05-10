import "./bootstrap";
import { createSSRApp, h } from "vue";
import { createInertiaApp } from "@inertiajs/vue3";
import { createPinia } from "pinia";
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import "@/features/demo/task_grain_cooling/task-grain-cooling-toastify.scss";
import { i18n } from "./i18n";

// Только в prod: после deploy старые chunk-имена устаревают, и перезагрузка
// страницы тянет свежий manifest. В dev режиме (HMR) этот listener мешает —
// Vite сам пересобирает chunks, страницу перезагружать не нужно.
if (import.meta.env.PROD) {
    window.addEventListener("vite:preloadError", (event) => {
        const lastReloadKey = "vite-preload-last-reload";
        const last = Number(window.sessionStorage.getItem(lastReloadKey) || 0);
        if (Date.now() - last < 60_000) {
            event.preventDefault();
            return;
        }
        window.sessionStorage.setItem(lastReloadKey, String(Date.now()));
        window.location.reload();
    });
}

// Inertia GET-навигация упала с HttpNetworkError (XHR не получил ответ —
// мигнул Wi-Fi, RST_STREAM от CF, залип HTTP/2 keep-alive). Retry через
// тот же XHR-канал бесполезен — браузер переиспользует дохлый сокет.
// Делаем full-reload на target URL: новое browser-соединение, заголовки
// без X-Inertia (Laravel вернёт полный HTML), пользователь попадает туда,
// куда хотел. Защита от петли — 30 сек между reload'ами: если CF реально
// лежит, пусть отработает дефолт Inertia (стандартный alert).
// POST/PUT не трогаем — silent-retry создал бы дубль, а apiAxios._handleError
// уже показывает toast. Prefetch (hover-предзагрузку) тоже игнорируем —
// пользователь не инициировал явную навигацию.
if (typeof window !== "undefined") {
    let lastReloadAt = 0;
    document.addEventListener("inertia:networkError", (event) => {
        const visit = event.detail?.visit;
        const method = (visit?.method || "get").toLowerCase();
        if (method !== "get" || visit?.prefetch) return;
        if (Date.now() - lastReloadAt < 30_000) return;
        lastReloadAt = Date.now();
        event.preventDefault();
        window.location.href = visit?.url?.toString?.() || window.location.href;
    });
}

const pages = import.meta.glob("./Pages/**/*.vue", { eager: false });

createInertiaApp({
    resolve: (name) => {
        const path = `./Pages/${name}.vue`;
        if (!pages[path]) {
            throw new Error(
                `Inertia page not found: "${name}" (expected at ${path})`,
            );
        }
        return pages[path]();
    },
    setup({ el, App, props, plugin }) {
        const initial = props.initialPage.props;

        // Канонический `/` → `/{locale}` без HTTP-302: переписываем `props.initialPage.url`
        // ДО mount + синхронно правим браузерную строку через replaceState. Inertia при
        // init возьмёт уже `/{locale}` как свой текущий URL и не будет «откатывать» назад.
        // Заменяет legacy `router.js` redirect '/' → '/{locale}'.
        if (
            typeof window !== "undefined"
            && window.location.pathname === "/"
            && initial.locale
        ) {
            const canonicalUrl = `/${initial.locale}${window.location.search}${window.location.hash}`;
            props.initialPage.url = canonicalUrl;
            window.history.replaceState(window.history.state, "", canonicalUrl);
        }

        i18n.global.locale.value = initial.locale;
        i18n.global.setLocaleMessage(
            initial.locale,
            initial.translations?.[initial.locale] || {},
        );

        // `createSSRApp`, а не `createApp` — Vue гидрирует SSR-HTML вместо того чтобы
        // стирать его и рендерить заново. Без этого: вспышка SSR-контента → пустой `#app` →
        // повторный client-render. Также ломалось onMounted-восстановление состояния
        // (Survey submitted-state из localStorage не успевал «доехать» поверх wipe'а).
        const app = createSSRApp({ render: () => h(App, props) });
        app.use(plugin);
        const pinia = createPinia();
        app.use(pinia);
        app.use(i18n);

        app.use(Vue3Toastify, {
            position: "top-center",
            autoClose: false,
            hideProgressBar: true,
            limit: 3,
            pauseOnHover: true,
            newestOnTop: true,
            theme: "light",
        });
        app.mount(el);
    },
});
