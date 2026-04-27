<template>
    <slot v-if="mounted" />
</template>

<script setup>
import { onMounted, ref } from "vue";

defineOptions({ name: "ClientOnly" });

/**
 * Обёртка, рендерящая дочерние элементы только после mount на клиенте.
 * Используется в Inertia-Layout для компонентов, которые не должны попадать в SSR-HTML
 * (доступ к window/document, тяжёлые модальные окна, демо-цепочки).
 */
const mounted = ref(false);

onMounted(() => {
    mounted.value = true;
});
</script>
