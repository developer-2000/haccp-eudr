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
 * Ниша группы оборудования относительно табов чек-листа (`coffee` | `bakery` | `meat`).
 * `different` — общие группы, показываются при создании задачи в любой нише.
 *
 * @typedef {'meat'|'bread'|'coffee'|'different'} EquipmentGroupTypeEquipment
 */

/**
 * Группы и элементы «Предмета задачи» для типа «Оборудование».
 * Используются в чекбоксах выбора оборудования в модалке добавления задачи.
 *
 * У каждой группы поле **`typeEquipment`** — рядом с **`groupTitle`**, не на элементах `items`.
 */
export const EQUIPMENT_GROUPS = [
    // Кофе: обжарка (задачи с температурой по режиму roasting).
    {
        groupTitle: "Кофе — обжарка",
        typeEquipment: "coffee",
        items: [
            {
                id: "eq-coffee-roaster",
                label:
                    "Ростер (жаровня) — барабанный/воздушный 1–30 кг, нагрев до 230°C, лопастное перемешивание",
            },
            {
                id: "eq-coffee-destoner",
                label: "Дестонер — отделяет камни и мусор после обжарки",
            },
        ],
    },
    // Кофе: охлаждение зерна после обжарки (режим cooling).
    {
        groupTitle: "Кофе — охлаждение",
        typeEquipment: "coffee",
        items: [
            {
                id: "eq-coffee-bean-cooler",
                label:
                    "Кулер (охладитель зёрен) — вентилятор + сито; с 230°C до ~25°C за 5–10 мин",
            },
            {
                id: "eq-coffee-shock-cooler",
                label:
                    "Шок-кулер — крупные партии (конвейер + воздух −20°C)",
            },
        ],
    },
    // Кофе: хранение зерна (режим storage).
    {
        groupTitle: "Кофе — хранение",
        typeEquipment: "coffee",
        items: [
            {
                id: "eq-coffee-vacuum-containers",
                label:
                    "Вакуумные контейнеры — Coffee Gator/Airscape, герметичность + дегазация CO₂",
            },
            {
                id: "eq-coffee-warehouse-shelving",
                label:
                    "Складские стеллажи — климат-контроль 15–25°C, влажность <60%",
            },
            {
                id: "eq-coffee-grain-canisters",
                label:
                    "Канистры зерновые — нержавейка/пластик с клапаном (Tightvac)",
            },
        ],
    },
    // Хлеб/тесто: опарка и замес (режим sponge_mix).
    {
        groupTitle: "Хлеб/тесто — опарка и замес",
        typeEquipment: "bread",
        items: [
            {
                id: "eq-bread-spiral-mixer",
                label:
                    "Тестомес (спиральный / тестомесильная машина) — замес опары/теста 28–32°C, контроль воды/муки",
            },
            {
                id: "eq-bread-preferment-vat",
                label:
                    "Опарный чан — брожение опары (крышка герметичная)",
            },
        ],
    },
    // Хлеб/тесто: расстойка (режим proofing).
    {
        groupTitle: "Хлеб/тесто — расстойка",
        typeEquipment: "bread",
        items: [
            {
                id: "eq-bread-proofing-cabinet",
                label:
                    "Расстоечный шкаф — 32–40°C, влажность 75–85%, подъём теста",
            },
            {
                id: "eq-bread-proofing-trays",
                label:
                    "Расстоечные лотки — сетчатые противни для циркуляции воздуха",
            },
        ],
    },
    // Хлеб/тесто: выпечка (режим baking).
    {
        groupTitle: "Хлеб/тесто — выпечка",
        typeEquipment: "bread",
        items: [
            {
                id: "eq-bread-rotary-oven",
                label:
                    "Ротационная печь — 200–250°C корпус; сердцевина хлеба 95–100°C",
            },
            {
                id: "eq-bread-crumb-probe",
                label:
                    "Термометр сердцевины — контроль 95°C внутри буханки (HACCP CCP)",
            },
        ],
    },
    // Хлеб/тесто: охлаждение (режим cooling).
    {
        groupTitle: "Хлеб/тесто — охлаждение",
        typeEquipment: "bread",
        items: [
            {
                id: "eq-bread-cooling-conveyor",
                label:
                    "Конвейер охлаждения — с ~95°C до ~25°C за ~2 ч (без конденсата)",
            },
            {
                id: "eq-bread-ventilated-racks",
                label:
                    "Вентиляционные стеллажи — период охлаждения (сетка снизу)",
            },
        ],
    },
    // Мясо — охлаждённое хранение (+0…+8 °C), HACCP.
    {
        groupTitle: "Мясо — охлаждённое хранение (+0…+8 °C)",
        typeEquipment: "meat",
        items: [
            {
                id: "eq-meat-chilled-room",
                label:
                    "Холодильная камера (+0…+4 °C) — основное хранение",
            },
            {
                id: "eq-meat-chilled-cabinet",
                label:
                    "Холодильный шкаф (0…+7 °C) — цех/прилавок",
            },
            {
                id: "eq-meat-chilled-display",
                label:
                    "Холодильный прилавок/витрина (+2…+5 °C) — продажа",
            },
            {
                id: "eq-meat-chilled-semi-finished",
                label:
                    "Камера охлаждения полуфабрикатов (+0…+2 °C)",
            },
        ],
    },
    // Мясо — заморозка (< 0 °C), HACCP.
    {
        groupTitle: "Мясо — заморозка (−40…−12 °C)",
        typeEquipment: "meat",
        items: [
            {
                id: "eq-meat-freezer-room",
                label:
                    "Морозильная камера (−18…−25 °C) — длительное хранение",
            },
            {
                id: "eq-meat-shock-freezer",
                label:
                    "Шоковая заморозка (−30…−40 °C) — свежая продукция",
            },
            {
                id: "eq-meat-freezer-cabinet",
                label:
                    "Морозильный шкаф (−12…−18 °C) — цех",
            },
            {
                id: "eq-meat-deep-freezer",
                label:
                    "Глубокая заморозка (−25 °C и ниже) — премиум",
            },
        ],
    },
    // Группа термообработки и приготовления.
    {
        groupTitle: "Приготовление и термообработка",
        typeEquipment: "different",
        // Оборудование этапа приготовления.
        items: [
            { id: "eq-stove", label: "Плита" },
            { id: "eq-combi-oven", label: "Комбинированная печь" },
            { id: "eq-fryer", label: "Фритюрница" },
        ],
    },
    // Группа холодовой цепочки и хранения.
    {
        groupTitle: "Холод и хранение",
        typeEquipment: "different",
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
        typeEquipment: "different",
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
        typeEquipment: "different",
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
        typeEquipment: "different",
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
        typeEquipment: "different",
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

/**
 * Таб чек-листа (`ChecklistsSection`): `coffee` | `bakery` | `meat` → тип группы оборудования.
 * Пекарня в данных — `bakery`, в группах — `bread`.
 *
 * @param {string|null|undefined} checklistNiche
 * @returns {EquipmentGroupTypeEquipment}
 */
export function checklistNicheToEquipmentGroupType(checklistNiche) {
    const n = String(checklistNiche ?? "").trim();
    if (n === "bakery") {
        return "bread";
    }
    if (n === "coffee" || n === "meat") {
        return n;
    }
    return "different";
}

/**
 * Группы оборудования для модалки создания задачи: нишевая выборка + общие (`different`).
 *
 * @param {string|null|undefined} checklistNiche
 * @returns {typeof EQUIPMENT_GROUPS}
 */
export function equipmentGroupsForChecklistNiche(checklistNiche) {
    const want = checklistNicheToEquipmentGroupType(checklistNiche);
    return EQUIPMENT_GROUPS.filter(
        (g) =>
            g.typeEquipment === want || g.typeEquipment === "different",
    );
}
