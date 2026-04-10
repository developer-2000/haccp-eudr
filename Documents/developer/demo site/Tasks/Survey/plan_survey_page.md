# Survey Page (HACCP Project)


## 🧩 Шаг 1 — Архитектура вопросов DB, Seeders, выдача их клиенту

Детальное соответствие полей опроснику и фронту: раздел **6.12** ниже по документу.

### **✅ Выполнено** 1.1. Миграция таблицы `survey_questions`

- `database/migrations/2026_04_07_120000_create_survey_questions_table.php`
- Добавлены ключевые поля вопроса: `stable_id` (unique), `question_text`, `type`, `sort_order`, `is_active`.
- Добавлены JSON-поля для UI-логики: `options`, `option_groups`, `branches`.
- Добавлены служебные/UX-поля: `subtitle`, `field_caption`, `checkbox_allow_empty`, `other_detail_field_label`, `country_iso_select`, `text_multiline`, `text_rows`, `text_allow_empty`.
- Индекс: `(is_active, sort_order)`.

### **✅ Выполнено** 1.2. Модель `SurveyQuestion`

- `app/Models/SurveyQuestion.php`
- Константы типов: `TYPE_RADIO`, `TYPE_CHECKBOX`, `TYPE_SELECT`, `TYPE_TEXT`.
- Метод `typeValues()` для единого списка валидных типов.
- Настроены `$fillable` и `$casts` (JSON/флаги/числа).

### **✅ Выполнено** 1.3. Сидер и первичное наполнение из стаба

- `database/seeders/SurveyQuestionsSeeder.php`: загрузка вопросов из `surveyQuestionsStub.js` в БД.
- Сохранение через `updateOrCreate` по `stable_id` (seed идемпотентный).
- В БД заполняются тексты, типы, опции, ветвления и UX-поля; `stable_id` совпадает с фронтовым `id`.
- `sort_order` выставлен для стабильной сортировки.
- `database/seeders/DatabaseSeeder.php`: подключён `SurveyQuestionsSeeder::class`.

### 1.4. Валидное хранение и правила целостности

1. **`radio` и `select`** без **`country_iso_select`**
   - Непустой **`options`**.
   - У каждого элемента есть **`value`** и **`label`**.
   - **`value`** уникальны в рамках одного вопроса (для ответа в **`answers`**).
2. **`country_iso_select`**
   - **`options`** = `null`.
   - **`type`** = `select`.
3. **`checkbox`**
   - Задано **`options`** или **`option_groups`**.
   - Суммарно есть хотя бы один вариант.
   - Для вопроса **14** — только **`option_groups`**.
4. **`option_groups`**
   - У каждой секции поле **`heading`** (может быть пустым ключом для пустой строки в UI).
   - Вложенные **`options`** — тот же формат, что в плоском списке: **`value`**, **`label`**, при необходимости **`is_other`**.
5. **`branches`**
   - Ключи совпадают с **`value`** опций родительского вопроса.
   - Для **12**: `yes` и `no`.
   - Значения — существующие **`stable_id`**.
6. Вариант с **`is_other: true`**
   - **`value`** согласован с фронтом (часто `"other"`).
7. **`type` = `text`**
   - Нет **`options`** и **`option_groups`**.
   - Есть **`question_text`** (ключ или текст по политике проекта).
   - При необходимости **`field_caption`**, **`text_multiline`**, **`text_rows`**, **`text_allow_empty`**.
8. **Ключи перевода** (текущий сидер и **`lang/en/survey.php`**)
   - **`question_text`**, **`subtitle`**, **`field_caption`**, **`other_detail_field_label`**, **`label`** в опциях, **`heading`** в группах — строки-ключи вида **`survey.…`**.
   - Целостность: каждый ключ должен существовать в языковых файлах для поддерживаемых локалей (или зафиксирован fallback).
   - Смена ключа или удаление строки в lang ломает отображение без обновления БД или наоборот.
9. **`stable_id`**
   - Глобально уникален.
   - Не переиспользовать после удаления вопроса без учёта ответов пользователей.

### **✅ Выполнено** 1.5. Выдача вопросов клиенту (API)

- Маршрут: `GET /{locale}/survey/questions` (`client.survey.questions`, `throttle:120,1`).
- Отдаются только активные вопросы, отсортированные по `sort_order`.
- Формат ответа: `{ "questions": { "<stable_id>": { ... } } }`, где `id = stable_id`.
- Бэкенд отдаёт ключи `survey.*`; перевод выполняется на фронте.
- Реализация: `routes/web.php`, `app/Http/Controllers/Client/SurveyQuestionsController.php`.

### **✅ Выполнено** 1.6. Связка фронта с API

- Фронт грузит вопросы через `GET /{locale}/survey/questions` и подменяет локальный стаб.
- При ошибке/битом ответе показывается верхний alert и опрос не продолжается.
- Ветвление (`12 -> 12_1/12_2`) работает через актуальный набор вопросов из API.
- Черновики отключены: при новом заходе пользователь начинает с начала.
- Реализация: `surveyQuestionsStub.js`, `surveyFlow.js`, `Survey.vue`.


---

## 🧾 Шаг 2 — Архитектура ответов

### **✅ Выполнено** 2.1 Таблица `survey_responses`

- Создана миграция `database/migrations/2026_04_07_130000_create_survey_responses_table.php`.
- Создана модель `app/Models/SurveyResponse.php` с `fillable` и `casts`.
- Поля таблицы: `name`, `email` (unique), `phone`, `business_name`, `business_type`, `country`, `answers` (JSON), `discount_code` (unique, nullable), `discount_granted` (bool), `timestamps`.

#### **✅ Выполнено** Кратко по реализации
- База: `create_survey_responses_table` в `database/migrations/2026_04_07_130000_create_survey_responses_table.php`.
- Модель: `SurveyResponse` в `app/Models/SurveyResponse.php`.

### **✅ Выполнено** 2.2 Валидация входящих ответов

- Добавлен `FormRequest` `app/Http/Requests/Client/SurveySubmitRequest.php`.
- Провалидированы блоки `contacts`, `answers`, `question_answers` и вложенные поля.
- В `prepareForValidation()` нормализуется структура payload перед сохранением.

#### **✅ Выполнено** Кратко по реализации
- Валидация: `SurveySubmitRequest::rules`.
- Нормализация: `SurveySubmitRequest::prepareForValidation`.

### **✅ Выполнено** 2.3 Endpoint отправки ответов

- Добавлен роут `POST /survey/submit` (`client.survey.submit`) в `routes/web.php`.
- В контроллере `SurveyQuestionsController::submit` подключён `SurveySubmitRequest`.

#### **✅ Выполнено** Кратко по реализации
- Роут: `routes/web.php`.
- Контроллер: `app/Http/Controllers/Client/SurveyQuestionsController.php`, метод `submit`.

### **✅ Выполнено** 2.4 Сохранение в БД через сервис

- Вся логика сохранения вынесена в `app/Services/SurveyResponseService.php`.
- Запись сохраняется через `updateOrCreate` по `email`.
- В `answers` сохраняется понятная структура:
  - `answers_map` (плоский объект ответов),
  - `question_answers` (массив `id/value/other`),
  - `meta` (`source`, `ip`, `user_agent`, `submitted_at`).
- Доп.поля строки: `business_type` берётся из ответа на вопрос `1`, `country` — из вопроса `3` (ISO alpha-2).

#### **✅ Выполнено** Кратко по реализации
- Сервис: `app/Services/SurveyResponseService.php`, метод `storeByEmail`.
- Вызов сервиса: `SurveyQuestionsController::submit`.

### **✅ Выполнено** 2.5 Логирование сохранения

- Логирование переведено на `App\Services\AppLogger`.
- Запись идёт в кастомный файл `storage/logs/survey-submit.log`.
- В лог пишется факт сохранения и ключевые атрибуты (`survey_response_id`, `email`, `business_type`, `country`).

#### **✅ Выполнено** Кратко по реализации
- Логер: `app/Services/AppLogger.php` (использование типа `file`).
- Точка записи: `SurveyQuestionsController::submit`.

---

## 📬 Шаг 4 — Email система **✅ Выполнено**

1) Письмо благодарности за заполнение опроса с отправкой скидочного кода.
Паттерн: Listener (ShouldQueue) -> Mailable -> blade-шаблон.

### Реализованные файлы

| Файл | Назначение |
|------|-----------|
| `app/Services/SurveyResponseService.php` | Генерация `discount_code`, диспатч Listener в методе `storeByEmail` |
| `app/Listeners/Survey/SendSurveyThankYouListener.php` | Очередной обработчик: устанавливает локаль, отправляет письмо |
| `app/Mail/Survey/SurveyThankYouMail.php` | Mailable: тема через `__('survey.email.subject_*')`, шаблон `emails.survey.thank-you` |
| `resources/views/emails/survey/thank-you.blade.php` | Blade-шаблон письма, все тексты через `__('survey.email.*')` |
| `lang/en/survey.php` | Блок `email` — 24 ключа (EN) |
| `lang/ro/survey.php` | Блок `email` — 24 ключа (RO) |

### Цепочка отправки

1. `SurveyResponseService::storeByEmail()` — при первичном submit создаёт запись с `discount_code`
2. `SendSurveyThankYouListener::dispatch($email, $discountCode, $name, app()->getLocale())` — ставит job в очередь
3. `SendSurveyThankYouListener::handle()` — `App::setLocale($this->locale)` + `Mail::to()->send(SurveyThankYouMail)`
4. `SurveyThankYouMail` — рендерит blade-шаблон с переведёнными текстами на языке пользователя

### Переводы письма (блок `survey.email`)

| Ключ | EN | RO |
|------|----|----|
| `subject_with_name` | :name, thanks for your answers | :name, multumim pentru raspunsurile tale |
| `subject_default` | Thanks for your answers | Multumim pentru raspunsurile tale |
| `header_tagline` | Real-time HACCP compliance system | Sistem de conformitate HACCP in timp real |
| `title` | Thank you for your participation — your access and 20% discount | Multumim pentru participare — accesul tau si reducerea de 20% |
| `greeting_with_name` | Hello, :name! | Buna, :name! |
| `greeting_default` | Hello! | Buna! |
| `thank_you` | Thank you for taking the time to complete the survey. | Multumim ca ti-ai dedicat timpul pentru a completa sondajul. |
| `value_note` | Your answers are truly valuable — they directly shape the product. | Raspunsurile tale sunt cu adevarat valoroase — ele influenteaza direct produsul. |
| `registered_as` | You are registered as an early access participant | Esti inregistrat ca participant cu acces anticipat |
| `discount_label` | -20% lifetime discount | -20% reducere pe viata |
| `discount_code_label` | Your code: | Codul tau: |
| `description_line1` | The system is currently in development. | Sistemul se afla in prezent in dezvoltare. |
| `description_line2` | I am analyzing responses from business owners... | Analizez raspunsurile antreprenorilor... |
| `description_line3` | The main goal is for the system to help you pass inspections... | Scopul principal este ca sistemul sa te ajute sa treci inspectiile... |
| `benefits_title` | What you will get: | Ce vei primi: |
| `benefit_1` | Real-time action tracking | Urmarirea actiunilor in timp real |
| `benefit_2` | Transparent history for inspections | Istoric transparent pentru inspectii |
| `benefit_3` | Control without extra workload | Control fara sarcina suplimentara |
| `cta_button` | Go to website | Acceseaza site-ul |
| `footer_updates` | I will periodically share development updates... | Voi impartasi periodic noutati despre dezvoltare... |
| `footer_feedback` | Your feedback and ideas will help... | Feedback-ul si ideile tale vor ajuta... |
| `footer_reply` | If you already have thoughts or tasks — simply reply to this email. | Daca ai deja ganduri sau sarcini — pur si simplu raspunde la acest email. |
| `footer_signature` | Best regards, Shamil Bagalov | Cu stima, Shamil Bagalov |

### Локализация в очереди

Listener принимает `$locale` при диспатче и устанавливает `App::setLocale($this->locale)` в `handle()` перед отправкой.
Это необходимо потому что queue worker выполняется в отдельном процессе с дефолтной локалью `en`.
Маршруты `/survey/submit` и `/survey/verify` также получили middleware `setLocale` для корректного перевода ответов API.

### 2) Письмо с 4-значным кодом для обновления draft-записи **✅ Выполнено**

| Файл | Назначение |
|------|-----------|
| `app/Mail/Survey/SurveyVerificationCodeMail.php` | Mailable: тема через `__('survey.email_verify.subject')`, шаблон `emails.survey.verification-code` |
| `app/Listeners/Survey/SendSurveyVerificationCodeListener.php` | Очередной обработчик: устанавливает локаль, отправляет письмо с кодом |
| `resources/views/emails/survey/verification-code.blade.php` | Blade-шаблон из `4_numbers.html`, все тексты через `__('survey.email_verify.*')` |
| `lang/en/survey.php` | Блок `email_verify` — 11 ключей (EN) |
| `lang/ro/survey.php` | Блок `email_verify` — 11 ключей (RO) |

Цепочка отправки:
1. `SurveyResponseService::storeByEmail()` — блок 2.2, после `updateOrCreate` draft
2. `SendSurveyVerificationCodeListener::dispatch($email, $code, app()->getLocale())`
3. `handle()` — `App::setLocale($this->locale)` + `Mail::to()->send(SurveyVerificationCodeMail)`
4. Blade-шаблон рендерит `{{ $verificationCode }}` с переведёнными текстами

Переводы (блок `survey.email_verify`):

| Ключ | EN | RO |
|------|----|----|
| `subject` | Your verification code for HACCPilot | Codul tau de verificare pentru HACCPilot |
| `header_tagline` | Security confirmation for survey update | Confirmare de securitate pentru actualizarea sondajului |
| `title` | Confirmation of answer update | Confirmarea actualizarii raspunsurilor |
| `description` | You have requested to update your answers... | Ai solicitat actualizarea raspunsurilor... |
| `instruction` | To confirm, enter the code below: | Pentru confirmare, introdu codul de mai jos: |
| `code_expiry` | The code is valid for a limited time | Codul este valabil pentru o perioada limitata |
| `not_you` | If this was not you — simply ignore this email. | Daca nu tu ai facut aceasta solicitare — ignora acest email. |
| `data_safe` | Your data will remain unchanged. | Datele tale vor ramane neschimbate. |
| `cta_button` | Return to update | Inapoi la actualizare |
| `footer_auto` | This is an automated message from the HACCPilot system. | Acesta este un mesaj automat din sistemul HACCPilot. |
| `footer_purpose` | The code is used only to confirm data changes. | Codul este utilizat doar pentru confirmarea modificarii datelor. |

### 3) Письмо подтверждения обновления ответов **✅ Выполнено**

| Файл | Назначение |
|------|-----------|
| `app/Mail/Survey/SurveyAnswersUpdatedMail.php` | Mailable: тема через `__('survey.email_updated.subject')`, шаблон `emails.survey.answers-updated` |
| `app/Listeners/Survey/SendSurveyAnswersUpdatedListener.php` | Очередной обработчик: устанавливает локаль, отправляет письмо |
| `resources/views/emails/survey/answers-updated.blade.php` | Blade-шаблон из `updating_answers.html`, все тексты через `__('survey.email_updated.*')` |
| `lang/en/survey.php` | Блок `email_updated` — 13 ключей (EN) |
| `lang/ro/survey.php` | Блок `email_updated` — 13 ключей (RO) |

Цепочка отправки:
1. `SurveyResponseService::verifyCode()` — после `confirmDraftVerification($draft)`
2. `SendSurveyAnswersUpdatedListener::dispatch($draft->email, $draft->name, app()->getLocale())`
3. `handle()` — `App::setLocale($this->locale)` + `Mail::to()->send(SurveyAnswersUpdatedMail)`

Переводы (блок `survey.email_updated`):

| Ключ | EN | RO |
|------|----|----|
| `subject` | Your survey answers have been updated | Raspunsurile tale la sondaj au fost actualizate |
| `header_tagline` | Survey data update confirmation | Confirmarea actualizarii datelor sondajului |
| `title` | Your data has been successfully updated! | Datele tale au fost actualizate cu succes! |
| `greeting_with_name` | Hello, :name! | Buna, :name! |
| `greeting_default` | Hello! | Buna! |
| `thank_you` | Thank you for updating your survey answers. | Multumim pentru actualizarea raspunsurilor la sondaj. |
| `status_label` | Your survey status: | Statusul sondajului tau: |
| `status_value` | Updated and confirmed | Actualizat si confirmat |
| `status_note` | All changes have been saved and will be used... | Toate modificarile au fost salvate si vor fi utilizate... |
| `footer_auto` | This is an automated notification... | Aceasta este o notificare automata... |
| `footer_data_use` | Your data is used only to improve... | Datele tale sunt utilizate doar pentru imbunatatirea... |
| `footer_signature` | Best regards, Shamil Bagalov | Cu stima, Shamil Bagalov |




---

## 🛡️ Шаг 5 — Защита от спама

### **✅ Выполнено** 1) Honeypot `company` (скрытое поле)

- Бэкенд: валидация и нормализация `company` и `hp_started_at` в `app/Http/Requests/Client/SurveySubmitRequest.php` (`rules`, `prepareForValidation`).
- Бэкенд: ранний выход без записи в БД в `app/Http/Controllers/Client/SurveyQuestionsController.php` (`submitAnswersQuestions`, `isHoneypotTriggered`): проверка `company` + порог 50 секунд по `hp_started_at`.
- Фронт: honeypot-поле скрыто CSS-классом (без `display:none`) в `SurveyLeadForm.vue`; payload формируется в `Survey.vue` (`buildSurveySubmitPayload`).

### **✅ Выполнено** 2) Throttle на POST отправки

- `routes/web.php`: `throttle:10,1` на `POST /survey/submit` и `POST /survey/verify` (10 запросов в минуту).
- `GET /survey/questions`: `throttle:20,1` (read-only, выше лимит).

### **✅ Выполнено** 3) Поля антиспама в таблице `survey_responses`

- Миграция `2026_04_07_130000_create_survey_responses_table.php`: добавлены `status_responses` (draft/submitted), `attempt_counter`, `verification_code`, `verification_token`.
- Модель `app/Models/SurveyResponse.php`: поля в `$fillable`, касты `attempt_counter` и `verification_code` в `integer`.

### **✅ Выполнено** 4) Логика ветвления по email (бэкенд)

- `app/Services/SurveyResponseService.php`, метод `storeByEmail()`:
    - Первичная отправка: создаёт запись со статусом `submitted`.
    - Повторная отправка (email уже есть): создаёт/обновляет `draft`, генерирует `verification_code` (4 цифры) и `verification_token` (40-char hex), ставит `attempt_counter = 2`.
    - Cooldown: если между отправками меньше 1 минуты — возврат `alert: cooldown`.
    - Возвращает флаги для фронта: `update_record`, `attempt_counter`, `verification_token`.

### **✅ Выполнено** 5) Фронт: обработка 3 статусов ответа и ветвление UI

Реализовано в `resources/js/pages/client/Survey.vue`, метод `submitSurveyResponse`:
- **Сценарий 1** (первичная отправка): `status = success`, `update_record = false` — toast + сохранение в localStorage + экран благодарности.
- **Сценарий 2** (cooldown): `status = warning`, `alert = cooldown` — toast + сброс на intro.
- **Сценарий 3** (обновление): `update_record = true`, `attempt_counter > 0` — toast + сохранение `verification_token` в sessionStorage + переключение на экран верификации кода.

### **✅ Выполнено** 5.1) Логика подтверждения кода

- Бэкенд: `app/Services/SurveyResponseService.php`, метод `verifyCode()` — проверка токена, сверка кода, декремент попыток, слияние draft в submitted при успехе.
- Фронт: `Survey.vue`, метод `handlePinComplete(pin)` — отправка `POST /survey/verify` с `token + code`, обработка 3 исходов:
    - Успех: toast + экран благодарности.
    - Неверный код (`code === 3`): декремент `pinAttemptsLeft`, очистка полей ввода.
    - Попытки исчерпаны / токен невалиден (`code === 1 | 2`): удаление токена из sessionStorage, сброс на intro.

### **✅ Выполнено** 5.2) Контроль попыток

- `attempt_counter` хранит количество оставшихся попыток (начальное значение 2, декремент при неверном коде).
- При `attempt_counter = 0` — блокировка, draft инвалидируется.

### **✅ Выполнено** 5.3) Тестовый payload (dev-блок)

- Компонент `resources/js/components/client/survey/SurveyAntiSpamTest.vue`: кнопка отправки фиксированного payload, лог HTTP status + JSON-ответ, кнопка очистки.
- Интегрирован в `Survey.vue` после основных экранов.
- Payload формируется в `buildTestSurveyPayload()` с фиксированными данными.

### **✅ Выполнено** 5.4) Компонент верификации 4-значного кода

- `resources/js/components/client/survey/SurveyDigitalCodeVerification.vue`: 4 input-поля, автофокус, навигация стрелками/Backspace, вставка из буфера, emit `@complete` при вводе 4 цифр.
- В `Survey.vue` показывается как независимый экран при `activeScreen === 'verification'`.

### **✅ Выполнено** 5.5) Контракт ответа `POST /survey/submit`

- Первичная отправка: `{ status: "success", update_record: false }`.
- Повторная (email найден): `{ status: "success", update_record: true, attempt_counter: 2, verification_token: "<token>" }`.
- Cooldown: `{ status: "warning", update_record: false, alert: "cooldown" }`.


---

## 🎨 Шаг 6 — UI/UX (Vue.js)

Цель: пошаговый интерактивный опрос вместо длинной формы.

### **✅ Выполнено** 6.1. Каркас страницы и маршрутизация шагов

- `Survey.vue` + `surveyFlow.js`: `intro` → вопросы → `lead` → `success`.
- Ветвление после `12`: переход на `12_1/12_2`, при смене ответа чистятся зависимые ответы.
- Прогресс и навигация работают по фактически видимым шагам.

### **✅ Выполнено** 6.2. Разметка одного экрана вопроса (как в эскизе)

- Верх: кнопка «назад» + progress bar.
- Центр: вопрос и блок ответа по типу вопроса.
- Низ: кнопка «Далее» там, где нет авто-перехода.
- Реализация в `Survey.vue`.

### **✅ Выполнено** 6.3. Типы вопросов и привязка к опроснику

- Реализованы `radio`, `checkbox`, `select`, `text`.
- Поддержаны `other`-ответы (`{id}__other`) и email-валидация lead-шага.
- Основная логика: `surveyQuestionsStub.js`, `surveyFlow.js`, `Survey.vue`.

### **✅ Выполнено** 6.4. Компоненты Vue (рекомендуемое разбиение)

- Компоненты собраны в `resources/js/components/client/survey/`:
  `SurveyLayout.vue`, `SurveyProgressBar.vue`, `SurveyQuestionStep.vue`,
  `SurveyChoiceList.vue`, `SurveyMultiChoice.vue`, `SurveyLeadForm.vue`,
  `SurveyStepTransition.vue`.
- Оркестрация и состояние — в `Survey.vue`.

### **✅ Выполнено** 6.5. Поведение и микровзаимодействия

- Автопереход на `radio` через `SURVEY_RADIO_AUTO_ADVANCE_MS`.
- Кнопка «Далее» активируется только при валидном состоянии шага.
- Добавлены focus-management, базовые a11y-атрибуты и защита от двойного submit.

### **✅ Выполнено** 6.6. Progress bar — логика и «UX-трюк»

- Прогресс считается по видимым шагам.
- Визуальный процент: ранние шаги ускорены (нелинейная кривая в `surveyFlow.js`).
- Отрисовка прогресса: `SurveyProgressBar.vue`, данные — из `Survey.vue`.

### **✅ Выполнено** 6.7. Визуальный стиль (mobile-first)

- Обновлён стиль страницы опроса под mobile-first: крупные touch-target, полноширинные варианты, единый CTA.
- Ключевые стили: `Survey.vue`, `SurveyLayout.vue`, `SurveyQuestionStep.vue`, `SurveyChoiceList.vue`, `SurveyMultiChoice.vue`, `SurveyLeadForm.vue`, `SurveyProgressBar.vue`.

### **✅ Выполнено** 6.8. Вопрос 14 опросника: полезные возможности (чекбоксы + «Другое»)

- Вопрос `14`: `checkbox` с `option_groups`, разрешён пустой выбор (`checkbox_allow_empty`), поддержано поле «Другое».
- Логика в `surveyQuestionsStub.js`, `surveyFlow.js`, `SurveyMultiChoice.vue`, `SurveyQuestionStep.vue`, `Survey.vue`.

### **✅ Выполнено** 6.9. Вопрос 15 опросника: одна главная проблема (текст)

- Вопрос `15`: тип `text`, рендер textarea/input, валидация через `isSurveyQuestionAnswerValid`.
- Реализация: `surveyQuestionsStub.js`, `surveyFlow.js`, `SurveyQuestionStep.vue`, `Survey.vue`.

### ✅ Выполнено 6.10. Select стран — `i18n-iso-countries`

- Подключён `i18n-iso-countries`, выбор страны работает как `country_iso_select`.
- В ответах хранится ISO alpha-2 код; UI-компоненты: `SurveyCountrySelect.vue`, `SurveyCountryPicker.vue`.
- Проверка значения страны: `isSurveyCountryAlpha2Valid`.


### **✅ Выполнено** 6.11. Данные и связка с бэкендом (UI-часть)

- Порядок шагов, прогресс, ветвление, honeypot:
    - **локальный конфиг** в **`surveyFlow.js`** и связанном коде (как в **`oprosnik.md`**).
- Тексты и поля вопросов для рендера шагов:
    - **подгрузка с API** — п. **1.5**, **1.6** (`GET /{locale}/survey/questions`); при ошибке/битом **`questions`** показываем верхний alert и останавливаем опрос.
- Реализация замены стаба на реальные вопросы из БД:
    - Источник БД: `survey_questions` (`stable_id`, `type`, `question_text`, `options`, `option_groups`, `branches`, `checkbox_allow_empty`, `country_iso_select`, `text_*`), сидер `SurveyQuestionsSeeder` заполняет те же поля, что ждёт фронт.
    - Контракт API фиксированный: `response.data.questions` — объект `Record<string, Question>`, где ключ = `stable_id`.
    - `loadSurveyQuestionsFromApi()` принимает только объектный формат; если формат невалидный/пустой — верхний alert + остановка опроса.
    - Для валидного ответа сразу вызывать `replaceSurveyQuestionsById(questions)`.
    - Контроль совместимости: `id` в клиентском объекте всегда строковый `stable_id` (например `12_1`), чтобы не ломались `answers`, `resolveBranchStepId`, `surveyQuestionAllOptions` и ключи `__other`.
- Intro, lead, success и вынесение в конфиг/API:
    - см. п. **1.5** п. 4; отдельная задача.
- Структура ответов:
    - объект `questionId → value | string[]`.
- Перед отправкой:
    - собрать payload в формате `survey_responses`;
    - поля контактов + `answers` в JSON.
- После успеха:
    - экран благодарности;
    - опционально (аналитика, шаг 8): событие `survey_completed`.

#### **✅ Выполнено** Кратко по реализации
- Загрузка вопросов из API и строгая валидация контракта реализованы в `resources/js/pages/client/Survey.vue`, метод `loadSurveyQuestionsFromApi`.
- Подмена данных выполнена через `replaceSurveyQuestionsById` в `resources/js/features/survey/surveyQuestionsStub.js`.
- При битом ответе API показывается верхний alert и опрос блокируется в `resources/js/pages/client/Survey.vue`.

### **✅ Выполнено** 6.12. Соответствие `oprosnik.md` ↔ код ↔ поля для БД

Источник правды по структуре вопроса в коде:

- JSDoc `SurveyQuestionStub` и `SURVEY_QUESTIONS_BY_ID` — `resources/js/features/survey/surveyQuestionsStub.js`
- Валидация и ветвление — `resources/js/features/survey/surveyFlow.js`
- Lead и honeypot — `resources/js/pages/client/Survey.vue`, `SurveyLeadForm.vue`

#### **✅ Выполнено** Объект ответов `answers` (плоский)

- **`radio`**
    - Ключ: `question.id`
    - Значение: `string` — выбранный `option.value`
- **`select` (страна, вопрос 3)**
    - Ключ: `"3"`
    - Значение: `string` — **ISO 3166-1 alpha-2**
- **`checkbox`**
    - Ключ: `question.id`
    - Значение: `string[]` — выбранные `value`
- **Уточнение к варианту «Другое»**
    - Ключ: `` `${id}__other` ``
    - Значение: `string` — обязателен, если среди выбранного есть опция с `is_other: true`
- **`text`**
    - Ключ: `question.id`
    - Значение: `string`
- **Контакты (не числовой id вопроса)**
    - Ключи: `name`, `email`, `business_name`, `phone`, `whatsapp`, `telegram`
    - Значения: строки
- **Honeypot**
    - Ключ: `hp_company`
    - На фронте: скрытое поле `company` в `SurveyLeadForm.vue`, скрывается CSS-классом (вне видимой области, без `display:none`)
    - В payload на сервер: top-level поля `company` и `hp_started_at`
    - В БД не сохранять; непустое значение — признак бота
    - Если поле заполнено, запрос на отправку данных опроса на сервер не выполняется (игнорируется на клиенте)

Ветвление после вопроса **12**:

- В конфиге вопроса — поле `branches` (пример: `{ yes: "12_1", no: "12_2" }`)
- При смене ответа на `12` сбрасываются ответы `12_1`, `12_2` и ключи `12_1__other`, `12_2__other` — `clearBranchDerivedAnswers`

#### **✅ Выполнено** Минимальный набор полей строки вопроса в БД (совместимость с текущим фронтом)

Обязательно для любого вопроса:

- **`id`** — строка, ключ в payload ответов
- **`question_text`**
- **`type`** — одно из: `radio`, `checkbox`, `select`, `text`
- **`order`** или эквивалент позиции в потоке
- **`is_active`**

Опционально (по типу и UX):

- **`options`** — JSON `[{ value, label, is_other? }]`, если нет `option_groups` и это не справочник страны
- **`option_groups`** — JSON `[{ heading, options: [...] }]` — как у вопроса `14` (секции в UI)
- **`subtitle`**, **`field_caption`**
- **`branches`** — JSON: значение ответа → id следующего вопроса (вопрос `12`)
- **`checkbox_allow_empty`** — boolean (`14`: `true`; у `11` не задан → нужен минимум один выбор)
- **`other_detail_field_label`** — подпись над textarea для «Другое»
- **`country_iso_select`** — boolean для вопроса `3`; список стран в JSON вопроса не дублировать
- **`text_multiline`**, **`text_rows`**, **`text_allow_empty`** — для `type: text`

Правило по «Другое»:

- Опция с **`is_other: true`** → второй ключ ответа **`{questionId}__other`**

#### **✅ Выполнено** Пункты `oprosnik.md` — как в коде

- **Заголовок / подзаголовок / доверие**
    - Не в `SURVEY_QUESTIONS_BY_ID`
    - Тексты intro — в **`Survey.vue`**
    - В БД опционально отдельная сущность копирайта, не обязательно `survey_questions`
- **1 — тип бизнеса**
    - Код: `id` `1`, `radio`
    - `answers`: одна строка; при `other` — ещё `1__other`
    - БД: опции с `value` / `label`
- **2 — сотрудники**
    - Код: `2`, `radio`
    - `answers`: одна строка
    - БД: без варианта «Другое»
- **3 — страна**
    - Код: `3`, `select`, `country_iso_select: true`
    - `answers`: alpha-2
    - БД: подпись страны из справочника, не отдельная колонка значения ответа
- **4 — как ведёте HACCP**
    - Код: `4`, `radio`
    - `answers`: строка; при `other` — `4__other`
- **5, 6, 7**
    - Код: `5`, `6`, `7`, `radio`
    - `answers`: по одной строке на вопрос
- **8 — кто отвечает за HACCP**
    - Код: `8`, `radio`
    - `answers`: строка; при `other` — `8__other`
- **9, 10**
    - Код: `9`, `10`, `radio`
    - `answers`: по одной строке
- **11 — сложная часть HACCP**
    - Код: `11`, `checkbox`, есть `subtitle`
    - `answers`: массив строк; при выборе `other` — `11__other`
    - БД: минимум один выбранный пункт (`checkbox_allow_empty` не задан)
- **12 — проверки за год**
    - Код: `12`, `radio`
    - `answers`: одна строка
    - БД: **`branches`** ведут на `12_1` или `12_2`
- **12.1 — стресс при проверке (если на 12 ответ «Да»)**
    - Код: `12_1`, `radio`
    - `answers`: строка; при `other` — `12_1__other`
    - БД: отдельная запись вопроса
- **12.2 — готовность к проверке (если на 12 ответ «Нет»)**
    - Код: `12_2`, `radio`
    - `answers`: одна строка
    - БД: отдельная запись вопроса
- **13**
    - Код: `13`, `radio`
    - `answers`: одна строка
- **14 — полезные возможности**
    - Код: `14`, `checkbox`
    - `answers`: массив; пустой массив допустим; при `other` — `14__other`
    - БД: `option_groups`, `checkbox_allow_empty: true`, `other_detail_field_label`
- **15 — одна главная проблема**
    - Код: `15`, `text`
    - `answers`: строка
    - БД / поведение: в стабе **`text_allow_empty: true`** — на фронте шаг необязателен; для обязательного поля в проде — флаг в БД (`text_required` или отсутствие `text_allow_empty`)
- **16 — имя (опросник)**
    - Код: lead, ключ `name`
    - В коде без `required`
- **17 — email**
    - Код: lead, ключ `email`
    - Обязателен; валидация — `surveyFlow.js`
- **18 — название бизнеса**
    - Код: lead, ключ `business_name`
    - Опционально
- **19 — телефон / мессенджеры**
    - Код: lead, ключи `phone`, `whatsapp`, `telegram` (три поля)
    - В опроснике одно поле; в БД — согласовать (колонки или JSON)

Служебный контент страницы:

- После отправки — **`SURVEY_PAGE_SUCCESS`** в `surveyQuestionsStub.js`
- Блок контактов перед отправкой — **`SURVEY_PAGE_LEAD`**

#### **✅ Выполнено** Кратко по реализации
- Соответствие структуры вопроса и ключей ответов реализовано в `resources/js/features/survey/surveyQuestionsStub.js` и `resources/js/features/survey/surveyFlow.js` (методы `surveyOtherDetailKey`, `isSurveyQuestionAnswerValid`, `resolveBranchStepId`, `clearBranchDerivedAnswers`).
- Совместимость с БД обеспечена миграцией `database/migrations/2026_04_07_120000_create_survey_questions_table.php`, моделью `app/Models/SurveyQuestion.php` и сидером `database/seeders/SurveyQuestionsSeeder.php`.
- Проверка и применение контракта API вопросов реализованы в `resources/js/pages/client/Survey.vue`, метод `loadSurveyQuestionsFromApi`.



### 6.13. Компонент - после отправки ответов (переответить)

#### **✅ Выполнено** Важное

- После успешного `POST /survey/submit` сохраняется `survey_submission_state_v1` в `localStorage`:
  `submitted`, `submitted_at`, `email_masked`, `email_raw_hash`.
- При повторном открытии `survey` читается `survey_submission_state_v1` и сразу показывается `SurveySubmittedState` (без мигания intro).
- В `SurveySubmittedState` есть кнопка `reset-survey`, которая открывает повторный проход с intro без удаления `survey_submission_state_v1`; если повторная отправка не завершена, после перезагрузки снова показывается экран завершённости.
- Маска email централизована в `maskSurveyEmail` и используется и при записи состояния, и при отображении.
- Тексты компонента вынесены в `lang/en/survey.php` в блок `submitted_state`.

#### **✅ Выполнено** Ключевые файлы

- `resources/js/pages/client/Survey.vue` — `persistSurveySubmissionState`, `hydrateSubmittedStateFromStorage`, `resetSurveyFromSubmittedState`, `resetSurveyStateToIntro`.
- `resources/js/components/client/survey/SurveySubmittedState.vue` — UI состояния «уже отправлено» и событие `reset-survey`.
- `resources/js/features/survey/surveyFlow.js` — `maskSurveyEmail`.
- `lang/en/survey.php` — `submitted_state.*`.


---


## 🧠 Шаг 7 — UX принципы

Принципы ниже — **критерии приёмки** для вёрстки и поведения страницы.

Источники:

- `eskiz_ui_survey.md`
- длинный сценарий в `oprosnik.md` (цель — снизить отвал с опроса).

### **✅ Выполнено** 7.1. Минимальное трение

- Один экран — одна задача: intro → вопросы → lead → success.
- Для radio включён автопереход, чтобы убрать лишний тап.
- Черновики не используются: новый заход = новый старт.
- Реализация: `Survey.vue` (`buildVisibleSurveyStepIds`, `scheduleAutoNext`), `surveyFlow.js` (`SURVEY_RADIO_AUTO_ADVANCE_MS`).

### **✅ Выполнено** 7.2. Быстрые ответы

- Тексты короткие, без перегруза; подсказки точечные (например `subtitle` у `11`).
- Крупные кликабельные зоны и короткие анимации без блокировки ввода.
- Реализация: `SurveyQuestionStep.vue`, `SurveyStepTransition.vue`, `SurveyProgressBar.vue`.

### **✅ Выполнено** 7.3. Понятные формулировки и ожидания

- На каждом шаге ясно, где пользователь находится: прогресс + кнопка «назад».
- На lead-шаге явно объяснено, зачем контакты; email имеет понятные ошибки.
- Ветка `12 -> 12_1/12_2` выглядит как часть того же потока, без UX-скачков.
- Реализация: `SurveyProgressBar.vue`, `SurveyLeadForm.vue`, `surveyFlow.js` (`surveyLeadEmailErrorMessage`).

### **✅ Выполнено** 7.4. Мобильный приоритет

- Целевая ширина 320–430px: без горизонтального скролла и обрезаний текста.
- Клавиатура не перекрывает ключевые действия; touch-targets не меньше 48px.
- Реализация: `SurveyLayout.vue`, `Survey.vue`, `SurveyQuestionStep.vue`, `SurveyLeadForm.vue`.

### **✅ Выполнено** 7.5. Контроль и доверие

- Прогресс-бар и нелинейная шкала поддерживают ощущение «я почти дошёл».
- Блок доверия показывается на intro; после submit — спокойный финальный экран.
- Реализация: `SurveyProgressBar.vue`, `surveyFlow.js`, `surveyQuestionsStub.js` (`SURVEY_PAGE_INTRO`, `SURVEY_PAGE_SUCCESS`).

### **✅ Выполнено** 7.6. Согласованность и доступность

- Radio и checkbox визуально и поведенчески различимы.
- Фокус, `aria-*` и порядок навигации рассчитаны на клавиатуру и читалки.
- Реализация: `SurveyChoiceList.vue`, `SurveyMultiChoice.vue`, `SurveyQuestionStep.vue`, `SurveyProgressBar.vue`.

---

## 📊 Шаг 8 — Аналитика

Отслеживать:
- сколько начали опрос
- сколько завершили
- где выходят

---

## 🚀 Шаг 10 — Итоговый флоу

1. Пользователь заходит
2. Проходит шаги
3. Заполняет контакты
4. Данные сохраняются
5. Генерируется скидка
6. Отправляется email



