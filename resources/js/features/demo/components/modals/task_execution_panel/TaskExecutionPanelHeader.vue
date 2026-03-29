<template>
    <!-- Слот шапки n-drawer: заголовок задачи + круглая кнопка закрытия (emit close → родитель гасит панель). -->
    <div class="checklist-modal__pending-header">
        <!-- Название текущей задачи (ellipsis при длинной строке). -->
        <span class="checklist-modal__pending-header-title">
            {{ title }}
        </span>
        <!-- Крестик: только закрытие, без сброса данных замера в родителе. -->
        <n-button
            type="error"
            strong
            secondary
            circle
            class="checklist-modal__pending-close"
            aria-label="Закрыть панель"
            @click="$emit('close')"
        >
            ✕
        </n-button>
    </div>
</template>

<script setup>
import {NButton} from "naive-ui";

defineProps({
    title: {
        type: String,
        default: "—",
    },
});

defineEmits(["close"]);
</script>

<style scoped lang="scss">
@use "../../../../../../scss/variables" as *;

.checklist-modal__pending-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-sm;
    width: 100%;
    min-width: 0;
}

.checklist-modal__pending-header-title {
    font-size: $font-size-sm;
    font-weight: 700;
    color: $text-color;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
