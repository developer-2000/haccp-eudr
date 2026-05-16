<template>
    <div class="box-bottom-panel-content pending-photo-capture-block">
        <div
            v-show="showCamera"
            class="pending-photo-capture-block__section checklist-modal__pending-photo-row checklist-modal__pending-photo-row--labeled"
        >
            <div class="label_for_element">{{ t('demo.photo_capture.take_photo') }}</div>
            <n-button
                type="primary"
                secondary
                class="checklist-modal__pending-camera-btn"
                @click="$emit('camera')"
            >
                <n-icon size="20" aria-hidden="true">
                    <AddAPhotoTwotone />
                </n-icon>
            </n-button>
            <ul v-show="photoNames.length" class="checklist-modal__pending-photo-list">
                <li v-for="(name, idx) in photoNames" :key="`${name}-${idx}`">
                    {{ name }}
                </li>
            </ul>
        </div>

        <div
            v-show="showDocument"
            class="pending-photo-capture-block__section checklist-modal__pending-photo-row checklist-modal__pending-photo-row--labeled checklist-modal__document"
        >
            <div class="label_for_element">{{ t('demo.photo_capture.report_document') }}</div>
            <n-button
                type="primary"
                secondary
                class="checklist-modal__pending-camera-btn"
                @click="$emit('attach-report')"
            >
                {{ t('demo.photo_capture.attach_file') }}
            </n-button>
            <p class="checklist-modal__pending-photo-name">
                {{ reportFileName || '' }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { NButton, NIcon } from 'naive-ui';
import { AddAPhotoTwotone } from '@vicons/material';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'PendingPhotoCaptureBlock' });

const { t } = useI18n();

defineProps({
    photoNames: {
        type: Array,
        default: () => [],
    },
    reportFileName: {
        type: String,
        default: '',
    },
    showDocument: {
        type: Boolean,
        default: false,
    },
    showCamera: {
        type: Boolean,
        default: true,
    },
});

defineEmits(['camera', 'attach-report']);
</script>

<style scoped lang="scss">
@use '../../../../../../scss/variables' as *;

.box-bottom-panel-content {
    flex-shrink: 0;
    margin-top: auto;
}

.box-bottom-panel-content.pending-photo-capture-block
    .pending-photo-capture-block__section
    :deep(.n-button) {
    width: 100%;
    min-height: 55px;
}

.checklist-modal__pending-photo-row--labeled {
    display: flex;
    flex-direction: column;
    align-items: stretch;
}

.checklist-modal__document {
    margin-top: 15px;
}

.checklist-modal__pending-camera-btn {
    min-height: 44px;
}

.checklist-modal__pending-photo-name {
    margin: 0;
    font-size: $font-size-xs;
    color: $text-dark-grey;
    word-break: break-word;
}

.checklist-modal__pending-photo-list {
    margin: 0;
    padding-left: 1.1em;
    font-size: $font-size-xs;
    color: $text-dark-grey;
}

@media (max-width: 640px) {
    .checklist-modal__pending-photo-row {
        grid-template-columns: 1fr;
        align-items: start;
        gap: 8px;
    }

    .checklist-modal__pending-camera-btn {
        width: 100%;
    }
}
</style>
