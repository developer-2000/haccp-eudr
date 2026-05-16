<template>
    <div
        class="survey-multi-choice survey-page__options-stack"
        role="group"
        :aria-labelledby="groupLabelledby"
        :aria-describedby="subtitleId || undefined"
        :aria-required="groupAriaRequired ? 'true' : undefined"
    >
        <template v-if="useOptionGroups">
            <div
                v-for="(group, gi) in optionGroups"
                :key="'g' + gi"
                class="survey-multi-choice__group-block"
            >
                <p
                    v-if="group.heading"
                    class="survey-multi-choice__group-heading survey-page__text-wrap"
                >
                    {{ tr(group.heading) }}
                </p>
                <label
                    v-for="opt in group.options"
                    :key="opt.value"
                    class="survey-multi-choice__row"
                    :class="{
                        'survey-multi-choice__row--selected': isSelected(opt.value),
                    }"
                >
                    <input
                        class="survey-multi-choice__input"
                        type="checkbox"
                        :checked="isSelected(opt.value)"
                        @change="$emit('toggle', opt.value)"
                    />
                    <span class="survey-multi-choice__label-text">{{ tr(opt.label) }}</span>
                </label>
            </div>
        </template>
        <template v-else>
            <label
                v-for="opt in options"
                :key="opt.value"
                class="survey-multi-choice__row"
                :class="{
                    'survey-multi-choice__row--selected': isSelected(opt.value),
                }"
            >
                <input
                    class="survey-multi-choice__input"
                    type="checkbox"
                    :checked="isSelected(opt.value)"
                    @change="$emit('toggle', opt.value)"
                />
                <span class="survey-multi-choice__label-text">{{ tr(opt.label) }}</span>
            </label>
        </template>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { createSurveyFieldTextTranslator } from '@/features/survey/surveyFieldText.js';

defineOptions({ name: 'SurveyMultiChoice' });

const { t } = useI18n();
const tr = createSurveyFieldTextTranslator(t);

const props = defineProps({
    /** id заголовка вопроса для `role="group"` (п. 7.6). */
    groupLabelledby: {
        type: String,
        required: true,
    },
    /** id подзаголовка (несколько вариантов) — `aria-describedby`. */
    subtitleId: {
        type: String,
        default: '',
    },
    /** Плоский список вариантов, если не заданы секции `optionGroups`. */
    options: {
        type: Array,
        default: () => [],
    },
    /**
     * Секции с подзаголовками (п. 14 опросника); один `role="group"` на весь список.
     */
    optionGroups: {
        type: Array,
        default: null,
    },
    /** Текущие выбранные value (копия из answers[questionId]). */
    selectedValues: {
        type: Array,
        default: () => [],
    },
    /** `false` для вопросов с необязательным мультивыбором (п. 14). */
    groupAriaRequired: {
        type: Boolean,
        default: true,
    },
});

const useOptionGroups = computed(
    () => Array.isArray(props.optionGroups) && props.optionGroups.length > 0,
);

defineEmits({
    /** Клик по чекбоксу варианта — родитель обновляет answers и сброс «Другое». */
    toggle: (value) => typeof value === 'string',
});

/**
 * Состояние «отмечен» для варианта.
 * @param {string} value
 * @returns {boolean}
 */
function isSelected(value) {
    return props.selectedValues.includes(value);
}
</script>

<style scoped lang="scss">
@use '../../../../scss/variables' as *;

.survey-multi-choice {
    .survey-multi-choice__group-block {
        margin-top: $spacing-md;

        &:first-child {
            margin-top: 0;
        }

        .survey-multi-choice__group-heading {
            margin: 0 0 $spacing-sm-w;
            font-size: $font-size-sm;
            font-weight: 600;
            color: #334155;
            line-height: 1.35;
        }
    }

    .survey-multi-choice__row {
        display: flex;
        align-items: center;
        gap: $spacing-sm-m;
        min-height: $spacing-2xl;
        padding: $spacing-sm-m $spacing-sm-m-m;
        border: 1px solid #cbd5e1;
        border-left-width: 3px;
        border-left-color: #e2e8f0;
        border-radius: $radius-md;
        background: $bg-white;
        cursor: pointer;
        box-sizing: border-box;
        width: 100%;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
        transition:
            background-color $transition-fast,
            border-color $transition-fast;
        margin-bottom: 10px;

        &:last-child {
            margin-bottom: 0;
        }

        .survey-multi-choice__input {
            width: 1.125rem;
            height: 1.125rem;
            flex-shrink: 0;
            accent-color: $accent-success-dark;
        }

        .survey-multi-choice__label-text {
            font-size: $font-size-base;
            color: #1e293b;
            line-height: 1.4;
        }
    }
}
</style>
