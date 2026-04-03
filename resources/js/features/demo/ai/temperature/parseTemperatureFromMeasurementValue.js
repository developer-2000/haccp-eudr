/**
 * Читает число °C из строки ячейки замера (`4,2 °C`, `-27.3 °C`, …).
 *
 * @param {unknown} rawValue
 * @returns {number|null}
 */
export function parseTemperatureFromMeasurementValue(rawValue) {
    const source = String(rawValue ?? "").trim();
    if (!source) {
        return null;
    }
    const normalized = source
        .replace(/\s+/g, "")
        .replace("°C", "")
        .replace("°c", "")
        .replace(",", ".");
    const match = normalized.match(/^[+-]?\d+(?:\.\d+)?$/);
    if (!match) {
        return null;
    }
    const parsed = Number(match[0]);
    return Number.isFinite(parsed) ? parsed : null;
}
