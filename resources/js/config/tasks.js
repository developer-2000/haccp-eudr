/**
 * Конфигурация панелей и прочего для задач
 */

/**
 * Коды типов полей секции «Суть задачи».
 * Используются в данных задачи (`taskFieldDefinitions`) и в UI-условиях.
 */
export const TASK_FIELD_TYPE = {
    TEMPERATURE: "temperature",
    SINGLE_CHOICE: "single_choice",
    TICKET: "ticket",
};

/**
 * Опции селекта для выбора типа поля в секции «Суть задачи».
 */
export const TASK_FIELD_TYPE_OPTIONS_BASE = [
    // Тип поля: вопрос с одним вариантом ответа
    { label: "Выберите один ответ", value: TASK_FIELD_TYPE.SINGLE_CHOICE },
    // Тип поля: разовая заявка
    { label: "Создать заявку", value: TASK_FIELD_TYPE.TICKET },
];

/**
 * Опции селекта для типа задачи «Оборудование».
 */
export const TASK_FIELD_TYPE_OPTIONS_EQUIPMENT = [
    // Тип поля: ввод температуры (диапазон в °C)
    { label: "Введите температуру", value: TASK_FIELD_TYPE.TEMPERATURE },
    ...TASK_FIELD_TYPE_OPTIONS_BASE,
];

/**
 * Полный набор опций (сохраняем для обратной совместимости импорта).
 */
export const TASK_FIELD_TYPE_OPTIONS = TASK_FIELD_TYPE_OPTIONS_EQUIPMENT;

/**
 * Собирает опции селекта «Суть задачи» по выбранному типу задачи.
 * Для rooms доступны только single_choice и ticket; для остальных — полный набор.
 */
export const taskFieldTypeOptionsByScopeType = (taskScopeType) =>
    taskScopeType === "rooms"
        ? TASK_FIELD_TYPE_OPTIONS_BASE
        : TASK_FIELD_TYPE_OPTIONS_EQUIPMENT;

/**
 * Группы и элементы «Предмета задачи» для типа «Оборудование».
 * Используются в чекбоксах выбора оборудования в модалке добавления задачи.
 */
export const EQUIPMENT_GROUPS = [
    // Группа термообработки и приготовления.
    {
        groupTitle: "Приготовление и термообработка",
        // Оборудование этапа приготовления.
        items: [
            { id: "eq-stove", label: "Плита" },
            { id: "eq-combi-oven", label: "Комбинированная печь" },
            { id: "eq-fryer", label: "Фритюрница" },
            { id: "eq-immersion-circ", label: "Погружной циркулятор" },
            { id: "eq-bain-marie", label: "Бейн Мари" },
            { id: "eq-juicer", label: "Соковыжималка" },
            { id: "eq-coffee-machine", label: "Кофемашина" },
        ],
    },
    // Группа холодовой цепочки и хранения.
    {
        groupTitle: "Холод и хранение",
        // Холодильное и складское оборудование.
        items: [
            { id: "eq-fridge-1", label: "Холодильник 1" },
            { id: "eq-fridge-2", label: "Холодильник 2" },
            { id: "eq-freezer", label: "Морозильная камера" },
            { id: "eq-cold-storage", label: "Холодное хранилище" },
            { id: "eq-frozen-storage", label: "Замороженное хранилище" },
            { id: "eq-cold-display", label: "Холодная витрина" },
            { id: "eq-dry-goods", label: "Хранение сухих товаров" },
            { id: "eq-vacuum-packer", label: "Вакуумная упаковочная машина" },
            { id: "eq-ice-maker", label: "Льдогенератор" },
        ],
    },
    // Группа измерительного и контрольного инвентаря.
    {
        groupTitle: "Контроль и измерения",
        // Средства измерения и контроля.
        items: [
            { id: "eq-probe-1", label: "Зондовый термометр 1" },
            { id: "eq-probe-2", label: "Зондовый термометр 2" },
            { id: "eq-scale", label: "Шкала" },
        ],
    },
    // Группа контактных поверхностей и зон.
    {
        groupTitle: "Поверхности и зоны контакта",
        // Поверхности, требующие регулярного контроля/санобработки.
        items: [
            { id: "eq-countertop", label: "Столешницы" },
            { id: "eq-cutting-boards", label: "Разделочные доски" },
            { id: "eq-door-handles", label: "Дверные ручки" },
            { id: "eq-switches", label: "Переключатели" },
            { id: "eq-windows", label: "Стеклянные окна" },
            { id: "eq-ceiling", label: "Потолок" },
            { id: "eq-floors", label: "Полы" },
            { id: "eq-tables", label: "Таблицы" },
            { id: "eq-toilet", label: "Туалет" },
        ],
    },
    // Группа мойки и санитарной инфраструктуры.
    {
        groupTitle: "Мойка и санитария",
        // Оборудование и инвентарь для санитарных процедур.
        items: [
            { id: "eq-sinks", label: "Раковины" },
            { id: "eq-handwash", label: "Станция для мытья рук" },
            { id: "eq-dishwasher", label: "Посудомоечная машина" },
            { id: "eq-pre-rinse", label: "Предварительное мытье душа" },
            { id: "eq-dishes", label: "Посуда" },
            {
                id: "eq-cutlery-containers",
                label: "Контейнеры для столовых приборов",
            },
        ],
    },
    // Группа логистики и вспомогательных средств.
    {
        groupTitle: "Логистика и вспомогательное",
        // Вспомогательные объекты для хранения, перемещения и уборки.
        items: [
            { id: "eq-transport-box", label: "Транспортировочный ящик" },
            { id: "eq-trolley", label: "Трамвай (тележка подачи)" },
            { id: "eq-trash-bins", label: "Мусорные баки" },
            { id: "eq-wall-shelf", label: "Настенная полка" },
            {
                id: "eq-cleaning-cabinet",
                label: "Шкаф для уборочного оборудования",
            },
        ],
    },
];
