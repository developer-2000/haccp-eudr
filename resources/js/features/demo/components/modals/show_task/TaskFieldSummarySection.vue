<template>
    <div v-if="lines.length" class="checklist-modal__task-fields">
        <p class="checklist-modal__assignee-label">{{ t('demo.task_fields.section_title') }}</p>
        <ul class="checklist-modal__task-fields-list">
            <li
                v-for="(line, idx) in lines"
                :key="idx"
                class="checklist-modal__task-fields-item"
            >
                {{ line }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();

defineProps({
    lines: {
        type: Array,
        default: () => [],
    },
});
</script>

<style scoped lang="scss">
@use "../../../../../../scss/variables" as *;

.checklist-modal__task-fields {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    margin-bottom: 20px;
}

.checklist-modal__assignee-label {
    margin: 0;
    font-size: $font-size-sm;
    font-weight: 600;
    color: $text-dark-grey;
}

.checklist-modal__task-fields-list {
    margin: 0;
    padding-left: 1.15em;
    font-size: $font-size-sm;
    color: $text-dark-grey;
    line-height: 1.45;
}

.checklist-modal__task-fields-item {
    margin-bottom: $spacing-xs;
}

.checklist-modal__task-fields-item:last-child {
    margin-bottom: 0;
}
</style>

