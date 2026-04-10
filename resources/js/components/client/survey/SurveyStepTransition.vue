<template>
    <!-- out-in: без наложения двух шагов в потоке (высота); длительности — п. 7.2 -->
    <Transition
        :name="instant ? 'survey-step-instant' : 'survey-step'"
        mode="out-in"
    >
        <div :key="stepKey" class="survey-step-transition">
            <slot />
        </div>
    </Transition>
</template>

<script setup>
defineOptions({ name: "SurveyStepTransition" });

defineProps({
    /** Ключ смены шага для анимации входа/выхода. */
    stepKey: {
        type: [String, Number],
        required: true,
    },
    /** Без fade/slide (напр. intro ↔ первый вопрос). */
    instant: {
        type: Boolean,
        default: false,
    },
});
</script>

<style scoped lang="scss">
@use "../../../../scss/variables" as *;

.survey-step-transition {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;

    &.survey-step-enter-active {
        transition:
            opacity $transition-base ease-out,
            transform $transition-base ease-out;
    }

    &.survey-step-leave-active {
        transition:
            opacity $transition-fast ease-in,
            transform $transition-fast ease-in;
    }

    &.survey-step-enter-from {
        opacity: 0;
        transform: translateX(10px);
    }

    &.survey-step-leave-to {
        opacity: 0;
        transform: translateX(-8px);
    }

    /* Имя Transition без видимой анимации (классы вешаются на этот же div). */
    &.survey-step-instant-enter-active,
    &.survey-step-instant-leave-active {
        transition: none;
    }

    &.survey-step-instant-enter-from,
    &.survey-step-instant-leave-to {
        opacity: 1;
        transform: none;
    }
}
</style>
