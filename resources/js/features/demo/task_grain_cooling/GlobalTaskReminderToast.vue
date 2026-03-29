<template>
    <n-config-provider :theme="darkTheme" :theme-overrides="naiveThemeOverrides">
        <div class="global-task-reminder-toast" role="status">
            <p class="global-task-reminder-toast__title">
                {{ task_grain_cooling.toastTitle }}
            </p>
            <p class="global-task-reminder-toast__task-name">
                {{ task_grain_cooling.toastTaskName }}
            </p>
            <div class="global-task-reminder-toast__actions">
                <n-button type="warning" @click="handleClose">
                    {{ task_grain_cooling.toastButtonCloseLabel }}
                </n-button>
                <n-button type="info" @click="goToDemoChecklists">
                    {{ task_grain_cooling.toastButtonNavigateLabel }}
                </n-button>
            </div>
        </div>
    </n-config-provider>
</template>

<script setup>
import { darkTheme, NButton, NConfigProvider } from "naive-ui";
import { task_grain_cooling } from "./config";
import { navigateGrainCoolingToDemoChecklists } from "./grainCoolingNavigateToDemoChecklists";

defineOptions({ name: "GlobalTaskReminderToast" });

/** Шаблон использует поля из `task_grain_cooling` (config.js). */

/** Тёмная тема Naive под фон тоста (#1a1f2e). */
const naiveThemeOverrides = {
    common: {
        bodyColor: "#1a1f2e",
        cardColor: "#1a1f2e",
        textColorBase: "#e8eaef",
        textColor1: "#e8eaef",
        textColor2: "rgba(232, 234, 239, 0.82)",
        textColor3: "rgba(232, 234, 239, 0.55)",
        borderColor: "rgba(255, 255, 255, 0.12)",
    },
};

const props = defineProps({
    closeToast: {
        type: Function,
        required: true,
    },
});

function goToDemoChecklists() {
    navigateGrainCoolingToDemoChecklists({ closeToast: props.closeToast });
}

function handleClose() {
    props.closeToast();
}
</script>

<style scoped lang="scss">
@use "../../../../scss/variables" as *;

.global-task-reminder-toast {
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    padding: 2px 0 0;
    font-family: $font-family-rubik, system-ui, sans-serif;
}

.global-task-reminder-toast .global-task-reminder-toast__title {
    margin: 0 0 4px;
    font-size: $font-size-sm;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: rgba(232, 234, 239, 0.65);
}

.global-task-reminder-toast .global-task-reminder-toast__task-name {
    margin: 0 0 $spacing-md;
    font-size: $font-size-lg;
    font-weight: 600;
    color: #f1f5f9;
    line-height: 1.35;
}

.global-task-reminder-toast .global-task-reminder-toast__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $spacing-sm;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;

    button {
        flex: 1 1 auto;
    }
}
</style>
