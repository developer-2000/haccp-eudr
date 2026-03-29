import { computed } from "vue";
import {
    firstPendingMeasurementTime,
    taskDisplayStatusKey,
} from "@/features/demo/domain/checklistTaskModel";

/**
 * Возвращает timestamp начала текущих суток (локальное время).
 * Вызывается один раз на пересчёт `dashboardChecklistTasks`, чтобы не создавать `Date` на каждую задачу в фильтре.
 */
const getTodayStartTimestamp = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
};

/**
 * Проверяет, что `startDate` задачи позже начала суток `todayStartTs`.
 * Используется при фильтрации задач для дашборда; границу суток передают снаружи один раз на проход.
 */
const isTaskScheduledForFuture = (task, todayStartTs) =>
    typeof task?.startDate === "number" &&
    Number.isFinite(task.startDate) &&
    task.startDate > todayStartTs;

/**
 * Проверяет наличие pending-слотов и считает problem-слоты в рамках одной задачи.
 * Используется в едином проходе агрегации dashboard, чтобы не делать лишние обходы массива measurements.
 */
const getTaskMeasurementStats = (task) => {
    const rows = Array.isArray(task?.measurements) ? task.measurements : [];
    let hasPending = false;
    let problemCount = 0;

    for (const row of rows) {
        if (row?.status === "pending") {
            hasPending = true;
        }
        if (row?.status === "problem") {
            problemCount += 1;
        }
    }

    return { hasPending, problemCount, measurementCount: rows.length };
};

/**
 * Собирает view-model дашборда демо из `demoState`: список задач для дашборда, метрики и hot tasks.
 * Используется страницей `features/demo/page/DemoPage.vue` для пропсов `DashboardSection` и изоляции доменной подготовки данных.
 */
export const useDemoDashboardViewModel = (demoState) => {
    const allChecklistTasks = computed(() =>
        Object.entries(demoState.value.checklistsByNiche).flatMap(
            ([niche, tasks]) => tasks.map((task) => ({ ...task, niche })),
        ),
    );

    const dashboardChecklistTasks = computed(() => {
        const todayStartTs = getTodayStartTimestamp();
        const source = allChecklistTasks.value;
        const filtered = source.filter(
            (task) => !isTaskScheduledForFuture(task, todayStartTs),
        );

        return filtered;
    });

    const dashboardDerivedData = computed(() => {
        const tasks = dashboardChecklistTasks.value;
        const hotTasks = [];
        let tasksDone = 0;
        let criticalCount = 0;
        let tasksWithoutAssignee = 0;

        for (const task of tasks) {
            const measurementStats = getTaskMeasurementStats(task);
            criticalCount += measurementStats.problemCount;

            if (!measurementStats.hasPending) {
                tasksDone += 1;
            }
            if (!task?.assignedStaffId) {
                tasksWithoutAssignee += 1;
            }
            if (measurementStats.hasPending) {
                const displayKey = taskDisplayStatusKey(task);
                hotTasks.push({
                    id: task.id,
                    title: task.title,
                    value: firstPendingMeasurementTime(task),
                    status: displayKey === "problem" ? "warning" : displayKey,
                    type: task.niche,
                    assignedStaffId: task.assignedStaffId ?? null,
                    measurements: task.measurements ?? [],
                    correctiveActions: task.correctiveActions ?? [],
                    taskFieldDefinitions: Array.isArray(task.taskFieldDefinitions)
                        ? task.taskFieldDefinitions
                        : [],
                    taskScopeType: task.taskScopeType ?? null,
                    equipmentTargetIds: Array.isArray(task.equipmentTargetIds)
                        ? task.equipmentTargetIds
                        : [],
                    roomTargetIds: Array.isArray(task.roomTargetIds)
                        ? task.roomTargetIds
                        : [],
                });
            }
        }

        const tasksTotal = tasks.length;
        const compliance =
            tasksTotal > 0 ? Math.round((tasksDone / tasksTotal) * 100) : 0;

        return {
            tasksTotal,
            tasksDone,
            compliance,
            criticalCount,
            tasksWithoutAssignee,
            hotTasks,
        };
    });

    /**
     * Единый снимок для `DashboardSection`: объект `metrics` и массив `hotTasks` из одного прохода `dashboardDerivedData`.
     * Используется страницей `DemoPage.vue`, чтобы не держать два отдельных computed на одни и те же данные.
     */
    const dashboardPanelData = computed(() => {
        const d = dashboardDerivedData.value;
        const result = {
            metrics: {
                tasksDone: d.tasksDone,
                tasksTotal: d.tasksTotal,
                compliance: d.compliance,
                criticalCount: d.criticalCount,
                tasksWithoutAssignee: d.tasksWithoutAssignee,
                inspectionDate: demoState.value.inspectionDate,
            },
            hotTasks: d.hotTasks,
        };

        return result;
    });

    return {
        dashboardChecklistTasks,
        dashboardPanelData,
    };
};
