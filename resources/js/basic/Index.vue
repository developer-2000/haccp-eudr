<template>
    <n-message-provider placement="top">
        <div class="app-wrapper">
            <Header />
            <GrainCoolingNotificationBanner />
            <main class="main-content">
                <router-view />
            </main>
        </div>
    </n-message-provider>
</template>

<script setup>
import Header from "../components/client/header/Header.vue";
import GrainCoolingNotificationBanner from "@/features/demo/task_grain_cooling/GrainCoolingNotificationBanner.vue";

defineOptions({
    name: "Index",
});
</script>
