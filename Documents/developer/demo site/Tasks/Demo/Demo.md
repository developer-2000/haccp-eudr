# План реализации `resources/js/pages/client/Demo.vue`

## Цель

Собрать конверсионную демо-страницу `/{locale}/demo` (Vue 3 + SCSS + Naive UI): layout, секции HACCP/EUDR/отчёты, модалки, persist в `localStorage`, публичные страницы партии и дневного отчёта (отдельные URL, Laravel отдаёт SPA).

## Архитектура Demo

### +++
### Базовый каркас страницы
### +++

 - страница демо разделенная на левое меню переключения по секциям демо и ленивая подгрузка секций по компонентно.

### +++
### Dashboard секция
### +++

 - 5 показателей
   - Выполненные задачи
   - Процент выполненных
   - Критические CCP (количество статусов problem в задачах)
   - Без назначенного ответственного в задачах
   - Инспекция (дата инспекции)

 - Внутренняя секция - Hot tasks
   - Карточки задач

### +++
### Checklists секция
### +++

- Табы ниш: Кофейня / Пекарня / Мясо
- Кнопка «Добавить» → новая Задача у активного таба
- Сетка карточек CCP по выбранной нише; пустое состояние, если задач нет

### +++
### Персонал секция
### +++

- Табы площадок: Grain & Fire Roastery / Piotr Bakery / Columbus Meat Processing (связь с нишами демо — кофейня / пекарня / мясо)
- Под табом — адрес площадки (если задан в данных)
- Таблица работников у каждой площадки
  - ФИО
  - должность
  - телефон
  - email
  - статус
  - кнопки событий «Изменить» / «Удалить»
- Mobile: карточки с теми же полями и действиями

### +++
### EUDR QR (сырье) секция
### +++

- Таблица партий
  - ID партии
  - Продукт
  - Поставщик
  - Дата
  - Статус
  - кнопки событий «Показать QR»

### +++
### Reports секция
### +++

 - Внутренняя секция - Публичный отчёт
   - Блок с URL дневного отчёта (день из demo state)
   - кнопки событий «Копировать» / «Перейти» по ссылке

 - Внутренняя секция - «Дневной подробный отчёт»
   - Таблица задач (дата, точка, значение, ответственный, фото, статус)
   - Таблица поставок сырья (дата, точка, значение, фото, статус)

 - Нижняя панель
   - «Скачать PDF» / «Инспектору» — демо-сообщения (без реальной отправки)


### +++
### Описание Задачи в приложении
D:\ystanovki\OSPanel_6.4.5\home\haccp-eudr\Documents\developer\demo site\Tasks\Demo\описание задачи.md


## Структура файлов (актуально)

**Страница демо и layout**

- `resources/js/pages/client/Demo.vue` — страница `/demo`, top bar, sidebar, секции, метрики/hot tasks, даты.

**Секции демо**

- `resources/js/components/client/demo/sections/DashboardSection.vue`
- `resources/js/components/client/demo/sections/ChecklistsSection.vue`
- `resources/js/components/client/demo/sections/EudrSection.vue`
- `resources/js/components/client/demo/sections/ReportsSection.vue`
- `resources/js/components/client/demo/sections/PersonnelSection.vue` — персонал по площадкам (этап 9.3)

**Модалки**

- `resources/js/components/client/demo/modals/ChecklistModal.vue`
- `resources/js/components/client/demo/modals/EudrQrModal.vue`

**Состояние и данные**

- `resources/js/composables/useDemoState.js`
- `resources/js/data/demoPersonnel.js` — дефолтные `sites` / `staff`, карта назначений по задачам
- `resources/js/utils/demoStaff.js` — merge и санация ответственных в чек-листах
- `resources/js/data/eudrBatchPublic.js` — партии EUDR, URL `/batch/:id`
- `resources/js/data/dailyReportPublic.js` — снимок дневного отчёта, URL `/report/:date`

**Публичные страницы (не только демо-лейаут с Header)**

- `resources/js/pages/client/BatchPublic.vue`
- `resources/js/pages/client/DailyReportPublic.vue`
- `resources/js/router.js` — маршруты `/batch/:batchId`, `/report/:date` на уровне приложения

**Backend (Laravel)**

- `routes/web.php` — маршруты `/batch/{id}`, `/report/{date}` → `index-client` для SPA


### +++
### AI функционал температуры
### +++
D:\ystanovki\OSPanel_6.4.5\home\haccp-eudr\Documents\developer\demo site\Tasks\Demo\AI temperature functions.md




