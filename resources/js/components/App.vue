<template>
    <router-view />
</template>

<script setup>
import { useGrainCoolingDemoEntry } from "@/features/demo/task_grain_cooling";
import { useSessionGuard } from "@/composables/useSessionGuard.js";

defineOptions({
    name: "App",
});

/** START Сценария «Охлаждение зерна» */
useGrainCoolingDemoEntry();

/** Синхронизация CSRF при возврате во вкладку + 419-страховка в apiAxios. */
useSessionGuard();
</script>
