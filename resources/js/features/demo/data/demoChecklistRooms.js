/**
 * Mock-справочник помещений и зон для конструктора задачи «тип: комнаты».
 * Стабильные id — латиница; подписи — для UI.
 */

export const ROOM_GROUPS = [
    {
        groupTitle: "Производство и технология",
        items: [
            { id: "room-production-hall", label: "Производственный цех" },
            { id: "room-shock-freezer", label: "Камера шоковой заморозки" },
            {
                id: "room-glazing",
                label: "Зона глазирования / финиша",
            },
        ],
    },
    {
        groupTitle: "Склады и приёмка",
        items: [
            { id: "room-raw-storage", label: "Склад сырья" },
            { id: "room-finished-storage", label: "Склад готовой продукции" },
            { id: "room-receiving", label: "Зона приёмки" },
            { id: "room-cold-chamber", label: "Холодная камера (помещение)" },
            { id: "room-waste", label: "Зона отходов" },
        ],
    },
    {
        groupTitle: "Санитария и персонал",
        items: [
            { id: "room-wash", label: "Моечная" },
            { id: "room-wc-staff", label: "Санузел персонала" },
            { id: "room-locker", label: "Раздевалка" },
        ],
    },
    {
        groupTitle: "Инфраструктура",
        items: [
            { id: "room-corridor", label: "Коридор" },
            { id: "room-office-qc", label: "Офис / пост контроля качества" },
        ],
    },
];

const KNOWN_ROOM_IDS = new Set(
    ROOM_GROUPS.flatMap((g) => g.items.map((it) => it.id)),
);

const LABEL_BY_ROOM_ID = new Map(
    ROOM_GROUPS.flatMap((g) => g.items.map((it) => [it.id, it.label])),
);

/**
 * Оставляет только известные id помещений, без дубликатов.
 * Используется при сохранении задачи и на карточке.
 */
export const normalizeRoomTargetIds = (raw) => {
    if (!Array.isArray(raw)) {
        return [];
    }
    const seen = new Set();
    const out = [];
    for (const x of raw) {
        const id = typeof x === "string" ? x.trim() : "";
        if (!id || !KNOWN_ROOM_IDS.has(id) || seen.has(id)) {
            continue;
        }
        seen.add(id);
        out.push(id);
    }
    return out;
};

/**
 * Краткая строка для карточки CCP по выбранным помещениям.
 * Используется в строке «Используется для».
 */
export const roomTargetsSummary = (ids) => {
    const list = normalizeRoomTargetIds(ids);
    if (!list.length) {
        return "";
    }
    if (list.length <= 2) {
        return list.map((id) => LABEL_BY_ROOM_ID.get(id) ?? id).join(", ");
    }
    return `${list.length} выбрано`;
};
