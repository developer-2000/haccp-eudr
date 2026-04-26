# План миграции на Inertia.js

Постраничный план перевода Vue 3 SPA на Inertia.js + Vue 3 SSR с сохранением Laravel-инфраструктуры.

## Содержание

- Цель и принципы
- Фазы миграции
- Шаг 0. Подготовительные изменения (для всех страниц)
- Постраничный план: 9 страниц
  - Home
  - About
  - HowWorks
  - PrivacyPolicy
  - Contact
  - Survey
  - Demo (с подсекциями)
  - BatchPublic
  - DailyReportPublic
- Layout, общие компоненты, глобальные эффекты
- SSR-настройка и деплой
- Регрессионное тестирование
- Откат

---

## Цель

Получить SSR на каждом запросе для **8 публичных типов страниц** × 25 локалей = 275 URL'ов из sitemap.
Цель: Googlebot и пользователь получают полный HTML с meta (title, description, canonical, hreflang) **уже на первом byte**, без ожидания JS.

## Принципы

1. Backend Laravel остаётся как есть — роуты, контроллеры, сервисы, lang/, middleware, Eloquent.
2. Все данные для страницы (включая `seo`, `locale`, `siteConfig`) приходят как **Inertia props** с сервера.
3. `apiAxios` остаётся для асинхронных POST'ов (Contact-submit, Survey-submit, Survey-verify) — Inertia форму использовать там, где она оправдана.
4. `window.locale` / `window.translations` / `window.appName` уходят — заменяются на shared-props.
5. `Vue Router` уходит полностью — навигация через `<Link>` и `usePage()`.
6. `vue-i18n` остаётся, но инициализируется из shared-props на каждом запросе (а не из window).

---

## Фазы

### Фаза A: Bootstrap (2 дня)
Установка Inertia, рендер пустого Home через Inertia без SSR (только client-side).
Проверка что Vite-bundle и Laravel-роуты дружат.

### Фаза B: Миграция статичных страниц (3–4 дня)
Home, About, HowWorks, PrivacyPolicy. Без API, без форм.
Тут отрабатываются паттерны Layout, shared-props, locale, SEO.

### Фаза C: Миграция форм (3–4 дня)
Contact, Survey. Тут apiAxios остаётся, но добавляются Inertia-данные через props.

### Фаза D: Миграция динамических публичных (2 дня)
BatchPublic, DailyReportPublic. Данные для страницы рендерятся на сервере и приходят как props (вместо вызова `getBatchPublicRecord` на клиенте).

### Фаза E: Demo (1–2 дня)
Demo + grain-cooling переезжают как есть, но обёрнуты в `<ClientOnly>` для SSR.

### Фаза F: SSR-сервер, деплой, регрессии (2–3 дня)
`server.js` Inertia, supervisord, проверка naive-ui SSR, кэширование, financial pass.

**Итого 13–17 рабочих дней.** Лучше начинать с Фазы A после полного апрува.

---

## Шаг 0. Подготовительные изменения (общие для всех страниц)

### 0.1. Установка Inertia на бэке

```bash
composer require inertiajs/inertia-laravel
php artisan inertia:middleware
```

В `app/Http/Kernel.php` в группу `web` добавить middleware `\App\Http\Middleware\HandleInertiaRequests::class`.

### 0.2. Установка Inertia на фронте

```bash
npm i @inertiajs/vue3 @vue/server-renderer
```

### 0.3. Layout `app.blade.php`

Заменить `<div id="app">...</div>` на `@inertia`. Убрать `window.locale`, `window.translations`, `window.appName`, `window.adminEmail`, `window.availableLocales`, `window.localeHreflangMap`, `window.localeCountries` — всё это теперь будет приходить через Inertia props.

Оставить:

- `<meta name="csrf-token">` (Inertia читает)
- JSON-LD Organization
- favicon, Vite-bundle

### 0.4. HandleInertiaRequests — shared-props

В этом middleware централизованно собираются данные, которые есть **на каждой** странице:

- `locale` — текущая локаль (берётся из `App::getLocale()` после SetLocale-middleware)
- `availableLocales` — массив всех доступных
- `localeCountries`, `localeHreflangMap` — для переключателя и hreflang
- `siteConfig` → `{ name, adminEmail }` — заменяет `useSiteConfigStore`
- `translations[locale]` — для vue-i18n (только текущий язык, остальные подгружать lazy если нужно)
- `flash` — для toast-сообщений после редиректов

### 0.5. createInertiaApp в `resources/js/app.js`

Заменить `createApp()` + `app.use(router)` на:

```js
createInertiaApp({
    resolve: name => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue')),
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(pinia)
            .use(i18n)        // i18n инициализируется из props.initialPage.props.translations
            .use(Vue3Toastify, {...})
            .mount(el);
    },
});
```

Удалить:

- `import router from "./router"`
- `app.use(naive)` (уже сделано)
- весь блок `router.beforeEach` (логика синхронизации локали уходит в HandleInertiaRequests)

### 0.6. Новая структура `resources/js/Pages/`

Inertia ищет страницы по имени, переданному в `Inertia::render('Home')`. Создать папку `resources/js/Pages/` и поместить туда страницы:

- `Pages/Home.vue` ← из `pages/client/Home.vue`
- `Pages/About.vue`
- `Pages/HowWorks.vue`
- `Pages/PrivacyPolicy.vue`
- `Pages/Contact.vue`
- `Pages/Survey.vue`
- `Pages/Demo.vue`
- `Pages/BatchPublic.vue`
- `Pages/DailyReportPublic.vue`

Старую папку `pages/client/` после миграции удалить.

### 0.7. Layout-компонент

Создать `resources/js/Layouts/PublicLayout.vue` на основе текущего `basic/Index.vue`:

- `<n-message-provider>`
- `<Header />`
- `<GrainCoolingNotificationBanner />` (через `<ClientOnly>`)
- `<slot />` ← вместо `<router-view />`
- `<Footer />`
- `<ConsentOverlay />` (через `<ClientOnly>`)

В каждой Page-компоненте использовать через persistent layout:

```js
import PublicLayout from "@/Layouts/PublicLayout.vue";
defineOptions({ layout: PublicLayout });
```

### 0.8. routes/web.php — переход на `Inertia::render`

Каждый роут вместо `view('index-client')` теперь возвращает `Inertia::render('PageName', $props)`.

Пример:

```php
Route::get('/{locale}/about', function () {
    return Inertia::render('About', [
        'seo' => app(SeoMetaResolver::class)->resolve('about'),
    ]);
})->where('locale', $localePattern);
```

### 0.9. SEO meta через `<Head>` Inertia

Создать composable `usePageHead.js` (на основе текущего `usePageSeo.js`), но он принимает props, а не зависит от `useRoute`:

```js
import { Head } from '@inertiajs/vue3';
// в каждой странице:
<Head>
  <title>{{ seo.title }}</title>
  <meta name="description" :content="seo.description">
  <link rel="canonical" :href="seo.canonical">
  <link v-for="alt in seo.hreflang" :key="alt.hreflang" rel="alternate" :hreflang="alt.hreflang" :href="alt.href">
  <!-- og + twitter аналогично -->
</Head>
```

Серверный `SeoMetaResolver` уже есть — расширяется чтобы возвращать готовый объект `{ title, description, canonical, hreflang[], og, twitter }`.

### 0.10. apiAxios остаётся как есть

`X-Locale` interceptor продолжает работать. Только теперь читает из `usePage().props.locale` (а не из i18n.global.locale, хотя i18n тоже синхронизирован).

---

## Постраничный план

### Home

**Текущее состояние:** [resources/js/pages/client/Home.vue](resources/js/pages/client/Home.vue), 59 строк. 4 дочерних компонента из `components/client/home/`. Нет API, нет роутера, нет window-доступа.

**Сложность миграции:** **очень низкая**.

**Что делать:**

1. Скопировать в `resources/js/Pages/Home.vue`.
2. Импорт `usePageSeo` заменить на новый `usePageHead` (или удалить и использовать `<Head>` напрямую).
3. Добавить `defineOptions({ layout: PublicLayout })`.
4. Контроллер: создать роут `/{locale}` который возвращает `Inertia::render('Home', ['seo' => SeoMetaResolver::resolve('home', $locale)])`.
5. Дочерние компоненты (`HeroSection`, `MetricsSection`, `NichesSection`, `SurveyCtaSection`) **не трогаем** — они уже не зависят от роутера.

**Риски:** ноль.

**SSR-проверка:** не использует `window`, `document`, `localStorage` — рендерится на сервере без проблем.

---

### About

**Текущее состояние:** [resources/js/pages/client/About.vue](resources/js/pages/client/About.vue), 1020 строк. Snap-скролл с DOM-кэшированием, `document.querySelector`, `window.setTimeout`, `requestAnimationFrame`.

**Сложность миграции:** **средняя**, из-за DOM-логики.

**Что делать:**

1. Скопировать в `Pages/About.vue`.
2. Все обращения к `document` и `window` обернуть в `if (typeof window !== "undefined")` или вынести из `setup` в `onMounted` (там `window` уже доступен).
3. `programmaticNav`-флаги, `finishProgrammaticNav` — оставить как есть, но проверять что вызываются после mount.
4. Класс `main-content--bg-style-white` сейчас выставляется через `Index.vue:8` по `route.name === "About"`. После миграции — выставлять через layout-prop или через CSS scoped к Page-компоненту:
   ```vue
   <Head>
     <body class="main-content--bg-style-white" />
   </Head>
   ```
5. Контроллер: `Inertia::render('About', ['seo' => SeoMetaResolver::resolve('about', $locale)])`.
6. `usePageSeo({ i18nKey: "seo.about" })` → `<Head>` с props.

**Риски:** snap-скролл может сломаться при гидратации (если HTML с сервера и DOM-эффекты на клиенте конфликтуют). Решается обёрткой scroll-логики в `onMounted` + `nextTick`.

**SSR-проверка:** на сервере `<main>` рендерится без скролл-эффектов; после гидратации эффекты подключаются.

---

### HowWorks

**Текущее состояние:** [resources/js/pages/client/HowWorks.vue](resources/js/pages/client/HowWorks.vue), 33 строки. 3 дочерних компонента, без API, без window.

**Сложность миграции:** **очень низкая**.

**Что делать:**

1. Скопировать в `Pages/HowWorks.vue`.
2. `<Head>` через props.
3. `defineOptions({ layout: PublicLayout })`.
4. Контроллер: `Inertia::render('HowWorks', ['seo' => SeoMetaResolver::resolve('how_it_works', $locale)])`.

**Риски:** ноль.

---

### PrivacyPolicy

**Текущее состояние:** [resources/js/pages/client/PrivacyPolicy.vue](resources/js/pages/client/PrivacyPolicy.vue), 190 строк. Использует `useSiteConfigStore` для подстановки `name` и `adminEmail`.

**Сложность миграции:** **низкая**.

**Что делать:**

1. Скопировать в `Pages/PrivacyPolicy.vue`.
2. Заменить `useSiteConfigStore` на чтение из `usePage().props.siteConfig.name` и `usePage().props.siteConfig.adminEmail` (приходят из shared-props HandleInertiaRequests).
3. Сам `useSiteConfigStore` после миграции **можно удалить** — он не нужен (значения уже есть в props).
4. `<Head>` через props.
5. Контроллер: `Inertia::render('PrivacyPolicy', ['seo' => ...])`.

**Риски:** ноль.

---

### Contact

**Текущее состояние:** [resources/js/pages/client/Contact.vue](resources/js/pages/client/Contact.vue), 552 строки. Форма с honeypot, валидация naive-ui, POST `/contact` через `apiAxios`.

**Сложность миграции:** **низкая**.

**Что делать:**

1. Скопировать в `Pages/Contact.vue`.
2. Импорты naive-ui (`NForm`, `NFormItem`, `NInput`, `NButton`) — оставить локальными, как сейчас.
3. **API-вызов оставить через apiAxios** — это единичный POST, переписывать в `useForm` от Inertia смысла мало (сложная honeypot-логика, валидация).
4. `<Head>` через props.
5. Контроллер на бэке для GET `/{locale}/contact`: `Inertia::render('Contact', ['seo' => ...])`.
6. POST `/contact` остаётся как есть в `ContactController` (вызывается через apiAxios).

**Альтернатива:** перенести submit на `useForm` Inertia. Тогда после успеха Laravel редиректит на `/{locale}/contact?sent=true` или возвращает `Inertia::back()->with('flash', ...)`. Toast показывается из shared-props `flash`. Это чуть менее прозрачно, чем сейчас, но уберёт CSRF-возню.

Рекомендация: **оставить apiAxios** на первом этапе. Переход на `useForm` — опционально, в фазе F.

**Риски:** ноль для apiAxios-варианта.

---

### Survey

**Текущее состояние:** [resources/js/pages/client/Survey.vue](resources/js/pages/client/Survey.vue), 1309 строк. Самый сложный файл.

Использует:

- GET `/survey/questions` в `onMounted` — загрузка вопросов с сервера
- POST `/survey/submit` — отправка lead'а
- POST `/survey/verify` — PIN-верификация
- `sessionStorage` для verification-token
- `localStorage` для submission-state
- `crypto.subtle.digest` для email-hash
- `document` для скролла
- `window.locale` как fallback в computed

**Сложность миграции:** **высокая**, но управляемая.

**Что делать:**

1. Скопировать в `Pages/Survey.vue`.
2. Заменить `useRoute()` на `usePage().props.locale` (или передавать локаль явно из shared-props).
3. `window.locale` fallback на 133 — убрать (берём только из props).
4. **GET `/survey/questions` перенести на сервер** — questions приходят как Inertia prop:
   ```php
   Inertia::render('Survey', [
       'seo' => ...,
       'questions' => app(SurveyQuestionsClientService::class)->getQuestionsForLocale($locale),
   ]);
   ```
   Это огромный плюс: вопросы рендерятся в HTML на сервере → SEO видит контент опроса → нет race condition на клиенте.
5. `loadSurveyQuestionsFromApi()` и его watch'ер — удалить.
6. POST `/survey/submit`, `/survey/verify` — **оставить через apiAxios**. Это нормально: Inertia не подходит для PIN-верификации (нужны точные status-коды).
7. `sessionStorage` и `localStorage`-доступ — **уже** обёрнут в `typeof window !== "undefined"` проверки, оставить как есть.
8. `crypto.subtle.digest` — уже с fallback'ом, оставить.
9. `document.querySelector` для скролла — обернуть в `onMounted` или `typeof document !== "undefined"`.
10. `usePageSeo` → `<Head>`.

**Риски:** среднии. Главное — гидратация после рендера сервером не должна перетереть localStorage-state. Решается порядком: сначала рендерим server-state, после mount читаем localStorage и обновляем reactive-state, если данные не противоречат.

**SSR-проверка:**

- ✓ questions в HTML с сервера
- ✓ форма видна сразу
- ✓ PIN-экран по-прежнему client-only (показывается после submit)
- ✗ ChatGPT-style "ты уже отправлял опрос" из localStorage — показывается только после mount, не в SSR

---

### Demo

**Текущее состояние:** [resources/js/pages/client/Demo.vue](resources/js/pages/client/Demo.vue), 9 строк (wrapper). Реальная логика в `features/demo/page/DemoPage.vue` и куче дочерних компонентов с `n-modal`, `n-config-provider`, темной темой, useMessage и т.д.

**Сложность миграции:** **средняя**, потому что демо — это чисто client-side experience.

**Что делать:**

1. Скопировать в `Pages/Demo.vue`.
2. **Обернуть всё содержимое демо в `<ClientOnly>`** или сделать `<DemoPage>` динамическим импортом:
   ```vue
   <ClientOnly>
       <DemoPage />
   </ClientOnly>
   ```
3. На сервере отдавать минимальный fallback (заголовок "Demo, loading..." или skeleton) — для SEO демо не критично.
4. `useGrainCoolingDemoEntry()` остаётся в App.vue (не в Page!), но обёрнут в `if (typeof window !== "undefined")`.
5. Контроллер: `Inertia::render('Demo', ['section' => $section, 'seo' => ...])`.

**Риски:** naive-ui компоненты с popover/modal могут давать SSR-warnings. Через `<ClientOnly>` это решается.

**SSR-проверка:** SSR отдаёт только обёртку, реальный demo рендерится после гидратации.

---

### BatchPublic

**Текущее состояние:** [resources/js/pages/client/BatchPublic.vue](resources/js/pages/client/BatchPublic.vue), 603 строки. Читает данные из `getBatchPublicRecord(batchId)` (демо-функция), берёт `batchId` и `locale` из URL-params.

**Сложность миграции:** **средняя**, потому что это **отдельный слой**, который должен быть SEO-оптимизированным (динамический контент с описанием продукта).

**Что делать:**

1. Скопировать в `Pages/BatchPublic.vue`.
2. **Данные batch'а передавать через props с сервера**:
   ```php
   Route::get('/{locale?}/batch/{batchId}', function ($locale, $batchId) {
       $batch = ...; // serverside resolver getBatchPublicRecord
       return Inertia::render('BatchPublic', [
           'batch' => $batch,
           'seo' => app(SeoMetaResolver::class)->resolveBatch($batch, $locale),
       ]);
   });
   ```
3. На клиенте: убрать `getBatchPublicRecord` из `useRoute().params.batchId` — теперь batch приходит из props.
4. `window.locale` fallback убрать — берём из props.
5. `usePageSeo({ i18nParams: batchSeoParams })` → `<Head>` с динамическим title и description.
6. `route.query.print` → `usePage().props.print` (через query-параметр URL Laravel).
7. `window.print()`, `window.close()` — оставить, они в click-handler'ах.

**Риски:** низкие. Главное — server-side resolver `getBatchPublicRecord` должен быть надёжным. Сейчас это демо-функция — нужно либо сделать PHP-эквивалент, либо БД-запрос.

**SSR-проверка:** ✓ batch-карточка полностью рендерится на сервере, Googlebot видит весь контент.

---

### DailyReportPublic

**Текущее состояние:** [resources/js/pages/client/DailyReportPublic.vue](resources/js/pages/client/DailyReportPublic.vue), 1340 строк. Читает данные через `getDailyReportSnapshot(safe)`, пользует `route.params.date`, `window.scrollY`, `document.documentElement.scrollTop`, sсroll-listener в onMounted.

**Сложность миграции:** **средняя**, аналогично BatchPublic + дополнительные client-эффекты.

**Что делать:**

1. Скопировать в `Pages/DailyReportPublic.vue`.
2. **Данные report'а передавать через props с сервера**:
   ```php
   Route::get('/{locale?}/report/{date}', function ($locale, $date) {
       $report = ...; // PHP-эквивалент getDailyReportSnapshot
       return Inertia::render('DailyReportPublic', [
           'report' => $report,
           'seo' => app(SeoMetaResolver::class)->resolveReport($report, $locale),
       ]);
   });
   ```
3. `getWindowScrollTop()` на 614 — обернуть `typeof window !== "undefined"` (или вынести в onMounted).
4. addEventListener для scroll — уже в `onMounted`, OK.
5. `window.print()`, `window.close()`, `window.history.back()` — в click-handlers, OK.
6. `usePageSeo({ i18nParams: reportSeoParams })` → `<Head>`.

**Риски:** низкие. Те же, что и в BatchPublic + scroll-utils.

**SSR-проверка:** ✓ табличный отчёт рендерится на сервере, Googlebot видит структурированный контент.

---

## Layout, общие компоненты, глобальные эффекты

### `Index.vue` → `Layouts/PublicLayout.vue`

Просто реструктурировать. `<router-view />` заменить на `<slot />`.

### `Header.vue`

- Сейчас имеет language-switcher и POST `/locale`. После миграции этот POST остаётся (LocaleController), но в shared-props добавить `currentLocale` чтобы Header знал что подсветить.
- `router.push` (если есть) заменить на `router.visit` от Inertia.
- `<router-link>` заменить на `<Link>` от Inertia.

### `Footer.vue`

Минимальная правка: `<router-link>` → `<Link>`.

### `ConsentOverlay.vue`

Использует `useRoute().name === "PrivacyPolicy"` — заменить на `usePage().component === "PrivacyPolicy"`.

### `GrainCoolingNotificationBanner.vue`

Глобальный компонент в layout. **Обернуть в `<ClientOnly>`** — на сервере он не нужен, на клиенте включается при mount.

### `useGrainCoolingDemoEntry()` в App.vue

Полностью клиентский эффект. Безопасно: `onMounted`-логика вызывается только в браузере. Никаких изменений не требует, просто убедиться что не вызывается в setup-фазе.

### `useSessionGuard()` в App.vue

Та же история — `visibilitychange` навешивается в `onMounted`. SSR-safe.

### `useSiteConfigStore`

После миграции **больше не нужен**. Удалить файл `stores/site_config.js` и упоминания. Все обращения заменить на `usePage().props.siteConfig.*`.

### `vue-i18n` инициализация

Сейчас в `i18n.js`: `locale: window.locale || "en"`. После миграции:

```js
export const i18n = createI18n({
    legacy: false,
    locale: "en", // временный, потом переопределяется
    fallbackLocale: "en",
    messages: {},
});

// в app.js setup:
i18n.global.locale.value = props.initialPage.props.locale;
i18n.global.setLocaleMessage(
    props.initialPage.props.locale,
    props.initialPage.props.translations,
);
```

При переходе между страницами locale обновляется через Inertia hook on visit success.

---

## SSR-настройка и деплой

### `resources/js/ssr.js`

Точка входа для серверного рендера:

```js
import { createInertiaApp } from "@inertiajs/vue3/server";
import createServer from "@inertiajs/vue3/server";
import { renderToString } from "@vue/server-renderer";
import { createSSRApp, h } from "vue";
// ... весь setup как в app.js, но с createSSRApp вместо createApp
```

### `vite.config.mjs`

Добавить SSR-target:

```js
export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/js/app.js", "resources/scss/app.scss"],
            ssr: "resources/js/ssr.js",
        }),
        vue({ template: { transformAssetUrls: { ... } } }),
    ],
});
```

### Build-команда

```bash
npm run build               # client bundle
npm run build:ssr           # server bundle (vite build --ssr)
```

### Production process

Запуск SSR-сервера:

```bash
php artisan inertia:start-ssr
```

Через supervisord или systemd:

```ini
[program:inertia-ssr]
command=php artisan inertia:start-ssr
autostart=true
autorestart=true
user=www-data
```

### Кэширование

Inertia сам не кэширует. Можно поверх — Cloudflare Edge Cache для GET-страниц (кроме страниц с user-state). Для динамических BatchPublic / DailyReportPublic — кэшировать по batchId/date с TTL.

---

## Регрессионное тестирование

Прогнать вручную после миграции каждой фазы:

1. **SEO-проверка через `curl`** — для каждой страницы проверить что title, description, canonical, hreflang **уже есть в HTML без выполнения JS**:
   ```bash
   curl -s http://haccpilot.local/en/about | grep -E "<title>|<meta name=\"description\"|<link rel=\"canonical\""
   ```
2. **Поведенческие проверки в браузере**:
   - Все страницы открываются без console-ошибок
   - Переключатель языков работает (URL меняется + контент меняется)
   - `<Link>` навигация — без полного reload
   - Contact-форма отправляется и показывает toast
   - Survey: вопросы видны сразу, submit с email → PIN-экран → верификация
   - BatchPublic / DailyReportPublic — данные на сервере + window.print() работает
   - Demo — после mount всё работает как сейчас
   - 419-handler в apiAxios + sessionGuard — продолжает работать
3. **Lighthouse / PageSpeed** на 5 главных страницах — LCP / FCP должны заметно вырасти.
4. **Googlebot simulation** — открыть в Chrome DevTools "Disable JavaScript", проверить что контент видим.
5. **Hreflang validator** (Screaming Frog или https://technicalseo.com/tools/hreflang/).

---

## Откат

Стратегия отката простая, потому что Laravel-инфраструктура не меняется:

1. Все Inertia-роуты в `routes/web.php` идут параллельно текущим (либо в `routes/inertia.php` подключаемом по фиче-флагу). Можно поэтапно мигрировать.
2. Старая папка `pages/client/` сохраняется до полной миграции.
3. Старый `app.js` сохраняется как `app.legacy.js`. В случае серьёзных проблем `vite.config.mjs` переключается на старый entry за минуту.
4. Перед каждым деплоем — снимок production-bundle в S3 для быстрого rollback.

---

## Финальный чек-лист

Перед merge'ем в master:

- [ ] Все 9 страниц мигрированы и тестово открываются
- [ ] SEO-meta присутствует в HTML без JS (curl-проверка)
- [ ] Vue Router нигде не импортируется
- [ ] `window.locale`, `window.translations`, `window.appName` нигде не используются
- [ ] `useSiteConfigStore` удалён
- [ ] `naive-ui` глобально не подключён (это уже сделано)
- [ ] SSR-сервер запускается без ошибок и warnings
- [ ] PageSpeed показывает LCP < 2.5s, FCP < 1.5s на 4 ключевых страницах
- [ ] Все формы (Contact, Survey-submit, Survey-verify) работают
- [ ] Hreflang валиден для всех 25 локалей × 7 страниц
- [ ] Sitemap.xml актуален
- [ ] CSRF и sessions работают
- [ ] grain-cooling demo продолжает работать на /demo и /:locale страницах

---

## Ожидаемая выгода

- Полный HTML на первом byte вместо пустого `<div id="app">`
- Title / description / canonical / hreflang **в HTML до выполнения JS** — главное для SEO
- LCP / FCP сокращаются на 40–60% (контент не ждёт ни app.js, ни i18n, ни роутера, ни API-fetch)
- Survey-страница теперь **индексируется с вопросами** в HTML
- BatchPublic / DailyReportPublic индексируются с продуктами и компаниями
- Сохранение всей backend-инфраструктуры — никакого технического долга от ALL-NEW Nuxt/headless разделения
