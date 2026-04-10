/**
 * Конфигурация сайта
 * @deprecated Используйте useSiteConfigStore() из @/stores вместо этого
 */
import { getActivePinia } from "pinia";
import { useSiteConfigStore } from "@/stores";

let siteStore = null;

function getSiteStore() {
    if (!siteStore) {
        if (!getActivePinia()) {
            return { name: "HACCPilot" };
        }
        siteStore = useSiteConfigStore();
    }
    return siteStore;
}

const siteConfig = {
    get name() {
        return getSiteStore().name || "HACCPilot";
    },
};

export default siteConfig;
