<template>
    <SurveyLayout>
        <template #header>
            <div class="survey-main-flow__header-stack">
                <SurveyProgressBar
                    :numerator="progressNumerator"
                    :denominator="progressDenominator"
                    :percent="progressPercent"
                    :aria-label="progressBarAriaLabel"
                />
                <div v-if="canGoBack" class="survey-main-flow__top-nav">
                    <button
                        type="button"
                        class="survey-main-flow__nav-back"
                        :aria-label="t('survey.nav.back_aria')"
                        @click="emit('go-back')"
                    >
                        <Icon
                            class="survey-main-flow__nav-back-icon"
                            name="left-outlined"
                            aria-hidden="true"
                        />
                        <span class="survey-main-flow__nav-back-text">
                            {{ t("survey.nav.back") }}
                        </span>
                    </button>
                </div>
            </div>
        </template>

        <SurveyStepTransition
            v-if="renderReady"
            :step-key="transitionStepKey"
            :instant="instantTransition"
        >
            <slot />
        </SurveyStepTransition>
    </SurveyLayout>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import SurveyLayout from "../SurveyLayout.vue";
import SurveyProgressBar from "../SurveyProgressBar.vue";
import SurveyStepTransition from "../SurveyStepTransition.vue";
import Icon from "../../../Icon.vue";

defineOptions({ name: "SurveyMainFlow" });

const props = defineProps({
    /** Текущий номер шага для прогресс-бара. */
    progressNumerator: {
        type: Number,
        required: true,
    },
    /** Общее количество шагов для прогресс-бара. */
    progressDenominator: {
        type: Number,
        required: true,
    },
    /** Процент заполнения прогресс-бара. */
    progressPercent: {
        type: Number,
        required: true,
    },
    /** Aria-label для прогресс-бара. */
    progressBarAriaLabel: {
        type: String,
        default: "",
    },
    /** Доступна ли навигация назад. */
    canGoBack: {
        type: Boolean,
        default: false,
    },
    /** Готовность к рендеру содержимого (resolved submitted state или submitted). */
    renderReady: {
        type: Boolean,
        default: false,
    },
    /** Ключ шага для анимации переходов SurveyStepTransition. */
    transitionStepKey: {
        type: [String, Number],
        required: true,
    },
    /** Отключить анимацию перехода (intro -> первый вопрос). */
    instantTransition: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["go-back"]);

const { t } = useI18n();
</script>

<style scoped lang="scss">
@use "../../../../../scss/variables" as *;

.survey-main-flow__header-stack {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    width: 100%;
    min-width: 0;

    .survey-main-flow__top-nav {
        min-height: $spacing-2xl;
        display: flex;
        align-items: center;
        margin-bottom: $spacing-sm;

        .survey-main-flow__nav-back {
            display: inline-flex;
            align-items: center;
            gap: $spacing-sm-w;
            padding: $spacing-sm $spacing-xs $spacing-sm 0;
            min-height: $spacing-2xl;
            border: none;
            background: transparent;
            color: $accent-primary;
            font-size: $font-size-base;
            cursor: pointer;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
            transition: color $transition-base ease;

            &:hover {
                color: $accent-primary-dark;
            }

            &:focus-visible {
                outline: 2px solid $accent-primary;
                outline-offset: 2px;
                border-radius: $radius-sm;
            }

            .survey-main-flow__nav-back-icon {
                width: 1.125rem;
                height: 1.125rem;
                flex-shrink: 0;

                :deep(svg) {
                    width: 100%;
                    height: 100%;
                }
            }

            .survey-main-flow__nav-back-text {
                line-height: 1.2;
            }
        }
    }
}
</style>
