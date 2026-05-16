<template>
    <div class="survey-layout">
        <header v-if="showHeader" class="survey-layout__top">
            <slot name="header" />
        </header>
        <div class="survey-layout__body">
            <slot />
        </div>
    </div>
</template>

<script setup>
defineOptions({ name: 'SurveyLayout' });

defineProps({
    /** Показывать верхнюю зону (назад + прогресс); на success обычно false. */
    showHeader: {
        type: Boolean,
        default: true,
    },
});
</script>

<style scoped lang="scss">
@use '../../../../scss/variables' as *;

.survey-layout {
    display: flex;
    flex-direction: column;
    min-height: 0;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    background: #f8fafc;
    overflow-x: clip;

    .survey-layout__top {
        position: sticky;
        top: 0;
        z-index: 2;
        flex-shrink: 0;
        width: 100%;
        margin: 0 auto;
        padding: $spacing-sm-w clamp(#{$spacing-md}, 4vw, #{$spacing-md-lg}) $spacing-sm;
        box-sizing: border-box;
        background: #f8fafc;
    }

    .survey-layout__body {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        margin: 0 auto;
        padding: 0 5px;
        box-sizing: border-box;
        overflow-x: clip;
    }
}
</style>
