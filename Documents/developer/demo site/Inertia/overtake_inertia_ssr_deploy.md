
## SSR-настройка и деплой

### Что сделано локально (✅ Выполнено)

#### 1. `resources/js/ssr.js`

Создан [resources/js/ssr.js](../../../../resources/js/ssr.js) — точка входа серверного рендера. Зеркало `inertia-app.js`, но с критическими отличиями:

- `createSSRApp` вместо `createApp` (Vue в SSR-режиме).
- `import.meta.glob('./InertiaPages/**/*.vue', { eager: true })` — на сервере все Page-компоненты импортируются синхронно (lazy-import не работает в Node-context первого render).
- `createServer((page) => createInertiaApp({ page, render: renderToString, ... }))` — оборачивает приложение в Node-HTTP сервис, который Inertia запускает на порту 13714.
- `setup` возвращает `app` (без `app.mount(el)` — нет DOM на сервере).
- **НЕ импортируются** `./bootstrap` (он использует `window.axios`), `Vue3Toastify` и его CSS, `task-grain-cooling-toastify.scss`, `vite:preloadError`-listener — всё это клиентское.
- pinia + i18n инициализируются из shared-props точно как в client-bundle.
- siteConfigStore наполняется из `initial.siteConfig` — Header/Footer на сервере получают название и admin-email.

#### 2. `vite.config.mjs`

Обновлён [vite.config.mjs](../../../../vite.config.mjs):

- В `laravel({...})` добавлено `ssr: 'resources/js/ssr.js'` — Vite строит отдельный SSR-bundle через `vite build --ssr`.
- Алиас `vue` исправлен с объектной формы `{ vue: 'vue/dist/vue.esm-bundler.js' }` на массивную с регэкспом `[ { find: /^vue$/, replacement: ... } ]` — иначе SSR-build падал на `import @vue/server-renderer` (общий префикс `vue` ловил весь `@vue/*`).
- `defineConfig` обёрнут в функцию `({ isSsrBuild }) => ({ ... })` — для SSR используется отдельный `rollupOptions.output`: entry без хэша (`'[name].js'`), chunks с обычным хэшем без `buildId`. Inertia ожидает фиксированный путь `bootstrap/ssr/ssr.js`.

#### 3. `package.json` — npm-скрипты

- `build` → теперь делает оба: `vite build && vite build --ssr` (сначала client, потом SSR).
- `build:client` → только client (`vite build`).
- `build:ssr` → только SSR (`vite build --ssr`).

#### 4. `config/inertia.php`

Создан [config/inertia.php](../../../../config/inertia.php) с настройками SSR:

- `enabled` → `env('INERTIA_SSR_ENABLED', false)` — по умолчанию выключен (защита: если SSR-сервис не поднят, Inertia безопасно фоллбэчит на client-render без 500-ошибок).
- `url` → `env('INERTIA_SSR_URL', 'http://127.0.0.1:13714')` — куда стучится Laravel за HTML.
- `bundle` → `bootstrap/ssr/ssr.js` — путь к собранному SSR-bundle.

#### 5. SSR-совместимость: устранение CJS/window-crash

Без этих правок Node-процесс `inertia:start-ssr` падал по очереди на четырёх разных проблемах: `Cannot use import statement outside a module`, `Named export 'Fragment' not found`, `vueuc … CommonJS module`, `ReferenceError: window is not defined`. Перечень изменений, которые потребовались, чтобы SSR-процесс поднимался и принимал `/render`-запросы:

##### 5.1. ESM-режим только для папки SSR-бандла

Создан [bootstrap/ssr/package.json](../../../../bootstrap/ssr/package.json) с одним полем `{"type": "module"}`. Это локальный override Node: только эта папка трактуется как ESM (Vite выводит `ssr.js` в ESM), корневой `package.json` остаётся без `type: module`, чтобы не сломать остальные CJS-инструменты Laravel/Vite.

В [vite.config.mjs](../../../../vite.config.mjs) добавлен плагин `writeSsrPackageJson` — после каждого `vite build --ssr` он восстанавливает этот `package.json` (Vite чистит `bootstrap/ssr/` перед билдом).

##### 5.2. Vue-алиас только для клиентской сборки

Алиас `{ find: /^vue$/, replacement: 'vue/dist/vue.esm-bundler.js' }` в `vite.config.mjs` теперь применяется только если `!isSsrBuild`. На сервере Node резолвит `vue` через стандартные `exports` пакета — иначе ломались named imports (`Fragment`, `useSSRContext` и пр.) из `vue.esm-bundler.js`.

##### 5.3. `ssr.noExternal` — точечный список вместо `true`

В `vite.config.mjs` добавлен блок:

```js
ssr: {
    noExternal: [
        'naive-ui',
        /^vueuc/,
        /^@css-render/,
        'css-render', 'treemate', 'vooks', 'vdirs', 'evtd', 'seemly',
    ],
},
```

Бандлим только naive-экосистему (CJS с named-imports — Node не умеет). Vue, Inertia, vue-i18n, pinia, i18n-iso-countries, libphonenumber-js остаются external — Node сам их грузит. `noExternal: true` не годится: ломал dynamic require у `i18n-iso-countries` (`./langs/{code}.json`) и `libphonenumber-js`.

##### 5.4. naive-ui ушёл из публичного дерева в lazy-чанки

`naive-ui` нельзя статически импортировать в файлы, которые попадают в SSR-бандл: пакет `css-render` (зависимость) выполняет `if (window) { window.__cssrContext = {} }` **на этапе импорта модуля**. На сервере → `ReferenceError`.

Что переписано:

- [resources/js/Layouts/PublicLayout.vue](../../../../resources/js/Layouts/PublicLayout.vue) — убран `<NMessageProvider>` и его импорт. Провайдер не нужен в общем layout: по правилу проекта на публичных страницах используется `vue3-toastify`, а `useMessage` от naive — только в demo-модалках.
- `ConsentOverlay` в `PublicLayout.vue` импортируется через `defineAsyncComponent` (он внутри `<ClientOnly>`, на сервере не рендерится → loader не сработает).
- `useGrainCoolingDemoEntry` в `PublicLayout.vue` импортируется напрямую из файла, минуя barrel `task_grain_cooling/index.js` (barrel реэкспортирует `GlobalTaskReminderToast.vue`, который тащит naive).
- [resources/js/Pages/Demo.vue](../../../../resources/js/Pages/Demo.vue) — `NMessageProvider` и `DemoPage` объявлены через `defineAsyncComponent` и обёрнуты `<ClientOnly>`. Demo-чанк уезжает отдельным файлом (`assets/DemoPage-XXX.js`), на сервере не подгружается.
- [resources/js/Pages/Contact.vue](../../../../resources/js/Pages/Contact.vue) — `NForm/NFormItem/NInput/NButton` через `defineAsyncComponent`; форма обёрнута `<ClientOnly>` (текст вокруг рендерится сервером для SEO, форма «доезжает» после гидрации).
- [resources/js/Pages/BatchPublic.vue](../../../../resources/js/Pages/BatchPublic.vue) и [resources/js/Pages/DailyReportPublic.vue](../../../../resources/js/Pages/DailyReportPublic.vue) — кнопки `<n-button>` (close) заменены на нативные `<button class="btn-client btn-outline-primary">`. Импорт `NButton` удалён.
- [resources/js/features/demo/task_grain_cooling/useGlobalTaskReminder.js](../../../../resources/js/features/demo/task_grain_cooling/useGlobalTaskReminder.js) — `GlobalTaskReminderToast` через `defineAsyncComponent`. Сам reminder срабатывает только клиентским `watch`, поэтому отложенная загрузка ничего не ломает.

##### 5.5. Замена `@vicons/utils` Icon-обёртки

Универсальный [resources/js/components/Icon.vue](../../../../resources/js/components/Icon.vue) импортировал `<Icon as ViconsIcon>` из пакета `@vicons/utils`, который тащит css-render → naive → window crash. `Icon.vue` используется в Header / Footer / всех публичных страницах, поэтому через него naive попадал в основной `ssr.js` независимо от lazy-импортов выше.

Что сделано:

- Убран `import { Icon as ViconsIcon } from "@vicons/utils"`.
- Шаблон переписан на нативный `<span class="xicon">…</span>` (класс `xicon` сохранён — `:deep(.xicon)` уже используется в Header / MetricsSection / StepsSection / show_task для размеров и цвета).
- В [resources/scss/app.scss](../../../../resources/scss/app.scss) добавлен глобальный селектор `.xicon { display:inline-flex; align-items:center; justify-content:center; line-height:0; }` — компенсирует поведение убранного `@vicons/utils` (центровка SVG, отсутствие baseline-gap).
- Прежние usage `<Icon name="..." />` работают без изменений: пропсы `size`/`color` через `Icon` нигде не передаются, всё делает родительский CSS.

##### 5.6. Итог по размеру SSR-бандла

После всех правок:

- `bootstrap/ssr/ssr.js` — **~458 KB** (главный bundle, что Node грузит при старте)
- `bootstrap/ssr/assets/Tabs-XXX.js` — ~803 KB (lazy, naive-ui-подмножество)
- `bootstrap/ssr/assets/DemoPage-XXX.js` — ~338 KB (lazy, Demo-дерево)
- `bootstrap/ssr/assets/_common-XXX.js`, `dark-XXX.js`, `index-XXX.js`, `Switch-XXX.js`, `Space-XXX.js`, `ConsentOverlay-XXX.js`, `GlobalTaskReminderToast-XXX.js` — ленивые чанки для naive-зависимостей и компонентов под `<ClientOnly>`

Лениво подключаемые чанки на сервере **не загружаются** — они нужны только клиенту после гидрации.

##### 5.7. FOUC при SSR — единый CSS-бандл

Сразу после включения SSR на главной (и других страницах) проявился классический FOUC: HTML приходил с правильным контентом и классами, но пока браузер догружал per-page CSS-чанк (`Home-XXX.css`, `PublicLayout-XXX.css`), всё было прижато к левому краю — потом «прыгало» в нормальный layout.

Причина: с дефолтным `cssCodeSplit:true` Vue-плагин Vite выделял `<style scoped>` каждого SFC в отдельный CSS-файл. Эти файлы тянутся **только** после mount Vue (через preload async-чанка Page). На SSR-render это поздно — браузер уже отрисовал HTML без них.

Что сделано:

- В [vite.config.mjs](../../../../vite.config.mjs) для клиентского билда выставлено `build.cssCodeSplit: false`. Весь CSS (глобальный `app.scss` + scoped-стили всех 9 Pages + общих компонентов) сливается в **один** файл `assets/style-XXX.css` (~163 KB raw / ~30 KB gzip).
- `app.scss` убран из массива `input` Laravel-плагина и **импортируется из** `resources/js/inertia-app.js` и `resources/js/technical.js` (`import "../scss/app.scss"`). Иначе с `cssCodeSplit:false` Vite терял отдельную manifest-запись `resources/scss/app.scss`, и `@vite('resources/scss/app.scss')` падало бы 404.
- Добавлен Vite-плагин `linkCssToJsEntries` в `vite.config.mjs` — после prod-сборки он вписывает `"css": ["assets/style-XXX.css"]` во все JS-entry в `manifest.json`. Без этого Laravel-Vite-плагин (`@vite('resources/js/inertia-app.js')`) не выдавал `<link rel="stylesheet">` в `<head>`, потому что с `cssCodeSplit:false` Vite регистрирует CSS как отдельную запись манифеста, не привязанную к JS-чанку. Плагин универсальный: работает в `apply: 'build'`, пропускает SSR-папку, идемпотентен.
- В обоих blade-шаблонах ([resources/views/inertia.blade.php](../../../../resources/views/inertia.blade.php) и [resources/views/technical/index.blade.php](../../../../resources/views/technical/index.blade.php)) убран `'resources/scss/app.scss'` из массива `@vite([...])` — теперь подключается через JS-entry автоматически (Laravel-Vite читает поле `css` из manifest и выдаёт `<link>` синхронно перед `<script>`).

Цена: первая загрузка тащит весь CSS (~30 KB gzip) включая стили страниц, на которые пользователь ещё не зашёл. Между страницами — ноль оверхеда (cache + один файл). FOUC исчезает полностью: на SSR-странице `<head>` сразу содержит `<link rel="stylesheet" href="style-XXX.css">`, браузер ждёт загрузки этого файла перед отрисовкой body — стили на месте до первого пикселя контента.

В dev-режиме (`npm run dev`) изменения работают прозрачно: Vite не использует `cssCodeSplit` (CSS обрабатывается через JS-импорты + HMR), `linkCssToJsEntries` не активируется (`apply: 'build'`), Laravel-Vite-плагин видит JS-entry и hot-инжектит `app.scss` через JS-импорт.

##### 5.8. Что осталось вне SSR-рендеринга

Часть UI рендерится только после клиентской гидрации (внутри `<ClientOnly>`). Это допустимо для SEO (Googlebot индексирует текст вокруг), но даёт небольшой «pop-in» при загрузке:

- `<ConsentOverlay>` — модалка cookie-consent
- `<GrainCoolingNotificationBanner>` (был и до этих правок)
- Demo-страница целиком (была и до правок — `/demo/*` не индексируется)
- Contact-форма (текст-интро, заголовок, trust-карточки рендерятся сервером; сама форма — после гидрации)

Если в будущем понадобится server-render Contact-формы — нужен «not-ESM-only» вариант naive-ui (или замена на нативную форму). Пока для SEO приоритет — текст и meta, не интерактивные элементы.

### Где складывается build

После `npm run build`:

- `public/build/manifest.json` + `public/build/assets/*` — client-bundle (загружается браузером).
- `bootstrap/ssr/ssr.js` + `bootstrap/ssr/ssr-manifest.json` + `bootstrap/ssr/assets/*` — SSR-bundle (запускается через Node).

### Кэширование

Inertia сам не кэширует. Поверх — Cloudflare Edge Cache для GET-страниц (правила в админке Cloudflare). Для динамических BatchPublic / DailyReportPublic кешировать по batchId/date с TTL 1 час. Страницы с user-state (Survey-PIN-flow) — `Cache-Control: private, no-store`.

### Как проверить локально

```bash
npm run build              # собирает оба bundle (~50 секунд + 4 секунды SSR)
ls bootstrap/ssr/ssr.js    # должен существовать без хэша в имени
npm run build:ssr          # пересобрать только SSR
```

### Локальный запуск SSR (через PHP-сервер)

После build, в `.env` поставить `INERTIA_SSR_ENABLED=true`, в одном терминале:

```bash
php artisan inertia:start-ssr
```

В другом — `php artisan serve`. Открыть `/en` в браузере с отключенным JS — должен быть полный HTML.

---
---
---
---
---

## Серверный пункт 0 — что нужно сделать на VPS (ОБЯЗАТЕЛЬНО для SSR)

> ⏳ **Целиком отложено** до выполнения вручную на VPS → см. `overtake_inertia.md` → "Проверка отложенного" → **раздел B (на сервере)**. Минимум: Node.js + одна строка в `.env` + один systemd-юнит + одна строка в `deploy.sh`. Без supervisor.

Этот пункт описывает **только серверные** действия — всё что выполняется через SSH на `178.104.193.233` плюс правки `deploy.sh` и `.env`.

### 0.1. Установить Node.js 20 на сервер

SSR-сервис — это Node-процесс, который запускается параллельно PHP-FPM. На VPS нужен Node ≥ 18 (рекомендую 20 LTS).

```bash
# на сервере под root или через sudo:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# проверка:
node --version    # должно быть v20.x
npm --version     # должно быть 10.x
```

### 0.2. Дополнить `/var/www/demo.haccpilot.eu/shared/.env`

```bash
nano /var/www/demo.haccpilot.eu/shared/.env
```

Добавить (или отредактировать):

```env
INERTIA_SSR_ENABLED=true
INERTIA_SSR_URL=http://127.0.0.1:13714
```

`13714` — стандартный порт Inertia SSR. Если там уже что-то слушает — поменяйте на свободный (например `13800`) и пропишите тот же порт в supervisord-конфиге ниже.

### 0.3. Обновить `deploy.sh` на сервере

Текущий `deploy.sh` собирает client-bundle и кладёт его в `shared/public/build`. Для SSR нужно дополнительно:

1. Передать в release **скомпилированный** SSR-bundle `bootstrap/ssr/`. Архив `release.tar.gz` собирается в GitHub Actions — нужно убедиться что `bootstrap/ssr/` попадает туда (см. п. 0.4 ниже).
2. После переключения `current` symlink — рестартануть SSR-сервис чтобы он загрузил новый bundle.

В `deploy.sh` после блока `# 8. SWITCH RELEASE` добавить:

```bash
# -------------------------------------------------
# 8.1 RESTART INERTIA SSR (после смены current)
# -------------------------------------------------
if command -v supervisorctl >/dev/null 2>&1; then
    sudo -n supervisorctl restart inertia-ssr || true
fi
```

`sudo -n` — non-interactive. Нужно дать deploy-юзеру право рестартовать только этот сервис без пароля:

```bash
# на сервере под root:
sudo visudo -f /etc/sudoers.d/deploy-inertia-ssr
```

Содержимое:

```
deploy ALL=(ALL) NOPASSWD: /usr/bin/supervisorctl restart inertia-ssr
```

### 0.4. Дополнить GitHub Actions workflow

В `.github/workflows/deploy.yml`, шаг `Build frontend` сейчас делает только `npm run build`. После моих локальных правок `build` уже выполняет оба билда (`vite build && vite build --ssr`) — менять воркфлоу не надо.

Но **`bootstrap/ssr/`** должен попасть в release-архив. Текущий `Prepare release folder`:

```yaml
rsync -av --exclude=node_modules --exclude=.git --exclude=tests --exclude=.env ./ release/
cp -r vendor release/
```

`bootstrap/` копируется как есть → включает и `bootstrap/ssr/`. **Менять ничего не нужно**, просто убедиться что после первого CI-пайплайна `bootstrap/ssr/ssr.js` появился в `release.tar.gz`. Можно проверить локально:

```bash
tar -tzf release.tar.gz | grep ssr
```

### 0.5. Установить supervisord и завести `inertia-ssr` сервис

```bash
sudo apt-get install -y supervisor
sudo nano /etc/supervisor/conf.d/inertia-ssr.conf
```

Содержимое:

```ini
[program:inertia-ssr]
process_name=%(program_name)s
command=/usr/bin/php /var/www/demo.haccpilot.eu/current/artisan inertia:start-ssr
directory=/var/www/demo.haccpilot.eu/current
autostart=true
autorestart=true
user=deploy
redirect_stderr=true
stdout_logfile=/var/log/inertia-ssr.log
stopwaitsecs=10
```

Применить:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start inertia-ssr
sudo supervisorctl status inertia-ssr   # должен быть RUNNING
```

### 0.6. Открыть SSR-порт **только локально**

Inertia SSR слушает `127.0.0.1:13714` (по умолчанию) — это localhost-only, наружу не торчит, файрвол менять не нужно. Проверить:

```bash
ss -tlnp | grep 13714
# tcp LISTEN 0 511 127.0.0.1:13714 ...
```

### 0.7. Проверить работу SSR end-to-end

После деплоя:

```bash
# 1. SSR-процесс жив:
sudo supervisorctl status inertia-ssr

# 2. Curl главной страницы — должен прийти полный HTML с meta-тегами в <head>:
curl -s https://demo.haccpilot.eu/en | grep -E "<title>|<meta name=\"description\""

# 3. Лог SSR — никаких ошибок:
sudo tail -f /var/log/inertia-ssr.log
```

### 0.8. Cloudflare cache invalidation

После каждого нового деплоя (и сразу после первого включения SSR):

1. https://dash.cloudflare.com → demo.haccpilot.eu → Caching → Configuration → **Purge everything**.
2. На сервере:

```bash
php artisan optimize:clear
rm -f bootstrap/cache/*.php
sudo systemctl restart php8.2-fpm
sudo systemctl reload nginx
sudo supervisorctl restart inertia-ssr
```

### 0.9. Откат SSR (если что-то пошло не так)

В `/var/www/demo.haccpilot.eu/shared/.env` поставить `INERTIA_SSR_ENABLED=false` и перезапустить PHP-FPM:

```bash
sudo systemctl restart php8.2-fpm
```

Сайт мгновенно вернётся к client-only рендеру (без падений 500). SSR-процесс можно при этом остановить:

```bash
sudo supervisorctl stop inertia-ssr
```

После этого спокойно разбираться что сломалось в SSR-bundle, не страдая от downtime.

---

### Финальный чек-лист серверного пункта 0

- [ ] Node.js 20 установлен (`node --version` показывает v20.x)
- [ ] `INERTIA_SSR_ENABLED=true` и `INERTIA_SSR_URL=http://127.0.0.1:13714` в `/var/www/demo.haccpilot.eu/shared/.env`
- [ ] `supervisor` установлен, файл `/etc/supervisor/conf.d/inertia-ssr.conf` создан
- [ ] Sudoers-правило для deploy-юзера заведено
- [ ] `deploy.sh` дополнен `supervisorctl restart inertia-ssr`
- [ ] `bootstrap/ssr/ssr.js` появляется в release.tar.gz
- [ ] `supervisorctl status inertia-ssr` показывает RUNNING
- [ ] `curl https://demo.haccpilot.eu/en | grep "<title>"` возвращает реальный HTML с title
- [ ] Cloudflare Purge выполнен после первого деплоя
