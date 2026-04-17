<template>
    <footer class="footer" role="contentinfo">
        <div class="container footer-container">
            <div class="footer-brand">
                <span class="logo-site">{{ siteConfig.name }}</span>
                <span class="logo-app">demo</span>
            </div>
            <nav class="footer-nav" aria-label="Footer">
                <router-link :to="privacyLink" class="footer-link">
                    {{ t('privacy_policy.page.title') }}
                </router-link>
                <router-link :to="contactLink" class="footer-link">
                    {{ t('contact.title') }}
                </router-link>
            </nav>
            <div class="footer-copyright">© {{ yearLabel }} {{ siteConfig.name }}</div>
        </div>

        <nav v-if="seoLocaleLinks.length" class="footer-seo-locales" aria-hidden="true">
            <a
                v-for="link in seoLocaleLinks"
                :key="link.code"
                :href="link.href"
                :hreflang="link.code"
            >{{ link.name }}</a>
        </nav>
    </footer>
</template>

<script setup>
defineOptions({ name: "Footer" });

import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useSiteConfigStore } from "@/stores";

const { t } = useI18n();

const siteConfig = useSiteConfigStore();

const START_YEAR = 2026;
const route = useRoute();

const yearLabel = computed(() => {
    const current = new Date().getFullYear();
    return current > START_YEAR ? `${START_YEAR}—${current}` : `${START_YEAR}`;
});

// Текущая локаль из URL-параметра маршрута, fallback на 'en'
const currentLocale = computed(() =>
    (typeof route.params.locale === "string" && route.params.locale) || "en"
);

const privacyLink = computed(() => `/${currentLocale.value}/privacy-policy`);
const contactLink = computed(() => `/${currentLocale.value}/contact`);

// SEO: ссылки на языковые версии, которых НЕТ в переключателе (header уже ссылается на свои 2)
const seoLocaleLinks = computed(() => {
    const allLocales = window.availableLocales || [];
    const countries = window.localeCountries || {};
    const currentPath = route.path;
    const locale = currentLocale.value;

    // Коды языков из переключателя (data-languages на #app)
    const switcherCodes = getSwitcherCodes();

    // Путь без текущей локали: /en/contact → /contact, /en → ""
    const pathWithoutLocale = currentPath.replace(new RegExp(`^/${locale}(/|$)`), '$1') || '/';

    return allLocales
        .filter((code) => !switcherCodes.has(code))
        .map((code) => ({
            code,
            name: countries[code]?.name || code.toUpperCase(),
            href: `/${code}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`,
        }));
});

function getSwitcherCodes() {
    try {
        const raw = document.getElementById('app')?.getAttribute('data-languages');
        const list = raw ? JSON.parse(raw) : [];
        return new Set(list.map((l) => l.code));
    } catch {
        return new Set();
    }
}
</script>

<style scoped lang="scss">
@use "../../../../scss/variables" as *;

.footer-seo-locales {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.footer {
    background-color: $bg-gray;
    border-top: 1px solid $border-color;
    padding: $spacing-lg 0;
    margin-top: auto;

    .footer-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: $spacing-md;

        @media (max-width: 580px) {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 20px;
        }

        .footer-brand {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;

            .logo-site {
                font-size: 24px;
                color: $text-color;
                font-weight: 600;
                line-height: 1;
            }

            .logo-app {
                font-weight: 500;
                font-size: 12px;
                background-color: $bg-yellow;
                padding: 2px 6px;
                border-radius: 4px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: $text-color;
                line-height: 1;
            }
        }

        .footer-nav {
            display: inline-flex;
            align-items: center;
            gap: 50px;

            @media (max-width: 580px) {
                gap: 35px;
            }

            .footer-link {
                color: $text-light-grey;
                font-size: $font-size-sm;
                text-decoration: none;
                transition: color $transition-fast;

                &:hover {
                    color: $accent-primary;
                }
            }
        }

        .footer-copyright {
            color: $text-light-grey;
            font-size: $font-size-sm;
            text-align: right;

            @media (max-width: 580px) {
                text-align: center;
            }
        }
    }
}

</style>
