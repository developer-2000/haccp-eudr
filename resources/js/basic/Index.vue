<template>
    <n-message-provider placement="top">
        <div class="app-wrapper">
            <Header />
            <GrainCoolingNotificationBanner />
            <main
                class="main-content"
                :class="{ 'main-content--bg-style-white': isAboutRoute }"
            >
                <router-view />
                <Footer />
            </main>
            <ConsentOverlay />
        </div>
    </n-message-provider>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Header from "../components/client/header/Header.vue";
import Footer from "../components/client/footer/Footer.vue";
import ConsentOverlay from "../components/client/consent/ConsentOverlay.vue";
import GrainCoolingNotificationBanner from "@/features/demo/task_grain_cooling/GrainCoolingNotificationBanner.vue";

defineOptions({
    name: "Index",
});

const route = useRoute();
const isAboutRoute = computed(() => route.name === "About");
</script>
