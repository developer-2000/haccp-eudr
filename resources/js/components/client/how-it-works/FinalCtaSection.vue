<template>
    <section class="final-cta">
        <div class="container final-cta__inner">
            <h2 class="final-cta__title">ГОТОВ НАЧАТЬ?</h2>
            <div class="final-cta__buttons">
                <button
                    type="button"
                    class="btn-client btn-success final-cta__btn"
                    @click="goToDemo"
                >
                    ДЕМО
                </button>
                <button
                    type="button"
                    class="btn-client btn-primary final-cta__btn"
                    @click="goToSurvey"
                >
                    SURVEY
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
defineOptions({
    name: "FinalCtaSection",
});

import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

/**
 * Возвращает текущую локаль из маршрута для построения URL.
 */
function getCurrentLocale() {
    return route.params.locale ?? "en";
}

/**
 * Переход на страницу демо. Используется при клике на кнопку ДЕМО.
 */
function goToDemo() {
    router.push("/" + getCurrentLocale() + "/demo");
}

/**
 * Переход на страницу опроса. Используется при клике на кнопку SURVEY.
 */
function goToSurvey() {
    router.push("/" + getCurrentLocale() + "/survey");
}
</script>

<style lang="scss" scoped>
@use "../../../../scss/variables" as *;

.final-cta {
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $spacing-xl 0;
    background: linear-gradient(to bottom, $accent-primary, $accent-primary-dark);
}

.final-cta__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-lg;
    text-align: center;
}

.final-cta__title {
    font-size: $font-size-3xl;
    font-weight: 700;
    color: $bg-white;
    margin: 0;
}

.final-cta__buttons {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    width: 100%;
    max-width: 320px;

    @media (min-width: $breakpoint-sm) {
        flex-direction: row;
        max-width: none;
        width: auto;
    }
}

.final-cta__btn {
    font-size: $font-size-xl;
    font-weight: 700;
    padding: $spacing-md $spacing-xl;
    border-radius: $radius-xl;
}
</style>
