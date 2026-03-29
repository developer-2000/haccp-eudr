<template>
    <!-- Секция дашборда демо: метрики + горячие задачи + модалка просмотра -->
    <div class="dashboard-section">
        <!-- Плитки метрик: выполнение, compliance, критические CCP, без ответственного, дата инспекции -->
        <div class="dashboard-metrics">
            <article class="metric-card">
                <p class="metric-card__label metric-card__label--success">
                    Выполнены
                </p>
                <p class="metric-card__value">
                    {{ metrics.tasksDone }}/{{ metrics.tasksTotal }}
                </p>
            </article>

            <article class="metric-card metric-card--success">
                <p class="metric-card__label">Compliance</p>
                <p class="metric-card__value">{{ metrics.compliance }}%</p>
            </article>

            <article class="metric-card metric-card--danger">
                <p class="metric-card__label">Критические CCP</p>
                <p class="metric-card__value">{{ metrics.criticalCount }}</p>
            </article>

            <article class="metric-card metric-card--warn">
                <p class="metric-card__label">Без ответственного</p>
                <p class="metric-card__value">
                    {{ metrics.tasksWithoutAssignee ?? 0 }}
                </p>
            </article>

            <article class="metric-card">
                <p class="metric-card__label">Инспекция</p>
                <p class="metric-card__value">{{ metrics.inspectionDate }}</p>
            </article>
        </div>

        <!-- Список «горячих» задач (не OK): клик открывает модалку без перехода в Checklists -->
        <div class="hot-tasks">
            <div class="hot-tasks__header">
                <h2 class="hot-tasks__title">Hot tasks</h2>
            </div>

            <div class="hot-tasks__list">
                <TaskCard
                    v-for="task in hotTasks"
                    :key="task.id"
                    :task="task"
                    :staff="staff"
                    mode="hot"
                    :show-niche-icon="true"
                    @select="openTaskModal"
                />
            </div>
        </div>

        <!-- Модалка просмотра задачи: без v-if каждый заход на дашборд монтировал бы модалку и тянул Pinia taskGrainCooling без необходимости -->
        <ShowTaskModal
            v-if="isTaskModalOpen"
            :show="isTaskModalOpen"
            :task="selectedTask"
            :task-type="selectedNiche ?? 'coffee'"
            :staff="staff"
            mode="hot"
            @close="closeTaskModal"
        />
    </div>
</template>

<script setup>
import { computed, ref } from "vue";
import ShowTaskModal from "@/features/demo/components/modals/show_task/ShowTaskModal.vue";
import TaskCard from "./TaskCard.vue";

defineOptions({ name: "DashboardSection" });

const props = defineProps({
    metrics: {
        type: Object,
        required: true,
    },
    hotTasks: {
        type: Array,
        required: true,
    },
    checklistsByNiche: {
        type: Object,
        required: true,
    },
    staff: {
        type: Array,
        default: () => [],
    },
});

const isTaskModalOpen = ref(false);
/** Не хранить ссылку на объект из снимка hotTasks: после иммутаций в `demoState` ссылка устаревает. */
const selectedTaskId = ref(null);
const selectedNiche = ref(null);

const selectedTask = computed(() => {
    const id = selectedTaskId.value;
    const niche = selectedNiche.value;
    if (id == null || niche == null || niche === "") {
        return null;
    }
    const list = props.checklistsByNiche?.[niche] ?? [];
    return list.find((t) => t.id === id) ?? null;
});

/**
 * Открывает модалку выбранной hot task.
 * Нужен для показа деталей задачи без перехода на другую секцию.
 */
const openTaskModal = (task) => {
    selectedTaskId.value = task.id;
    selectedNiche.value = task.type;
    isTaskModalOpen.value = true;
};

/**
 * Закрывает модалку hot task и очищает выбранную запись.
 * Нужен для корректного сброса состояния между открытиями.
 */
const closeTaskModal = () => {
    isTaskModalOpen.value = false;
    selectedTaskId.value = null;
    selectedNiche.value = null;
};

</script>

<style scoped lang="scss">
@use "../../../../../scss/variables" as *;

.dashboard-section {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
}

.dashboard-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: $spacing-md;

    @media (max-width: 500px) {
        grid-template-columns: 1fr;
    }
}

.dashboard-metrics .metric-card {
    border: 1px solid $text-light-grey;
    border-radius: $radius-xl;
    padding: $radius-md $radius-xl;
    background-color: $bg-style-white;
    transition: box-shadow $transition-base ease;

    &:hover {
        box-shadow: $shadow-sm-md;
    }
}

.dashboard-metrics .metric-card.metric-card--success {
    background-color: $bg-light-grey;
}

.dashboard-metrics .metric-card.metric-card--danger {
    border-color: rgba($text-red, 0.35);
}

.dashboard-metrics .metric-card.metric-card--warn {
    border-color: rgba($accent-primary, 0.35);
    background-color: rgba($bg-light-grey, 0.5);
}

.dashboard-metrics .metric-card .metric-card__label {
    margin: 0 0 $spacing-xs;
    font-size: $font-size-sm;
    color: $text-dark-grey;
}

.dashboard-metrics .metric-card .metric-card__label.metric-card__label--success {
    color: $text-green;
    font-weight: 600;
}

.dashboard-metrics .metric-card .metric-card__value {
    margin: 0;
    font-size: $font-size-2xl;
    font-weight: 700;
    color: $text-color;
}

.hot-tasks {
    border: 1px solid $text-light-grey;
    border-radius: $radius-xl;
    background-color: $bg-style-white;
    padding: $spacing-sm-m-m $spacing-md-lg;
}

.hot-tasks .hot-tasks__header {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
}

.hot-tasks .hot-tasks__title {
    white-space: nowrap;
    font-size: $font-size-xl;
    margin-right: 10px;
}

.hot-tasks .hot-tasks__list {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm-w;
    overflow: visible;
}

</style>
