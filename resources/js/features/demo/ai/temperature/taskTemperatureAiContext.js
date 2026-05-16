import { getBreadModeCcpWindow, taskHasBreadEquipment } from './breadBands';
import { MEAT_CHILLED_EQUIPMENT_IDS, MEAT_FREEZER_EQUIPMENT_IDS } from './meatBands';
import { readTaskTemperatureMinMaxC } from '@/features/demo/domain/checklistTaskModel';

/**
 * Режимы хлеба по возрастанию типичной шкалы °C (охлаждение → … → выпечка).
 * Пересечение допуска задачи с эталонным окном + узкое окно при равном score.
 */
const BREAD_MODE_INFER_ORDER = Object.freeze(['cooling', 'sponge_mix', 'proofing', 'baking']);

/**
 * Режим по пересечению `[tmin, tmax]` с эталонными окнами `getBreadModeCcpWindow` (в т.ч. одна точка замера: tmin=tmax).
 *
 * @param {number} tmin
 * @param {number} tmax
 * @returns {'sponge_mix'|'proofing'|'baking'|'cooling'|null}
 */
function inferBreadModeFromCcpRange(tmin, tmax) {
    if (!Number.isFinite(tmin) || !Number.isFinite(tmax) || tmin > tmax) {
        return null;
    }
    let best = null;
    let bestScore = -1;
    let bestRefWidth = Infinity;
    let bestRmin = Infinity;
    for (const mode of BREAD_MODE_INFER_ORDER) {
        const w = getBreadModeCcpWindow(mode);
        if (!w) {
            continue;
        }
        const { min: rmin, max: rmax } = w;
        const lo = Math.max(tmin, rmin);
        const hi = Math.min(tmax, rmax);
        const score = hi >= lo ? hi - lo : -1;
        if (score < 0) {
            continue;
        }
        const refWidth = rmax - rmin;
        if (
            score > bestScore ||
            (score === bestScore && refWidth < bestRefWidth) ||
            (score === bestScore && refWidth === bestRefWidth && rmin < bestRmin)
        ) {
            bestScore = score;
            bestRefWidth = refWidth;
            bestRmin = rmin;
            best = mode;
        }
    }
    return best;
}

/**
 * Если оборудование хлеба не выбрано — режим по допуску температуры в задаче.
 *
 * @param {object|null|undefined} task
 * @returns {'sponge_mix'|'proofing'|'baking'|'cooling'|null}
 */
function inferBreadModeFromTaskCcp(task) {
    const limits = readTaskTemperatureMinMaxC(task);
    const tmin = limits?.minC;
    const tmax = limits?.maxC;
    if (tmin == null || tmax == null || !Number.isFinite(tmin) || !Number.isFinite(tmax)) {
        return null;
    }
    return inferBreadModeFromCcpRange(tmin, tmax);
}

/**
 * Если в задаче нет min/max, режим по одному введённому °C (допускается как [t,t]).
 *
 * @param {number} t
 * @returns {'sponge_mix'|'proofing'|'baking'|'cooling'|null}
 */
export function inferBreadModeFromMeasurementC(t) {
    if (!Number.isFinite(t)) {
        return null;
    }
    return inferBreadModeFromCcpRange(t, t);
}

/**
 * Ниша задачи для AI: явное поле или префикс id (как в applyPending).
 *
 * @param {object|null|undefined} task
 * @returns {string|null}
 */
export function resolveTaskNicheForTemperatureAi(task) {
    const niche = String(task?.niche ?? '').trim();
    if (niche) {
        return niche;
    }
    const id = String(task?.id ?? '').trim();
    if (id.startsWith('coffee-') || id.startsWith('default-coffee-')) {
        return 'coffee';
    }
    if (
        id.startsWith('bakery-') ||
        id.startsWith('default-bakery-') ||
        id.startsWith('custom-bakery-')
    ) {
        return 'bakery';
    }
    if (id.startsWith('meat-') || id.startsWith('default-meat-')) {
        return 'meat';
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
    if (niche === 'bakery') {
        return 'bread';
    }
    if (niche === 'coffee' || niche === 'meat' || niche === 'bread') {
        return niche;
    }
    return null;
}

/**
 * Режим профиля: эвристика по нише/оборудованию; для хлеба явный `aiContext.mode` учитывается **после**
 * оборудования и вывода по CCP (иначе в storage залипал старый `proofing` и перебивал «Суть задачи»).
 *
 * @param {object|null|undefined} task
 * @param {string|null} analyzerNiche
 * @param {number|null|undefined} measurementC — при отсутствии допуска в задаче: один замер °C для выбора режима
 * @returns {string|null}
 */
export function resolveTemperatureAiMode(task, analyzerNiche, measurementC) {
    const explicitMode = String(task?.aiContext?.mode ?? '').trim();
    if (analyzerNiche === 'coffee') {
        if (explicitMode) {
            return explicitMode;
        }
        const targets = Array.isArray(task?.equipmentTargetIds) ? task.equipmentTargetIds : [];
        if (targets.includes('eq-coffee-roaster') || targets.includes('eq-coffee-destoner')) {
            return 'roasting';
        }
        if (
            targets.includes('eq-coffee-bean-cooler') ||
            targets.includes('eq-coffee-shock-cooler')
        ) {
            return 'cooling';
        }
        if (
            targets.includes('eq-coffee-vacuum-containers') ||
            targets.includes('eq-coffee-warehouse-shelving') ||
            targets.includes('eq-coffee-grain-canisters')
        ) {
            return 'storage';
        }
        return 'storage';
    }
    if (analyzerNiche === 'bread') {
        const targets = Array.isArray(task?.equipmentTargetIds) ? task.equipmentTargetIds : [];
        if (
            targets.includes('eq-bread-spiral-mixer') ||
            targets.includes('eq-bread-preferment-vat')
        ) {
            return 'sponge_mix';
        }
        if (
            targets.includes('eq-bread-proofing-cabinet') ||
            targets.includes('eq-bread-proofing-trays')
        ) {
            return 'proofing';
        }
        if (targets.includes('eq-bread-rotary-oven') || targets.includes('eq-bread-crumb-probe')) {
            return 'baking';
        }
        if (
            targets.includes('eq-bread-cooling-conveyor') ||
            targets.includes('eq-bread-ventilated-racks')
        ) {
            return 'cooling';
        }
        if (!taskHasBreadEquipment(targets)) {
            const mc =
                measurementC != null && Number.isFinite(Number(measurementC))
                    ? Number(measurementC)
                    : NaN;
            if (Number.isFinite(mc)) {
                const fromMeas = inferBreadModeFromMeasurementC(mc);
                if (fromMeas) {
                    return fromMeas;
                }
            }
            const inferred = inferBreadModeFromTaskCcp(task);
            if (inferred) {
                return inferred;
            }
            if (explicitMode) {
                return explicitMode;
            }
            return 'proofing';
        }
        const inferred = inferBreadModeFromTaskCcp(task);
        if (inferred) {
            return inferred;
        }
        const mc =
            measurementC != null && Number.isFinite(Number(measurementC))
                ? Number(measurementC)
                : NaN;
        const fromMeas = inferBreadModeFromMeasurementC(mc);
        if (fromMeas) {
            return fromMeas;
        }
        if (explicitMode) {
            return explicitMode;
        }
        return 'proofing';
    }
    if (analyzerNiche === 'meat') {
        if (explicitMode) {
            return explicitMode;
        }
        const targets = Array.isArray(task?.equipmentTargetIds) ? task.equipmentTargetIds : [];
        const hasChilledEq = targets.some((id) => MEAT_CHILLED_EQUIPMENT_IDS.includes(id));
        const hasFreezerEq = targets.some((id) => MEAT_FREEZER_EQUIPMENT_IDS.includes(id));
        if (hasFreezerEq && !hasChilledEq) {
            return 'freezer';
        }
        if (hasChilledEq && !hasFreezerEq) {
            return 'chilled';
        }
        if (targets.includes('eq-freezer') || targets.includes('eq-frozen-storage')) {
            return 'freezer';
        }
        const mc =
            measurementC != null && Number.isFinite(Number(measurementC))
                ? Number(measurementC)
                : NaN;
        if (Number.isFinite(mc)) {
            return mc < 0 ? 'freezer' : 'chilled';
        }
        return 'chilled';
    }
    if (explicitMode) {
        return explicitMode;
    }
    return null;
}
