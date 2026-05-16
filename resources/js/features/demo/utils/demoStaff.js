import { DEFAULT_TASK_ASSIGNEE_IDS } from '@/features/demo/data/demoPersonnel';

/**
 * Соответствие ниши демо чек-листа и площадки `sites` (для фильтра персонала по задаче).
 */
export const NICHE_TO_SITE_ID = {
    coffee: 'site-coffee',
    bakery: 'site-bakery',
    meat: 'site-meat',
};

/**
 * Возвращает id сотрудника, если он активен и привязан к площадке данной ниши; иначе null.
 * Используется формой «Добавить CCP» перед записью `assignedStaffId` в задачу.
 */
export const resolveAssigneeIdForNiche = (staff, niche, staffId) => {
    if (!Array.isArray(staff)) {
        return null;
    }
    const sid = staffId == null ? '' : String(staffId).trim();
    if (!sid) {
        return null;
    }
    const siteId = NICHE_TO_SITE_ID[niche];
    if (!siteId) {
        return null;
    }
    const m = staff.find((s) => s && s.id === sid && s.siteId === siteId && s.active !== false);
    return m ? m.id : null;
};

/**
 * Возвращает фамилию (первое слово ФИО) для компактной подписи на карточке CCP.
 * Используется в списках чек-листа и дашборде.
 *
 * @param {string | undefined} fullName
 * @returns {string}
 */
export const formatStaffSurname = (fullName) => {
    if (typeof fullName !== 'string' || !fullName.trim()) {
        return '';
    }
    const [first] = fullName.trim().split(/\s+/);
    return first ?? '';
};

/**
 * Полное ФИО сотрудника по id для отчётов и публичной выгрузки (инспекция / след аудита).
 *
 * @param {unknown} staff
 * @param {string | null | undefined} staffId
 * @returns {string}
 */
export const resolveStaffFullName = (staff, staffId) => {
    if (!staffId || !Array.isArray(staff)) {
        return '—';
    }
    const m = staff.find((s) => s && s.id === staffId);
    if (typeof m?.fullName === 'string' && m.fullName.trim()) {
        return m.fullName.trim();
    }
    return '—';
};

/**
 * @typedef {{ id: string, name: string, address?: string }} DemoSite
 */

/**
 * @typedef {{
 *   id: string,
 *   siteId: string,
 *   fullName: string,
 *   role: string,
 *   phone?: string,
 *   email?: string,
 *   active: boolean
 * }} DemoStaffMember
 */

/**
 * Добавляет поле assignedStaffId к задачам чек-листов по карте дефолтов.
 * Используется в createDefaultState для единообразного назначения ответственных.
 *
 * @param {Record<string, Array<Record<string, unknown>>>} checklistsByNiche
 * @param {Record<string, string>} taskIdToStaffId
 * @returns {Record<string, unknown[]>}
 */
export const applyDefaultAssigneesToChecklists = (
    checklistsByNiche,
    taskIdToStaffId = DEFAULT_TASK_ASSIGNEE_IDS,
) => {
    return Object.fromEntries(
        Object.entries(checklistsByNiche).map(([niche, tasks]) => [
            niche,
            tasks.map((task) => ({
                ...task,
                assignedStaffId: taskIdToStaffId[task.id] ?? null,
            })),
        ]),
    );
};

/**
 * Объединяет сохранённые площадки с актуальными дефолтами по id (новые поля из кода подмешиваются).
 * Используется при загрузке state из localStorage для миграции схемы.
 *
 * @param {DemoSite[]} defaultSites
 * @param {unknown} storedSites
 * @returns {DemoSite[]}
 */
export const mergeSitesWithDefaults = (defaultSites, storedSites) => {
    if (!Array.isArray(storedSites) || storedSites.length === 0) {
        return defaultSites.map((s) => ({ ...s }));
    }
    /** @type {Map<string, DemoSite>} */
    const byId = new Map(defaultSites.map((s) => [s.id, { ...s }]));
    for (const raw of storedSites) {
        if (!raw || typeof raw !== 'object' || typeof raw.id !== 'string') {
            continue;
        }
        const cur = byId.get(raw.id);
        if (cur) {
            Object.assign(cur, raw);
        } else {
            byId.set(raw.id, /** @type {DemoSite} */ (raw));
        }
    }
    const orderIds = [
        ...new Set([
            ...defaultSites.map((s) => s.id),
            ...storedSites.map((s) => s?.id).filter(Boolean),
        ]),
    ];
    return orderIds.map((id) => byId.get(id)).filter(Boolean);
};

/**
 * Объединяет сохранённый персонал с дефолтами; записи с неизвестным id сохраняются (пользовательский CRUD в будущем).
 * Используется при загрузке state из localStorage.
 *
 * @param {DemoStaffMember[]} defaultStaff
 * @param {unknown} storedStaff
 * @returns {DemoStaffMember[]}
 */
export const mergeStaffWithDefaults = (defaultStaff, storedStaff) => {
    if (!Array.isArray(storedStaff) || storedStaff.length === 0) {
        return defaultStaff.map((s) => ({ ...s }));
    }
    /** @type {Map<string, DemoStaffMember>} */
    const byId = new Map(defaultStaff.map((s) => [s.id, { ...s }]));
    for (const raw of storedStaff) {
        if (!raw || typeof raw !== 'object' || typeof raw.id !== 'string') {
            continue;
        }
        const cur = byId.get(raw.id);
        if (cur) {
            Object.assign(cur, raw);
        } else {
            byId.set(raw.id, /** @type {DemoStaffMember} */ (raw));
        }
    }
    const orderIds = [
        ...new Set([
            ...defaultStaff.map((s) => s.id),
            ...storedStaff.map((s) => s?.id).filter(Boolean),
        ]),
    ];
    return orderIds.map((id) => byId.get(id)).filter(Boolean);
};

/**
 * Проверяет assignedStaffId у задач: убирает битые id и подставляет дефолт, если он ещё валиден.
 * Используется после merge персонала и чек-листов.
 *
 * @param {Record<string, unknown[]>} checklistsByNiche
 * @param {DemoStaffMember[]} staff
 * @param {Record<string, string>} [defaultByTaskId]
 * @returns {Record<string, unknown[]>}
 */
/**
 * Снимает ответственного с задач, где был указан удаляемый сотрудник.
 * Используется при удалении записи из справочника `staff`.
 *
 * @param {Record<string, unknown[]>} checklistsByNiche
 * @param {string} removedStaffId
 * @returns {Record<string, unknown[]>}
 */
export const clearAssigneeInChecklists = (checklistsByNiche, removedStaffId) => {
    return Object.fromEntries(
        Object.entries(checklistsByNiche).map(([niche, tasks]) => [
            niche,
            tasks.map((task) => {
                if (!task || typeof task !== 'object') {
                    return task;
                }
                if (task.assignedStaffId === removedStaffId) {
                    return { ...task, assignedStaffId: null };
                }
                return task;
            }),
        ]),
    );
};

export const sanitizeTaskAssignees = (
    checklistsByNiche,
    staff,
    defaultByTaskId = DEFAULT_TASK_ASSIGNEE_IDS,
) => {
    const valid = new Set(staff.filter((m) => m && m.active !== false).map((m) => m.id));
    return Object.fromEntries(
        Object.entries(checklistsByNiche).map(([niche, tasks]) => [
            niche,
            tasks.map((task) => {
                if (!task || typeof task !== 'object') {
                    return task;
                }
                let id = 'assignedStaffId' in task ? task.assignedStaffId : null;
                if (id != null && !valid.has(id)) {
                    id = null;
                }
                if (id == null && defaultByTaskId[task.id]) {
                    const fallback = defaultByTaskId[task.id];
                    if (valid.has(fallback)) {
                        id = fallback;
                    }
                }
                return { ...task, assignedStaffId: id ?? null };
            }),
        ]),
    );
};
