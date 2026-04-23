<template>
    <div class="survey-page__block survey-page__block--lead">
        <SurveyLeadForm
            :answers="answers"
            :title="translatedTitle"
            :bullets="translatedBullets"
            :expectation="translatedExpectation"
            :email-error="emailError"
            :email-input-id="EMAIL_INPUT_ID"
            :email-error-id="EMAIL_ERROR_ID"
            :loading="loading"
            :submit-label="submitLabel"
            :submit-error="submitError"
            @submit="emit('submit')"
        />
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { createSurveyFieldTextTranslator } from "../../../../features/survey/surveyFieldText.js";
import { SURVEY_PAGE_LEAD } from "../../../../features/survey/surveyQuestionsStub.js";
import SurveyLeadForm from "../SurveyLeadForm.vue";

defineOptions({ name: "SurveyLeadScreen" });

const EMAIL_INPUT_ID = "survey-lead-email";
const EMAIL_ERROR_ID = "survey-lead-email-err";

const props = defineProps({
    /** Reactive-объект ответов опроса (v-model полей внутри SurveyLeadForm). */
    answers: {
        type: Object,
        required: true,
    },
    /** Текст ошибки валидации email. */
    emailError: {
        type: String,
        default: "",
    },
    /** Флаг отправки формы (блокировка кнопки, aria-busy). */
    loading: {
        type: Boolean,
        default: false,
    },
    /** Текст кнопки отправки. */
    submitLabel: {
        type: String,
        default: "",
    },
    /** Текст ошибки отправки на сервер. */
    submitError: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["submit"]);

const { t } = useI18n();
const tr = createSurveyFieldTextTranslator(t);

const translatedTitle = computed(() => tr(SURVEY_PAGE_LEAD.title));
const translatedBullets = computed(() => SURVEY_PAGE_LEAD.bullets.map((item) => tr(item)));
const translatedExpectation = computed(() => tr(SURVEY_PAGE_LEAD.expectation));
</script>

<style scoped lang="scss">
.survey-page__block {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
}

.survey-page__block--lead {
    min-height: 0;
    text-align: left;
}
</style>
