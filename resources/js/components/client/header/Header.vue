<template>
    <header class="header">
        <nav class="nav" role="navigation" aria-label="Main navigation">
            <div class="container nav-container">
                <div class="nav-logo">
                    <router-link :to="safeLogo.link" class="logo-link">
                        <span class="logo-site">{{ siteConfig.name }}</span>
                        <span class="logo-app">App</span>
                    </router-link>
                </div>
                <div v-if="!isMobile" class="nav-menu">
                    <NavMenuItem
                        v-for="item in safeMenu"
                        :key="`${item.label}-${item.link}`"
                        :item="item"
                        variant="desktop"
                    />
                </div>
                <button
                    v-if="isMobile"
                    class="mobile-menu-toggle"
                    :aria-expanded="isMobileMenuOpen"
                    aria-label="Toggle mobile menu"
                    @click="toggleMobileMenu"
                >
                    <Icon
                        :name="isMobileMenuOpen ? 'close' : 'bars'"
                        class="mobile-menu-icon"
                    />
                </button>
                <div
                    v-if="isMobile"
                    class="mobile-menu"
                    :class="{ 'mobile-menu-open': isMobileMenuOpen }"
                    role="menu"
                    :aria-hidden="!isMobileMenuOpen"
                >
                    <NavMenuItem
                        v-for="item in safeMenu"
                        :key="`mobile-${item.label}-${item.link}`"
                        :item="item"
                        variant="mobile"
                        :is-open="
                            hasMobileDropdown(`${item.label}-${item.link}`)
                        "
                        :on-toggle="
                            () =>
                                toggleMobileDropdown(
                                    `${item.label}-${item.link}`,
                                )
                        "
                        :on-item-click="closeMobileMenu"
                    />
                </div>
                <div class="nav-actions">
                    <!-- Debug: Auth Store Data -->
                    <div
                        class="auth-debug"
                        style="
                            font-size: 10px;
                            padding: 5px;
                            background: #f0f0f0;
                            border: 1px solid #ccc;
                            margin-right: 10px;
                            max-width: 300px;
                        "
                    >
                        <div><strong>Auth Store:</strong></div>
                        <div>initialized: {{ authStore.initialized }}</div>
                        <div>
                            user:
                            {{
                                authStore.user
                                    ? JSON.stringify(authStore.user)
                                    : "null"
                            }}
                        </div>
                        <div>
                            token:
                            {{
                                authStore.token
                                    ? authStore.token.substring(0, 20) + "..."
                                    : "null"
                            }}
                        </div>
                        <div>
                            profileCompletion:
                            {{
                                authStore.profileCompletion
                                    ? JSON.stringify(
                                          authStore.profileCompletion,
                                      )
                                    : "null"
                            }}
                        </div>
                    </div>
                    <!-- Кнопки для неавторизованных пользователей -->
                    <template
                        v-for="button in visibleButtons"
                        :key="`${button.label}-${button.link}`"
                    >
                        <button
                            v-if="button.action !== 'logout'"
                            type="button"
                            :class="[
                                'btn-client',
                                button.type === 'primary'
                                    ? 'btn-primary'
                                    : 'btn-text',
                            ]"
                            @click="handleButtonClick(button)"
                        >
                            {{ button.label }}
                        </button>
                        <button
                            v-else
                            type="button"
                            class="btn-client btn-text"
                            @click="handleLogout"
                        >
                            {{ button.label }}
                        </button>
                    </template>
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup>
/**
 * @fileoverview Компонент Header с навигацией
 * @typedef {import('./types/nav.types.js').NavConfig} NavConfig
 */
defineOptions({
    name: "Header",
});

// ============================================
// Импорты
// ============================================
import Icon from "../../Icon.vue";
/** @type {NavConfig} */
import navConfig from "@/config/nav";
import siteConfig from "@/config/site";
import { useMobileMenu } from "./composables/useMobileMenu";
import { useBreakpoint } from "./composables/useBreakpoint";
import NavMenuItem from "./NavMenuItem.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores";

// ============================================
// Composables
// ============================================
const {
    /** @type {import('vue').Ref<boolean>} */
    isOpen: isMobileMenuOpen,
    /** @type {Function} */
    toggle: toggleMobileMenu,
    /** @type {Function} */
    close: closeMobileMenu,
    /** @type {Function} */
    toggleDropdown: toggleMobileDropdown,
    /** @type {Function} */
    hasDropdown: hasMobileDropdown,
} = useMobileMenu();

const { isMobile } = useBreakpoint(1024);

const router = useRouter();
const authStore = useAuthStore();

// ============================================
// Валидация и мемоизация конфигурации
// ============================================
import { shallowRef, computed } from "vue";

// Валидация navConfig выполняется один раз при инициализации
const defaultConfig = {
    logo: { text: "", link: "/" },
    menu: [],
    actions: { buttons: [] },
};

// navConfig импортируется статически, поэтому проверяем только на существование
const validatedNavConfig =
    navConfig ||
    (() => {
        return defaultConfig;
    })();

// Используем shallowRef для статической конфигурации (не требует глубокой реактивности)
/** @type {import('vue').ShallowRef<NavConfig>} */
const navConfigRef = shallowRef(validatedNavConfig);

// Computed свойства теперь зависят от одного shallowRef, пересчитываются только при изменении ссылки
/** @type {import('vue').ComputedRef<NavConfig['logo']>} */
const safeLogo = computed(() => navConfigRef.value?.logo || defaultConfig.logo);

/** @type {import('vue').ComputedRef<NavConfig['menu']>} */
const safeMenu = computed(() => {
    const menu = navConfigRef.value?.menu;
    return Array.isArray(menu) ? menu : defaultConfig.menu;
});

/** @type {import('vue').ComputedRef<NavConfig['actions']>} */
const safeActions = computed(() => {
    const actions = navConfigRef.value?.actions;
    return {
        buttons: Array.isArray(actions?.buttons) ? actions.buttons : [],
    };
});

/**
 * visibleButtons - вычисляемое свойство для фильтрации кнопок в зависимости от авторизации
 * Если пользователь авторизован - скрываем Login, показываем Logout
 * Если не авторизован - показываем Login, скрываем Logout
 */
const isAuthenticated = computed(() => {
    return authStore.user !== null && authStore.token !== null;
});

const visibleButtons = computed(() => {
    const buttons = safeActions.value.buttons || [];

    if (isAuthenticated.value) {
        // Если авторизован - фильтруем Login, добавляем Logout
        const filtered = buttons.filter(
            (btn) => btn.label.toLowerCase() !== "login",
        );
        return [
            ...filtered,
            {
                label: "Logout",
                link: "#",
                type: "link",
                action: "logout",
            },
        ];
    } else {
        // Если не авторизован - показываем все кнопки, кроме Logout
        return buttons.filter((btn) => btn.label.toLowerCase() !== "logout");
    }
});

// ============================================
// Handlers
// ============================================

const handleButtonClick = (button) => {
    if (!button || !button.link) {
        return;
    }

    if (button.link !== "#" && button.link !== "javascript:void(0)") {
        router.push(button.link);
    }
};

const handleLogout = () => {
    authStore.logout();
    // Перенаправляем на главную страницу после выхода
    router.push("/");
};
</script>

<style scoped lang="scss">
@use "../../../../scss/variables" as *;

// ============================================
// Header & Navigation
// ============================================

.header {
    background-color: $bg-gray;
    border-bottom: 1px solid $border-color;
    position: sticky;
    top: 0;
    z-index: 1000;
}

.nav {
    padding: $spacing-md 0;
    .nav-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: $spacing-lg;
        .nav-logo {
            flex-shrink: 0;
            position: relative;
            z-index: 1002;

            .logo-link {
                text-decoration: none;
                display: flex;
                align-items: center;
                gap: 8px;
                color: $text-logo;
                &:hover {
                    opacity: 0.8;
                }

                .logo-site {
                    font-weight: 600;
                    font-size: 33px;
                }

                .logo-app {
                    font-weight: 500;
                    font-size: 14px;
                    background-color: #fbec9c;
                    padding: 2px 6px;
                    border-radius: 4px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: $text-color;
                }
            }
        }

        .nav-menu {
            display: flex;
            align-items: center;
            gap: $spacing-lg;
            flex: 1;
            justify-content: center;
        }

        .nav-actions {
            display: flex;
            align-items: center;
            gap: $spacing-md;
            flex-shrink: 0;
            position: relative;
            z-index: 1002;
            button {
                margin-right: 20px;
                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }
}

// ============================================
// Mobile Navigation
// ============================================

.mobile-menu-toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: $spacing-sm;
    color: $text-color;
    transition: color $transition-fast;
    z-index: 1002;
    flex-shrink: 0;
    margin-left: auto;
    margin-right: $spacing-sm;

    &:hover {
        color: $primary-color;
    }

    .mobile-menu-icon {
        width: 24px;
        height: 24px;
    }
}

// Мобильное меню (отдельная структура)
.mobile-menu {
    position: fixed;
    top: 76px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $white-color;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    padding: 0 $spacing-md $spacing-md;
    gap: 0;
    overflow-y: auto;
    z-index: 1001;
    box-shadow: $shadow-xl;
    opacity: 0;
    pointer-events: none;
    transition: opacity $transition-base;

    &.mobile-menu-open {
        opacity: 1;
        pointer-events: auto;
    }
}

// Mobile styles
@media (max-width: $breakpoint-lg) {
    .nav-container {
        margin: 10px auto;
        justify-content: space-between;
    }

    .nav-actions {
        .btn-client {
            font-size: $font-size-sm;
            padding: $spacing-sm $spacing-md;
        }
    }
}
</style>
