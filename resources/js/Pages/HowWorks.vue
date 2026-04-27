<template>
    <SeoHead :seo="seo" />

    <div class="how-works-page">
        <StepsSection />
        <AdvantagesSection />
        <div class="section-container-home section-container--home-survey-cta">
            <div class="container">
                <SurveyCtaSection />
            </div>
        </div>
    </div>
</template>

<script setup>
import StepsSection from "@/components/client/how-it-works/StepsSection.vue";
import AdvantagesSection from "@/components/client/how-it-works/AdvantagesSection.vue";
import SurveyCtaSection from "@/components/client/home/SurveyCtaSection.vue";
import SeoHead from "@/components/SeoHead.vue";
import PublicLayout from "@/Layouts/PublicLayout.vue";

defineOptions({
    name: "HowItWorks",
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
.section-container--home-survey-cta {
    background-color: $accent-primary;
}
</style>
