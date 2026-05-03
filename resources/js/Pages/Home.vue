<template>
    <SeoHead :seo="seo" />

    <div class="section-container-home section-container--home-hero">
        <div class="container">
            <HeroSection />
        </div>
    </div>

    <div class="section-container-home section-container--home-metrics">
        <div class="container">
            <MetricsSection />
        </div>
    </div>

    <div class="section-container-home section-container--home-niches">
        <div class="container">
            <NichesSection />
        </div>
    </div>

    <div class="section-container-home section-container--home-survey-cta">
        <div class="container">
            <SurveyCtaSection />
        </div>
    </div>
</template>

<script setup>
import SeoHead from "@/components/SeoHead.vue";
import HeroSection from "@/components/client/home/HeroSection.vue";
import MetricsSection from "@/components/client/home/MetricsSection.vue";
import NichesSection from "@/components/client/home/NichesSection.vue";
import SurveyCtaSection from "@/components/client/home/SurveyCtaSection.vue";
import PublicLayout from "@/Layouts/PublicLayout.vue";

defineOptions({
    name: "Home",
    layout: PublicLayout,
});

defineProps({
    seo: {
        type: Object,
        required: true,
    },
});
</script>

<style lang="scss" scoped>
@use "../../scss/variables" as *;

.section-container-home {
    padding: $font-size-4xl 0;
}

.section-container--home-hero {
    background-color: $bg-gray;
}

.section-container--home-metrics {
    background-color: $bg-light-grey;
}

.section-container--home-survey-cta {
    background-color: $accent-primary;
}
</style>
