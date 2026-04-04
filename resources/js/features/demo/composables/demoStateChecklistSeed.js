/** Статические сиды для демо-чек-листов: слоты замеров, корректирующие действия, определения полей CCP. */

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

/** Как в модалке создания: варианты ответов при провале заполняет пользователь — в дефолте пусто. */
export const CORRECTIVE_ACTIONS_BY_TASK_ID = {
    "coffee-1": [],
    "coffee-2": [],
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
                description:
                    "Осмотреть зону ответственности, кратко описать возможные проблемы в комментарии, при необходимости сделать фото и прикрепить файл.",
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
                question: "Состояние упаковки партии и маркировки корректно?",
                options: ["Да, все корректно", "Нет, есть замечания"],
            },
        },
    ],
    "coffee-4": [
        {
            id: "def-coffee-4-ticket",
            fieldType: "ticket",
            config: {
                description: "Оформить заявку в техслужбу при нестабильной работе кофемашины.",
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
                description:
                    "Оформить заявку на проверку вентиляции и влажности в выбранных помещениях.",
            },
        },
    ],
    "bakery-5": [
        {
            id: "def-bakery-5-single-choice",
            fieldType: "single_choice",
            config: {
                question: "Сроки сырья и маркировка актуальны?",
                options: ["Да, все в порядке", "Нет, есть просрочка/ошибка"],
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
                question: "Маркировка партии заполнена корректно?",
                options: ["Да, корректно", "Нет, требуется исправление"],
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
                description: "Создать заявку на обслуживание оборудования термоконтроля.",
            },
        },
    ],
    "meat-5": [
        {
            id: "def-meat-5-ticket",
            fieldType: "ticket",
            config: {
                description: "Санобработка выполнена не полностью. Оформить заявку на доработку.",
            },
        },
    ],
};
