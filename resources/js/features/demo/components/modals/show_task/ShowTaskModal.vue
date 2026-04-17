<template>
    <!-- Основная модалка «Детали задачи» -->
    <n-modal
        v-model:show="showModel"
        preset="card"
        class="checklist-modal"
        content-scrollable
        :style="{ width: '800px', maxWidth: 'calc(100vw - 32px)' }"
        :segmented="{ content: true, footer: true }"
        @update:show="onVisibilityChange"
    >
        <!-- Шапка модалки: компактный заголовок с иконкой/типом задачи и доступным aria-лейблом -->
        <template #header>
            <CompleteTaskModalHeader
                :has-task="Boolean(viewTask)"
                :task-title="viewTask?.title ?? ''"
                :task-type-display="taskTypeDisplay"
                :task-type-aria="taskTypeAria"
            />
        </template>
        <!-- Тело модалки рендерим только когда есть выбранная задача -->
        <template v-if="viewTask">
            <div class="checklist-modal__content">
                <!-- Секция ответственного: исполнитель/персонал и контекст режима -->
                <TaskAssigneeSection
                    :task="viewTask"
                    :staff="staff"
                    :mode="mode"
                    :task-type="taskType"
                    :modal-show="show"
                />
                <!-- оборудование/помещения -->
                <TaskTargetsLine
                    :task-scope-type="viewTask.taskScopeType"
                    :targets-line="modalTargetsLine"
                />
                <!-- секция Суть задачи -->
                <TaskFieldSummarySection :lines="taskFieldSummaryLines"/>
                <!-- Основная таблица замеров по времени: статусы, pending, раскрытие действий -->
                <TaskMeasurementsTable
                    :task="viewTask"
                    :is-hot-mode="isHotMode"
                    :task-scheduled-for-future="taskScheduledForFuture"
                    v-model:expanded-action-row-key="expandedActionRowKey"
                    @open-pending="(row) => onOpenPending(row, 'click: pending badge in Status column')"
                />
            </div>
        </template>

        <!-- Боковая модалка выполнения задания -->
        <TaskExecutionPanelModal ref="pendingDrawerRef" :task="viewTask"/>

        <!-- Нижние кнопки -->
        <template #footer>
            <div class="checklist-modal__footer">
                <n-button
                    v-if="!isHotMode && viewTask"
                    type="warning"
                    size="large"
                    @click="onFooterRefreshClick"
                >
                    {{ tr('demo.show_task_modal.refresh') }}
                </n-button>
                <div v-else></div>
                <n-button
                    size="large"
                    type="info"
                    @click="onFooterCloseClick"
                >
                    {{ tr('demo.show_task_modal.close') }}
                </n-button>
            </div>
        </template>
    </n-modal>
</template>

<script setup>
import {computed, ref, watch} from "vue";
import {NButton, NModal} from "naive-ui";
import {useI18n} from "vue-i18n";
import {
    formatTaskFieldSummaryLine,
    normalizeTaskFieldDefinitions,
    TASK_FIELD_TYPE,
} from "@/features/demo/data/demoChecklistTaskFields";
import {
    equipmentTargetsSummary,
} from "@/features/demo/data/demoChecklistEquipment";
import {
    normalizeRoomTargetIds,
    ROOM_GROUPS,
} from "@/features/demo/data/demoChecklistRooms";
import CompleteTaskModalHeader from "./CompleteTaskModalHeader.vue";
import TaskExecutionPanelModal from "../task_execution_panel/TaskExecutionPanelModal.vue";
import TaskAssigneeSection from "./TaskAssigneeSection.vue";
import TaskFieldSummarySection from "./TaskFieldSummarySection.vue";
import TaskMeasurementsTable from "./TaskMeasurementsTable.vue";
import TaskTargetsLine from "./TaskTargetsLine.vue";
import {useDemoState} from "@/features/demo/composables/useDemoState";
import {
    useGrainCoolingShowTaskModalBridge,
    useGrainCoolingShowTaskModalViewTask,
} from "@/features/demo/task_grain_cooling";

defineOptions({name: "ShowTaskModal"});

const {t: tr} = useI18n();

const props = defineProps({
    show: {
        type: Boolean,
        required: true,
    },
    task: {
        type: Object,
        default: null,
    },
    taskType: {
        type: String,
        default: "ccp",
    },
    staff: {
        type: Array,
        default: () => [],
    },
    mode: {
        type: String,
        default: "checklists",
    },
});

const emit = defineEmits(["close"]);

const expandedActionRowKey = ref(null);
const pendingDrawerRef = ref(null);
const {demoState} = useDemoState();
const viewTask = useGrainCoolingShowTaskModalViewTask(props, demoState);
const isHotMode = computed(() => props.mode === "hot");

const startOfTodayTs = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
};

const isTaskScheduledForFutureCheck = (task) =>
    typeof task?.startDate === "number" &&
    Number.isFinite(task.startDate) &&
    task.startDate > startOfTodayTs();

const taskScheduledForFuture = computed(() =>
    viewTask.value ? isTaskScheduledForFutureCheck(viewTask.value) : false,
);

const {onOpenPending, tryAutoOpenPendingDrawerAfterDeepLink} =
    useGrainCoolingShowTaskModalBridge({
        getShow: () => props.show,
        getTask: () => viewTask.value,
        taskScheduledForFuture,
        isHotMode,
        pendingDrawerRef,
    });

const modalTargetsLine = computed(() => {
    const t = viewTask.value ?? null;
    if (!t) {
        return "";
    }
    if (t.taskScopeType === "equipment") {
        const s = equipmentTargetsSummary(t.equipmentTargetIds);
        return s || "";
    }
    if (t.taskScopeType === "rooms") {
        const ids = normalizeRoomTargetIds(t.roomTargetIds);
        if (!ids.length) {
            return "";
        }
        const roomLabelById = new Map(
            ROOM_GROUPS.flatMap((g) => g.items.map((it) => [it.id, it.label])),
        );
        return ids.map((id) => roomLabelById.get(id) ?? id).join(", ");
    }
    return "";
});

const taskFieldSummaryLines = computed(() => {
    const t = viewTask.value;
    if (!t) {
        return [];
    }
    return normalizeTaskFieldDefinitions(t.taskFieldDefinitions).map((def) => {
        if (def?.fieldType === TASK_FIELD_TYPE.TICKET) {
            const description = String(def?.config?.description ?? "").trim();
            return tr('demo.show_task_modal.ticket_label', { description: description || "—" });
        }
        return formatTaskFieldSummaryLine(def);
    });
});

const NICHE_LABEL_KEYS = { coffee: 'niche_coffee', bakery: 'niche_bakery', meat: 'niche_meat' };

const NICHE_EMOJI = {
    coffee: "☕",
    bakery: "🥐",
    meat: "🥩",
};

const taskTypeDisplay = computed(
    () => NICHE_EMOJI[props.taskType] ?? props.taskType,
);

const taskTypeAria = computed(() => {
    const key = NICHE_LABEL_KEYS[props.taskType];
    return key ? tr(`demo.show_task_modal.${key}`) : props.taskType;
});

const showModel = computed({
    get: () => props.show,
    set: (value) => {
        if (!value) {
            emit("close");
        }
    },
});

const applyDefaultCorrectiveActions = (task) => {
    const first = task?.correctiveActions?.[0];
    if (!first || !task?.measurements?.length) {
        return;
    }
    for (const m of task.measurements) {
        if (m.status !== "problem") {
            continue;
        }
        if (m.correctiveAction != null && m.correctiveAction !== "") {
            continue;
        }
        m.correctiveAction = first;
    }
};

watch(
    () => [props.show, viewTask.value],
    ([show, task]) => {
        if (show && task) {
            applyDefaultCorrectiveActions(task);
        }
    },
    {immediate: true},
);

const onVisibilityChange = (visible) => {
    if (!visible) {
        expandedActionRowKey.value = null;
        emit("close");
    }
};

const closeModal = () => {
    expandedActionRowKey.value = null;
    emit("close");
};

const refreshTaskState = () => {
    const task = viewTask.value;
    if (!task || typeof task !== "object") {
        return;
    }
    /** Слоты дня и сброс строк — только из `measurements`, без `repeatTimes`. */
    const currentRows = Array.isArray(task.measurements) ? task.measurements : [];
    const times = currentRows
        .map((m) => String(m?.time ?? "").trim())
        .filter(Boolean);

    task.measurements = times.map((time) => ({
        time,
        value: "-",
        status: "pending",
        aiWarning: null,
        correctiveAction: null,
        comment: null,
    }));
    task.status = false;
    expandedActionRowKey.value = null;
    pendingDrawerRef.value?.close?.();
};

function onFooterRefreshClick() {
    refreshTaskState();
}

function onFooterCloseClick() {
    closeModal();
}

defineExpose({
    tryAutoOpenPendingDrawerAfterDeepLink,
});
</script>

<style scoped lang="scss">
@use "../../../../../../scss/variables" as *;

.checklist-modal__content {
    display: flex;
    flex-direction: column;
}

.checklist-modal__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $spacing-sm;
    width: 100%;
}
</style>
