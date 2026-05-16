<template>
    <section class="survey-cta" aria-label="Survey CTA">
        <div class="survey-cta__content">
            <h2 class="survey-cta__title">
                {{ $t('home.survey_cta.title') }}
                <span class="survey-cta__title-secondary">
                    {{ $t('home.survey_cta.title_secondary') }}
                </span>
            </h2>

            <button
                type="button"
                class="btn-client btn-success survey-cta__button"
                :aria-label="$t('home.survey_cta.button_aria_label')"
                @click="goToSurvey"
            >
                {{ $t('home.survey_cta.button_text') }}
            </button>
        </div>
    </section>
</template>

<script setup>
defineOptions({
    name: 'SurveyCtaSection',
});

import { router as inertiaRouter } from '@inertiajs/vue3';
import { useCurrentLocale } from '@/composables/useCurrentLocale.js';

/**
 * Переходит на опрос через Inertia router без полной перезагрузки.
 * Используется в CTA-кнопке.
 */
function goToSurvey() {
    inertiaRouter.visit(`/${useCurrentLocale()}/survey`);
}
</script>

<style scoped lang="scss">
@use '../../../../scss/variables' as *;

.survey-cta {
    min-height: 300px;
    display: flex;
    align-items: center;
}

.survey-cta__content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: $spacing-lg;
}

.survey-cta__title {
    margin: 0;
    font-size: $font-size-2-25xl;
    line-height: 1.2;
    font-weight: 800;
    color: $bg-style-white;
}

.survey-cta__title-secondary {
    display: block;
    color: $text-light-w-grey;
    font-weight: 400;
}

.survey-cta__button {
    width: auto;
    box-shadow: $shadow-lg, $shadow-sm-md;

    @media (max-width: $breakpoint-sm) {
        font-size: 13px;
    }
}
</style>
