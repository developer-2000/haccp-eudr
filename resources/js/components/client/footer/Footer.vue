<template>
    <footer class="footer" role="contentinfo">
        <div class="container footer-container">
            <div class="footer-brand">
                <span class="logo-site">{{ siteConfig.name }}</span>
                <span class="logo-app">demo</span>
            </div>
            <nav class="footer-nav" aria-label="Footer">
                <Link
                    :href="privacyLink"
                    class="footer-link"
                    :class="{ 'footer-link--exact-page': currentPath === privacyLink }"
                >
                    {{ t('privacy_policy.page.title') }}
                </Link>
                <Link
                    :href="contactLink"
                    class="footer-link"
                    :class="{ 'footer-link--exact-page': currentPath === contactLink }"
                >
                    {{ t('contact.title') }}
                </Link>
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

import { computed, ref, onMounted } from "vue";
import { Link, usePage } from "@inertiajs/vue3";
import { useI18n } from "vue-i18n";
import { useCurrentLocale } from "@/composables/useCurrentLocale.js";

const { t } = useI18n();

const page = usePage();
const siteConfig = computed(() => page.props.siteConfig || { name: "", adminEmail: "" });

const START_YEAR = 2026;

const yearLabel = computed(() => {
    const current = new Date().getFullYear();
    return current > START_YEAR ? `${START_YEAR}—${current}` : `${START_YEAR}`;
});

const currentLocale = ref(useCurrentLocale());

/** Реактивный путь без query/hash; обновляется на каждый Inertia-визит (Footer — persistent layout, onMounted сработал бы один раз). */
const currentPath = computed(() => {
    const url = page.url || "/";
    const qIdx = url.search(/[?#]/);
    return qIdx === -1 ? url : url.slice(0, qIdx);
});

onMounted(() => {
    currentLocale.value = useCurrentLocale();
});

const privacyLink = computed(() => `/${currentLocale.value}/privacy-policy`);
const contactLink = computed(() => `/${currentLocale.value}/contact`);

/**
 * Скрытые SEO-ссылки на все остальные локали текущей страницы (для языков,
 * которых нет в переключателе). Используется ботами для индексации, людям не видно.
 */
const seoLocaleLinks = computed(() => {
    const allLocales = page.props.availableLocales || [];
    const countries = page.props.localeCountries || {};
    const switcherCodes = new Set(
        (page.props.switcherLocales || []).map((l) => l.code),
    );
    const locale = currentLocale.value;

    const pathWithoutLocale = currentPath.value.replace(new RegExp(`^/${locale}(/|$)`), '$1') || '/';

    return allLocales
        .filter((code) => !switcherCodes.has(code))
        .map((code) => ({
            code,
            name: countries[code]?.name || code.toUpperCase(),
            href: `/${code}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`,
        }));
});
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

            .footer-link.footer-link--exact-page {
                color: $accent-primary;
                pointer-events: none;
                cursor: default;
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
