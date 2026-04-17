import { i18n } from "@/i18n";
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
                title: i18n.global.t('demo.seed_tasks.coffee_1'),
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
                title: i18n.global.t('demo.seed_tasks.coffee_2'),
                status: false,
                measurements: REPEAT_MEASUREMENTS_BY_TASK_ID["coffee-2"],
                correctiveActions: CORRECTIVE_ACTIONS_BY_TASK_ID["coffee-2"],
                taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["coffee-2"],
                equipmentTargetIds: ["eq-coffee-bean-cooler"],
            },
            {
                id: "coffee-3",
                title: i18n.global.t('demo.seed_tasks.coffee_3'),
                status: false,
                measurements: REPEAT_MEASUREMENTS_BY_TASK_ID["coffee-3"],
                correctiveActions: CORRECTIVE_ACTIONS_BY_TASK_ID["coffee-3"],
                taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["coffee-3"],
                equipmentTargetIds: ["eq-transport-box", "eq-dry-goods"],
            },
            {
                id: "coffee-4",
                title: i18n.global.t('demo.seed_tasks.coffee_4'),
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
                title: i18n.global.t('demo.seed_tasks.bakery_3'),
                status: false,
                taskScopeType: "equipment",
                measurements: REPEAT_MEASUREMENTS_BY_TASK_ID["bakery-3"],
                correctiveActions: CORRECTIVE_ACTIONS_BY_TASK_ID["bakery-3"],
                taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["bakery-3"],
                equipmentTargetIds: ["eq-bread-proofing-cabinet"],
            },
            {
                id: "bakery-4",
                title: i18n.global.t('demo.seed_tasks.bakery_4'),
                status: false,
                measurements: REPEAT_MEASUREMENTS_BY_TASK_ID["bakery-4"],
                correctiveActions: CORRECTIVE_ACTIONS_BY_TASK_ID["bakery-4"],
                taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["bakery-4"],
                roomTargetIds: ["room-production-hall", "room-raw-storage"],
            },
            {
                id: "bakery-5",
                title: i18n.global.t('demo.seed_tasks.bakery_5'),
                status: true,
                taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["bakery-5"],
                roomTargetIds: ["room-raw-storage", "room-receiving"],
            },
        ],
        meat: [
            {
                id: "meat-1",
                title: i18n.global.t('demo.seed_tasks.meat_1'),
                status: false,
                taskScopeType: "equipment",
                measurements: REPEAT_MEASUREMENTS_BY_TASK_ID["meat-1"],
                correctiveActions: CORRECTIVE_ACTIONS_BY_TASK_ID["meat-1"],
                taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["meat-1"],
                equipmentTargetIds: ["eq-freezer", "eq-cold-storage"],
            },
            {
                id: "meat-2",
                title: i18n.global.t('demo.seed_tasks.meat_2'),
                status: true,
                taskScopeType: "rooms",
                taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["meat-2"],
                roomTargetIds: ["room-finished-storage", "room-office-qc"],
            },
            {
                id: "meat-3",
                title: i18n.global.t('demo.seed_tasks.meat_3'),
                status: false,
                taskScopeType: "equipment",
                measurements: REPEAT_MEASUREMENTS_BY_TASK_ID["meat-3"],
                correctiveActions: CORRECTIVE_ACTIONS_BY_TASK_ID["meat-3"],
                taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["meat-3"],
                equipmentTargetIds: ["eq-fridge-1", "eq-fridge-2"],
            },
            {
                id: "meat-4",
                title: i18n.global.t('demo.seed_tasks.meat_4'),
                status: false,
                taskScopeType: "equipment",
                measurements: REPEAT_MEASUREMENTS_BY_TASK_ID["meat-4"],
                correctiveActions: CORRECTIVE_ACTIONS_BY_TASK_ID["meat-4"],
                taskFieldDefinitions: TASK_FIELD_DEFINITIONS_BY_TASK_ID["meat-4"],
                equipmentTargetIds: ["eq-probe-1", "eq-fridge-2"],
            },
            {
                id: "meat-5",
                title: i18n.global.t('demo.seed_tasks.meat_5'),
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
