/**
 * Конфигурация сайта
 * @deprecated Используйте useSiteConfigStore() из @/stores вместо этого
 * Оставлено для обратной совместимости
 */
import { getActivePinia } from "pinia";
import { useSiteConfigStore } from "@/stores";

let siteStore = null;

function getSiteStore() {
    if (!siteStore) {
        // Проверяем, инициализирована ли Pinia
        if (!getActivePinia()) {
            return {
                name: "HACCP-EUDR",
                company: { businessType: [] },
            };
        }
        siteStore = useSiteConfigStore();
    }
    return siteStore;
}

const siteConfig = {
    get name() {
        const store = getSiteStore();
        return store.name || "HACCP-EUDR";
    },
    get company() {
        const store = getSiteStore();
        return store.company || { businessType: [] };
    },
};

export default siteConfig;
