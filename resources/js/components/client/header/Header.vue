<template>
    <header class="header">
        <nav class="nav" role="navigation" :aria-label="$t('header.nav.aria_label')">
            <div class="container nav-container">
                <div class="nav-logo">
                    <Link :href="safeLogo.link" class="logo-link">
                        <span class="logo-site">{{ siteConfig.name }}</span>
                        <span class="logo-app">demo</span>
                    </Link>
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
                    :aria-label="$t('header.nav.toggle_mobile_menu')"
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
                    <div class="box-switch-lang-mobile-menu">
                        <div
                            v-if="
                                isLangSwitcherHidden && languagesList.length > 1
                            "
                            class="mobile-menu__lang"
                            role="group"
                            :aria-label="$t('header.nav.language_group_aria')"
                        >
                            <button
                                v-for="lang in languagesList"
                                :key="lang.code"
                                type="button"
                                :class="[
                                    'lang-switcher__btn',
                                    {
                                        'lang-switcher__btn--active':
                                            currentLocale === lang.code,
                                    },
                                ]"
                                :aria-pressed="currentLocale === lang.code"
                                :title="lang.name"
                                @click="
                                    setLocale(lang.code);
                                    closeMobileMenu();
                                "
                            >
                                {{ lang.prefix }}
                            </button>
                        </div>
                    </div>
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
                    <div
                        v-if="languagesList.length > 1"
                        class="lang-switcher"
                        role="group"
                        :aria-label="$t('header.nav.language_group_aria')"
                    >
                        <button
                            v-for="lang in languagesList"
                            :key="lang.code"
                            type="button"
                            :class="[
                                'lang-switcher__btn',
                                {
                                    'lang-switcher__btn--active':
                                        currentLocale === lang.code,
                                },
                            ]"
                            :aria-pressed="currentLocale === lang.code"
                            :title="lang.name"
                            @click="setLocale(lang.code)"
                        >
                            {{ lang.prefix }}
                        </button>
                    </div>
                    <button
                        type="button"
                        class="btn-client btn-primary nav-cta"
                        :class="{ 'nav-cta--icon-only': isCtaIconOnly }"
                        :aria-label="
                            isCtaIconOnly
                                ? $t('header.cta.aria_icon_only')
                                : undefined
                        "
                        @click="goToSurvey"
                    >
                        <Icon
                            v-if="isCtaIconOnly"
                            name="business-center-round"
                            class="nav-cta-icon"
                        />
                        <template v-else>
                            <span class="nav-cta-line">{{
                                $t("header.cta.leave_request")
                            }}</span>
                            <span
                                class="nav-cta-line nav-cta-line--accent"
                            >{{ $t("header.cta.tell_about_business") }}</span>
                        </template>
                    </button>
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

import {
    ref,
    onMounted,
    onBeforeUnmount,
    computed,
    watch,
    shallowRef,
} from "vue";
import { Link, router as inertiaRouter, usePage } from "@inertiajs/vue3";
import Icon from "../../Icon.vue";
/** @type {NavConfig} */
import navConfig from "@/config/nav";
import { useMobileMenu } from "./composables/useMobileMenu";
import { useBreakpoint } from "./composables/useBreakpoint";
import NavMenuItem from "./NavMenuItem.vue";
import { useCurrentLocale } from "@/composables/useCurrentLocale.js";
import axios from "axios";

const page = usePage();
const siteConfig = computed(() => page.props.siteConfig || { name: "", adminEmail: "" });
const languagesList = computed(() => page.props.switcherLocales || []);

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

const { isMobile } = useBreakpoint(1101);
/** true при ширине <= 1280px — показываем только иконку в CTA */
const { isMobile: isCtaIconOnly } = useBreakpoint(1350);
/** true при ширине <= 580px — переключатель языков скрыт в шапке, показываем в моб. меню */
const { isMobile: isLangSwitcherHidden } = useBreakpoint(581);

const initialLocale = ref(useCurrentLocale());
const currentLocale = computed(() => initialLocale.value);

/**
 * SERVER - Смена языка: POST /locale (session, cookie, лог), затем full reload на /{locale}/путь.
 * Полный reload нужен, чтобы middleware SetLocale пересобрал shared-props и i18n клиента переинициализировался.
 */
async function setLocale(locale) {
    if (locale === currentLocale.value) return;
    const pathname = window.location.pathname;
    const allLocales = page.props.availableLocales || languagesList.value.map((l) => l.code);
    const segments = pathname.split("/").filter(Boolean);
    const rest = (
        allLocales.includes(segments[0]) ? segments.slice(1) : segments
    ).join("/");
    const url = "/" + locale + (rest ? "/" + rest : "");
    const csrf = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");
    try {
        await axios.post(
            "/locale",
            { locale },
            {
                headers: {
                    Accept: "application/json",
                    ...(csrf && { "X-CSRF-TOKEN": csrf }),
                },
            },
        );
    } catch {
        /* ignore */
    }
    window.location.href = url;
}

const goToSurvey = () => {
    inertiaRouter.visit(`/${currentLocale.value}/survey`);
};

const defaultConfig = {
    logo: { text: "", link: "/" },
    menu: [],
    actions: { buttons: [] },
};

const validatedNavConfig =
    navConfig ||
    (() => {
        return defaultConfig;
    })();

/** @type {import('vue').ShallowRef<NavConfig>} */
const navConfigRef = shallowRef(validatedNavConfig);

/** @type {import('vue').ComputedRef<NavConfig['logo']>} */
const safeLogo = computed(() => {
    const logo = navConfigRef.value?.logo || defaultConfig.logo;
    const locale = currentLocale.value;
    const link =
        logo.link === "/"
            ? "/" + locale
            : "/" +
              locale +
              (logo.link.startsWith("/") ? logo.link : "/" + logo.link);
    return { ...logo, link };
});

/**
 * Меню: пункты из navConfig (nav.js), `item.label` — ключ vue-i18n (напр. header.menu.demo).
 */
/** @type {import('vue').ComputedRef<NavConfig['menu']>} */
const safeMenu = computed(() => {
    const menu = navConfigRef.value?.menu ?? defaultConfig.menu;
    const locale = currentLocale.value;
    return (Array.isArray(menu) ? menu : []).map((item) => ({
        ...item,
        link:
            "/" +
            locale +
            (item.link.startsWith("/") ? item.link : "/" + item.link),
        activePathPrefix:
            item.activePathPrefix != null && item.activePathPrefix !== ""
                ? "/" +
                  locale +
                  (String(item.activePathPrefix).startsWith("/")
                      ? item.activePathPrefix
                      : "/" + item.activePathPrefix)
                : null,
    }));
});

onMounted(() => {
    initialLocale.value = useCurrentLocale();
});

// При открытом моб. меню — убираем скролл страницы и полосу прокрутки
watch(isMobileMenuOpen, (open) => {
    if (open) {
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
    } else {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
    }
});

onBeforeUnmount(() => {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
});
</script>

<style scoped lang="scss">
@use "../../../../scss/variables" as *;

// Общий плейсхолдер для кнопок переключения языка (десктоп + мобилка)
%lang-switcher-btn {
    padding: $spacing-sm $spacing-md;
    border: none;
    border-radius: $radius-full;
    font-size: $font-size-sm;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: $text-light-grey;
    background: transparent;
    cursor: pointer;
    transition:
        color $transition-fast,
        background-color $transition-fast;

    &:hover {
        color: $text-color;
        background-color: #f4f4f4;
    }

    &.lang-switcher__btn--active {
        background: $bg-style-white;
        color: $accent-primary;
        box-shadow: $shadow-sm;
    }
}

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
        gap: $spacing-md;
        .nav-logo {
            flex-shrink: 0;
            position: relative;
            z-index: 1002;

            .logo-link {
                gap: 8px;

                .logo-site {
                    font-size: 33px;

                    @media (max-width: 420px) {
                        font-size: 28px;
                    }
                }

                .logo-app {
                    font-weight: 500;
                    font-size: 14px;
                    background-color: $bg-yellow;
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
            gap: $spacing-lg;
            flex-shrink: 0;
            position: relative;
            z-index: 1002;
        }

        .lang-switcher {
            display: inline-flex;
            background: $border-color;
            border-radius: $radius-full;
            padding: $spacing-xs;
            gap: 2px;

            .lang-switcher__btn {
                @extend %lang-switcher-btn;
            }
        }

        .nav-actions .nav-cta {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            margin-right: 0;

            .nav-cta-line {
                display: block;
            }
            .nav-cta-line--accent {
                color: #22c55e;
            }
        }

        .nav-cta--icon-only {
            padding: $spacing-sm $spacing-md;

            :deep(.xicon) {
                width: auto;
                height: auto;
            }

            :deep(.xicon svg) {
                min-width: 23px;
                min-height: 23px;
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

    .mobile-menu-icon {
        width: 24px;
        height: 24px;
    }

    &[aria-expanded="true"] .mobile-menu-icon {
        color: $text-red;
    }
}

// Мобильное меню (отдельная структура)
.mobile-menu {
    position: fixed;
    top: 103px;
    left: 0;
    right: 0;
    bottom: 0;
    height: calc(100vh - 103px);
    min-height: calc(100vh - 103px);
    background-color: $bg-gray;
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

    .box-switch-lang-mobile-menu {
        gap: 2px;
        margin: 20px 0 20px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .mobile-menu__lang {
            display: inline-flex;
            background: $border-color;
            border-radius: $radius-full;
            padding: $spacing-xs;

            .lang-switcher__btn {
                @extend %lang-switcher-btn;
            }
        }
    }
}

// Mobile styles (бургер и мобильное меню показываются при ширине ≤1100px)
@media (max-width: 1100px) {
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

// Переключатель языков скрыт на ширине ≤580px
@media (max-width: 580px) {
    .lang-switcher {
        display: none !important;
    }
}
</style>
