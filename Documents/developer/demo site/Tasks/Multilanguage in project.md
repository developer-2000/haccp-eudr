# Мультиязычность в проекте HACCP-EUDR

Описание реализации переключения языков и передачи локали от конфига до фронта.

## Краткий чек-лист

- Язык по умолчанию — `config('app.locale')`. Резерв — `config('app.fallback_locale')`.
- Список допустимых локалей и подписи для переключателя — из `config('site.languages.countries')`.
    - Один массив.
- Текущая локаль (приоритет): **session → cookie → Accept-Language (браузер) → main**. Реализовано через хелпер `preferred_language_from_request()` в `app/Helpers/helpers.php`.
- «Вторая» локаль для переключателя — из `LocaleDetector::detect()`: язык браузера (Accept-Language) из допустимых, иначе `fallback_locale` (резерв под IP/geo в `detectByIp()`).
- Middleware `SetLocale`:
    - выбор локали: session → cookie → Accept-Language → main;
    - установка `App::setLocale()`, запись в session;
    - массив из **двух** языков для переключателя: 1) текущая локаль, 2) язык браузера (если совпадает — fallback из countries);
    - загрузка PHP-словарей `lang/{locale}.php` → `translationsForFrontend`;
    - кеша нет.
- `POST /locale`:
    - валидация по всем ключам `countries`;
    - запись в session и cookie;
    - ответ JSON.
- Словари: только PHP — `lang/{locale}/messages.php` и агрегаты `lang/{locale}.php`.
    - Вывод в Blade через `__()`, `trans()`.
    - Те же словари передаются во Vue через `window.translations` (скрипт в `<head>`); вывод во Vue строкой `{{ $t('ключ') }}`.
    - i18n подключён один раз в app через `app.use(i18n)`; локаль синхронизируется с URL (router.beforeEach, установка перед mount после router.isReady).
- Переключатель во фронте:
    - данные из `data-locale` и `data-languages`;
    - **показывается только если во фронт передано больше одного языка** (`languagesList.length > 1`);
    - смена через `POST /locale` и переход на новый URL с нужным `{locale}`.

---

## 1. Конфиг языков

**Файл:** `config/site/languages.php`

Сейчас в конфиге один массив:

- **countries** — ассоциативный массив: код локали/страны → `prefix`, `name`.
  - Коды: `en`, `at`, `be`, `bg`, `hr`, `cy`, `cz`, `dk`, `ee`, `fi`, `fr`, `de`, `gr`, `hu`, `is`, `ie`, `it`, `li`, `lv`, `lt`, `lu`, `mt`, `nl`, `no`, `pl`, `pt`, `ro`, `sk`, `si`, `es`, `se`, `ch`.
  - Используется и как список **допустимых локалей** (ключи), и как справочник подписей для переключателя (prefix/name).

Язык по умолчанию для приложения:

- Задаётся в `config/app.php`: ключ `locale` → `env('APP_LOCALE', 'en')`.
- Резервный: `fallback_locale` → в проекте задан `'at'`.

**✅ Выполнено**

Проверено: конфиг соответствует плану.

- В `config/site/languages.php` — массив `countries` с кодами:
  - en, at, be, bg, hr, cy, cz, dk, ee, fi, fr, de, gr, hu, is, ie, it, li, lv, lt, lu, mt, nl, no, pl, pt, ro, sk, si, es, se, ch.
- У каждой записи есть `prefix` и `name`.
- В `config/app.php`: `locale` задаётся через `env('APP_LOCALE', 'en')`.
  - `fallback_locale` равен `'at'`.
- Дополнительных правок не потребовалось.

---

## 2. Определение «второй» локали (LocaleDetector)

**Класс:** `App\Services\LocaleDetector`

- Метод `detect(Request $request): string`.
- Возвращает язык браузера: первый код из заголовка Accept-Language, 
- входящий в допустимые (`config('site.languages.countries')`), 
- через хелпер `preferred_language_from_request($request, $available)`.
- Если браузер не отдал подходящий язык — вызывается `detectByIp($request)`:
  - Сейчас возвращает `config('app.fallback_locale', 'en')`.
  - Зарезервирован под будущий IP/geo-сервис.

**Хелпер:** `app/Helpers/helpers.php`

- `preferred_language_from_request(Request $request, array $available): ?string` — парсит Accept-Language, возвращает первый код из `$available`; при наличии у Request метода `getPreferredLanguage()` использует его, иначе разбор заголовка вручную.

**✅ Актуально**

- В `app/Services/LocaleDetector.php`: `detect()` использует `preferred_language_from_request()`, при пустом — `detectByIp()`.
- Middleware `SetLocale` резолвит сервис через `app(LocaleDetector::class)`.

---

## 3. Middleware SetLocale

**Файл:** `app/Http\Middleware\SetLocale.php`  
**Группа:** `web` (подключается к группе маршрутов с префиксом `{locale}`).

Что делает:

- Список допустимых локалей: `available_locales()` (ключи `config('site.languages.countries')`).
- Текущая локаль (по приоритету):
  1. Session: `$request->session()->get('locale')`
  2. Cookie: `$request->cookie('locale')`
  3. Accept-Language: `preferred_language_from_request($request, $available)`
  4. Иначе: `config('app.locale')` (main).
- При недопустимом значении подставляется main.
- Пишет выбранную локаль в session, вызывает `App::setLocale($locale)`.

Передача данных во фронт:

- Массив из **двух** языков для переключателя: 1) **текущая локаль** (`$locale`), 2) **язык браузера** (из `$fromBrowser` / `LocaleDetector::detect()`); если второй совпадает с первым или недопустим — подставляется fallback (en или main из countries).
- Для фронта: массив объектов `code`, `prefix`, `name` по этим кодам из `config('site.languages.countries')` → `languagesForFrontend`.
- Для каждой допустимой локали подключается `lang/{locale}.php` → `translationsForFrontend`.
- В view: `View::share('localeForFrontend', …)`, `View::share('languagesForFrontend', …)`, `View::share('translationsForFrontend', …)`.

**✅ Выполнено**

---

## 4. Маршруты и установка локали

**Файл:** `routes/web.php`

Корень:

- `GET /` — редирект на `/{locale}`.
  - Локаль берётся: session → cookie → Accept-Language (`preferred_language_from_request`) → `config('app.locale')`.
  - Должна входить в `config('site.languages.countries')`, иначе подставляется main.

Смена локали с фронта:

- `POST /locale`, имя маршрута: `locale.set`.
- Контроллер: `LocaleController::set`.
- Вход: тело запроса (JSON или form) с полем `locale` (например `"en"` или `"ro"`).
- Валидация: `locale` должен быть одним из ключей `config('site.languages.countries')`.
  - Разрешены все страны из конфига, не только main и detected.
- При успехе:
  - Запись в session.
  - Установка cookie `locale` на 1 год (`60 * 24 * 365` минут).
  - Ответ JSON: `{ "locale": "…" }`.
- CSRF: запрос с той же страницы.
  - Нужен заголовок `X-CSRF-TOKEN` или cookie (например, из `<meta name="csrf-token">`).

Группа SPA:

- Маршруты с префиксом `{locale}`.
  - Ограничение по коду из `config('site.languages.countries')`.
- Middleware группы: `setLocale`.
- Все GET отдают view `index-client` (SPA).

**✅ Выполнено**

Проверено по плану: реализация совпадает.

- **`routes/web.php`:**
  - `GET /` — редирект на `/{locale}` через `LocaleController::redirectToLocale`.
    - Локаль из session → cookie → Accept-Language → `config('app.locale')`; проверка по `available_locales()`, иначе main.
  - `POST /locale` (имя `locale.set`) — `LocaleController::set`.
    - Валидация `locale` по ключам конфига.
    - При успехе: запись в session, cookie на 60×24×365 минут, ответ JSON `{ "locale": "…" }`.
  - Группа с префиксом `{locale}`:
    - `where` по `implode` из `available_locales()`;
    - middleware `setLocale`;
    - все GET отдают view `index-client`.
- **`app/Http/Controllers/LocaleController.php`:**
  - Для метода `set()` добавлен PHPDoc (назначение и использование).

---

## 5. Передача локали и переводов во фронт (Blade)

**Файл:** `resources/views/layouts/app.blade.php`

В `<head>` (сразу после meta csrf-token) инлайн-скрипт для Vue i18n — чтобы `window.locale` и `window.translations` были заданы до загрузки бандла:

- `window.locale = "{{ $localeForFrontend ?? app()->getLocale() }}";`
- `window.translations = @json($translationsForFrontend ?? []);`

На блоке `#app` атрибуты для переключателя языков:

- `data-locale="{{ $localeForFrontend ?? app()->getLocale() }}"`
- `data-languages="{{ json_encode($languagesForFrontend ?? []) }}"`

Переменные задаются в middleware `SetLocale`.

Для доступности и SEO:

- В `<html>`: `lang="{{ str_replace('_', '-', app()->getLocale()) }}"`.

---

## 6. Переключатель языков во фронте (Vue)

**Файл:** `resources/js/components/client/header/Header.vue`

Инициализация (при монтировании):

- Список языков: парсится из атрибута `data-languages` у `#app`.
  - При ошибке или пустоте — запасной массив `[{ code: 'en', … }, { code: 'ro', … }]`.
- Текущая локаль: из `data-locale` у `#app`.
  - Должна входить в список языков; иначе берётся первый из списка или `'en'`.
- Для отображения в шапке используется `currentLocale = route.params.locale ?? initialLocale`.

Рендер:

- Блок переключателя показывается **только если во фронт передано больше одного языка** (`languagesList.length > 1`). При одном языке переключатель не отображается.
- Кнопки по `languagesList`:
  - подпись из `lang.prefix`;
  - `title` из `lang.name`;
  - активное состояние по `currentLocale === lang.code`.

Смена языка:

- Функция `setLocale(locale)`:
  - Отправляет `POST /locale` с телом `{ locale }` и заголовком `X-CSRF-TOKEN` (из `<meta name="csrf-token">`).
  - После запроса (успех или ошибка) выполняется переход по URL: `/{locale}/…` (текущий путь с заменой сегмента локали), а не просто `reload`.
- Таким образом middleware при следующей загрузке страницы получит локаль из session/cookie.

Логика «какие языки показывать» и «какая локаль сейчас» приходит с бэка (middleware); фронт только отображает и отправляет выбранный код.

**Синхронизация локали i18n с URL** (`resources/js/app.js`):

- `router.beforeEach`: при каждой навигации выставляется `i18n.global.locale.value = to.params.locale || window.locale || "en"`.
- Монтирование приложения выполняется после `router.isReady()`: устанавливается локаль i18n из текущего маршрута (или `window.locale`), затем `app.mount("#app")`. Так при загрузке страницы `/ro/survey` хедер сразу рендерится с переводами для `ro`.

**✅ Выполнено**

- Header.vue: переключатель при `languagesList.length > 1`; текущая локаль из `route.params.locale ?? initialLocale` (getInitialLocale из `data-locale` в onMounted); смена через `POST /locale` и переход на `/{locale}/…`.

---

## 7. Словари и вывод переводов

**Каталог:** `lang/`

Используются только PHP-словари:

- По папке на локаль: `lang/en/messages.php`, `lang/ro/messages.php`.
  - Массив `nav.menu` (how_it_works, for_whom, demo, survey).
- Агрегаты в корне: `lang/en.php`, `lang/ro.php`.
  - Подключают через `require` соответствующие группы (например `messages`).
  - Эти файлы отдаёт во фронт SetLocale.

**Вывод в Laravel (PHP/Blade):**

- Локаль задаётся в `SetLocale` через `App::setLocale()`.
  - Поэтому `__()` и `trans()` берут текущий язык.
- Примеры: `__('messages.nav.menu.how_it_works')`, `@lang('messages.nav.menu.demo')`, `trans('messages.nav.menu.survey')`.

**Передача переводов во фронт (Vue):**

- В `SetLocale`: для каждой локали из списка допустимых подключается `lang_path($locale . '.php')`.
  - Результат по локалям собирается в `$translationsForFrontend`: `[ 'en' => [...], 'ro' => [...] ]`.
- `View::share('translationsForFrontend', $translationsForFrontend)`.
- В Blade в `<head>`: инлайн-скрипт с `window.locale` и `window.translations` (до загрузки бандла). Во Vue эти переменные использует i18n.

**Вывод во Vue:**

- i18n подключён централизованно: в `resources/js/app.js` один раз `app.use(i18n)`.
- Конфиг в `resources/js/i18n.js`:
  - `createI18n({ legacy: false, locale: window.locale || "en", fallbackLocale: "en", messages: window.translations || {} })`.
- В шаблонах Vue строка перевода выводится строкой: `{{ $t('ключ') }}`.
  - Ключ совпадает со структурой PHP-словаря (например `messages.nav.menu.how_it_works`).
- Меню:
  - в `resources/js/config/nav.js` у пунктов поле `label` задаёт ключ перевода (`"messages.nav.menu.how_it_works"`, `"messages.nav.menu.for_whom"`, `"messages.nav.menu.demo"`, `"messages.nav.menu.survey"`);
  - в `NavMenuItem.vue` подпись выводится как `{{ $t(item.label) }}`.

**✅ Выполнено**

Проверено: реализация соответствует разделу 7.

- В `lang/` только PHP-словари:
  - `lang/en/messages.php`, `lang/ro/messages.php` (массив `nav.menu`);
  - агрегаты `lang/en.php`, `lang/ro.php`.
- В `app/Http/Middleware/SetLocale.php`: для каждой локали из `$available` подключается `lang_path($locale . '.php')`.
  - Результат передаётся во view через `View::share('translationsForFrontend', …)`.
- В `resources/views/layouts/app.blade.php`: в `<head>` скрипт с `window.locale` и `window.translations`; на `#app` — `data-locale`, `data-languages`.
- В `resources/js/app.js`: i18n подключается через `app.use(i18n)`; локаль синхронизируется с URL в `router.beforeEach` и перед mount после `router.isReady()`.
- В `resources/js/i18n.js`: `createI18n({ legacy: false, locale: window.locale || "en", fallbackLocale: "en", messages: window.translations || {} })`.
- В `resources/js/config/nav.js`: у пунктов меню `label` — ключи `messages.nav.menu.how_it_works` и т.д.
- В `resources/js/components/client/header/NavMenuItem.vue`: подпись выводится как `{{ $t(item.label) }}`.

---

## 8. Добавление новых ключей и локалей

Новые ключи:

- Добавить один и тот же ключ в `lang/{locale}/messages.php` (или другую группу).
  - При необходимости — в агрегат `lang/{locale}.php`.
- В Blade: `__('messages.nav.…')` или по структуре группы.
- Во Vue: `{{ $t('messages.…') }}` с тем же путём ключа.

Новые локали для переключателя:

- Добавить код и подпись в `config/site/languages.php` в массив `countries`.
- Добавить `lang/{code}.php` и `lang/{code}/messages.php` (и при необходимости другие группы).

Фронт (Vue):

- Переводы приходят с бэка один раз при загрузке.
  - SetLocale подключает PHP-словари `lang/{locale}.php` и отдаёт их в `window.translations`;
  - vue-i18n инициализируется из `window.locale` и `window.translations`.
- В компонентах вывод только через `{{ $t('ключ') }}`.

**✅ Выполнено**

Проверено: добавление ключей и локалей по разделу 8 уже обеспечено.

- Одна структура в `messages.php` и в агрегате; ключи в Blade и Vue по одному пути.
- В `lang/en/messages.php` и `lang/ro/messages.php` добавлена секция `survey`:
  - ключи `title` и `description` (заголовок и описание страницы опроса).
- В `resources/js/pages/client/SurveyPlaceholder.vue`:
  - заголовок выводится через `{{ $t('messages.survey.title') }}`;
  - текст — через `{{ $t('messages.survey.description') }}`.
- На странице `/ro/survey` отображаются румынские строки («Sondaj», «Spuneți-ne despre afacerea dvs.…»).
- На `/en/survey` — английские.

---

## 9. Порядок выполнения при запросе

1. Глобальные middleware (EncryptCookies, StartSession и т.д.), затем маршрут.
2. Для `GET /`: выбор локали из session → cookie → Accept-Language → main, редирект на `/{locale}`.
3. Для маршрутов с префиксом `{locale}`: middleware `SetLocale`:
   - допустимые локали из `config('site.languages.countries')`;
   - текущая локаль: session → cookie → Accept-Language (`preferred_language_from_request`) → main;
   - запись в session, `App::setLocale()`;
   - формирование двух языков для переключателя: текущая локаль + язык браузера (при совпадении — fallback) → `languagesForFrontend`;
   - загрузка PHP-словарей `lang/{locale}.php` → `translationsForFrontend`;
   - `View::share('localeForFrontend', …)`, `View::share('languagesForFrontend', …)`, `View::share('translationsForFrontend', …)`.
4. Рендер view:
   - в `<head>` layout скрипт с `window.locale` и `window.translations`;
   - на `#app` — атрибуты `data-locale` и `data-languages`.
5. Фронт:
   - vue-i18n инициализируется из `window.locale` и `window.translations`;
   - перед mount вызывается `router.isReady()`, выставляется `i18n.global.locale` из URL/`window.locale`, затем `app.mount("#app")`;
   - при навигации `router.beforeEach` синхронизирует локаль i18n с `to.params.locale`;
   - переводы в шаблонах через `{{ $t('ключ') }}`;
   - переключатель показывается только при `languagesList.length > 1`; по клику — `POST /locale`, переход на `/{locale}/…`.

**✅ Выполнено**

---

