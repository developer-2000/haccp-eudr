<template>
    <!-- Боковая панель выполнения pending-замера: ширина от viewport, справа, открывается через ref.open() из родителя (ShowTaskModal). -->
    <n-drawer v-model:show="isOpen" :width="pendingDrawerWidth" placement="right">
        <n-drawer-content>
            <!-- Шапка drawer: название задачи и закрытие; не трогает настройки самого n-drawer. -->
            <template #header>
                <TaskExecutionPanelHeader
                    :title="pendingDrawerTitle"
                    @close="closeDrawer"
                />
            </template>
            <!-- Тело панели: контекст + одна из трёх форм ввода по типу поля задачи. -->
            <div class="checklist-modal__pending-drawer">
                <!-- Алерт про Bluetooth для temp/timer + строка целей (оборудование/помещения). Показывается всегда, алерт — только для температуры/таймера. -->
                <TaskExecutionMetaBlock
                    :show-alert="showBluetoothAlert"
                    :targets-display="pendingDrawerTargetsDisplay"
                />
                <!-- Ввод числа: температура °C или время (мин), экранная клавиатура, имитация фото. Только если тип поля temperature или timer. -->
                <TaskExecutionTemperatureTimerPanel
                    v-if="showBluetoothAlert"
                    :field-type-display="pendingDrawerFieldTypeDisplay"
                    v-model:temperature-draft="pendingTemperatureDraft"
                    :input-prefix="pendingInputPrefix"
                    :input-suffix="pendingInputSuffix"
                    :photo-names="pendingPhotoNames"
                    :show-camera="pendingShowCamera"
                    @keypad-press="onKeypadPress"
                    @camera-shot="simulateCameraShot"
                />
                <!-- Один вариант из списка + комментарий + вложения (файл/фото). Для поля single_choice. -->
                <TaskExecutionSingleChoicePanel
                    v-else-if="pendingDrawerFieldType === 'single_choice'"
                    :question="pendingSingleChoiceQuestion"
                    :options="pendingSingleChoiceOptions"
                    v-model:answer="pendingSingleChoiceAnswer"
                    v-model:comment="pendingSingleChoiceComment"
                    :report-file-name="pendingReportFileName"
                    :photo-names="pendingPhotoNames"
                    @submit="submitSingleChoiceAnswer"
                    @attach-report="simulateReportFileAttach"
                    @camera="simulateCameraShot"
                />
                <!-- Заявка: описание, статус выполнен/не выполнен, комментарий, вложения. Для поля ticket. -->
                <TaskExecutionTicketPanel
                    v-else-if="pendingDrawerFieldType === 'ticket'"
                    :description="pendingTicketDescription"
                    v-model:ticket-status="pendingTicketStatus"
                    v-model:ticket-comment="pendingTicketComment"
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
import {NDrawer, NDrawerContent} from "naive-ui";
import TaskExecutionMetaBlock from "./TaskExecutionMetaBlock.vue";
import TaskExecutionPanelHeader from "./TaskExecutionPanelHeader.vue";
import TaskExecutionSingleChoicePanel from "./TaskExecutionSingleChoicePanel.vue";
import TaskExecutionTemperatureTimerPanel from "./TaskExecutionTemperatureTimerPanel.vue";
import TaskExecutionTicketPanel from "./TaskExecutionTicketPanel.vue";
import {useTaskExecutionDrawerState} from "./useTaskExecutionDrawerState.js";

defineOptions({name: "TaskExecutionPanelModal"});

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
@use "../../../../../../scss/variables" as *;

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
