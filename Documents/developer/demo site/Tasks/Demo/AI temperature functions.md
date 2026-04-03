### +++

### Логика и функционал AI (Температура)

### +++

#### Обязательный функционал

- Нужен отдельный JS-класс (или модуль-класс) для температурной AI-аналитики по нишам:
    - `meat` (мясо)
    - `coffee` (кофе)
    - `bread` (хлеб)

- В классе должны быть:
  - данные ниш (CCP-лимиты, тексты угроз, экономические и инспекционные последствия)
  - методы анализа текущего значения против диапазона задачи
  - методы формирования финального текста/статуса для модалки «Детали задачи»

#### Модель анализа (вход)

- Вход:
  - `niche`
  - `currentValue`
  - `ccpMin`, `ccpMax` (диапазон из задачи)
  - опционально `zoneType` / `mode` (например, хранение vs морозильник)

- Если у задачи есть диапазон, AI обязан:
  - определить, в норме ли показатель
  - посчитать отклонение от допустимого диапазона
  - определить направление (`too_high` / `too_low`)
  - вернуть риск в процентах и человекочитаемое предупреждение

- Если значение в диапазоне:
  - предупреждение не показывается (`null` / `ok`)
  - допустим информационный вариант «в пределах CCP» (см. закон статусов в коде)

- Если значение вне диапазона:
  - показываем аварийный AI-блок в модалке
  - выводим риск, угрозу, экономику, инспекцию, корректирующее действие

#### Бизнес-логика

- Один тип задачи (температура) анализируется по-разному по нише.

- Пример:
  - нища `meat` → мясные угрозы и нормативы, не универсальный текст

- Визуал «для предпринимателя»:
  - явный префикс риска
  - причина отклонения
  - конкретная угроза
  - понятное действие

#### Минимум по нишам

- `meat`:
  - chilled: контроль границ (пример `<= +2°C` в профиле)
  - превышение: патогены (`Salmonella` / `E.coli`)
  - морозилка: слишком низко → `freezer burn`, потеря влаги/веса

- `coffee`:
  - диапазон хранения (пример `15..25°C`)
  - выход → качество / микотоксины (проектная формулировка)

- `bread`:
  - расстойка (пример `24..28°C`)
  - выход → технологические и микробиологические риски

#### Модалка «Детали задачи»

- AI-блок только при нарушении диапазона (см. закон статусов ниже).

- Содержимое блока (поля в объекте вердикта):
  - заголовок с риском
  - норматив CCP
  - текущее значение и отклонение
  - угроза
  - экономика
  - инспекция
  - действие

---

### +++
### План реализации AI (Температура)
### +++

## 1 **Выполнено** Подготовка структуры AI-модуля

- Файл `resources/js/features/demo/ai/temperature/TemperatureAiAnalyzer.js`.

- Экспорты:
  - класс `TemperatureAiAnalyzer`
  - фабрика `createTemperatureAiAnalyzer()`

- Методы:
        - `getProfiles()`
        - `analyzeTemperature()`
        - `getHaccpWarning()` — только при **`status === "problem"`** (отклонение CCP)
        - `getHaccpInRangeDisplay()` — при **`status === "ok"`** и нише **`meat`**: снимок из **`meatStorageThreatBands`** (угроза/действие по полосе); иначе `null`

## 2 **Выполнено** Конфигурация ниш и режимов

- `TEMPERATURE_PROFILES` в `TemperatureAiAnalyzer.js`.

- Режимы:
        - `meat.chilled`
        - `meat.freezer`
        - `coffee.storage`
        - `bread.proofing`

- В режиме: диапазон, label, угрозы high/low, экономика, инспекция, действия, `riskSlope`.

## 3 **Выполнено** Ядро анализа

- `analyzeTemperature(params)`:
  - `toFiniteNumber`
  - `status: "invalid"` при невалидном вводе
  - `resolveProfileContext`, `resolveCcpRange`
  - `inRange`, `direction`, `deviationFromLimit`, `calculateRisk`
  - полный объект результата (см. код)

## 4 **Выполнено** UI-адаптер для модалки

- `getHaccpWarning`:
  - если не `problem` → `null`
  - если `problem` → объект полей для UI

- `getHaccpInRangeDisplay`:
  - если не `ok` или нише не **`meat`** → `null`
  - если замер в CCP и мясо → объект того же shape, **`ai_status: "ok"`**, тексты **`threat` / `action`** из **`resolveMeatStorageBand`** (`meatStorageThreatBands.js`)

- Поля объекта см. `DEMO_TEMPERATURE_MEASUREMENT_AI_WARNING_SHAPE` в `task_grain_cooling/config.js` (**`ai_status`**: `ok` | `warning` | `problem`).

- **`ai_status` при нарушении CCP:** по расчётному **`risk`** % — **`warning`** или **`problem`** (порог **`70`** в `TemperatureAiAnalyzer`, константа **`AI_STATUS_PROBLEM_MIN_RISK_PERCENT`**). Цвет только из **`aiWarning.ai_status`**. Поля **`severity`** и **`status`** внутри **`aiWarning`** не используются (legacy удаляется при нормализации).

- `formatTemperatureValue` для строк текущего значения и отклонения.

## 5 **Выполнено** Интеграция ShowTaskModal / таблица замеров

- Write-path: `applyPendingMeasurementFromKeypadOk.js`:
  - **`measurement.status === "success"`** (замер в CCP) → **`getHaccpInRangeDisplay`** → **`measurement.aiWarning`** (только **мясо**; у кофе/хлеба **`aiWarning`** остаётся **`null`**)
  - **`measurement.status === "problem"`** → **`getHaccpWarning`** → **`measurement.aiWarning`**
  - контекст → `task.aiContext`

- Не-температурные поля: `measurement.aiWarning = null`.

- Модалка не вызывает AI — только читает объект задачи.

- `TaskMeasurementsTable`: read-only, данные из `item.aiWarning`.

- Модель: `aiContext` на задаче, `aiWarning` на строках замеров.

#### Хранение результата

- Вердикт AI нельзя держать только во transient state модалки — он теряется при закрытии.

- На объекте задачи демо-чеклиста (элемент `checklistsByNiche[…]`):
  - каждый слот: `task.measurements[i].aiWarning` — готовый вердикт или `null`
  - задача: `task.aiContext` — метаданные движка и лимитов

- Вместе с сохранением `demoState` (например в `localStorage`) уезжают и эти поля, если демо пишет state.

#### Поля `task.aiContext` (контракт)

- Канонический набор ключей: **`DEMO_TEMPERATURE_TASK_AI_CONTEXT_SHAPE`**.

- Файл:
  - `resources/js/features/demo/task_grain_cooling/config.js`

- Поля (как в shape; значения в рантайме подставляет модель / write-path):
  - `engine` — строка, для демо: `"temperature-v1"`
  - `niche` — `string | null` (ниша задачи для выбора профиля AI)
  - `mode` — `string | null` (например `chilled`, `freezer`, `storage`, `proofing`)
  - `taskType` — для температурных задач: `"temperature"`
  - `ccpMin` — `number | null`
  - `ccpMax` — `number | null`
  - `ccpLabel` — строка, человекочитаемая подпись диапазона CCP
  - `updatedAt` — ISO-строка времени последнего обновления контекста или `null`

#### Поля `measurement.aiWarning`

- **`null`** — нет разборимого °C, нет температурного поля, слот **`pending`**, либо **успешный замер не мяса** (кофе/хлеб: блок AI не заполняем).

- **Отклонение CCP** — объект из **`getHaccpWarning`**: **`ai_status`** **`warning`** | **`problem`**, `risk`, `threat`, `action`, …

- **Успех по CCP и ниша мясо** — объект из **`getHaccpInRangeDisplay`**: **`ai_status: "ok"`**, тексты из **`meatStorageThreatBands`** (полоса по фактической °C).

- Shape: `DEMO_TEMPERATURE_MEASUREMENT_AI_WARNING_SHAPE`; дублирующего **`status`** внутри **`aiWarning`** нет.

---

### -----
### Закон цвета AI-блока (показатель → цвет)
### -----

**Один показатель задаёт цвет:** поле **`measurement.aiWarning.ai_status`** в уже сохранённом объекте вердикта.

#### Логика назначения `aiWarning.ai_status`

- **Кто пишет в строку**  
  - **`applyPendingMeasurementFromKeypadOk.js`** и **`seedChecklistsTemperatureAi.js`**.  
  - При **`analyzeTemperature` → `problem`**: объект из **`getHaccpWarning`**.  
  - При **`analyzeTemperature` → `ok`** и нише **`meat`**: объект из **`getHaccpInRangeDisplay`** (тексты из **`meatStorageThreatBands`**).  
  - При **`ok`** и нише не мясо: **`measurement.aiWarning`** не заполняем (**`null`**).

- **Нарушение CCP (`status === "problem"` в анализе)**  
  - Валидное °C, валидный диапазон, **`t`** вне **`[ccpMin .. ccpMax]`**.  
  - **`ai_status`**: **`warning`** или **`problem`** по **`risk`** и порогу **`70`** (**`AI_STATUS_PROBLEM_MIN_RISK_PERCENT`**).  
  - Для **мяса** **`threat` / `action`** из **`meatStorageThreatBands`**; для остальных ниш — из профиля в **`TemperatureAiAnalyzer`**.

- **Норма по CCP (`status === "ok"` в анализе)**  
  - Для **мяса**: **`ai_status: "ok"`**, зелёный модификатор **`--ok`**, **`threat` / `action`** из полосы по фактической °C.  
  - Для **кофе/хлеба**: **`aiWarning`** не создаём.

- **Нет вердикта**  
  - **`invalid`**, пустой слот, нет числа в **`value`**, нет лимитов — **`aiWarning === null`**.

#### Стили задаются в **`TaskMeasurementsTable.vue`** (классы `checklist-modal__ai-warning`, модификаторы `--warning` / `--problem` / `--ok`). Токены: **`resources/scss/variables.scss`**.

- Значение **`warning`** (`risk < 70` при нарушении CCP, либо fallback в шаблоне если `ai_status` пустой)
  - Шарик-метка цвета: 🟠
  - Акцент: **`$accent-orange`** = **`#f0a020`**
  - Оформление: базовый **`.checklist-modal__ai-warning`** — фон **`rgba($accent-orange, 0.08)`**, рамка **`rgba($accent-orange, 0.35)`** (модификатор **`--warning`** в разметке усиливает схему базы).

- Значение **`problem`** (`risk >= 70` при нарушении CCP)
  - Шарик-метка цвета: 🔴
  - Акцент: **`$text-red`** = **`#d03050`**
  - Оформление: **`.checklist-modal__ai-warning--problem`** — фон **`rgba($text-red, 0.08)`**, рамка **`rgba($text-red, 0.35)`**.

- Значение **`ok`** — **мясо**, замер **в CCP**: вывод **`getHaccpInRangeDisplay`**, модификатор **`--ok`**, 🟢 **`$text-green`**.

**Нарушение CCP:** в вердикте **`ai_status`** — **`warning`** или **`problem`** по **`risk`** и порогу **`70`**; оба означают «есть что исправлять», сила тревоги разная.

**Норма по CCP (мясо):** **`ai_status: "ok"`** — отдельный зелёный сценарий, не смешивать с предупреждением выше.







