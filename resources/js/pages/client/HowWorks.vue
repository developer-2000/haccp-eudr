<template>
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
defineOptions({ name: "HowItWorks" });

import StepsSection from "@/components/client/how-it-works/StepsSection.vue";
import AdvantagesSection from "@/components/client/how-it-works/AdvantagesSection.vue";
import SurveyCtaSection from "@/components/client/home/SurveyCtaSection.vue";
import { usePageSeo } from "@/composables/usePageSeo";

usePageSeo({ i18nKey: "seo.how_it_works" });
</script>

<style lang="scss" scoped>
@use "../../../scss/variables" as *;

.section-container-home {
    padding: $font-size-4xl 0;
}
.section-container--home-survey-cta {
    background-color: $accent-primary;
}
</style>
