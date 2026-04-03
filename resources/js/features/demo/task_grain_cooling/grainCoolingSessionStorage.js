import { task_grain_cooling } from "./config";

const KEY = () => task_grain_cooling.sessionStorageKey;

/**
 * Чтение JSON по ключу сценария (копия объекта). Без побочных эффектов.
 *
 * @returns {Record<string, unknown>}
 */
export function readGrainCoolingSessionStorage() {
    try {
        if (typeof sessionStorage === "undefined") {
            return {};
        }
        const raw = sessionStorage.getItem(KEY());
        if (!raw) {
            return {};
        }
        const data = JSON.parse(raw);
        return data && typeof data === "object" ? { ...data } : {};
    } catch {
        return {};
    }
}

/**
 * Тихий merge в sessionStorage (тост, полоса, промежуточные снимки). Без лога «завершен».
 *
 * @param {Record<string, unknown>} patch
 * @returns {Record<string, unknown>}
 */
export function mergeGrainCoolingSessionStorage(patch) {
    try {
        if (typeof sessionStorage === "undefined") {
            return {};
        }
        const prev = readGrainCoolingSessionStorage();
        const next = { ...prev, ...patch };
        sessionStorage.setItem(KEY(), JSON.stringify(next));
        return readGrainCoolingSessionStorage();
    } catch (e) {
        if (import.meta.env.DEV) {
            console.debug("[grainCooling] sessionStorage merge error", e);
        }
        return {};
    }
}

/**
 * Единственная точка **логического завершения** цикла оповещения: запись итогового снимка + один вывод в консоль.
 * Вызывать только из: таймер `markNotificationCountdownCompleted` и `markGrainCoolingScenarioStoredCompleted`.
 *
 * @param {Record<string, unknown>} finalPatch — поля, которые должны оказаться в storage после merge
 * @returns {Record<string, unknown>}
 */
export function finalizeGrainCoolingNotificationStorage(finalPatch) {
    const written = mergeGrainCoolingSessionStorage(finalPatch);
    // console.log("Оповещение завершено Storage = ", written);
    return written;
}

/** @deprecated используйте mergeGrainCoolingSessionStorage */
export const writeGrainCoolingSessionStorage = mergeGrainCoolingSessionStorage;
