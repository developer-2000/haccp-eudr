# Header — актуальное состояние

## SCSS

- **Переменные:** `resources/scss/variables.scss` — цвета (`$primary-color`, `$text-red` и др.), типографика, отступы, `$breakpoint-lg`, радиусы, тени, переходы.
- **В компонентах header:** `@use "../../../../scss/variables" as *;`
- **Глобально:** `.container`, `.logo-link`, `.btn-client`, `.btn-primary` и т.д. в `resources/scss/app.scss`.
- **Скролл страницы:** только у `.main-content` (`app-wrapper` — `height: 100vh`, `overflow: hidden`; `.main-content` — `flex: 1`, `min-height: 0`, `overflow-y: auto`). Header и Footer не скроллятся.

---

## Что реализовано в Header (по пунктам)

1. **Лого**
   - Ссылка на главную с учётом локали (`safeLogo.link`), имя из `site.js`.

2. **Десктоп-меню**
   - Показывается при ширине > 1100px.
   - Пункты из `nav.js` через `NavMenuItem` (variant="desktop").
   - Все пункты без dropdown (в конфиге `hasDropdown: false`).

3. **Бургер / мобильное меню**
   - При ширине ≤ 1100px: кнопка с иконкой (bars/close), по клику открывается панель меню.
   - Иконка «закрыть» (крестик) при открытом меню — цвет `$text-red` (#d03050).

4. **Мобильная панель**
   - Полноэкранная под шапкой: `height: calc(100vh - 103px)`, `min-height: calc(100vh - 103px)`.
   - При открытии меню у `html` и `body` ставится `overflow: hidden` (убирается скролл и полоса прокрутки страницы).
   - При закрытии и в `onBeforeUnmount` — сброс.

5. **Переключатель языков в шапке**
   - Кнопки из `data-languages`, POST `/locale`, редирект на `/{locale}/...`.
   - При ширине ≤ 580px в шапке скрыт (CSS `display: none`).

6. **Переключатель языков в моб. меню**
   - При ширине ≤ 580px и наличии 2+ языков показывается первым блоком в открытом моб. меню, справа (`align-self: flex-end`).
   - По клику — смена локали и закрытие меню.

7. **CTA-кнопка**
   - Переход на `/{locale}/survey`.
   - Тексты из i18n: `messages.nav.cta.leave_request`, `messages.nav.cta.tell_about_business`, `messages.nav.cta.aria_icon_only` (lang: en/messages.php, ro/messages.php).
   - При ширине ≤ 1280px — только иконка `business-center-round` (@vicons/material), класс `nav-cta--icon-only`.
   - Размер иконки через `:deep(.xicon)` и `:deep(.xicon svg)`.

8. **Пункты меню (десктоп)**
   - Без переноса текста: `.nav-link { white-space: nowrap }`.
   - Стиль активного пункта (цвет, фон как при hover) и некликабельность только для ссылки на текущую страницу **без хеша** (на `/en` не подсвечиваются «How it works» и «For whom» с `/en#...`).
   - Класс `nav-link--exact-page` по вычислению `isExactPageLink` (path совпадает с `route.path` и в ссылке нет `#`).
   - Активный пункт: `pointer-events: none`, `cursor: default`.

9. **Пункты меню (мобильное)**
   - Тот же принцип активного пункта: класс `mobile-menu-item-simple--exact-page`, те же стили и некликабельность только для точной страницы без хеша.

10. **DropdownMenu**
    - Готов под `hasDropdown: true` и колонки; в `nav.js` таких пунктов пока нет.

11. **Типы и хелперы**
    - `nav.types.js`, `dropdownHelpers.js` используются.

12. **Breakpoints в Header**
    - `useBreakpoint(1101)` → моб. меню/бургер.
    - `useBreakpoint(1281)` → CTA только иконка.
    - `useBreakpoint(581)` → переключатель языков скрыт в шапке и показывается в моб. меню.
    - Медиа в стилях: `max-width: 1100px` для мобильных стилей, `max-width: 580px` для скрытия `.lang-switcher` в шапке.

13. **Доступность**
    - `aria-expanded`, `aria-label`, `role="navigation"`, `role="menu"`, `aria-hidden` у моб. меню.


## Где что находится

### Компоненты (Vue)

| Файл | Назначение |
|------|------------|
| `resources/js/components/client/header/Header.vue` | Шапка: лого, десктоп/моб. меню, переключатель языков, CTA. Брейкпоинты: 1101 (бургер), 1281 (CTA только иконка), 581 (языки в моб. меню). |
| `resources/js/components/client/header/NavMenuItem.vue` | Пункт меню: десктоп (ссылка или ссылка + dropdown), мобильный (аккордеон или простая ссылка). Активный пункт — только точное совпадение пути без хеша. |
| `resources/js/components/client/header/DropdownMenu.vue` | Выпадающее меню (колонки/список), десктоп и мобильный вариант. |

### Composables

| Файл | Назначение |
|------|------------|
| `resources/js/components/client/header/composables/useMobileMenu.js` | Состояние моб. меню (открыто/закрыто) и открытых dropdown в мобилке. |
| `resources/js/components/client/header/composables/useBreakpoint.js` | Реактивный breakpoint (аргумент в px), возвращает `isMobile` (true при width < breakpoint). |

### Утилиты и типы

| Файл | Назначение |
|------|------------|
| `resources/js/components/client/header/utils/dropdownHelpers.js` | `hasDropdownColumns`, `isSimpleDropdown`, `isDropdownLink`, `hasValidLink`. |
| `resources/js/components/client/header/types/nav.types.js` | JSDoc: `NavConfig`, `NavMenuItem`, `NavDropdown`, `NavLogo`, `NavActions` и др. |

### Конфиг и использование

| Файл | Назначение |
|------|------------|
| `resources/js/config/nav.js` | Конфиг навигации: `logo`, `menu` (label, link, hasDropdown). Сейчас все с `hasDropdown: false`. |
| `resources/js/config/site.js` | Имя сайта для лого. |
| `resources/js/basic/Index.vue` | Подключает `<Header />` для клиентской части. |

---
