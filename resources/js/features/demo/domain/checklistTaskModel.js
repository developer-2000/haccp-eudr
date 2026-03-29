import { v4 as uuidv4 } from "uuid";
import {
    FREQUENCY_CODE,
    normalizeFrequency,
} from "@/features/demo/data/demoChecklistTaskFrequency";
import { normalizeEquipmentTargetIds } from "@/features/demo/data/demoChecklistEquipment";
import { normalizeRoomTargetIds } from "@/features/demo/data/demoChecklistRooms";
import {
    normalizeTaskScopeType,
    TASK_SCOPE_TYPE,
} from "@/features/demo/data/demoChecklistTaskScope";
import { normalizeTaskFieldDefinitions } from "@/features/demo/data/demoChecklistTaskFields";

export const DEFAULT_TASK_ACTIVE_WEEKDAYS = Object.freeze([
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
]);

export const DEFAULT_TASK_REPEAT_TIMES = Object.freeze(["00:00"]);

/**
 * Число повторов в сутки = число слотов в `measurements` (минимум 1).
 */
export const repeatsPerDayFromMeasurements = (measurements) => {
    const n = Array.isArray(measurements) ? measurements.length : 0;
    return Math.max(1, n);
};

/**
 * Несколько слотов в дне: по длине `measurements` или `repeatTimes`.
 */
export const taskHasMultiSlotSchedule = (task) => {
    const m = task?.measurements?.length ?? 0;
    const r = task?.repeatTimes?.length ?? 0;
    return m > 1 || r > 1;
};

/**
 * В payload при сборке задачи: ветка с готовым массивом замеров из сида (несколько слотов).
 */
export const payloadUsesPresetMeasurementsBranch = (payload) => {
    const m = Array.isArray(payload?.measurements) ? payload.measurements : [];
    return m.length > 1;
};

/**
 * Ключ для CSS/подписей (`ok` | `repeat` | `problem`) по boolean `task.status` и числу слотов.
 * Поддерживает legacy string `ok` | `repeat` | `problem`.
 */
export const taskDisplayStatusKey = (task) => {
    const multi = taskHasMultiSlotSchedule(task);
    const raw = task?.status;
    if (raw === true || raw === "ok") {
        return multi ? "repeat" : "ok";
    }
    if (
        raw === false ||
        raw === "repeat" ||
        raw === "problem" ||
        raw === "pending"
    ) {
        return multi ? "repeat" : "problem";
    }
    return multi ? "repeat" : "ok";
};

/** Типовые «фактические» значения для холодового оборудования (демо). */
const DEMO_COLD_EQ_VALUE = Object.freeze({
    "eq-freezer": "-19 °C",
    "eq-fridge-1": "4,2 °C",
    "eq-fridge-2": "4,1 °C",
    "eq-cold-storage": "3 °C",
    "eq-cold-display": "5 °C",
    "eq-frozen-storage": "-21 °C",
});

const DEMO_HEAT_PROCESS_EQ = new Set([
    "eq-combi-oven",
    "eq-stove",
    "eq-fryer",
    "eq-bain-marie",
    "eq-immersion-circ",
]);

const DEMO_PROBE_EQ = new Set(["eq-probe-1", "eq-probe-2"]);

const DEMO_DRY_STORAGE_EQ = new Set([
    "eq-dry-goods",
    "eq-transport-box",
    "eq-vacuum-packer",
]);

const DEMO_SURFACE_SANITARY_EQ = new Set([
    "eq-countertop",
    "eq-cutting-boards",
    "eq-door-handles",
    "eq-switches",
    "eq-windows",
    "eq-ceiling",
    "eq-floors",
    "eq-tables",
    "eq-toilet",
]);

const DEMO_ADMINISTRATIVE_OK_VALUES = new Set([
    "В сроке",
    "Соответствует",
    "Выполнена",
    "По графику",
    "В норме",
    "Поверхности в норме",
]);

/**
 * Демо: осмысленное значение колонки «Замер» для ok-задачи по названию и целям (оборудование/помещения).
 */
const inferDefaultOkMeasurementDisplayValue = ({
    title,
    equipmentTargetIds = [],
    roomTargetIds = [],
}) => {
    const t = String(title ?? "").toLowerCase();
    const eq = Array.isArray(equipmentTargetIds) ? equipmentTargetIds : [];
    const rooms = Array.isArray(roomTargetIds) ? roomTargetIds : [];

    const firstColdValue = () => {
        for (const id of eq) {
            const v = DEMO_COLD_EQ_VALUE[id];
            if (v) {
                return v;
            }
        }
        return "4 °C";
    };

    if (/влажност/.test(t)) {
        return "58 %";
    }
    if (/тесто/.test(t)) {
        return "90 мин";
    }
    if (/выпечк/.test(t)) {
        return "24 мин";
    }
    if (/срок/.test(t)) {
        return "В сроке";
    }
    if (/маркировк/.test(t)) {
        return "Соответствует";
    }
    if (/чистк/.test(t)) {
        return "Выполнена";
    }
    if (/санобработк|санитар/.test(t)) {
        return "По графику";
    }
    if (/ростер/.test(t)) {
        return "212 °C";
    }
    if (/термощуп/.test(t)) {
        return "72 °C";
    }
    if (/температур|молок|морозил|холодн|охлажден/.test(t)) {
        return firstColdValue();
    }
    if (/хранен|партии/.test(t) && eq.some((id) => DEMO_DRY_STORAGE_EQ.has(id))) {
        return "21 °C";
    }

    for (const id of eq) {
        if (DEMO_COLD_EQ_VALUE[id]) {
            return DEMO_COLD_EQ_VALUE[id];
        }
    }
    if (eq.some((id) => DEMO_PROBE_EQ.has(id))) {
        return "72 °C";
    }
    if (eq.some((id) => DEMO_HEAT_PROCESS_EQ.has(id))) {
        return "185 °C";
    }
    if (eq.includes("eq-coffee-machine")) {
        return "93 °C";
    }
    if (eq.some((id) => DEMO_DRY_STORAGE_EQ.has(id))) {
        return "21 °C";
    }
    if (
        eq.some((id) => DEMO_SURFACE_SANITARY_EQ.has(id)) ||
        ["eq-handwash", "eq-sinks", "eq-dishwasher"].some((id) => eq.includes(id))
    ) {
        return "Поверхности в норме";
    }

    if (
        rooms.includes("room-cold-chamber") &&
        (/охлажден|холодн|камер/.test(t) || eq.length === 0)
    ) {
        return "7 °C";
    }

    return "В норме";
};

/**
 * Возвращает timestamp начала суток для переданной даты.
 * Используется для стабильной инициализации `startDate` в черновике модалки и дефолтных задачах.
 */
export const toStartOfDayTimestamp = (dateLike = new Date()) => {
    const date = new Date(dateLike);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
};

/**
 * Формирует дефолтный черновик формы модалки создания задачи.
 * Используется как единый источник стартовых значений полей модалки.
 */
export const createModalDraft = (_niche, context = {}) => ({
    title: "",
    taskScopeType: TASK_SCOPE_TYPE.EQUIPMENT,
    assignedStaffId: null,
    frequency: FREQUENCY_CODE.CUSTOM,
    startDate:
        typeof context.startDate === "number"
            ? context.startDate
            : toStartOfDayTimestamp(),
    repeatTimes: [...DEFAULT_TASK_REPEAT_TIMES],
    activeWeekdays: [...DEFAULT_TASK_ACTIVE_WEEKDAYS],
    equipmentTargetIds: [],
    roomTargetIds: [],
    taskFieldDefinitions: [],
    correctiveActionRows: [],
    allowAssigneeReportCorrections: true,
});

const toTimeString = (minutesTotal) => {
    const hours = Math.floor(minutesTotal / 60);
    const minutes = minutesTotal % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const buildRepeatTimesByCount = (count) => {
    const n = Number.isFinite(count) ? Math.max(1, Math.trunc(count)) : 1;
    return Array.from({ length: n }, (_, idx) => {
        const minutes = Math.floor((1440 * idx) / n);
        return toTimeString(minutes);
    });
};

/**
 * Приводит строку к безопасной форме для идентификатора.
 * Используется при генерации fallback-id для дефолтных задач.
 */
const toIdToken = (value) =>
    String(value ?? "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

/**
 * Возвращает id задачи по единому правилу для default и custom источников.
 * Используется в `buildTaskFromPayload`, чтобы не расходились правила формирования id.
 */
const resolveTaskId = ({ niche, payload, source, idFactory, context = {} }) => {
    if (source !== "default") {
        return typeof idFactory === "function"
            ? idFactory(niche)
            : `custom-${niche}-${uuidv4()}`;
    }
    const rawId = String(payload?.id ?? "").trim();
    if (rawId) {
        return rawId;
    }
    const titleToken = toIdToken(payload?.title);
    const fallbackToken = titleToken || "task";
    const indexSuffix = Number.isInteger(context.index)
        ? `-${context.index + 1}`
        : "";
    return `default-${niche}-${fallbackToken}${indexSuffix}`;
};

/**
 * Возвращает title задачи по единому правилу для default и custom источников.
 * Используется в `buildTaskFromPayload`, чтобы заголовок формировался синхронно.
 */
const resolveTaskTitle = ({ payload, source, context = {} }) => {
    const directTitle = String(payload?.title ?? "").trim();
    if (directTitle) {
        return directTitle;
    }
    if (source !== "default") {
        return "";
    }
    const fallbackValue = String(payload?.value ?? "").trim();
    if (fallbackValue) {
        return `Задача: ${fallbackValue}`;
    }
    const indexSuffix = Number.isInteger(context.index)
        ? ` #${context.index + 1}`
        : "";
    return `Задача по умолчанию${indexSuffix}`;
};

/**
 * Первый слот со статусом `pending` в `measurements` или null.
 */
export const firstPendingMeasurement = (task) => {
    const list = Array.isArray(task?.measurements) ? task.measurements : [];
    const pend = list.find((m) => m?.status === "pending");
    return pend ?? null;
};

/**
 * Время первого слота со статусом `pending` в `measurements` (подпись на карточке / hot row).
 * Если pending нет — пустая строка.
 */
export const firstPendingMeasurementTime = (task) => {
    const pend = firstPendingMeasurement(task);
    const t = pend?.time;
    return typeof t === "string" && t.trim() ? t.trim() : "";
};

const MEASUREMENT_TIME_HH_MM_RE = /^\d{2}:\d{2}$/;

const timeStringToMinutesOfDay = (time) => {
    const t = String(time ?? "").trim();
    if (!MEASUREMENT_TIME_HH_MM_RE.test(t)) {
        return null;
    }
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
};

/**
 * Локальные суточные минуты от 00:00 (часы клиента).
 */
export const currentLocalMinutesOfDay = () => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
};

/**
 * Слот для верхней таблицы «Детали задачи»: с начала массива первый замер с `time` ≥ текущего;
 * если такого нет — последний элемент `measurements`.
 */
export const selectMeasurementSlotByCurrentTime = (
    measurements,
    nowMinutesOfDay = null,
) => {
    const list = Array.isArray(measurements) ? measurements : [];
    if (!list.length) {
        return null;
    }
    const now =
        typeof nowMinutesOfDay === "number" && Number.isFinite(nowMinutesOfDay)
            ? nowMinutesOfDay
            : currentLocalMinutesOfDay();
    for (const m of list) {
        const mins = timeStringToMinutesOfDay(m?.time);
        if (mins === null) {
            continue;
        }
        if (mins >= now) {
            return m;
        }
    }
    return list[list.length - 1];
};

/**
 * Агрегат задачи в норме или нет: `true` / `false`.
 * Legacy: строки `ok` → true, `repeat` / `problem` → false.
 */
const resolveTaskAggregateOk = ({ payload, source }) => {
    const raw = payload?.status;
    if (raw === true) {
        return true;
    }
    if (raw === false) {
        return false;
    }
    if (raw === "ok") {
        return true;
    }
    if (raw === "repeat" || raw === "problem" || raw === "pending") {
        return false;
    }
    if (source === "default") {
        return true;
    }
    return true;
};

/**
 * Возвращает признак custom-задачи по единому правилу для default и custom источников.
 * Используется в `buildTaskFromPayload`, чтобы метка происхождения не вычислялась в UI.
 */
const resolveTaskIsCustom = ({ source }) => source !== "default";

/**
 * Возвращает taskScopeType по единому правилу для default и custom источников.
 * Используется в `buildTaskFromPayload`, чтобы тип охвата всегда проходил одинаковую нормализацию.
 */
const resolveTaskScopeType = ({ payload }) =>
    normalizeTaskScopeType(payload?.taskScopeType);

/**
 * Возвращает assignedStaffId по единому правилу для default и custom источников.
 * Используется в `buildTaskFromPayload`, чтобы id ответственного всегда приводился к `string | null`.
 */
const resolveTaskAssignedStaffId = ({ payload }) => {
    const raw = payload?.assignedStaffId;
    return typeof raw === "string" && raw.trim() ? raw.trim() : null;
};

/**
 * Возвращает frequency по единому правилу для default и custom источников.
 * Используется в `buildTaskFromPayload`, чтобы код частоты всегда проходил одинаковую нормализацию.
 */
const resolveTaskFrequency = ({ payload }) => normalizeFrequency(payload?.frequency);

/**
 * Возвращает startDate по единому правилу для default и custom источников.
 * Используется в `buildTaskFromPayload`, чтобы дата старта всегда приводилась к `number | null`.
 */
const resolveTaskStartDate = ({ payload }) => {
    const raw = payload?.startDate;
    return typeof raw === "number" && Number.isFinite(raw) ? raw : null;
};

/**
 * Возвращает repeatTimes по единому правилу для default и custom источников.
 * `slotCount` — целевое число слотов (как у `measurements.length`).
 */
const resolveTaskRepeatTimes = ({ payload, slotCount }) => {
    const n = Number.isFinite(slotCount) ? Math.max(1, Math.trunc(slotCount)) : 1;
    const prepared = (Array.isArray(payload?.repeatTimes) ? payload.repeatTimes : [])
        .map((time) => String(time ?? "").trim())
        .filter((time) => /^\d{2}:\d{2}$/.test(time))
        .slice(0, n);
    const generated = buildRepeatTimesByCount(n);
    while (prepared.length < n) {
        prepared.push(generated[prepared.length]);
    }
    return prepared;
};

/**
 * Возвращает activeWeekdays по единому правилу для default и custom источников.
 * Используется в `buildTaskFromPayload`, чтобы дни недели были валидными и без дубликатов.
 */
const resolveTaskActiveWeekdays = ({ payload }) => {
    const raw = Array.isArray(payload?.activeWeekdays)
        ? payload.activeWeekdays
        : [];
    const filtered = raw.filter((value) =>
        ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].includes(value),
    );
    return filtered.length
        ? Array.from(new Set(filtered))
        : [...DEFAULT_TASK_ACTIVE_WEEKDAYS];
};

/**
 * Возвращает allowAssigneeReportCorrections по единому правилу для default и custom источников.
 * Используется в `buildTaskFromPayload`, чтобы флаг всегда хранился как boolean.
 */
const resolveTaskAllowAssigneeReportCorrections = ({ payload }) =>
    Boolean(payload?.allowAssigneeReportCorrections);

/**
 * Возвращает taskFieldDefinitions по единому правилу для default и custom источников.
 * Используется в `buildTaskFromPayload`, чтобы конфигурация полей всегда проходила нормализацию.
 */
const resolveTaskFieldDefinitions = ({ payload }) =>
    normalizeTaskFieldDefinitions(payload?.taskFieldDefinitions);

/**
 * Возвращает equipmentTargetIds по единому правилу для default и custom источников.
 * Используется в `buildTaskFromPayload`, чтобы поле существовало только для `taskScopeType: equipment`.
 */
const resolveTaskEquipmentTargetIds = ({ payload, taskScopeType }) => {
    if (taskScopeType !== TASK_SCOPE_TYPE.EQUIPMENT) {
        return null;
    }
    return normalizeEquipmentTargetIds(payload?.equipmentTargetIds);
};

/**
 * Возвращает roomTargetIds по единому правилу для default и custom источников.
 * Используется в `buildTaskFromPayload`, чтобы поле существовало только для `taskScopeType: rooms`.
 */
const resolveTaskRoomTargetIds = ({ payload, taskScopeType }) => {
    if (taskScopeType !== TASK_SCOPE_TYPE.ROOMS) {
        return null;
    }
    return normalizeRoomTargetIds(payload?.roomTargetIds);
};

/**
 * Возвращает scope по единому правилу для default и custom источников.
 * Используется в `buildTaskFromPayload`, чтобы поле существовало только для `taskScopeType: standalone`.
 */
const resolveTaskScope = ({ taskScopeType }) =>
    taskScopeType === TASK_SCOPE_TYPE.STANDALONE ? "standalone" : null;

/**
 * Замеры из payload для ветки предзаполненных многослотовых задач (сид).
 */
const readPresetMeasurementsPayload = (payload) =>
    Array.isArray(payload?.measurements) ? payload.measurements : [];

const REPEAT_MEASUREMENT_TIME_RE = /^\d{2}:\d{2}$/;

/**
 * Слоты замеров для дефолтной задачи без статуса repeat: тот же shape, что у repeat (`time`, `value`, `status`).
 * Статусы слотов согласованы со статусом задачи, чтобы не создавать ложных pending при `ok`.
 */
const buildDefaultNonRepeatMeasurementsFromRepeatTimes = (
    repeatTimes,
    aggregateOk,
    measurementHintCtx,
) => {
    const list = Array.isArray(repeatTimes) ? repeatTimes : [];
    const slotStatus = aggregateOk ? "success" : "problem";
    const value = aggregateOk
        ? inferDefaultOkMeasurementDisplayValue(measurementHintCtx)
        : "-";
    return list.map((time) => ({
        time: String(time ?? "").trim() || "00:00",
        value,
        status: slotStatus,
    }));
};

/**
 * Строит строки замеров по слотам repeatTimes для кастомной задачи (статус не repeat).
 * В колонке «Замер» — ожидаемый тип значения по целям задачи, пока слот pending.
 */
const buildCustomPendingMeasurementsFromRepeatTimes = (
    repeatTimes,
    measurementHintCtx,
) => {
    const list = Array.isArray(repeatTimes) ? repeatTimes : [];
    // Для созданной в модалке задачи не подставляем «ожидаемое» значение —
    // пока слот pending, значение должно быть пустым маркером.
    const value = "-";
    return list.map((time) => ({
        time: String(time ?? "").trim() || "00:00",
        value,
        status: "pending",
    }));
};

/**
 * Возвращает список текстов ответов при провале (correctiveActions) из нормализованного payload.
 * Для `repeat` всегда возвращает массив (возможно пустой).
 * Для остальных статусов возвращает массив только если есть непустые строки, иначе `null` (поле не добавляем).
 */
const resolveTaskCorrectiveActions = ({ payload, usePresetMeasurements }) => {
    const raw = Array.isArray(payload?.correctiveActions)
        ? payload.correctiveActions
        : [];
    const list = raw
        .map((item) => String(item ?? "").trim())
        .filter(Boolean);
    if (usePresetMeasurements) {
        return list;
    }
    return list.length > 0 ? list : null;
};

/**
 * Нормализует черновик модалки в единый валидный shape.
 * Используется перед сборкой payload и при обратной подстановке в форму.
 */
export const normalizeModalDraft = (draft = {}) => {
    const taskScopeType = normalizeTaskScopeType(draft.taskScopeType);
    const frequency = normalizeFrequency(draft.frequency);
    const legacyRepeats = Number(draft.repeatsPerDay);
    const legacySlots =
        Number.isFinite(legacyRepeats) && legacyRepeats >= 1
            ? Math.trunc(legacyRepeats)
            : null;
    let repeatTimes = (Array.isArray(draft.repeatTimes) ? draft.repeatTimes : [])
        .map((time) => String(time ?? "").trim())
        .filter((time) => /^\d{2}:\d{2}$/.test(time));
    const slotCount = Math.max(
        1,
        repeatTimes.length,
        legacySlots ?? 0,
    );
    const generatedRepeatTimes = buildRepeatTimesByCount(slotCount);
    while (repeatTimes.length < slotCount) {
        repeatTimes.push(generatedRepeatTimes[repeatTimes.length]);
    }
    const activeWeekdaysRaw = Array.isArray(draft.activeWeekdays)
        ? draft.activeWeekdays
        : [];
    const activeWeekdays = activeWeekdaysRaw.filter((value) =>
        ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].includes(value),
    );
    const uniqueWeekdays = activeWeekdays.length
        ? Array.from(new Set(activeWeekdays))
        : [...DEFAULT_TASK_ACTIVE_WEEKDAYS];

    const correctiveActionsFromRows = Array.isArray(draft.correctiveActionRows)
        ? draft.correctiveActionRows
              .map((row) => String(row?.text ?? "").trim())
              .filter(Boolean)
        : [];
    const correctiveActionsFromPayload = Array.isArray(draft.correctiveActions)
        ? draft.correctiveActions
              .map((item) => String(item ?? "").trim())
              .filter(Boolean)
        : [];
    const correctiveActions = correctiveActionsFromRows.length
        ? correctiveActionsFromRows
        : correctiveActionsFromPayload;

    return {
        title: String(draft.title ?? ""),
        taskScopeType,
        assignedStaffId:
            typeof draft.assignedStaffId === "string" &&
            draft.assignedStaffId.trim()
                ? draft.assignedStaffId.trim()
                : null,
        frequency,
        startDate:
            typeof draft.startDate === "number" && Number.isFinite(draft.startDate)
                ? draft.startDate
                : null,
        repeatTimes,
        activeWeekdays: uniqueWeekdays,
        equipmentTargetIds: normalizeEquipmentTargetIds(draft.equipmentTargetIds),
        roomTargetIds: normalizeRoomTargetIds(draft.roomTargetIds),
        taskFieldDefinitions: normalizeTaskFieldDefinitions(
            draft.taskFieldDefinitions,
        ),
        allowAssigneeReportCorrections: Boolean(
            draft.allowAssigneeReportCorrections,
        ),
        correctiveActions,
    };
};

/**
 * Собирает payload для сохранения задачи из черновика модалки.
 * Используется компонентом модалки, чтобы не дублировать ручную сборку полей.
 */
export const buildTaskPayloadFromDraft = (draft = {}) => {
    const normalized = normalizeModalDraft(draft);
    return {
        title: normalized.title,
        taskScopeType: normalized.taskScopeType,
        assignedStaffId: normalized.assignedStaffId,
        frequency: normalized.frequency,
        startDate: normalized.startDate,
        repeatTimes: normalized.repeatTimes,
        activeWeekdays: normalized.activeWeekdays,
        equipmentTargetIds: normalized.equipmentTargetIds,
        roomTargetIds: normalized.roomTargetIds,
        taskFieldDefinitions: normalized.taskFieldDefinitions,
        allowAssigneeReportCorrections:
            normalized.allowAssigneeReportCorrections,
        correctiveActions: normalized.correctiveActions,
    };
};

/**
 * Строит целевой объект задачи из payload по единому контракту.
 * Используется и для пользовательских задач, и для enrich дефолтных задач.
 */
export const buildTaskFromPayload = ({
    niche,
    payload = {},
    source = "custom",
    idFactory,
    context = {},
}) => {
    const normalized = normalizeModalDraft(payload);
    const taskScopeType = resolveTaskScopeType({ payload: normalized });
    const title = resolveTaskTitle({ payload: normalized, source, context });
    if (!title) {
        return null;
    }
    const aggregateOk = resolveTaskAggregateOk({ payload, source });
    const usePresetMeasurements = payloadUsesPresetMeasurementsBranch(payload);
    let repeatTimes;
    let repeatMeasurements = null;
    if (usePresetMeasurements) {
        repeatMeasurements = readPresetMeasurementsPayload(payload);
        const slotCount = repeatsPerDayFromMeasurements(repeatMeasurements);
        const timesFromM = repeatMeasurements.map((m) =>
            String(m?.time ?? "").trim(),
        );
        const allValid =
            repeatMeasurements.length > 0 &&
            timesFromM.length === repeatMeasurements.length &&
            timesFromM.every((t) => REPEAT_MEASUREMENT_TIME_RE.test(t));
        repeatTimes = allValid
            ? timesFromM
            : resolveTaskRepeatTimes({ payload: normalized, slotCount });
    } else {
        repeatTimes = normalized.repeatTimes;
    }
    const activeWeekdays = resolveTaskActiveWeekdays({ payload: normalized });
    const equipmentTargetIds = resolveTaskEquipmentTargetIds({
        payload: normalized,
        taskScopeType,
    });
    const roomTargetIds = resolveTaskRoomTargetIds({
        payload: normalized,
        taskScopeType,
    });
    const id = resolveTaskId({
        niche,
        payload,
        source,
        idFactory,
        context,
    });
    if (!id) {
        return null;
    }
    const base = {
        id,
        title,
        status: aggregateOk,
        isCustom: resolveTaskIsCustom({ source }),
        taskScopeType,
        assignedStaffId: resolveTaskAssignedStaffId({ payload: normalized }),
        frequency: resolveTaskFrequency({ payload: normalized }),
        taskFieldDefinitions: resolveTaskFieldDefinitions({
            payload: normalized,
        }),
        startDate: resolveTaskStartDate({ payload: normalized }),
        repeatTimes,
        activeWeekdays,
        allowAssigneeReportCorrections:
            resolveTaskAllowAssigneeReportCorrections({ payload: normalized }),
    };
    if (equipmentTargetIds) {
        base.equipmentTargetIds = equipmentTargetIds;
    }
    if (roomTargetIds) {
        base.roomTargetIds = roomTargetIds;
    }
    const scope = resolveTaskScope({ taskScopeType });
    if (scope) {
        base.scope = scope;
    }
    if (usePresetMeasurements) {
        const correctiveActions = resolveTaskCorrectiveActions({
            payload: normalized,
            usePresetMeasurements: true,
        });
        return {
            ...base,
            measurements: repeatMeasurements ?? [],
            correctiveActions: correctiveActions ?? [],
        };
    }
    const correctiveActionsOk = resolveTaskCorrectiveActions({
        payload: normalized,
        usePresetMeasurements: false,
    });
    if (correctiveActionsOk && correctiveActionsOk.length > 0) {
        base.correctiveActions = correctiveActionsOk;
    }
    const measurementHintCtx = {
        title,
        taskScopeType,
        equipmentTargetIds: normalized.equipmentTargetIds,
        roomTargetIds: normalized.roomTargetIds,
    };
    if (source === "default") {
        base.measurements = buildDefaultNonRepeatMeasurementsFromRepeatTimes(
            repeatTimes,
            aggregateOk,
            measurementHintCtx,
        );
    } else if (source === "custom") {
        base.measurements = buildCustomPendingMeasurementsFromRepeatTimes(
            repeatTimes,
            measurementHintCtx,
        );
    }
    return base;
};

/**
 * Для дефолтной repeat-задачи вытаскивает слоты времени из measurements[].time.
 * При неполной/невалидной разметке возвращает null — тогда остаются DEFAULT_TASK_REPEAT_TIMES (один слот).
 */
const deriveDefaultRepeatScheduleFromMeasurements = (measurements) => {
    if (!Array.isArray(measurements) || measurements.length === 0) {
        return null;
    }
    const repeatTimes = measurements.map((m) => String(m?.time ?? "").trim());
    if (!repeatTimes.every((t) => REPEAT_MEASUREMENT_TIME_RE.test(t))) {
        return null;
    }
    return {
        repeatTimes: [...repeatTimes],
    };
};

const inferDefaultEquipmentTargetIdsForTask = (title, niche) => {
    const t = String(title ?? "").toLowerCase();
    if (/термощуп|зонд/.test(t)) {
        return ["eq-probe-1"];
    }
    if (/кофе|ростер/.test(t)) {
        return ["eq-coffee-machine"];
    }
    if (/жар|печ|термообработ|фрит|плита/.test(t)) {
        return ["eq-stove"];
    }
    if (/температур|молок|морозил|холодн|охлажден|камера/.test(t)) {
        return ["eq-fridge-1"];
    }
    if (niche === "coffee") {
        return ["eq-coffee-machine"];
    }
    if (niche === "meat") {
        return ["eq-fridge-1"];
    }
    return [];
};

/**
 * Обогащает дефолтную задачу до полного контракта модели.
 * Используется при сборке `createDefaultState`.
 * Для `status: repeat` с массивом measurements повторы дня и repeatTimes согласуются со слотами замеров.
 */
export const buildDefaultTask = (baseTask, niche, context = {}) => {
    const fallbackScopeByNiche = {
        coffee: TASK_SCOPE_TYPE.EQUIPMENT,
        bakery: TASK_SCOPE_TYPE.ROOMS,
        meat: TASK_SCOPE_TYPE.STANDALONE,
    };
    const taskScopeType = normalizeTaskScopeType(
        baseTask.taskScopeType ??
            fallbackScopeByNiche[niche] ??
            TASK_SCOPE_TYPE.STANDALONE,
    );
    const equipmentTargetIdsBase = Array.isArray(baseTask.equipmentTargetIds)
        ? baseTask.equipmentTargetIds
        : [];
    const equipmentTargetIds =
        taskScopeType === TASK_SCOPE_TYPE.EQUIPMENT && equipmentTargetIdsBase.length === 0
            ? inferDefaultEquipmentTargetIdsForTask(baseTask.title, niche)
            : equipmentTargetIdsBase;
    const roomTargetIds = Array.isArray(baseTask.roomTargetIds)
        ? baseTask.roomTargetIds
        : [];
    const repeatFromMeasurements = payloadUsesPresetMeasurementsBranch(baseTask)
        ? deriveDefaultRepeatScheduleFromMeasurements(baseTask.measurements)
        : null;
    const repeatTimes = repeatFromMeasurements
        ? repeatFromMeasurements.repeatTimes
        : [...DEFAULT_TASK_REPEAT_TIMES];
    return buildTaskFromPayload({
        niche,
        source: "default",
        context,
        payload: {
            ...baseTask,
            taskScopeType,
            frequency: FREQUENCY_CODE.CUSTOM,
            startDate:
                typeof context.startDate === "number"
                    ? context.startDate
                    : toStartOfDayTimestamp(),
            repeatTimes,
            activeWeekdays: [...DEFAULT_TASK_ACTIVE_WEEKDAYS],
            taskFieldDefinitions: Array.isArray(baseTask.taskFieldDefinitions)
                ? baseTask.taskFieldDefinitions
                : [],
            equipmentTargetIds,
            roomTargetIds,
            allowAssigneeReportCorrections: true,
        },
    });
};

/**
 * Преобразует объект задачи в черновик модалки.
 * Используется для консистентной обратной подстановки данных в форму.
 */
export const mapTaskToModalDraft = (task = {}, _context = {}) => {
    const rowsFromTask = Array.isArray(task.correctiveActions)
        ? task.correctiveActions.map((text) => ({
              id: uuidv4(),
              text: String(text ?? ""),
          }))
        : [];
    const measurements = Array.isArray(task.measurements) ? task.measurements : [];
    const scheduleSlotCount =
        measurements.length > 0
            ? repeatsPerDayFromMeasurements(measurements)
            : Math.max(
                  1,
                  Array.isArray(task.repeatTimes) ? task.repeatTimes.length : 1,
              );
    return {
        ...createModalDraft(""),
        ...normalizeModalDraft({
            ...task,
            correctiveActionRows: rowsFromTask,
        }),
        title: String(task?.title ?? ""),
        correctiveActionRows: rowsFromTask,
        scheduleSlotCount,
    };
};
