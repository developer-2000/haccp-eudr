<template>
    <SeoHead :seo="seo" />
    <ClientOnly>
        <NMessageProvider placement="top">
            <DemoPage :section="section" />
        </NMessageProvider>
    </ClientOnly>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
import SeoHead from '@/components/SeoHead.vue';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import ClientOnly from '@/components/ClientOnly.vue';

/**
 * Лениво загружаем naive-ui и всё дерево DemoPage ТОЛЬКО на клиенте — в чанках, которые
 * никогда не запрашиваются на сервере (внутри `<ClientOnly>`). Статический импорт уронил бы SSR:
 * css-render (зависимость naive-ui) обращается к `window` на этапе импорта модуля.
 */
const NMessageProvider = defineAsyncComponent(() =>
    import('naive-ui').then((m) => m.NMessageProvider),
);
const DemoPage = defineAsyncComponent(() => import('@/features/demo/page/DemoPage.vue'));

defineOptions({
    name: 'Demo',
    layout: PublicLayout,
});

defineProps({
    seo: {
        type: Object,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
});
</script>
