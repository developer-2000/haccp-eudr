<template>
    <div class="checklist-modal__pending-input">
        <p class="checklist-modal__one-answer">
            {{ question }}
        </p>
        <div
            class="checklist-modal__single-choice-options"
            role="radiogroup"
            :aria-label="t('demo.single_choice_panel.options_aria')"
        >
            <button
                v-for="option in options"
                :key="option"
                type="button"
                class="checklist-modal__single-choice-option"
                :class="{
                    'checklist-modal__single-choice-option--active': answer === option,
                }"
                @click="$emit('update:answer', option)"
            >
                <span class="checklist-modal__single-choice-radio" />
                <span>{{ option }}</span>
            </button>
        </div>
        <n-input
            :value="comment"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            :placeholder="t('demo.single_choice_panel.comment_placeholder')"
            @update:value="$emit('update:comment', $event)"
        />
        <n-button
            type="primary"
            class="checklist-modal__single-choice-submit"
            :disabled="!answer"
            @click="$emit('submit')"
        >
            {{ t('demo.single_choice_panel.confirm_answer') }}
        </n-button>

        <PendingPhotoCaptureBlock
            :report-file-name="reportFileName"
            :show-document="true"
            :show-camera="true"
            :photo-names="photoNames"
            @attach-report="$emit('attach-report')"
            @camera="$emit('camera')"
        />
    </div>
</template>

<script setup>
import { NButton, NInput } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
import PendingPhotoCaptureBlock from '../show_task/PendingPhotoCaptureBlock.vue';

defineProps({
    question: {
        type: String,
        default: '',
    },
    options: {
        type: Array,
        default: () => [],
    },
    answer: {
        type: String,
        default: '',
    },
    comment: {
        type: String,
        default: '',
    },
    reportFileName: {
        type: String,
        default: '',
    },
    photoNames: {
        type: Array,
        default: () => [],
    },
});

defineEmits(['update:answer', 'update:comment', 'submit', 'attach-report', 'camera']);
</script>

<style scoped lang="scss">
@use '../../../../../../scss/variables' as *;

.checklist-modal__pending-input {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    height: 100%;
    padding-top: 25px;
}

.checklist-modal__one-answer {
    padding: 10px 12px;
    border: 1px solid rgba($accent-primary, 0.25);
    border-radius: 5px;
    background-color: $bg-light-blue;
    color: #273a55;
    font-size: 0.875rem;
}

.checklist-modal__single-choice-options {
    display: grid;
    gap: $spacing-sm;
}

.checklist-modal__single-choice-option {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    min-height: 56px;
    padding: 10px 12px;
    border: 1px solid rgba($text-dark-grey, 0.25);
    border-radius: 12px;
    background-color: rgba($bg-light-grey, 0.2);
    color: $text-color;
    font-size: $font-size-sm;
    text-align: left;
    cursor: pointer;
}

.checklist-modal__single-choice-option.checklist-modal__single-choice-option--active {
    border-color: rgba($accent-primary, 0.6);
    background-color: rgba($accent-primary, 0.12);
}

.checklist-modal__single-choice-option.checklist-modal__single-choice-option--warning {
    border-color: rgba($accent-orange, 0.7);
    background-color: rgba($accent-orange, 0.16);
}

.checklist-modal__single-choice-radio {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid rgba($text-dark-grey, 0.5);
    background: $bg-style-white;
    flex-shrink: 0;
}

.checklist-modal__single-choice-option.checklist-modal__single-choice-option--active
    .checklist-modal__single-choice-radio {
    border-color: $accent-primary;
    box-shadow: inset 0 0 0 5px $accent-primary;
}

.checklist-modal__single-choice-option.checklist-modal__single-choice-option--warning
    .checklist-modal__single-choice-radio {
    border-color: $accent-orange;
    box-shadow: inset 0 0 0 5px $accent-orange;
}

.checklist-modal__single-choice-submit {
    min-height: 48px;
}

@media (max-width: 640px) {
    .checklist-modal__pending-input {
        gap: $spacing-sm;
        padding-top: 12px;
    }
}
</style>
