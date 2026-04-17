import { computed } from "vue";
import { useHead } from "@unhead/vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const SITE_NAME = "HACCPilot";
const BASE_URL = window.location.origin;
const DEFAULT_OG_IMAGE = "/images/og-default.jpg";
const DEFAULT_DESCRIPTION =
    "Digital HACCP & EUDR compliance platform for food businesses.";
const AVAILABLE_LOCALES = window.availableLocales || ["en"];
const HREFLANG_MAP = window.localeHreflangMap || {};
const IS_DEV = import.meta.env.DEV;

const DESC_MIN_LENGTH = 50;
const DESC_MAX_LENGTH = 160;

/**
 * Разворачивает значение: если передан ref/computed — берёт .value, иначе возвращает как есть.
 */
function unref(val) {
    return typeof val === "object" && val !== null && "value" in val
        ? val.value
        : val;
}

/**
 * В dev-режиме проверяет длину description и выводит предупреждение в консоль.
 */
function warnDescriptionQuality(desc, routePath) {
    if (!IS_DEV || !desc) return;
    if (desc.length < DESC_MIN_LENGTH) {
        console.warn(
            `[SEO] description too short (${desc.length}/${DESC_MIN_LENGTH}) on ${routePath}`,
        );
    }
    if (desc.length > DESC_MAX_LENGTH) {
        console.warn(
            `[SEO] description too long (${desc.length}/${DESC_MAX_LENGTH}) on ${routePath}`,
        );
    }
}

/**
 * Устанавливает SEO мета-теги страницы: title, description, canonical, Open Graph, Twitter Cards, hreflang.
 * Используется в каждом page-компоненте для формирования полного набора мета-тегов.
 *
 * OG и Twitter теги берутся из отдельных ключей словаря (og_title, og_description, twitter_title,
 * twitter_description, og_image), с fallback на основные title/description.
 *
 * Поддерживает два режима:
 * 1. i18n-ключ: `usePageSeo({ i18nKey: "seo.home" })` — все тексты из словаря
 * 2. Прямые значения: `usePageSeo({ title: "...", description: "..." })` — для динамических страниц
 *
 * @param {Object} options
 * @param {string} [options.i18nKey] - базовый ключ i18n (например "seo.home")
 * @param {Object} [options.i18nParams] - параметры интерполяции для i18n (например { id: 123 })
 * @param {import('vue').Ref<string>|string} [options.title] - заголовок страницы (приоритет над i18nKey)
 * @param {import('vue').Ref<string>|string} [options.description] - описание страницы (приоритет над i18nKey)
 * @param {string} [options.ogType] - тип Open Graph (по умолчанию "website")
 */
export function usePageSeo({
    i18nKey,
    i18nParams,
    title,
    description,
    ogType = "website",
} = {}) {
    const route = useRoute();
    const { t, te } = useI18n();

    /**
     * Получает перевод по ключу с fallback: если ключ не существует, возвращает пустую строку.
     */
    const tr = (suffix) => {
        const base = unref(i18nKey);
        if (!base) return "";
        const key = `${base}.${suffix}`;
        const params = unref(i18nParams) || {};
        return te(key) ? t(key, params) : "";
    };

    const resolvedTitle = computed(() => {
        const raw = unref(title) || tr("title");
        return raw ? `${raw} | ${SITE_NAME}` : SITE_NAME;
    });

    const resolvedDescription = computed(() => {
        const raw = unref(description) || tr("description");
        const desc = raw || DEFAULT_DESCRIPTION;
        warnDescriptionQuality(desc, route.path);
        return desc;
    });

    const ogTitle = computed(() => {
        const raw = tr("og_title");
        return raw ? `${raw} | ${SITE_NAME}` : resolvedTitle.value;
    });

    const ogDescription = computed(() => {
        return tr("og_description") || resolvedDescription.value;
    });

    const ogImage = computed(() => {
        const img = tr("og_image") || DEFAULT_OG_IMAGE;
        return img.startsWith("http") ? img : `${BASE_URL}${img}`;
    });

    const twitterTitle = computed(() => {
        const raw = tr("twitter_title");
        return raw ? `${raw} | ${SITE_NAME}` : resolvedTitle.value;
    });

    const twitterDescription = computed(() => {
        return tr("twitter_description") || resolvedDescription.value;
    });

    /**
     * Формирует canonical URL из origin + pathname, без query params и hash.
     */
    const canonicalUrl = computed(() => {
        return `${BASE_URL}${route.path}`;
    });

    /**
     * Формирует hreflang-ссылки для всех доступных локалей текущей страницы.
     * Каждая языковая версия ссылается на все остальные (полный граф).
     */
    const hreflangLinks = computed(() => {
        const currentLocale = route.params.locale;
        if (!currentLocale) return [];

        const pathWithoutLocale =
            route.path.replace(`/${currentLocale}`, "") || "/";
        const suffix = pathWithoutLocale === "/" ? "" : pathWithoutLocale;

        const links = AVAILABLE_LOCALES.map((code) => ({
            rel: "alternate",
            hreflang: HREFLANG_MAP[code] || code,
            href: `${BASE_URL}/${code}${suffix}`,
        }));

        links.push({
            rel: "alternate",
            hreflang: "x-default",
            href: `${BASE_URL}/en${suffix}`,
        });

        return links;
    });

    const linkEntries = computed(() => [
        { rel: "canonical", href: canonicalUrl.value },
        ...hreflangLinks.value,
    ]);

    useHead({
        title: resolvedTitle,
        meta: [
            { name: "description", content: resolvedDescription },
            { property: "og:title", content: ogTitle },
            { property: "og:description", content: ogDescription },
            { property: "og:image", content: ogImage },
            { property: "og:url", content: canonicalUrl },
            { property: "og:type", content: ogType },
            { property: "og:site_name", content: SITE_NAME },
            { name: "twitter:card", content: "summary_large_image" },
            { name: "twitter:title", content: twitterTitle },
            { name: "twitter:description", content: twitterDescription },
            { name: "twitter:image", content: ogImage },
        ],
        link: linkEntries,
    });
}
