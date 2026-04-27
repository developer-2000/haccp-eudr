
## Шаг 0. Подготовительные изменения (общие для всех страниц)

Цель Шага 0 — построить параллельную Inertia-инфраструктуру так, чтобы существующий сайт **продолжал работать** через старый SPA-bundle. Никакие старые файлы не удаляются и не переписываются. Когда все 9 страниц мигрируют, отдельным шагом удалим legacy.

---

### 0.1. Установка Inertia на бэке ✅ Выполнено

Команды:

```bash
composer require inertiajs/inertia-laravel
php artisan inertia:middleware
```

После этого появится файл `app/Http/Middleware/HandleInertiaRequests.php` — его дорабатываем в подпункте 0.4.

В `app/Http/Kernel.php` в массив `'web' => [...]` добавляем последним элементом:

```php
\App\Http\Middleware\HandleInertiaRequests::class,
```

**Что сделал:**

- Установил пакет `inertiajs/inertia-laravel` версии `v2.0.24` (запись добавилась в [composer.json](../../../../composer.json) и [composer.lock](../../../../composer.lock)).
- Сгенерировал middleware [app/Http/Middleware/HandleInertiaRequests.php](../../../../app/Http/Middleware/HandleInertiaRequests.php) через `php artisan inertia:middleware` (стандартный шаблон, наполнение `share()` — в подпункте 0.4).
- Зарегистрировал middleware в [app/Http/Kernel.php:39](../../../../app/Http/Kernel.php#L39) последним элементом группы `web`.

**Как проверить работоспособность:**

- `composer show inertiajs/inertia-laravel` — показывает установленную версию `v2.0.24`.
- Файл `app/Http/Middleware/HandleInertiaRequests.php` существует и расширяет `Inertia\Middleware`.
- `app/Http/Kernel.php` содержит `\App\Http\Middleware\HandleInertiaRequests::class` в массиве `web` middleware-группы.
- `php artisan route:list` отрабатывает без ошибок и показывает все 19 текущих роутов в неизменном виде (никаких новых Inertia-роутов на этом этапе быть не должно).
- Открытие любой страницы (`http://haccpilot.local/en`) даёт прежний SPA — middleware зарегистрирован, но пока ни один роут не возвращает `Inertia::render(...)`, поэтому пользовательский опыт не меняется.

---

### 0.2. Установка Inertia на фронте ✅ Выполнено

```bash
npm i @inertiajs/vue3
npm i -D @vue/server-renderer
```

`@inertiajs/vue3` — клиентская часть.
`@vue/server-renderer` — для будущего SSR (Шаг F), на этом этапе ещё не используется.

**Что сделал:**

- Установил `@inertiajs/vue3@3.0.3` в `dependencies` ([package.json](../../../../package.json), [package-lock.json](../../../../package-lock.json)).
- Установил `@vue/server-renderer@3.5.33` в `devDependencies` (правильное место — пакет нужен только во время SSR-build, не в runtime).
- Версия `@vue/server-renderer` автоматически выровнялась с текущей `vue@3.5.33` (Vue апнулся с 3.4 на 3.5 как транзитивная зависимость npm).

**Как проверить работоспособность:**

- `npm ls @inertiajs/vue3 @vue/server-renderer` показывает корректные версии: `@inertiajs/vue3@3.0.3`, `@vue/server-renderer@3.5.33`.
- `npm run build` отрабатывает за ~45 секунд без ошибок: bundle `app-[hash].js` собирается, lazy-роуты разделяются на chunks (Survey, Demo, About, BatchPublic, и т.п.). Новые пакеты ещё нигде не импортируются — поэтому в bundle их нет.
- В `package.json` появились две новые строки в нужных секциях.

---

### 0.3. Новый blade-шаблон `inertia.blade.php` ✅ Выполнено

**Не трогаем** существующие `resources/views/layouts/app.blade.php` и `resources/views/index-client.blade.php`. Вместо этого создаём **новый** файл `resources/views/inertia.blade.php`. Inertia использует его как root-view для всех страниц, отрендеренных через `Inertia::render(...)`. Старые страницы продолжают использовать `index-client`.

Содержимое нового шаблона минимально:

- `<meta name="csrf-token" content="{{ csrf_token() }}">` (без него apiAxios не отправит CSRF)
- JSON-LD Organization (как сейчас в `app.blade.php`)
- favicon
- Vite-bundle через `@vite(['resources/scss/app.scss', 'resources/js/inertia-app.js'])` — обратите внимание, новый entry, не `app.js`
- `@inertiaHead` (вставляет `<Head>`-данные с серверной стороны)
- `@inertia` (печатает root-div + initial-page-props)

`window.locale`, `window.translations`, `window.appName`, `window.adminEmail`, `window.availableLocales`, `window.localeHreflangMap`, `window.localeCountries` в новом шаблоне **отсутствуют** — все данные приходят через Inertia shared-props.

**Что сделал:**

- Создал [resources/views/inertia.blade.php](../../../../resources/views/inertia.blade.php) (~1 КБ): DOCTYPE, `<html lang>` из `app()->getLocale()`, charset/viewport, `<meta csrf-token>`, нейтральный fallback `<title>{{ config('app.name') }}</title>` (Inertia-страницы перекроют его через `<Head>`), favicon, JSON-LD Organization, `@inertiaHead`, `@vite([…, 'resources/js/inertia-app.js'])`, `@inertia` в `<body>`.
- Не скопировал в новый шаблон SEO-meta (`description`, `og:*`, `twitter:*`, `canonical`, `hreflang`) намеренно — они будут задаваться в каждой Inertia-странице через `<Head>` без риска дублирования.
- Не скопировал `window.locale` / `window.translations` / `window.appName` / `window.adminEmail` / `window.availableLocales` / `window.localeHreflangMap` / `window.localeCountries` — все эти данные приходят через Inertia shared-props (наполнение в подпункте 0.4).
- Старые `resources/views/layouts/app.blade.php` (3187 байт) и `resources/views/index-client.blade.php` (24 байта) не трогал — они продолжают обслуживать legacy SPA.

**Как проверить работоспособность:**

- `ls resources/views/inertia.blade.php` — файл существует.
- `grep -n "@inertia\|@inertiaHead\|inertia-app" resources/views/inertia.blade.php` — обе Inertia-директивы и ссылка на новый JS-entry присутствуют.
- Любая страница (`/en`, `/en/about`, `/en/survey`) открывается как раньше — пока ни один роут не вызывает `Inertia::render(...)`, новый blade не используется.
- `view-source:` любой страницы показывает прежний `<div id="app">` (из `index-client.blade.php`) и прежние `window.*` переменные.

---

### 0.4. HandleInertiaRequests — shared-props ✅ Выполнено

Шаблон, сгенерированный через `php artisan inertia:middleware`, дорабатываем:

- В свойство `protected $rootView = 'inertia';` (имя нового blade без расширения).
- В метод `share(Request $request)` добавляем shared-props, которые есть на каждой Inertia-странице:
    - `locale` — `app()->getLocale()` после SetLocale-middleware
    - `availableLocales` — `available_locales()`
    - `localeCountries` — `config('site.languages.countries', [])`
    - `localeHreflangMap` — массив `[code => hreflang]` из конфига
    - `siteConfig` — `[ 'name' => config('app.name'), 'adminEmail' => config('mail.admin_email') ]`
    - `translations` — массив переводов для текущей локали из `lang/<locale>.php`
    - `flash` — `[ 'success' => session('flash.success'), 'error' => session('flash.error') ]`

Метод `share` снабжаем коротким doc-блоком: что возвращает и для чего нужен.

**Что сделал:**

- В [app/Http/Middleware/HandleInertiaRequests.php](../../../../app/Http/Middleware/HandleInertiaRequests.php) проставил `$rootView = 'inertia'` (теперь Inertia использует новый blade `resources/views/inertia.blade.php`).
- Наполнил метод `share(Request $request): array` всеми 7 ожидаемыми ключами (`locale`, `availableLocales`, `localeCountries`, `localeHreflangMap`, `siteConfig`, `translations`, `flash`). К `flash.success`/`flash.error` применены closure'ы — значения вычисляются только при чтении.
- Добавил приватный метод `loadLocaleTranslations(string $locale): array` — загружает плоский `lang/<locale>.php` **только для активной локали** (legacy `SetLocale` грузил все 25 файлов в каждый запрос, теперь — один). Метод снабжён doc-блоком о назначении.
- Добавил приватный метод `buildHreflangMap(): array` — сворачивает `config('site.languages.countries')` в `[code => hreflang]`, чтобы фронт получал минимальный payload без `prefix`/`name` (они идут отдельным prop'ом `localeCountries`). Doc-блок присутствует.

**Как проверить работоспособность:**

- `php artisan route:list` — показывает все 19 текущих роутов без ошибок (Laravel boot проходит).
- Программный smoke-test через `php -r`: создаём request, ставим локаль `en`, вызываем `$mw->share($req)` — на выходе массив с ключами `errors,locale,availableLocales,localeCountries,localeHreflangMap,siteConfig,translations,flash`. Значения корректны: `locale=en`, 25 элементов в `availableLocales` и `localeCountries`, `localeHreflangMap[en]=en`, `siteConfig.name=HACCPilot`, `translations[en]` содержит секции `home,header,survey,demo,demo_ai,batch,report,how_it_work,about,privacy_policy,consent,seo,contact`.
- Любая страница сайта (`/en`, `/en/survey` и т.п.) по-прежнему рендерится через legacy SPA — middleware пропускает не-Inertia запросы, не вмешиваясь в их ответ.

---

### 0.5. Новый JS-entry `inertia-app.js` ✅ Выполнено

**Не трогаем** существующий `resources/js/app.js` — он продолжает обслуживать старый SPA. Создаём **новый** entry `resources/js/inertia-app.js`.

В шаблоне намеренно нет `unhead/client` и `headSymbol` — для Inertia-страниц используется встроенный `<Head>` из `@inertiajs/vue3` (см. подпункт 0.9), отдельный unhead-инстанс не нужен. Vue Router, `useGrainCoolingDemoEntry()`, `useSessionGuard()` сюда тоже **не подключаются**: глобальной навигацией управляет Inertia, а layout-эффекты переедут в `Layouts/PublicLayout.vue` (подпункт 0.8) через `onMounted`.

**Что сделал:**

- Создал [resources/js/inertia-app.js](../../../../resources/js/inertia-app.js) (~1.8 КБ): импорт `./bootstrap` (axios setup), `createInertiaApp` из `@inertiajs/vue3`, `createPinia`, `Vue3Toastify` + css, `task-grain-cooling-toastify.scss`, локальный i18n.
- `resolve` использует `import.meta.glob('./InertiaPages/**/*.vue', { eager: false })` (lazy chunks по странице). Если запрошенной Page-компоненты нет — бросает понятную ошибку с путём файла, чтобы маленькая опечатка в имени не превращалась в загадочный белый экран.
- `setup` устанавливает локаль и переводы из shared-props (`initial.locale`, `initial.translations[initial.locale]`), затем монтирует Vue с pinia, i18n, vue3-toastify в `el`.
- Сохранил listener на `vite:preloadError` (как в legacy `app.js`) с тротлингом 60 секунд — на случай stale chunks при выкатке нового bundle. `sessionStorage` обращается через `window.sessionStorage`, чтобы не было `no-undef` от ESLint.

**Как проверить работоспособность:**

- `ls resources/js/inertia-app.js` — файл присутствует.
- `npx eslint resources/js/inertia-app.js` — без ошибок и предупреждений.
- `grep -n "vue-router\|useGrainCoolingDemoEntry\|useSessionGuard\|useSiteConfigStore" resources/js/inertia-app.js` — ничего не находит (никакая legacy-инициализация не подтянута).
- Файл будет реально собираться и грузиться браузером после подпункта 0.6 (Vite-вход), пока `npm run build` его игнорирует — это нормально.

---

### 0.6. Vite: второй entry ✅ Выполнено

В [vite.config.mjs](../../../../vite.config.mjs) добавить второй JS-entry для Inertia. Текущий массив `input` Laravel-плагина расширяем:

```js
laravel({
    input: [
        "resources/scss/app.scss",
        "resources/js/app.js",         // legacy SPA — пока остаётся
        "resources/js/inertia-app.js", // новый Inertia-bundle
    ],
    refresh: true,
}),
```

Важно: оба bundle живут параллельно. Старый blade `app.blade.php` подключает `app.js`, новый `inertia.blade.php` — `inertia-app.js`. После полной миграции старый entry удаляется одной строкой.

**Что сделал:**

- В [vite.config.mjs:62](../../../../vite.config.mjs#L62) добавил `'resources/js/inertia-app.js'` в массив `input` Laravel-плагина (рядом с `app.js`). `technical.js` остаётся четвёртым entry для админ-страницы.
- `npm run build` теперь собирает три JS-bundle одновременно: `app-[hash].js` (legacy SPA, 13.85 КБ — стал намного меньше после автоматического выделения shared-чанков), `inertia-app-[hash].js` (101.77 КБ), `technical-[hash].js` (0.71 КБ).
- Vite автоматически вынес общие зависимости в shared-чанки: `vue`/`pinia`/`i18n` теперь живут в отдельных файлах и шарятся между legacy и Inertia bundles, что уменьшило дублирование байтов.

**Как проверить работоспособность:**

- `npm run build` отрабатывает за ~44 секунды без ошибок.
- В `public/build/manifest.json` зарегистрированы оба entry: `"resources/js/app.js"` и `"resources/js/inertia-app.js"` (проверка `grep`-ом).
- В `public/build/assets/` файлы `app-[hash]-...js`, `inertia-app-[hash]-...js`, `naive-ui-[hash]-...js`, `i18n-[hash]-...js` и lazy-чанки страниц.
- Старая страница (`/en`) загружается через legacy bundle — `view-source` показывает в `<head>` подключение `app-[hash]-...js` как раньше.

---

### 0.7. Новые папки `resources/js/InertiaPages/` и `resources/js/Layouts/` ✅ Выполнено

Создаём пустые папки. На этом шаге туда **ничего не кладём** — содержимое появляется в фазах B–E постранично.

**Имя папки `InertiaPages/` (вместо канонического `Pages/` из Inertia-документации) — намеренное.**

Причина: Windows-FS (а также macOS-FS по умолчанию) — case-insensitive, и существующая legacy-папка `resources/js/pages/` физически совпадает с гипотетической `resources/js/Pages/`. На таких машинах `Pages/` и `pages/` — одна и та же директория, попытка создать новую `Pages/` рядом с legacy `pages/` приводит к скрытому слиянию: файлы Inertia-страниц легли бы прямо в `pages/` рядом с `client/` и `technical/`. На Linux production они были бы разными — это даёт классический cross-platform баг "работает локально, ломается на проде".

`InertiaPages/` — уникальное имя без коллизии ни на одной FS. После финальной очистки legacy (когда `resources/js/pages/` удалится) папку можно безопасно переименовать в `Pages/` одним жестом, чтобы прийти к идиоматичному имени Inertia-документации.

> ⏳ **Отложено** → см. главный план `overtake_inertia.md`, раздел "Проверка отложенного" → **A.4 Переименовать `InertiaPages/` → `Pages/`**.

`Layouts/` без коллизии — в `resources/js/` папки `layouts/` не существует (только `resources/views/layouts/` для blade, но это другой родитель).

Структура после полной миграции (для справки):

- `resources/js/InertiaPages/Home.vue`
- `resources/js/InertiaPages/About.vue`
- `resources/js/InertiaPages/HowWorks.vue`
- `resources/js/InertiaPages/PrivacyPolicy.vue`
- `resources/js/InertiaPages/Contact.vue`
- `resources/js/InertiaPages/Survey.vue`
- `resources/js/InertiaPages/Demo.vue`
- `resources/js/InertiaPages/BatchPublic.vue`
- `resources/js/InertiaPages/DailyReportPublic.vue`
- `resources/js/Layouts/PublicLayout.vue`

Старая папка `resources/js/pages/client/` остаётся нетронутой до конца миграции.

**Что сделал:**

- Создал пустую папку `resources/js/InertiaPages/` с файлом `.gitkeep` (чтобы пустая папка попала в git до появления первого `*.vue`).
- Создал пустую папку `resources/js/Layouts/` с `.gitkeep` (та же причина).
- В [resources/js/inertia-app.js:21,25](../../../../resources/js/inertia-app.js#L21) поправил glob-путь `./Pages/` → `./InertiaPages/` (две строки: `import.meta.glob` и текст ошибки).
- Имя `InertiaPages/` выбрано с учётом Windows/macOS case-insensitive FS — без коллизии с legacy `pages/`. После финальной очистки legacy переименуем в `Pages/`.

**Как проверить работоспособность:**

- `ls -la resources/js/InertiaPages resources/js/Layouts` — обе папки существуют, в каждой только `.gitkeep`.
- `ls -d resources/js/[Pp]ages` — показывает **только** legacy `pages/` (новая `Pages/` не создавалась, коллизии нет).
- `grep -n "InertiaPages" resources/js/inertia-app.js` — две строки (glob и текст ошибки).
- `npm run build` отрабатывает без ошибок: `import.meta.glob` к пустой `InertiaPages/` возвращает корректный пустой объект, ничего не рендерится — это норма до появления первой Page-компоненты.

---

### 0.8. Layout-компонент `Layouts/PublicLayout.vue` ✅ Выполнено

На этом шаге создаём **минимальный** Layout с `<NMessageProvider>` и `<slot />` плюс универсальную обёртку `<ClientOnly>`. Header / Footer / ConsentOverlay / GrainCoolingNotificationBanner добавятся в Layout в подпункте 0.10 — после того, как они будут переведены с `<router-link>` / `useRoute()` на `<a href>` / `window.location`-derivation. Минимальный layout позволяет ввести первую Inertia-страницу (Home в фазе B) и end-to-end проверить инфраструктуру (роут → middleware → blade → entry → Page → монтирование) до того, как затронем Header.

После 0.10 Layout доберёт обвязку и придёт к виду:

```vue
<template>
    <NMessageProvider placement="top">
        <div class="app-wrapper">
            <Header />
            <ClientOnly>
                <GrainCoolingNotificationBanner />
            </ClientOnly>
            <main
                class="main-content"
                :class="{ 'main-content--bg-style-white': isAboutPage }"
            >
                <slot />
                <Footer />
            </main>
            <ClientOnly>
                <ConsentOverlay />
            </ClientOnly>
        </div>
    </NMessageProvider>
</template>
```

`<slot />` вместо `<router-view />`. `isAboutPage` определяется через `usePage().component === 'About'`.

**Что сделал:**

- Создал [resources/js/components/ClientOnly.vue](../../../../resources/js/components/ClientOnly.vue): простая обёртка с `mounted` ref, который меняется на `true` в `onMounted`. Детей рендерит только при `mounted`. Doc-блок описывает назначение (рендер только на клиенте — для SSR-небезопасных компонентов).
- Создал [resources/js/Layouts/PublicLayout.vue](../../../../resources/js/Layouts/PublicLayout.vue) в **минимальной редакции**: `<NMessageProvider placement="top">` оборачивает `<div class="app-wrapper"><main class="main-content"><slot /></main></div>`. Локальный импорт `NMessageProvider` из `naive-ui` (никаких глобальных регистраций — naive-ui мы убрали в более раннем рефакторинге).
- Удалил `.gitkeep` из `resources/js/Layouts/` — теперь там есть реальный `.vue`-файл.
- В `resources/js/InertiaPages/.gitkeep` оставил — папка пока без страниц до фазы B.
- Header / Footer / ConsentOverlay / GrainCoolingNotificationBanner **намеренно не добавлены** на этом шаге; они подключатся в подпункте 0.10 после рефакторинга `<router-link>` → `<a href>` и `useRoute()` → `window.location`.

**Как проверить работоспособность:**

- `ls resources/js/Layouts resources/js/components/ClientOnly.vue` — оба файла на месте.
- `npm run build` отрабатывает без ошибок (~46 секунд). В bundle появляется новый PublicLayout (после первой Page-компоненты).
- Старый сайт (`/en`, `/en/about`, и т.д.) работает без изменений — Layout пока не подключён ни к одной странице.

---

### 0.9. SEO через `<Head>` Inertia + усиление `SeoMetaResolver` ✅ Выполнено

Текущий `app/Services/SeoMetaResolver.php` уже формирует объекты с `title`, `description`, `og_*`, `hreflang[]` для blade-шаблона. Дорабатываем сервис так, чтобы он мог отдать **тот же** объект, но в Inertia-friendly nested-структуре.

В каждой Inertia-странице используем встроенный `<Head>` от `@inertiajs/vue3`:

```vue
<script setup>
import { Head } from "@inertiajs/vue3";
const props = defineProps({ seo: Object });
</script>

<template>
    <Head>
        <title>{{ seo.title }}</title>
        <meta name="description" :content="seo.description" />
        <link rel="canonical" :href="seo.canonical" />
        <link
            v-for="alt in seo.hreflang"
            :key="alt.lang"
            rel="alternate"
            :hreflang="alt.lang"
            :href="alt.href"
        />
        <meta property="og:title" :content="seo.og.title" />
        <meta property="og:description" :content="seo.og.description" />
        <meta property="og:image" :content="seo.og.image" />
        <meta property="og:url" :content="seo.canonical" />
        <meta name="twitter:card" content="summary_large_image" />
    </Head>
</template>
```

Текущий composable `usePageSeo.js` пока **не трогаем** — он используется в legacy-страницах. Для Inertia-страниц переходим напрямую на `<Head>`. После миграции последней страницы `usePageSeo.js` удаляется.

**Что сделал:**

- В [app/Services/SeoMetaResolver.php](../../../../app/Services/SeoMetaResolver.php) добавил публичный метод `resolveForInertia(string $path, string $locale): array`. Метод вызывает существующий `resolve()` (плоский формат) и переоборачивает в nested-структуру для Inertia: `{ title, description, canonical, hreflang, og: { title, description, image, type }, twitter: { title, description, image } }`. Doc-блок описывает назначение и где используется.
- Добавил приватный метод `nestSeo(array $flat): array` с doc-блоком, выполняющий именно переоборачивание плоских ключей `og_title` / `og_description` / `og_image` в nested-объекты. Заодно делает `og.image` / `twitter.image` **абсолютным URL** (требование OpenGraph и Twitter Cards — соцсети отбрасывают превью с относительными путями).
- Существующий метод `resolve()` нетронут — legacy `app.blade.php` через `View Composer` продолжает читать `$seo['og_title']`, ничего не сломалось.
- Имя метода — `resolveForInertia` (а не `resolveAsArray` из черновика плана) — точнее отражает назначение: возвращает структуру именно для Inertia-prop'а, не любой массив.

**Как проверить работоспособность:**

- Smoke-test через `php -r` + booted Laravel:
    - `(new SeoMetaResolver)->resolveForInertia('en', 'en')` — возвращает массив с ключами `title`, `description`, `canonical`, `hreflang` (26 элементов: 25 локалей + x-default), `og`, `twitter`. `og.title` дополнен суффиксом ` | HACCPilot`. `og.image` — абсолютный URL `http://haccpilot.local/images/haccpilot.jpg`. `og.type` = `website`.
    - `resolveForInertia('ro/about', 'ro')` — title и og.title рендерятся на румынском (`Despre proiect - HACCPilot | HACCPilot`), canonical правильный (`http://haccpilot.local/ro/about`).
    - `resolveForInertia('en/batch/ABC-123', 'en')` — placeholder `{id}` подставлен в title (`EUDR Batch ABC-123 – ...`), canonical корректный.
- Старая страница (`/en`, `/en/about`) рендерится через legacy SPA без изменений — `resolve()` не трогался, blade-шаблон работает как раньше.

---

### 0.10. Header / Footer — стратегия ссылок на время миграции ✅ Выполнено

Текущие `resources/js/components/client/header/Header.vue` и `resources/js/components/client/footer/Footer.vue` используют `<router-link>` (легаси SPA). При параллельной миграции эти компоненты живут одновременно и в старом SPA, и в Inertia-layout — поэтому нужна обратная совместимость.

Стратегия:

- В обоих компонентах **временно** заменяем `<router-link :to="...">` на нативный `<a :href="...">` для **всех** ссылок. `<a href>` работает и в SPA (с полной перезагрузкой), и в Inertia (с полной перезагрузкой — Inertia не перехватывает обычные `<a>`).
- Это означает на время миграции потеря SPA-эффекта при клике по навигации (полная перезагрузка вместо мгновенного перехода). Это компромисс ради безопасности.
- После миграции последней страницы (фаза E) `<a href>` заменяем на `<Link>` от `@inertiajs/vue3` — снова SPA-навигация без перезагрузки.

Затрагиваемые файлы (заранее):

- `resources/js/components/client/header/Header.vue` — `<router-link>`, `useRoute`, `useRouter`, `router.push`
- `resources/js/components/client/header/NavMenuItem.vue` — `<router-link>`, `useRoute`
- `resources/js/components/client/header/DropdownMenu.vue` — серия `<router-link>`
- `resources/js/components/client/footer/Footer.vue` — `<router-link>`, `useRoute`
- `resources/js/components/client/consent/ConsentOverlay.vue` — `<router-link>`, `useRoute`
- `resources/js/basic/Index.vue` — `useRoute` (для `isAboutRoute`-класса)

Также этот шаг **дополняет минимальный Layout из 0.8** до полного: после рефакторинга подключаем `<Header>`, `<ClientOnly><GrainCoolingNotificationBanner /></ClientOnly>`, `<Footer>`, `<ClientOnly><ConsentOverlay /></ClientOnly>` в `Layouts/PublicLayout.vue`. `isAboutPage` определяется через `usePage().component === 'About'`.

Альтернатива (не используем): обёртка-компонент `<SmartLink>`, который сам выбирает между `<router-link>` и `<Link>` — добавляет сложности в обмен на сохранение SPA-эффекта. Не оправдано на 2 недели.

**Что сделал:**

- Создал универсальный composable [resources/js/composables/useCurrentLocale.js](../../../../resources/js/composables/useCurrentLocale.js) с двумя функциями: `useCurrentLocale()` (читает локаль из `window.location.pathname`, fallback `en`) и `useCurrentPathWithoutLocale()` (для language-switcher и определения активной ссылки). Обе с doc-блоками, работают в legacy SPA и Inertia без `useRoute()`/`usePage()`.
- В [resources/js/components/client/header/Header.vue](../../../../resources/js/components/client/header/Header.vue) убрал импорт из `vue-router`, заменил `<router-link>` на `<a :href>` для логотипа, `route.params.locale` → `useCurrentLocale()`, `router.push("/.../survey")` → `window.location.href = "/.../survey"`. Расширил `getLanguagesList()` фолбэком на `window.localeCountries` (на случай если в Inertia-blade нет `data-languages` атрибута).
- В [resources/js/components/client/header/NavMenuItem.vue](../../../../resources/js/components/client/header/NavMenuItem.vue) три `<router-link>` → `<a :href>` (desktop+mobile), убрал `useRoute()`. Текущий путь читается из `window.location.pathname` через локальный ref, обновляется в `onMounted` (для определения активной ссылки `isExactPageLink`).
- В [resources/js/components/client/header/DropdownMenu.vue](../../../../resources/js/components/client/header/DropdownMenu.vue) серия `<router-link :to>` (8 штук) → `<a :href>`. Файл переписан целиком — точечные правки оказались хрупкими.
- В [resources/js/components/client/footer/Footer.vue](../../../../resources/js/components/client/footer/Footer.vue) два `<router-link>` → `<a :href>`, убран `useRoute`, `route.params.locale` → `useCurrentLocale()`, `route.path` → локальный ref `currentPath` через `window.location.pathname`. Логика `seoLocaleLinks` (скрытые SEO-ссылки на все локали) сохранена с doc-блоком.
- В [resources/js/components/client/consent/ConsentOverlay.vue](../../../../resources/js/components/client/consent/ConsentOverlay.vue) `<router-link>` → `<a :href>`, убран `useRoute`, проверка `route.name === "PrivacyPolicy"` заменена на regex `/\/privacy-policy\/?$/.test(currentPath.value)` — работает на любом локалевом префиксе.
- В [resources/js/inertia-app.js](../../../../resources/js/inertia-app.js) после монтирования Vue/i18n инициализируется `useSiteConfigStore` из `initial.siteConfig` (заменяет вызов `siteConfigStore.init()` от legacy который полагался на `window.appName`). Заодно временно проставляются `window.availableLocales` / `window.localeCountries` / `window.localeHreflangMap` / `window.locale` / `window.appName` / `window.adminEmail` — это **временный** мост на время миграции, чтобы Header/Footer/Consent работали в Inertia-контексте без переписывания их на чтение `usePage()`. После полной миграции мост уйдёт. ⏳ **Отложено** → см. `overtake_inertia.md` → "Проверка отложенного" → **A.1 + A.2 + A.3** (удаление legacy-инфраструктуры, `<a href>` → `<Link>` и `useSiteConfigStore`/window-моста одним PR'ом).
- Расширил [resources/js/Layouts/PublicLayout.vue](../../../../resources/js/Layouts/PublicLayout.vue) до полного: подключены `<Header>`, `<ClientOnly><GrainCoolingNotificationBanner /></ClientOnly>`, `<main><slot /><Footer /></main>`, `<ClientOnly><ConsentOverlay /></ClientOnly>`. Класс `main-content--bg-style-white` — через `usePage().component === 'About'`. Doc-блок на computed.

**Не входило в scope этого шага** (но обнаружено grep'ом):

- `resources/js/components/client/home/HeroSection.vue`, `NichesSection.vue`, `SurveyCtaSection.vue` тянут `useRouter` / `useRoute`. Это компоненты страницы Home — будут отрефакторены в **фазе B** при миграции Home. Сейчас они работают в legacy SPA, в Inertia упадут только когда `InertiaPages/Home.vue` начнёт их использовать.

**Как проверить работоспособность:**

- `grep -rn "<router-link" resources/js/components/client/header resources/js/components/client/footer resources/js/components/client/consent` — возвращает пусто.
- `grep -rn "from \"vue-router\"" resources/js/components/client/header resources/js/components/client/footer resources/js/components/client/consent resources/js/Layouts` — возвращает пусто.
- `npm run build` отрабатывает за ~40 секунд без ошибок. `inertia-app-[hash].js` собирается, в Inertia-bundle появляется `PublicLayout`, `Header`, `Footer`, `ConsentOverlay`, `GrainCoolingNotificationBanner`.
- Старый сайт (`/en`, `/en/about`, `/en/survey` и т.п.) открывается без визуальных регрессий. Клик по логотипу или пункту меню в шапке вызывает полную перезагрузку страницы (вместо SPA-перехода) — это плановый компромисс на время миграции.
- Language-switcher в шапке продолжает работать (POST `/locale` + redirect через `window.location.href`).
- На странице `/en/privacy-policy` consent-overlay не появляется (regex-проверка).
- Активный пункт меню (`nav-link--exact-page`) подсвечивается на текущей странице.

---

### 0.11. routes/web.php — статус на этом шаге ✅ Выполнено

**На Шаге 0 роуты НЕ меняем.** Все 5 view-роутов (`/`, `/batch/{batchId}`, `/report/{date}`, `/{locale}/`, `/{locale}/{any}`) по-прежнему возвращают `view('index-client')`. POST-эндпоинты (`/locale`, `/contact`, `/survey/submit`, `/survey/verify`), `/session/ping`, `/technical/*` — без изменений.

Постраничные правки роутов будут в фазах B–E, когда соответствующая страница уже создана в `resources/js/InertiaPages/`.

**Что сделал:**

- Сверил состояние [routes/web.php](../../../../routes/web.php) и [routes/api.php](../../../../routes/api.php): за всё время выполнения шагов 0.1–0.10 ни в одном из routes-файлов не появилось ни одного `Inertia::render(...)` (`grep` пустой).
- `git status routes/` — "nothing to commit, working tree clean": с момента предпоследнего коммита `fc0c4a2 add up token CSRF with visibilitychange site` (он про `/session/ping`, ещё до начала Inertia-миграции) routes-файлы не редактировались.
- Шаг чисто декларативный, фиксирует инвариант "перед фазой B все роуты — legacy `view('index-client')`".

**Как проверить работоспособность:**

- `git diff routes/web.php` — пустой.
- `grep -n "Inertia::render" routes/web.php routes/api.php` — пусто.
- `php artisan route:list` показывает прежние 19 роутов без новых записей.
- Все URL'ы сайта работают как раньше.

---

### 0.12. apiAxios — без изменений ✅ Выполнено

`apiAxios` остаётся как есть — `X-Locale` interceptor читает `i18n.global.locale.value`. После миграции i18n инициализируется в `inertia-app.js` из shared-props, так что interceptor продолжит работать в обоих bundle'ах одинаково. Никаких правок.

**Что сделал:**

- Сверил, что [resources/js/utils/apiAxios.js](../../../../resources/js/utils/apiAxios.js) и [resources/js/bootstrap.js](../../../../resources/js/bootstrap.js) не редактировались на Шаге 0 — `git status` чистый.
- Подтвердил что `X-Locale`-interceptor на месте: [apiAxios.js:106-111](../../../../resources/js/utils/apiAxios.js#L106-L111) читает локаль из `i18n.global.locale.value` **в момент запроса** (не при создании инстанса), поэтому корректно подхватывает текущую локаль независимо от того, кто и когда её установил.
- Локаль устанавливается в обоих JS-bundle'ах:
    - Legacy SPA через [app.js:57](resources/js/app.js#L57) (`router.beforeEach`) и [app.js:64](resources/js/app.js#L64) (initial sync после `router.isReady`).
    - Inertia через [inertia-app.js:37](../../../../resources/js/inertia-app.js#L37) (`setup` функция читает `initial.locale` из shared-props).
- Никаких изменений в файле apiAxios — единое поведение для legacy SPA и Inertia подтверждено инвариантом "interceptor читает реактивный ref `i18n.global.locale`, который оба контекста синхронизируют со своим источником истины".

**Как проверить работоспособность:**

- `git status resources/js/utils/apiAxios.js resources/js/bootstrap.js` — без изменений.
- В legacy SPA (`/en/contact`) DevTools → Network → POST `/contact` имеет header `X-Locale: en`.
- На странице `/ro/...` тот же запрос идёт с `X-Locale: ro`.
- После миграции первой Inertia-страницы (фаза B) — её POST'ы (если будут) ведут себя так же.

---

### 0.13. Чек-лист завершения Шага 0

#### Автоматические проверки ✅ Выполнено

Все пункты ниже подтверждены прогонкой команд `git status`, `grep`, `php artisan route:list`, `php -r` smoke-тестами и `npm run build`.

- [x] **Inertia-пакет на бэке** — `composer show inertiajs/inertia-laravel` → `v2.0.24`.
- [x] **Inertia-пакет на фронте** — `package.json`: `@inertiajs/vue3 ^3.0.3` (deps), `@vue/server-renderer ^3.5.33` (devDeps).
- [x] **HandleInertiaRequests зарегистрирован в Kernel** — `\App\Http\Middleware\HandleInertiaRequests::class` в группе `web`.
- [x] **rootView = 'inertia'** — `resources/views/inertia.blade.php` существует и содержит `@inertia` + `@inertiaHead`.
- [x] **share() возвращает 8 ключей** (errors, locale, availableLocales, localeCountries, localeHreflangMap, siteConfig, translations, flash) — программный smoke-test, 25 локалей, 25 countries, переводы en содержат секции home/header/survey/demo/contact и т.д.
- [x] **resources/js/inertia-app.js создан** — `createInertiaApp` + lazy-resolve через `import.meta.glob('./InertiaPages/**/*.vue')`, синхронизация i18n + siteConfigStore из shared-props.
- [x] **vite.config.mjs имеет два JS-entry** — массив `input` содержит `app.js` и `inertia-app.js`.
- [x] **`npm run build` собирает оба bundle** — `public/build/assets/app-[hash].js` и `inertia-app-[hash].js` присутствуют, `manifest.json` регистрирует оба, билд проходит за ~42 секунды.
- [x] **InertiaPages/ и Layouts/ созданы** — на месте; в InertiaPages пока только `.gitkeep`.
- [x] **Layouts/PublicLayout.vue полный** — `<NMessageProvider>`, `<Header>`, `<ClientOnly><GrainCoolingNotificationBanner /></ClientOnly>`, `<main><slot /><Footer /></main>`, `<ClientOnly><ConsentOverlay /></ClientOnly>`, `isAboutPage` через `usePage().component`.
- [x] **components/ClientOnly.vue** — рендерит детей только после `onMounted`.
- [x] **composables/useCurrentLocale.js** — две функции (`useCurrentLocale`, `useCurrentPathWithoutLocale`).
- [x] **SeoMetaResolver::resolveForInertia реализован** — программный smoke-test: nested-структура с `og.image` приведённым к абсолютному URL.
- [x] **Header / NavMenuItem / DropdownMenu / Footer / ConsentOverlay переведены на `<a href>`** — `grep -rln "<router-link"` по этим папкам = 0.
- [x] **vue-router не импортируется в shared-компонентах и Layouts** — `grep -rln "from \"vue-router\""` по `header/footer/consent/Layouts` = 0.
- [x] **Inertia bundle не тащит vue-router** — `inertia-app.js` чист.
- [x] **routes/web.php не содержит Inertia::render** — `grep -c` = 0; `php artisan route:list` показывает все 19 прежних роутов.
- [x] **apiAxios нетронут** — `git status` чистый, X-Locale interceptor читает `i18n.global.locale.value`, локаль ставится в обоих entry.

#### Ручные проверки (требуют браузера)

Эти пункты автоматически не верифицируются — нужно открыть сайт и пройтись. Отметьте статус по каждому, передайте мне — учту в дальнейшей работе.

##### Все страницы открываются как раньше

- ✅ `http://haccpilot.local/en` — главная грузится, hero-секция, ниши, метрики, CTA. Шапка/подвал визуально не изменились.
- ✅ `http://haccpilot.local/en/about` — страница About открывается, snap-скролл по секциям работает, без console-ошибок.
- ✅ `http://haccpilot.local/en/how-it-works` — страница работает.
- ✅ `http://haccpilot.local/en/privacy-policy` — текст показан, название "HACCPilot" и admin-email подставлены в плейсхолдеры.
- ✅ `http://haccpilot.local/en/contact` — форма видна, поля рендерятся, попытка submit отправляет POST `/contact`, success-toast приходит.
- ✅ `http://haccpilot.local/en/survey` — Survey-форма грузится, intro/lead/PIN-flow работает (хотя бы первый шаг).
- ✅ `http://haccpilot.local/en/demo` — редирект на `/en/demo/dashboard`, демо открывается, naive-ui модалки работают.
- ✅ `http://haccpilot.local/en/batch/<любой-id>` — публичная карточка партии (демо-данные), кнопка print работает.
- ✅ `http://haccpilot.local/en/report/2026-04-20` — публичный дневной отчёт.

##### Шапка и навигация

- ✅ **Клик по логотипу** — переход на `/en` (полная перезагрузка вместо SPA — это плановый компромисс на время миграции, ожидаемо).
- ✅ **Клик по пункту меню** ("About", "How it works", "Survey", "Contact") — переход с полной перезагрузкой, без console-ошибок.
- ✅ **Dropdown-меню** в шапке открывается на hover (если есть), ссылки внутри ведут на нужные URL.
- ✅ **Активный пункт меню** подсвечивается (класс `nav-link--exact-page`) на текущей странице.
- ✅ **Mobile burger-меню** (ширина <1100px) — открывается, закрывается, ссылки работают, открытие меню блокирует скролл страницы.
- ✅ **Переключатель языков в шапке** — клик по `RO` переключает на `/ro/...`, клик по `EN` — обратно. URL меняется, контент перерисовывается на нужном языке.

##### Подвал

- ✅ **Privacy Policy** в подвале ведёт на `/{locale}/privacy-policy` (полная перезагрузка).
- ✅ **Contact** в подвале — аналогично.
- ✅ **Footer SEO-ссылки** на остальные локали присутствуют в HTML (через "View Page Source"), визуально скрыты.

##### Глобальные эффекты

- ✅ **ConsentOverlay**: на свежей сессии (без `LS_CONSENT_VERSION` в localStorage) overlay появляется на главной.
- Кнопка "Continue" закрывает его. На странице `/en/privacy-policy` overlay **не появляется** (regex-проверка).
- ✅ **GrainCoolingNotificationBanner**: на демо-страницах сценарий охлаждения зерна работает (тосты, баннер).
- ✅ **419-handler**: при сильно протухшей сессии (>120 мин или ручное удаление cookie) submit формы даёт toast "Session expired" + auto-reload через 1.5 сек.
- ✅ **session/ping** при возврате во вкладку: DevTools → Network показывает GET `/session/ping` после `visibilitychange`.

##### DevTools — без регрессий

- ✅ DevTools Console — нет новых ошибок/warnings, которых не было до миграции (особенно ничего про vue-router, useRoute, undefined route).
- ✅ DevTools Network — запросы не дублируются, нет лишних 404 или зависших pending-запросов.
- ✅ `<meta name="csrf-token">` присутствует в HTML (важно для apiAxios).
- ✅ `X-Locale` header виден в любом POST-запросе (Contact, Survey, /locale).
- ✅ При смене языка (POST /locale + редирект) — после редиректа работает на новом языке.
