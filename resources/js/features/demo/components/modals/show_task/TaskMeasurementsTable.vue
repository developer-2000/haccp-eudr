<template>
    <div v-if="task.measurements?.length" class="checklist-modal__table-wrap">
        <table class="checklist-modal__table checklist-modal__table--measurements">
            <thead>
                <tr>
                    <th>Время</th>
                    <th>Решение</th>
                    <th>Статус</th>
                </tr>
            </thead>
            <tbody
                v-for="item in task.measurements"
                :key="item.time"
                class="checklist-modal__measurement-group"
            >
                <tr>
                    <td data-label="Время">
                        <span class="checklist-modal__measurement-value">{{ item.time }}</span>
                    </td>
                    <td data-label="Решение">
                        <span class="checklist-modal__measurement-value">{{ item.value }}</span>
                    </td>
                    <td data-label="Статус">
                        <span
                            class="checklist-modal__measurement-value checklist-modal__measurement-value--status"
                        >
                            <button
                                v-if="!isHotMode && item.status === 'problem'"
                                type="button"
                                class="checklist-modal__status-trigger"
                                :class="{
                                    'checklist-modal__status-trigger--with-action':
                                        Boolean(item.correctiveAction),
                                }"
                                @click="toggleActionRow(item.time)"
                            >
                                <span
                                    class="checklist-modal__badge"
                                    :class="`checklist-modal__badge--measurement-${item.status}`"
                                >{{ item.status }}</span>
                            </button>
                            <button
                                v-else-if="
                                    !isHotMode &&
                                        item.status === 'pending' &&
                                        !taskScheduledForFuture
                                "
                                type="button"
                                class="checklist-modal__status-trigger checklist-modal__status-trigger--pending"
                                @click="$emit('open-pending', item)"
                            >
                                <span
                                    class="checklist-modal__badge"
                                    :class="`checklist-modal__badge--measurement-${item.status}`"
                                >{{ item.status }}</span>
                            </button>
                            <span
                                v-if="
                                    isHotMode ||
                                        (item.status !== 'problem' &&
                                            (item.status !== 'pending' || taskScheduledForFuture))
                                "
                                class="checklist-modal__badge"
                                :class="`checklist-modal__badge--measurement-${item.status}`"
                            >{{ item.status }}</span>
                            <p
                                v-if="item.status === 'problem' && item.correctiveAction"
                                class="checklist-modal__selected-action"
                            >
                                {{ item.correctiveAction }}
                            </p>
                        </span>
                    </td>
                    </tr>
                    <tr
                        v-if="
                            !isHotMode &&
                                expandedActionRowKey === item.time &&
                                item.status === 'problem'
                        "
                    >
                        <td colspan="3" class="checklist-modal__action-row">
                            <div class="checklist-modal__action-box">
                                <p class="checklist-modal__action-title">
                                    Корректирующие действия
                                </p>
                                <n-select
                                    :value="item.correctiveAction ?? null"
                                    :options="resolveActionOptions(task)"
                                    placeholder="Выберите действие"
                                    @update:value="onCorrectiveActionSelect(item, $event)"
                                />
                            </div>
                        </td>
                    </tr>
                <tr v-if="String(item.comment ?? '').trim()">
                    <td colspan="3" class="checklist-modal__comment-row">
                        {{ item.comment }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import {NSelect} from "naive-ui";

const props = defineProps({
    task: {
        type: Object,
        required: true,
    },
    isHotMode: {
        type: Boolean,
        default: false,
    },
    expandedActionRowKey: {
        default: null,
    },
    /** Уже вычислено для текущей `task` в родителе */
    taskScheduledForFuture: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["update:expandedActionRowKey", "open-pending"]);

const toggleActionRow = (time) => {
    emit(
        "update:expandedActionRowKey",
        props.expandedActionRowKey === time ? null : time,
    );
};

const resolveActionOptions = (task) =>
    (task?.correctiveActions ?? []).map((label) => ({
        label,
        value: label,
    }));

const onCorrectiveActionSelect = (measurement, value) => {
    measurement.correctiveAction = value;
    emit("update:expandedActionRowKey", null);
};
</script>

<style scoped lang="scss">
@use "../../../../../../scss/variables" as *;

.checklist-modal__table-wrap {
    width: 100%;
    overflow-x: auto;
    background: $bg-style-white;
    padding: 10px;
}

.checklist-modal__table {
    width: 100%;
    border-collapse: collapse;
    min-width: 420px;
}

.checklist-modal__table th,
.checklist-modal__table td {
    text-align: left;
    padding: $spacing-sm;
    border-bottom: 1px solid $text-light-grey;
    vertical-align: middle;
}

.checklist-modal__table th {
    font-size: $font-size-sm;
    color: $text-dark-grey;
    font-weight: 600;
}

.checklist-modal__table:not(.checklist-modal__table--measurements) th,
.checklist-modal__table:not(.checklist-modal__table--measurements) td {
    text-align: center;
}

.checklist-modal__table--measurements th,
.checklist-modal__table--measurements td {
    text-align: center;
}

@media (max-width: $breakpoint-sm) {
    .checklist-modal__table-wrap {
        overflow-x: visible;
        padding: $spacing-sm;
    }

    .checklist-modal__table.checklist-modal__table--measurements {
        min-width: 0;
        width: 100%;
        table-layout: auto;
    }

    .checklist-modal__table.checklist-modal__table--measurements thead {
        display: none;
    }

    .checklist-modal__measurement-group {
        display: block;
        margin-bottom: $spacing-md;
        border: 1px solid $border-color;
        border-radius: $radius-md;
        background-color: $bg-white;
        box-shadow: $shadow-sm;
        overflow: hidden;
    }

    .checklist-modal__measurement-group:last-child {
        margin-bottom: 0;
    }

    .checklist-modal__measurement-group > tr:first-child {
        display: flex;
        flex-direction: column;
    }

    .checklist-modal__measurement-group > tr:first-child > td {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: space-between;
        gap: $spacing-sm;
        text-align: left;
        padding: $spacing-sm-m;
        border-bottom: 1px solid rgba($text-light-grey, 0.45);
        min-width: 0;
    }

    .checklist-modal__measurement-group > tr:first-child > td:last-child {
        border-bottom: none;
    }

    .checklist-modal__measurement-group > tr:first-child > td::before {
        content: attr(data-label);
        flex: 0 0 auto;
        font-size: $font-size-xs;
        font-weight: 600;
        color: $text-dark-grey;
        text-transform: uppercase;
        letter-spacing: 0.03em;
    }

    .checklist-modal__measurement-value {
        flex: 1 1 auto;
        min-width: 0;
        text-align: right;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .checklist-modal__measurement-value--status {
        display: inline-flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-end;
        align-items: center;
        gap: $spacing-xs;
        white-space: normal;
        overflow: visible;
    }

    .checklist-modal__measurement-value--status .checklist-modal__status-trigger {
        flex-shrink: 0;
    }

    .checklist-modal__measurement-group .checklist-modal__selected-action {
        flex: 1 0 100%;
        margin: $spacing-xs 0 0;
        max-width: none;
        text-align: right;
        white-space: normal;
    }

    .checklist-modal__measurement-group > tr:not(:first-child) {
        display: block;
    }

    .checklist-modal__measurement-group > tr:not(:first-child) > td {
        display: block;
        width: 100%;
        box-sizing: border-box;
    }

    .checklist-modal__measurement-group .checklist-modal__action-row {
        border-bottom: 1px solid rgba($text-light-grey, 0.35);
    }

    .checklist-modal__measurement-group > tr:last-child > td {
        border-bottom: none;
    }
}

.checklist-modal__badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 30px;
    width: fit-content;
    border-radius: $radius-full;
    font-size: $font-size-sm;
    font-weight: 600;
    text-transform: lowercase;
}

.checklist-modal__badge--ok {
    color: $text-green;
}

.checklist-modal__badge--problem {
    color: $text-red;
}

.checklist-modal__badge--type {
    color: $accent-primary-dark;
}

.checklist-modal__badge--measurement-success {
    color: $text-green;
}

.checklist-modal__badge--measurement-problem {
    color: $text-red;
}

.checklist-modal__status-trigger .checklist-modal__badge--measurement-problem {
    padding: 0 $spacing-sm;
    border: 1px solid rgba($text-red, 0.4);
    border-radius: $radius-full;
    background-color: rgba($text-red, 0.1);
    animation: checklist-modal-problem-pulse 1.6s ease-in-out infinite;
}

.checklist-modal__status-trigger.checklist-modal__status-trigger--with-action
    .checklist-modal__badge--measurement-problem {
    margin-bottom: 5px;
}

.checklist-modal__status-trigger.checklist-modal__status-trigger--pending
    .checklist-modal__badge--measurement-pending {
    padding: 0 $spacing-sm;
    border: 1px solid rgba($accent-orange, 0.55);
    border-radius: $radius-full;
    color: $text-dark-grey;
    background-color: rgba($accent-orange, 0.14);
    animation: checklist-modal-pending-pulse 1.6s ease-in-out infinite;
}

.checklist-modal__badge--measurement-pending {
    color: $text-dark-grey;
}

.checklist-modal__status-trigger {
    border: 0;
    background: transparent;
    padding: 0;
    cursor: pointer;
    border-radius: $radius-full;
}

.checklist-modal__status-trigger:focus-visible {
    outline: 2px solid rgba($text-red, 0.55);
    outline-offset: 2px;
}

.checklist-modal__action-row {
    padding: 0;
    background-color: rgba($bg-light-grey, 0.45);
}

.checklist-modal__action-box {
    padding: $spacing-sm;
}

.checklist-modal__action-box :deep(.n-select .n-base-selection) {
    width: 100%;
    max-width: 500px;
}

.checklist-modal__action-title {
    margin: 0 0 $spacing-xs;
    font-size: $font-size-sm;
    font-weight: 600;
    color: $text-color;
}

.checklist-modal__selected-action {
    margin: 0 auto;
    font-size: $font-size-xs;
    line-height: 1.25;
    color: $text-dark-grey;
    max-width: 260px;
    white-space: normal;
    word-break: break-word;
}

.checklist-modal__comment-row {
    padding: 8px $spacing-sm;
    font-size: $font-size-xs;
    line-height: 1.35;
    color: $text-dark-grey;
    background-color: rgba($bg-light-grey, 0.25);
    text-align: left;
    border-bottom: 1px solid $text-light-grey;
}

@keyframes checklist-modal-problem-pulse {
    0%,
    100% {
        color: $text-red;
        background-color: rgba($text-red, 0.1);
        box-shadow: 0 0 0 0 rgba($text-red, 0.35);
    }

    50% {
        color: $text-red;
        background-color: rgba($text-red, 0.2);
        box-shadow: 0 0 0 0.35rem rgba($text-red, 0.12);
    }
}

@keyframes checklist-modal-pending-pulse {
    0%,
    100% {
        color: $text-dark-grey;
        background-color: rgba($accent-orange, 0.14);
        box-shadow: 0 0 0 0 rgba($accent-orange, 0.35);
    }

    50% {
        color: $text-dark-grey;
        background-color: rgba($accent-orange, 0.22);
        box-shadow: 0 0 0 0.35rem rgba($accent-orange, 0.12);
    }
}
</style>

