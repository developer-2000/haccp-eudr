import { defineStore } from "pinia";
import apiAxios from "@/utils/apiAxios";

/**
 * @typedef {Object} SiteConfigState
 * @property {string} name - Название сайта
 * @property {Object} company - Конфигурация компании
 * @property {Array<{id: number, label: string, value: number}>} company.businessType - Типы бизнеса
 * @property {Array<{id: number, label: string, value: number}>} company.countries - Список стран
 * @property {Array<{id: number, label: string, value: number}>} company.employeeCount - Количество сотрудников
 * @property {Array<{id: number, label: string, value: number}>} company.numberOffices - Количество офисов компании
 * @property {boolean} loaded - Флаг загрузки данных
 */

export const useSiteConfigStore = defineStore("site", {
    /**
     * @returns {SiteConfigState}
     */
    state: () => ({
        /** @type {string} */
        name: "",
        /** @type {Object} */
        company: {
            /** @type {Array<{id: number, label: string, value: number}>} */
            businessType: [],
            /** @type {Array<{id: number, label: string, value: number}>} */
            countries: [],
            /** @type {Array<{id: number, label: string, value: number}>} */
            employeeCount: [],
            /** @type {Array<{id: number, label: string, value: number}>} */
            numberOffices: [],
        },
        /** @type {boolean} */
        loaded: false,
    }),

    actions: {
        /**
         * Инициализация store - загружает данные из API
         * @returns {Promise<void>}
         */
        async init() {
            if (this.loaded) {
                return;
            }

            try {
                const { data } = await apiAxios.get(
                    "/api/reference-data/company",
                );
                const responseData = data.data || data;

                if (responseData.name) {
                    this.name = responseData.name;
                }

                if (responseData.business_types) {
                    this.company.businessType = responseData.business_types;
                }

                if (responseData.countries) {
                    this.company.countries = responseData.countries;
                }

                if (responseData.employee_counts) {
                    this.company.employeeCount = responseData.employee_counts;
                }

                if (responseData.number_offices) {
                    this.company.numberOffices = responseData.number_offices;
                }

                this.loaded = true;
            } catch (error) {
                console.error("Failed to load reference data:", error);
            }
        },
    },
});
