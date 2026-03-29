<template>
    <!-- Панель для полей temperature / timer: ввод значения, keypad, имитация фото. -->
    <div class="checklist-modal__pending-input">
        <!-- Подпись типа поля (из TASK_FIELD_TYPE_OPTIONS или fallback). -->
        <p class="checklist-modal__pending-input-label">
            {{ fieldTypeDisplay }}
        </p>
        <!-- Черновик числа: префикс/суффикс (🌡️/°C или ⏱️/мин) передаёт родитель. -->
        <n-input
            :value="temperatureDraft"
            inputmode="decimal"
            placeholder="—"
            class="checklist-modal__pending-temp-input"
            @update:value="$emit('update:temperatureDraft', $event)"
        >
            <template #prefix>
                <span
                    class="checklist-modal__pending-temp-prefix"
                    aria-hidden="true"
                    >{{ inputPrefix }}</span
                >
            </template>
            <template #suffix>
                <span
                    class="checklist-modal__pending-temp-suffix"
                    aria-hidden="true"
                    >{{ inputSuffix }}</span
                >
            </template>
        </n-input>
        <!-- Экранная клавиатура: цифры + инструменты; события на родителя для мутации черновика и ✓. -->
        <div class="checklist-modal__keypad" role="group">
            <div class="checklist-modal__keypad-digits">
                <button
                    v-for="key in keypadDigitKeys"
                    :key="key"
                    type="button"
                    class="checklist-modal__keypad-btn"
                    @click="$emit('keypad-press', key)"
                >
                    {{ key }}
                </button>
            </div>
            <div class="checklist-modal__keypad-tools">
                <button
                    v-for="key in keypadToolKeys"
                    :key="key"
                    type="button"
                    class="checklist-modal__keypad-btn"
                    :class="{
                        'checklist-modal__keypad-btn--danger': key === 'DEL',
                        'checklist-modal__keypad-btn--ok': key === '✓',
                    }"
                    @click="$emit('keypad-press', key)"
                >
                    {{ key }}
                </button>
            </div>
        </div>

        <!-- Только камера (документ скрыт), подпись label_for_element над кнопкой. -->
        <PendingPhotoCaptureBlock
            :show-document="false"
            :show-camera="showCamera"
            :photo-names="photoNames"
            @camera="$emit('camera-shot')"
        />
    </div>
</template>

<script setup>
import { NInput } from "naive-ui";
import PendingPhotoCaptureBlock from "../show_task/PendingPhotoCaptureBlock.vue";

defineOptions({ name: "TaskExecutionTemperatureTimerPanel" });

const keypadDigitKeys = Object.freeze([
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
]);
const keypadToolKeys = Object.freeze([".", "DEL", "+/-", "✓"]);

defineProps({
    fieldTypeDisplay: {
        type: String,
        default: "—",
    },
    temperatureDraft: {
        type: String,
        default: "",
    },
    inputPrefix: {
        type: String,
        default: "",
    },
    inputSuffix: {
        type: String,
        default: "",
    },
    photoNames: {
        type: Array,
        default: () => [],
    },
    /** Из модалки / `taskFieldDefinitions[0].config.showCamera` (по умолчанию true для temp). */
    showCamera: {
        type: Boolean,
        default: true,
    },
});

defineEmits(["update:temperatureDraft", "keypad-press", "camera-shot"]);
</script>

<style scoped lang="scss">
@use "../../../../../../scss/variables" as *;

.checklist-modal__pending-input {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    height: 100%;
    padding-top: 25px;
}

.checklist-modal__pending-input-label {
    margin: 0;
    font-size: $font-size-sm;
    font-weight: 600;
    color: $text-dark-grey;
}

.checklist-modal__pending-temp-input :deep(.n-input__input-el) {
    font-size: clamp(18px, 2.4vw, 22px);
    font-weight: 700;
    letter-spacing: 0.02em;
}

.checklist-modal__pending-temp-prefix {
    display: inline-flex;
    align-items: center;
}

.checklist-modal__pending-temp-suffix {
    display: inline-flex;
    align-items: center;
    font-weight: 700;
    color: $text-dark-grey;
}

.checklist-modal__keypad {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;
    margin-top: 25px;
}

.checklist-modal__keypad-digits {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
}

.checklist-modal__keypad-tools {
    display: grid;
    grid-auto-rows: 1fr;
    gap: 10px;
    width: 84px;
}

.checklist-modal__keypad-btn {
    min-height: 52px;
    border-radius: 12px;
    border: 1px solid rgba($text-dark-grey, 0.25);
    background-color: rgba($bg-light-grey, 0.35);
    font-size: 18px;
    font-weight: 700;
    color: $text-color;
    cursor: pointer;
}

.checklist-modal__keypad-btn:active {
    transform: translateY(1px);
}

.checklist-modal__keypad-btn:focus-visible {
    outline: 2px solid rgba($accent-primary, 0.45);
    outline-offset: 2px;
}

.checklist-modal__keypad-btn.checklist-modal__keypad-btn--danger {
    border-color: rgba($text-red, 0.35);
    background-color: rgba($text-red, 0.08);
    color: $text-red;
}

.checklist-modal__keypad-btn.checklist-modal__keypad-btn--ok {
    border-color: rgba($text-green, 0.35);
    background-color: rgba($text-green, 0.08);
    color: $text-green;
}

@media (max-width: 640px) {
    .checklist-modal__pending-input {
        gap: $spacing-sm;
        padding-top: 12px;
    }

    .checklist-modal__keypad {
        gap: 8px;
        margin-top: 12px;
    }

    .checklist-modal__keypad-digits {
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
    }

    .checklist-modal__keypad-tools {
        gap: 8px;
        width: 76px;
    }

    .checklist-modal__keypad-btn {
        min-height: 48px;
        font-size: 17px;
        border-radius: 10px;
    }
}

@media (max-width: 420px) {
    .checklist-modal__keypad-digits {
        grid-template-columns: repeat(2, 1fr);
    }

    .checklist-modal__keypad-btn {
        min-height: 46px;
        font-size: 16px;
    }
}
</style>
