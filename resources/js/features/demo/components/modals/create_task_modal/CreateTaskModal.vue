<template>
    <n-modal
        :show="show"
        preset="card"
        class="checklists-add-modal"
        :title="t('demo.create_task.modal_title')"
        :style="addModalCardRootStyle"
        :content-style="addModalCardContentStyle"
        :segmented="{ content: true, footer: true }"
        :mask-closable="false"
        :close-on-esc="false"
        @update:show="onUpdateShow"
        @after-leave="resetAddForm"
    >
        <div class="checklists-add-modal__body" :style="addModalBodyScrollStyle">
            <nav
                class="checklists-add-wizard__rail"
                :aria-label="t('demo.create_task.wizard_aria')"
            >
                <template v-for="(stepId, stepIdx) in ADD_WIZARD_STEPS" :key="stepId">
                    <button
                        v-if="addWizardStep > stepId"
                        type="button"
                        class="checklists-add-wizard__step-btn checklists-add-wizard__step-btn--done"
                        :aria-label="addWizardStepAriaLabel(stepId)"
                        @click="onAddWizardStepClick(stepId)"
                    >
                        <Icon
                            name="check-circle"
                            class="checklists-add-wizard__step-icon checklists-add-wizard__step-icon--ok"
                            aria-hidden="true"
                        />
                    </button>
                    <div
                        v-else-if="addWizardStep === stepId"
                        class="checklists-add-wizard__step-btn checklists-add-wizard__step-btn--active"
                        aria-current="step"
                        :aria-label="addWizardStepAriaLabel(stepId)"
                    >
                        <span class="checklists-add-wizard__digit" aria-hidden="true">{{
                            stepId
                        }}</span>
                    </div>
                    <div
                        v-else
                        class="checklists-add-wizard__step-btn checklists-add-wizard__step-btn--future"
                        aria-disabled="true"
                        :aria-label="addWizardStepAriaLabel(stepId)"
                    >
                        <span class="checklists-add-wizard__digit" aria-hidden="true">{{
                            stepId
                        }}</span>
                    </div>
                    <div
                        v-if="stepIdx < ADD_WIZARD_STEPS.length - 1"
                        class="checklists-add-wizard__connector"
                        aria-hidden="true"
                    />
                </template>
            </nav>
            <n-form
                class="checklists-add-form"
                :model="addForm"
                label-placement="top"
                label-width="auto"
            >
                <template v-if="addWizardStep === 1">
                    <n-form-item
                        :label="t('demo.create_task.title_label')"
                        required
                        class="checklists-add-form__title"
                    >
                        <n-input
                            v-model:value="addForm.title"
                            size="large"
                            :placeholder="t('demo.create_task.title_placeholder')"
                        />
                    </n-form-item>
                    <n-form-item :label="t('demo.create_task.task_type')">
                        <n-radio-group
                            v-model:value="addForm.taskScopeType"
                            class="checklists-scope-group"
                        >
                            <n-radio
                                v-for="opt in taskScopeOptions"
                                :key="opt.value"
                                :value="opt.value"
                                class="checklists-scope-option"
                            >
                                <span class="checklists-scope-label">{{ opt.label }}</span>
                                <p class="checklists-scope-hint">
                                    {{ opt.hint }}
                                </p>
                            </n-radio>
                        </n-radio-group>
                    </n-form-item>
                    <div class="checklists-details-block">
                        <p class="checklists-details-heading">
                            {{ t('demo.create_task.task_details') }}
                        </p>
                        <n-form-item
                            v-if="isEquipmentOrRooms"
                            :label="t('demo.create_task.assignee_required')"
                            required
                            class="checklists-add-form__assignee"
                        >
                            <n-select
                                v-model:value="addForm.assignedStaffId"
                                :options="assigneeSelectOptions"
                                size="large"
                                clearable
                                filterable
                                :placeholder="t('demo.create_task.assignee_placeholder')"
                            />
                        </n-form-item>
                        <template v-else>
                            <n-form-item
                                :label="t('demo.create_task.assign_task')"
                                class="checklists-add-form__assignee"
                            >
                                <n-select
                                    v-model:value="addForm.assignedStaffId"
                                    :options="assigneeSelectOptions"
                                    size="large"
                                    clearable
                                    filterable
                                    :placeholder="t('demo.create_task.assign_optional')"
                                />
                            </n-form-item>
                            <p class="checklists-standalone-hint">
                                {{ t('demo.create_task.assign_hint') }}
                            </p>
                        </template>
                        <n-form-item :label="t('demo.create_task.frequency')">
                            <n-select
                                v-model:value="addForm.frequency"
                                :options="frequencySelectOptions"
                                size="large"
                            />
                        </n-form-item>
                        <div class="checklists-working-days-block">
                            <p class="checklists-working-days-block__title">
                                {{ t('demo.create_task.working_days') }}
                            </p>
                            <div class="checklists-working-days-block__list">
                                <button
                                    v-for="day in WEEKDAY_OPTIONS"
                                    :key="day.value"
                                    type="button"
                                    class="checklists-working-days-block__day"
                                    :class="{
                                        'checklists-working-days-block__day--active':
                                            addForm.activeWeekdays.includes(day.value),
                                    }"
                                    @click="toggleActiveWeekday(day.value)"
                                >
                                    {{ day.short }}
                                </button>
                            </div>
                        </div>
                        <div class="checklists-details-schedule-row">
                            <n-form-item
                                :label="t('demo.create_task.start_date')"
                                required
                                class="checklists-details-start-date"
                            >
                                <n-date-picker
                                    v-model:value="addForm.startDate"
                                    type="date"
                                    size="large"
                                    :is-date-disabled="isStartDateDisabled"
                                    :placeholder="t('demo.create_task.start_date_placeholder')"
                                />
                            </n-form-item>
                            <n-form-item
                                :label="t('demo.create_task.repeats_per_day')"
                                required
                                class="checklists-details-repeats-per-day"
                            >
                                <n-input-number
                                    v-model:value="addForm.scheduleSlotCount"
                                    :show-button="false"
                                    size="large"
                                    :min="1"
                                    :step="1"
                                    :precision="0"
                                    :disabled="addForm.frequency === FREQUENCY_CODE.DAILY"
                                    clearable
                                    placeholder="1"
                                />
                            </n-form-item>
                        </div>
                        <div class="checklists-repeat-times-block">
                            <p class="checklists-repeat-times-block__title">
                                {{ t('demo.create_task.execution_time') }}
                            </p>
                            <div class="checklists-repeat-times-block__list">
                                <n-form-item
                                    v-for="idx in normalizedScheduleSlotCount"
                                    :key="`repeat-time-${idx}`"
                                    :label="t('demo.create_task.repeat_n', { n: idx })"
                                    required
                                    class="checklists-repeat-times-block__item"
                                >
                                    <n-time-picker
                                        v-model:formatted-value="addForm.repeatTimes[idx - 1]"
                                        format="HH:mm"
                                        value-format="HH:mm"
                                        size="large"
                                        clearable
                                        :placeholder="t('demo.create_task.time_placeholder')"
                                    />
                                </n-form-item>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div
                        v-if="addForm.taskScopeType === TASK_SCOPE_TYPE.EQUIPMENT"
                        class="checklists-equipment-block"
                    >
                        <p class="checklists-details-heading">
                            {{ t('demo.create_task.task_subject') }}
                        </p>
                        <n-form-item
                            :label="t('demo.create_task.group')"
                            class="checklists-equipment-group-select"
                        >
                            <n-select
                                v-model:value="equipmentPickerGroupTitle"
                                :options="equipmentGroupSelectOptions"
                                size="large"
                            />
                        </n-form-item>
                        <n-checkbox-group v-model:value="addForm.equipmentTargetIds">
                            <div
                                v-for="item in equipmentGroupForPicker.items"
                                :key="item.id"
                                class="checklists-equipment-item"
                            >
                                <n-checkbox :value="item.id" :label="item.label" size="large" />
                            </div>
                        </n-checkbox-group>
                    </div>
                    <div
                        v-if="addForm.taskScopeType === TASK_SCOPE_TYPE.ROOMS"
                        class="checklists-equipment-block"
                    >
                        <p class="checklists-details-heading">
                            {{ t('demo.create_task.task_subject') }}
                        </p>
                        <n-checkbox-group v-model:value="addForm.roomTargetIds">
                            <div
                                v-for="group in ROOM_GROUPS"
                                :key="group.groupTitle"
                                class="checklists-equipment-group"
                            >
                                <p class="checklists-equipment-group-title">
                                    {{ group.groupTitle }}
                                </p>
                                <div
                                    v-for="item in group.items"
                                    :key="item.id"
                                    class="checklists-equipment-item"
                                >
                                    <n-checkbox :value="item.id" :label="item.label" size="large" />
                                </div>
                            </div>
                        </n-checkbox-group>
                    </div>
                    <div class="checklists-task-fields-block">
                        <ChecklistTaskFieldsSection
                            v-model="addForm.taskFieldDefinitions"
                            v-model:corrective-action-rows="addForm.correctiveActionRows"
                            :task-field-type-options="taskFieldTypeOptionsForCurrentScope"
                        />
                    </div>
                    <div class="checklists-report-corrections">
                        <div class="header-checklists-report-corrections">
                            <p class="checklists-report-corrections__title">
                                {{ t('demo.create_task.report_corrections') }}
                            </p>
                            <n-switch v-model:value="addForm.allowAssigneeReportCorrections" />
                        </div>
                        <p class="checklists-report-corrections__text">
                            {{ t('demo.create_task.report_corrections_text') }}
                        </p>
                    </div>
                </template>
            </n-form>
        </div>
        <template #footer>
            <div class="checklists-modal-footer">
                <n-button type="warning" size="large" @click="closeModal">
                    {{ t('demo.create_task.cancel') }}
                </n-button>
                <n-button
                    v-if="addWizardStep === 2"
                    type="success"
                    size="large"
                    @click="backToAddWizardStep1"
                >
                    {{ t('demo.create_task.back') }}
                </n-button>
                <n-button
                    v-if="addWizardStep === 2"
                    type="info"
                    size="large"
                    @click="submitAddTask"
                >
                    {{ t('demo.create_task.add') }}
                </n-button>
                <n-button
                    v-if="addWizardStep === 1"
                    type="primary"
                    size="large"
                    @click="advanceAddWizardStep"
                >
                    {{ t('demo.create_task.next') }}
                </n-button>
            </div>
        </template>
    </n-modal>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    NButton,
    NCheckbox,
    NCheckboxGroup,
    NDatePicker,
    NForm,
    NFormItem,
    NInput,
    NInputNumber,
    NModal,
    NRadio,
    NRadioGroup,
    NSelect,
    NSwitch,
    NTimePicker,
    useMessage,
} from 'naive-ui';
import ChecklistTaskFieldsSection from '@/features/demo/components/checklist/ChecklistTaskFieldsSection.vue';
import Icon from '@/components/Icon.vue';
import { useDemoState } from '@/features/demo/composables/useDemoState';
import { normalizeEquipmentTargetIds } from '@/features/demo/data/demoChecklistEquipment';
import { normalizeRoomTargetIds, ROOM_GROUPS } from '@/features/demo/data/demoChecklistRooms';
import { FREQUENCY_CODE } from '@/features/demo/data/demoChecklistTaskFrequency';
import { TASK_SCOPE_TYPE } from '@/features/demo/data/demoChecklistTaskScope';
import { TASK_FIELD_TYPE } from '@/features/demo/data/demoChecklistTaskFields';
import { equipmentGroupsForChecklistNiche, taskFieldTypeOptionsByScopeType } from '@/config/tasks';
import { NICHE_TO_SITE_ID, resolveAssigneeIdForNiche } from '@/features/demo/utils/demoStaff';
import {
    buildTaskPayloadFromDraft,
    createModalDraft,
    DEFAULT_TASK_ACTIVE_WEEKDAYS,
} from '@/features/demo/domain/checklistTaskModel';

defineOptions({ name: 'CreateTaskModal' });

const { t } = useI18n();

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    activeNiche: {
        type: String,
        required: true,
    },
    staff: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(['update:show']);

/**
 * Инлайн на корень карточки модалки (teleport в body — гарантированно применяется).
 */
const addModalCardRootStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: 'min(600px, calc(100vw - 32px))',
    maxWidth: 'calc(100vw - 32px)',
    maxHeight: 'calc(100vh - 32px)',
    minHeight: 0,
    overflow: 'hidden',
    boxSizing: 'border-box',
};

/**
 * Контейнер слота контента NCard — flex-цепочка до скролла в `.checklists-add-modal__body`.
 */
const addModalCardContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    minHeight: 0,
    minWidth: 0,
    overflow: 'hidden',
    padding: '0',
};

const addModalBodyScrollStyle = {
    flex: '1 1 auto',
    minHeight: 0,
    overflowX: 'hidden',
    overflowY: 'auto',
};

const message = useMessage();
const { addChecklistTask } = useDemoState();

const taskScopeOptions = computed(() => [
    {
        value: TASK_SCOPE_TYPE.EQUIPMENT,
        label: t('demo.create_task.scope_equipment'),
        hint: t('demo.create_task.scope_equipment_hint'),
    },
    {
        value: TASK_SCOPE_TYPE.ROOMS,
        label: t('demo.create_task.scope_rooms'),
        hint: t('demo.create_task.scope_rooms_hint'),
    },
]);

let activeValidationErrorElements = [];

const ADD_WIZARD_STEPS = Object.freeze([1, 2]);
const addWizardStep = ref(1);
const WEEKDAY_OPTIONS = computed(() => [
    { value: 'mon', short: t('demo.create_task.day_mon') },
    { value: 'tue', short: t('demo.create_task.day_tue') },
    { value: 'wed', short: t('demo.create_task.day_wed') },
    { value: 'thu', short: t('demo.create_task.day_thu') },
    { value: 'fri', short: t('demo.create_task.day_fri') },
    { value: 'sat', short: t('demo.create_task.day_sat') },
    { value: 'sun', short: t('demo.create_task.day_sun') },
]);
const startOfTodayTimestamp = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
};
const toTimeString = (minutesTotal) => {
    const hours = Math.floor(minutesTotal / 60);
    const minutes = minutesTotal % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};
const buildRepeatTimesByCount = (count) => {
    const n = Number.isFinite(count) ? Math.max(1, Math.trunc(count)) : 1;
    return Array.from({ length: n }, (_, idx) => {
        const minutes = Math.floor((1440 * idx) / n);
        return toTimeString(minutes);
    });
};

const addForm = reactive({
    ...createModalDraft('coffee', { startDate: startOfTodayTimestamp() }),
    scheduleSlotCount: 1,
});

/** Группы оборудования по табу чек-листа (`activeNiche`) + общие (`typeEquipment: different`). */
const equipmentGroupsForActiveNiche = computed(() =>
    equipmentGroupsForChecklistNiche(props.activeNiche),
);

const equipmentGroupSelectOptions = computed(() =>
    equipmentGroupsForActiveNiche.value.map((g) => ({
        label: g.groupTitle,
        value: g.groupTitle,
    })),
);

const equipmentPickerGroupTitle = ref('');

watch(
    () => equipmentGroupsForActiveNiche.value,
    (groups) => {
        if (!Array.isArray(groups) || !groups.length) {
            return;
        }
        const titles = new Set(groups.map((g) => g.groupTitle));
        if (!titles.has(equipmentPickerGroupTitle.value)) {
            equipmentPickerGroupTitle.value = groups[0].groupTitle;
        }
    },
    { deep: true, immediate: true },
);

const equipmentGroupForPicker = computed(() => {
    const groups = equipmentGroupsForActiveNiche.value;
    if (!groups.length) {
        return { groupTitle: '', items: [] };
    }
    const found = groups.find((g) => g.groupTitle === equipmentPickerGroupTitle.value);
    return found ?? groups[0];
});
const normalizedScheduleSlotCount = computed(() => {
    const n = Number(addForm.scheduleSlotCount);
    if (!Number.isFinite(n)) {
        return 1;
    }
    return Math.max(1, Math.trunc(n));
});
/** «Раз в неделю» — один день недели (single-select кнопок). */
const isSingleWeekdayFrequency = computed(() => addForm.frequency === FREQUENCY_CODE.WEEKLY);

watch(
    () => equipmentPickerGroupTitle.value,
    () => {
        if (addForm.taskScopeType !== TASK_SCOPE_TYPE.EQUIPMENT) {
            return;
        }
        // При смене группы сбрасываем выбор оборудования, чтобы не протекал между группами.
        addForm.equipmentTargetIds = [];
    },
);

watch(
    () => addForm.taskScopeType,
    (scope) => {
        if (scope !== TASK_SCOPE_TYPE.EQUIPMENT) {
            addForm.equipmentTargetIds = [];
        }
        if (scope !== TASK_SCOPE_TYPE.ROOMS) {
            addForm.roomTargetIds = [];
        }
        if (scope === TASK_SCOPE_TYPE.EQUIPMENT) {
            const g = equipmentGroupsForChecklistNiche(props.activeNiche);
            equipmentPickerGroupTitle.value = g[0]?.groupTitle ?? '';
        }
        const allowedFieldTypes = new Set(
            taskFieldTypeOptionsByScopeType(scope).map((o) => o.value),
        );
        addForm.taskFieldDefinitions = (
            Array.isArray(addForm.taskFieldDefinitions) ? addForm.taskFieldDefinitions : []
        ).filter((row) => allowedFieldTypes.has(row?.fieldType));
    },
);

watch(
    () => addForm.startDate,
    (value) => {
        if (value == null) {
            addForm.startDate = startOfTodayTimestamp();
        }
    },
);

watch(
    () => addForm.frequency,
    (frequency) => {
        if (frequency === FREQUENCY_CODE.DAILY) {
            addForm.scheduleSlotCount = 1;
        }
        if (isSingleWeekdayFrequency.value) {
            addForm.activeWeekdays = ['mon'];
            return;
        }
        if (frequency === FREQUENCY_CODE.CUSTOM || frequency === FREQUENCY_CODE.DAILY) {
            addForm.activeWeekdays = [...DEFAULT_TASK_ACTIVE_WEEKDAYS];
        }
    },
);

watch(
    () => normalizedScheduleSlotCount.value,
    (count) => {
        addForm.repeatTimes = buildRepeatTimesByCount(count);
    },
    { immediate: true },
);

watch(
    () => addForm.repeatTimes,
    (times) => {
        const generated = buildRepeatTimesByCount(normalizedScheduleSlotCount.value);
        const current = Array.isArray(times) ? [...times] : [];
        let changed = false;
        for (let i = 0; i < generated.length; i += 1) {
            const value = String(current[i] ?? '').trim();
            if (!/^\d{2}:\d{2}$/.test(value)) {
                current[i] = generated[i];
                changed = true;
            }
        }
        if (current.length !== generated.length) {
            current.length = generated.length;
            changed = true;
        }
        if (changed) {
            addForm.repeatTimes = current;
        }
    },
    { deep: true },
);

watch(
    () => addForm.equipmentTargetIds,
    (ids) => {
        if (
            addForm.taskScopeType === TASK_SCOPE_TYPE.EQUIPMENT &&
            normalizeEquipmentTargetIds(ids).length
        ) {
            clearValidationErrorForElement('.checklists-equipment-block');
        }
    },
    { deep: true },
);

watch(
    () => addForm.roomTargetIds,
    (ids) => {
        if (addForm.taskScopeType === TASK_SCOPE_TYPE.ROOMS && normalizeRoomTargetIds(ids).length) {
            clearValidationErrorForElement('.checklists-equipment-block');
        }
    },
    { deep: true },
);

watch(
    () => addForm.assignedStaffId,
    (value) => {
        if (value != null && String(value).trim()) {
            clearValidationErrorForSelectorControls(
                '.checklists-add-form__assignee .n-base-selection--selected.checklists-validation-error-control',
            );
        }
    },
);

watch(
    () => addForm.taskFieldDefinitions,
    () => {
        clearValidationErrorForSelectorControls(
            '.task-fields-section .n-base-selection--selected.checklists-validation-error-control',
        );
    },
    { deep: true },
);

watch(
    () => addForm.correctiveActionRows,
    () => {
        clearValidationErrorForElement('.task-fields-section__exception-block');
    },
    { deep: true },
);

/**
 * Типы «оборудование» и «комнаты»: полный блок деталей с обязательным ответственным.
 * Используется для условного рендера в форме «Добавить CCP».
 */
const isEquipmentOrRooms = computed(
    () =>
        addForm.taskScopeType === TASK_SCOPE_TYPE.EQUIPMENT ||
        addForm.taskScopeType === TASK_SCOPE_TYPE.ROOMS,
);

const taskFieldTypeOptionsForCurrentScope = computed(() =>
    taskFieldTypeOptionsByScopeType(addForm.taskScopeType),
);

/**
 * Опции сотрудников текущей площадки (ниша = таб чек-листа), как в `ShowTaskModal`.
 * Используется селектом ответственного в модалке создания задачи.
 */
const assigneeSelectOptions = computed(() => {
    const sid = NICHE_TO_SITE_ID[props.activeNiche] ?? null;
    const list = Array.isArray(props.staff) ? props.staff : [];
    const filtered = sid
        ? list.filter((m) => m && m.siteId === sid && m.active !== false)
        : list.filter((m) => m && m.active !== false);
    return filtered.map((m) => ({
        label: `${m.fullName} — ${m.role}`,
        value: m.id,
    }));
});

/**
 * Варианты периодичности для поля «Частота» в конструкторе задачи.
 */
const frequencySelectOptions = computed(() => [
    { label: t('demo.create_task.freq_custom'), value: FREQUENCY_CODE.CUSTOM },
    { label: t('demo.create_task.freq_daily'), value: FREQUENCY_CODE.DAILY },
    { label: t('demo.create_task.freq_weekly'), value: FREQUENCY_CODE.WEEKLY },
]);

const onUpdateShow = (value) => {
    emit('update:show', value);
};

const closeModal = () => {
    emit('update:show', false);
};

watch(
    () => props.show,
    (visible) => {
        if (visible) {
            resetAddForm();
        }
    },
);

/** Смена таба чек-листа с открытой модалкой: сброс выбора оборудования под новую нишу. */
watch(
    () => props.activeNiche,
    () => {
        if (!props.show) {
            return;
        }
        if (addForm.taskScopeType !== TASK_SCOPE_TYPE.EQUIPMENT) {
            return;
        }
        addForm.equipmentTargetIds = [];
        const g = equipmentGroupsForChecklistNiche(props.activeNiche);
        equipmentPickerGroupTitle.value = g[0]?.groupTitle ?? '';
    },
);

/**
 * Сбрасывает поля формы добавления задачи перед открытием или после закрытия модалки.
 */
const resetAddForm = () => {
    addWizardStep.value = 1;
    const g = equipmentGroupsForChecklistNiche(props.activeNiche);
    equipmentPickerGroupTitle.value = g[0]?.groupTitle ?? '';
    Object.assign(addForm, {
        ...createModalDraft(props.activeNiche, {
            startDate: startOfTodayTimestamp(),
        }),
        scheduleSlotCount: 1,
    });
};

const addWizardStepAriaLabel = (stepId) => {
    if (addWizardStep.value > stepId) {
        return t('demo.create_task.step_done', { n: stepId });
    }
    if (addWizardStep.value === stepId) {
        return t('demo.create_task.step_current', { n: stepId });
    }
    return t('demo.create_task.step_unavailable', { n: stepId });
};

const onAddWizardStepClick = (stepId) => {
    if (stepId >= addWizardStep.value) {
        return;
    }
    addWizardStep.value = stepId;
};

const validateScheduleFields = () => {
    if (addForm.startDate == null) {
        scrollToModalField('.checklists-details-start-date');
        message.warning(t('demo.create_task.warn_start_date'));
        return false;
    }
    const slotCountValue = Number(addForm.scheduleSlotCount);
    if (!Number.isFinite(slotCountValue) || Math.trunc(slotCountValue) < 1) {
        scrollToModalField('.checklists-details-repeats-per-day');
        message.warning(t('demo.create_task.warn_repeats'));
        return false;
    }
    if (
        addForm.repeatTimes.length !== normalizedScheduleSlotCount.value ||
        addForm.repeatTimes.some((time) => !String(time ?? '').trim())
    ) {
        scrollToModalField('.checklists-repeat-times-block');
        message.warning(t('demo.create_task.warn_repeat_times'));
        return false;
    }
    clearValidationErrorMark();
    return true;
};

const clearValidationErrorMark = () => {
    if (!activeValidationErrorElements.length) {
        return;
    }
    activeValidationErrorElements.forEach((el) =>
        el.classList.remove('checklists-validation-error-control'),
    );
    activeValidationErrorElements = [];
};

const clearValidationErrorForElement = (selector) => {
    const target = document.querySelector(selector);
    if (!target) {
        return;
    }
    target.classList.remove('checklists-validation-error-control');
    activeValidationErrorElements = activeValidationErrorElements.filter((el) => el !== target);
};

const clearValidationErrorForSelectorControls = (selector) => {
    const controls = Array.from(document.querySelectorAll(selector));
    if (!controls.length) {
        return;
    }
    controls.forEach((el) => el.classList.remove('checklists-validation-error-control'));
    activeValidationErrorElements = activeValidationErrorElements.filter(
        (el) => !controls.includes(el),
    );
};

const scrollToModalField = (selector, highlightContainer = false) => {
    requestAnimationFrame(() => {
        const container = document.querySelector('.checklists-add-modal__body');
        const target = document.querySelector(selector);
        if (!container || !target) {
            return;
        }
        clearValidationErrorMark();
        const controls = highlightContainer
            ? []
            : target.querySelectorAll(
                  '.n-input, .n-base-selection, .n-time-picker, .n-date-picker, .n-input-number',
              );
        if (controls.length) {
            activeValidationErrorElements = Array.from(controls);
        } else {
            activeValidationErrorElements = [target];
        }
        activeValidationErrorElements.forEach((el) =>
            el.classList.add('checklists-validation-error-control'),
        );
        const containerRect = container.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const top = targetRect.top - containerRect.top + container.scrollTop - 12;
        container.scrollTo({
            top: Math.max(top, 0),
            behavior: 'smooth',
        });
    });
};

const validateTaskFieldsSection = () => {
    const rows = Array.isArray(addForm.taskFieldDefinitions) ? addForm.taskFieldDefinitions : [];
    if (!rows.length) {
        scrollToModalField('.task-fields-section', true);
        message.warning(t('demo.create_task.warn_task_field'));
        return false;
    }
    const hasSelectedFieldTypeRequiringExceptions = rows.some(
        (row) => Boolean(row?.fieldType) && row.fieldType !== TASK_FIELD_TYPE.SINGLE_CHOICE,
    );
    for (let i = 0; i < rows.length; i += 1) {
        const row = rows[i] ?? {};
        const cfg = row.config && typeof row.config === 'object' ? row.config : {};
        const rowNum = i + 1;
        if (!row.fieldType) {
            scrollToModalField(`[data-field-row-index="${i}"]`);
            message.warning(t('demo.create_task.warn_field_type', { n: rowNum }));
            return false;
        }
        const hasText = (v) => String(v ?? '').trim().length > 0;
        const hasRequiredNumber = (v) =>
            v !== null && v !== undefined && String(v).trim() !== '' && Number.isFinite(Number(v));
        switch (row.fieldType) {
            case TASK_FIELD_TYPE.TEMPERATURE:
                if (!hasRequiredNumber(cfg.minC) || !hasRequiredNumber(cfg.maxC)) {
                    scrollToModalField(`[data-field-row-index="${i}"]`);
                    message.warning(t('demo.create_task.warn_field_temp', { n: rowNum }));
                    return false;
                }
                break;
            case TASK_FIELD_TYPE.SINGLE_CHOICE:
                if (!hasText(cfg.question)) {
                    scrollToModalField(`[data-field-row-index="${i}"]`);
                    message.warning(t('demo.create_task.warn_field_question', { n: rowNum }));
                    return false;
                }
                if (
                    !Array.isArray(cfg.options) ||
                    !cfg.options.length ||
                    cfg.options.some((opt) => !hasText(opt))
                ) {
                    scrollToModalField(`[data-field-row-index="${i}"]`);
                    message.warning(t('demo.create_task.warn_field_answers', { n: rowNum }));
                    return false;
                }
                break;
            case TASK_FIELD_TYPE.TICKET:
                if (!hasText(cfg.description)) {
                    scrollToModalField(`[data-field-row-index="${i}"]`);
                    message.warning(t('demo.create_task.warn_field_ticket', { n: rowNum }));
                    return false;
                }
                break;
            default:
                scrollToModalField(`[data-field-row-index="${i}"]`);
                message.warning(t('demo.create_task.warn_field_invalid', { n: rowNum }));
                return false;
        }
    }
    if (hasSelectedFieldTypeRequiringExceptions) {
        const exceptionRows = Array.isArray(addForm.correctiveActionRows)
            ? addForm.correctiveActionRows
            : [];
        const hasAny = exceptionRows.some((r) => String(r?.text ?? '').trim().length > 0);
        if (!hasAny) {
            scrollToModalField('.task-fields-section__exception-block', true);
            message.warning(t('demo.create_task.warn_corrective_actions'));
            return false;
        }
    }
    clearValidationErrorMark();
    return true;
};

const toggleActiveWeekday = (weekday) => {
    if (isSingleWeekdayFrequency.value) {
        addForm.activeWeekdays = [weekday];
        return;
    }
    const selected = addForm.activeWeekdays;
    if (selected.includes(weekday)) {
        if (selected.length === 1) {
            return;
        }
        addForm.activeWeekdays = selected.filter((item) => item !== weekday);
        return;
    }
    addForm.activeWeekdays = [...selected, weekday];
};

const isStartDateDisabled = (timestamp) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return timestamp < today.getTime();
};

const advanceAddWizardStep = () => {
    clearValidationErrorMark();
    if (addWizardStep.value === 2) {
        return;
    }
    if (!String(addForm.title ?? '').trim()) {
        scrollToModalField('.checklists-add-form__title');
        message.warning(t('demo.create_task.warn_title_required'));
        return;
    }
    const assigneeResolved = resolveAssigneeIdForNiche(
        props.staff,
        props.activeNiche,
        addForm.assignedStaffId,
    );
    if (isEquipmentOrRooms.value && !assigneeResolved) {
        scrollToModalField('.checklists-add-form__assignee');
        message.warning(t('demo.create_task.warn_assignee_required'));
        return;
    }
    addWizardStep.value = 2;
};

const backToAddWizardStep1 = () => {
    clearValidationErrorMark();
    addWizardStep.value = 1;
};

/**
 * Создаёт задачу в активной нише через `addChecklistTask` и закрывает модалку при успехе.
 */
const submitAddTask = () => {
    clearValidationErrorMark();
    const assigneeResolved = resolveAssigneeIdForNiche(
        props.staff,
        props.activeNiche,
        addForm.assignedStaffId,
    );
    if (isEquipmentOrRooms.value && !assigneeResolved) {
        scrollToModalField('.checklists-add-form__assignee');
        message.warning(t('demo.create_task.warn_assignee_scope'));
        return;
    }
    if (!validateScheduleFields()) {
        return;
    }
    if (addForm.taskScopeType === TASK_SCOPE_TYPE.EQUIPMENT) {
        const eq = normalizeEquipmentTargetIds(addForm.equipmentTargetIds);
        if (!eq.length) {
            scrollToModalField('.checklists-equipment-block', true);
            message.warning(t('demo.create_task.warn_scope_required'));
            return;
        }
    }
    if (addForm.taskScopeType === TASK_SCOPE_TYPE.ROOMS) {
        const rooms = normalizeRoomTargetIds(addForm.roomTargetIds);
        if (!rooms.length) {
            scrollToModalField('.checklists-equipment-block', true);
            message.warning(t('demo.create_task.warn_scope_empty'));
            return;
        }
    }
    if (!validateTaskFieldsSection()) {
        return;
    }
    const modalFormData = buildTaskPayloadFromDraft({
        ...addForm,
        assignedStaffId: assigneeResolved,
    });
    const taskPayload = modalFormData;
    const id = addChecklistTask(props.activeNiche, taskPayload);
    if (!id) {
        message.warning(t('demo.create_task.warn_checkpoint_name'));
        return;
    }
    emit('update:show', false);
};
</script>

<style scoped lang="scss">
@use '../../../../../../scss/variables' as *;

.checklists-add-modal__body {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    flex: 1 1 auto;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-gutter: stable;
    box-sizing: border-box;
    padding: 20px;

    .checklists-add-wizard__rail {
        display: flex;
        width: 100%;
        align-items: center;
        gap: 0;
        box-sizing: border-box;
    }

    .checklists-add-wizard__step-btn {
        display: inline-flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        margin: 0;
        padding: 0;
        border: 2px solid $text-light-grey;
        border-radius: $radius-full;
        background-color: $bg-style-white;
        color: $text-dark-grey;
        cursor: default;
        box-sizing: border-box;
        transition:
            border-color $transition-base ease,
            background-color $transition-base ease,
            box-shadow $transition-base ease,
            color $transition-base ease;

        &.checklists-add-wizard__step-btn--active {
            border-color: $accent-primary;
            color: $accent-primary;
            background-color: rgba($bg-light-grey, 0.95);
            box-shadow: 0 0 0 3px rgba($accent-primary, 0.18);
        }

        &.checklists-add-wizard__step-btn--future {
            opacity: 0.48;
        }
    }

    button.checklists-add-wizard__step-btn {
        cursor: pointer;
        font: inherit;

        &:focus-visible {
            outline: 2px solid rgba($accent-primary, 0.55);
            outline-offset: 2px;
        }

        &.checklists-add-wizard__step-btn--done {
            border-color: rgba($text-green, 0.45);
            background-color: rgba($text-green, 0.06);

            &:hover {
                border-color: rgba($text-green, 0.75);
            }
        }
    }

    .checklists-add-wizard__digit {
        font-size: $font-size-sm;
        font-weight: 700;
        line-height: 1;
    }

    .checklists-add-wizard__step-icon.checklists-add-wizard__step-icon--ok {
        width: 22px;
        height: 22px;
        color: $text-green;
    }

    .checklists-add-wizard__connector {
        flex: 1 1 auto;
        min-width: 0;
        height: 2px;
        margin: 0 $spacing-md;
        border-radius: $radius-full;
        background-color: $text-light-grey;
    }

    .checklists-equipment-block {
        max-height: none;
        overflow-y: visible;
    }
}

.checklists-modal-footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: $spacing-sm;
}

.checklists-add-form {
    :deep(.checklists-validation-error-control .n-input__state-border) {
        border-color: $text-red !important;
        box-shadow: 0 0 0 2px rgba($text-red, 0.2);
    }

    :deep(.checklists-validation-error-control.n-base-selection) {
        border-color: $text-red !important;
        box-shadow: 0 0 0 2px rgba($text-red, 0.2);
    }

    :deep(.checklists-validation-error-control .n-base-selection__state-border) {
        border-color: $text-red !important;
    }

    :deep(.checklists-validation-error-control.n-time-picker .n-input__state-border) {
        border-color: $text-red !important;
        box-shadow: 0 0 0 2px rgba($text-red, 0.2);
    }

    :deep(.checklists-validation-error-control.task-fields-section) {
        border: 1px solid rgba($text-red, 0.55);
        background-color: rgba($text-red, 0.06);
    }

    :deep(.checklists-validation-error-control.task-fields-section__exception-block) {
        border: 1px solid rgba($text-red, 0.55);
        background-color: rgba($text-red, 0.06);
    }

    :deep(.checklists-validation-error-control.checklists-equipment-block) {
        border: 1px solid rgba($text-red, 0.55);
        border-radius: $radius-md;
        background-color: rgba($text-red, 0.06);
    }

    :deep(.n-select) {
        width: 100%;
    }

    :deep(.n-input-number) {
        width: 100%;
    }

    :deep(.n-date-picker) {
        width: 100%;
    }

    :deep(.n-time-picker) {
        width: 100%;
    }

    .checklists-report-corrections {
        margin-bottom: $spacing-md;
        padding: $spacing-md;
        border: 1px solid rgba($text-light-grey, 0.9);
        border-radius: $radius-md;
        background-color: rgba($bg-style-white, 0.65);
    }

    .header-checklists-report-corrections {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: space-between;
        gap: $spacing-md;
        margin-bottom: 15px;
    }

    .header-checklists-report-corrections .checklists-report-corrections__title {
        margin: 0;
        flex: 1;
        min-width: 0;
        font-size: $font-size-sm;
        font-weight: 600;
        color: $text-color;
    }

    .header-checklists-report-corrections .n-switch {
        flex-shrink: 0;
    }

    .checklists-report-corrections__text {
        margin: 0;
        font-size: $font-size-xs;
        line-height: 1.45;
        color: $text-dark-grey;
    }

    .checklists-scope-group {
        display: flex;
        flex-direction: column;
        gap: $spacing-sm;
        width: 100%;

        .checklists-scope-option {
            align-items: flex-start;

            .checklists-scope-label {
                display: block;
                font-weight: 600;
                font-size: $font-size-sm;
                color: $text-color;
            }

            .checklists-scope-hint {
                margin: $spacing-xs 0 0;
                font-size: $font-size-xs;
                line-height: 1.4;
                color: $text-dark-grey;
                font-weight: 400;
            }
        }
    }

    .checklists-details-block {
        margin-bottom: $spacing-md;
        padding: $spacing-md;
        border: 1px solid $text-light-grey;
        border-radius: $radius-md;
        background-color: rgba($bg-light-grey, 0.35);

        .checklists-standalone-hint {
            margin: 0 0 $spacing-md;
            font-size: $font-size-xs;
            line-height: 1.4;
            color: $text-dark-grey;
        }

        .checklists-details-schedule-row {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: $spacing-sm;

            @media (max-width: 640px) {
                grid-template-columns: 1fr;
            }
        }

        .checklists-working-days-block {
            margin-bottom: 25px;
            padding: $spacing-sm;
            border: 1px solid rgba($accent-primary, 0.35);
            border-radius: $radius-md;
            background-color: rgba($bg-light-grey, 0.55);

            .checklists-working-days-block__title {
                margin-bottom: 10px;
                font-size: $font-size-xs;
                font-weight: 700;
                color: $accent-primary-dark;
                text-transform: uppercase;
                letter-spacing: 0.04em;
            }

            .checklists-working-days-block__list {
                display: grid;
                grid-template-columns: repeat(7, minmax(0, 1fr));
                gap: $spacing-xs;

                @media (max-width: 640px) {
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                }
            }

            .checklists-working-days-block__day {
                width: 100%;
                height: 32px;
                border: 1px solid rgba($accent-primary, 0.35);
                border-radius: 5px;
                background-color: $bg-style-white;
                color: $text-dark-grey;
                font-size: $font-size-xs;
                font-weight: 700;
                line-height: 1;
                cursor: pointer;
                transition: $transition-base;

                &:hover {
                    border-color: rgba($accent-primary, 0.8);
                    color: $accent-primary-dark;
                }

                &:focus-visible {
                    outline: 2px solid rgba($accent-primary, 0.45);
                    outline-offset: 1px;
                }

                &.checklists-working-days-block__day--active {
                    background-color: $accent-primary;
                    border-color: $accent-primary;
                    color: $text-white;
                    box-shadow: 0 0 0 2px rgba($accent-primary, 0.22);
                }
            }
        }

        .checklists-repeat-times-block {
            margin-top: $spacing-sm;
            padding: $spacing-sm;
            border: 1px solid rgba($text-light-grey, 0.9);
            border-radius: $radius-md;
            background-color: rgba($bg-style-white, 0.8);

            :deep(.n-form-item-feedback-wrapper) {
                display: none;
            }

            .checklists-repeat-times-block__title {
                margin-bottom: 10px;
                font-size: $font-size-xs;
                font-weight: 700;
                color: $text-color;
                text-transform: uppercase;
                letter-spacing: 0.03em;
            }

            .checklists-repeat-times-block__list {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: $spacing-sm;

                @media (max-width: 640px) {
                    grid-template-columns: 1fr;
                }
            }
        }
    }

    .checklists-equipment-block {
        margin-bottom: $spacing-md;
        padding: $spacing-md;
        border: 1px solid $text-light-grey;
        border-radius: $radius-md;
        background-color: $bg-style-white;

        .checklists-equipment-settings-hint {
            margin: 0 0 $spacing-sm;
            font-size: $font-size-xs;
            line-height: 1.4;
            color: $text-dark-grey;
        }

        .checklists-equipment-group-select {
            margin-bottom: $spacing-xs;
        }

        .checklists-equipment-group {
            margin-bottom: $spacing-md;

            &:last-child {
                margin-bottom: 0;
            }

            .checklists-equipment-group-title {
                margin: 0 0 10px;
                font-size: $font-size-xs;
                font-weight: 600;
                color: $text-dark-grey;
                text-transform: uppercase;
                letter-spacing: 0.02em;
            }
        }
    }

    .checklists-details-heading {
        margin: 0 0 20px;
        font-size: $font-size-sm;
        font-weight: 600;
        color: $text-color;
    }
}

.checklists-equipment-item {
    margin-bottom: 15px;

    &:last-child {
        margin: 0;
    }
}
</style>
