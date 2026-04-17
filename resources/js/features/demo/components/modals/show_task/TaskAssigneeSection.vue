<template>
    <div class="checklist-modal__assignee-block border-bottom-dashed">
        <template v-if="isHotMode">
            <p class="checklist-modal__hot-assignee-label">
                <span>{{ t('demo.task_assignee.label_colon') }}</span>
                <span
                    class="checklist-modal__hot-assignee-text"
                    :class="{
                        'checklist-modal__hot-assignee-text--empty': !modalAssigneeDisplay,
                    }"
                >
                    {{ modalAssigneeDisplay || t('demo.task_assignee.not_assigned') }}
                </span>
            </p>
        </template>
        <template v-else>
            <p class="checklist-modal__assignee-label">{{ t('demo.task_assignee.label') }}</p>
            <template v-if="!task.assignedStaffId && !assigneePickerOpen">
                <div class="checklist-modal__assignee-row">
                    <span class="checklist-modal__assignee-empty">{{ t('demo.task_assignee.not_assigned') }}</span>
                    <n-button
                        type="primary"
                        @click="assigneePickerOpen = true"
                    >
                        {{ t('demo.task_assignee.assign') }}
                    </n-button>
                </div>
            </template>
            <n-select
                v-else
                :value="task.assignedStaffId ?? null"
                :options="assigneeSelectOptions"
                clearable
                filterable
                :placeholder="t('demo.task_assignee.select_placeholder')"
                @update:value="onAssigneeUpdate"
            />
        </template>
    </div>
</template>

<script setup>
import {computed, ref, watch} from "vue";
import {NButton, NSelect} from "naive-ui";
import {useI18n} from "vue-i18n";
import {NICHE_TO_SITE_ID, resolveStaffFullName} from "@/features/demo/utils/demoStaff";

const {t} = useI18n();

const props = defineProps({
    task: {
        type: Object,
        required: true,
    },
    staff: {
        type: Array,
        default: () => [],
    },
    mode: {
        type: String,
        default: "checklists",
    },
    taskType: {
        type: String,
        default: "ccp",
    },
    /** Синхронизация с видимостью родительской модалки */
    modalShow: {
        type: Boolean,
        default: false,
    },
});

const assigneePickerOpen = ref(false);
const isHotMode = computed(() => props.mode === "hot");

const siteIdForTask = computed(() => NICHE_TO_SITE_ID[props.taskType] ?? null);

const assigneeSelectOptions = computed(() => {
    const sid = siteIdForTask.value;
    const list = Array.isArray(props.staff) ? props.staff : [];
    const filtered = sid
        ? list.filter((m) => m && m.siteId === sid && m.active !== false)
        : list.filter((m) => m && m.active !== false);
    return filtered.map((m) => ({
        label: `${m.fullName} — ${m.role}`,
        value: m.id,
    }));
});

const modalAssigneeDisplay = computed(() => {
    const t = props.task;
    if (!t?.assignedStaffId) {
        return "";
    }
    const name = resolveStaffFullName(props.staff, t.assignedStaffId);
    return name === "—" ? "" : name;
});

const onAssigneeUpdate = (value) => {
    if (!props.task) {
        return;
    }
    props.task.assignedStaffId = value ?? null;
    if (!value) {
        assigneePickerOpen.value = false;
    }
};

watch(
    () => [props.modalShow, props.task],
    ([show, task]) => {
        if (!show) {
            assigneePickerOpen.value = false;
            return;
        }
        if (task) {
            assigneePickerOpen.value = Boolean(task.assignedStaffId);
        }
    },
);
</script>

<style scoped lang="scss">
@use "../../../../../../scss/variables" as *;

.checklist-modal__assignee-block {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
}

.border-bottom-dashed {
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px dashed #6b7280;
}

.checklist-modal__hot-assignee-label {
    margin: 0;
    font-size: $font-size-sm;
    color: $text-dark-grey;
    display: flex;
    align-items: center;
}

.checklist-modal__hot-assignee-label span:first-child {
    font-weight: 600;
    margin-right: 10px;
}

.checklist-modal__hot-assignee-text {
    display: flex;
    align-items: flex-end;
    font-size: $font-size-sm;
    color: $text-dark-grey;
    line-height: 1.4;
}

.checklist-modal__hot-assignee-text.checklist-modal__hot-assignee-text--empty {
    font-style: italic;
    opacity: 0.9;
}

.checklist-modal__assignee-label {
    margin: 0;
    font-size: $font-size-sm;
    font-weight: 600;
    color: $text-dark-grey;
}

.checklist-modal__assignee-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $spacing-sm;
    min-height: 36px;
}

.checklist-modal__assignee-empty {
    font-size: $font-size-sm;
    color: $text-dark-grey;
}

.checklist-modal__assign-btn {
    min-height: 44px;
}
</style>

