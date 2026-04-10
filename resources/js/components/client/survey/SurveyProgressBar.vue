<template>
    <div class="survey-progress">
        <div
            class="survey-progress__bar"
            role="progressbar"
            :aria-valuenow="numerator"
            :aria-valuemin="1"
            :aria-valuemax="denominator"
            :aria-label="ariaLabel"
        >
            <div
                class="survey-progress__fill"
                :style="{ width: percent + '%' }"
            />
        </div>
        <p class="survey-progress__label" aria-hidden="true">
            {{ Math.round(percent) }}%
        </p>
    </div>
</template>

<script setup>
defineOptions({ name: "SurveyProgressBar" });

defineProps({
    /** Текущее значение для aria (шаг). */
    numerator: {
        type: Number,
        required: true,
    },
    /** Максимум для aria. */
    denominator: {
        type: Number,
        required: true,
    },
    /** Ширина заполнения полосы, 0–100. */
    percent: {
        type: Number,
        required: true,
    },
    /** Подпись для скринридеров. */
    ariaLabel: {
        type: String,
        required: true,
    },
});
</script>

<style scoped lang="scss">
@use "../../../../scss/variables" as *;

.survey-progress {
    width: 100%;
    min-width: 0;

    .survey-progress__bar {
        height: 4px;
        width: 100%;
        background: #e2e8f0;
        border-radius: 2px;
        overflow: hidden;

        .survey-progress__fill {
            height: 100%;
            background: $accent-success-dark;
            /* П. 7.2: ~200–300 ms, вровень с enter шага (`$transition-base`). */
            transition: width $transition-base ease-out;
        }
    }

    .survey-progress__label {
        margin: 6px 0 0;
        font-size: $font-size-xs;
        color: #64748b;
        text-align: right;
        line-height: 1.2;
    }
}
</style>
