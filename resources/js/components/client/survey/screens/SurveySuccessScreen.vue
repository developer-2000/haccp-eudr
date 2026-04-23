<template>
    <div class="survey-page__block survey-page__block--success">
        <div class="survey-page__success-inner">
            <div
                id="survey-step-heading"
                class="survey-page__success-heading survey-page__text-wrap survey-page__success-heading--center"
                tabindex="-1"
                role="heading"
                aria-level="1"
            >
                {{ tr(successCopy.title) }}
            </div>
            <p
                v-if="successCopy.bodyParagraphs"
                class="survey-page__success-body survey-page__text-wrap"
            >
                {{ tr(successCopy.bodyParagraphs) }}
            </p>
            <p
                v-if="successCopy.reassurance"
                class="survey-page__success-reassurance survey-page__text-wrap"
            >
                {{ tr(successCopy.reassurance) }}
            </p>
            <p
                v-if="successCopy.updateViaEmailHint"
                class="survey-page__success-update-hint survey-page__text-wrap"
            >
                {{ tr(successCopy.updateViaEmailHint) }}
            </p>
            <RouterLink
                class="survey-page__success-home survey-primary-action"
                :to="homeRouteLocation"
            >
                {{ t("survey.success.home_link") }}
            </RouterLink>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { createSurveyFieldTextTranslator } from "../../../../features/survey/surveyFieldText.js";

defineOptions({ name: "SurveySuccessScreen" });

const props = defineProps({
    /** Объект копирайта: title, bodyParagraphs, reassurance, updateViaEmailHint. */
    successCopy: {
        type: Object,
        required: true,
    },
    /** Объект маршрута для RouterLink на главную страницу. */
    homeRouteLocation: {
        type: Object,
        required: true,
    },
});

const { t } = useI18n();
const tr = createSurveyFieldTextTranslator(t);
</script>

<style scoped lang="scss">
@use "../../../../../scss/variables" as *;

.survey-page__block {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
}

.survey-page__block--success {
    padding-top: $spacing-lg;
    padding-bottom: max($spacing-lg, env(safe-area-inset-bottom, 0px));
    justify-content: center;
    align-items: center;
    text-align: center;

    .survey-page__success-inner {
        width: 100%;
        margin: 0 auto;

        .survey-page__success-heading {
            font-size: 1.3125rem;
            font-weight: 500;
            line-height: 1.5;
            color: $text-slate-700;
            margin: 0;

            &.survey-page__success-heading--center {
                text-align: center;
            }
        }

        .survey-page__success-body {
            margin: $spacing-md 0 0;
            font-size: $font-size-sm;
            line-height: 1.5;
            color: $text-slate-700;
            white-space: pre-line;
        }

        .survey-page__success-reassurance {
            margin: $spacing-md 0 0;
            font-size: $font-size-sm;
            line-height: 1.5;
            color: $text-slate-500;
        }

        .survey-page__success-update-hint {
            margin: $spacing-sm-m 0 0;
            font-size: $font-size-sm;
            line-height: 1.5;
            color: $accent-primary;
            white-space: pre-line;
        }

        .survey-page__success-home {
            margin: $spacing-lg auto 0;
            width: fit-content;
            min-width: 240px;
            max-width: 100%;
            white-space: normal;
        }
    }
}
</style>
