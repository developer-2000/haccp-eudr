import { normalizeEquipmentTargetIds } from '@/features/demo/data/demoChecklistEquipment';
import { normalizeRoomTargetIds } from '@/features/demo/data/demoChecklistRooms';

const COLD_EQ = new Set([
    'eq-freezer',
    'eq-fridge-1',
    'eq-fridge-2',
    'eq-cold-storage',
    'eq-cold-display',
    'eq-frozen-storage',
    'eq-coffee-bean-cooler',
    'eq-coffee-shock-cooler',
]);

const COLD_ROOMS = new Set(['room-cold-chamber', 'room-shock-freezer']);

/**
 * Fallback типа поля для pending-drawer, если `taskFieldDefinitions` пустой.
 */
export function inferPendingDrawerFieldType(measurement, task) {
    const valueText = String(measurement?.value ?? '');
    if (/мин/i.test(valueText)) {
        return 'timer';
    }
    if (/[°]\s*C|°C|℃/i.test(valueText)) {
        return 'temperature';
    }
    const t = task ?? {};
    const eqIds = normalizeEquipmentTargetIds(t.equipmentTargetIds);
    const roomIds = normalizeRoomTargetIds(t.roomTargetIds);
    if (eqIds.some((id) => COLD_EQ.has(id))) {
        return 'temperature';
    }
    if (roomIds.some((id) => COLD_ROOMS.has(id))) {
        return 'temperature';
    }
    if (/температур|охлажден|холод|камер/i.test(String(t.title ?? ''))) {
        return 'temperature';
    }
    return null;
}

export function buildReportFileNameStamp() {
    const ts = new Date();
    const stamp = `${ts.getFullYear()}-${String(ts.getMonth() + 1).padStart(
        2,
        '0',
    )}-${String(ts.getDate()).padStart(2, '0')}_${String(ts.getHours()).padStart(
        2,
        '0',
    )}${String(ts.getMinutes()).padStart(2, '0')}${String(ts.getSeconds()).padStart(2, '0')}`;
    return `report_${stamp}.pdf`;
}

export function buildPhotoFileNameStamp() {
    const ts = new Date();
    return `${ts.getFullYear()}-${String(ts.getMonth() + 1).padStart(
        2,
        '0',
    )}-${String(ts.getDate()).padStart(2, '0')}_${String(ts.getHours()).padStart(
        2,
        '0',
    )}${String(ts.getMinutes()).padStart(2, '0')}${String(ts.getSeconds()).padStart(2, '0')}`;
}
