<template>
    <SurveyCountrySelect
        :model-value="modelValue"
        :options="SURVEY_ENGLISH_COUNTRY_SELECT_OPTIONS"
        :trigger-id="triggerId"
        :aria-label="ariaLabel"
        :aria-describedby="ariaDescribedby"
        :aria-required="ariaRequired"
        @update:model-value="$emit('update:modelValue', $event)"
    />
</template>

<script setup>
import { SURVEY_ENGLISH_COUNTRY_SELECT_OPTIONS } from "../../../features/survey/surveyCountryOptions.js";
import SurveyCountrySelect from "./SurveyCountrySelect.vue";

/**
 * Универсальный выбор страны: v-model — ISO alpha-2 или пустая строка (плейсхолдер в UI).
 * Список стран и combobox с поиском зашиты внутри; снаружи передаются только привязка значения и aria/id для шага формы.
 */
defineOptions({ name: "SurveyCountryPicker" });

defineProps({
    modelValue: {
        type: String,
        default: "",
    },
    triggerId: {
        type: String,
        required: true,
    },
    ariaLabel: {
        type: String,
        required: true,
    },
    ariaDescribedby: {
        type: String,
        default: undefined,
    },
    ariaRequired: {
        type: Boolean,
        default: true,
    },
});

defineEmits({
    "update:modelValue": (v) => typeof v === "string",
});
</script>
