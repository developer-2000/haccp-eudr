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

1. **Параллельная миграция.** Inertia подключается рядом с существующим SPA: новый blade `inertia.blade.php`, новый JS-entry `inertia-app.js`, новые папки `InertiaPages/` и `Layouts/`. Старый `app.blade.php`, `app.js`, `pages/client/`, `router.js` остаются нетронутыми, пока все 9 страниц не мигрированы. На любом шаге сайт остаётся рабочим.
2. Backend Laravel меняется минимально: установка пакета, регистрация одного middleware, постраничное переключение роутов с `view('index-client')` на `Inertia::render(...)`. Контроллеры, сервисы, lang/, Eloquent, SetLocale, VerifyCsrfToken — не трогаем.
3. Все данные для страницы (`seo`, `locale`, `siteConfig`, `translations`) приходят как **Inertia shared-props** с сервера.
4. `apiAxios` остаётся для асинхронных POST'ов (Contact-submit, Survey-submit, Survey-verify).
5. `window.locale` / `window.translations` / `window.appName` уходят из `inertia-app.js` (но временно остаются в старом `app.js` для не-мигрированных страниц).
6. `Vue Router` остаётся в `app.js` до конца миграции. В Inertia-страницах используем `<Link>` и `usePage()`.
7. `vue-i18n` остаётся; в `inertia-app.js` инициализируется из shared-props, в старом `app.js` — из `window.translations` (как сейчас).
8. Навигация на время миграции: на мигрированных страницах в Header/Footer используем `<a href>` (full reload) для ссылок на не-мигрированные URL — иначе Inertia упадёт ожидая JSON-ответа от старого роута. Когда все мигрированы — заменяем на `<Link>`.

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
D:\ystanovki\OSPanel_6.4.5\home\haccp-eudr\Documents\developer\demo site\Inertia\overtake_inertia_0.md
---
## Постраничный план
D:\ystanovki\OSPanel_6.4.5\home\haccp-eudr\Documents\developer\demo site\Inertia\overtake_inertia_pages.md
---
## Layout, общие компоненты, глобальные эффекты
D:\ystanovki\OSPanel_6.4.5\home\haccp-eudr\Documents\developer\demo site\Inertia\overtake_inertia_layout.md
---
## SSR-настройка и деплой
D:\ystanovki\OSPanel_6.4.5\home\haccp-eudr\Documents\developer\demo site\Inertia\overtake_inertia_ssr_deploy.md
---
## Завершающие доработки
D:\ystanovki\OSPanel_6.4.5\home\haccp-eudr\Documents\developer\demo site\Inertia\overtake_inertia_finish.md
---
## Работа на сервере
D:\ystanovki\OSPanel_6.4.5\home\haccp-eudr\Documents\developer\demo site\Inertia\overtake_inertia_server.md
---

## Как проверить проект локально и какие команды запускать - полный список необходимых действий!

Локально доступны **оба режима**: быстрый dev (client-only, HMR) и прод-симуляция (с реальным SSR). Ниже — что запускать, в каком порядке и как убедиться, что всё работает.

### Предусловия (один раз)

Поставить зависимости PHP и Node, если ещё не стояли:

```bash
composer install
npm install
```

Должны быть установлены и доступны в PATH:

- PHP ≥ 8.2 + Laravel-окружение (OSPanel или `php artisan serve`)
- Node.js 20.x (нужен для SSR-сервиса)
- npm

Проверить версии:

```bash
php -v
node -v
npm -v
```

Файл `.env` должен существовать (скопировать из `.env.example`, если его нет), `APP_KEY` — сгенерирован (`php artisan key:generate`).

---

### Режим A. Dev (client-only, с HMR) — для повседневной разработки

**Когда использовать:** правишь Vue/JS/SCSS, нужен мгновенный HMR, SEO в этот момент не интересует.
**Важно:** в этом режиме SEO-meta `<title>` / `<meta description>` появляется **после** выполнения JS — это нормально для dev. 
Для проверки прод-поведения используй Режим B.

**1. В `.env` выставить:**

```env
INERTIA_SSR_ENABLED=false
```

**2. Сбросить кэш конфига:**

```bash
php artisan config:clear
```

**3. Запустить Vite dev-server (терминал 1):**

```bash
npm run dev
```

— поднимает Vite на порту `5179` (HMR через `192.168.101.11:5179` — настроено в [vite.config.mjs](../../../../vite.config.mjs)). 
Подхватывает оба entry автоматически: `inertia-app.js` (публичные страницы через Inertia) и `technical.js` (`/technical/*` blade-страницы).

**5. Открыть в браузере:**

- `http://haccpilot.local`

---

### Режим B. Локальный SSR (прод-симуляция) — для проверки SEO

**Когда использовать:** проверяешь, что Googlebot получает полный HTML до JS, дебажишь SSR-проблемы, тестируешь meta-теги/canonical/hreflang.

**1. В `.env` выставить:**

```env
INERTIA_SSR_ENABLED=true
```

`INERTIA_SSR_URL=http://127.0.0.1:13714` [config/inertia.php](../../../../config/inertia.php).

**2. Сбросить кэш конфига:**

```bash
php artisan config:clear
```

**3. Собрать оба бандла (терминал 1):**

```bash
npm run build
```

— делает подряд:
1. `vite build` → client-bundle в `public/build/` (manifest + assets, на которые ссылается `@vite` в [inertia.blade.php](../../../../resources/views/inertia.blade.php))
2. `vite build --ssr` → SSR-bundle в `bootstrap/ssr/ssr.js`

Раздельные команды, если нужны:

```bash
npm run build:client     # только client
npm run build:ssr        # только SSR
```

**4. Запустить Node SSR-сервис (терминал 2):**

```bash
php artisan inertia:start-ssr
```

**6. Проверки SSR (главное):**

a) **`view-source:` в браузере** — открыть `view-source:http://haccpilot.local/en`. 
В исходнике должен быть **полный HTML** с `<title>`, `<meta name="description">`, `<link rel="canonical">`, `hreflang`-тегами и текстом страницы. 
**Не должно быть** пустого `<div id="app" data-page="{...}">` без контента.

b) **`curl` без JS** — для каждой ключевой страницы:

```bash
curl -s http://haccpilot.local/en | grep -E "<title>|<meta name=\"description\"|<link rel=\"canonical\""
curl -s http://haccpilot.local/en/about | grep -E "<title>|<meta name=\"description\""
curl -s http://haccpilot.local/en/how-it-works | grep -E "<title>|<meta name=\"description\""
curl -s http://haccpilot.local/en/privacy-policy | grep -E "<title>|<meta name=\"description\""
curl -s http://haccpilot.local/en/contact | grep -E "<title>|<meta name=\"description\""
curl -s http://haccpilot.local/en/survey | grep -E "<title>|<meta name=\"description\""
```

В каждом ответе должны быть title и description, локализованные под `/en`.

c) **DevTools "Disable JavaScript"** — в Chrome открыть DevTools → Command Palette → `Disable JavaScript`, перезагрузить страницу. Контент должен остаться видимым (это симуляция Googlebot). Меню/формы работать не будут — это нормально, JS отключён.

d) **Hreflang проверка** — в `view-source:` любой публичной страницы должны быть `<link rel="alternate" hreflang="..." href="...">` для каждой из 25 локалей.

**Важно про режим B:**

- После каждой правки `.vue`/`.scss` нужно пересобирать (`npm run build`) — HMR в SSR-режиме не работает.
- Если правишь только client-код — достаточно `npm run build:client`.
- Если правишь компоненты, которые рендерятся на сервере — нужно `npm run build:ssr` (или полный `npm run build`).
- SSR-сервис **не перезапускается автоматически** при пересборке. После `npm run build:ssr` — Ctrl+C на `inertia:start-ssr` и запустить заново.
- Если SSR-процесс упал/недоступен — Inertia сам фоллбэчит на client-render без 500. Это страховка, но в этот момент ты тестируешь не SSR.

---

### Регрессионные проверки (после миграции любой страницы)

Прогнать в обоих режимах:

1. Все 9 публичных страниц открываются (Home, About, HowWorks, PrivacyPolicy, Contact, Survey, Demo, BatchPublic, DailyReportPublic)
2. Переключатель языков работает на каждой странице (URL и контент меняются)
3. `<Link>` навигация — без полного reload
4. Contact-форма отправляется, toast показывается
5. Survey: submit → PIN → верификация
6. BatchPublic / DailyReportPublic — данные приходят с сервера + `window.print()` работает
7. Demo (`/{locale}/demo/*`) — все секции функционируют, grain-cooling баннер появляется
8. 419-handler в `apiAxios` + `sessionGuard` срабатывает при истёкшей сессии
9. Console — без ошибок и warnings

---

### Откат на client-only одной командой

Если что-то сломалось в SSR и нужно срочно вернуться к client-render:

```bash
# в .env: INERTIA_SSR_ENABLED=false
php artisan config:clear
```

— Inertia сразу перестанет ходить в SSR-сервис, страницы будут рендериться на клиенте как в Режиме A. Node-процесс можно не убивать, он просто перестанет получать запросы.

---

### Утилиты

```bash
npm run lint           # ESLint проверка
npm run lint:fix       # ESLint + Prettier auto-fix
npm run format         # только Prettier
npm run lint:format    # lint:fix + format подряд
```

---

### Шпаргалка: с какого режима начать

- **Просто посмотреть, что сайт работает после миграции** → Режим A (один `npm run dev` + браузер).
- **Проверить, что Google увидит контент** → Режим B (полный билд + SSR-сервис + `view-source:` или `curl`).
- **Дебажить SSR-ошибку (typeof window, naive-ui, ClientOnly)** → Режим B + смотреть логи в терминале с `inertia:start-ssr`.

---

## Откат

В варианте B откат тривиален на любом этапе, потому что старая SPA-инфраструктура физически остаётся в проекте до самого конца.

### Откат одной страницы

В `routes/web.php` поменять `Inertia::render('PageName', ...)` обратно на `view('index-client')`. Coммит-revert + деплой. Vue Router внутри `app.js` снова обработает URL по-старому. Время отката — 1 минута.

### Откат всей миграции (на любом шаге)

1. Удалить или закомментировать в `vite.config.mjs` второй entry `inertia-app.js`.
2. Снять регистрацию `HandleInertiaRequests` в `app/Http/Kernel.php`.
3. Откатить все `Inertia::render(...)` обратно на `view('index-client')` в `routes/web.php`.
4. Старые файлы `app.js`, `app.blade.php`, `pages/client/`, `router.js`, `Index.vue`, `useSiteConfigStore` — нетронуты, продолжают работать.
5. `composer remove inertiajs/inertia-laravel` и `npm uninstall @inertiajs/vue3 @vue/server-renderer` — опционально (можно оставить пакеты, они не активны без middleware).

### Финальная очистка legacy (выполнять только после полной миграции и недели стабильной работы)

После того как все 9 страниц мигрированы и сайт стабильно работает:

- Удалить `resources/js/app.js` (legacy entry)
- Удалить `resources/views/layouts/app.blade.php`, `resources/views/index-client.blade.php`
- Удалить `resources/js/router.js`
- Удалить `resources/js/basic/Index.vue`
- Удалить `resources/js/pages/client/`
- Удалить `resources/js/composables/usePageSeo.js`
- Удалить `resources/js/stores/site_config.js` (если другой `useSiteConfigStore` нигде не используется)
- В `vite.config.mjs` оставить только `inertia-app.js` entry
- В Header/Footer заменить `<a href>` на `<Link>` от `@inertiajs/vue3` — вернуть SPA-навигацию
- Переименовать `resources/js/InertiaPages/` → `resources/js/Pages/` (после удаления legacy `pages/` коллизии больше нет — приводим к идиоматичному имени из Inertia-документации). Не забыть обновить glob в `inertia-app.js`.

После этого шага возврат на legacy уже нетривиален; этот шаг должен быть отдельным PR'ом и пройти полный регресс перед мерджем.

---

## Финальный чек-лист

### После завершения Шага 0

- [ ] Inertia-пакет установлен на бэке и фронте
- [ ] `HandleInertiaRequests` зарегистрирован, отдаёт shared-props (locale, siteConfig, translations, availableLocales, localeCountries, localeHreflangMap, flash)
- [ ] `resources/views/inertia.blade.php` создан с `@inertia` и `@inertiaHead`
- [ ] `resources/js/inertia-app.js` создан и не импортирует Vue Router
- [ ] `vite.config.mjs` имеет два entry; `npm run build` собирает оба
- [ ] `Layouts/PublicLayout.vue` и `components/ClientOnly.vue` готовы
- [ ] `SeoMetaResolver::resolveAsArray()` реализован
- [ ] Header/Footer ссылки на нативные `<a href>`
- [ ] Сайт работает как раньше — никаких визуальных регрессий

### После всех 9 страниц (фазы B–E)

- [ ] Каждая из 9 страниц мигрирована и открывается через Inertia
- [ ] SEO-meta присутствует в HTML без JS (curl-проверка по 7 публичным URL'ам)
- [ ] Все формы (Contact, Survey-submit, Survey-verify) работают
- [ ] Hreflang валиден для всех 25 локалей × 7 страниц
- [ ] Sitemap.xml актуален
- [ ] CSRF и sessions работают как раньше
- [ ] 419-handler в apiAxios + sessionGuard продолжают работать
- [ ] grain-cooling demo функционален на `/demo` и любых `/{locale}/*` страницах

### После SSR (фаза F)

- [ ] SSR-сервер запускается без ошибок и warnings
- [ ] `view-source:` каждой страницы содержит полный HTML (а не пустой root-div)
- [ ] PageSpeed показывает LCP < 2.5s, FCP < 1.5s на 4 ключевых страницах
- [ ] supervisord/systemd конфигурация для inertia-ssr задеплоена

### Финальная очистка legacy

- [ ] Vue Router нигде не импортируется (`grep -rn "vue-router" resources/js`)
- [ ] `window.locale`, `window.translations`, `window.appName`, `window.adminEmail` нигде не используются
- [ ] `useSiteConfigStore` удалён
- [ ] Старый `app.js`, `app.blade.php`, `index-client.blade.php`, `pages/client/`, `router.js`, `basic/Index.vue` удалены
- [ ] `usePageSeo.js` удалён (заменён на `<Head>`)
- [ ] Header/Footer переведены с `<a href>` на `<Link>` Inertia
- [ ] `naive-ui` глобально не подключён (это уже сделано)

---

## Ожидаемая выгода

- Полный HTML на первом byte вместо пустого `<div id="app">`
- Title / description / canonical / hreflang **в HTML до выполнения JS** — главное для SEO
- LCP / FCP сокращаются на 40–60% (контент не ждёт ни app.js, ни i18n, ни роутера, ни API-fetch)
- Survey-страница теперь **индексируется с вопросами** в HTML
- BatchPublic / DailyReportPublic индексируются с продуктами и компаниями
- Сохранение всей backend-инфраструктуры — никакого технического долга от ALL-NEW Nuxt/headless разделения
