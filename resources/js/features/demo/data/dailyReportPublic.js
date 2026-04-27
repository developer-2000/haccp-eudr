/**
 * Публичная страница ежедневного отчёта HACCP + приёмка EUDR за день: `/report/YYYY-MM-DD` или `/{locale}/report/YYYY-MM-DD`
 * (демо; не юридически обязательный документ).
 */

import {
    createDefaultState,
    loadPersistedDemoState,
} from "@/features/demo/composables/useDemoState";
import {
    firstPendingMeasurementTime,
    taskDisplayStatusKey,
    taskHasMultiSlotSchedule,
} from "@/features/demo/domain/checklistTaskModel";
import { getBatchPublicRecord } from "@/features/demo/data/eudrBatchPublic";
import { resolveStaffFullName } from "@/features/demo/utils/demoStaff";

const origin =
    typeof window !== "undefined" && window.location?.origin
        ? window.location.origin
        : "https://haccpilot.eu";


/** День, для которого в демо заполнена полная выгрузка (совпадает с reportDayIso в state). */
export const REPORT_REFERENCE_ISO = (() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
})();

/**
 * Абсолютный URL публичного дневного отчёта.
 *
 * @param {string} isoDate — YYYY-MM-DD
 * @param {string | null | undefined} [locale] — если задан, путь `/{locale}/report/{date}`; иначе `/report/{date}` (старые ссылки без префикса).
 * @returns {string}
 */
export const buildDailyReportPublicUrl = (isoDate, locale = null) => {
    if (!isoDate) {
        return origin;
    }
    if (locale && typeof locale === "string") {
        return `${origin}/${locale}/report/${isoDate}`;
    }
    return `${origin}/report/${isoDate}`;
};

const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * @param {string} s
 * @returns {string | null}
 */
export const parseIsoDateSafe = (s) => {
    if (typeof s !== "string" || !ISO_RE.test(s)) {
        return null;
    }
    const d = new Date(`${s}T12:00:00`);
    if (Number.isNaN(d.getTime())) {
        return null;
    }
    const [, y, m, day] = s.match(ISO_RE);
    const yi = Number(y);
    const mi = Number(m);
    const di = Number(day);
    if (
        d.getFullYear() !== yi ||
        d.getMonth() + 1 !== mi ||
        d.getDate() !== di
    ) {
        return null;
    }
    return s;
};

/**
 * DD.MM.YYYY → YYYY-MM-DD
 * @param {string} ru
 */
export const ruDottedDateToIso = (ru) => {
    if (typeof ru !== "string" || !/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(ru)) {
        return null;
    }
    const [d, m, y] = ru.split(".");
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
};

/**
 * @param {string} iso
 */
export const formatIsoLongRu = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })
        .format(dt)
        .replace(/\s+г\.?$/u, "")
        .trim();
};

const NICHE_LABEL = {
    coffee: "Coffee",
    bakery: "Bakery",
    meat: "Meat / EUDR",
};

const fallbackStatus = (task) => {
    const key = taskDisplayStatusKey(task);
    if (key === "ok") {
        return "Within limits";
    }
    if (key === "problem") {
        return "Deviation";
    }
    if (key === "repeat") {
        return "Monitored (scheduled)";
    }
    return "—";
};

const measurementStatus = (m) => {
    const raw = String(m?.status ?? "").toLowerCase();
    if (raw === "success") {
        return { key: "ok", label: "success" };
    }
    if (raw === "problem") {
        return { key: "problem", label: "problem" };
    }
    if (raw === "pending") {
        return { key: "review", label: "pending" };
    }
    return { key: "review", label: raw || "—" };
};

const hasAnyPendingMeasurement = (task) =>
    Array.isArray(task?.measurements) &&
    task.measurements.some((m) => m?.status === "pending");

/**
 * Статус для дневного отчёта:
 * - если у задачи есть временные слоты (`measurements`) и хотя бы один pending -> Pending
 * - если у задачи есть слоты и pending нет -> Success
 * - иначе fallback к прежней логике.
 */
const reportTaskStatus = (task) => {
    if (Array.isArray(task?.measurements) && task.measurements.length > 0) {
        return hasAnyPendingMeasurement(task)
            ? { key: "review", label: "Pending" }
            : { key: "ok", label: "Success" };
    }
    const key = taskDisplayStatusKey(task);
    if (key === "problem") {
        return { key: "problem", label: fallbackStatus(task) };
    }
    if (key === "repeat") {
        return { key: "review", label: fallbackStatus(task) };
    }
    return { key: "ok", label: fallbackStatus(task) };
};

const NICHE_ORDER = ["coffee", "bakery", "meat"];

/**
 * Полная структура по нишам: все задачи, замеры, шаблоны корректирующих действий.
 * @param {ReturnType<typeof createDefaultState>} state
 */
const buildNicheSections = (state) =>
    NICHE_ORDER.map((nicheKey) => {
        const tasks = state.checklistsByNiche?.[nicheKey] ?? [];
        const nicheLabel = NICHE_LABEL[nicheKey] ?? nicheKey;
        return {
            nicheKey,
            nicheLabel,
            tasks: tasks.map((task) => {
                const reportStatus = reportTaskStatus(task);
                return ({
                id: task.id,
                title: task.title,
                value: firstPendingMeasurementTime(task) || "—",
                statusPillKey: reportStatus.key,
                statusLabel: reportStatus.label,
                assigneeName: resolveStaffFullName(
                    state.staff,
                    task.assignedStaffId,
                ),
                measurements: Array.isArray(task.measurements)
                    ? task.measurements.map((m) => ({
                          time: m.time,
                          value: m.value,
                          status: m.status,
                          resultPillKey: measurementStatus(m).key,
                          resultLabel: measurementStatus(m).label,
                      }))
                    : null,
                correctiveActions: Array.isArray(task.correctiveActions)
                    ? [...task.correctiveActions]
                    : null,
            });
            }),
        };
    });

/** Плоские строки CCP для таблицы отчёта. */
const flattenCcpRows = (state) => {
    const rows = [];
    for (const [niche, tasks] of Object.entries(
        state.checklistsByNiche ?? {},
    )) {
        const nicheLabel = NICHE_LABEL[niche] ?? niche;
        for (const task of tasks) {
            const reportStatus = reportTaskStatus(task);
            let detail = firstPendingMeasurementTime(task) || "—";
            if (
                taskHasMultiSlotSchedule(task) &&
                Array.isArray(task.measurements)
            ) {
                const last = [...task.measurements]
                    .reverse()
                    .find((m) => m.status !== "pending");
                if (last) {
                    detail = `${last.value} @ ${last.time}`;
                }
            }
            rows.push({
                id: `${niche}-${task.id}`,
                niche: nicheLabel,
                ccp: task.title,
                detail,
                assigneeName: resolveStaffFullName(
                    state.staff,
                    task.assignedStaffId,
                ),
                statusPillKey: reportStatus.key,
                statusLabel: reportStatus.label,
            });
        }
    }
    return rows;
};

/**
 * Из единого массива `state.batches` (все партии демо) — только строки, у которых дата списка = календарный день отчёта.
 * @param {string} dateIso
 */
const batchesForCalendarDay = (dateIso, state) => {
    const list = state.batches ?? [];
    return list.filter((b) => ruDottedDateToIso(b.date) === dateIso);
};

/**
 * Снимок для страницы /report/:date
 * @param {string} dateIso
 */
export const getDailyReportSnapshot = (dateIso) => {
    const safe = parseIsoDateSafe(dateIso);
    if (!safe) {
        return null;
    }

    const state = loadPersistedDemoState();
    const isReferenceDay = safe === REPORT_REFERENCE_ISO;
    const ccpRows = isReferenceDay ? flattenCcpRows(state) : [];
    const supplyRows = isReferenceDay ? batchesForCalendarDay(safe, state) : [];
    const nicheSections = isReferenceDay ? buildNicheSections(state) : [];
    const supplyDetails = isReferenceDay
        ? supplyRows.map((b) => ({
              listRow: b,
              eudr: getBatchPublicRecord(b.id),
          }))
        : [];

    const totalCcpTasks = isReferenceDay
        ? nicheSections.reduce((n, s) => n + s.tasks.length, 0)
        : 0;

    return {
        dateIso: safe,
        dateLongRu: formatIsoLongRu(safe),
        hasFullRecord: isReferenceDay,
        documentRef: `HACCPilot-DAILY-${safe}-DEMO`,
        establishment: {
            legalName: "Piotr Bakery Sp. z o.o.",
            address: "ul. Przykładowa 12, 00-001 Warszawa, Poland",
            eori: "PL1234567890000",
            fdaRegistration:
                "Illustrative — U.S. FDA establishment identifier not applicable in this demo (FSMA recordkeeping narrative only).",
            competentAuthorityEu:
                "Competent authority (illustrative): Chief Sanitary Inspectorate / PIH — demo placeholder.",
        },
        inspectionDateLabel: state.inspectionDate,
        companyShort: state.report.company,
        ccpRows,
        nicheSections,
        totalCcpTasks,
        supplyRows,
        supplyDetails,
        disclaimer:
            "Demonstration document for inspection readiness review only. Not a legally binding EU DDS, FDA submission, or official regulatory record. Operational data are illustrative.",
        generatedAtUtcHint: new Date().toISOString(),
    };
};
