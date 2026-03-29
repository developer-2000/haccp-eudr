/** Статические сиды для демо-чек-листов: слоты замеров, корректирующие действия, определения полей CCP. */

export const REPEAT_MEASUREMENTS_BY_TASK_ID = {
    "coffee-1": [
        { time: "09:00", value: "-", status: "pending" },
        { time: "15:00", value: "-", status: "pending" },
    ],
    "coffee-2": [
        { time: "00:00", value: "34 °C", status: "success" },
        { time: "06:00", value: "-", status: "pending" },
        { time: "12:00", value: "-", status: "pending" },
        { time: "18:00", value: "-", status: "pending" },
    ],
    "coffee-3": [
        { time: "09:00", value: "-", status: "pending" },
        { time: "15:00", value: "-", status: "pending" },
    ],
    "coffee-4": [
        { time: "10:00", value: "-", status: "pending" },
        { time: "16:00", value: "-", status: "pending" },
    ],
    "bakery-3": [
        { time: "00:00", value: "28 мин", status: "success" },
        { time: "08:00", value: "34 мин", status: "problem" },
        { time: "12:00", value: "30 мин", status: "success" },
        { time: "16:00", value: "-", status: "pending" },
    ],
    "bakery-4": [
        { time: "09:00", value: "-", status: "pending" },
        { time: "15:00", value: "-", status: "pending" },
    ],
    "meat-1": [
        { time: "00:00", value: "-19 °C", status: "success" },
        { time: "06:00", value: "-17 °C", status: "success" },
        { time: "12:00", value: "-5 °C", status: "problem" },
        { time: "18:00", value: "-", status: "pending" },
    ],
    "meat-3": [
        { time: "00:00", value: "2,1 °C", status: "success" },
        { time: "06:00", value: "5,6 °C", status: "problem" },
        { time: "12:00", value: "2,3 °C", status: "success" },
        { time: "18:00", value: "-", status: "pending" },
    ],
    "meat-4": [
        { time: "10:00", value: "-", status: "pending" },
        { time: "16:00", value: "-", status: "pending" },
    ],
};

export const DEMO_CHECKLIST_NICHES = new Set(["coffee", "bakery", "meat"]);

export const CORRECTIVE_ACTIONS_BY_TASK_ID = {
    "coffee-1": [
        "Меня не было на участке.",
        "Я слишком туп для выполнения подобных поручений.",
        "Был загружен основной работой, не успел.",
    ],
    "coffee-2": [
        "Погрешность измерения. Допустимая разница +/- 1 °C.",
        "Дверь была открыта, закрыли, проверили через 1 час.",
        "Оборудование выключено.",
        "Оборудование сломано. Вызван в службу технического обслуживания.",
        "Продукты были возвращены на место.",
        "Продукты следует выбросить.",
    ],
    "coffee-3": [
        "Проверить маркировку повторно и исправить некорректные стикеры.",
        "Отложить партию в карантин до решения ответственного.",
        "Сделать фото-фиксацию и уведомить сменного менеджера.",
    ],
    "coffee-4": [
        "Повторить заявку с уточнением симптомов и приоритетом.",
        "Перевести задачу на резервное оборудование до устранения проблемы.",
        "Эскалировать в техслужбу и уведомить ответственного по смене.",
    ],
    "bakery-3": [
        "Оборудование выключено.",
        "Оборудование сломано. Вызван в службу технического обслуживания.",
        "Погрешность измерения. Проведен контрольный замер.",
        "Дверь была открыта, закрыли, проверили через 1 час.",
        "Продукты были возвращены на место.",
    ],
    "bakery-4": [
        "Сформировать заявку в техслужбу на вентиляцию/осушение помещения.",
        "Повторить заявку с приоритетом и приложить фото состояния зоны.",
        "Эскалировать на сменного менеджера до устранения причины.",
    ],
    "meat-1": [
        "Дверь была открыта, закрыли, проверили через 1 час.",
        "Оборудование сломано. Вызван в службу технического обслуживания.",
        "Оборудование выключено.",
        "Продукты были возвращены на место.",
        "Продукты следует выбросить.",
    ],
    "meat-3": [
        "Дверь была открыта, закрыли, проверили через 1 час.",
        "Погрешность измерения. Допустимая разница +/- 1 °C.",
        "Оборудование сломано. Вызван в службу технического обслуживания.",
        "Оборудование выключено.",
        "Продукты были возвращены на место.",
        "Продукты следует выбросить.",
    ],
    "meat-4": [
        "Оформить заявку в техслужбу на ремонт/калибровку оборудования.",
        "Перевести контроль на резервное оборудование до устранения проблемы.",
        "Эскалировать ответственному смены и проконтролировать срок выполнения.",
    ],
};

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
                label: "Температура",
                minC: 0,
                maxC: 5,
                showCamera: true,
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
            config: { label: "Температура помещения", minC: 16, maxC: 22 },
        },
    ],
    "bakery-4": [
        {
            id: "def-bakery-4-ticket",
            fieldType: "ticket",
            config: {
                description: "Оформить заявку на проверку вентиляции и влажности в выбранных помещениях.",
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
            config: { label: "Температура", minC: -21, maxC: -17 },
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
            config: { label: "Температура", minC: 0, maxC: 4 },
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
