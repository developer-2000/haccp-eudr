import {
    DEFAULT_SITES,
    DEFAULT_STAFF,
    DEMO_STATE_SCHEMA_VERSION,
} from "@/features/demo/data/demoPersonnel";
import { buildDemoBatches } from "@/features/demo/data/eudrBatchPublic";
import { applyDefaultAssigneesToChecklists } from "@/features/demo/utils/demoStaff";
import {
    buildDefaultTask,
    toStartOfDayTimestamp,
} from "@/features/demo/domain/checklistTaskModel";
import {
    CORRECTIVE_ACTIONS_BY_TASK_ID,
    REPEAT_MEASUREMENTS_BY_TASK_ID,
    TASK_FIELD_DEFINITIONS_BY_TASK_ID,
} from "@/features/demo/composables/demoStateChecklistSeed";
import {
    getEndOfCurrentMonthDateRu,
    getTodayDateIso,
} from "@/features/demo/composables/demoStateDateUtils";
import { seedChecklistsTemperatureAi } from "@/features/demo/ai/temperature/seedChecklistsTemperatureAi";

/** Экспорт для сборки публичного дневного отчёта (`dailyReportPublic.js`). */
export const createDefaultState = () => {
    const startDate = toStartOfDayTimestamp(`${getTodayDateIso()}T00:00:00`);
    const checklistsByNicheBase = {
        coffee: [
            {
                id: "coffee-1",
                title: "Заявка по помещению кофейни",
                status: true,
                taskScopeType: "rooms",
                measurements: REPEAT_MEASUREMENTS_BY_TASK_ID["coffee-1"],
                correctiveActions: CORRECTIVE_ACTIONS_BY_TASK_ID["coffee-1"],
                taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["coffee-1"],
                roomTargetIds: [
                    "room-production-hall",
                    "room-raw-storage",
                    "room-receiving",
                ],
            },
            {
                id: "coffee-2",
                title: "Охлаждение зерна",
                status: false,
                measurements: REPEAT_MEASUREMENTS_BY_TASK_ID["coffee-2"],
                correctiveActions: CORRECTIVE_ACTIONS_BY_TASK_ID["coffee-2"],
                taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["coffee-2"],
                equipmentTargetIds: ["eq-cold-storage", "eq-fridge-1"],
            },
            {
                id: "coffee-3",
                title: "Проверка маркировки и упаковки партии",
                status: false,
                measurements: REPEAT_MEASUREMENTS_BY_TASK_ID["coffee-3"],
                correctiveActions: CORRECTIVE_ACTIONS_BY_TASK_ID["coffee-3"],
                taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["coffee-3"],
                equipmentTargetIds: ["eq-transport-box", "eq-dry-goods"],
            },
            {
                id: "coffee-4",
                title: "Заявка в техслужбу по кофемашине",
                status: false,
                measurements: REPEAT_MEASUREMENTS_BY_TASK_ID["coffee-4"],
                correctiveActions: CORRECTIVE_ACTIONS_BY_TASK_ID["coffee-4"],
                taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["coffee-4"],
                equipmentTargetIds: ["eq-coffee-machine"],
            },
        ],
        bakery: [
            {
                id: "bakery-3",
                title: "Охлаждение помещения",
                status: false,
                measurements: REPEAT_MEASUREMENTS_BY_TASK_ID["bakery-3"],
                correctiveActions: CORRECTIVE_ACTIONS_BY_TASK_ID["bakery-3"],
                taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["bakery-3"],
                roomTargetIds: ["room-production-hall", "room-cold-chamber"],
            },
            {
                id: "bakery-4",
                title: "Заявка по помещениям пекарни",
                status: false,
                measurements: REPEAT_MEASUREMENTS_BY_TASK_ID["bakery-4"],
                correctiveActions: CORRECTIVE_ACTIONS_BY_TASK_ID["bakery-4"],
                taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["bakery-4"],
                roomTargetIds: ["room-production-hall", "room-raw-storage"],
            },
            {
                id: "bakery-5",
                title: "Сроки сырья",
                status: true,
                taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["bakery-5"],
                roomTargetIds: ["room-raw-storage", "room-receiving"],
            },
        ],
        meat: [
            {
                id: "meat-1",
                title: "Морозильная камера",
                status: false,
                taskScopeType: "equipment",
                measurements: REPEAT_MEASUREMENTS_BY_TASK_ID["meat-1"],
                correctiveActions: CORRECTIVE_ACTIONS_BY_TASK_ID["meat-1"],
                taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["meat-1"],
                equipmentTargetIds: ["eq-freezer", "eq-cold-storage"],
            },
            {
                id: "meat-2",
                title: "Маркировка партии",
                status: true,
                taskScopeType: "rooms",
                taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["meat-2"],
                roomTargetIds: ["room-finished-storage", "room-office-qc"],
            },
            {
                id: "meat-3",
                title: "Температура хранения",
                status: false,
                taskScopeType: "equipment",
                measurements: REPEAT_MEASUREMENTS_BY_TASK_ID["meat-3"],
                correctiveActions: CORRECTIVE_ACTIONS_BY_TASK_ID["meat-3"],
                taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["meat-3"],
                equipmentTargetIds: ["eq-fridge-1", "eq-fridge-2"],
            },
            {
                id: "meat-4",
                title: "Заявка по оборудованию термоконтроля",
                status: false,
                taskScopeType: "equipment",
                measurements: REPEAT_MEASUREMENTS_BY_TASK_ID["meat-4"],
                correctiveActions: CORRECTIVE_ACTIONS_BY_TASK_ID["meat-4"],
                taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["meat-4"],
                equipmentTargetIds: ["eq-probe-1", "eq-fridge-2"],
            },
            {
                id: "meat-5",
                title: "Санобработка",
                status: true,
                taskScopeType: "rooms",
                taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["meat-5"],
                roomTargetIds: ["room-wash", "room-production-hall"],
            },
        ],
    };
    const checklistsByNicheRaw = Object.fromEntries(
        Object.entries(checklistsByNicheBase).map(([niche, tasks]) => [
            niche,
            tasks.map((task, index) =>
                buildDefaultTask(task, niche, { startDate, index }),
            ),
        ]),
    );

    const checklistsByNiche = applyDefaultAssigneesToChecklists(checklistsByNicheRaw);
    seedChecklistsTemperatureAi(checklistsByNiche);

    return {
        demoStateSchemaVersion: DEMO_STATE_SCHEMA_VERSION,
        inspectionDate: getEndOfCurrentMonthDateRu(),
        sites: DEFAULT_SITES.map((s) => ({ ...s })),
        staff: DEFAULT_STAFF.map((s) => ({ ...s })),
        checklistsByNiche,
        batches: buildDemoBatches(),
        report: {
            /** Публичная страница ежедневного отчёта: /report/YYYY-MM-DD (не карточка партии). */
            reportDayIso: getTodayDateIso(),
            company: "Piotr Bakery",
        },
    };
};
