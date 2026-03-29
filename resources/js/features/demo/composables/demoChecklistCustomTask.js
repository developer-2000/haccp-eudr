import { v4 as uuidv4 } from "uuid";
import { buildTaskFromPayload } from "@/features/demo/domain/checklistTaskModel";

/**
 * Собирает объект пользовательской задачи CCP для вставки в `checklistsByNiche`.
 * Используется `addChecklistTask` внутри composable: стабильный id (`custom-{niche}-…`), `isCustom`, `taskScopeType`, `scope: 'standalone'` для отдельной задачи, `equipmentTargetIds` / `roomTargetIds` при соответствующих типах, `frequency`, `assignedStaffId` (схема 10+), `taskFieldDefinitions` (схема 11+), `repeatTimes` и длина `measurements` согласованы (число слотов = `measurements.length`). Полная модель совпадает с `checklistsByNiche` (шаг 7).
 */
export const buildChecklistTaskFromPayload = (niche, payload) =>
    buildTaskFromPayload({
        niche,
        payload,
        source: "custom",
        idFactory: (targetNiche) => `custom-${targetNiche}-${uuidv4()}`,
    });
