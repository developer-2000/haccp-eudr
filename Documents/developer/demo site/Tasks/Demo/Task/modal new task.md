# Модалка «Новая задача» → объект задачи (демо)

Карта **смыслов и полей**:

- что пользователь видит в форме;
- что уходит в payload;
- что получается в `demoState`.

Детальное описание сущности задачи без привязки к модалке — в **`Task/описание задачи.md`**.

---

## Код: точки входа

- **UI модалки**  
  `resources/js/features/demo/components/modals/create_task_modal/CreateTaskModal.vue`

- **Секция «Суть задачи» и ответы исключений**  
  `resources/js/features/demo/components/checklist/ChecklistTaskFieldsSection.vue`

- **Черновик по умолчанию и сборка payload**  
  `resources/js/features/demo/domain/checklistTaskModel.js`  
  функции: `createModalDraft`, `buildTaskPayloadFromDraft`, `buildTaskFromPayload`

- **Опции типа поля по охвату**  
  `resources/js/config/tasks.js`  
  функция: `taskFieldTypeOptionsByScopeType`

- **Вставка в state**  
  `resources/js/features/demo/composables/useDemoState.js`  
  `addChecklistTask` → `buildChecklistTaskFromPayload`  
  файл: `resources/js/features/demo/composables/demoChecklistCustomTask.js`

---

## 1. Цепочка данных

1. **Черновик** (`addForm` в `CreateTaskModal`)

   - реактивный объект;
   - поля **только для UI**: `scheduleSlotCount`;
   - исключения в виде `correctiveActionRows`.

2. **Payload**

   - результат **`buildTaskPayloadFromDraft`**;
   - плоский объект без UI-обёрток;
   - готов для модели.

3. **Задача в state**

   - **`buildTaskFromPayload`** с `source: "custom"`;
   - добавляются: `id`, `niche`, `isCustom`, `status`, `measurements`;
   - при необходимости: `scope`, `equipmentTargetIds`, `roomTargetIds`;
   - для температуры: начальный **`aiContext`**;
   - слоты замеров в **`pending`**.

**Ниша `niche`**

- в объект **не** из формы;
- берётся из **активного таба** чек-листа:  
  `activeNiche` → `addChecklistTask(niche, payload)`.

---

## 2. Модалка: шаги и блоки

Мастер из **2 шагов** (`ADD_WIZARD_STEPS`).

Закрытие:

- по крестку или «Отмена»;
- без закрытия по клику на маску и по Esc  
  (`mask-closable`, `close-on-esc` = false).

После закрытия:

- **`resetAddForm`** на `@after-leave`.

### Шаг 1

- **Название** (`title`)  
  обязательно для кнопки «Далее».

- **Тип задачи** — только два варианта:

  - **Оборудование** (`equipment`);
  - **Комнаты** (`rooms`).

- **`standalone`** в конструкторе **не показывается**.  
  Остаётся в модели для **сидов** и legacy.

- **Детали задачи**

  - Для **equipment** и **rooms**: **ответственный обязателен**  
    (проверка `resolveAssigneeIdForNiche` по площадке нише).

  - Ветка «необязательный ответственный» в шаблоне — для `standalone`.  
    При двух radio она **не используется**.

  - **Частота** — селект, коды в `demoChecklistTaskFrequency.js`:

    - `custom` — подпись «Регулярно»;
    - `daily` — «Один раз в день»  
      (принудительно **1** повтор в день, число слотов отключено);
    - `weekly` — «Раз в неделю»  
      (один день недели, single-select по кнопкам).

  - **Рабочие дни**  
    Пн…Вс, минимум один день.  
    Для `weekly` — ровно один активный день.

  - **Начало старта задачи**  
    дата не раньше сегодня.

  - **Повторений в день**  
    `n-input-number` → в черновике **`scheduleSlotCount`**  
    (только UI, в payload не попадает).

  - **Время выполнения**  
    по одному `n-time-picker` на повтор, формат **`HH:mm`**.  
    Пустые/битые значения подменяются равномерной сеткой по суткам (watch в модалке).

### Шаг 2

- **Предмет задачи**

  - `equipment`: выбор **группы**, затем чекбоксы id.  
    Смена группы сбрасывает выбор.  
    При отправке — минимум один id.

  - `rooms`: чекбоксы по **`ROOM_GROUPS`**.  
    При отправке — минимум одно помещение.

- **Суть задачи**  
  компонент `ChecklistTaskFieldsSection`  
  (подробности — раздел 3 ниже).

- **Корректировки в отчёте**  
  `allowAssigneeReportCorrections` (switch).

### Кнопки футера

- Шаг 1: **Отмена**, **Далее**.

- Шаг 2: **Отмена**, **Назад**, **Добавить** (`submitAddTask`).

### Валидация

- **Далее**

  - непустой `title`;
  - для equipment/rooms — валидный ответственный.

- **Добавить**

  - снова ответственный;
  - расписание (`validateScheduleFields`);
  - цели (оборудование или комнаты);
  - **`validateTaskFieldsSection`**:
    - минимум одно поле «Суть задачи»;
    - заполненность по типу поля;
    - для всех типов **кроме** `single_choice` —  
      хотя бы одна непустая строка в **ответах исключений**.

---

## 3. Секция «Суть задачи» (форма → payload)

- В UI **не больше одной** строки поля:  
  `addRow` добавляет строку только если массив пуст  
  (`length >= 1` → выход).

- В payload уходит **`taskFieldDefinitions`** как массив  
  (после **`normalizeTaskFieldDefinitions`**).  
  Из этой модалки фактически **0…1** элемент.

**Типы поля по охвату** (`config/tasks.js`):

- при **`taskScopeType === equipment`**  
  в селекте: `temperature`, `single_choice`, `ticket`;

- при **`taskScopeType === rooms`**  
  в селекте: `single_choice`, `ticket`  
  (температуры нет).

**Конфиг по типам** (валидация в `CreateTaskModal`):

- **`temperature`**

  - обязательны числовые `minC`, `maxC` в `config`;
  - подпись `label` нормализуется (по умолчанию «Температура»);
  - опционально `showCamera` — в форме создания чекбокса **нет**,  
    поле может прийти из сидов или нормализации.

- **`single_choice`**

  - `question`;
  - массив `options` — минимум один непустой вариант.

- **`ticket`**

  - непустой `description`.

**Ответы исключений**

- В черновике: **`correctiveActionRows`**: массив `{ id, text }`.

- Блок в UI показывается, если выбран тип поля **и** это **не** `single_choice`.

- В payload: **`correctiveActions: string[]`** — непустые `text` из строк.  
  Либо legacy `draft.correctiveActions` в **`normalizeModalDraft`**,  
  если из rows ничего не собралось.

---

## 4. Payload в `addChecklistTask`

Формируется **`buildTaskPayloadFromDraft`**  
(внутри — **`normalizeModalDraft`**).

**Поля payload:**

- **`title`** — строка.

- **`taskScopeType`** — `equipment` или `rooms` из формы;  
  иначе нормализация к `equipment`.

- **`assignedStaffId`** — `string` или `null`.

- **`frequency`** — код частоты.

- **`startDate`** — timestamp начала дня или `null`.

- **`repeatTimes`** — `string[]`, формат `HH:mm`, длина ≥ 1.

- **`activeWeekdays`** — уникальные `mon` … `sun`.

- **`equipmentTargetIds`** — нормализованный массив id.

- **`roomTargetIds`** — нормализованный массив id.

- **`taskFieldDefinitions`** — нормализованные определения полей.

- **`allowAssigneeReportCorrections`** — `boolean`.

- **`correctiveActions`** — `string[]`.

**Не входит в payload:**

- **`scheduleSlotCount`**  
  только задаёт число полей времени в UI.  
  Итог — по длине **`repeatTimes`**.

- **`repeatsPerDay`**  
  в задаче не хранится.  
  В **`normalizeModalDraft`** legacy может поднять число слотов,  
  если нет валидных времён.

- **`niche`**  
  передаётся вторым аргументом `addChecklistTask`,  
  не полем формы.

---

## 5. Объект задачи после `buildTaskFromPayload` (custom)

К payload добавляются (см. код `buildTaskFromPayload`):

- **`id`** — `custom-${niche}-${uuid}`.

- **`niche`** — как у таба.

- **`isCustom`** — `true`.

- **`status`** — агрегат boolean  
  (`resolveTaskAggregateOk`; по умолчанию в норме, если не задано иное).

- **`measurements`** — по **`repeatTimes`**:  
  слоты с `time`, `value: "—"`, `status: "pending"`, `aiWarning: null`  
  (и прочее по ветке custom).

- **`scope`** — `'standalone'` только если `taskScopeType === 'standalone'`  
  (из этой модалки не приходит).

- **`aiContext`** — если первое поле **temperature**,  
  стартовый объект из **`buildTaskAiContext`**  
  (`mode: null` до замеров или сида).

**Остальные свойства задачи** — тот же набор, что перечислен в **разделе 5** файла **`Task/описание задачи.md`**.  
При расхождении с кодом приоритет у **кода**.

### 5.1 Идентичность и смысл

- **`id`**, **`niche`**, **`title`**, **`isCustom`**, **`status`** (агрегат задачи).

### 5.2 Охват

- **`taskScopeType`** — в данных возможен и **`standalone`** (сиды).

- **`equipmentTargetIds`** / **`roomTargetIds`** — только для соответствующего типа.

- **`scope`** — `'standalone'` при standalone.

### 5.3 Ответственный и отчёт

- **`assignedStaffId`**

- **`allowAssigneeReportCorrections`**

### 5.4 Расписание

- **`frequency`**, **`startDate`**, **`activeWeekdays`**, **`repeatTimes`**  
  согласованы с числом слотов **`measurements`**.

### 5.5 Суть задачи и исключения

- **`taskFieldDefinitions`** — обычно один элемент из модалки создания.

- **`correctiveActions`** — при наличии.

### 5.6 Слоты замеров

- **`measurements[]`**:  
  `time`, `value`, `status` (`success` | `problem` | `pending`);  
  далее по сценарию: `aiWarning`, `correctiveAction`, `comment` и т.д.

---

## 6. Слот `measurements[]` (контракт)

- **`time`** — `HH:mm`.

- **`value`** — строка отображения или `—` для невыполненного.

- **`status`** — `success` | `problem` | `pending`.

- **`aiWarning`**, **`correctiveAction`**, **`comment`** —  
  по мере использования панели выполнения и модалки деталей.

В таблице замеров в UI статус слота показывается **как есть** (строка).

---

## 7. AI (температура) в объекте задачи

Цель:

- вердикт считается при **записи** замера или при обогащении сидов;
- в таблице — **только чтение** `measurement.aiWarning`.

### 7.1 `task.aiContext`

У температурных задач:

- `engine`, `niche`, `mode`, `taskType`, `ccpMin`, `ccpMax`, `ccpLabel`, `updatedAt`;

- см. `buildTaskAiContext`;

- обновление: `applyPendingMeasurementFromKeypadOk`, **`seedChecklistsTemperatureAi`**.

### 7.2 `measurement.aiWarning`

- **`null`**, если:

  - слот `pending`;
  - нет разборимого числа °C в `value`;
  - нет температурного поля;
  - **успешный замер не мяса** (кофе/хлеб — блок AI не записываем).

- Иначе — объект для блока под «Решение» в `TaskMeasurementsTable`.

**`ai_status`** (в объекте **`measurement.aiWarning`**, см. shape в конфиге):

- **`ok`** — **мясо**, замер в допуске CCP: **`getHaccpInRangeDisplay`**, тексты из **`meatStorageThreatBands`**.

- **`warning`** / **`problem`** — отклонение CCP: **`getHaccpWarning`**. Дублирующего **`status`** внутри **`aiWarning`** нет.

Дополнительно в объекте: `direction`, `risk`, `currentLine`, `deviationLine`, `ccpLabel` и др. (по сценарию).

### 7.3 Когда заполняется

- При ✓ в панели выполнения температуры:  
  `applyPendingMeasurementFromKeypadOk.js`.

- При создании дефолтного state и при загрузке из `localStorage`:  
  **`seedChecklistsTemperatureAi`**  
  для строк с парсабельным `… °C`.

---

## 8. Сиды и модалка

- Дефолтные задачи:  
  **`demoDefaultState.js`**, **`demoStateChecklistSeed.js`**,  
  сборка **`buildDefaultTask`**, **не** через эту модалку.

- В сидах возможны:

  - готовые **`measurements`** с `value` и `status`;
  - **`correctiveActions`**;
  - иной **`status`** задачи.

- После загрузки state AI по температуре может **доначисляться** сидером  
  (см. п. 7.3).

---

При расхождении документа с репозиторием приоритет у **кода**.
