/**
 * Ниша задачи для AI: явное поле или префикс id (как в applyPending).
 *
 * @param {object|null|undefined} task
 * @returns {string|null}
 */
export function resolveTaskNicheForTemperatureAi(task) {
    const niche = String(task?.niche ?? "").trim();
    if (niche) {
        return niche;
    }
    const id = String(task?.id ?? "").trim();
    if (id.startsWith("coffee-") || id.startsWith("default-coffee-")) {
        return "coffee";
    }
    if (id.startsWith("bakery-") || id.startsWith("default-bakery-")) {
        return "bakery";
    }
    if (id.startsWith("meat-") || id.startsWith("default-meat-")) {
        return "meat";
    }
    return null;
}

/**
 * Ключ профиля в TemperatureAiAnalyzer (bakery → bread).
 *
 * @param {string|null} niche
 * @returns {string|null}
 */
export function mapTaskNicheToAnalyzerNiche(niche) {
    if (niche === "bakery") {
        return "bread";
    }
    if (niche === "coffee" || niche === "meat" || niche === "bread") {
        return niche;
    }
    return null;
}

/**
 * Режим профиля: явный task.aiContext.mode или эвристика по нише/оборудованию.
 *
 * @param {object|null|undefined} task
 * @param {string|null} analyzerNiche
 * @returns {string|null}
 */
export function resolveTemperatureAiMode(task, analyzerNiche) {
    const explicitMode = String(task?.aiContext?.mode ?? "").trim();
    if (explicitMode) {
        return explicitMode;
    }
    if (analyzerNiche === "coffee") {
        return "storage";
    }
    if (analyzerNiche === "bread") {
        return "proofing";
    }
    if (analyzerNiche === "meat") {
        const targets = Array.isArray(task?.equipmentTargetIds)
            ? task.equipmentTargetIds
            : [];
        if (targets.includes("eq-freezer") || targets.includes("eq-frozen-storage")) {
            return "freezer";
        }
        return "chilled";
    }
    return null;
}
