<template>
    <div class="checklist-modal__card-header">
        <span class="checklist-modal__card-header-title" role="heading">{{ headerText }}</span>
        <span
            v-if="hasTask"
            class="checklist-modal__card-header-type"
            :aria-label="taskTypeAria"
            role="img"
            >{{ taskTypeDisplay }}</span
        >
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
    hasTask: {
        type: Boolean,
        default: false,
    },
    taskTitle: {
        type: String,
        default: '',
    },
    taskTypeDisplay: {
        type: String,
        default: '',
    },
    taskTypeAria: {
        type: String,
        default: '',
    },
});

const headerText = computed(() => {
    const trimmedTitle = String(props.taskTitle ?? '').trim();
    if (props.hasTask && trimmedTitle) {
        return trimmedTitle;
    }
    return t('demo.show_task_modal.task_details');
});
</script>
<style scoped lang="scss">
@use '../../../../../../scss/variables' as *;

.checklist-modal__card-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: $spacing-md;
    width: 100%;
    min-width: 0;
}

.checklist-modal__card-header-title {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $text-color;
    min-width: 0;
}

.checklist-modal__card-header-type {
    font-size: 1.35em;
    line-height: 1;
    white-space: nowrap;
    flex-shrink: 0;
}
</style>
