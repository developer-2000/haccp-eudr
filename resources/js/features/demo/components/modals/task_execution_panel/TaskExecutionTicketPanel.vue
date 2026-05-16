<template>
    <div class="checklist-modal__pending-input">
        <div class="checklist-modal__ticket-description">
            <p class="checklist-modal__ticket-description-title">
                {{ t('demo.ticket_panel.description_label') }}
            </p>
            <p class="checklist-modal__ticket-description-text">
                {{ description }}
            </p>
        </div>
        <div
            class="checklist-modal__single-choice-options"
            role="radiogroup"
            :aria-label="t('demo.ticket_panel.status_aria')"
        >
            <button
                type="button"
                class="checklist-modal__single-choice-option"
                :class="{
                    'checklist-modal__single-choice-option--active':
                        ticketStatus === 'not_completed',
                    'checklist-modal__single-choice-option--warning':
                        ticketStatus === 'not_completed',
                }"
                @click="$emit('update:ticketStatus', 'not_completed')"
            >
                <span class="checklist-modal__single-choice-radio" />
                <span>{{ t('demo.ticket_panel.not_completed') }}</span>
            </button>
            <button
                type="button"
                class="checklist-modal__single-choice-option"
                :class="{
                    'checklist-modal__single-choice-option--active': ticketStatus === 'completed',
                }"
                @click="$emit('update:ticketStatus', 'completed')"
            >
                <span class="checklist-modal__single-choice-radio" />
                <span>{{ t('demo.ticket_panel.completed') }}</span>
            </button>
        </div>
        <n-input
            :value="ticketComment"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            :placeholder="t('demo.ticket_panel.comment_placeholder')"
            @update:value="$emit('update:ticketComment', $event)"
        />
        <n-button
            type="primary"
            class="checklist-modal__single-choice-submit"
            @click="$emit('submit')"
        >
            {{ t('demo.ticket_panel.confirm_status') }}
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
import PendingPhotoCaptureBlock from '../show_task/PendingPhotoCaptureBlock.vue';

const { t } = useI18n();

defineProps({
    description: {
        type: String,
        default: '—',
    },
    ticketStatus: {
        type: String,
        default: 'not_completed',
    },
    ticketComment: {
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

defineEmits(['update:ticketStatus', 'update:ticketComment', 'submit', 'attach-report', 'camera']);
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

.checklist-modal__ticket-description-text {
    color: $text-color;
    font-size: 14px;
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
