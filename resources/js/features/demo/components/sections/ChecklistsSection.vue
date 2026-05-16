<template>
    <div class="checklists-section">
        <div class="checklists-toolbar">
            <n-button type="primary" class="checklists-add-btn" size="large" @click="openAddModal">
                {{ t('demo.checklists.add') }}
            </n-button>
        </div>
        <n-tabs v-model:value="activeNiche" type="line" class="checklists-section__tabs" animated>
            <n-tab-pane v-for="tab in nicheTabs" :key="tab.id" :name="tab.id">
                <template #tab>
                    <span class="checklists-section__tab-label">
                        {{ tab.label }}
                        <span class="checklists-section__tab-emoji" aria-hidden="true">
                            {{ nicheEmoji(tab.id) }}
                        </span>
                    </span>
                </template>

                <div v-if="!tasksByNiche(tab.id).length" class="checklists-empty">
                    {{ t('demo.checklists.empty_state') }}
                </div>

                <div v-else class="checklists-grid">
                    <TaskCard
                        v-for="task in tasksByNiche(tab.id)"
                        :key="task.id"
                        :task="task"
                        :staff="staff"
                        mode="checklists"
                        :show-delete-action="true"
                        @select="openShowTaskModal"
                        @remove="onConfirmRemoveTask"
                    />
                </div>
            </n-tab-pane>
        </n-tabs>

        <CreateTaskModal
            v-model:show="addModalVisible"
            :active-niche="activeNiche"
            :staff="staff"
        />

        <ShowTaskModal
            v-if="isModalOpen"
            ref="showTaskModalRef"
            :show="isModalOpen"
            :task="selectedTask"
            :task-type="selectedNicheForModal ?? activeNiche"
            :staff="staff"
            @close="closeShowTaskModal"
        />
    </div>
</template>

<script setup>
import { computed, nextTick, onActivated, ref } from 'vue';
import { NButton, NTabPane, NTabs } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import CreateTaskModal from '@/features/demo/components/modals/create_task_modal/CreateTaskModal.vue';
import ShowTaskModal from '@/features/demo/components/modals/show_task/ShowTaskModal.vue';
import TaskCard from '@/features/demo/components/sections/TaskCard.vue';
import { useDemoState } from '@/features/demo/composables/useDemoState';
import { task_grain_cooling } from '@/features/demo/task_grain_cooling/config';
import {
    registerGrainCoolingChecklistsDeepLinkWatcher,
    useGrainCoolingStore,
} from '@/features/demo/task_grain_cooling/grainCoolingDemoEntry';

defineOptions({ name: 'ChecklistsSection' });

const { t } = useI18n();
const { demoState, removeChecklistTask } = useDemoState();

defineProps({
    checklistsByNiche: {
        type: Object,
        required: true,
    },
    staff: {
        type: Array,
        default: () => [],
    },
});

const nicheTabs = computed(() => [
    { id: 'coffee', label: t('demo.checklists.niche_coffee') },
    { id: 'bakery', label: t('demo.checklists.niche_bakery') },
    { id: 'meat', label: t('demo.checklists.niche_meat') },
]);

function resetActiveNicheToFirst() {
    activeNiche.value = nicheTabs.value[0].id;
}

const NICHE_EMOJI = {
    coffee: '☕',
    bakery: '🥐',
    meat: '🥩',
};
const nicheEmoji = (nicheId) => NICHE_EMOJI[nicheId] ?? '';

const activeNiche = ref('coffee');
const isModalOpen = ref(false);
const tasksByNiche = (nicheId) => demoState.value.checklistsByNiche?.[nicheId] ?? [];

/** Не хранить ссылку на объект задачи: после иммутаций в `demoState` (напр. problem по таймеру) ссылка устаревает. */
const selectedTaskId = ref(null);
const selectedNicheForModal = ref(null);
const selectedTask = computed(() => {
    const id = selectedTaskId.value;
    const niche = selectedNicheForModal.value;
    if (id == null || niche == null || niche === '') {
        return null;
    }
    const list = tasksByNiche(niche);
    return list.find((t) => t.id === id) ?? null;
});
const addModalVisible = ref(false);
/** Ref на модалку «Детали задачи»: сразу после открытия вызываем автооткрытие боковой панели по диплинку. */
const showTaskModalRef = ref(null);

/**
 * Открывает модалку редактирования выбранной CCP-карточки.
 * После монтирования — явный вызов автооткрытия drawer по диплинку (не ждать таймер problem / сброс индекса в конфиге).
 */
function openShowTaskModal(task) {
    selectedTaskId.value = task.id;
    selectedNicheForModal.value = activeNiche.value;
    isModalOpen.value = true;
    void nextTick(() => {
        void nextTick(() => {
            void showTaskModalRef.value?.tryAutoOpenPendingDrawerAfterDeepLink?.();
        });
    });
}

/**
 * Диплинк из глобального тоста: после перехода на чек-листы открыть задачу по id из Pinia.
 */
async function tryConsumePendingDeepLink() {
    if (!task_grain_cooling.scenarioProcessAllowed) {
        return;
    }
    const grainCoolingStore = useGrainCoolingStore();
    if (!grainCoolingStore) {
        return;
    }
    const pending = grainCoolingStore.pendingDeepLink;
    if (!pending) {
        return;
    }
    const { taskId, niche } = pending;
    activeNiche.value = niche;
    await nextTick();
    await nextTick();
    const list = tasksByNiche(niche);
    const task = list.find((t) => t.id === taskId);
    grainCoolingStore.clearPendingDeepLink();
    if (task) {
        openShowTaskModal(task);
    }
}

registerGrainCoolingChecklistsDeepLinkWatcher(tryConsumePendingDeepLink);

/** Секция в KeepAlive — при возврате на «Checklists» снова первая ниша (Кофейня). */
onActivated(() => {
    resetActiveNicheToFirst();
    void nextTick(() => {
        void tryConsumePendingDeepLink();
    });
});

/**
 * Закрывает модалку и очищает выбранную карточку.
 * Используется для корректного сброса состояния между открытиями.
 */
const closeShowTaskModal = () => {
    isModalOpen.value = false;
    selectedTaskId.value = null;
    selectedNicheForModal.value = null;
};

/**
 * Открывает форму добавления CCP для текущей вкладки-ниши.
 * Используется кнопкой «Добавить CCP».
 */
const openAddModal = () => {
    addModalVisible.value = true;
};

/**
 * Удаляет задачу после подтверждения в NPopconfirm; закрывает модалку деталей, если удалили открытую карточку.
 */
const onConfirmRemoveTask = (taskId) => {
    removeChecklistTask(activeNiche.value, taskId);
    if (selectedTaskId.value === taskId) {
        closeShowTaskModal();
    }
};
</script>

<style scoped lang="scss">
@use '../../../../../scss/variables' as *;

.n-tabs.n-tabs--top .n-tab-pane {
    padding-top: 20px;
}

.checklists-section {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;

    .checklists-toolbar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-end;
        gap: $spacing-md;

        .checklists-add-btn {
            flex-shrink: 0;
        }
    }

    .checklists-empty {
        padding: $spacing-lg 0;
        color: $text-dark-grey;
        font-weight: 400;
        font-size: 15px;
        font-style: italic;
    }

    .checklists-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: $spacing-sm;

        @media (max-width: 1100px) {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        @media (max-width: 500px) {
            grid-template-columns: 1fr;
        }
    }
}

.checklists-section__tab-label {
    display: inline-flex;
    align-items: center;
    gap: 0.3em;
}

.checklists-section__tab-emoji {
    font-size: 1.15em;
    line-height: 1;
}
</style>
