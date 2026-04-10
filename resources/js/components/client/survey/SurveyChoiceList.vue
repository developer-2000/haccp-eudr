<template>
    <div
        class="survey-choice-list survey-page__options-stack"
        role="radiogroup"
        :aria-labelledby="groupLabelledby"
        aria-required="true"
    >
        <button
            v-for="opt in options"
            :key="opt.value"
            type="button"
            class="survey-choice-list__btn"
            role="radio"
            :aria-checked="selectedValue === opt.value"
            :class="{
                'survey-choice-list__btn--selected':
                    selectedValue === opt.value,
            }"
            @click="$emit('pick', opt.value)"
        >
            {{ tr(opt.label) }}
        </button>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { createSurveyFieldTextTranslator } from "@/features/survey/surveyFieldText.js";

defineOptions({ name: "SurveyChoiceList" });

const { t } = useI18n();
const tr = createSurveyFieldTextTranslator(t);

defineProps({
    /** id заголовка вопроса (h2) для связи с `radiogroup` (п. 7.6). */
    groupLabelledby: {
        type: String,
        required: true,
    },
    /** Варианты из конфига вопроса. */
    options: {
        type: Array,
        required: true,
    },
    /** Текущее значение ответа (radio). */
    selectedValue: {
        type: String,
        default: undefined,
    },
});

defineEmits({
    /** Выбор варианта одиночного ответа. */
    pick: (value) => typeof value === "string",
});
</script>

<style scoped lang="scss">
@use "../../../../scss/variables" as *;

.survey-choice-list {
    .survey-choice-list__btn {
        display: inline-flex;
        align-items: center;
        width: 100%;
        min-height: $spacing-2xl;
        box-sizing: border-box;
        text-align: left;
        border: 1px solid #cbd5e1;
        background: $bg-white;
        border-radius: $radius-md;
        padding: $spacing-sm-m $spacing-sm-m-m;
        font-size: $font-size-base;
        line-height: 1.35;
        font-weight: 500;
        color: #1e293b;
        cursor: pointer;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
        transition:
            background-color $transition-fast,
            border-color $transition-fast;
    }
}
</style>
