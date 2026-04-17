import { defineStore } from "pinia";

/**
 * @typedef {Object} SiteConfigState
 * @property {string} name - Название сайта
 * @property {boolean} loaded - Флаг инициализации
 */

export const useSiteConfigStore = defineStore("site", {
    /**
     * @returns {SiteConfigState}
     */
    state: () => ({
        /** @type {string} */
        name: "",
        /** @type {string} */
        adminEmail: "",
        /** @type {boolean} */
        loaded: false,
    }),

    actions: {
        init() {
            if (this.loaded) {
                return;
            }
            this.name = window.appName || "";
            this.adminEmail = window.adminEmail || "";
            this.loaded = true;
        },
    },
});
