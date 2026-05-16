/**
 * Mock-справочник помещений и зон для конструктора задачи.
 */
import { i18n } from '@/i18n';
const tt = (...args) => i18n.global.t(...args);

const ROOM_STRUCTURE = [
    {
        groupKey: 'group_production',
        items: [
            { id: 'room-production-hall', labelKey: 'room_production_hall' },
            { id: 'room-shock-freezer', labelKey: 'room_shock_freezer' },
            { id: 'room-glazing', labelKey: 'room_glazing_zone' },
        ],
    },
    {
        groupKey: 'group_storage',
        items: [
            { id: 'room-raw-storage', labelKey: 'room_raw_storage' },
            { id: 'room-finished-storage', labelKey: 'room_finished_storage' },
            { id: 'room-receiving', labelKey: 'room_receiving' },
            { id: 'room-cold-chamber', labelKey: 'room_cold_chamber' },
            { id: 'room-waste', labelKey: 'room_waste' },
        ],
    },
    {
        groupKey: 'group_sanitation',
        items: [
            { id: 'room-wash', labelKey: 'room_wash' },
            { id: 'room-wc-staff', labelKey: 'room_wc_staff' },
            { id: 'room-locker', labelKey: 'room_locker' },
        ],
    },
    {
        groupKey: 'group_infrastructure',
        items: [
            { id: 'room-corridor', labelKey: 'room_corridor' },
            { id: 'room-office-qc', labelKey: 'room_office_qc' },
        ],
    },
];

/**
 * Возвращает группы помещений с переведёнными подписями.
 * Вызывается при каждом обращении, чтобы i18n был готов и локаль актуальна.
 */
export function getRoomGroups() {
    return ROOM_STRUCTURE.map((g) => ({
        groupTitle: tt(`demo.rooms.${g.groupKey}`),
        items: g.items.map((it) => ({ id: it.id, label: tt(`demo.rooms.${it.labelKey}`) })),
    }));
}

export const ROOM_GROUPS = getRoomGroups();

const KNOWN_ROOM_IDS = new Set(ROOM_STRUCTURE.flatMap((g) => g.items.map((it) => it.id)));

/**
 * Возвращает переведённый label помещения по id.
 */
function getRoomLabelById(id) {
    for (const g of ROOM_STRUCTURE) {
        const item = g.items.find((it) => it.id === id);
        if (item) return tt(`demo.rooms.${item.labelKey}`);
    }
    return id;
}

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
        const id = typeof x === 'string' ? x.trim() : '';
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
        return '';
    }
    if (list.length <= 2) {
        return list.map((id) => getRoomLabelById(id)).join(', ');
    }
    return tt('demo.rooms.selected_count', { count: list.length });
};
