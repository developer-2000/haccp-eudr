<template>
    <div class="app-wrapper">
        <Header />
        <ClientOnly>
            <GrainCoolingNotificationBanner />
        </ClientOnly>
        <main
            class="main-content"
            :class="{ 'main-content--bg-style-white': isAboutPage }"
            scroll-region
        >
            <slot />
            <Footer />
        </main>
        <ClientOnly>
            <ConsentOverlay />
        </ClientOnly>
    </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from "vue";
import { usePage } from "@inertiajs/vue3";
import Header from "@/components/client/header/Header.vue";
import Footer from "@/components/client/footer/Footer.vue";
import GrainCoolingNotificationBanner from "@/features/demo/task_grain_cooling/GrainCoolingNotificationBanner.vue";
import ClientOnly from "@/components/ClientOnly.vue";
import { useSessionGuard } from "@/composables/useSessionGuard.js";
// Прямой путь, минуя barrel `task_grain_cooling/index.js`: barrel реэкспортит `GlobalTaskReminderToast.vue`,
// который тащит naive-ui — а он на этапе импорта обращается к `window` и валит SSR.
import { useGrainCoolingDemoEntry } from "@/features/demo/task_grain_cooling/grainCoolingDemoEntry";

// ConsentOverlay использует naive-ui — грузим лениво, чтобы naive не попал в SSR-бандл.
// Реальный mount происходит только внутри `<ClientOnly>` после гидрации.
const ConsentOverlay = defineAsyncComponent(
    () => import("@/components/client/consent/ConsentOverlay.vue"),
);

defineOptions({ name: "PublicLayout" });

const page = usePage();

/**
 * Признак страницы About — переключает фоновую тему main-контейнера.
 * Заменяет legacy-проверку `useRoute().name === "About"` из basic/Index.vue:
 * в Inertia текущая Page-компонента приходит как `usePage().component`.
 */
const isAboutPage = computed(() => page.component === "About");

useSessionGuard();
useGrainCoolingDemoEntry();
</script>
