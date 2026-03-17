<template>
    <div class="container">
        <HeroSection />
        <MetricsSection />
    </div>
</template>

<script setup>
defineOptions({
    name: "Home",
});

import HeroSection from "@/components/client/home/HeroSection.vue";
import MetricsSection from "@/components/client/home/MetricsSection.vue";
</script>

<style lang="scss" scoped></style>
