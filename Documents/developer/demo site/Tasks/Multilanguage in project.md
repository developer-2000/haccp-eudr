# Мультиязычность в проекте HACCP-EUDR

Описание реализации переключения языков и передачи локали от конфига до фронта.

---

## Краткий чек-лист

- Язык по умолчанию — `config('app.locale')` (`env('APP_LOCALE', 'en')`)
- Резервный язык — `config('app.fallback_locale')` (`ro`)
- Список допустимых локалей — `config('site.languages.countries')`
- Текущая локаль определяется по приоритету:
  - session → cookie → Accept-Language (браузер) → main
  - Реализовано через хелпер `preferred_language_from_request()` в `app/Helpers/helpers.php`
- «Вторая» локаль для переключателя:
  - Если язык браузера ≠ main и есть в списке → ставится вторым
  - Иначе → `fallback_locale` (`ro`)
- Middleware `SetLocale`:
  - выбор локали по приоритету;
  - установка `App::setLocale()`, запись в session;
  - массив из **двух** языков для переключателя;
  - загрузка PHP-словарей `lang/{locale}.php` → `translationsForFrontend`;
  - передача данных во view через `View::share()`
- `POST /locale`:
  - валидация по всем ключам `countries`;
  - запись в session и cookie на 1 год;
  - ответ JSON с установленной локалью
- Словари: только PHP — `lang/{locale}/messages.php` и агрегаты `lang/{locale}.php`
  - Вывод в Blade через `__()`, `trans()`
  - Передача во Vue через `window.translations` (скрипт в `<head>`)
  - Вывод во Vue через `{{ $t('ключ') }}`
- i18n подключён один раз в `app.js` через `app.use(i18n)`
  - Локаль синхронизируется с URL (`router.beforeEach`, установка перед mount после `router.isReady`)
- Переключатель во фронте:
  - данные из `data-locale` и `data-languages` на `#app`
  - **показывается только если `languagesList.length > 1`**
  - смена через `POST /locale` и переход на новый URL с заменой `{locale}`

---

## Какие языки отображать в переключателе языков на фронте ?!
- Всегда на фронт уходит только 2 языка!
   - смотрим на язык браузера (RU)
- взять основной и второстипенный языки сайта (en/ro)
   - D:\ystanovki\OSPanel_6.4.5\home\haccp-eudr\config\app.php
   - 'locale' => env('APP_LOCALE', 'en'), 'fallback_locale' => 'ro',
- взять язык браузера (RU) - смотрим есть ли он в масиве D:\ystanovki\OSPanel_6.4.5\home\haccp-eudr\config\site\languages.php
   - 'countries' => [ 'en' => ['prefix' => 'EN', 'name' => 'English', 'hreflang' => 'en'],
- если он есть и он отличаетса от основного (en) - поставить его вторым (en/ru)
- если он есть и он НЕ отличаетса от основного - оставить вторым второстепенный язык сайта 'fallback_locale' => 'ro',

## Какой язык нужно выбрать в переключателе на фронте и какого языка должна быть система ?!
- Смотрим в куки
  - если его язык совподает с одним из 2 отправляемых на фронт (en/ru) - выбрать его и перевести систему на него
  - если не совпадает - берем главный язык по умолчанию 'locale' => env('APP_LOCALE', 'en') - выбрать его и перевести систему на него


---

## Языки сайта

Список поддерживаемых локалей (25):

- Английский (en) — основной язык сайта (`main`)
- Румынский (ro) — второстепенный язык (`fallback_locale`)
- Немецкий (de)
- Болгарский (bg)
- Хорватский (hr)
- Чешский (cs)
- Датский (da)
- Эстонский (et)
- Финский (fi)
- Французский (fr)
- Греческий (el)
- Венгерский (hu)
- Исландский (is)
- Итальянский (it)
- Латышский (lv)
- Литовский (lt)
- Мальтийский (mt)
- Нидерландский (nl)
- Норвежский букмол (nb) — алиас `no` → `nb`
- Польский (pl)
- Португальский (pt)
- Словацкий (sk)
- Словенский (sl)
- Испанский (es)
- Шведский (sv)

---

## 1. Конфиг языков

**Файл:** `config/site/languages.php`

Содержит один массив:

- **countries** — ассоциативный массив: код локали → `prefix`, `name`, `hreflang`
  - 25 кодов: `en`, `ro`, `de`, `bg`, `hr`, `cs`, `da`, `et`, `fi`, `fr`, `el`, `hu`, `is`, `it`, `lv`, `lt`, `mt`, `nl`, `nb`, `pl`, `pt`, `sk`, `sl`, `es`, `sv`
  - Ключи массива — список **допустимых локалей** (используются как `$available` в детекции и как валидация `POST /locale`)
  - Поля `prefix` / `name` — подписи в переключателе языков
  - Поле `hreflang` — пробрасывается во фронт как `window.localeHreflangMap` для SEO

**Файл:** `config/app.php`

Язык по умолчанию приложения:

- `locale` → `env('APP_LOCALE', 'en')` — основной язык сайта (`main`)
- `fallback_locale` → `'ro'` — второстепенный язык сайта, используется как второй в переключателе, если язык браузера не подошёл

**Алиасы ISO-кодов** (нормализация Accept-Language перед проверкой в `$available`):

- `no` → `nb` — норвежский макро-код `no` интерпретируется как букмол `nb`, так как в списке отсутствует общий `no`, но есть `nb`
- Реализовано в хелпере `preferred_language_from_request()` в `app/Helpers/helpers.php`

**✅ Выполнено**

Проверено: конфиг и нормализация соответствуют плану

- `config/site/languages.php` — массив `countries` из 25 записей, у каждой `prefix`, `name`, `hreflang`
- `config/app.php`:
  - `locale` через `env('APP_LOCALE', 'en')`
  - `fallback_locale` = `'ro'`
- `app/Helpers/helpers.php` — таблица алиасов `['no' => 'nb']` применяется внутри `preferred_language_from_request()` до проверки в `$available`

---

## 2. Определение «второй» локали (LocaleDetector)

**Класс:** `App\Services\LocaleDetector`

- Метод `detect(Request $request): string`
- Возвращает язык браузера:
  - первый код из заголовка Accept-Language, входящий в допустимые
  - через хелпер `preferred_language_from_request($request, $available)`
- Если браузер не отдал подходящий язык — вызывается `detectByIp($request)`:
  - Сейчас возвращает `config('app.fallback_locale', 'en')`
  - Зарезервирован под будущий IP/geo-сервис

**Хелпер:** `app/Helpers/helpers.php`

- `preferred_language_from_request(Request $request, array $available): ?string`
  - парсит Accept-Language, возвращает первый код из `$available`
  - при наличии у Request метода `getPreferredLanguage()` использует его
  - иначе разбор заголовка вручную

**✅ Актуально**

- В `app/Services/LocaleDetector.php`:
  - `detect()` использует `preferred_language_from_request()`, при пустом — `detectByIp()`
- Middleware `SetLocale` резолвит сервис через `app(LocaleDetector::class)`

---

## 3. Middleware SetLocale

**Файл:** `app/Http/Middleware/SetLocale.php`
**Группа:** `web` (подключается к группе маршрутов с префиксом `{locale}`)

### 3.1. Какие 2 языка отображать в переключателе

Всегда на фронт уходит только 2 языка:

1. Основной язык сайта — `config('app.locale')` (`en`)
2. Второй язык определяется по правилу:
   - Если язык браузера (Accept-Language) ≠ main И есть в списке `countries` → ставится вторым
   - Иначе → второстепенный язык сайта `config('app.fallback_locale')` (`ro`)

Примеры:

- Браузер = English → переключатель: **EN / RO** (main + fallback)
- Браузер = German → переключатель: **EN / DE** (main + browser)
- Браузер = Russian (нет в списке) → переключатель: **EN / RO** (main + fallback)

### 3.2. Какой язык выбрать активным (locale)

- Если пользователь ранее **выбрал язык через переключатель** (cookie/session)
  - И этот язык есть в текущем списке отображаемых (two) → используем его
- Иначе → основной язык сайта (`main`)
- Проверка на допустимость: если `locale` нет в `available` → подставляется `main`
- Сохранение в session для стабильности

### 3.3. Передача данных во фронт

- Массив из **двух** языков для переключателя → `languagesForFrontend`
  - Формат: `[{ code: 'en', prefix: 'EN', name: 'English' }, ...]`
- Для каждой допустимой локали подключается `lang/{locale}.php` → `translationsForFrontend`
- В view через `View::share()`:
  - `localeForFrontend` — активная локаль
  - `languagesForFrontend` — список из 2 языков для переключателя
  - `translationsForFrontend` — переводы

**✅ Выполнено**

---

## 4. Маршруты и установка локали

**Файл:** `routes/web.php`

### Корень

- `GET /` — редирект на `/{locale}` через `LocaleController::redirectToLocale`
  - Локаль определяется:
    - saved (session/cookie), если есть в (main + browser/fallback) → используем его
    - иначе → main
  - Проверка по `available_locales()`, иначе подставляется main

### Смена локали с фронта

- `POST /locale`, имя маршрута: `locale.set`
- Контроллер: `LocaleController::set`
- Вход: тело запроса (JSON или form) с полем `locale` (например `"en"` или `"ro"`)
- Валидация:
  - `locale` должен быть одним из ключей `config('site.languages.countries')`
  - Разрешены все страны из конфига, не только main и detected
- При успехе:
  - Запись в session
  - Установка cookie `locale` на 1 год (`60 * 24 * 365` минут)
  - Ответ JSON: `{ "locale": "…" }`
- CSRF: запрос с той же страницы
  - Нужен заголовок `X-CSRF-TOKEN` или cookie (из `<meta name="csrf-token">`)

### Группа SPA

- Маршруты с префиксом `{locale}`
  - Ограничение по коду из `available_locales()` через `where`
- Middleware группы: `setLocale`
- Все GET отдают view `index-client` (SPA)

**✅ Выполнено**

Проверено по плану: реализация совпадает

- **`routes/web.php`:**
  - `GET /` — редирект на `/{locale}` через `LocaleController::redirectToLocale`
    - Локаль из saved (если есть в two) → main
    - Проверка по `available_locales()`, иначе main
  - `POST /locale` (имя `locale.set`) — `LocaleController::set`
    - Валидация `locale` по ключам конфига
    - При успехе: запись в session, cookie на 60×24×365 минут, ответ JSON `{ "locale": "…" }`
  - Группа с префиксом `{locale}`:
    - `where` по `implode` из `available_locales()`
    - middleware `setLocale`
    - все GET отдают view `index-client`
- **`app/Http/Controllers/LocaleController.php`:**
  - `redirectToLocale()` — логика: saved (если в two) → main
  - `set()` — валидация, session, cookie, JSON ответ

---

## 5. Передача локали и переводов во фронт (Blade)

**Файл:** `resources/views/layouts/app.blade.php`

В `<head>` (сразу после meta csrf-token) инлайн-скрипт для Vue i18n:

```html
<script>
    window.locale = "{{ $localeForFrontend ?? app()->getLocale() }}";
    window.appName = "{{ config('app.name') }}";
    window.translations = @json($translationsForFrontend ?? []);
    window.availableLocales = @json(array_keys(config('site.languages.countries', [])));
    window.localeHreflangMap = @json(array_map(fn($m) => $m['hreflang'] ?? null, config('site.languages.countries', [])));
</script>
```

- `window.locale` — текущая активная локаль
- `window.translations` — все PHP-словари для всех локалей
- `window.availableLocales` — полный список всех доступных языков (используется для корректной замены языка в URL)
- `window.localeHreflangMap` — маппинг локалей на hreflang

На блоке `#app` атрибуты для переключателя языков:

- `data-locale="{{ $localeForFrontend ?? app()->getLocale() }}"`
- `data-languages="{{ json_encode($languagesForFrontend ?? []) }}"`

Переменные задаются в middleware `SetLocale`.

Для доступности и SEO:

- В `<html>`: `lang="{{ str_replace('_', '-', app()->getLocale()) }}"`

---

## 6. Переключатель языков во фронте (Vue)

**Файл:** `resources/js/components/client/header/Header.vue`

### Инициализация (при монтировании)

- Список языков:
  - парсится из атрибута `data-languages` у `#app`
  - при ошибке или пустоте — запасной массив `[{ code: 'en', … }, { code: 'ro', … }]`
- Текущая локаль:
  - из `data-locale` у `#app`
  - должна входить в список языков; иначе берётся первый из списка или `'en'`
- Для отображения в шапке используется `currentLocale = route.params.locale ?? initialLocale`

### Рендер

- Блок переключателя показывается **только если `languagesList.length > 1`**
  - При одном языке переключатель не отображается
- Кнопки по `languagesList`:
  - подпись из `lang.prefix`
  - `title` из `lang.name`
  - активное состояние по `currentLocale === lang.code`

### Смена языка

- Функция `setLocale(locale)`:
  - Отправляет `POST /locale` с телом `{ locale }` и заголовком `X-CSRF-TOKEN` (из `<meta name="csrf-token">`)
  - Использует `window.availableLocales` для определения, является ли первый сегмент URL языком
  - После запроса (успех или ошибка) выполняется переход по URL:
    - `/{locale}/…` (текущий путь с заменой сегмента локали)
    - **Важно:** используется полный список всех доступных языков, а не только 2 из переключателя
    - Это предотвращает баг `/en/ro/demo/dashboard` при переходе с `/ro/demo/dashboard`
- Таким образом middleware при следующей загрузке страницы получит локаль из session/cookie

### Синхронизация локали i18n с URL (`resources/js/app.js`)

- `router.beforeEach`:
  - при каждой навигации выставляется `i18n.global.locale.value = to.params.locale || window.locale || "en"`
- Монтирование приложения:
  - выполняется после `router.isReady()`
  - устанавливается локаль i18n из текущего маршрута (или `window.locale`)
  - затем `app.mount("#app")`
  - так при загрузке страницы `/ro/survey` хедер сразу рендерится с переводами для `ro`

**✅ Выполнено**

- Header.vue:
  - переключатель при `languagesList.length > 1`
  - текущая локаль из `route.params.locale ?? initialLocale` (getInitialLocale из `data-locale` в onMounted)
  - смена через `POST /locale` и переход на `/{locale}/…`
  - используется `window.availableLocales` для корректной замены языка в URL

---

## 7. Словари и вывод переводов

**Каталог:** `lang/`

Используются только PHP-словари:

- По папке на локаль: `lang/en/messages.php`, `lang/ro/messages.php`
  - Массив `nav.menu` (how_it_works, for_whom, demo, survey)
- Агрегаты в корне: `lang/en.php`, `lang/ro.php`
  - Подключают через `require` соответствующие группы (например `messages`)
  - Эти файлы отдаёт во фронт SetLocale

### Вывод в Laravel (PHP/Blade)

- Локаль задаётся в `SetLocale` через `App::setLocale()`
  - Поэтому `__()` и `trans()` берут текущий язык
- Примеры:
  - `__('messages.nav.menu.how_it_works')`
  - `@lang('messages.nav.menu.demo')`
  - `trans('messages.nav.menu.survey')`

### Передача переводов во фронт (Vue)

- В `SetLocale`:
  - для каждой локали из списка допустимых подключается `lang_path($locale . '.php')`
  - результат по локалям собирается в `$translationsForFrontend`: `[ 'en' => [...], 'ro' => [...] ]`
- `View::share('translationsForFrontend', $translationsForFrontend)`
- В Blade в `<head>`:
  - инлайн-скрипт с `window.locale` и `window.translations` (до загрузки бандла)
  - во Vue эти переменные использует i18n

### Вывод во Vue

- i18n подключён централизованно: в `resources/js/app.js` один раз `app.use(i18n)`
- Конфиг в `resources/js/i18n.js`:
  - `createI18n({ legacy: false, locale: window.locale || "en", fallbackLocale: "en", messages: window.translations || {} })`
- В шаблонах Vue строка перевода выводится строкой: `{{ $t('ключ') }}`
  - Ключ совпадает со структурой PHP-словаря (например `messages.nav.menu.how_it_works`)
- Меню:
  - в `resources/js/config/nav.js` у пунктов поле `label` задаёт ключ перевода (`"messages.nav.menu.how_it_works"`, `"messages.nav.menu.for_whom"`, `"messages.nav.menu.demo"`, `"messages.nav.menu.survey"`)
  - в `NavMenuItem.vue` подпись выводится как `{{ $t(item.label) }}`

**✅ Выполнено**

Проверено: реализация соответствует разделу 7

- В `lang/` только PHP-словари:
  - `lang/en/messages.php`, `lang/ro/messages.php` (массив `nav.menu`)
  - агрегаты `lang/en.php`, `lang/ro.php`
- В `app/Http/Middleware/SetLocale.php`:
  - для каждой локали из `$available` подключается `lang_path($locale . '.php')`
  - результат передаётся во view через `View::share('translationsForFrontend', …)`
- В `resources/views/layouts/app.blade.php`:
  - в `<head>` скрипт с `window.locale` и `window.translations`
  - на `#app` — `data-locale`, `data-languages`
- В `resources/js/app.js`:
  - i18n подключается через `app.use(i18n)`
  - локаль синхронизируется с URL в `router.beforeEach` и перед mount после `router.isReady()`
- В `resources/js/i18n.js`:
  - `createI18n({ legacy: false, locale: window.locale || "en", fallbackLocale: "en", messages: window.translations || {} })`
- В `resources/js/config/nav.js`:
  - у пунктов меню `label` — ключи `messages.nav.menu.how_it_works` и т.д.
- В `resources/js/components/client/header/NavMenuItem.vue`:
  - подпись выводится как `{{ $t(item.label) }}`

---

## 8. Добавление новых ключей и локалей

### Новые ключи

- Добавить один и тот же ключ в `lang/{locale}/messages.php` (или другую группу)
  - При необходимости — в агрегат `lang/{locale}.php`
- В Blade: `__('messages.nav.…')` или по структуре группы
- Во Vue: `{{ $t('messages.…') }}` с тем же путём ключа

### Новые локали для переключателя

- Добавить код и подпись в `config/site/languages.php` в массив `countries`
- Добавить `lang/{code}.php` и `lang/{code}/messages.php` (и при необходимости другие группы)

### Фронт (Vue)

- Переводы приходят с бэка один раз при загрузке
  - SetLocale подключает PHP-словари `lang/{locale}.php` и отдаёт их в `window.translations`
  - vue-i18n инициализируется из `window.locale` и `window.translations`
- В компонентах вывод только через `{{ $t('ключ') }}`

**✅ Выполнено**

Проверено: добавление ключей и локалей по разделу 8 уже обеспечено

- Одна структура в `messages.php` и в агрегате; ключи в Blade и Vue по одному пути
- В `lang/en/messages.php` и `lang/ro/messages.php` добавлена секция `survey`:
  - ключи `title` и `description` (заголовок и описание страницы опроса)
- В `resources/js/pages/client/SurveyPlaceholder.vue`:
  - заголовок выводится через `{{ $t('messages.survey.title') }}`
  - текст — через `{{ $t('messages.survey.description') }}`
- На странице `/ro/survey` отображаются румынские строки («Sondaj», «Spuneți-ne despre afacerea dvs.…»)
- На `/en/survey` — английские

---

## 9. Порядок выполнения при запросе

1. Глобальные middleware (EncryptCookies, StartSession и т.д.), затем маршрут
2. Для `GET /`:
   - выбор локали: saved (session/cookie), если есть в (main + browser/fallback) → используем его
   - иначе → main
   - редирект на `/{locale}`
3. Для маршрутов с префиксом `{locale}` — middleware `SetLocale`:
   - допустимые локали из `config('site.languages.countries')`
   - определение 2 языков для переключателя:
     - основной (`main`) + (язык браузера если ≠ main и есть в списке, иначе `fallback_locale`)
   - определение активной локали:
     - saved (cookie/session), если есть в two → используем его
     - иначе → main
   - запись в session, `App::setLocale()`
   - формирование `languagesForFrontend` (2 языка)
   - загрузка PHP-словарей `lang/{locale}.php` → `translationsForFrontend`
   - `View::share('localeForFrontend', …)`, `View::share('languagesForFrontend', …)`, `View::share('translationsForFrontend', …)`
4. Рендер view:
   - в `<head>` layout скрипт с `window.locale`, `window.translations`, `window.availableLocales`
   - на `#app` — атрибуты `data-locale` и `data-languages`
5. Фронт:
   - vue-i18n инициализируется из `window.locale` и `window.translations`
   - перед mount вызывается `router.isReady()`, выставляется `i18n.global.locale` из URL/`window.locale`, затем `app.mount("#app")`
   - при навигации `router.beforeEach` синхронизирует локаль i18n с `to.params.locale`
   - переводы в шаблонах через `{{ $t('ключ') }}`
   - переключатель показывается только при `languagesList.length > 1`
   - по клику — `POST /locale`, переход на `/{locale}/…` (с заменой сегмента локали, используя `window.availableLocales`)

**✅ Выполнено**

---

## 10. История изменений

### Апрель 2026 — Исправление логики определения локалей

**Проблема:**

- При смене интерфейса браузера на English (с Icelandic) система продолжала использовать 'is' из cookie/session
- В переключателе отображались языки, которые не соответствовали текущему браузеру (например, EN/IS вместо EN/RO)
- При переходе между языками на страницах типа `/ro/demo/dashboard` происходил баг: URL становился `/en/ro/demo/dashboard` вместо `/en/demo/dashboard`

**Решение:**

- **`SetLocale.php`** — переписана логика:
  - Переключатель: всегда 2 языка — main + (browser если ≠ main и есть в списке, иначе fallback)
  - Активный язык: saved (cookie/session) только если есть в текущем списке отображаемых (two), иначе main
- **`LocaleController.php`** — обновлён `redirectToLocale()` для согласованности с новой логикой
- **`Header.vue`** — исправлен баг в `setLocale()`:
  - Раньше использовался только список из переключателя (2 языка) для парсинга URL
  - Теперь используется `window.availableLocales` — полный список всех языков
  - Это предотвращает дублирование языка в URL

**Результат:**

- При браузере = English: переключатель **EN/RO**, активный **EN**
- При браузере = German: переключатель **EN/DE**, активный **EN** (или **DE** если пользователь выбрал)
- Корректная замена языка в URL без дублирования сегментов
