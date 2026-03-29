/**
 * Mock-справочник единиц оборудования для конструктора задачи «тип: оборудование».
 * Стабильные id — латиница; подписи — для UI.
 */
import { EQUIPMENT_GROUPS } from "@/config/tasks";

export { EQUIPMENT_GROUPS };

const KNOWN_EQUIPMENT_IDS = new Set(
    EQUIPMENT_GROUPS.flatMap((g) => g.items.map((it) => it.id)),
);

const LABEL_BY_EQUIPMENT_ID = new Map(
    EQUIPMENT_GROUPS.flatMap((g) => g.items.map((it) => [it.id, it.label])),
);

/**
 * Оставляет только известные id, без дубликатов, в порядке первого вхождения.
 * Используется при сохранении задачи и при отображении карточки.
 */
export const normalizeEquipmentTargetIds = (raw) => {
    if (!Array.isArray(raw)) {
        return [];
    }
    const seen = new Set();
    const out = [];
    for (const x of raw) {
        const id = typeof x === "string" ? x.trim() : "";
        if (!id || !KNOWN_EQUIPMENT_IDS.has(id) || seen.has(id)) {
            continue;
        }
        seen.add(id);
        out.push(id);
    }
    return out;
};

/**
 * Краткая строка для карточки CCP: названия или число выбранных позиций.
 * Используется для строки «Используется для» на карточке.
 */
export const equipmentTargetsSummary = (ids) => {
    const list = normalizeEquipmentTargetIds(ids);
    if (!list.length) {
        return "";
    }
    if (list.length <= 2) {
        return list.map((id) => LABEL_BY_EQUIPMENT_ID.get(id) ?? id).join(", ");
    }
    return `${list.length} выбрано`;
};
