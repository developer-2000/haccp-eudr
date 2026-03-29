import { createDefaultState } from "@/features/demo/composables/demoDefaultState";
import { buildDemoBatches } from "@/features/demo/data/eudrBatchPublic";

export const STORAGE_KEY = "haccp-demo-state";

/**
 * После загрузки состояния из `localStorage` подмешивает «свежие» даты и демо-партии из `createDefaultState` / `buildDemoBatches`.
 * `inspectionDate` и `report.reportDayIso` всегда берутся из дефолтов (сегодня / конец месяца), остальное в `report` сохраняется из сохранённого state.
 * `batches` пересобираются целиком, чтобы дневной отчёт и экран Reports не показывали устаревшие даты партий.
 */
const normalizeHydratedStateDates = (state) => {
    const defaults = createDefaultState();
    const nextReport = {
        ...(state?.report ?? {}),
        reportDayIso: defaults.report.reportDayIso,
    };
    return {
        ...state,
        inspectionDate: defaults.inspectionDate,
        report: nextReport,
        // Гарантируем, что в Reports/дневном отчёте даты партий синхронны с текущим днем.
        batches: buildDemoBatches(),
    };
};

/**
 * Читает JSON состояния демо из `localStorage` по `STORAGE_KEY`.
 * Парсит строку и прогоняет через `normalizeHydratedStateDates` (даты инспекции/отчёта и партии приводятся к актуальным дефолтам).
 * Если ключа нет, JSON битый или доступ к `localStorage` упал — возвращает `null` (без throw).
 */
export const loadStateFromStorage = () => {
    try {
        // localStorage.removeItem(STORAGE_KEY);
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return null;
        }
        const parsed = JSON.parse(raw);
        return normalizeHydratedStateDates(parsed);
    }
    catch {
        return null;
    }
};

/** Экспорт для внешних consumers (например, публичный daily report). */
export const loadPersistedDemoState = () =>
    loadStateFromStorage() ?? createDefaultState();

export const saveStateToStorage = (state) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        // no-op: storage может быть недоступен
    }
};
