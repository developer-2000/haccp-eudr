<template>
    <div class="container">
        <div class="section-container">
            <HeroSection />
        </div>
        <div class="section-container">
            <MetricsSection />
        </div>
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
