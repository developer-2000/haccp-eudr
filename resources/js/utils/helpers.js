/**
 * @fileoverview Общие helper функции для приложения
 */

/**
 * Получает базовый URL приложения из Vite
 * Используется для статических файлов из public директории
 * @returns {string} Базовый URL (обычно '/', может быть '/subfolder/' если приложение в подпапке)
 * @example
 * getBaseUrl() // '/'
 */
export const getBaseUrl = () => {
    return import.meta.env.BASE_URL || '/';
};

/**
 * Формирует путь к статическому файлу из public директории
 * ПРАВИЛЬНЫЙ способ для статических файлов (изображения, иконки и т.д.)
 * @param {string} path - Путь к файлу относительно public (например: 'images/logo.png')
 * @returns {string} Полный путь к файлу (например: '/images/logo.png')
 * @example
 * getPublicPath('images/logo.png') // '/images/logo.png'
 */
export const getPublicPath = (path) => {
    const baseUrl = getBaseUrl();
    // Убираем начальный слеш из path если он есть
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${baseUrl}${cleanPath}`;
};

/**
 * Получает полный URL домена (протокол + хост)
 * Используется когда нужен полный домен (например для API запросов, внешних ссылок)
 * НЕ используется для статических файлов из public!
 * @returns {string} Полный URL домена (например: 'http://localhost:5179' или 'https://example.com')
 * @example
 * getDomainUrl() // 'http://localhost:5179'
 */
export const getDomainUrl = () => {
    if (typeof window !== 'undefined') {
        return `${window.location.protocol}//${window.location.host}`;
    }
    return '';
};

/**
 * Формирует полный URL включая домен
 * @param {string} path - Путь относительно корня
 * @returns {string} Полный URL
 */
export const getFullUrl = (path) => {
    const domain = getDomainUrl();
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${domain}${cleanPath}`;
};

/**
 * Создает debounced версию функции
 * Откладывает выполнение функции до истечения указанного времени простоя
 * @param {Function} func - Функция для debounce
 * @param {number} wait - Время задержки в миллисекундах
 * @returns {Function} Debounced функция
 */
export const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const TEMPERATURE_DRAFT_MAX_FRACTION_DIGITS = 2;

/**
 * После «-» или в начале строки точка без нуля недопустима: -.33 → -0.33, .5 → 0.5, «-»/«.» сами по себе не оставляем.
 */
const normalizeTemperatureDraftLeadingZeroBeforeDot = (out) => {
    if (out === '.' || out === '-.') {
        return out === '-.' ? '-0.' : '0.';
    }
    if (out.startsWith('-.')) {
        return `-0.${out.slice(2)}`;
    }
    if (out.startsWith('.')) {
        return `0.${out.slice(1)}`;
    }
    return out;
};

/**
 * Чистит вводимый текст в input (температура/таймер в drawer).
 * Запятая приводится к точке; после разделителя не больше двух цифр.
 * Допустимо: ведущий -, одна точка, 0-9; + отбрасывается в цикле.
 * Голая точка (без цифры до неё) не допускается — подставляется 0.
 *
 * @param {string|null|undefined} raw
 * @returns {string}
 */
export const sanitizeTemperatureNumericDraft = (raw) => {
    const s = String(raw ?? '');
    let out = '';
    let i = 0;
    if (s.charAt(0) === '-') {
        out = '-';
        i = 1;
    }
    let hasSep = false;
    let fracDigits = 0;
    for (; i < s.length; i += 1) {
        const c = s.charAt(i);
        if (c >= '0' && c <= '9') {
            if (hasSep) {
                if (fracDigits >= TEMPERATURE_DRAFT_MAX_FRACTION_DIGITS) {
                    continue;
                }
                fracDigits += 1;
            }
            out += c;
            continue;
        }
        if ((c === '.' || c === ',') && !hasSep) {
            out += '.';
            hasSep = true;
        }
    }
    return normalizeTemperatureDraftLeadingZeroBeforeDot(out);
};

/**
 * Знак с клавиатуры в начале или в конце строки (как +/- на клавиатуре):
 * «5-» / ведущий - → отрицательное; «-5+» / ведущий + → положительное (снять минус).
 * Знак «между» цифрами игнорируем (например 5-3).
 * Если последний символ + или −, он задаёт знак числа.
 *
 * @param {string} sanitized — результат sanitizeTemperatureNumericDraft
 * @param {string|null|undefined} raw — исходная строка из input
 * @returns {string}
 */
export const applyKeyboardSignToTemperatureDraft = (sanitized, raw) => {
    const s = String(sanitized ?? '');
    const r = String(raw ?? '');
    if (s === '') {
        return s;
    }
    const last = r.charAt(r.length - 1);
    const first = r.charAt(0);
    const endsWithSign = last === '+' || last === '-';
    if (endsWithSign) {
        if (last === '+') {
            return s.startsWith('-') ? s.slice(1) : s;
        }
        return s.startsWith('-') ? s : `-${s}`;
    }
    if (first === '+') {
        return s.startsWith('-') ? s.slice(1) : s;
    }
    if (first === '-') {
        return s.startsWith('-') ? s : `-${s}`;
    }
    return s;
};
