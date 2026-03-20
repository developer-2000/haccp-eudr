# `/#how-it-works` — АКТУАЛЬНОЕ СОСТОЯНИЕ

**Дата актуализации:** 2026-03-20  
**Маршрут:** `/{locale}/how-it-works`  
**Текущая цель страницы:** показать процесс внедрения и выгоды для SME food business.

---

## Что реально подключено в коде **✅ Выполнено**

Страница `resources/js/pages/client/HowWorks.vue` сейчас рендерит только:

1. `StepsSection`
2. `AdvantagesSection`
3. `SurveyCtaSection` (из home)

Что было удалено и не используется:

- `HeroIntroSection`
- `ProblemSection`
- `SolutionSection`
- `MetricsSection` (how-it-works)
- `TestimonialsSection`
- `FinalCtaSection`

---

## 1) `StepsSection` **✅ Выполнено**

**Файл:** `resources/js/components/client/how-it-works/StepsSection.vue`  
**Для чего:** основной сценарий «как это работает» в формате timeline + карточки.

### Текущая структура

- Заголовок секции: `Steps`
- Список шагов: 7 карточек
- Левая колонка с номером шага растянута по всей высоте карточки
- В заголовках шагов используются иконки через `Icon.vue`
- Внутри шага есть список конкретных выгод/действий (`ul.step-block__benefits`)

### Актуальные шаги (как в коде сейчас)

1. **Download + Setup** (`laptop-mac-twotone`)
2. **Monitoring** (`control-twotone`)
3. **CCP Automation** (`coffee-maker-twotone`)
4. **Checklist** (`schedule-twotone`)
5. **QR Inspector** (`qr-code-twotone`)
6. **Dashboard + Alerts** (`dashboard-twotone`)
7. **EUDR Export** (`tag-export`)

### Визуальные особенности

- Вертикальная линия timeline
- Карточки с border + shadow
- Кастомные круглые маркеры у `li`
- Поддержка иконок `material`, `antd`, `carbon` через общий `Icon.vue`

---

## 2) `AdvantagesSection` **✅ Выполнено**

**Файл:** `resources/js/components/client/how-it-works/AdvantagesSection.vue`  
**Для чего:** кратко показать ключевые выгоды по категориям.

### Текущая структура

- Заголовок: `WHAT YOU GET`
- Сетка карточек 1/2/3 колонки в зависимости от breakpoint
- 6 карточек категорий с буллетами

### Категории в коде

- 30 minutes = everything ready
- Full control 24/7
- Checklist like Instagram
- Inspector scans → OK
- Dashboard like Apple
- EUDR export without risk

---

## 3) `SurveyCtaSection` **✅ Выполнено**

**Файл подключения:** `resources/js/pages/client/HowWorks.vue`  
**Компонент:** `resources/js/components/client/home/SurveyCtaSection.vue`  
**Для чего:** финальный CTA-блок на опрос/лид.

---

## Технические примечания **✅ Выполнено**

- Для иконок в шагах добавлены и используются:
  - `laptop-mac-twotone`
  - `coffee-maker-twotone`
  - `dashboard-twotone`
  - `control-twotone`
  - `tag-export`
- `@vicons/carbon` установлен (для `tag-export`)
- `ControlTwotone` берётся из `@vicons/antd`

---

## Что важно помнить при следующих правках

1. Обновлять этот документ только по факту изменений в `HowWorks.vue` и `how-it-works/*`.
2. Не возвращать старые удалённые секции без явной задачи.
3. Если меняются тексты шагов, синхронно обновлять этот md.

