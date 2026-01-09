import { defineStore } from "pinia";

/**
 * @typedef {Object} User
 * @property {number} id - ID пользователя
 * @property {string} name - Имя пользователя
 * @property {string} email - Email пользователя
 */

/**
 * @typedef {Object} ProfileCompletion
 * @property {boolean} account - Завершен ли шаг регистрации аккаунта
 * @property {boolean} company - Завершен ли шаг регистрации компании
 * @property {boolean} phone - Завершен ли шаг регистрации телефона
 * @property {boolean} completed - Завершена ли полная регистрация
 */

/**
 * @typedef {Object} LoginPayload
 * @property {User} user - Данные пользователя
 * @property {string} token - Токен авторизации
 * @property {ProfileCompletion} profile_completion - Статус завершения профиля
 */

/**
 * @typedef {Object} AuthState
 * @property {User|null} user - Данные пользователя или null
 * @property {string|null} token - Токен авторизации или null
 * @property {ProfileCompletion|null} profileCompletion - Статус завершения профиля или null
 * @property {boolean} initialized - Инициализирован ли store
 */

/**
 * Валидация структуры User
 * @param {any} user - Данные для проверки
 * @returns {user is User}
 */
function isValidUser(user) {
    return (
        user !== null &&
        typeof user === "object" &&
        typeof user.id === "number" &&
        typeof user.name === "string" &&
        typeof user.email === "string"
    );
}

/**
 * Валидация структуры ProfileCompletion
 * @param {any} profileCompletion - Данные для проверки
 * @returns {profileCompletion is ProfileCompletion}
 */
function isValidProfileCompletion(profileCompletion) {
    return (
        profileCompletion !== null &&
        typeof profileCompletion === "object" &&
        typeof profileCompletion.account === "boolean" &&
        typeof profileCompletion.company === "boolean" &&
        typeof profileCompletion.phone === "boolean" &&
        typeof profileCompletion.completed === "boolean"
    );
}

/**
 * Валидация токена
 * @param {any} token - Токен для проверки
 * @returns {token is string}
 */
function isValidToken(token) {
    return typeof token === "string" && token.length > 0;
}

export const useAuthStore = defineStore("auth", {
    /**
     * @returns {AuthState}
     */
    state: () => ({
        /** @type {User|null} */
        user: null,
        /** @type {string|null} */
        token: null,
        /** @type {ProfileCompletion|null} */
        profileCompletion: null,
        /** @type {boolean} */
        initialized: false,
    }),

    actions: {
        /**
         * Инициализация store - загружает данные из localStorage
         * @returns {void}
         */
        init() {
            const token = localStorage.getItem("auth_token");
            const user = localStorage.getItem("user");
            const profileCompletion =
                localStorage.getItem("profile_completion");

            if (token && user) {
                // Валидация токена
                if (!isValidToken(token)) {
                    console.error("Invalid token format in localStorage");
                    this.clearAuthData();
                    this.initialized = true;
                    return;
                }
                this.token = token;

                // Парсинг и валидация user
                try {
                    const parsedUser = JSON.parse(user);
                    if (!isValidUser(parsedUser)) {
                        console.error(
                            "Invalid user structure in localStorage:",
                            parsedUser,
                        );
                        this.clearAuthData();
                        this.initialized = true;
                        return;
                    }
                    this.user = parsedUser;
                } catch (e) {
                    console.error("Error parsing user from localStorage:", e);
                    this.clearAuthData();
                    this.initialized = true;
                    return;
                }

                // Парсинг и валидация profileCompletion
                if (profileCompletion) {
                    try {
                        const parsedProfileCompletion =
                            JSON.parse(profileCompletion);
                        if (
                            !isValidProfileCompletion(parsedProfileCompletion)
                        ) {
                            console.error(
                                "Invalid profileCompletion structure in localStorage:",
                                parsedProfileCompletion,
                            );
                            this.profileCompletion = null;
                            localStorage.removeItem("profile_completion");
                        } else {
                            this.profileCompletion = parsedProfileCompletion;
                        }
                    } catch (e) {
                        console.error(
                            "Error parsing profile_completion from localStorage:",
                            e,
                        );
                        this.profileCompletion = null;
                        localStorage.removeItem("profile_completion");
                    }
                } else {
                    this.profileCompletion = null;
                }
            }

            this.initialized = true;
        },

        /**
         * Очистка данных авторизации
         * @private
         * @returns {void}
         */
        clearAuthData() {
            this.user = null;
            this.token = null;
            this.profileCompletion = null;
            localStorage.removeItem("user");
            localStorage.removeItem("auth_token");
            localStorage.removeItem("profile_completion");
        },

        /**
         * Авторизация пользователя
         * @param {LoginPayload} payload - Данные для авторизации
         * @returns {void}
         * @throws {Error} Если данные невалидны
         */
        login(payload) {
            if (!payload || typeof payload !== "object") {
                throw new Error("Login payload must be an object");
            }

            if (!isValidUser(payload.user)) {
                throw new Error("Invalid user data in login payload");
            }

            if (!isValidToken(payload.token)) {
                throw new Error("Invalid token in login payload");
            }

            if (!isValidProfileCompletion(payload.profile_completion)) {
                throw new Error(
                    "Invalid profile_completion data in login payload",
                );
            }

            this.user = payload.user;
            this.token = payload.token;
            this.profileCompletion = payload.profile_completion;

            localStorage.setItem("auth_token", payload.token);
            localStorage.setItem("user", JSON.stringify(payload.user));
            localStorage.setItem(
                "profile_completion",
                JSON.stringify(payload.profile_completion),
            );
        },

        /**
         * Выход пользователя из системы
         * @returns {void}
         */
        logout() {
            this.user = null;
            this.token = null;
            this.profileCompletion = null;

            localStorage.removeItem("auth_token");
            localStorage.removeItem("user");
            localStorage.removeItem("profile_completion");
        },

        /**
         * Обновление статуса завершения профиля
         * @param {ProfileCompletion} profileCompletion - Новые данные о завершении профиля
         * @returns {void}
         * @throws {Error} Если данные невалидны
         */
        updateProfileCompletion(profileCompletion) {
            if (!isValidProfileCompletion(profileCompletion)) {
                throw new Error(
                    "Invalid profile_completion data in updateProfileCompletion",
                );
            }

            this.profileCompletion = profileCompletion;
            localStorage.setItem(
                "profile_completion",
                JSON.stringify(profileCompletion),
            );
        },

        /**
         * Проверка завершенности регистрации профиля
         * @returns {boolean} true если token !== null и все 4 свойства ProfileCompletion равны true
         */
        isProfileCompleted() {
            return (
                this.token !== null &&
                this.profileCompletion !== null &&
                this.profileCompletion.account === true &&
                this.profileCompletion.company === true &&
                this.profileCompletion.phone === true &&
                this.profileCompletion.completed === true
            );
        },
    },
});
