<template>
    <n-alert
        v-if="showAlert"
        title="Error equipment"
        type="error"
    >
        {{ t('demo.execution_meta.bluetooth_error') }}
    </n-alert>
    <div class="checklist-modal__pending-meta">
        <b class="checklist-modal__pending-meta-line">
            {{ targetsDisplay }}
        </b>
    </div>
</template>

<script setup>
import {NAlert} from "naive-ui";
import {useI18n} from "vue-i18n";

const {t} = useI18n();

defineProps({
    showAlert: {
        type: Boolean,
        default: false,
    },
    targetsDisplay: {
        type: String,
        default: "—",
    },
});
</script>

<style scoped lang="scss">
@use "../../../../../../scss/variables" as *;

.checklist-modal__pending-meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.checklist-modal__pending-meta-line {
    margin: 0;
    font-size: $font-size-sm;
    color: $text-dark-grey;
}
</style>
