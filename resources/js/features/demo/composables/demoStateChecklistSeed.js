import { i18n } from "@/i18n";
const tt = (...args) => i18n.global.t(...args);

const pendingSlot = (time) => ({
    time,
    value: "-",
    status: "pending",
});

export const REPEAT_MEASUREMENTS_BY_TASK_ID = {
    "coffee-1": [pendingSlot("09:00"), pendingSlot("15:00")],
    "coffee-2": [
        pendingSlot("00:00"),
        pendingSlot("06:00"),
        pendingSlot("12:00"),
        pendingSlot("18:00"),
    ],
    "coffee-3": [pendingSlot("09:00"), pendingSlot("15:00")],
    "coffee-4": [pendingSlot("10:00"), pendingSlot("16:00")],
    "bakery-3": [
        pendingSlot("00:00"),
        pendingSlot("08:00"),
        pendingSlot("12:00"),
        pendingSlot("16:00"),
    ],
    "bakery-4": [pendingSlot("09:00"), pendingSlot("15:00")],
    "meat-1": [
        pendingSlot("00:00"),
        pendingSlot("06:00"),
        pendingSlot("12:00"),
        pendingSlot("18:00"),
    ],
    "meat-3": [
        pendingSlot("00:00"),
        pendingSlot("06:00"),
        pendingSlot("12:00"),
        pendingSlot("18:00"),
    ],
    "meat-4": [pendingSlot("10:00"), pendingSlot("16:00")],
};

export const DEMO_CHECKLIST_NICHES = new Set(["coffee", "bakery", "meat"]);

/** Как в модалке создания: варианты ответов при провале заполняет пользователь — в дефолте пусто (кроме явных пресетов ниже). */
export const CORRECTIVE_ACTIONS_BY_TASK_ID = {
    "coffee-1": [],
    /** Задача «Охлаждение зерна» (`coffee-2`): почему ответственный не выполнил задачу вовремя / как задумано. */
    "coffee-2": [
        tt('demo.seed_corrective.left_workplace'),
        tt('demo.seed_corrective.distracted'),
        tt('demo.seed_corrective.no_measurement'),
        tt('demo.seed_corrective.no_understanding'),
        tt('demo.seed_corrective.equipment_downtime'),
        tt('demo.seed_corrective.missed_deadline'),
        tt('demo.seed_corrective.no_handoff'),
    ],
    "coffee-3": [],
    "coffee-4": [],
    "bakery-3": [],
    "bakery-4": [],
    "meat-1": [],
    "meat-3": [],
    "meat-4": [],
};

/**
 * Поля «Суть задачи»: только то, что задаётся формой модалки (тип + config без лишних ключей).
 * Для temperature — только minC/maxC (label/showCamera добавляет нормализация при сохранении, как у ручного создания).
 */
export const TASK_FIELD_DEFINITIONS_BY_TASK_ID = {
    "coffee-1": [
        {
            id: "def-coffee-1-ticket",
            fieldType: "ticket",
            config: {
                description: tt('demo.seed_field_descriptions.coffee_1_desc'),
            },
        },
    ],
    "coffee-2": [
        {
            id: "def-coffee-2-temperature",
            fieldType: "temperature",
            config: {
                minC: 15,
                maxC: 25,
            },
        },
    ],
    "coffee-3": [
        {
            id: "def-coffee-3-single-choice",
            fieldType: "single_choice",
            config: {
                question: tt('demo.seed_field_descriptions.coffee_3_question'),
                options: [tt('demo.seed_field_descriptions.coffee_3_opt_yes'), tt('demo.seed_field_descriptions.coffee_3_opt_no')],
            },
        },
    ],
    "coffee-4": [
        {
            id: "def-coffee-4-ticket",
            fieldType: "ticket",
            config: {
                description: tt('demo.seed_field_descriptions.coffee_4_desc'),
            },
        },
    ],
    "bakery-3": [
        {
            id: "def-bakery-3-temperature",
            fieldType: "temperature",
            config: {
                minC: 32,
                maxC: 40,
            },
        },
    ],
    "bakery-4": [
        {
            id: "def-bakery-4-ticket",
            fieldType: "ticket",
            config: {
                description: tt('demo.seed_field_descriptions.bakery_4_desc'),
            },
        },
    ],
    "bakery-5": [
        {
            id: "def-bakery-5-single-choice",
            fieldType: "single_choice",
            config: {
                question: tt('demo.seed_field_descriptions.bakery_5_question'),
                options: [tt('demo.seed_field_descriptions.bakery_5_opt_yes'), tt('demo.seed_field_descriptions.bakery_5_opt_no')],
            },
        },
    ],
    "meat-1": [
        {
            id: "def-meat-1-temperature",
            fieldType: "temperature",
            config: { minC: -21, maxC: -17 },
        },
    ],
    "meat-2": [
        {
            id: "def-meat-2-single-choice",
            fieldType: "single_choice",
            config: {
                question: tt('demo.seed_field_descriptions.meat_2_question'),
                options: [tt('demo.seed_field_descriptions.meat_2_opt_yes'), tt('demo.seed_field_descriptions.meat_2_opt_no')],
            },
        },
    ],
    "meat-3": [
        {
            id: "def-meat-3-temperature",
            fieldType: "temperature",
            config: { minC: 0, maxC: 4 },
        },
    ],
    "meat-4": [
        {
            id: "def-meat-4-ticket",
            fieldType: "ticket",
            config: {
                description: tt('demo.seed_field_descriptions.meat_4_desc'),
            },
        },
    ],
    "meat-5": [
        {
            id: "def-meat-5-ticket",
            fieldType: "ticket",
            config: {
                description: tt('demo.seed_field_descriptions.meat_5_desc'),
            },
        },
    ],
};
