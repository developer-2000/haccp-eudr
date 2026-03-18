<template>
    <section class="survey-cta" aria-label="Survey CTA">
        <div class="survey-cta__content">
            <h2 class="survey-cta__title">
                Расскажите, как ведёте HACCP/EUDR
                <span class="survey-cta__title-secondary">
                    настроим прототип под вас
                </span>
            </h2>

            <button
                type="button"
                class="btn-client btn-success survey-cta__button"
                aria-label="Заполнить опрос (5 минут)"
                @click="goToSurvey"
            >
                Заполнить опрос (5 минут)
            </button>
        </div>
    </section>
</template>

<script setup>
defineOptions({
    name: "SurveyCtaSection",
});

import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

/**
 * Возвращает текущую локаль из параметров маршрута.
 * Используется для формирования локализованного URL перехода.
 */
function getCurrentLocale() {
    return route.params.locale ?? "en";
}

/**
 * Переходит на страницу опроса с учётом локали.
 * Используется в CTA-кнопке.
 */
function goToSurvey() {
    router.push("/" + getCurrentLocale() + "/survey");
}
</script>

<style scoped lang="scss">
@use "../../../../scss/variables" as *;

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
    color: $text-color;
}

.survey-cta__title-secondary {
    display: block;
    color: $text-dark-grey;
    font-weight: 400;
}

.survey-cta__button {
    width: auto;
    box-shadow: $shadow-lg, $shadow-sm-md;

    @media (max-width: $breakpoint-sm) {
        width: 100%;
    }
}
</style>

