<template>
    <div class="survey-question-step">
        <div class="survey-question-step__main">
            <h2
                :id="stepHeadingId"
                class="survey-question-step__title survey-page__text-wrap"
                tabindex="-1"
            >
                {{ tr(question.question_text) }}
            </h2>
            <p
                v-if="question.subtitle"
                :id="questionSubtitleId"
                class="survey-question-step__subtitle survey-page__text-wrap"
            >
                {{ tr(question.subtitle) }}
            </p>
            <label
                v-if="question.field_caption && question.type !== 'text'"
                :id="fieldCaptionId"
                class="survey-question-step__caption survey-page__text-wrap"
                :for="selectId"
            >
                {{ tr(question.field_caption) }}
            </label>

            <SurveyChoiceList
                v-if="question.type === 'radio'"
                :group-labelledby="stepHeadingId"
                :options="question.options"
                :selected-value="answers[stepId]"
                @pick="$emit('pick-radio', $event)"
            />

            <div
                v-else-if="
                    question.type === 'select' && question.country_iso_select
                "
                class="survey-question-step__select-wrap"
            >
                <SurveyCountryPicker
                    v-model="answers[stepId]"
                    :trigger-id="selectId"
                    :aria-label="tr(question.question_text)"
                    :aria-describedby="selectAriaDescribedBy"
                />
            </div>

            <div
                v-else-if="question.type === 'select'"
                class="survey-question-step__select-wrap"
            >
                <select
                    :id="selectId"
                    v-model="answers[stepId]"
                    class="survey-page__control survey-question-step__select"
                    :aria-label="tr(question.question_text)"
                    :aria-describedby="selectAriaDescribedBy"
                    aria-required="true"
                >
                    <option disabled value="">{{ t("survey.ui.select_placeholder") }}</option>
                    <option
                        v-for="opt in question.options"
                        :key="opt.value"
                        :value="opt.value"
                    >
                        {{ tr(opt.label) }}
                    </option>
                </select>
            </div>

            <SurveyMultiChoice
                v-else-if="question.type === 'checkbox'"
                :group-labelledby="stepHeadingId"
                :subtitle-id="question.subtitle ? questionSubtitleId : ''"
                :options="question.options ?? []"
                :option-groups="question.option_groups"
                :group-aria-required="!question.checkbox_allow_empty"
                :selected-values="checkboxSelected"
                @toggle="$emit('toggle-checkbox', $event)"
            />

            <div
                v-else-if="question.type === 'text'"
                class="survey-question-step__text-wrap"
            >
                <label class="survey-page__field" :for="openTextInputId">
                    <span
                        v-if="question.field_caption"
                        class="survey-page__field-label survey-page__text-wrap"
                        >{{ tr(question.field_caption) }}</span
                    >
                    <textarea
                        v-if="question.text_multiline !== false"
                        :id="openTextInputId"
                        v-model="answers[stepId]"
                        class="survey-page__control survey-question-step__textarea survey-question-step__open-text"
                        :rows="question.text_rows ?? 4"
                        autocomplete="off"
                        :aria-label="tr(question.question_text)"
                        :aria-describedby="textFieldAriaDescribedBy"
                        :aria-required="
                            question.text_allow_empty ? undefined : 'true'
                        "
                    />
                    <input
                        v-else
                        :id="openTextInputId"
                        v-model="answers[stepId]"
                        type="text"
                        class="survey-page__control survey-question-step__open-text-input"
                        autocomplete="off"
                        :aria-label="tr(question.question_text)"
                        :aria-describedby="textFieldAriaDescribedBy"
                        :aria-required="
                            question.text_allow_empty ? undefined : 'true'
                        "
                    />
                </label>
            </div>

            <label
                v-if="showOtherField"
                class="survey-page__field survey-question-step__field--other"
                :for="otherTextareaId"
            >
                <span class="survey-page__field-label">{{
                    tr(question.other_detail_field_label) ||
                    t("survey.ui.other_default_label")
                }}</span>
                <textarea
                    :id="otherTextareaId"
                    v-model="answers[otherDetailKey]"
                    class="survey-page__control survey-question-step__textarea"
                    rows="3"
                    autocomplete="off"
                    :aria-label="
                        t('survey.ui.other_aria_prefix') +
                        ' ' +
                        tr(question.question_text)
                    "
                />
            </label>
        </div>

        <footer v-if="showNextButton" class="survey-page__footer">
            <button
                type="button"
                class="survey-question-step__next survey-primary-action"
                :disabled="nextDisabled"
                :aria-disabled="nextDisabled ? 'true' : 'false'"
                :aria-label="
                    nextDisabled ? t('survey.ui.next_disabled_aria') : undefined
                "
                @click="$emit('next')"
            >
                {{ t("survey.ui.next") }}
            </button>
        </footer>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { createSurveyFieldTextTranslator } from "@/features/survey/surveyFieldText.js";
import SurveyChoiceList from "./SurveyChoiceList.vue";
import SurveyCountryPicker from "./SurveyCountryPicker.vue";
import SurveyMultiChoice from "./SurveyMultiChoice.vue";

defineOptions({ name: "SurveyQuestionStep" });

const { t } = useI18n();
const tr = createSurveyFieldTextTranslator(t);

const props = defineProps({
    /** Полное описание вопроса из API/заглушки. */
    question: {
        type: Object,
        required: true,
    },
    /** Id текущего шага (ключ в answers для value вопроса). */
    stepId: {
        type: String,
        required: true,
    },
    /** Общий объект ответов опроса. */
    answers: {
        type: Object,
        required: true,
    },
    /** Ключ для текста «Другое». */
    otherDetailKey: {
        type: String,
        required: true,
    },
    /** Показать textarea уточнения. */
    showOtherField: {
        type: Boolean,
        default: false,
    },
    /** Показать кнопку «Далее». */
    showNextButton: {
        type: Boolean,
        default: false,
    },
    /** Блокировка «Далее», пока шаг невалиден (п. 6.5). */
    nextDisabled: {
        type: Boolean,
        default: false,
    },
    /** id заголовка для переноса фокуса при смене шага. */
    stepHeadingId: {
        type: String,
        default: "survey-step-heading",
    },
});

defineEmits({
    /** Выбран вариант radio; родитель вызывает applyRadioAnswer. */
    "pick-radio": (value) => typeof value === "string",
    /** Переключён checkbox; родитель — toggleCheckboxOption. */
    "toggle-checkbox": (value) => typeof value === "string",
    /** Переход на следующий шаг. */
    next: () => true,
});

const checkboxSelected = computed(() => {
    const arr = props.answers[props.question.id];
    return Array.isArray(arr) ? arr : [];
});

const questionSubtitleId = computed(
    () => `survey-q-subtitle-${props.question.id}`,
);
const fieldCaptionId = computed(() => `survey-field-caption-${props.question.id}`);
const selectId = computed(() => `survey-select-${props.question.id}`);

const otherTextareaId = computed(() => `survey-other-${props.stepId}`);

const openTextInputId = computed(() => `survey-open-text-${props.question.id}`);

const textFieldAriaDescribedBy = computed(() => {
    if (props.question.type !== "text" || !props.question.subtitle) {
        return undefined;
    }
    return questionSubtitleId.value;
});

const selectAriaDescribedBy = computed(() => {
    const parts = [];
    if (props.question.subtitle) {
        parts.push(questionSubtitleId.value);
    }
    if (props.question.field_caption) {
        parts.push(fieldCaptionId.value);
    }
    return parts.length ? parts.join(" ") : undefined;
});
</script>

<style scoped lang="scss">
@use "../../../../scss/variables" as *;

.survey-question-step {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;

    .survey-question-step__main {
        width: 100%;
        max-width: 640px;
        margin: 5% auto 0;

        .survey-question-step__title {
            font-size: 1.375rem;
            line-height: 1.35;
            font-weight: 600;
            color: #1e293b;
            margin: 0 0 12px;
        }

        .survey-question-step__subtitle {
            font-size: 0.9375rem;
            color: #475569;
            margin: 0 0 12px;
            line-height: 1.45;
        }

        .survey-question-step__caption {
            display: block;
            margin: 0 0 10px;
            font-size: 0.875rem;
            line-height: 1.4;
            color: #475569;
        }

        .survey-question-step__select-wrap {
            margin: 30px 0 16px;
            display: flex;
            justify-content: center;
            align-items: center;

            .survey-question-step__select {
                width: 100%;
                min-width: 280px;
                appearance: none;
                -webkit-appearance: none;
                -moz-appearance: none;
                padding-right: 2.75rem;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%2364748b' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 14px center;
                background-size: 1rem 1rem;
                cursor: pointer;
            }
        }

        .survey-page__field.survey-question-step__field--other {
            margin-top: 8px;

            .survey-question-step__textarea {
                min-height: 96px;
                resize: vertical;
                scroll-margin-bottom: calc(
                    #{$spacing-2xl} + #{$spacing-md-lg} +
                        env(safe-area-inset-bottom, 0px)
                );
            }
        }

        .survey-question-step__text-wrap {
            margin-top: 4px;

            .survey-question-step__open-text {
                min-height: 96px;
                resize: vertical;
                scroll-margin-bottom: calc(
                    #{$spacing-2xl} + #{$spacing-md-lg} +
                        env(safe-area-inset-bottom, 0px)
                );
            }

            .survey-question-step__open-text-input {
                min-height: $spacing-2xl;
            }
        }
    }
}
</style>
