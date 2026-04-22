<template>
    <!-- Таблица замеров показывается только если у задачи есть хотя бы один замер -->
    <div v-if="task.measurements?.length" class="checklist-modal__table-wrap">
        <table class="checklist-modal__table checklist-modal__table--measurements">
            <!-- Фиксируем пропорции колонок: время меньше, решение/статус равные -->
            <colgroup>
                <col class="checklist-modal__col-time">
                <col class="checklist-modal__col-decision">
                <col class="checklist-modal__col-status">
            </colgroup>
            <!-- Заголовок колонок таблицы замеров -->
            <thead>
                <tr>
                    <th>{{ t('demo.measurements.col_time') }}</th>
                    <th>{{ t('demo.measurements.col_decision') }}</th>
                    <th>{{ t('demo.measurements.col_status') }}</th>
                </tr>
            </thead>
            <!-- Строки повременной выполнения задачи -->
            <tbody
                v-for="item in task.measurements"
                :key="item.time"
                class="checklist-modal__measurement-group"
                :class="[
                    'checklist-modal__measurement-group--' +
                        (item.status || 'pending'),
                    {
                        'checklist-modal__measurement-group--ai-warning':
                            item.aiWarning?.ai_status === 'warning',
                        'checklist-modal__measurement-group--pending-neutral':
                            (item.status || 'pending') === 'pending' &&
                            item.aiWarning == null,
                    },
                ]"
            >
                <tr>
                    <td
                        class="checklist-modal__measurement-row-cell"
                        data-label="Время"
                    >
                        <span class="checklist-modal__bolt-text">{{ item.time }}</span>
                    </td>
                    <td
                        class="checklist-modal__measurement-row-cell"
                        data-label="Решение"
                    >
                        <table
                            v-if="item.aiWarning"
                            class="checklist-modal__decision-nested"
                        >
                            <tbody>
                            <tr>
                                <td class="checklist-modal__decision-nested__value">
                                    <span class="checklist-modal__bolt-text metric-value">{{
                                        item.value
                                    }}</span>
                                </td>
                            </tr>
                            <tr v-if="item.aiWarning.threat">
                                <td class="checklist-modal__decision-nested__threat">
                                    {{ item.aiWarning.threat }}
                                </td>
                            </tr>
                            <tr v-if="item.aiWarning.action">
                                <td class="checklist-modal__decision-nested__action">
                                    {{ item.aiWarning.action }}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <span
                            v-else
                            class="checklist-modal__measurement-value"
                        >{{ item.value }}</span>
                    </td>
                    <td
                        class="checklist-modal__measurement-row-cell"
                        data-label="Статус"
                    >
                        <span
                            class="checklist-modal__measurement-value checklist-modal__measurement-value--status"
                        >
                            <!-- Результат (понижение, повышение) -->
                            <p
                                v-if="item.aiWarning?.deviationLine"
                                class="checklist-modal__status-deviation-line checklist-modal__bolt-text metric-value"
                            >
                                {{ item.aiWarning.deviationLine }}
                            </p>
                            <!-- problem: раскрытие корректирующих действий -->
                            <button
                                v-if="!isHotMode && item.status === 'problem'"
                                type="button"
                                class="checklist-modal__status-trigger"
                                :class="[
                                    item.aiWarning?.ai_status === 'warning'
                                        ? 'checklist-modal__status-trigger--warning'
                                        : 'checklist-modal__status-trigger--problem',
                                    {
                                        'checklist-modal__status-trigger--with-action':
                                            Boolean(item.correctiveAction),
                                    },
                                ]"
                                :aria-label="t('demo.measurements.respond')"
                                @click="toggleActionRow(item.time)"
                            >
                                {{ t('demo.measurements.respond') }}
                            </button>
                            <!-- pending: панель выполнения -->
                            <button
                                v-else-if="
                                    !isHotMode &&
                                        item.status === 'pending' &&
                                        !taskScheduledForFuture
                                "
                                type="button"
                                class="checklist-modal__status-trigger"
                                :class="
                                    item.aiWarning == null
                                        ? 'checklist-modal__status-trigger--pending-neutral'
                                        : 'checklist-modal__status-trigger--pending'
                                "
                                :aria-label="t('demo.measurements.resolve')"
                                @click="$emit('open-pending', item)"
                            >
                                {{ t('demo.measurements.resolve') }}
                            </button>
                            <!-- строка ответа на проблему -->
                            <p
                                v-if="item.status === 'problem' && item.correctiveAction"
                                class="checklist-modal__selected-action"
                            >
                                {{ item.correctiveAction }}
                            </p>
                        </span>
                    </td>
                </tr>
                <!-- Раскрывающаяся строка выбора корректирующего действия (только для problem и только в обычном режиме) -->
                <tr v-if=" !isHotMode && expandedActionRowKey === item.time && item.status === 'problem' " >
                    <td colspan="3" class="checklist-modal__action-row">
                        <div class="checklist-modal__action-box">
                            <p class="checklist-modal__action-title">
                                {{ t('demo.measurements.corrective_actions') }}
                            </p>
                            <n-select
                                :value="item.correctiveAction ?? null"
                                :options="resolveActionOptions(task)"
                                :placeholder="t('demo.measurements.select_action')"
                                @update:value="onCorrectiveActionSelect(item, $event)"
                            />
                        </div>
                    </td>
                </tr>
                <!-- Отдельная строка комментария замера, если комментарий заполнен -->
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
import {useI18n} from "vue-i18n";

const {t} = useI18n();

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

    .checklist-modal__table {
        width: 100%;
        border-collapse: collapse;
        min-width: 420px;
        color: $text-color;
        font-size: 14px;

        th,
        td {
            text-align: left;
            padding: $spacing-sm;
            border-bottom: 1px solid $text-light-grey;
            vertical-align: middle;
        }

        th {
            font-size: $font-size-sm;
            color: $text-dark-grey;
            font-weight: 600;
        }

        &:not(.checklist-modal__table--measurements) th,
        &:not(.checklist-modal__table--measurements) td {
            text-align: center;
        }
    }

    .checklist-modal__table--measurements{
        font-weight: 500;

        th,
        td {
            text-align: center;
        }

        .checklist-modal__col-time,
        .checklist-modal__col-decision,
        .checklist-modal__col-status {
            padding: 0 10px;
        }

        .checklist-modal__col-time {
            width: 10%;
            min-width: 75px;
        }

        .checklist-modal__col-decision {
            width: 65%;
        }

        .checklist-modal__col-status {
            width: 25%;
            min-width: 75px;
        }

    }

}

.checklist-modal__decision-nested {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    border-spacing: 0;
    margin: 0;
    border: none;
    outline: none;

    tr,
    td,
    th {
        border: none !important;
        outline: none;
        box-shadow: none;
    }

    td {
        padding: 2px 4px;
        line-height: 1.35;
        color: $text-dark-grey;
        vertical-align: top;
        word-break: break-word;
    }

    .checklist-modal__decision-nested__value {
        text-align: center;
        font-weight: 500;
    }

    .checklist-modal__decision-nested__threat,
    .checklist-modal__decision-nested__action {
        text-align: center;
    }
}

.checklist-modal__bolt-text,
.metric-value{
    font-size: 14px;
    font-weight: 500;
    color: $accent-primary-dark;
}

.metric-value{
    font-size: 16px;
    font-weight: 300;
    color: $text-color;
    background: #f7f6f2;
    padding: 2px 10px;
    display: inline-block;
    width: auto!important;
    border-radius: 5px;
}

.checklist-modal__measurement-row-cell[data-label="Решение"]
    > .checklist-modal__measurement-value {
    font-weight: 500;
}

.checklist-modal__table--measurements
    tbody.checklist-modal__measurement-group.checklist-modal__measurement-group--success
    > tr:first-child
    > td.checklist-modal__measurement-row-cell {
    background-color: rgba($text-green, 0.08);
}

.checklist-modal__table--measurements
    tbody.checklist-modal__measurement-group.checklist-modal__measurement-group--problem
    > tr:first-child
    > td.checklist-modal__measurement-row-cell {
    background-color: rgba($text-red, 0.08);
}

.checklist-modal__table--measurements
    tbody.checklist-modal__measurement-group.checklist-modal__measurement-group--pending
    > tr:first-child
    > td.checklist-modal__measurement-row-cell {
    background-color: rgba($accent-orange, 0.09);
}

.checklist-modal__table--measurements
    tbody.checklist-modal__measurement-group.checklist-modal__measurement-group--pending.checklist-modal__measurement-group--pending-neutral
    > tr:first-child
    > td.checklist-modal__measurement-row-cell {
    background-color: transparent;
}

/* AI `ai_status: warning` — фон строки как у базового AI-блока, перекрывает success/problem/pending */
.checklist-modal__table--measurements
    tbody.checklist-modal__measurement-group.checklist-modal__measurement-group--ai-warning
    > tr:first-child
    > td.checklist-modal__measurement-row-cell {
    background-color: rgba($accent-orange, 0.08);
}

.checklist-modal__measurement-value--status {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: $spacing-xs;
    width: 100%;
}

.checklist-modal__status-ai-severity {
    margin: 0 0 4px;
    width: 100%;
    font-size: $font-size-xs;
    font-weight: 700;
    line-height: 1.3;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.02em;
}

.checklist-modal__status-ai-severity--warning {
    color: $accent-orange;
}

.checklist-modal__status-ai-severity--problem {
    color: $text-red;
}

.checklist-modal__status-ai-severity--ok {
    color: $text-green;
}

.checklist-modal__status-deviation-line {
    line-height: 1.35;
    margin-bottom: 10px;
}

@media (max-width: 640px) {
    .checklist-modal__table.checklist-modal__table--measurements colgroup {
        display: none;
    }

    .checklist-modal__table--measurements .checklist-modal__col-time,
    .checklist-modal__table--measurements .checklist-modal__col-decision,
    .checklist-modal__table--measurements .checklist-modal__col-status {
        width: auto;
        padding: 0;
    }

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

    .checklist-modal__table--measurements .checklist-modal__measurement-group td {
        border: none;
    }

    .checklist-modal__measurement-group {
        display: block;
        margin-bottom: $spacing-sm-w;
        border-radius: $radius-md;
        background-color: $bg-white;
        box-shadow: $shadow-sm;
        overflow: hidden;
    }

    .checklist-modal__measurement-group.checklist-modal__measurement-group--success {
        background-color: rgba($text-green, 0.1);
    }

    .checklist-modal__measurement-group.checklist-modal__measurement-group--problem {
        background-color: rgba($text-red, 0.09);
    }

    .checklist-modal__measurement-group.checklist-modal__measurement-group--pending {
        background-color: rgba($accent-orange, 0.1);
    }

    .checklist-modal__measurement-group.checklist-modal__measurement-group--pending.checklist-modal__measurement-group--pending-neutral {
        background-color: $bg-white;
    }

    .checklist-modal__measurement-group.checklist-modal__measurement-group--ai-warning {
        background-color: rgba($accent-orange, 0.08);
    }

    .checklist-modal__table--measurements
        tbody.checklist-modal__measurement-group.checklist-modal__measurement-group--success
        > tr:first-child
        > td.checklist-modal__measurement-row-cell,
    .checklist-modal__table--measurements
        tbody.checklist-modal__measurement-group.checklist-modal__measurement-group--problem
        > tr:first-child
        > td.checklist-modal__measurement-row-cell,
    .checklist-modal__table--measurements
        tbody.checklist-modal__measurement-group.checklist-modal__measurement-group--pending
        > tr:first-child
        > td.checklist-modal__measurement-row-cell,
    .checklist-modal__table--measurements
        tbody.checklist-modal__measurement-group.checklist-modal__measurement-group--pending.checklist-modal__measurement-group--pending-neutral
        > tr:first-child
        > td.checklist-modal__measurement-row-cell,
    .checklist-modal__table--measurements
        tbody.checklist-modal__measurement-group.checklist-modal__measurement-group--ai-warning
        > tr:first-child
        > td.checklist-modal__measurement-row-cell {
        background-color: transparent;
    }

    .checklist-modal__measurement-group:last-child {
        margin-bottom: 0;
    }

    .checklist-modal__measurement-group > tr:first-child {
        display: flex;
        flex-direction: column;
    }

    .checklist-modal__measurement-group
        > tr:first-child
        > td.checklist-modal__measurement-row-cell {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: flex-start;
        gap: $spacing-sm;
        text-align: left;
        padding: $spacing-sm-m;
        min-width: 0;
    }

    .checklist-modal__measurement-value {
        font-weight: 500;
    }

    .checklist-modal__measurement-value--status {
        display: inline-flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
        gap: $spacing-xs;
        white-space: normal;
        overflow: visible;
    }

    .checklist-modal__measurement-value--status .checklist-modal__status-deviation-line {
        flex-shrink: 0;
        width: 100%;
    }

    .checklist-modal__measurement-value--status .checklist-modal__status-trigger,
    .checklist-modal__measurement-value--status .checklist-modal__status-pill {
        flex-shrink: 0;
    }

    .checklist-modal__measurement-group .checklist-modal__selected-action {
        flex: 1 0 100%;
        margin: 15px 0 5px;
        max-width: none;
        text-align: center;
        white-space: normal;
    }

    .checklist-modal__measurement-group
        > tr:first-child
        > td.checklist-modal__measurement-row-cell[data-label="Статус"] {
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        gap: $spacing-xs;

        &::before {
            text-align: center;
        }

        .checklist-modal__measurement-value--status {
            width: 100%;
            justify-content: center;
            text-align: center;
        }

        .checklist-modal__status-trigger,
        .checklist-modal__status-pill {
            margin: 0 auto;
        }
    }

    .checklist-modal__measurement-group
    > tr:first-child
    > td.checklist-modal__measurement-row-cell[data-label="Время"]{
        justify-content: flex-end;

        &::before {
            display: none;
        }

        .checklist-modal__measurement-value {
            text-align: right;
        }
    }


    .checklist-modal__measurement-group
        > tr:first-child
        > td.checklist-modal__measurement-row-cell[data-label="Решение"]{
        justify-content: center;

        &::before {
            display: none;
        }

        .checklist-modal__measurement-value {
            text-align: center;
        }

        .checklist-modal__decision-nested {
            width: 100%;
        }
    }

    .checklist-modal__measurement-group > tr:not(:first-child) {
        display: block;

        & > td {
            display: block;
            width: 100%;
            box-sizing: border-box;
        }
    }
}


.checklist-modal__status-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    min-width: 2.75rem;
    min-height: 30px;
    border-radius: $radius-full;
}

.checklist-modal__status-pill--success {
    border: 1px solid rgba($text-green, 0.45);
    background-color: rgba($text-green, 0.12);
}

.checklist-modal__status-pill--problem {
    border: 1px solid rgba($text-red, 0.4);
    background-color: rgba($text-red, 0.1);
}

.checklist-modal__status-pill--pending {
    border: 1px solid rgba($accent-orange, 0.45);
    background-color: rgba($accent-orange, 0.12);
}

.checklist-modal__status-trigger {
    box-sizing: border-box;
    min-height: 30px;
    min-width: 90px;
    padding: 0 $spacing-md;
    border: 0;
    cursor: pointer;
    border-radius: $radius-full;
    font-size: $font-size-xs;
    font-weight: 600;
    white-space: nowrap;
}

.checklist-modal__status-trigger--problem {
    border: 1px solid rgba($text-red, 0.4);
    background-color: rgba($text-red, 0.1);
    animation: checklist-modal-problem-pulse 1.6s ease-in-out infinite;
}

.checklist-modal__status-trigger--warning {
    border: 1px solid rgba($accent-orange, 0.45);
    color: $text-dark-grey;
    background-color: rgba($accent-orange, 0.12);
    animation: checklist-modal-warning-pulse 1.6s ease-in-out infinite;
}

.checklist-modal__status-trigger.checklist-modal__status-trigger--with-action {
    margin-bottom: 5px;
}

.checklist-modal__status-trigger--pending {
    border: 1px solid rgba($accent-orange, 0.55);
    color: $text-dark-grey;
    background-color: rgba($accent-orange, 0.14);
    animation: checklist-modal-pending-pulse 1.6s ease-in-out infinite;
}

.checklist-modal__status-trigger--pending-neutral {
    border: 1px solid rgba($text-light-grey, 0.55);
    color: $text-dark-grey;
    background-color: rgba($bg-light-grey, 0.45);
    animation: checklist-modal-pending-neutral-pulse 1.6s ease-in-out infinite;
}

.checklist-modal__status-trigger--problem:focus-visible {
    outline: 2px solid rgba($text-red, 0.55);
    outline-offset: 2px;
}

.checklist-modal__status-trigger--warning:focus-visible {
    outline: 2px solid rgba($accent-orange, 0.65);
    outline-offset: 2px;
}

.checklist-modal__status-trigger--pending:focus-visible {
    outline: 2px solid rgba($accent-orange, 0.55);
    outline-offset: 2px;
}

.checklist-modal__status-trigger--pending-neutral:focus-visible {
    outline: 2px solid rgba($text-light-grey, 0.75);
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
    font-size: 14px;
    line-height: 1.25;
    color: $text-dark-grey;
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

@keyframes checklist-modal-warning-pulse {
    0%,
    100% {
        color: $text-dark-grey;
        background-color: rgba($accent-orange, 0.12);
        box-shadow: 0 0 0 0 rgba($accent-orange, 0.35);
    }

    50% {
        color: $text-dark-grey;
        background-color: rgba($accent-orange, 0.22);
        box-shadow: 0 0 0 0.35rem rgba($accent-orange, 0.14);
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

@keyframes checklist-modal-pending-neutral-pulse {
    0%,
    100% {
        color: $text-dark-grey;
        background-color: rgba($bg-light-grey, 0.45);
        box-shadow: 0 0 0 0 rgba($text-light-grey, 0.35);
    }

    50% {
        color: $text-dark-grey;
        background-color: rgba($bg-light-grey, 0.72);
        box-shadow: 0 0 0 0.35rem rgba($text-light-grey, 0.12);
    }
}
</style>

