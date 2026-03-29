<template>
    <div
        v-if="showBanner"
        class="grain-cooling-notification-banner"
        role="status"
        aria-live="polite"
    >
        <div class="grain-cooling-notification-banner__inner container">
            <p class="grain-cooling-notification-banner__text">
                {{ task_grain_cooling.toastTitle }} — {{ task_grain_cooling.toastTaskName }}:
                <span class="grain-cooling-notification-banner__countdown">{{ countdownLabel }}</span>
            </p>
            <button
                type="button"
                class="grain-cooling-notification-banner__go"
                @click="onGo"
            >
                {{ task_grain_cooling.toastButtonNavigateLabel }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { computed, onUnmounted, ref, watch } from "vue";
import { task_grain_cooling } from "./config";
import { navigateGrainCoolingToDemoChecklists } from "./grainCoolingNavigateToDemoChecklists";
import { useTaskGrainCoolingStore } from "./taskGrainCoolingStore";

defineOptions({ name: "GrainCoolingNotificationBanner" });

const grainStore = useTaskGrainCoolingStore();
const { notificationBannerActive, notificationLaunched } = storeToRefs(grainStore);

const remainingMs = ref(0);
let intervalId = null;

function tick() {
    const at = task_grain_cooling.notificationLaunchedAt;
    if (!at || typeof at !== "string") {
        remainingMs.value = 0;
        return;
    }
    const start = Date.parse(at);
    if (!Number.isFinite(start)) {
        remainingMs.value = 0;
        return;
    }
    const end = start + task_grain_cooling.measurementProblemDelayMs;
    remainingMs.value = Math.max(0, end - Date.now());
}

/**
 * Снимает интервал пересчёта `remainingMs`; нужен при скрытии полосы, перед перезапуском цикла и в `onUnmounted`.
 */
function stopTickLoop() {
    if (intervalId != null) {
        window.clearInterval(intervalId);
        intervalId = null;
    }
}

/**
 * Включает интервал `tick` только когда полоса должна считать время (флаги store и время старта в конфиге заданы).
 */
function startTickLoopIfNeeded() {
    if (intervalId != null) {
        return;
    }
    if (!notificationBannerActive.value || !notificationLaunched.value) {
        return;
    }
    const at = task_grain_cooling.notificationLaunchedAt;
    if (!at || typeof at !== "string") {
        return;
    }
    tick();
    intervalId = window.setInterval(tick, 250);
}

const showBanner = computed(
    () =>
        notificationBannerActive.value &&
        notificationLaunched.value &&
        Boolean(task_grain_cooling.notificationLaunchedAt) &&
        remainingMs.value > 0,
);

/** Оставшееся время до автоперехода в «проблему». */
const countdownLabel = computed(() => {
    const ms = remainingMs.value;
    const totalSec = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
});

function onGo() {
    navigateGrainCoolingToDemoChecklists();
}

watch(
    () => [
        notificationBannerActive.value,
        notificationLaunched.value,
        task_grain_cooling.notificationLaunchedAt,
    ],
    () => {
        stopTickLoop();
        startTickLoopIfNeeded();
    },
    { immediate: true },
);

watch(
    () => [notificationBannerActive.value, remainingMs.value],
    ([active, ms]) => {
        if (!active || ms > 0) {
            return;
        }
        grainStore.clearNotificationBanner();
    },
    { immediate: true },
);

onUnmounted(() => {
    stopTickLoop();
});
</script>

<style scoped lang="scss">
@use "../../../../scss/variables" as *;

.grain-cooling-notification-banner {
    width: 100%;
    background-color: $bg-error_color;
    border-bottom: 1px solid rgba($text-red, 0.2);
}

.grain-cooling-notification-banner .grain-cooling-notification-banner__inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-sm;
    padding: $spacing-sm 0;
    min-height: 44px;
    box-sizing: border-box;
}

.grain-cooling-notification-banner .grain-cooling-notification-banner__text {
    margin: 0;
    flex: 1 1 auto;
    min-width: 0;
    font-size: $font-size-sm;
    font-weight: 500;
    color: $text-color;
    line-height: 1.35;
}

.grain-cooling-notification-banner .grain-cooling-notification-banner__countdown {
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    color: $text-red;
}

.grain-cooling-notification-banner .grain-cooling-notification-banner__go {
    flex-shrink: 0;
    cursor: pointer;
    border: 1px solid rgba($accent-primary-dark, 0.45);
    border-radius: $radius-md;
    padding: 6px 14px;
    font-size: $font-size-sm;
    font-weight: 600;
    color: $accent-primary-dark;
    background-color: $bg-style-white;
    font-family: inherit;
}

.grain-cooling-notification-banner .grain-cooling-notification-banner__go:hover {
    background-color: rgba($bg-light-grey, 0.9);
}

.grain-cooling-notification-banner .grain-cooling-notification-banner__go:focus-visible {
    outline: 2px solid rgba($accent-primary-dark, 0.55);
    outline-offset: 2px;
}
</style>
