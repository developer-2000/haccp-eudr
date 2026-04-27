<template>
    <Head>
        <title>{{ seo.title }}</title>
        <meta name="description" :content="seo.description" />
        <link rel="canonical" :href="seo.canonical" />
        <link
            v-for="alt in seo.hreflang"
            :key="alt.lang"
            rel="alternate"
            :hreflang="alt.lang"
            :href="alt.href"
        />
        <meta property="og:title" :content="seo.og.title" />
        <meta property="og:description" :content="seo.og.description" />
        <meta property="og:image" :content="seo.og.image" />
        <meta property="og:url" :content="seo.canonical" />
        <meta property="og:type" :content="seo.og.type" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" :content="seo.twitter.title" />
        <meta name="twitter:description" :content="seo.twitter.description" />
        <meta name="twitter:image" :content="seo.twitter.image" />
    </Head>
</template>

<script setup>
import { Head } from "@inertiajs/vue3";

defineOptions({ name: "SeoHead" });

/**
 * Универсальный компонент-обёртка над Inertia <Head> для всех публичных страниц.
 * Принимает объект seo той же формы, что возвращает SeoMetaResolver::resolveForInertia()
 * на бэкенде: { title, description, canonical, hreflang[], og: {...}, twitter: {...} }.
 * Используется в Pages/* чтобы не дублировать ~17 строк meta-тегов в каждой странице.
 */
defineProps({
    seo: {
        type: Object,
        required: true,
    },
});
</script>
