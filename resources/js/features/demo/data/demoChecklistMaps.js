import {EQUIPMENT_GROUPS} from "./demoChecklistEquipment";
import {ROOM_GROUPS} from "./demoChecklistRooms";

/**
 * Одна инициализация на модуль — для подписей целей в модалках демо.
 */
export const EQUIPMENT_LABEL_BY_ID = new Map(
    EQUIPMENT_GROUPS.flatMap((g) => g.items.map((it) => [it.id, it.label])),
);

export const ROOM_LABEL_BY_ID = new Map(
    ROOM_GROUPS.flatMap((g) => g.items.map((it) => [it.id, it.label])),
);
