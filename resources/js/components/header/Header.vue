<template>
    <header class="header">
        <nav class="nav" role="navigation" aria-label="Main navigation">
            <div class="nav-container">
                <div class="nav-logo">
                    <router-link :to="safeLogo.link" class="logo-link">
                        <img :src="'/images/logo.png'" alt="Logo" style="height: 25px;"/>
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
                    @click="toggleMobileMenu"
                    :aria-expanded="isMobileMenuOpen"
                    aria-label="Toggle mobile menu"
                >
                    <Icon :name="isMobileMenuOpen ? 'close' : 'bars'" class="mobile-menu-icon" />
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
                        :is-open="hasMobileDropdown(`${item.label}-${item.link}`)"
                        :on-toggle="() => toggleMobileDropdown(`${item.label}-${item.link}`)"
                        :on-item-click="closeMobileMenu"
                    />
                </div>
                <div class="nav-actions">
                    <div v-if="safeActions.search.enabled" class="search-wrapper">
                        <label for="header-search" class="sr-only">Search</label>
                        <input
                            id="header-search"
                            type="search"
                            class="search-input"
                            :placeholder="safeActions.search.placeholder"
                            aria-label="Search"
                        >
                        <Icon name="search" class="search-icon" aria-hidden="true" />
                    </div>
                    <template v-for="button in safeActions.buttons" :key="`${button.label}-${button.link}`">
                        <router-link
                            :to="button.link"
                            :class="button.type === 'primary' ? 'btn-primary' : 'btn-login'"
                        >
                            {{ button.label }}
                        </router-link>
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
// ============================================
// Импорты
// ============================================
import Icon from '../Icon.vue';
/** @type {NavConfig} */
import navConfig from '@/config/nav';
import { useMobileMenu } from './composables/useMobileMenu';
import { useBreakpoint } from './composables/useBreakpoint';
import NavMenuItem from './NavMenuItem.vue';

// ============================================
// Composables
// ============================================
const {
    /** @type {import('vue').Ref<boolean>} */
    isOpen: isMobileMenuOpen,
    /** @type {import('vue').ComputedRef<string[]>} */
    openedDropdowns: openedMobileDropdowns,
    /** @type {Function} */
    toggle: toggleMobileMenu,
    /** @type {Function} */
    close: closeMobileMenu,
    /** @type {Function} */
    toggleDropdown: toggleMobileDropdown,
    /** @type {Function} */
    hasDropdown: hasMobileDropdown
} = useMobileMenu();

const { isMobile } = useBreakpoint(1024);

// ============================================
// Валидация и мемоизация конфигурации
// ============================================
import { shallowRef, computed } from 'vue';

// Валидация navConfig выполняется один раз при инициализации
const defaultConfig = {
    logo: { text: '', link: '/' },
    menu: [],
    actions: { search: { enabled: false, placeholder: '' }, buttons: [] }
};

// navConfig импортируется статически, поэтому проверяем только на существование
const validatedNavConfig = navConfig || (() => {
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
        search: {
            enabled: Boolean(actions?.search?.enabled),
            placeholder: actions?.search?.placeholder || 'Search'
        },
        buttons: Array.isArray(actions?.buttons) ? actions.buttons : []
    };
});
</script>

<style scoped lang="scss">
@use '../../../scss/variables' as *;

// ============================================
// Accessibility
// ============================================

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}

// ============================================
// Header & Navigation
// ============================================

.header {
    background-color: $bg-color;
    border-bottom: 1px solid $border-color;
    position: sticky;
    top: 0;
    z-index: 1000;
}

.nav {
    padding: $spacing-md 0;
    .nav-container {
        max-width: 1380px;
        margin: 0 auto;
        padding: 0 $spacing-md;
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
                color: inherit;
                &:hover {
                    opacity: 0.8;
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

            .search-wrapper {
                position: relative;
                display: flex;
                align-items: center;

                .search-input {
                    width: 200px;
                    padding: $spacing-sm $spacing-md $spacing-sm 36px;
                    border: 1px solid $border-color;
                    border-radius: $radius-md;
                    font-size: $font-size-sm;
                    background-color: $bg-color;
                    transition: border-color $transition-fast, box-shadow $transition-fast;

                    &:focus {
                        outline: none;
                        border-color: $accent-color;
                        box-shadow: 0 0 0 3px rgba($accent-color, 0.1);
                    }

                    &::placeholder {
                        color: $text-light;
                    }
                }

                .search-icon {
                    position: absolute;
                    left: 12px;
                    width: 16px;
                    height: 16px;
                    color: $text-light;
                    pointer-events: none;
                }
            }

            .btn-primary {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: $spacing-sm $spacing-lg;
                background-color: $accent-color;
                color: $bg-color;
                text-decoration: none;
                font-size: $font-size-sm;
                font-weight: 600;
                border-radius: $radius-md;
                transition: background-color $transition-fast, transform $transition-fast;
                white-space: nowrap;

                &:hover {
                    background-color: $accent-color-dark;
                    transform: translateY(-1px);
                }
            }

            .btn-login {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: $spacing-sm $spacing-lg;
                color: $text-color;
                text-decoration: none;
                font-size: $font-size-sm;
                font-weight: 500;
                border-radius: $radius-md;
                transition: color $transition-fast;
                white-space: nowrap;

                &:hover {
                    color: $accent-color;
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
        color: $accent-color;
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
    background-color: $bg-color;
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
        .btn-primary,
        .btn-login {
            font-size: $font-size-sm;
            padding: $spacing-sm $spacing-md;
        }
    }
}
</style>

