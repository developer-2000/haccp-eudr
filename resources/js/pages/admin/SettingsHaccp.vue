<template>
    <div class="settings-haccp-page">
        <h1 class="page-title">Creating your HACCP Plan</h1>

        <n-alert type="info" class="info-alert">
            This is a HACCP plan builder. Answer the questions, follow each step, and the program will automatically generate your customizable HACCP plan template.
            <strong>You can later modify the plan according to your needs or feedback.</strong>
            Need help? Read our article
            <a href="javascript:void(0)">"How to get started with a HACCP plan?"</a>
            <n-progress
                type="line"
                :percentage="completionPercentage"
                indicator-placement="inside"
                :processing="completionPercentage < 100"
                :color="progressColor"
                :rail-color="railColor"
                class="progress-bar"
            />
        </n-alert>

        <div class="tasks-container">
            <n-space vertical :size="16">
                <n-card
                    v-for="task in tasks"
                    :key="task.id"
                    :class="['task-card', { 'task-card--completed': task.isComplete }]"
                    hoverable
                    @click="handleTaskClick(task.id)"
                >
                    <div class="task-content">
                        <div class="task-action-icon">
                            <Icon name="left-outlined"/>
                        </div>
                        <div class="task-main">
                            <div class="task-header">
                                <h3 class="task-title" >
                                    {{ task.title }}
                                </h3>
                                <n-tag
                                    :type="task.isComplete ? 'success' : 'error'"
                                    size="small"
                                    :bordered="false"
                                    class="task-status"
                                >
                                    {{ task.isComplete ? "Completed" : "Incomplete" }}
                                </n-tag>
                            </div>
                            <p class="task-description">{{ task.description }}</p>
                        </div>
                        <div class="task-status-icon">
                            <Icon :name="task.isComplete ? 'check-circle' : 'x-circle'"/>
                        </div>
                    </div>
                </n-card>
            </n-space>
        </div>
    </div>
</template>

<script setup>
/**
 * @fileoverview Страница настроек HACCP с задачами
 *
 * Отображает список задач HACCP с возможностью отслеживания их статуса.
 * Включает две задачи:
 * - Рабочая группа (завершена)
 * - Производственные этапы (не завершена)
 */

defineOptions({
    name: "SettingsHaccp",
});

// ============================================
// Импорты
// ============================================
import { ref, computed } from "vue";
import { NCard, NTag, NSpace, NAlert, NProgress, useThemeVars } from "naive-ui";
import { changeColor } from "seemly";
import Icon from "@/components/Icon.vue";

// ============================================
// Типы
// ============================================
/**
 * @typedef {Object} Task
 * @property {string} id - Уникальный идентификатор задачи
 * @property {string} title - Название задачи
 * @property {string} description - Описание задачи
 * @property {boolean} isComplete - Статус завершения задачи
 */

// ============================================
// State (Реактивное состояние)
// ============================================
/**
 * tasks - массив задач HACCP
 * Содержит только две задачи: "Рабочая группа" и "Производственные этапы"
 */
const tasks = ref([
    {
        id: "1",
        title: "General info",
        description:
            "Please note that the selection of your primary area of activity will affect the overall configuration of your HACCP plan.",
        isComplete: false,
    },
    {
        id: "2",
        title: "Working group",
        description:
            "This is a list of responsible persons for activities that are important for maintaining control over food safety. By assigning a responsible person, your employees will know who to contact if they have any questions.",
        isComplete: true,
    },
]);

// ============================================
// Theme
// ============================================
const themeVars = useThemeVars();

// ============================================
// Computed (Вычисляемые свойства)
// ============================================
/**
 * completionPercentage - вычисляет процент завершенных задач
 * Возвращает процент от 0 до 100 в зависимости от количества завершенных задач
 */
const completionPercentage = computed(() => {
    if (tasks.value.length === 0) return 0;
    const completedCount = tasks.value.filter((task) => task.isComplete).length;
    return Math.round((completedCount / tasks.value.length) * 100);
});

/**
 * progressColor - вычисляет цвет progress bar в зависимости от процента
 * 0%: errorColor
 * >0% и <100%: warningColor
 * 100%: infoColor
 */
const progressColor = computed(() => {
    const percentage = completionPercentage.value;
    if (percentage === 0) {
        return themeVars.value.errorColor;
    } else if (percentage < 100) {
        return themeVars.value.warningColor;
    } else {
        return themeVars.value.infoColor;
    }
});

/**
 * railColor - цвет фона progress bar
 * Всегда infoColor с прозрачностью 0.2
 */
const railColor = computed(() => {
    return changeColor(themeVars.value.infoColor, { alpha: 0.2 });
});

// ============================================
// Методы
// ============================================
/**
 * handleTaskClick - обработчик клика по карточке задачи
 * В будущем может использоваться для навигации на детальную страницу задачи
 * @param {string} id - идентификатор задачи
 */
const handleTaskClick = (id) => {
    // В будущем здесь может быть навигация на детальную страницу
    console.log(`Task item clicked: ${id}`);
};
</script>

<style scoped lang="scss">
@use "../../../scss/variables" as *;

.settings-haccp-page {
    padding: $spacing-xl;
    max-width: 1200px;
    margin: 0 auto;

    .page-title {
        font-size: $font-size-2-5xl;
        font-weight: 700;
        color: $text-color;
        margin: 0 0 $spacing-xl 0;
    }

    .info-alert {
        margin-bottom: $spacing-2xl;

        a {
            font-size: $font-size-base;
            font-weight: 500;

            &:hover {
                text-decoration: underline;
            }
        }

        .progress-bar {
            margin: 10px 0;
        }
    }

    .tasks-container {
        // Default
        .task-card {
            transition: all $transition-base;
            cursor: pointer;
            background: $task-incomplete-bg;
            border-color: $task-incomplete-border;

            &:hover {
                box-shadow: $shadow-sm-md;

                .task-action-icon {
                    :deep(.xicon) {
                        svg {
                            color: $text-red !important;
                        }
                    }
                }

                .task-main {
                    transform: translateX(8px);
                }
            }

            .task-content {
                display: flex;
                align-items: center;
                gap: $spacing-md;

                .task-main {
                    flex: 1;
                    min-width: 0;
                    transition: transform $transition-base;

                    .task-header {
                        display: flex;
                        flex-direction: column;
                        gap: $spacing-sm;
                        margin-bottom: $spacing-sm;

                        @include respond-to(sm) {
                            flex-direction: row;
                            align-items: center;
                        }

                        .task-title {
                            font-size: $font-size-xl;
                            font-weight: 600;
                            color: $text-color;
                            margin: 0;
                            transition: all $transition-base;

                            &--completed {
                                color: $success-color-dark;
                            }
                        }

                        .task-status {
                            align-self: flex-start;

                            @include respond-to(sm) {
                                align-self: center;
                                margin-left: $spacing-sm;
                            }
                        }
                    }

                    .task-description {
                        font-size: $font-size-base;
                        color: $text-light-grey;
                        margin: 0;
                        line-height: 1.6;
                    }
                }

                .task-action-icon {
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 20px;
                    height: 20px;

                    :deep(.xicon){
                        width: 20px;
                        height: 20px;
                        svg {
                            transition: color $transition-base;
                            width: 20px;
                            height: 20px;
                            color: $text-dark-grey;
                        }
                    }
                }

                .task-status-icon {
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    svg {
                        width: 24px;
                        height: 24px;
                        stroke: $text-red;
                    }
                }
            }

            // Success
            &--completed {
                background: $task-completed-bg;
                border-color: $task-completed-border;

                &:hover {
                    .task-action-icon {
                        :deep(.xicon) {
                            svg {
                                color: $text-green !important;
                            }
                        }
                    }
                }

                .task-content{
                    .task-status-icon {
                        svg {
                            stroke: $text-green;
                        }
                    }
                }
            }
        }
    }
}
</style>
