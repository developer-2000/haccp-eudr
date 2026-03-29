<template>
    <router-view />
</template>

<script setup>
import { useGrainCoolingDemoEntry } from "@/features/demo/task_grain_cooling";

defineOptions({
    name: "App",
});

/** Сценарий «Охлаждение зерна»: старт при любой загрузке SPA (любая страница). */
useGrainCoolingDemoEntry();
</script>
