<template>
    <div v-if="targetsLine" class="checklist-modal__targets-line border-bottom-dashed">
        <Icon
            v-if="taskScopeType === 'equipment'"
            name="battery-charging-90-round"
            class="checklist-modal__targets-icon equipment"
            aria-hidden="true"
        />
        <Icon
            v-else-if="taskScopeType === 'rooms'"
            name="account-balance-twotone"
            class="checklist-modal__targets-icon rooms"
            aria-hidden="true"
        />
        <span class="checklist-modal__targets-text">{{ targetsLine }}</span>
    </div>
</template>

<script setup>
import Icon from "@/components/Icon.vue";

defineProps({
    taskScopeType: {
        type: String,
        default: "",
    },
    targetsLine: {
        type: String,
        default: "",
    },
});
</script>
<style scoped lang="scss">
@use "../../../../../../scss/variables" as *;

.rooms {
    margin-right: 7px;
}

.equipment {
    margin: 0 0 0 -7px;
}

.border-bottom-dashed {
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px dashed #6b7280;
}

.checklist-modal__targets-line {
    margin: 0;
    font-size: $font-size-sm;
    color: $text-dark-grey;
    line-height: 1.4;
    display: flex;
    align-items: center;
}

.checklist-modal__targets-text {
    line-height: 21px;
}

.checklist-modal__targets-icon {
    color: $text-dark-grey;
}

.checklist-modal__targets-line :deep(.xicon) {
    width: auto;
    height: auto;
}

.checklist-modal__targets-line :deep(.xicon svg) {
    width: 25px;
    height: 25px;
}
</style>

