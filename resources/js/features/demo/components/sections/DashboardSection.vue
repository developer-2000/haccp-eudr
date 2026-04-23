<template>
    <div class="dashboard-section">
        <div class="dashboard-metrics">
            <article class="metric-card">
                <p class="metric-card__label metric-card__label--success">
                    {{ t('demo.dashboard.completed') }}
                </p>
                <p class="metric-card__value">
                    {{ metrics.tasksDone }}/{{ metrics.tasksTotal }}
                </p>
            </article>

            <article class="metric-card metric-card--success">
                <p class="metric-card__label">{{ t('demo.dashboard.compliance') }}</p>
                <p class="metric-card__value">{{ metrics.compliance }}%</p>
            </article>

            <article class="metric-card metric-card--danger">
                <p class="metric-card__label">{{ t('demo.dashboard.critical_ccp') }}</p>
                <p class="metric-card__value">{{ metrics.criticalCount }}</p>
            </article>

            <article class="metric-card metric-card--warn">
                <p class="metric-card__label">{{ t('demo.dashboard.no_assignee') }}</p>
                <p class="metric-card__value">
                    {{ metrics.tasksWithoutAssignee ?? 0 }}
                </p>
            </article>

            <article class="metric-card">
                <p class="metric-card__label">{{ t('demo.dashboard.inspection') }}</p>
                <p class="metric-card__value">{{ metrics.inspectionDate }}</p>
            </article>
        </div>

        <div class="hot-tasks">
            <div class="hot-tasks__header">
                <h2 class="hot-tasks__title">{{ t('demo.dashboard.hot_tasks') }}</h2>
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

        <RouterLink
            class="dashboard-section__checklists-cta"
            :to="checklistsDemoRoute"
        >
            {{ t('demo.dashboard.checklists') }}
        </RouterLink>

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
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import ShowTaskModal from "@/features/demo/components/modals/show_task/ShowTaskModal.vue";
import TaskCard from "./TaskCard.vue";

const route = useRoute();
const { t } = useI18n();

const checklistsDemoRoute = computed(() => ({
    name: "Demo",
    params: { ...route.params, section: "checklists" },
}));

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

    .dashboard-metrics {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: $spacing-md;

        @media (max-width: 500px) {
            grid-template-columns: 1fr;
        }

        .metric-card {
            border: 1px solid $text-light-grey;
            border-radius: $radius-xl;
            padding: $radius-md $radius-xl;
            background-color: $bg-style-white;
            transition: box-shadow $transition-base ease;

            &:hover {
                box-shadow: $shadow-sm-md;
            }

            .metric-card__label {
                margin: 0 0 $spacing-xs;
                font-size: $font-size-sm;
                color: $text-dark-grey;
            }

            .metric-card__label--success {
                color: $text-green;
                font-weight: 600;
            }

            .metric-card__value {
                margin: 0;
                font-size: $font-size-2xl;
                font-weight: 600;
                color: $text-color;

                @media (max-width: 920px) {
                    font-size: 20px;
                }
            }
        }

        .metric-card--success {
            background-color: $bg-light-grey;
        }

        .metric-card--danger {
            border-color: rgba($text-red, 0.35);
        }

        .metric-card--warn {
            border-color: rgba($accent-primary, 0.35);
            background-color: rgba($bg-light-grey, 0.5);
        }

    }

    .hot-tasks {
        border: 1px solid $text-light-grey;
        border-radius: $radius-xl;
        background-color: $bg-style-white;
        padding: $spacing-sm-m-m $spacing-md-lg;

        .hot-tasks__header {
            margin-bottom: 10px;
            display: flex;
            align-items: center;

            .hot-tasks__title {
                white-space: nowrap;
                font-size: $font-size-xl;
                margin-right: 10px;
            }
        }

        .hot-tasks__list {
            display: flex;
            flex-wrap: wrap;
            gap: $spacing-sm-w;
            overflow: visible;
        }
    }

    .dashboard-section__checklists-cta {
        display: none;
    }

    @media (max-width: $breakpoint-lg) {
        .dashboard-section__checklists-cta {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: $spacing-md;
            padding: $spacing-md $spacing-lg;
            border-radius: $radius-xxl-s;
            background-color: $accent-primary;
            color: $text-white;
            font-size: $font-size-lg;
            font-weight: 600;
            text-decoration: none;
            transition: background-color $transition-base ease;

            &:hover,
            &:focus-visible {
                background-color: $accent-primary-dark;
                color: $text-white;
                text-decoration: none;
            }

            &:focus-visible {
                outline: 2px solid rgba($text-white, 0.9);
                outline-offset: 2px;
            }
        }
    }
}

</style>
