/**
 * @fileoverview Типы для навигационной структуры
 * @typedef {Object} NavDropdownItem
 * @property {string} title - Заголовок элемента
 * @property {string} [description] - Описание элемента
 * @property {string} [link] - Ссылка элемента
 * @property {boolean} [isLink] - Является ли элемент ссылкой
 *
 * @typedef {Object} NavDropdownColumn
 * @property {string} title - Заголовок колонки
 * @property {NavDropdownItem[]} items - Элементы колонки
 *
 * @typedef {Object} NavDropdownWithColumns
 * @property {NavDropdownColumn[]} columns - Колонки dropdown
 *
 * @typedef {NavDropdownItem[]|NavDropdownWithColumns} NavDropdown
 *
 * @typedef {Object} NavMenuItem
 * @property {string} label - Название пункта меню
 * @property {string} link - Ссылка пункта меню
 * @property {boolean} [hasDropdown] - Есть ли у пункта dropdown
 * @property {NavDropdown} [dropdown] - Данные dropdown
 *
 * @typedef {Object} NavActionButton
 * @property {string} label - Текст кнопки
 * @property {string} link - Ссылка кнопки
 * @property {'primary'|'link'} type - Тип кнопки
 *
 * @typedef {Object} NavSearch
 * @property {string} placeholder - Плейсхолдер поля поиска
 * @property {boolean} enabled - Включен ли поиск
 *
 * @typedef {Object} NavActions
 * @property {NavSearch} search - Настройки поиска
 * @property {NavActionButton[]} buttons - Кнопки действий
 *
 * @typedef {Object} NavLogo
 * @property {string} text - Текст логотипа
 * @property {string} link - Ссылка логотипа
 *
 * @typedef {Object} NavConfig
 * @property {NavLogo} logo - Настройки логотипа
 * @property {NavMenuItem[]} menu - Пункты меню
 * @property {NavActions} actions - Действия (поиск, кнопки)
 */

export {};
