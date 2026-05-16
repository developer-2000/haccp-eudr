<template>
    <article
        class="task-card ccp-card"
        :data-task-id="task.id"
        :class="[
            borderClass,
            { 'task-card--hot': isHotMode },
            isHotMode ? 'hot-task-row' : '',
            isHotMode ? `hot-task-row--${task.status}` : '',
        ]"
        @click="emit('select', task)"
    >
        <div v-if="showDeleteAction" class="ccp-card__actions" @click.stop>
            <n-popconfirm
                :positive-text="t('demo.task_card.delete')"
                :negative-text="t('demo.task_card.cancel')"
                :positive-button-props="{ type: 'info' }"
                :negative-button-props="{ type: 'warning' }"
                @positive-click="emit('remove', task.id)"
            >
                <template #trigger>
                    <n-button
                        quaternary
                        size="tiny"
                        type="error"
                        class="ccp-card__delete-btn"
                        :aria-label="t('demo.task_card.delete_aria')"
                    >
                        <Icon
                            name="delete-forever-twotone"
                            class="ccp-card__delete-btn-icon"
                            aria-hidden="true"
                        />
                    </n-button>
                </template>
                {{ t('demo.task_card.delete_confirm') }}
            </n-popconfirm>
        </div>

        <span
            v-if="showRepeatLines"
            class="ccp-card__repeat-lines"
            :class="{ 'hot-task-row__repeat-lines': isHotMode }"
            aria-hidden="true"
        >
            <span
                v-for="item in task.measurements"
                :key="`${task.id}-${item.time}-${item.status}`"
                class="ccp-card__repeat-line"
                :class="[
                    isHotMode ? 'hot-task-row__repeat-line' : '',
                    item.status === 'success'
                        ? 'ccp-card__repeat-line--ok'
                        : item.status === 'pending'
                          ? 'ccp-card__repeat-line--pending'
                          : 'ccp-card__repeat-line--alert',
                    item.status === 'success'
                        ? isHotMode
                            ? 'hot-task-row__repeat-line--ok'
                            : ''
                        : item.status === 'pending'
                          ? isHotMode
                              ? 'hot-task-row__repeat-line--pending'
                              : ''
                          : isHotMode
                            ? 'hot-task-row__repeat-line--alert'
                            : '',
                ]"
            />
        </span>

        <div class="ccp-card__head">
            <p v-if="scheduledLine" class="ccp-card__scheduled-line">
                {{ scheduledLine }}
            </p>
            <div
                class="ccp-card__title"
                :class="{
                    'ccp-card__title--hot': isHotMode,
                    'hot-task-row__top': isHotMode,
                    'hot-task-row__top--with-repeat': isHotMode && showRepeatLines,
                }"
            >
                <span class="ccp-card__title-text" :class="{ 'hot-task-row__title': isHotMode }">
                    {{ task.title }}
                </span>
                <span
                    v-if="showNicheIcon && nicheEmoji"
                    class="ccp-card__niche"
                    :class="{ 'hot-task-row__niche': isHotMode }"
                    role="img"
                    :aria-label="nicheAria"
                >
                    {{ nicheEmoji }}
                </span>
            </div>
        </div>

        <p
            class="ccp-card__assignee"
            :class="{
                'ccp-card__assignee--empty': !assigneeDisplay,
                'hot-task-row__assignee': isHotMode,
                'hot-task-row__assignee--empty': isHotMode && !assigneeDisplay,
            }"
        >
            {{ t('demo.task_card.assignee_label') }}
            {{ assigneeDisplay || assigneeEmptyText }}
        </p>

        <p
            v-if="targetsLine"
            class="ccp-card__model-summary"
            :class="{ 'hot-task-row__targets': isHotMode }"
        >
            <Icon
                v-if="normalizedScopeType === TASK_SCOPE_TYPE.EQUIPMENT"
                name="battery-charging-90-round"
                class="ccp-card__targets-icon"
                :class="{ 'hot-task-row__targets-icon': isHotMode, equipment: isHotMode }"
                aria-hidden="true"
            />
            <Icon
                v-else-if="normalizedScopeType === TASK_SCOPE_TYPE.ROOMS"
                name="account-balance-twotone"
                class="ccp-card__targets-icon room"
                :class="{ 'hot-task-row__targets-icon': isHotMode }"
                aria-hidden="true"
            />
            <span
                class="ccp-card__model-summary-text"
                :class="{ 'hot-task-row__targets-text': isHotMode }"
            >
                {{ targetsLine }}
            </span>
        </p>

        <p v-if="pendingTime" class="ccp-card__value" :class="{ 'hot-task-row__value': isHotMode }">
            {{ pendingTime }}
        </p>
    </article>
</template>

<script setup>
import { computed } from 'vue';
import { NButton, NPopconfirm } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import Icon from '@/components/Icon.vue';
import { firstPendingMeasurementTime } from '@/features/demo/domain/checklistTaskModel';
import { resolveStaffFullName } from '@/features/demo/utils/demoStaff';
import { equipmentTargetsSummary } from '@/features/demo/data/demoChecklistEquipment';
import { roomTargetsSummary } from '@/features/demo/data/demoChecklistRooms';
import {
    normalizeTaskScopeType,
    TASK_SCOPE_TYPE,
} from '@/features/demo/data/demoChecklistTaskScope';

defineOptions({ name: 'TaskCard' });

const { t } = useI18n();

const props = defineProps({
    task: { type: Object, required: true },
    staff: { type: Array, default: () => [] },
    mode: {
        type: String,
        default: 'checklists',
    },
    showDeleteAction: { type: Boolean, default: false },
    showNicheIcon: { type: Boolean, default: false },
});

const emit = defineEmits(['select', 'remove']);

const NICHE_LABEL_KEYS = { coffee: 'niche_coffee', bakery: 'niche_bakery', meat: 'niche_meat' };

const NICHE_EMOJI = {
    coffee: '☕',
    bakery: '🥐',
    meat: '🥩',
};

const isHotMode = computed(() => props.mode === 'hot');

const hasMultipleRepeatSlots = computed(() => {
    const n = Array.isArray(props.task?.repeatTimes) ? props.task.repeatTimes.length : 0;
    return n > 1;
});

const borderClass = computed(() => {
    if (hasMultipleRepeatSlots.value) {
        return 'ccp-card--repeat';
    }
    return 'ccp-card--ok';
});

const showRepeatLines = computed(() => {
    if (!Array.isArray(props.task?.measurements)) {
        return false;
    }
    return isHotMode.value
        ? props.task.measurements.length > 1
        : props.task.measurements.length > 0;
});

const startOfTodayTs = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
};

const formatEuDate = (ts) =>
    new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(ts));

const scheduledLine = computed(() => {
    const startDate = props.task?.startDate;
    const isFuture =
        typeof startDate === 'number' && Number.isFinite(startDate) && startDate > startOfTodayTs();
    return isFuture ? t('demo.task_card.scheduled_from', { date: formatEuDate(startDate) }) : '';
});

const assigneeDisplay = computed(() => {
    const id = props.task?.assignedStaffId;
    if (!id) {
        return '';
    }
    const name = resolveStaffFullName(props.staff, id);
    return name === '—' ? '' : name;
});

const assigneeEmptyText = computed(() =>
    isHotMode.value ? '—' : t('demo.task_card.assignee_empty'),
);

const normalizedScopeType = computed(() => normalizeTaskScopeType(props.task?.taskScopeType));

const targetsLine = computed(() => {
    if (normalizedScopeType.value === TASK_SCOPE_TYPE.EQUIPMENT) {
        const s = equipmentTargetsSummary(props.task?.equipmentTargetIds);
        return s || '';
    }
    if (normalizedScopeType.value === TASK_SCOPE_TYPE.ROOMS) {
        const s = roomTargetsSummary(props.task?.roomTargetIds);
        return s || '';
    }
    return '';
});

const pendingTime = computed(() => firstPendingMeasurementTime(props.task));

const nicheEmoji = computed(() => {
    const type = props.task?.type;
    return type ? (NICHE_EMOJI[type] ?? '') : '';
});

const nicheAria = computed(() => {
    const type = props.task?.type;
    const key = NICHE_LABEL_KEYS[type];
    return key ? t(`demo.task_card.${key}`) : String(type);
});
</script>

<style scoped lang="scss">
@use '../../../../../scss/variables' as *;

.task-card.ccp-card {
    position: relative;
    border: 2px solid $text-light-grey;
    border-radius: $radius-lg;
    padding: 8px 32px 8px 16px;
    background-color: $bg-gray;
    cursor: pointer;
    min-height: 150px;
    transition:
        background $transition-base ease,
        box-shadow $transition-base ease,
        border-color $transition-base ease;

    &:hover {
        background-color: $bg-light-grey;
        box-shadow: $shadow-sm-md;
    }

    &:focus-visible {
        outline: 2px solid rgba($accent-primary, 0.55);
        outline-offset: 2px;
    }

    &.ccp-card--ok {
        border-color: rgba($text-green, 0.45);
    }

    &.ccp-card--repeat {
        border-color: rgba($accent-primary, 0.55);
    }

    &.task-card--hot {
        min-width: 180px;
        min-height: 52px;
        width: auto;

        @media (max-width: 700px) {
            width: 100%;
        }
    }
}

.hot-task-row {
    position: relative;
    width: auto;
    min-width: 180px;
    min-height: 52px;
    grid-template-columns: 1fr auto auto;
    border: 2px solid $text-light-grey;
    border-radius: $radius-lg;
    background-color: $bg-style-white;
    color: $text-color;
    text-align: left;
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    padding: $spacing-sm $spacing-xl $spacing-sm $spacing-md;
    transition: $transition-base;

    &:hover {
        border-color: $accent-primary;
        background-color: $bg-light-grey;
    }

    &.hot-task-row--warning {
        border-color: rgba($text-red, 0.45);

        &:hover {
            border-color: rgba($text-red, 0.8);
        }
    }

    &.hot-task-row--ok {
        border-color: rgba($text-green, 0.45);
    }

    &.hot-task-row--repeat {
        border-color: rgba($accent-primary, 0.55);
    }
}

.ccp-card__actions {
    position: absolute;
    top: $spacing-xs;
    right: $spacing-xs;
    z-index: 2;
}

.ccp-card__delete-btn {
    min-height: 32px;
    min-width: 32px;
    padding-left: 0;
    padding-right: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    :deep(.xicon svg) {
        width: 20px;
        height: 20px;
    }
}

.ccp-card__delete-btn-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
}

.ccp-card__repeat-lines {
    position: absolute;
    bottom: 10px;
    right: 14px;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-end;
    align-items: flex-start;
    gap: 4px;
}

.ccp-card__repeat-line {
    display: block;
    width: 12px;
    height: 2px;
    border-radius: $radius-full;
    /* iOS WebKit: иначе смена модификатора/background часто не перерисовывается */
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
}

.ccp-card__repeat-line--ok {
    background-color: $text-green;
}

.ccp-card__repeat-line--alert {
    background-color: $text-red;
}

.ccp-card__repeat-line--pending {
    background-color: $text-light-grey;
}

.task-card--hot .ccp-card__repeat-lines {
    right: 10px;
}

.ccp-card__head {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
}

.ccp-card__scheduled-line {
    margin: 0 0 5px 0;
    font-size: $font-size-xs;
    line-height: 1.25;
    color: $accent-primary-dark;
    background: rgba($accent-primary, 0.08);
    border: 1px solid rgba($accent-primary, 0.2);
    border-radius: $radius-sm;
    padding: 2px 6px;
}

.ccp-card__title {
    font-weight: 600;
    line-height: 18px;
    margin-top: 3px;
}

.ccp-card__title--hot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-sm;
    width: 100%;
}

.ccp-card__title-text {
    min-width: 0;
}

.ccp-card__niche {
    font-size: 1.25em;
    line-height: 1;
    flex-shrink: 0;
}

.ccp-card__assignee {
    font-size: $font-size-xs;
    color: $text-dark-grey;
    line-height: 1.3;
    margin-top: 4px;
}

.ccp-card__assignee--empty {
    font-style: italic;
    opacity: 0.9;
}

.ccp-card__value {
    color: $text-dark-grey;
    font-size: $font-size-sm;
    position: absolute;
    bottom: 6px;
    left: 14px;
}

.task-card--hot .ccp-card__value {
    position: static;
    left: auto;
    bottom: auto;
    margin-top: 10px;
}

.ccp-card__model-summary {
    margin-top: 10px;
    display: flex;
    align-items: center;
}

.ccp-card__model-summary-text {
    font-size: $font-size-xs;
    color: $text-dark-grey;
    line-height: 15px;
}

.ccp-card__targets-icon {
    margin: 0 0 0 -7px;
    vertical-align: -2px;
    color: $text-dark-grey;
}

.ccp-card__targets-icon.room {
    margin: 0 5px 0 0;
}

:deep(.xicon) {
    width: auto;
    height: auto;
}

:deep(.xicon svg) {
    width: 20px;
    height: 20px;
}
</style>
