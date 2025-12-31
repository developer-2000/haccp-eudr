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

