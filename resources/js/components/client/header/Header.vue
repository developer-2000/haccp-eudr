<template>
    <header class="header">
        <nav class="nav" role="navigation" aria-label="Main navigation">
            <div class="container nav-container">
                <!-- Лого, ссылка на главную с учётом локали -->
                <div class="nav-logo">
                    <router-link :to="safeLogo.link" class="logo-link">
                        <span class="logo-site">{{ siteConfig.name }}</span>
                        <span class="logo-app">App</span>
                    </router-link>
                </div>
                <!-- Пункты меню, десктоп -->
                <div v-if="!isMobile" class="nav-menu">
                    <NavMenuItem
                        v-for="item in safeMenu"
                        :key="`${item.label}-${item.link}`"
                        :item="item"
                        variant="desktop"
                    />
                </div>
                <!-- Кнопка открытия/закрытия мобильного меню -->
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
                <!-- Мобильное меню, те же пункты что в десктопе -->
                <div
                    v-if="isMobile"
                    class="mobile-menu"
                    :class="{ 'mobile-menu-open': isMobileMenuOpen }"
                    role="menu"
                    :aria-hidden="!isMobileMenuOpen"
                >
                    <!-- Переключатель языков первым пунктом, когда в шапке он скрыт (≤580px) и языков 2+ -->
                    <div class="box-switch-lang-mobile-menu">
                        <div
                            v-if="isLangSwitcherHidden && languagesList.length > 1"
                            class="mobile-menu__lang"
                            role="group"
                            aria-label="Language"
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
                                @click="setLocale(lang.code); closeMobileMenu()"
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
                <!-- Переключатель языка -->
                <div class="nav-actions">
                    <!-- Кнопки локалей из data-languages, POST /locale и переход по URL -->
                    <div
                        v-if="languagesList.length > 1"
                        class="lang-switcher"
                        role="group"
                        aria-label="Language"
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
                    <!-- Переход на страницу опроса -->
                    <button
                        type="button"
                        class="btn-client btn-primary nav-cta"
                        :class="{ 'nav-cta--icon-only': isCtaIconOnly }"
                        :aria-label="
                            isCtaIconOnly
                                ? $t('messages.nav.cta.aria_icon_only')
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
                            <span class="nav-cta-line">{{ $t('messages.nav.cta.leave_request') }}</span>
                            <span class="nav-cta-line nav-cta-line--accent">{{
                                $t('messages.nav.cta.tell_about_business')
                            }}</span>
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
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

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

const { isMobile } = useBreakpoint(1101);
    /** true при ширине <= 1280px — показываем только иконку в CTA */
    const { isMobile: isCtaIconOnly } = useBreakpoint(1350);
    /** true при ширине <= 580px — переключатель языков скрыт в шапке, показываем в моб. меню */
    const { isMobile: isLangSwitcherHidden } = useBreakpoint(581);

const router = useRouter();
const route = useRoute();

// ============================================
// Locale (из URL :locale или data-locale)
// ============================================
import { ref, onMounted, onBeforeUnmount, computed, watch, shallowRef } from "vue";

const initialLocale = ref("en");
const defaultLanguages = [];

const languagesList = ref(getLanguagesList());
const currentLocale = computed(
    () => route.params.locale ?? initialLocale.value,
);

const goToSurvey = () => {
    router.push("/" + currentLocale.value + "/survey");
};

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
 * Меню для навигации: пункты из navConfig (nav.js), у каждого item.label — ключ i18n (напр. nav.menu.how_it_works).
 * Строку перевода здесь не подставляем: NavMenuItem выводит подпись через {{ $t(item.label) }},
 * словари берутся из vue-i18n (window.translations из lang/*.json, отдаёт SetLocale).
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
    }));
});

/**
 * Смена языка: POST /locale (session, cookie, лог), затем переход на /{locale}/путь.
 */
async function setLocale(locale) {
    if (locale === currentLocale.value) return;
    const pathname = window.location.pathname;
    const codes = languagesList.value.map((l) => l.code);
    const segments = pathname.split("/").filter(Boolean);
    const rest = (
        codes.includes(segments[0]) ? segments.slice(1) : segments
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

function getLanguagesList() {
    const el = document.getElementById("app");
    const raw = el?.getAttribute("data-languages");
    if (!raw) return defaultLanguages;
    try {
        const list = JSON.parse(raw);
        return Array.isArray(list) && list.length ? list : defaultLanguages;
    } catch {
        return defaultLanguages;
    }
}

function getInitialLocale() {
    const el = document.getElementById("app");
    const locale = (el?.getAttribute("data-locale") || "en").toLowerCase();
    const codes = languagesList.value.map((l) => l.code);
    return codes.includes(locale) ? locale : codes[0] || "en";
}

onMounted(() => {
    initialLocale.value = getInitialLocale();
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
        background: $bg-white;
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

    .box-switch-lang-mobile-menu{
        gap: 2px;
        margin: 20px 0 0;
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
