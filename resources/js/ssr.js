import { createSSRApp, h } from "vue";
import { createInertiaApp } from "@inertiajs/vue3";
import createServer from "@inertiajs/vue3/server";
import { renderToString } from "@vue/server-renderer";
import { createPinia } from "pinia";
import { i18n } from "./i18n";

const pages = import.meta.glob("./Pages/**/*.vue", { eager: true });

createServer((page) =>
    createInertiaApp({
        page,
        render: renderToString,
        resolve: (name) => {
            const path = `./Pages/${name}.vue`;
            if (!pages[path]) {
                throw new Error(
                    `Inertia page not found: "${name}" (expected at ${path})`,
                );
            }
            return pages[path];
        },
        setup({ App, props, plugin }) {
            const initial = props.initialPage.props;

            i18n.global.locale.value = initial.locale;
            i18n.global.setLocaleMessage(
                initial.locale,
                initial.translations?.[initial.locale] || {},
            );

            const app = createSSRApp({ render: () => h(App, props) });
            app.use(plugin);
            app.use(createPinia());
            app.use(i18n);

            return app;
        },
    }),
);
