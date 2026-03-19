<template>
    <div class="how-works-page">
        <StepsSection />
        <AdvantagesSection />
        <FinalCtaSection />
    </div>
</template>

<script setup>
defineOptions({ name: "HowItWorks" });

import StepsSection from "@/components/client/how-it-works/StepsSection.vue";
import AdvantagesSection from "@/components/client/how-it-works/AdvantagesSection.vue";
import FinalCtaSection from "@/components/client/how-it-works/FinalCtaSection.vue";
</script>
