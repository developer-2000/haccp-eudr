# Главная страница — план разработки

## SCSS и общее

- **Переменные:** `resources/scss/variables.scss` — цвета, типографика, отступы, радиусы, тени, переходы.
- **В компонентах/секциях:** `@use "путь к scss/variables" as *;`
- **Контейнер:** общий `.container` из `app.scss`; секции выравнивать по нему.
- **Страница:** `resources/js/pages/client/Home.vue` — собирает все блоки главной по порядку.

---

## Список блоков (4 блока)

| # | Блок | Высота | Статус |
|---|------|--------|--------|
| 1 | HERO | — | ✅ Сделан |
| 2 | METRICS | 400px | ✅ Выполнено |
| 3 | НИШИ | 500px | ✅ Выполнено |
| 6 | SURVEY CTA | 300px | ✅ Выполнено |

---

## 1. HERO (сделан) **✅ Выполнено **

- Реализован в `Home.vue`: заголовок, описание, кнопки (Survey, View Demo), изображение справа.
- Адаптив: колонка на mobile, ряд на desktop. Стили в том же файле.

---

## 2. METRICS СЕКЦИЯ — ПОЛНЫЙ ПЛАН (400px высота) **✅ Выполнено **

**Где сделано:**  
`resources/js/components/client/home/MetricsSection.vue`  
`resources/js/pages/client/Home.vue`  

**Что сделано:**  
4 карточки реализованы через массив `metricCards` и один `v-for`.  
Разметка карточек: header (иконка + заголовок) и body (строки слева + опциональный правый столбец).  
Иконки: material/antd через `Icon.vue`, цвета по классам (`wallet/time/inspection/eudr`) и переменным из `variables.scss`.  
Адаптив: сетка 2 колонки, а `metric-card-body--savings` на ширине ≤900px становится колонкой.  


---

## 3. НИШИ — план **✅ Выполнено **

**Где сделано:**  
`resources/js/components/client/home/NichesSection.vue`  
`resources/js/pages/client/Home.vue`  

**Что сделано:**  
Секция ниш реализована как `NichesSection` и выводит **4 карточки** (3 ниши + «Другие ниши?»).  
Карточки рендерятся из массива `niches` по `v-for` и используют поля `id, emoji, title, subtitle, points, result, cta`.  
Навигация через `vue-router` с учётом локали: для coffee/bakery/meat переход на `/{locale}/demo`, для `other` — на `/{locale}/survey`.  

Макет: 1 колонка на mobile, затем 2 и 3 колонки на брейкпоинтах.  
Карточка `other` получает `grid-column: 1 / -1` (на больших экранах) и сбрасывается в `auto` на `max-width: $breakpoint-lg`, чтобы **3-я карточка не перепрыгивала** на 1024 и ниже.  

Стили: одинаковая высота карточек (`min-height`), hover — через `box-shadow`/бордер, фон задаётся родителю секции (`$bg-light-primary`).  

---

## 6. SURVEY CTA — план после NichesSection **✅ Выполнено **

**Где вставить в `Home.vue`:**
```
<div class="section-container-home section-container--home-niches">
    <div class="container">
        <NichesSection />
    </div>
</div>
```
- Сразу после этого блока.
- Компонент: `SurveyCtaSection.vue`.

**Высота секции:** 300px.

**Макет:**
- Фон белый `#ffffff`.
- Заголовок (один из вариантов в i18n):
Расскажите, как ведёте HACCP/EUDR — настроим прототип под вас».
- Одна кнопка : «TELL US ABOUT BUSINESS» / «Заполнить опрос (5 минут)» — зелёная, полная ширина на mobile.
- Кнопка ведёт на `/{locale}/survey` (как в Header).

---

