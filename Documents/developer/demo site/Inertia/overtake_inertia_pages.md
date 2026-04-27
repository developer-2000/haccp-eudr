
## Постраничный план

### Home ✅ Выполнено

**Текущее состояние:** [resources/js/pages/client/Home.vue](resources/js/pages/client/Home.vue), 59 строк. 4 дочерних компонента из `components/client/home/`. Нет API, нет роутера, нет window-доступа.

**Сложность миграции:** **очень низкая** (для самой Home), но потребовалось дотронуться до 3 дочерних компонентов с `useRouter`/`useRoute` (этот пункт был известным known-issue из шага 0.10).

**Что делать:**

1. Скопировать в `resources/js/InertiaPages/Home.vue`.
2. Импорт `usePageSeo` заменить на новый `usePageHead` (или удалить и использовать `<Head>` напрямую).
3. Добавить `defineOptions({ layout: PublicLayout })`.
4. Контроллер: создать роут `/{locale}` который возвращает `Inertia::render('Home', ['seo' => SeoMetaResolver::resolve('home', $locale)])`.
5. Дочерние компоненты (`HeroSection`, `MetricsSection`, `NichesSection`, `SurveyCtaSection`) **не трогаем** — они уже не зависят от роутера.

**Риски:** ноль.

**SSR-проверка:** не использует `window`, `document`, `localStorage` — рендерится на сервере без проблем.

**Что сделал:**

- Создал [resources/js/InertiaPages/Home.vue](resources/js/InertiaPages/Home.vue) (~2 КБ): импорт `<Head>` из `@inertiajs/vue3`, `defineOptions({ layout: PublicLayout })`, проп `seo` с `required: true`. Шаблон рендерит `<Head>` со всеми мета-тегами (title, description, canonical, hreflang × 26, og.*, twitter.*) и 4 контейнера секций с дочерними компонентами. CSS-стили перенесены 1:1.
- Удалил `.gitkeep` из `resources/js/InertiaPages/` (теперь там есть `Home.vue`).
- Отрефакторил 3 дочерних компонента (фиксация known-issue из 0.10):
    - [HeroSection.vue](../../../../resources/js/components/client/home/HeroSection.vue) — убрал `useRouter`/`useRoute`, локальный `getCurrentLocale` заменил на импорт `useCurrentLocale()` из `@/composables/useCurrentLocale.js`. `router.push("/.../survey")` → `window.location.href = "/.../survey"`. Аналогично для `goToDemo`.
    - [NichesSection.vue](../../../../resources/js/components/client/home/NichesSection.vue) — то же самое + обновил doc-блоки `goToSurvey`/`goToDemo`.
    - [SurveyCtaSection.vue](../../../../resources/js/components/client/home/SurveyCtaSection.vue) — то же самое.
- Не трогал [MetricsSection.vue](../../../../resources/js/components/client/home/MetricsSection.vue) — она чистая (не использует router).
- Обновил [routes/web.php](../../../../routes/web.php): добавил импорты `SeoMetaResolver`, `Request`, `Inertia`. В locale-группе **только** корневой `/` переключён на `Inertia::render('Home', ['seo' => ...])` — catchall `/{any}` остался legacy, чтобы не-мигрированные страницы продолжали работать.
- Контроллер для `/` (root без локали, который делает редирект на `/en`) **не трогал** — он остаётся `view('index-client')`, потом будет редирект уже из мигрированной legacy SPA. После миграции всех страниц переключим и его. ⏳ **Отложено** → см. `overtake_inertia.md` → "Проверка отложенного" → **A.6 Базовый `/`-роут — на Inertia или редирект**.
- Старый [resources/js/pages/client/Home.vue](resources/js/pages/client/Home.vue) **не удалял** — он остаётся в bundle на случай отката.

**Как проверить работоспособность:**

- **Bash/code-проверки** (выполнено мной):
    - `npm run build` отрабатывает без ошибок (~43 секунды). В bundle появляется `Home-[hash].js` (2.82 КБ) и `Home-[hash].css` (0.29 КБ) как отдельный chunk благодаря lazy-resolve в `inertia-app.js`.
    - `php artisan route:list` показывает роут `GET /{locale}` без ошибок (Inertia callable резолвится корректно).
    - `php -r` smoke-test `SeoMetaResolver::resolveForInertia('en', 'en')` возвращает корректный nested-объект с title, canonical=`http://haccpilot.local/en`, 26 hreflang-ссылок.
    - `grep -rn "useRouter\|useRoute\|<router-link" resources/js/components/client/home` возвращает пусто.
- **Ручные проверки в браузере** (нужно выполнить):
    - Открыть `http://haccpilot.local/en` → страница загружается через **Inertia** (DevTools → View Source: HTML содержит `<div id="app" data-page='{...}'></div>` вместо `<div id="app">`).
    - `view-source:` страницы должен содержать `<title>HACCP Software... | HACCPilot</title>`, `<meta name="description">`, `<link rel="canonical" href="http://haccpilot.local/en">`, 26 `<link rel="alternate" hreflang="...">`, og:* и twitter:* мета-теги — **всё это в HTML до выполнения JS**, главное достижение SEO.
    - В DevTools Console — нет ошибок.
    - Hero-секция, Metrics, Niches, Survey-CTA рендерятся визуально как раньше.
    - Кнопки в Hero ("Tell about your business", "View demo") и в карточках ниш переходят на `/en/survey` и `/en/demo/dashboard` (с полной перезагрузкой — это плановый компромисс).
    - Шапка/подвал работают (Layout подключен), переключатель языков работает.
    - Открыть `http://haccpilot.local/ro` → главная на румынском, locale в shared-props = `ro`, переводы подгружены.
    - Открыть `http://haccpilot.local/en/about`, `http://haccpilot.local/en/survey`, `http://haccpilot.local/en/contact` → они **должны продолжать работать через legacy SPA** (catchall `/{any}` нетронут) — никаких регрессий на не-мигрированных страницах.

---

### About ✅ Выполнено

**Текущее состояние:** [resources/js/pages/client/About.vue](resources/js/pages/client/About.vue), 1019 строк. Snap-скролл с DOM-кэшированием, `document.querySelector`, `window.setTimeout`, `requestAnimationFrame`.

**Сложность миграции:** **низкая** в итоге — все DOM-вызовы в About уже находились внутри `onMounted` / `onUnmounted` / user-handlers (никаких setup-фазных обращений к `window`/`document`). Файл оказался SSR-safe из коробки. Не использует `useRouter`/`useRoute`.

**Что делать:**

1. Скопировать в `InertiaPages/About.vue`.
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

**Что сделал:**

- **Извлёк общий компонент SEO-head** [resources/js/components/SeoHead.vue](../../../../resources/js/components/SeoHead.vue) (~30 строк) — переиспользуемая обёртка над `<Head>` от `@inertiajs/vue3`. Принимает prop `seo` той же формы, что возвращает `SeoMetaResolver::resolveForInertia()`. Doc-блок описывает назначение. Этот компонент используется во всех будущих InertiaPages — убирает дублирование 17 строк meta-тегов.
- **Отрефакторил [InertiaPages/Home.vue](resources/js/InertiaPages/Home.vue)** — заменил inline-блок `<Head>` на `<SeoHead :seo="seo" />`. Импорт `Head` из `@inertiajs/vue3` убран, добавлен импорт `SeoHead`. Home-chunk уменьшился с 2.82 КБ до 1.10 КБ.
- **Создал [InertiaPages/About.vue](resources/js/InertiaPages/About.vue)** копированием через `cp` из legacy с минимальными правками:
    - В template после `<template>` добавлен `<SeoHead :seo="seo" />`.
    - В `<script setup>` импорты `usePageSeo` заменены на `SeoHead` + `PublicLayout`. Вызов `usePageSeo(...)` удалён (его функцию выполняет `<SeoHead>`). Добавлен `defineProps({ seo: { type: Object, required: true } })`. В `defineOptions` добавлено `layout: PublicLayout`.
    - В `<style>`: `@use "../../../scss/variables"` → `@use "../../scss/variables"` (новый путь — `InertiaPages/` это на 1 уровень выше, чем `pages/client/`).
    - Весь template с 7 секциями + nav-dots, snap-скролл логика, `programmaticNav`, обработчики `wheel`/`pointerdown`/`scroll` — скопированы 1:1. Все DOM-вызовы уже были в `onMounted`/`onUnmounted`/handlers — SSR-safe.
- В [routes/web.php](../../../../routes/web.php) добавлен Inertia-роут `/{locale}/about` **внутри** существующей `locale`-группы, **перед** catchall `/{any}`. Инлайн-функция-обработчик использует тот же шаблон что Home: `Inertia::render('About', ['seo' => $seoResolver->resolveForInertia($request->path(), app()->getLocale())])`. Catchall `/{any}` остался legacy для не-мигрированных страниц.
- Класс `main-content--bg-style-white` уже задан в `Layouts/PublicLayout.vue` через `usePage().component === 'About'` (сделано в шаге 0.10) — никаких дополнительных правок не понадобилось.
- Старый [resources/js/pages/client/About.vue](resources/js/pages/client/About.vue) **не удалял** — он остаётся в legacy SPA-bundle на случай отката.

**Как проверить работоспособность:**

- **Bash/code-проверки** (выполнено):
    - `npm run build` отрабатывает без ошибок (~45 секунд). В bundle появляются `About-[hash].js` (10.33 КБ) и `About-[hash].css` (11.16 КБ) как отдельный chunk благодаря lazy-resolve в `inertia-app.js`.
    - `php -r` smoke-test `SeoMetaResolver::resolveForInertia('en/about', 'en')` возвращает: title=`"About the project - HACCPilot | HACCPilot"`, canonical=`"http://haccpilot.local/en/about"`, 26 hreflang.
    - SeoHead extracted: Home chunk уменьшился с 2.82 КБ до 1.10 КБ, общий код вынесен в shared chunk.
- **Ручные проверки в браузере** (нужно выполнить):
    - Открыть `http://haccpilot.local/en/about` → страница загружается через **Inertia** (DevTools → View Source: HTML содержит `<div id="app" data-page='{...}'></div>`).
    - `view-source:` страницы содержит `<title>About the project - HACCPilot | HACCPilot</title>`, `<meta description>`, canonical=`/en/about`, 26 hreflang — **в HTML до выполнения JS**.
    - Шапка/подвал работают (Layout подключен).
    - Класс `main-content--bg-style-white` применяется к `<main>` (белый фон для About-страницы).
    - 7 секций контента видны, h1 рендерится.
    - **Snap-скролл по точкам навигации** работает: клик по точке справа плавно прокручивает к нужной секции, активная точка подсвечивается.
    - Колесо мыши прокручивает между секциями.
    - Pointerdown/wheel-handlers корректно отменяют programmaticNav.
    - В DevTools Console — нет ошибок про `useRoute`, `vue-router`, `nextTick` или гидратацию.
    - Открыть `http://haccpilot.local/ro/about` — страница на румынском, snap-скролл работает.
    - SurveyCtaSection в последней (CTA) секции — кнопка ведёт на `/{locale}/survey`.

---

### HowWorks ✅ Выполнено

**Текущее состояние:** [resources/js/pages/client/HowWorks.vue](resources/js/pages/client/HowWorks.vue), 33 строки. 3 дочерних компонента, без API, без window.

**Сложность миграции:** **очень низкая**.

**Что делать:**

1. Скопировать в `InertiaPages/HowWorks.vue`.
2. `<Head>` через props.
3. `defineOptions({ layout: PublicLayout })`.
4. Контроллер: `Inertia::render('HowWorks', ['seo' => SeoMetaResolver::resolve('how_it_works', $locale)])`.

**Риски:** ноль.

**Что сделал:**

- Проверил дочерние компоненты — `StepsSection.vue` и `AdvantagesSection.vue` НЕ используют `vue-router` (`grep -rln "vue-router"` пусто), `SurveyCtaSection.vue` уже отрефакторен в фазе Home. Известного issue с дочерними нет.
- Создал [resources/js/InertiaPages/HowWorks.vue](resources/js/InertiaPages/HowWorks.vue) (~45 строк). Использует общий `<SeoHead :seo="seo" />` (создан при миграции About). Подключает `PublicLayout` через `defineOptions.layout`. Принимает `seo` prop с `required: true`. Дочерние компоненты импортируются как раньше (`StepsSection`, `AdvantagesSection`, `SurveyCtaSection` от Home). SCSS-путь поправлен на `../../scss/variables`.
- **Отрефакторил [routes/web.php](../../../../routes/web.php)** — вынес общий шаблон Inertia-роута в helper-замыкание `$inertiaPage = fn ($component) => fn ($request, $resolver) => Inertia::render(...)`. Теперь каждый роут — одна короткая строка `Route::get('/about', $inertiaPage('About'))`. Helper снабжён doc-блоком о назначении.
- Добавил `Route::get('/how-it-works', $inertiaPage('HowWorks'))` внутри `locale`-группы перед catchall `/{any}`. Catchall остался legacy для не-мигрированных страниц.
- Существующие Home/About-роуты переписаны через тот же helper — убрано 12 строк дублирующегося кода.
- Старый [resources/js/pages/client/HowWorks.vue](resources/js/pages/client/HowWorks.vue) **не удалял** — остаётся в legacy SPA-bundle.

**Как проверить работоспособность:**

- **Bash/code-проверки** (выполнено):
    - `php artisan route:list` показывает `GET {locale}/about` и `GET {locale}/how-it-works` без ошибок.
    - `php -r` smoke-test `SeoMetaResolver::resolveForInertia('en/how-it-works', 'en')`: title начинается с `HACCPilot - HACCP Automation, QR Inspection & Food Safety...`, canonical=`http://haccpilot.local/en/how-it-works`.
    - `npm run build` отрабатывает за ~40 секунд без ошибок. В bundle: `HowWorks-[hash].js` (0.85 КБ), `HowWorks-[hash].css` (0.14 КБ).
- **Ручные проверки в браузере** (нужно выполнить):
    - Открыть `http://haccpilot.local/en/how-it-works` → страница загружается через Inertia, в `view-source:` есть `<div id="app" data-page='{...}'></div>`.
    - В `view-source:` присутствуют `<title>HACCPilot - HACCP Automation...</title>`, meta description, canonical, hreflang × 26 — всё в HTML до выполнения JS.
    - Steps-секция, Advantages-секция, CTA-секция отображаются как раньше.
    - DevTools Console чистая.
    - Открыть `http://haccpilot.local/ro/how-it-works` — на румынском.
    - Не-мигрированные страницы (`/en/survey`, `/en/contact`, `/en/privacy-policy`) продолжают работать через legacy SPA — без регрессий.

---

### PrivacyPolicy ✅ Выполнено

**Текущее состояние:** [resources/js/pages/client/PrivacyPolicy.vue](resources/js/pages/client/PrivacyPolicy.vue), 190 строк. Использует `useSiteConfigStore` для подстановки `name` и `adminEmail`.

**Сложность миграции:** **низкая**.

**Что делать:**

1. Скопировать в `InertiaPages/PrivacyPolicy.vue`.
2. Заменить `useSiteConfigStore` на чтение из `usePage().props.siteConfig.name` и `usePage().props.siteConfig.adminEmail` (приходят из shared-props HandleInertiaRequests).
3. Сам `useSiteConfigStore` после миграции **можно удалить** — он не нужен (значения уже есть в props).
4. `<Head>` через props.
5. Контроллер: `Inertia::render('PrivacyPolicy', ['seo' => ...])`.

**Риски:** ноль.

**Что сделал:**

- Создал [resources/js/InertiaPages/PrivacyPolicy.vue](resources/js/InertiaPages/PrivacyPolicy.vue) (~190 строк). Template и стили скопированы 1:1 из legacy.
- В script: убраны `useSiteConfigStore` и `usePageSeo`. Вместо них:
    - Импорт `usePage` из `@inertiajs/vue3` + computed `siteConfig` (через `page.props.siteConfig`) с doc-блоком о назначении (объясняет переход с Pinia-store на Inertia-props).
    - Импорт `SeoHead` и `PublicLayout`, в `defineOptions` добавлен `layout: PublicLayout`.
    - Принят prop `seo` с `required: true`.
- В template после `<template>` добавлен `<SeoHead :seo="seo" />`. Подстановки `{{ siteConfig.name }}` и `{{ siteConfig.adminEmail }}` работают через computed без правок (Vue auto-unwrap).
- SCSS-путь поправлен на `../../scss/variables`.
- Закомментированный `@media`-блок в legacy — не копировал (мёртвый код).
- В [routes/web.php](../../../../routes/web.php) добавлена одна строка `Route::get('/privacy-policy', $inertiaPage('PrivacyPolicy'))` — благодаря helper-closure из шага HowWorks.
- `useSiteConfigStore` пока **не удаляю** — он всё ещё используется в legacy `Header.vue`, `Footer.vue`, и legacy `pages/client/PrivacyPolicy.vue` (он остаётся как fallback). Удалится в финальной очистке legacy. ⏳ **Отложено** → см. `overtake_inertia.md` → "Проверка отложенного" → **A.3 Удалить `useSiteConfigStore` и window-мост**.

**Как проверить работоспособность:**

- **Bash/code-проверки** (выполнено):
    - `php artisan route:list` показывает `GET {locale}/privacy-policy` без ошибок.
    - `php -r` smoke-test `SeoMetaResolver::resolveForInertia('en/privacy-policy', 'en')`: title начинается с `Privacy Policy – HACCPilot Data Protection & GDPR Compliance`, canonical=`http://haccpilot.local/en/privacy-policy`.
    - `npm run build` отрабатывает за ~47 секунд без ошибок. В bundle: `PrivacyPolicy-[hash].js` (3.03 КБ), `PrivacyPolicy-[hash].css` (1.37 КБ).
- **Ручные проверки в браузере** (нужно выполнить):
    - Открыть `http://haccpilot.local/en/privacy-policy` → загрузка через Inertia (`view-source:` имеет `data-page='{...}'`).
    - В `view-source:` — title/description/canonical/hreflang × 26 в HTML до JS.
    - В заголовке/субтитре подставлено название "HACCPilot" (из `siteConfig.name`).
    - В разделе "Контакты" внизу подставлен `adminEmail` (из `siteConfig.adminEmail`) — должен совпадать с `EMAIL_ADMIN` из .env.
    - Все 10 разделов рендерятся, текст переведён.
    - DevTools Console чистая (нет ошибок про `useSiteConfigStore`, `useRoute`, `vue-router`).
    - **ConsentOverlay не показывается** на этой странице (regex-проверка из шага 0.10).
    - `http://haccpilot.local/ro/privacy-policy` — на румынском.

---

### Contact ✅ Выполнено

**Текущее состояние:** [resources/js/pages/client/Contact.vue](resources/js/pages/client/Contact.vue), 552 строки. Форма с honeypot, валидация naive-ui, POST `/contact` через `apiAxios`.

**Сложность миграции:** **низкая**.

**Что делать:**

1. Скопировать в `InertiaPages/Contact.vue`.
2. Импорты naive-ui (`NForm`, `NFormItem`, `NInput`, `NButton`) — оставить локальными, как сейчас.
3. **API-вызов оставить через apiAxios** — это единичный POST, переписывать в `useForm` от Inertia смысла мало (сложная honeypot-логика, валидация).
4. `<Head>` через props.
5. Контроллер на бэке для GET `/{locale}/contact`: `Inertia::render('Contact', ['seo' => ...])`.
6. POST `/contact` остаётся как есть в `ContactController` (вызывается через apiAxios).

**Альтернатива:** перенести submit на `useForm` Inertia. Тогда после успеха Laravel редиректит на `/{locale}/contact?sent=true` или возвращает `Inertia::back()->with('flash', ...)`. Toast показывается из shared-props `flash`. Это чуть менее прозрачно, чем сейчас, но уберёт CSRF-возню.

Рекомендация: **оставить apiAxios** на первом этапе. Переход на `useForm` — опционально, в фазе F.

> ⏸ **Опционально отложено** → см. `overtake_inertia.md` → "Проверка отложенного" → **A.9 Опционально — Contact submit на `useForm` Inertia**.

**Риски:** ноль для apiAxios-варианта.

**Что сделал:**

- Проверил Contact.vue grep'ом: vue-router НЕ используется, `window`/`document` не упоминаются, единственный lifecycle-хук — `onMounted` для honeypot-таймера (`Date.now()` SSR-safe).
- Создал [resources/js/InertiaPages/Contact.vue](resources/js/InertiaPages/Contact.vue) копированием через `cp` (552 строки) + 3 точечных Edit'а:
    - В template после `<template>` добавлен `<SeoHead :seo="seo" />`.
    - В `<script setup>` импорт `usePageSeo` заменён на `SeoHead` + `PublicLayout`. Вызов `usePageSeo({ i18nKey: "seo.contact" })` удалён. В `defineOptions` добавлено `layout: PublicLayout`. Принят prop `seo` с `required: true`.
    - SCSS-путь `@use "../../../scss/variables"` → `@use "../../scss/variables"`.
- Сама форма (template, валидация, honeypot, submit-handler через apiAxios) **скопирована 1:1** — никаких изменений в логике формы или вызове API.
- POST `/contact` в [routes/web.php](../../../../routes/web.php) НЕ менялся — endpoint остаётся как есть, обрабатывается `ContactController::submit`. Фронт через `apiAxios.post("/contact", payload, true)` отправляет туда данные ровно как раньше.
- В [routes/web.php](../../../../routes/web.php) добавлена одна строка `Route::get('/contact', $inertiaPage('Contact'))` — благодаря helper-closure из шага HowWorks.
- Старый [resources/js/pages/client/Contact.vue](resources/js/pages/client/Contact.vue) **не удалял** — в legacy SPA-bundle, fallback на случай отката.

**Как проверить работоспособность:**

- **Bash/code-проверки** (выполнено):
    - `php -r` smoke-test `SeoMetaResolver::resolveForInertia('en/contact', 'en')`: title начинается с `Contact HACCP Software Developer – HACCPilot Support & Con...`, canonical=`http://haccpilot.local/en/contact`.
    - `npm run build` отрабатывает за ~41 секунду без ошибок. В bundle: `Contact-[hash].js` (6.40 КБ), `Contact-[hash].css` (7.19 КБ).
    - `grep -nE "useRouter|useRoute|<router-link" resources/js/InertiaPages/Contact.vue` — пусто.
- **Ручные проверки в браузере** (нужно выполнить):
    - Открыть `http://haccpilot.local/en/contact` → загрузка через Inertia (`view-source:` имеет `data-page='{...}'`).
    - В `view-source:` — title `Contact HACCP Software Developer...`, meta description, canonical, hreflang × 26 — до выполнения JS.
    - Форма рендерится: 4 поля (Name, Email, Company, Message) + кнопка Send.
    - Honeypot-поле `company_hp` присутствует в DOM, но скрыто визуально (`tabindex="-1"`, `aria-hidden="true"`).
    - Trust-карточки справа отображаются.
    - Валидация: пустое поле Name → Email → Message при попытке отправить даёт ошибки от naive-ui.
    - Невалидный email → ошибка "...email valid".
    - Сообщение <10 символов → ошибка "min length".
    - **Заполнить корректно и отправить** → POST `/contact` уходит, success-toast показывается, форма скрывается, появляется success-view.
    - DevTools → Network → POST `/contact` имеет header `X-Locale: en`, `X-CSRF-TOKEN`, `X-Requested-With: XMLHttpRequest`.
    - DevTools Console чистая.
    - `http://haccpilot.local/ro/contact` → форма на румынском, submit идёт на тот же `/contact` endpoint, серверный ответ с румынскими сообщениями (через middleware).

---

### Survey ✅ Выполнено

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

1. Скопировать в `InertiaPages/Survey.vue`.
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

**Что сделал:**

- **Перевёл `SurveySuccessScreen.vue` на универсальный `<a :href>`** — заменил `<RouterLink :to="homeRouteLocation">` на `<a :href="homeHref">`, поменял prop с `homeRouteLocation: Object` на `homeHref: String`. Doc-блок описывает новую семантику. Это убирает зависимость компонента от vue-router.
- **Обновил legacy [resources/js/pages/client/Survey.vue](resources/js/pages/client/Survey.vue)** — `surveyHomeRouteLocation` (объект) → `surveyHomeHref` (строка). Передача в template `:home-href` вместо `:home-route-location`. Legacy SPA продолжает работать.
- **Создал [resources/js/InertiaPages/Survey.vue](resources/js/InertiaPages/Survey.vue)** копированием через `cp` (1308 строк) с серией точечных правок:
    - В template после `<template>` добавлен `<SeoHead :seo="seo" />`.
    - Импорты relative (`../../features/...`, `../../components/...`) → alias `@/...` (поскольку файл теперь на 1 уровень выше в ФС).
    - SCSS-путь `../../../scss/variables` → `../../scss/variables`.
    - Убраны импорты `useRoute`, `usePageSeo`. Добавлены `SeoHead`, `PublicLayout`, `useCurrentLocale`.
    - `defineOptions({ name: "Survey", layout: PublicLayout })`. `defineProps({ seo, questions })` — оба `required: true`.
    - `surveyHomeHref` упрощён через `useCurrentLocale()` без `useRoute`.
- **Удалена функция `loadSurveyQuestionsFromApi()` (~37 строк)** — заменена на синхронную `applyServerProvidedQuestions()` которая берёт `props.questions` (отрендерены сервером) и заливает в живой стор `replaceSurveyQuestionsById`. Doc-блок описывает SEO-преимущество (вопросы в HTML до JS) и эквивалентную логику валидации формы.
- В `onMounted`: убран `await loadSurveyQuestionsFromApi()` (вопросы уже в сторе с сервера, перед mount). `applyServerProvidedQuestions()` вызывается **синхронно в setup-фазе** — это критично, чтобы `replaceSurveyQuestionsById` отработала до того как computed-ы (visibleStepIds и т.п.) попытаются прочитать вопросы.
- POST `/survey/submit` и `/survey/verify` через `apiAxios` **не трогал** — продолжают работать как раньше. PIN-flow, lead-flow, sessionStorage/localStorage, `crypto.subtle` — всё скопировано 1:1.
- **Расширил helper `$inertiaPage` в [routes/web.php](../../../../routes/web.php)** — добавлен опциональный второй параметр `?callable $extraPropsResolver` для динамических props (нужен Survey + готовится для BatchPublic/DailyReportPublic). Doc-блок обновлён.
- Импортирован `App\Services\SurveyQuestionsClientService`. Добавлена строка `Route::get('/survey', $inertiaPage('Survey', fn () => ['questions' => app(SurveyQuestionsClientService::class)->getActiveQuestionsKeyedByStableId()]))` перед catchall.
- Старый GET `/survey/questions` JSON-endpoint **не удалял** — legacy `pages/client/Survey.vue` его всё ещё использует. После финальной очистки legacy этот endpoint можно убрать. ⏳ **Отложено** → см. `overtake_inertia.md` → "Проверка отложенного" → **A.5 Удалить `/survey/questions` JSON-endpoint**.

**Как проверить работоспособность:**

- **Bash/code-проверки** (выполнено):
    - `php -r` smoke-test `SurveyQuestionsClientService::getActiveQuestionsKeyedByStableId()` — возвращает 17 вопросов с правильными stable_id.
    - `php artisan route:list` показывает `GET {locale}/survey` без ошибок, плюс legacy `GET survey/questions`, `POST survey/submit`, `POST survey/verify` остаются.
    - `npm run build` отрабатывает за ~51 секунду без ошибок. В bundle: `Survey-[hash].js` (11.78 КБ), `Survey-[hash].css` (3.30 КБ).
    - `grep -n "useRouter\|useRoute" resources/js/InertiaPages/Survey.vue` — пусто.
    - `grep -n "loadSurveyQuestionsFromApi" resources/js/InertiaPages/Survey.vue` — пусто.
- **Ручные проверки в браузере** (нужно выполнить):
    - Открыть `http://haccpilot.local/en/survey` → загрузка через Inertia (`view-source:` имеет `data-page='{...}'`).
    - **В `view-source:` присутствуют 17 вопросов** в Inertia-prop'е `questions` (это главный SEO-win — Googlebot видит текст вопросов до JS).
    - Title=`Survey - HACCPilot...`, canonical=`/en/survey`, hreflang × 26 — в HTML до JS.
    - **DevTools → Network: НЕТ запроса `/survey/questions`** при загрузке страницы (раньше он шёл из onMounted; теперь данные приходят с сервера).
    - Intro-экран рендерится, кнопка "Начать опрос" работает.
    - Вопросы переключаются по выбору ответа.
    - **Lead-форма** (email, имя, бизнес и т.д.) рендерится, валидация работает.
    - **Submit lead** → POST `/survey/submit` уходит, success или PIN-экран показывается в зависимости от того новый email или повторный.
    - **PIN-flow**: ввод 4 цифр → POST `/survey/verify`, ошибочный код → toast с количеством оставшихся попыток.
    - **localStorage `LS_SURVEY_SUBMISSION_STATE`** — после успешной отправки восстанавливается на следующем заходе (показывается экран "уже отправлял").
    - DevTools Console чистая (нет ошибок про vue-router/useRoute, гидратацию, undefined questions).
    - `http://haccpilot.local/ro/survey` — на румынском, 17 вопросов отображаются.
    - Не-мигрированные (`/en/demo`, `/en/batch/...`) работают через legacy.

---

### Demo ✅ Выполнено (оставлен на legacy SPA по обоснованной причине)

**Текущее состояние:** [resources/js/pages/client/Demo.vue](resources/js/pages/client/Demo.vue), 9 строк (wrapper). Реальная логика в `features/demo/page/DemoPage.vue` и куче дочерних компонентов с `n-modal`, `n-config-provider`, темной темой, useMessage и т.д.

**Сложность миграции:** **средняя**, потому что демо — это чисто client-side experience.

**Что делать:**

1. Скопировать в `InertiaPages/Demo.vue`.
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

**Что сделал — обоснованное решение оставить на legacy:**

- Подсчитал зависимости от vue-router в `features/demo/` — **5 файлов** используют `useRouter`/`useRoute`/`<router-link>`:
    1. [features/demo/page/DemoPage.vue](../../../../resources/js/features/demo/page/DemoPage.vue) — корневой компонент демо
    2. [features/demo/components/sections/DashboardSection.vue](../../../../resources/js/features/demo/components/sections/DashboardSection.vue)
    3. [features/demo/components/sections/ReportsSection.vue](../../../../resources/js/features/demo/components/sections/ReportsSection.vue)
    4. [features/demo/components/modals/EudrQrModal.vue](../../../../resources/js/features/demo/components/modals/EudrQrModal.vue)
    5. [features/demo/task_grain_cooling/grainCoolingDemoEntry.js](../../../../resources/js/features/demo/task_grain_cooling/grainCoolingDemoEntry.js)
- **`<ClientOnly>` обёртка не работает** в данном случае: ClientOnly скрывает только рендер дочерних, но Vue **всё равно выполняет setup-фазу** компонентов — `useRoute()` упадёт ещё до того, как ClientOnly успеет их скрыть. План это упустил.
- **Прагматичное решение:** Demo НЕ мигрирован на этом этапе, остаётся на legacy SPA через catchall `/{any}` в `routes/web.php` (`view('index-client')`).
- Обоснование: план сам признаёт что "Demo для SEO малоценен" — это интерактивная демо-зона (n-modal, тёмная тема, формы заполнения, grain-cooling сценарий), не маркетинговая страница для индексации. Risk/reward для миграции отрицательный — много правок в 5+ файлах с риском поломать сложную UX-цепочку, ради SEO-выгоды которой нет.
- Альтернативы что отверг:
    - Адаптировать 5 файлов на `useCurrentLocale()` + `<a href>` — это отдельный крупный PR с фокусом на demo-зону, не "мимоходом" в SEO-миграции.
    - Подключить vue-router shim в `inertia-app.js` — двойная навигация (vue-router и Inertia спорят за URL).

**Если в будущем потребуется мигрировать Demo** — отдельный PR в стиле фазы B (рефакторинг 5 файлов на `useCurrentLocale()`/`<a href>`, потом создание `InertiaPages/Demo.vue` + роут) на 1-2 рабочих дня.

> ⏸ **Отложено** → см. `overtake_inertia.md` → "Проверка отложенного" → **A.7 Demo — мигрировать или убрать из sitemap**.

**Как проверить работоспособность:**

- **Bash/code-проверки** (выполнено):
    - `php artisan route:list | grep '{any}'` — catchall на месте, обрабатывает `/en/demo/*`.
    - В `routes/web.php` нет роута для `/demo` через `Inertia::render` — преднамеренно.
    - В `resources/js/InertiaPages/` нет `Demo.vue` — преднамеренно.
- **Ручные проверки в браузере** (нужно выполнить):
    - Открыть `http://haccpilot.local/en/demo` → редирект на `/en/demo/dashboard` (legacy Vue Router).
    - В `view-source:` старый `<div id="app">` (legacy SPA), а **не** Inertia-page.
    - Demo-страница рендерится, naive-ui модалки работают, grain-cooling сценарий запускается, темная тема применяется — всё **как раньше**, без регрессий.
    - Переходы между секциями demo (dashboard / checklists / eudr / personnel / reports) работают через Vue Router.
    - Кнопка "Главная" из Demo ведёт обратно на `/en` (мигрированный Inertia Home — полная перезагрузка).

---

### BatchPublic ✅ Выполнено (минимальная миграция)

**Текущее состояние:** [resources/js/pages/client/BatchPublic.vue](resources/js/pages/client/BatchPublic.vue), 603 строки. Читает данные из `getBatchPublicRecord(batchId)` (демо-функция), берёт `batchId` и `locale` из URL-params.

**Сложность миграции:** **средняя**, потому что это **отдельный слой**, который должен быть SEO-оптимизированным (динамический контент с описанием продукта).

**Что делать:**

1. Скопировать в `InertiaPages/BatchPublic.vue`.
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

**Что сделал — минимальная миграция (компромисс):**

`getBatchPublicRecord` — это **JS-демо-моки** в [features/demo/data/eudrBatchPublic.js](../../../../resources/js/features/demo/data/eudrBatchPublic.js) (281 строка с `i18n.global.t()` для переводов, 3 фиксированных batch'а: AB123, CF762, BR041). Полный PHP-эквивалент — большой объём работы ради демо-данных, и это всё ещё не реальная БД.

Принятое решение: **минимальная миграция** — Inertia передаёт через сервер только SEO + `batchId` + `print` (флаг auto-print из query), а сам контент batch'а строится на клиенте через ту же `getBatchPublicRecord(props.batchId)`. SEO для **header (title/description/canonical/hreflang/og)** работает с сервера — это главный win для индексации. Контент batch'а подгружается после mount, что приемлемо для демо-данных. Когда появятся реальные batch'и из БД — переписать на server-side тривиально (заменить resolver на Eloquent-запрос).

> ⏸ **Отложено** → см. `overtake_inertia.md` → "Проверка отложенного" → **A.8 BatchPublic / DailyReportPublic — серверный resolver данных**.

- Создал [resources/js/InertiaPages/BatchPublic.vue](resources/js/InertiaPages/BatchPublic.vue) копированием через `cp` (603 строки) с правками:
    - `<SeoHead :seo="seo" />` в template после `<template>`.
    - `useRoute` (vue-router) убран. Импорт `usePage` из `@inertiajs/vue3`. Добавлены `SeoHead`, `PublicLayout`. В `defineOptions.layout` подключён `PublicLayout`.
    - `defineProps({ seo, batchId, print })` — все required (кроме `print` со значением `false`).
    - `batchId` через `computed(() => props.batchId)` (раньше — `String(route.params.batchId ?? "")`).
    - `localeForCanonical` упразднён — `canonicalUrl` собирается через `buildBatchPublicUrl(batchId.value, page.props.locale ?? null)` где локаль из shared-props.
    - `wantsAutoPrint` теперь читает `props.print` (boolean), а не `route.query.print === "1"` (строка). Server-side в роуте `print` приходит из `$request->boolean('print')`, что корректно обрабатывает `?print=1`.
    - `runAutoPrint` снабжён doc-блоком о назначении.
    - Watch теперь следит за `[record.value?.id, props.print]` — без зависимости от `route.query`.
    - SCSS-путь поправлен на `../../scss/variables`.
- Перенёс определение helper-closure `$inertiaPage` в [routes/web.php](../../../../routes/web.php) выше — сразу после `$localePattern`. Это сделало helper доступным для всех роутов в файле, не только внутри locale-группы (нужно для root `/batch/{batchId}` без локали).
- Добавил два роута через тот же helper:
    - `Route::get('/batch/{batchId}', $inertiaPage('BatchPublic', fn ($req) => ['batchId' => ..., 'print' => ...]))->middleware('setLocale')` — root без префикса (для старых QR-кодов). Middleware `setLocale` подключён, чтобы локаль определялась корректно.
    - Внутри locale-группы: `Route::get('/batch/{batchId}', ...)` — то же самое, перед catchall `/{any}`.
- Старый `/batch/{batchId}` и legacy `BatchPublic.vue` **не трогал** — удалены только роутингом (стары fallback на view удалён в момент замены на Inertia). Legacy-файл `pages/client/BatchPublic.vue` физически в bundle, но catchall его теперь не вызывает на /batch/.

**Как проверить работоспособность:**

- **Bash/code-проверки** (выполнено):
    - `php artisan route:list | grep batch` — два Inertia-роута: `GET batch/{batchId}` (root) и `GET {locale}/batch/{batchId}`.
    - `php -r` smoke-test `SeoMetaResolver::resolveForInertia('en/batch/AB123', 'en')`: title начинается с `EUDR Batch AB123 – Supply Chain Traceability & Compliance`, placeholder `{id}` подставлен корректно. Canonical=`http://haccpilot.local/en/batch/AB123`.
    - Тот же smoke-test для root `batch/AB123` без локали — canonical всё равно `/en/...`.
    - `npm run build` отрабатывает за ~47 секунд без ошибок. В bundle: `BatchPublic-[hash].js` (7.24 КБ), `BatchPublic-[hash].css` (4.92 КБ).
- **Ручные проверки в браузере** (нужно выполнить):
    - Открыть `http://haccpilot.local/en/batch/AB123` → загрузка через Inertia (`view-source:` имеет `data-page='{...}'`).
    - В `view-source:` — `<title>EUDR Batch AB123 – Supply Chain Traceability & Compliance | HACCPilot</title>`, meta description с {id}=AB123, canonical, hreflang × 26 — всё в HTML до выполнения JS. Это главный SEO-выигрыш.
    - Контент batch'а (продукт, supply chain, evidence, status) рендерится после mount.
    - `http://haccpilot.local/batch/AB123` (без локали — старые QR) тоже открывается, главная страница ведёт на `/en`.
    - `http://haccpilot.local/en/batch/AB123?print=1` — авто-открытие диалога печати после загрузки.
    - `http://haccpilot.local/ro/batch/CF762` — на румынском.
    - Кнопка "Закрыть" работает (`window.close()` или history.back).
    - `http://haccpilot.local/en/batch/UNKNOWN_ID` (несуществующий) — `record.value` = null, страница показывает fallback (или редиректит — зависит от логики template).
    - DevTools Console чистая (нет ошибок про vue-router/useRoute/batchId).
    - Не-мигрированные (`/en/demo`, `/en/report/...`) работают через legacy.

---

### DailyReportPublic ✅ Выполнено (минимальная миграция)

**Текущее состояние:** [resources/js/pages/client/DailyReportPublic.vue](resources/js/pages/client/DailyReportPublic.vue), 1340 строк. Читает данные через `getDailyReportSnapshot(safe)`, пользует `route.params.date`, `window.scrollY`, `document.documentElement.scrollTop`, sсroll-listener в onMounted.

**Сложность миграции:** **средняя**, аналогично BatchPublic + дополнительные client-эффекты.

**Что делать:**

1. Скопировать в `InertiaPages/DailyReportPublic.vue`.
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

**Что сделал — минимальная миграция (по аналогии с BatchPublic):**

`getDailyReportSnapshot` — это **JS-демо-моки** в [features/demo/data/dailyReportPublic.js](../../../../resources/js/features/demo/data/dailyReportPublic.js) (использует `i18n.global.t()`). Принимаю тот же компромисс что для BatchPublic: server-side SEO + client-side контент. SEO для header-meta (title, description, canonical, hreflang, og) приходит от сервера и индексируется Googlebot'ом, а табличный отчёт строится на клиенте после mount.

> ⏸ **Отложено** → см. `overtake_inertia.md` → "Проверка отложенного" → **A.8 BatchPublic / DailyReportPublic — серверный resolver данных**.

- Создал [resources/js/InertiaPages/DailyReportPublic.vue](resources/js/InertiaPages/DailyReportPublic.vue) копированием через `cp` (1340 строк) с правками:
    - `<SeoHead :seo="seo" />` в template после `<template>`.
    - `useRoute` (vue-router) убран. Импортированы `usePage` из `@inertiajs/vue3`, `SeoHead`, `PublicLayout`. В `defineOptions.layout` подключён `PublicLayout`.
    - `defineProps({ seo, date, print })` — все required (кроме `print` со значением `false`).
    - `dateParam` через `computed(() => props.date)` (раньше — `String(route.params.date ?? "")`).
    - `localeForCanonical` упразднён — `canonicalUrl` строится через `buildDailyReportPublicUrl(dateParam.value, page.props.locale ?? null)` напрямую.
    - `generatedAtFormatted` использует `page.props.locale || "en"` для `Intl.DateTimeFormat` (локализованное имя месяца).
    - `wantsAutoPrint` теперь `props.print === true` (boolean), а не `route.query.print === "1"` (string).
    - `runAutoPrint` снабжён doc-блоком о назначении и точках вызова.
    - Watch теперь следит за `[snapshot.value?.dateIso, props.print]`.
    - SCSS-путь поправлен на `../../scss/variables`.
- Scroll-логика (`getWindowScrollTop`, `onScroll`, `scrollTop`) **скопирована 1:1** — все обращения к `window`/`document` находятся в обработчиках событий, которые навешиваются в `onMounted` → SSR-safe.
- В [routes/web.php](../../../../routes/web.php) добавлены два роута через тот же `$inertiaPage` helper:
    - `Route::get('/report/{date}', $inertiaPage('DailyReportPublic', fn ($req) => ['date' => ..., 'print' => ...]))->middleware('setLocale')` — root без префикса (для прямых deep-link'ов).
    - Внутри locale-группы: `Route::get('/report/{date}', ...)` — то же самое, перед catchall `/{any}`.
- Старый `Route::get('/report/{date}', fn () => view('index-client'))` заменён на Inertia-вариант. Catchall обрабатывает остальное.
- `getDailyReportSnapshot` остаётся в `features/demo/data/dailyReportPublic.js` — продолжает использоваться и legacy-fallback (если кто-то ещё на `pages/client/DailyReportPublic.vue`), и Inertia-страница на клиенте.

**Как проверить работоспособность:**

- **Bash/code-проверки** (выполнено):
    - `php artisan route:list | grep report` — два Inertia-роута: `GET report/{date}` (root) и `GET {locale}/report/{date}`.
    - `php -r` smoke-test `SeoMetaResolver::resolveForInertia('en/report/2026-04-20', 'en')`: title начинается с `Daily HACCP Report 2026-04-20 – CCP Monitoring & Compliance Summary`, placeholder `{date}` подставлен корректно. Canonical=`http://haccpilot.local/en/report/2026-04-20`.
    - `npm run build` отрабатывает за ~54 секунды без ошибок. В bundle: `DailyReportPublic-[hash].js` (15.43 КБ), `DailyReportPublic-[hash].css` (10.58 КБ).
- **Ручные проверки в браузере** (нужно выполнить):
    - Открыть `http://haccpilot.local/en/report/2026-04-20` → загрузка через Inertia (`view-source:` имеет `data-page='{...}'`).
    - В `view-source:` — title с подставленной датой, meta description, canonical, hreflang × 26 — в HTML до выполнения JS. Главный SEO-выигрыш.
    - Табличный отчёт (CCP-задачи, EUDR intake, summary) рендерится после mount.
    - `http://haccpilot.local/report/2026-04-20` (без локали) тоже открывается — root-роут с middleware `setLocale`.
    - `http://haccpilot.local/en/report/2026-04-20?print=1` — авто-открытие диалога печати после загрузки и mount.
    - `http://haccpilot.local/ro/report/2026-04-20` — на румынском, `Intl.DateTimeFormat` показывает дату в ro-формате.
    - Кнопка "Закрыть" работает (`window.close()` или history.back).
    - **Кнопка "Наверх"** появляется при scroll > 1500px и плавно прокручивает наверх. Скролл-listener регистрируется на `window` И на `.main-content` (зависит от того где скроллится контент).
    - DevTools Console чистая.
    - Не-мигрированные (`/en/demo`) работают через legacy.

**Фаза D завершена** — публичные динамические страницы (BatchPublic + DailyReportPublic) теперь рендерятся через Inertia с SEO-meta в HTML до JS.
