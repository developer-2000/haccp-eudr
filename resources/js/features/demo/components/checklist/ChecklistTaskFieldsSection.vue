<template>
    <div class="task-fields-section">
        <p class="task-fields-section__title">Суть задачи</p>
        <p class="task-fields-section__lead">
            Добавьте одно поле для фиксации замеров и данных (демо).
        </p>

        <div
            v-for="(row, index) in model"
            :key="row.id"
            class="task-fields-section__row"
            :data-field-row-index="index"
        >
            <div class="task-fields-section__row-head">
                <n-select
                    :value="row.fieldType"
                    :options="taskFieldTypeOptions"
                    placeholder="Тип поля"
                    clearable
                    class="task-fields-section__type-select"
                    @update:value="(v) => onFieldTypeChange(row, v)"
                />
                <n-button type="error" @click="removeRow(index)">Удалить</n-button>
            </div>

            <div v-if="row.fieldType" class="task-fields-section__panel">
                <template v-if="row.fieldType === TASK_FIELD_TYPE.TEMPERATURE">
                    <div class="task-fields-section__temp-row">
                        <n-form-item required label="Минимум, °C" :show-feedback="false">
                            <n-input-number
                                v-model:value="row.config.minC"
                                :show-button="false"
                                clearable
                                placeholder="—"
                            />
                        </n-form-item>
                        <n-form-item required label="Максимум, °C" :show-feedback="false">
                            <n-input-number
                                v-model:value="row.config.maxC"
                                :show-button="false"
                                clearable
                                placeholder="—"
                            />
                        </n-form-item>
                    </div>
                </template>

                <template v-else-if="row.fieldType === TASK_FIELD_TYPE.SINGLE_CHOICE">
                    <n-form-item required label="Вопрос" :show-feedback="false">
                        <n-input
                            v-model:value="row.config.question"
                            placeholder="Введите вопрос"
                        />
                    </n-form-item>
                    <div
                        v-for="(option, optionIndex) in row.config.options"
                        :key="`single-option-${row.id}-${optionIndex}`"
                        class="task-fields-section__single-choice-row"
                    >
                        <n-form-item required label="Ответ" :show-feedback="false">
                            <n-input
                                :value="option"
                                placeholder="Введите вариант ответа"
                                @update:value="(value) => updateSingleChoiceOption(row, optionIndex, value)"
                            />
                        </n-form-item>
                        <n-button
                            v-if="row.config.options.length > 1"
                            type="error"
                            attr-type="button"
                            @click="removeSingleChoiceOption(row, optionIndex)"
                        >
                            Удалить
                        </n-button>
                    </div>
                    <n-button tertiary attr-type="button" @click="addSingleChoiceOption(row)">
                        Добавить вариант
                    </n-button>
                </template>

                <template v-else-if="row.fieldType === TASK_FIELD_TYPE.TICKET">
                    <p class="task-fields-section__hint">
                        Заявка — это разовое задание. Выполняется только в назначенную дату и часы. После завершения задания создатель заявки получит уведомление.
                    </p>
                    <n-form-item required label="Описание задания" :show-feedback="false">
                        <n-input
                            v-model:value="row.config.description"
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 5 }"
                            placeholder="Опишите задание"
                        />
                    </n-form-item>
                </template>
            </div>
        </div>

        <n-button
            v-if="model.length === 0"
            tertiary
            class="task-fields-section__add"
            @click="addRow"
        >
            Добавить поле
        </n-button>

        <div
            v-if="hasSelectedTaskFieldType"
            class="task-fields-section__exception-block"
        >
            <p class="task-fields-section__exception-block__title">
                Ответы исключений
            </p>
            <p class="task-fields-section__exception-block__lead">
                Варианты пояснения при провале выполнения задачи.
            </p>
            <div
                v-for="(row, index) in correctiveActionRows"
                :key="row.id"
                class="task-fields-section__exception-block__row"
            >
                <n-input
                    v-model:value="row.text"
                    type="textarea"
                    :autosize="{ minRows: 1, maxRows: 4 }"
                    placeholder="Текст варианта ответа"
                />
                <n-button
                    type="error"
                    class="task-fields-section__exception-block__remove"
                    @click="removeExceptionRow(index)"
                >
                    Удалить
                </n-button>
            </div>
            <n-button
                tertiary
                class="task-fields-section__exception-block__add"
                :disabled="correctiveActionRows.length >= 30"
                @click="addExceptionRow"
            >
                Добавить
            </n-button>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";
import {
    NButton,
    NFormItem,
    NInput,
    NInputNumber,
    NSelect,
} from "naive-ui";
import {
    createEmptyTaskFieldRow,
    defaultConfigForFieldType,
    TASK_FIELD_TYPE,
    TASK_FIELD_TYPE_OPTIONS,
} from "@/features/demo/data/demoChecklistTaskFields";
import { v4 as uuidv4 } from "uuid";

defineOptions({ name: "ChecklistTaskFieldsSection" });

const props = defineProps({
    taskFieldTypeOptions: {
        type: Array,
        default: () => TASK_FIELD_TYPE_OPTIONS,
    },
});

const model = defineModel({ type: Array, default: () => [] });
const taskFieldTypeOptions = computed(() =>
    Array.isArray(props.taskFieldTypeOptions)
        ? props.taskFieldTypeOptions
        : TASK_FIELD_TYPE_OPTIONS,
);

const hasSelectedTaskFieldType = computed(() =>
    Array.isArray(model.value) &&
    model.value.some(
        (row) =>
            Boolean(row?.fieldType) &&
            row.fieldType !== TASK_FIELD_TYPE.SINGLE_CHOICE,
    ),
);

const correctiveActionRows = defineModel("correctiveActionRows", {
    type: Array,
    default: () => [],
});

const addExceptionRow = () => {
    if (correctiveActionRows.value.length >= 30) {
        return;
    }
    correctiveActionRows.value = [
        ...correctiveActionRows.value,
        { id: uuidv4(), text: "" },
    ];
};

const removeExceptionRow = (index) => {
    const next = [...correctiveActionRows.value];
    next.splice(index, 1);
    correctiveActionRows.value = next;
};

const onFieldTypeChange = (row, value) => {
    row.fieldType = value ?? null;
    row.config = value ? defaultConfigForFieldType(value) : {};
};

const removeRow = (index) => {
    model.value.splice(index, 1);
};

const addRow = () => {
    if (model.value.length >= 1) {
        return;
    }
    model.value.push(createEmptyTaskFieldRow());
};

const updateSingleChoiceOption = (row, optionIndex, value) => {
    if (!Array.isArray(row.config.options)) {
        row.config.options = [""];
    }
    row.config.options[optionIndex] = String(value ?? "");
};

const addSingleChoiceOption = (row) => {
    if (!Array.isArray(row.config.options)) {
        row.config.options = [""];
    }
    row.config.options = [...row.config.options, ""];
};

const removeSingleChoiceOption = (row, optionIndex) => {
    if (!Array.isArray(row.config.options) || row.config.options.length <= 1) {
        return;
    }
    const next = [...row.config.options];
    next.splice(optionIndex, 1);
    row.config.options = next.length ? next : [""];
};

</script>

<style scoped lang="scss">
@use "../../../../../scss/variables" as *;

.task-fields-section {
    margin-bottom: $spacing-md;
    padding: $spacing-md;
    border: 1px solid $text-light-grey;
    border-radius: $radius-md;
    background-color: rgba($bg-light-grey, 0.25);

    .task-fields-section__exception-block {
        margin-top: $spacing-md;
        padding: 8px;
        border: 1px solid rgba(16, 98, 185, 0.35);
        border-radius: 8px;
        background-color: rgba(226, 226, 224, 0.55);

        .task-fields-section__exception-block__title {
            margin: 0 0 $spacing-xs;
            font-size: $font-size-xs;
            font-weight: 700;
            color: $accent-primary-dark;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }

        .task-fields-section__exception-block__lead {
            margin: 0 0 $spacing-sm;
            font-size: $font-size-xs;
            line-height: 1.4;
            color: $text-dark-grey;
        }

        .task-fields-section__exception-block__row {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: $spacing-sm;
            align-items: start;
            margin-bottom: $spacing-sm;

            @media (max-width: 480px) {
                grid-template-columns: 1fr;
            }
        }

        .task-fields-section__exception-block__remove {
            flex-shrink: 0;
        }

        .task-fields-section__exception-block__add {
            width: 100%;
            margin-top: $spacing-xs;
        }
    }
}

.task-fields-section__title {
    margin: 0 0 $spacing-xs;
    font-size: $font-size-sm;
    font-weight: 600;
    color: $text-color;
}

.task-fields-section__lead {
    margin: 0 0 $spacing-md;
    font-size: $font-size-xs;
    line-height: 1.4;
    color: $text-dark-grey;
}

.task-fields-section__row {
    margin-bottom: $spacing-md;
    padding-bottom: $spacing-md;
    border-bottom: 1px dashed $text-light-grey;

    &:last-of-type {
        border-bottom: none;
        margin-bottom: $spacing-sm;
        padding-bottom: 0;
    }
}

.task-fields-section__row-head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $spacing-sm;
    margin-bottom: $spacing-sm;
}

.task-fields-section__type-select {
    flex: 1;
    min-width: 200px;
}

.task-fields-section__panel {
    padding: $spacing-sm 0 0;

    :deep(.n-form-item) {
        margin-bottom: 15px;
    }
}

.task-fields-section__temp-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-sm;

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
}

.task-fields-section__single-choice-row {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: $spacing-sm;
    align-items: start;

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
}

.task-fields-section__hint {
    margin: $spacing-xs 0 $spacing-sm;
    font-size: $font-size-xs;
    color: $text-dark-grey;
}

.task-fields-section__choice-list {
    margin: 0 0 $spacing-sm;
    padding-left: $spacing-lg;
    font-size: $font-size-xs;
    color: $text-dark-grey;
}

.task-fields-section__add {
    width: 100%;
}
</style>
