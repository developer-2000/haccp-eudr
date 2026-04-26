# Анализ SEO и стратегии перехода на SSR

## TL;DR

Сейчас сайт — чистый Vue 3 SPA с Laravel-бэком, который отдаёт пустой `<div id="app">`.
Google действительно может это плохо индексировать (особенно мобильно — там бюджет рендеринга меньше).

Из двух вариантов миграции **Inertia SSR заметно проще**, чем Nuxt: ~1.5–3 недели работы против 4–7 недель.
Главная причина: Inertia сохраняет 100% Laravel-инфраструктуры (роуты, контроллеры, middleware, Eloquent, lang-файлы), а 
Vue-компоненты переносятся почти 1:1.

Третий путь — **prerender/SSG** через инструмент типа `prerender.io` или статическую генерацию во время build — даёт большую часть 
SEO-выгоды без переписывания, но с компромиссами для динамических страниц.

---

## Текущая архитектура

### Frontend
Vue 3 SPA, ~65 `.vue` файлов и ~68 `.js`.

Стек на фронте:

- vue 3.4
- vue-router 4 (с префиксом `/:locale/`)
- pinia 3
- vue-i18n 11 (25+ языков, переводы летят на фронт через `window.translations` из blade)
- naive-ui 2 (UI-библиотека, после оптимизации tree-shaking ок)
- @unhead/vue 2 (динамические meta-теги для каждой страницы — title, og, twitter, canonical, hreflang)
- vue3-toastify
- vue-tel-num-input, qrcode, libphonenumber-js, i18n-iso-countries

### Backend
Laravel 10, Sanctum, Sentry.

Контроллеры: SurveyQuestionsController, ContactController, LocaleController, MailTestController.
Сервисы: SurveyResponseService, SurveyQuestionsClientService, ContactMessageService, SeoMetaResolver, AppLogger, LocaleDetector.
Все публичные роуты в `routes/web.php` с middleware `setLocale`.
SetLocale читает локаль из URL-сегмента `{locale}`, опционально из `X-Locale` header (для POST'ов без префикса).
Есть Listeners для отправки писем (Survey, Mail).
Сессии — file-driver, лимит 120 минут.
CSRF — стандартный Laravel; на фронте есть глобальный 419-handler в apiAxios + ping `/session/ping` при возврате во вкладку.

### Public-страницы (нужны для SEO)
1. `/` (редирект на `/en/`)
2. `/:locale/` — Home
3. `/:locale/about` — About
4. `/:locale/how-it-works` — HowItWorks
5. `/:locale/privacy-policy` — PrivacyPolicy
6. `/:locale/contact` — Contact (форма)
7. `/:locale/survey` — Survey (форма + 4-значная верификация)
8. `/:locale/demo/:section` — Demo (огромная демо-логика, нужна для SEO в меньшей степени)
9. `/batch/:batchId`, `/:locale/batch/:batchId` — публичные карточки партий
10. `/report/:date`, `/:locale/report/:date` — публичные дневные отчёты

Все они сейчас — клиентский рендер из пустого blade-шаблона.

### Layout
`resources/views/layouts/app.blade.php`:

- meta csrf-token
- `window.locale`, `window.appName`, `window.translations`, `window.availableLocales`, `window.localeHreflangMap`, `window.localeCountries`
- title и базовые SEO-meta (по умолчанию)
- JSON-LD Organization
- vite-bundle подключается в head

`resources/views/index-client.blade.php` — наследует app-layout и просто отдаёт `<div id="app">`.

---

## Что видит Google сейчас

Googlebot 2024–2025 умеет рендерить JS, но:

- Бюджет рендеринга ограничен — медленные SPA получают меньше ресурсов.
- Mobile-индекс жёстче — пустой `<div id="app">` без fallback-контента в blade означает, что для первой волны парсинга страница пустая.
- LCP/FCP метрики падают: контент появляется только после загрузки app.js + i18n + router + страничного chunk'а + API-запросов.
- Динамические meta-теги через `@unhead/vue` ставятся **в JS**, 
- то есть к моменту первого парсинга у Googlebot нет ни title, ни description, ни canonical, ни hreflang — 
- всё это вставляется только после полного рендера Vue.

То есть проблема не только в контенте, но и в meta — критично для SEO.

---

## Вариант 1. Laravel + Inertia.js + Vue 3 SSR

### Что это
Inertia — мост между Laravel и Vue/React/Svelte.
Контроллеры Laravel вместо `view()` возвращают `Inertia::render('PageName', $props)`.
SSR-режим Inertia запускает отдельный Node.js процесс, который рендерит Vue-страницу в HTML на сервере.
Гидратация на клиенте превращает её обратно в живой SPA.

### Что остаётся как есть
Не трогаем:

- routes/web.php (только меняем return-тип)
- middleware (SetLocale, EncryptCookies, VerifyCsrfToken, и т.д.)
- Eloquent-модели, миграции, базу
- Listeners и Mail-классы
- lang/ переводы (vue-i18n продолжает работать на фронте + при необходимости __() на бэке)
- vite + scss + alias-конфиг
- naive-ui (нужно проверить SSR-режим компонентов с `n-config-provider`, обычно ок)
- pinia stores (Inertia с ними дружит)
- @unhead/vue заменяется на встроенный `<Head>` от Inertia — практически 1:1
- весь backend-код апишек (`/survey/submit`, `/survey/verify`, `/contact`) — продолжает работать через apiAxios

### Что меняется
Vue Router больше не нужен — Inertia сам собирает роутинг через Laravel routes.
Это значит: каждый `<router-link>` → `<Link>` от Inertia, `useRoute()` → `usePage()`, `router.push()` → `router.visit()`.

Структура `resources/js/pages/` остаётся, добавляется `resources/js/Pages/` (Inertia ищет именно там — можно указать путь в инициализации).

В blade-шаблоне `<div id="app">` заменяется на `@inertia` (Inertia-директива печатает root + props).
В `app.js` вместо `createApp().use(router)` — `createInertiaApp()` с resolve-функцией компонентов.

`server.js` — отдельная Node-точка входа для SSR. Запускается командой `node bootstrap/ssr/ssr.js` или `php artisan inertia:start-ssr` в проде.

Для SEO meta — в каждой странице импортируется `Head` от Inertia и пропсы для title/description/og приходят из контроллера через SeoMetaResolver. 
Сейчас вы это уже делаете на фронте — переносится буквально.

### Многоязычность
Префикс `/:locale/` уже работает на бэке (route group + middleware setLocale).
В Inertia передаём текущую локаль через shared props — vue-i18n инициализируется с этой локалью на сервере, и страница рендерится сразу на нужном языке.
hreflang — через `<Head>` или централизованный composable `usePageSeo`.

### Demo и grain-cooling
Самый сложный кусок. `useGrainCoolingDemoEntry` watch'ит route — это поведение чисто клиентское.
В SSR `onMounted`-логика не запускается (это правильно).
Решение: проверять в код `if (typeof window !== 'undefined')` или использовать `onMounted` (он только на клиенте).
Демо-страницы можно рендерить как чисто client-only (`<ClientOnly>` обёртка), потому что для SEO они малоценны.

### Сложности
1. naive-ui SSR — на одних компонентах работает, на других есть warnings (тёмные темы, popover'ы). Нужно тестировать пошагово.
2. `window.locale`, `window.translations` — на сервере нет `window`. Вместо этого передавать через Inertia shared props.
3. Vue Router → Inertia — нужно пройтись по всем `router.push`, `useRoute`, `<router-link>`. По grep я вижу около 20–30 мест.
4. Apiaxios остаётся, но многие данные теперь приходят как props — переписать data-fetching в страничных компонентах (особенно Home, BatchPublic, DailyReportPublic, Survey).
5. Sessions/CSRF — Inertia это понимает из коробки, ничего не ломается.
6. Развёртывание: нужен Node-процесс параллельно с PHP-FPM (через systemd, supervisord или Forge).

### Приблизительная оценка трудозатрат
Чистая работа без блокеров: **10–15 рабочих дней**.

Разбивка:

- 2 дня: установка Inertia, базовая настройка, рендер первой страницы (Home)
- 3–4 дня: миграция всех страниц (router → Inertia, useRoute → usePage, Link, etc.)
- 2 дня: миграция data-fetching (контроллеры готовят props вместо API-only)
- 1–2 дня: SeoMetaResolver + `<Head>` интеграция, hreflang
- 2–3 дня: SSR-настройка (server.js), деплой, проверка naive-ui
- 1 день: грейн-кулинг demo через ClientOnly
- 1–2 дня: фиксы regression (формы Contact/Survey, locale switching, sessionGuard, csrf)

### Что выигрываем
- Полноценный HTML на первом запросе → SEO
- LCP/FCP уменьшаются (контент готов раньше, нет ожидания JS)
- Можно оставить SPA-ощущение для кликов между страницами (Inertia делает navigation без полной перезагрузки)
- Title/description/canonical в HTML c первого byte

---

## Вариант 2. Nuxt.js (универсальный SSR/SSG)

### Что это
Nuxt — это Vue framework со встроенным SSR/SSG/ISR, полностью отделённый от Laravel.
Frontend становится отдельным приложением на Node, Laravel остаётся как API-only.

### Что остаётся
Из Laravel:

- routes/api.php (нужно перепроектировать — все эндпоинты как REST API)
- контроллеры, сервисы, модели — без изменений
- listeners, mail
- middleware (но без setLocale в web — теперь локаль определяется на стороне Nuxt)
- lang-файлы — нужно либо отдавать через API, либо забрать в Nuxt (`@nuxtjs/i18n` поддерживает оба варианта)

Из текущего фронта:

- большинство Vue-компонентов переносится 1:1
- pinia stores — переносятся
- naive-ui — переносится, есть `nuxtjs/naive-ui` модуль
- стили SCSS — переносятся

### Что переписывается
1. **Структура проекта**: `pages/`, `components/`, `composables/`, `layouts/`, `middleware/`, `plugins/` — всё по конвенции Nuxt.
2. **Роутинг**: автоматический по структуре `pages/` — но нужно учесть многоязычные URL `/:locale/`.
3. **i18n**: переход на `@nuxtjs/i18n` — переписать все `useI18n()` calls (часть совместима, часть отличается).
4. **Data fetching**: вместо apiAxios → `useFetch`, `useAsyncData`, `$fetch` (Nuxt-овые композаблы).
5. **SEO/meta**: `useHead`, `useSeoMeta` — встроены в Nuxt (это и есть `@unhead/vue` под капотом, что уже используется — этот кусок переедет легко).
6. **CSRF и сессии**: совсем другая модель — Nuxt API-клиент должен явно работать с Sanctum/CSRF токенами через interceptors.
7. **Деплой**: Node-сервер (Nuxt) + PHP-FPM (Laravel API) на разных доменах или через прокси.

### Сложности
1. Принципиальная архитектурная смена: фронт и бэк теперь полностью разделены.
2. Все формы (Contact, Survey, Locale-switcher) переписать под `$fetch` + Sanctum/Bearer-токены или CORS+credentials.
3. `useGrainCoolingDemoEntry` watch'ит router — нужно адаптировать под Nuxt-router.
4. `naive-ui` SSR — те же риски что и в Inertia.
5. CORS, sessions, CSRF — нужно настраивать на Laravel (Sanctum SPA mode), поскольку Nuxt теперь cross-origin.
6. Переключатель локалей — переписать через `@nuxtjs/i18n` или вручную (route-prefix mode).
7. Деплой и инфра: два процесса, два домена (или nginx-прокси), двойной CI/CD.

### Приблизительная оценка трудозатрат
Чистая работа: **20–35 рабочих дней**.

Разбивка:

- 2 дня: bootstrap нового Nuxt-проекта, базовый layout
- 4–5 дней: миграция всех страниц + auto-imports + composables
- 3 дня: настройка @nuxtjs/i18n (с lang/ файлами или через API)
- 4–5 дней: API-слой — переписать apiAxios под $fetch с Sanctum
- 3 дня: SSR-проверка naive-ui, грейн-кулинг через `<ClientOnly>`
- 3 дня: CORS, sessions, CSRF, переключатель локалей
- 3–5 дней: SEO meta для всех страниц, sitemap, robots
- 3–5 дней: настройка деплоя (Docker/nginx/process-manager) + регрессии
- 2–3 дня: тестирование, баги, миграция админки если есть

### Что выигрываем
- Лучшая SSG/ISR-производительность (можно пререндерить статические страницы заранее)
- Богатая экосистема Nuxt-модулей (sitemap, robots, image, analytics)
- Полноценное разделение фронт/бэк — масштабируется лучше
- Edge-deployment возможен (Vercel, Netlify, Cloudflare Workers)

### Что теряем
- Время и деньги
- Тесная интеграция с Laravel (формы → контроллеры → сразу render)

---

## Вариант 3. Prerender / SSG-инструменты (компромисс)

### Что это
Вместо переписывания архитектуры — добавить prerender-слой, который один раз делает rendering публичных страниц через Headless Chrome 
(например, `prerender.io`, `@chromeaway/prerender-spa-plugin`, `vite-ssg`) и отдаёт уже готовый HTML.

### Как работает
- При build-времени Puppeteer обходит публичные URL (`/en/about`, `/de/about`, `/en/how-it-works`, ...) и сохраняет статичный HTML.
- Nginx/Laravel определяет user-agent: если Googlebot → отдаёт prerendered HTML, иначе — стандартный SPA.
- Либо `prerender.io` как SaaS — работает прокси перед сайтом.

### Сложности
1. Динамические страницы (`/batch/:batchId`, `/report/:date`) prerender-у не подходят — их слишком много, и они меняются.
2. С 25+ языками × ~7 публичных страниц = 175+ HTML-файлов. Build будет медленным, но это терпимо.
3. Формы (Contact, Survey) — после prerender они тоже статичны, но JS-гидратация подключит логику.
4. Это «SEO-хак», а не настоящее улучшение UX. LCP всё равно остаётся плохим для реальных пользователей (потому что HTML тяжелее, плюс гидратация).

### Приблизительная оценка
3–5 рабочих дней.

### Когда это выбирать
Если нужен быстрый SEO-фикс под deadline, без переписывания.
Если динамики мало, статики много.
Как «временное решение, пока работаем над Inertia».

---

## Сравнение

### Сложность миграции
Inertia: средняя (1.5–3 недели).
Nuxt: высокая (4–7 недель).
Prerender: низкая (3–5 дней).

### Сохранение Laravel-логики
Inertia: 100%.
Nuxt: API-only (всё, что было web — переписывается).
Prerender: 100%.

### Качество SEO
Inertia: отличное (SSR на каждый запрос, полный HTML, актуальные meta).
Nuxt: отличное (плюс возможность SSG для статики).
Prerender: хорошее для статики, нулевое для динамики.

### Скорость для пользователя (LCP/FCP)
Inertia: значительно лучше SPA.
Nuxt: значительно лучше SPA, плюс edge-возможности.
Prerender: для первого byte лучше, для интерактивности так же.

### Цена эксплуатации
Inertia: чуть выше (Node для SSR-процесса + PHP-FPM).
Nuxt: выше (полноценный Node-сервер + Laravel-API + nginx-прокси/два домена).
Prerender: минимально выше (build-step стал длиннее).

### Будущее развитие
Inertia: остаётесь в Laravel-экосистеме.
Nuxt: переходите в Vue/Node-экосистему — больше возможностей, больше абстракций.
Prerender: ничего не меняется, накапливается технический долг.

---

## Рекомендация

Для вашего проекта **Inertia SSR** — оптимальный путь.

Причины:

- Сохраняется весь backend (роуты, middleware, контроллеры, сервисы, lang-файлы).
- Vue-компоненты переносятся почти без изменений.
- @unhead/vue → `<Head>` Inertia — это переименование импорта.
- vue-i18n продолжает работать.
- Многоязычные роуты `/:locale/` уже сделаны корректно.
- pinia, vite, scss, naive-ui — всё совместимо.
- Cookie/session/CSRF — нативно поддерживаются (никаких Sanctum SPA mode и CORS-боли).
- Команда не учит новый framework — просто немного новых паттернов.

Когда стоит выбирать **Nuxt**:

- Если в дорожной карте есть превращение бэка в headless API для нескольких клиентов (mobile app, white-label).
- Если нужна edge-deployment стратегия.
- Если команда уверенно владеет Node-инфрой.

Когда **prerender** имеет смысл:

- Чисто как промежуточный фикс на 1–3 месяца, пока идёт миграция на Inertia.
- Если 80% контента статичны, а формы можно жертвовать.

---

## Минимальные подготовительные шаги (независимо от выбора)

Эти задачи дают SEO-эффект уже сейчас, без переписывания:

1. **SeoMetaResolver на бэке**: рендерить базовые `<title>`, `<meta description>`, `<link rel="canonical">`, `<link rel="alternate" hreflang="...">` 
2. прямо в `app.blade.php` для каждого публичного URL — чтобы Googlebot получал meta до выполнения JS. Сейчас это делается только в `@unhead/vue` после рендера.
2. **Sitemap.xml**: уже частично есть (`server in sitemap` в коммитах), убедиться что покрывает все локали и динамические URL.
3. **robots.txt**: подсказать Googlebot, какие URL canonical, какие — noindex.
4. **Schema.org JSON-LD**: уже есть Organization (видел в `app.blade.php`); добавить FAQPage / Breadcrumb / Product (для batch).
5. **Минимальный скелет в `<div id="app">`**: вставить базовый h1 и текст ключевой страницы прямо в blade — чтобы у Googlebot было хоть что-то до рендера.

Шаги 1, 5 — самое быстрое и важное, занимают по 1–2 дня каждый.
После них SEO станет **значительно** лучше даже без Inertia/Nuxt.

---

## Резюме

Текущий SPA-подход действительно проигрывает по SEO.
Между Inertia и Nuxt разница в трудозатратах примерно 2.5×, а итоговый SEO-эффект сопоставим.
Inertia сохраняет всю накопленную Laravel-инфраструктуру, поэтому при прочих равных это разумный выбор для ваш бэкенд-ориентированный проект.

Перед началом любой большой миграции имеет смысл выкатить минимальные подготовительные шаги (раздел выше) — 
они дают 50–60% SEO-выигрыша за 2–3 дня и снимают давление таймлайна.
