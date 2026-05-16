<template>
    <section class="survey-submitted-state" aria-live="polite">
        <div class="survey-submitted-state__inner">
            <h2
                :id="stepHeadingId"
                class="survey-submitted-state__title survey-page__text-wrap"
                tabindex="-1"
            >
                {{ t('survey.submitted_state.title') }}
            </h2>
            <p class="survey-submitted-state__text survey-page__text-wrap">
                {{ t('survey.submitted_state.subtitle') }}
            </p>
            <img
                class="survey-submitted-state__image"
                :src="'/images/edit_answer.jpg'"
                :alt="t('survey.submitted_state.image_alt')"
                loading="lazy"
            />
            <p class="survey-submitted-state__email survey-page__text-wrap">
                {{ t('survey.submitted_state.email_label') }}
                <strong>{{ maskedEmail }}</strong>
            </p>
            <p
                v-if="formattedSubmittedAt"
                class="survey-submitted-state__meta survey-page__text-wrap"
            >
                {{ t('survey.submitted_state.sent_label') }}
                {{ formattedSubmittedAt }}
            </p>
            <footer class="survey-page__footer">
                <button
                    type="button"
                    class="survey-submitted-state__reset survey-primary-action"
                    @click="$emit('reset-survey')"
                >
                    {{ t('survey.submitted_state.reset_button') }}
                </button>
            </footer>
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'SurveySubmittedState' });
const { t } = useI18n();

const props = defineProps({
    maskedEmail: {
        type: String,
        required: true,
    },
    submittedAt: {
        type: String,
        default: null,
    },
    stepHeadingId: {
        type: String,
        default: 'survey-step-heading',
    },
});

defineEmits({
    'reset-survey': () => true,
});

/**
 * Форматирует ISO-дату отправки для человекочитаемого вывода.
 * Используется для подписи времени последней отправки в UI.
 * @param {string | null} isoValue
 * @returns {string}
 */
function formatSubmittedAt(isoValue) {
    if (!isoValue) {
        return '';
    }
    const date = new Date(isoValue);
    if (Number.isNaN(date.getTime())) {
        return '';
    }
    return date.toLocaleString();
}

const formattedSubmittedAt = computed(() => formatSubmittedAt(props.submittedAt));
</script>

<style scoped lang="scss">
@use '../../../../scss/variables' as *;

.survey-submitted-state {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    min-height: min-content;
    padding: $spacing-md 0 30px;

    .survey-submitted-state__inner {
        width: 100%;
        max-width: 640px;
        margin: 0 auto;
        text-align: center;
    }

    .survey-submitted-state__title {
        margin: 0;
        font-size: 1.3125rem;
        line-height: 1.4;
        font-weight: 600;
        color: $text-slate-700;
    }

    .survey-submitted-state__text {
        margin: $spacing-sm-m 0 0;
        color: $text-slate-700;
        font-size: $font-size-sm;
        line-height: 1.5;
    }

    .survey-submitted-state__image {
        display: block;
        width: 100%;
        max-width: 360px;
        height: auto;
        margin: $spacing-md auto 0;
        border-radius: $radius-md;
        mix-blend-mode: multiply;
        opacity: 0.88;
    }

    .survey-submitted-state__email {
        margin: $spacing-md 0 0;
        color: $text-slate-700;
        font-size: $font-size-sm;
        line-height: 1.5;
    }

    .survey-submitted-state__meta {
        margin: $spacing-sm 0 0;
        color: $text-slate-500;
        font-size: 0.8125rem;
        line-height: 1.4;
    }

    .survey-submitted-state__reset {
        margin: $spacing-md auto 0;
        width: auto !important;
        max-width: none !important;
        min-width: max-content !important;
        white-space: nowrap;
    }
}
</style>
