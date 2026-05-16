<template>
    <n-drawer v-model:show="isOpen" :width="pendingDrawerWidth" placement="right">
        <n-drawer-content closable>
            <template #header>
                <span class="checklist-modal__pending-header-title">
                    {{ pendingDrawerTitle }}
                </span>
            </template>
            <div class="checklist-modal__pending-drawer">
                <TaskExecutionMetaBlock
                    :show-alert="showBluetoothAlert"
                    :targets-display="pendingDrawerTargetsDisplay"
                />
                <TaskExecutionTemperatureTimerPanel
                    v-if="showBluetoothAlert"
                    v-model:temperature-draft="pendingTemperatureDraft"
                    :field-type-display="pendingDrawerFieldTypeDisplay"
                    :input-prefix="pendingInputPrefix"
                    :input-suffix="pendingInputSuffix"
                    :photo-names="pendingPhotoNames"
                    :show-camera="pendingShowCamera"
                    @keypad-press="onKeypadPress"
                    @camera-shot="simulateCameraShot"
                />
                <TaskExecutionSingleChoicePanel
                    v-else-if="pendingDrawerFieldType === 'single_choice'"
                    v-model:answer="pendingSingleChoiceAnswer"
                    v-model:comment="pendingSingleChoiceComment"
                    :question="pendingSingleChoiceQuestion"
                    :options="pendingSingleChoiceOptions"
                    :report-file-name="pendingReportFileName"
                    :photo-names="pendingPhotoNames"
                    @submit="submitSingleChoiceAnswer"
                    @attach-report="simulateReportFileAttach"
                    @camera="simulateCameraShot"
                />
                <TaskExecutionTicketPanel
                    v-else-if="pendingDrawerFieldType === 'ticket'"
                    v-model:ticket-status="pendingTicketStatus"
                    v-model:ticket-comment="pendingTicketComment"
                    :description="pendingTicketDescription"
                    :report-file-name="pendingReportFileName"
                    :photo-names="pendingPhotoNames"
                    @submit="submitTicketResult"
                    @attach-report="simulateReportFileAttach"
                    @camera="simulateCameraShot"
                />
            </div>
        </n-drawer-content>
    </n-drawer>
</template>

<script setup>
import { NDrawer, NDrawerContent } from 'naive-ui';
import TaskExecutionMetaBlock from './TaskExecutionMetaBlock.vue';
import TaskExecutionSingleChoicePanel from './TaskExecutionSingleChoicePanel.vue';
import TaskExecutionTemperatureTimerPanel from './TaskExecutionTemperatureTimerPanel.vue';
import TaskExecutionTicketPanel from './TaskExecutionTicketPanel.vue';
import { useTaskExecutionDrawerState } from './useTaskExecutionDrawerState.js';

defineOptions({ name: 'TaskExecutionPanelModal' });

const props = defineProps({
    task: {
        type: Object,
        default: null,
    },
});

const {
    isOpen,
    pendingTemperatureDraft,
    pendingPhotoNames,
    pendingReportFileName,
    pendingSingleChoiceAnswer,
    pendingSingleChoiceComment,
    pendingTicketStatus,
    pendingTicketComment,
    pendingDrawerTitle,
    pendingDrawerWidth,
    pendingDrawerTargetsDisplay,
    pendingDrawerFieldType,
    showBluetoothAlert,
    pendingShowCamera,
    pendingSingleChoiceQuestion,
    pendingSingleChoiceOptions,
    pendingTicketDescription,
    pendingDrawerFieldTypeDisplay,
    pendingInputSuffix,
    pendingInputPrefix,
    openPendingDrawer,
    closeDrawer,
    onKeypadPress,
    submitSingleChoiceAnswer,
    submitTicketResult,
    simulateReportFileAttach,
    simulateCameraShot,
} = useTaskExecutionDrawerState(props);

defineExpose({
    open: openPendingDrawer,
    close: closeDrawer,
});
</script>

<style scoped lang="scss">
@use '../../../../../../scss/variables' as *;

/* Только обёртка контента drawer в родителе; остальное — в дочерних со scoped. */
.checklist-modal__pending-drawer {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    height: 100%;
}

@media (max-width: 640px) {
    .checklist-modal__pending-drawer {
        gap: $spacing-sm;
    }
}
</style>
