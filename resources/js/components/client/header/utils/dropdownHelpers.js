/**
 * @fileoverview Helper функции для проверки типов dropdown
 * @typedef {import('../types/nav.types.js').NavMenuItem} NavMenuItem
 * @typedef {import('../types/nav.types.js').NavDropdownItem} NavDropdownItem
 */

/**
 * Проверяет, является ли dropdown типом с колонками и заголовками
 * @param {NavMenuItem} item - Элемент меню
 * @returns {boolean} true если dropdown имеет структуру с колонками
 */
export const hasDropdownColumns = (item) => {
    return item?.dropdown?.columns;
};

/**
 * Проверяет, является ли dropdown простым массивом
 * @param {NavMenuItem} item - Элемент меню
 * @returns {boolean} true если dropdown является массивом с элементами
 */
export const isSimpleDropdown = (item) => {
    return Array.isArray(item?.dropdown) && item.dropdown.length > 0;
};

/**
 * Проверяет, является ли элемент dropdown ссылкой (isLink === true)
 * @param {NavDropdownItem} dropdownItem - Элемент dropdown
 * @returns {boolean} true если элемент является ссылкой
 */
export const isDropdownLink = (dropdownItem) => {
    return dropdownItem?.isLink === true;
};

/**
 * Проверяет, имеет ли элемент dropdown валидную ссылку
 * @param {NavDropdownItem} dropdownItem - Элемент dropdown
 * @returns {boolean} true если элемент имеет валидную ссылку (не пустую и не '#')
 */
export const hasValidLink = (dropdownItem) => {
    return dropdownItem?.link && dropdownItem.link !== '#';
};
