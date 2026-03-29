<template>
    <router-view />
</template>

<script setup>
import { useGrainCoolingDemoEntry } from "@/features/demo/task_grain_cooling";

defineOptions({
    name: "App",
});

/** START Сценария «Охлаждение зерна» */
useGrainCoolingDemoEntry();
</script>
