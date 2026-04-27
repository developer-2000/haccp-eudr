
## Завершающие доработки

Принцип: **локально проект должен работать без костылей и legacy-двойников**. Если что-то работает только потому, что параллельно крутится legacy-bundle — это костыль. Уберём.

### A. Доделать локально (один большой PR — финальная очистка legacy)

Цель: сайт работает только через Inertia, без второго bundle, без window-мостов, без двух одинаковых страниц в `pages/client/` и `InertiaPages/`.
Шаги взаимозависимы — делаются все вместе одним PR'ом.

#### A.1. Удалить legacy SPA-инфраструктуру **✅ Выполнено**

Файлы и каталоги к удалению:

- `resources/js/app.js`
- `resources/js/router.js`
- `resources/js/basic/Index.vue`
- `resources/js/pages/client/` (вся папка с 9 страницами)
- `resources/js/components/App.vue`
- `resources/js/composables/usePageSeo.js` (заменён на `<SeoHead>`)
- `resources/views/layouts/app.blade.php`
- `resources/views/index-client.blade.php`

В `vite.config.mjs` оставить только `inertia-app.js` (плюс `app.scss`, `technical.js`, `ssr.js`).

**Что сделано:**

- Удалены 8 файлов/директорий + опустевшие папки `resources/js/basic/`, `resources/js/pages/client/`, `resources/views/layouts/`.
- В `vite.config.mjs` — убрана строка `'resources/js/app.js'` из массива `input`. Остались `app.scss`, `inertia-app.js`, `technical.js` плюс `ssr: 'resources/js/ssr.js'`.
- В `resources/js/features/demo/page/DemoPage.vue` удалены `import { usePageSeo } from "@/composables/usePageSeo";` и блок `const demoSeoKey = computed(...) + usePageSeo(...)` — иначе сборка упала бы на сломанном импорте. Demo временно теряет client-side SEO-meta до A.7.
- В `resources/js/features/demo/task_grain_cooling/grainCoolingNavigateToDemoChecklists.js` заменён `import router from "@/router"` + `router.push(...)` на `window.location.href` с резолвом локали из `window.location.pathname`. Файл достижим из `PublicLayout.vue` через `GrainCoolingNotificationBanner` — без правки vite-build падал бы на ненайденном `@/router`.
- В `routes/web.php` — **не трогалось** (это A.6 для `/` и A.7 для catchall). После A.1 локально не работают: корневой `/` (видит удалённый `view('index-client')`) и `/{locale}/demo/*` (catchall тоже на `view('index-client')`). Это ожидаемое переходное состояние до A.6 + A.7 (план явно объявляет A.1-A.9 одним PR'ом).
- В `inertia-app.js` window-bridge (`window.appName`, `window.adminEmail`, …) **не удалён** — это A.3.

**Как проверить:**

1. Сборка проходит без ошибок: `npm run build` (или раздельно `npm run build:client` + `npm run build:ssr`). Должен быть `✓ built in ...` без `Error` / `Cannot resolve ...`.
2. Удалённых файлов больше нет на диске:
   ```bash
   ls resources/js/app.js resources/js/router.js resources/js/components/App.vue \
      resources/js/composables/usePageSeo.js resources/views/index-client.blade.php \
      resources/views/layouts/app.blade.php 2>&1 | grep "No such"
   ```
   — должны быть 6 строк `No such file or directory`.
3. Папки `resources/js/basic/` и `resources/js/pages/client/` отсутствуют (`ls` возвращает «not found»).
4. `grep -rn "from [\"']@/router\|from [\"']@/components/App\|usePageSeo" resources/js/` — должно быть пусто.
5. На мигрированных Inertia-URL'ах сайт работает как и раньше: `/en`, `/en/about`, `/en/how-it-works`, `/en/privacy-policy`, `/en/contact`, `/en/survey`, `/batch/{id}`, `/report/{date}` — открываются без 500, без console-ошибок.
6. Известное переходное состояние (НЕ ошибка A.1 — это для A.6/A.7): `GET /` и `GET /{locale}/demo/*` сейчас 500-ят с `View [index-client] not found`. Будет починено в A.6 (корневой redirect) + A.7 (Demo-решение).

#### A.2. Header / Footer / Consent / NavMenuItem / DropdownMenu — на `<Link>` Inertia **✅ Выполнено**

Сейчас они используют `<a :href>` для совместимости legacy + Inertia. После удаления legacy менять `<a :href>` на `<Link :href>` от `@inertiajs/vue3` — вернётся SPA-навигация без перезагрузки.

**Что сделано:**

- В 5 компонентах добавлен `import { Link } from "@inertiajs/vue3";` и навигационные `<a :href>` заменены на `<Link :href>`:
    - [resources/js/components/client/header/Header.vue](../../../../resources/js/components/client/header/Header.vue) — логотип (`safeLogo.link`).
    - [resources/js/components/client/header/NavMenuItem.vue](../../../../resources/js/components/client/header/NavMenuItem.vue) — 3 ссылки (desktop с/без dropdown, mobile simple).
    - [resources/js/components/client/header/DropdownMenu.vue](../../../../resources/js/components/client/header/DropdownMenu.vue) — все 6 вариантов dropdown-ссылок (desktop+mobile × column-headers/simple-array). Сейчас не рендерятся (`navConfig.menu` без `dropdown`), но заменены на будущее.
    - [resources/js/components/client/footer/Footer.vue](../../../../resources/js/components/client/footer/Footer.vue) — privacy/contact в `.footer-nav`.
    - [resources/js/components/client/consent/ConsentOverlay.vue](../../../../resources/js/components/client/consent/ConsentOverlay.vue) — privacy-link в чекбоксе (с сохранённым `rel="nofollow"`).
- **Намеренно НЕ менялось** на `<Link>`:
    - `Footer.vue` → `seoLocaleLinks` (line 19-26): кросс-локальные ссылки (`/de/about` с `/en/about`). При `<Link>` Inertia делает XHR без full reload, и клиентский `i18n` останется на старой локали (translations подменяются только в `setup()` `inertia-app.js` при первой загрузке) → пользователь увидит контент сервера на новой локали со словарём старой. `<a href>` гарантирует full reload + повторную инициализацию i18n. Эти ссылки скрыты от пользователей (`clip:rect(0,0,0,0)`) и нужны только Googlebot'у — `<a>`-тег для бота полностью эквивалентен.
    - `Header.vue` → `setLocale()` (POST `/locale` + `window.location.href = url`) и `goToSurvey()` (`window.location.href`) — это императивная навигация, не ссылка. `setLocale` обязан делать full reload по той же причине (смена локали).

**Как проверить:**

1. `npm run build:client` проходит без ошибок (✓ built — Inertia-импорт `Link` найден).
2. `grep -nE "<a [^/>]*:href" resources/js/components/client/` — должны остаться только SEO-locale-links в Footer (одно вхождение в `<a v-for="link in seoLocaleLinks" :href="link.href" ...>`).
3. На любой Inertia-странице (например `/en/about`) клик в Header по «How it works» — URL меняется без полного reload (вкладка не перерисовывается), в DevTools Network видно XHR-запрос с `X-Inertia: true` вместо обычного document-reload.
4. Клик по logo, footer-privacy, footer-contact, consent-privacy — то же поведение (SPA).
5. Скрытые SEO-ссылки в `<nav class="footer-seo-locales">` — остались `<a href>` (DevTools → Elements → искать `clip:rect`).

#### A.3. Удалить `useSiteConfigStore` и window-мост **✅ Выполнено**

В `Header.vue` и `Footer.vue` заменить `useSiteConfigStore()` на `usePage().props.siteConfig` (через computed).

В `inertia-app.js` удалить блок:

```js
window.availableLocales = ...; window.localeCountries = ...; window.localeHreflangMap = ...;
window.locale = ...; window.appName = ...; window.adminEmail = ...;
```

И блок инициализации store:

```js
siteConfigStore.name = ...; siteConfigStore.adminEmail = ...; siteConfigStore.loaded = true;
```

Удалить файл `resources/js/stores/site_config.js` и его экспорт из `resources/js/stores/index.js`.

`grep -rn "useSiteConfigStore\|window.appName\|window.adminEmail" resources/js/` — должно быть пусто.

**Что сделано:**

- **Прокидывание `switcherLocales` через shared-props.** В Inertia из `data-languages`-атрибута `<#app>` (legacy) прибыть не может — этот атрибут жил в удалённом `app.blade.php`. Чтобы Header/Footer получили список из 2 переключаемых языков (main + browser-detect), `SetLocale` middleware теперь дополнительно кладёт массив `$languagesForFrontend` в `$request->attributes`, а `HandleInertiaRequests::share()` достаёт его и отдаёт фронту как `switcherLocales`. Логика формирования двух языков не дублируется — она остаётся внутри `SetLocale`.
    - [app/Http/Middleware/SetLocale.php](../../../../app/Http/Middleware/SetLocale.php) — добавлено `$request->attributes->set('languagesForFrontend', $languagesForFrontend);` после `View::share`.
    - [app/Http/Middleware/HandleInertiaRequests.php](../../../../app/Http/Middleware/HandleInertiaRequests.php) — в массив `share()` добавлен ключ `'switcherLocales' => $request->attributes->get('languagesForFrontend', []),`.
- **[Header.vue](../../../../resources/js/components/client/header/Header.vue)** — удалён `useSiteConfigStore`-импорт, добавлен `usePage`. `siteConfig` стал `computed(() => page.props.siteConfig || { name, adminEmail })`. `languagesList` стал `computed(() => page.props.switcherLocales || [])` (раньше парсил `data-languages` через legacy DOM-атрибут и fallback в `window.localeCountries`). В `setLocale()` `window.availableLocales` заменено на `page.props.availableLocales`. Удалена функция `getLanguagesList()` и константа `defaultLanguages` — теперь источник один (props). Импорты Vue вынесены в шапку `<script setup>` (раньше были в середине).
- **[Footer.vue](../../../../resources/js/components/client/footer/Footer.vue)** — удалён `useSiteConfigStore`. `siteConfig` через `computed(() => page.props.siteConfig)`. `seoLocaleLinks` использует `page.props.availableLocales`/`localeCountries`/`switcherLocales` вместо `window.*` и `data-languages`. Удалена локальная функция `getSwitcherCodes()`.
- **[ConsentOverlay.vue](../../../../resources/js/components/client/consent/ConsentOverlay.vue)** — `appName` стал `computed(() => page.props.siteConfig?.name || "")` вместо чтения `window.appName`. В template ничего не меняется (Vue auto-unwrap для top-level refs/computed).
- **[inertia-app.js](../../../../resources/js/inertia-app.js)** — удалён импорт `useSiteConfigStore`, блок инициализации store (`siteConfigStore.name = ...`) и весь window-мост (`window.availableLocales = ...; ... window.adminEmail = ...;`). Все эти данные теперь живут только в `page.props`.
- **[ssr.js](../../../../resources/js/ssr.js)** — те же удаления (импорт + init store): SSR-bundle тоже не зависит от Pinia-`siteConfigStore`.
- **[resources/js/stores/site_config.js](resources/js/stores/site_config.js)** — удалён.
- **[resources/js/stores/index.js](../../../../resources/js/stores/index.js)** — удалён `export { useSiteConfigStore } from "./site_config";`. Экспорты Demo-store не тронуты.
- **Подчистка побочных `window.appName`-зависимостей**, чтобы `grep` стал чистым:
    - [resources/js/config/nav.js](../../../../resources/js/config/nav.js) — удалён getter `text()`, который читал `window.appName`. Никем не используется (мёртвый код после миграции Header на `siteConfig.name`).
    - [resources/js/features/demo/data/eudrBatchPublic.js](../../../../resources/js/features/demo/data/eudrBatchPublic.js) — fallback `https://${window.appName || "app"}.eu` (origin когда `window.location` недоступен) заменён на статичный `"https://haccpilot.eu"`.
    - [resources/js/features/demo/data/dailyReportPublic.js](../../../../resources/js/features/demo/data/dailyReportPublic.js) — тот же origin-fallback + `documentRef: HACCPilot-DAILY-${safe}-DEMO` (раньше брало имя из `window.appName`). В demo-данных бренд хардкодится — он не настраивается per-tenant.
    - [resources/js/InertiaPages/PrivacyPolicy.vue](resources/js/InertiaPages/PrivacyPolicy.vue) — убрано упоминание `useSiteConfigStore` из docblock над `siteConfig`-computed (только комментарий, не код).

**Не трогалось** (вне scope A.3):
- `resources/js/i18n.js` — `locale: window.locale || "en"` и `messages: window.translations || {}`. `window.locale`/`window.translations` теперь не устанавливаются, fallback "en"/`{}` отрабатывает корректно: `inertia-app.js` сразу после `createApp` переопределяет `i18n.global.locale.value` и `setLocaleMessage(...)` из `initial.locale` / `initial.translations`. План A.3 эти ключи в grep'е не упоминает.
- `resources/js/composables/useCurrentLocale.js` — `window.availableLocales || []` остался как fallback. Сейчас он undefined → ветка пропускается, второй if-regex `^[a-z]{2}$` корректно отрабатывает все 25 локалей. Замена на `page.props.availableLocales` потребовала бы превратить функцию в полноценный composable с зависимостью от `usePage()` и привязкой к setup-context — это рефакторинг. План A.3 не требует.
- `resources/js/features/demo/components/{modals/EudrQrModal.vue,sections/ReportsSection.vue}`, `eudrBatchPublic.js:48-49` — `window.locale` для определения локали в Demo. Demo сейчас нерабочий (после A.1 catchall сломан) и пересматривается в A.7. План A.3 этих файлов не упоминает, `window.locale` не входит в обязательный grep-список.

**Как проверить:**

1. `grep -rnE "useSiteConfigStore|window\.appName|window\.adminEmail" resources/js/` — пусто.
2. `npm run build` (client + ssr) — оба ✓ без ошибок.
3. На `/en/contact` (или любой Inertia-странице):
    - В DevTools → консоль: `JSON.parse(document.getElementById("app").dataset.page).props.switcherLocales` — массив из 2 объектов `{code, prefix, name}`.
    - В Header переключатель показывает ровно 2 кнопки (main + detected/fallback) с правильным `prefix` (например `EN` / `RO`).
    - В Footer DevTools → найти `<nav class="footer-seo-locales">` — 23 скрытых `<a hreflang="...">` (все локали кроме 2 переключаемых).
    - В правой части footer-а название бренда ("HACCPilot demo") — приходит из `siteConfig.name`.
4. `<h2>` в consent-модалке (если впервые открыть страницу или очистить `localStorage.LS_CONSENT_VERSION`) показывает имя бренда из `siteConfig.name`.
5. `BatchPublic` / `DailyReportPublic` — открывается, в `documentRef` (виден в blob/print-режиме) `HACCPilot-DAILY-…-DEMO`.

#### A.4. Переименовать `InertiaPages/` → `Pages/` **✅ Выполнено**

После удаления `pages/` коллизии case-insensitive FS больше нет. Переименовать папку, обновить glob в `inertia-app.js` и `ssr.js` (`'./InertiaPages/**/*.vue'` → `'./Pages/**/*.vue'`), обновить `config/inertia.php` (`page_paths`).

**Что сделано:**

- **Сначала освобождена директория `resources/js/pages/`** (после A.1 в ней оставалась одна `pages/technical/TechnicalPage.vue`). На Windows case-insensitive FS `pages/` и `Pages/` — одна и та же папка; пока `pages/technical/` существует, переименовать `InertiaPages/` → `Pages/` нельзя без коллизии.
    - Файл перенесён в новый путь [resources/js/admin/TechnicalPage.vue](../../../../resources/js/admin/TechnicalPage.vue) (admin-utility, не публичная Inertia-страница).
    - Пустые `resources/js/pages/technical/` и `resources/js/pages/` удалены через `rmdir`.
- **Переименована `resources/js/InertiaPages/` → `resources/js/Pages/`** (8 файлов: About, BatchPublic, Contact, DailyReportPublic, Home, HowWorks, PrivacyPolicy, Survey).
- **Обновлены пути в коде:**
    - [resources/js/inertia-app.js](../../../../resources/js/inertia-app.js) — `import.meta.glob('./InertiaPages/**/*.vue', ...)` → `'./Pages/**/*.vue'`, и литерал в `resolve` (`./InertiaPages/${name}.vue` → `./Pages/${name}.vue`).
    - [resources/js/ssr.js](../../../../resources/js/ssr.js) — те же два места.
    - [config/inertia.php](../../../../config/inertia.php) — `resource_path('js/InertiaPages')` → `resource_path('js/Pages')` в `testing.page_paths` (используется ensure-pages-exist чекером).
    - [resources/js/technical.js](../../../../resources/js/technical.js) — `import TechnicalPage from "@/pages/technical/TechnicalPage.vue"` → `"@/admin/TechnicalPage.vue"`.
- **Обновлены docblock-ссылки**, чтобы `grep -r InertiaPages` стал чистым:
    - [resources/js/components/SeoHead.vue](../../../../resources/js/components/SeoHead.vue) — `Используется в InertiaPages/*` → `Pages/*`.
    - [resources/js/config/storageNames.js](../../../../resources/js/config/storageNames.js) — два `@see resources/js/pages/client/Survey.vue` (живший до A.1) → `@see resources/js/Pages/Survey.vue`.

**Не трогалось:** `Documents/overtake_inertia_{0,pages,layout,ssr_deploy}.md` — это исторические снимки выполненных шагов; пути `InertiaPages/` там описывают состояние на момент выполнения (Шаг 0, миграция страниц, SSR-сетап) — не актуализирую, чтобы документация не теряла связи с реальным timeline шагов.

**Как проверить:**

1. `ls resources/js/` — присутствует `Pages/`, отсутствуют `pages/` и `InertiaPages/`. `ls resources/js/Pages/` — 8 `.vue`-файлов.
2. `grep -rn "InertiaPages\|@/pages/technical" resources/js resources/views config` — пусто.
3. `npm run build` (client + ssr) — оба ✓ без ошибок (`✓ 127 modules transformed` в SSR).
4. На каждом из 8 публичных URL (`/en`, `/en/about`, `/en/how-it-works`, `/en/privacy-policy`, `/en/contact`, `/en/survey`, `/batch/{id}`, `/report/{date}`) Inertia успешно резолвит компонент по новому пути — страница рендерится без `Inertia page not found` в консоли.
5. `/technical` (admin-страница тестирования рассылки) открывается, импорт `@/admin/TechnicalPage.vue` отрабатывает.

#### A.5. Удалить `/survey/questions` JSON-endpoint **✅ Выполнено**

В Inertia вопросы приходят через prop. Endpoint больше не используется → удалить роут из `routes/web.php` + метод `index` из `SurveyQuestionsController`. POST `submit`/`verify` остаются.

**Что сделано:**

- [routes/web.php](../../../../routes/web.php) — удалена тройка строк `Route::get('/survey/questions', [SurveyQuestionsController::class, 'index'])->middleware('throttle:20,1')->name('client.survey.questions');` и комментарий над ней. POST'ы `survey/submit` и `survey/verify` оставлены — они нужны для Survey-формы.
- [app/Http/Controllers/Client/SurveyQuestionsController.php](../../../../app/Http/Controllers/Client/SurveyQuestionsController.php) — удалён метод `index(SurveyQuestionsClientService $surveyQuestions)` (он отдавал `getActiveQuestionsKeyedByStableId()` JSON'ом). Заодно удалён теперь неиспользуемый импорт `use App\Services\SurveyQuestionsClientService;`. Оставлены `submitAnswersQuestions()`, `verifyCode()` и приватный `isHoneypotTriggered()`.
- [resources/js/utils/apiAxios.js](../../../../resources/js/utils/apiAxios.js) — в docblock над `defaultApiAxios` пример `публичных GET вроде /survey/questions` заменён на нейтральный «лёгких публичных GET-эндпоинтов» (endpoint больше нет — пример вводил бы в заблуждение).
- **Не трогалось:** `SurveyQuestionsClientService::getActiveQuestionsKeyedByStableId()` остаётся — он по-прежнему вызывается из роута `/{locale}/survey` через `$inertiaPage('Survey', fn () => ['questions' => app(SurveyQuestionsClientService::class)->getActiveQuestionsKeyedByStableId()])` в `routes/web.php`. Сервис — единственный источник списка активных вопросов, удалять его нельзя.

**Как проверить:**

1. `php artisan route:list | grep survey` показывает только две строки — `POST survey/submit` и `POST survey/verify`. Никаких `GET survey/questions`.
2. `grep -rnE "client\.survey\.questions|survey/questions|SurveyQuestionsController.*index" app routes resources/js` — пусто (только исторические MD-файлы в `Documents/` остаются).
3. На `/en/survey` (или любой локали) Inertia-страница рендерит вопросы из props — в DevTools → Network **нет** запроса `GET /survey/questions` при загрузке (раньше был XHR из старого `onMounted`).
4. `curl -i http://haccpilot.local/survey/questions` → `404 Not Found` (вместо JSON с questions, как было раньше).
5. `npm run build:client` ✓ без ошибок.

#### A.6. Базовый `/`-роут — на Inertia или редирект **✅ Выполнено**

`Route::get('/', fn () => view('index-client'))` сейчас отдаёт legacy SPA с JS-редиректом на `/en`. Заменить на `Route::get('/', fn () => redirect('/en'))` или auto-resolve локали по `Accept-Language`.

**Что сделано:**

- В [routes/web.php](../../../../routes/web.php) корневой `Route::get('/', fn () => view('index-client'))->middleware(['setLocale'])` заменён на серверный auto-detect-редирект:

  ```php
  Route::get('/', function (Request $request) {
      $detected = preferred_language_from_request($request, available_locales());
      $locale = $detected ?? config('app.locale', 'en');
      return redirect("/{$locale}")->header('Vary', 'Accept-Language');
  });
  ```

- **Почему auto-detect, а не статичный `redirect('/en')`:** для UX/SEO. Немец, открывая `https://haccpilot.eu/`, попадает на `/de` без ручного переключения. Plain `redirect('/en')` — простой fallback, но игнорирует пользователя. Логика берётся из готового хелпера `preferred_language_from_request()` ([app/Helpers/helpers.php](../../../../app/Helpers/helpers.php)) — тот же helper, что используется в `SetLocale.php` для определения второго языка переключателя; новой логики не пишется.
- **Заголовок `Vary: Accept-Language`** на 302-ответе сигналит CDN/прокси (Cloudflare, browsers) кэшировать редирект отдельно по разным значениям этого заголовка. Без `Vary` Cloudflare закеширует первый увиденный редирект (например `/en`) и будет отдавать его всем — независимо от языка пользователя.
- **Middleware `setLocale` убран** с этого роута — он нужен для рендера view (устанавливает session/cookie/locale), а тут только редирект. SetLocale всё равно сработает на следующем запросе (на `/{locale}/...`), где он действительно нужен.
- **Status code 302 (Found, не 301)** — Laravel `redirect()` по умолчанию. 301 (Moved Permanently) тут плох: он закэшируется браузером навечно, и если пользователь сменит язык в системе, всё равно будет получать старую цель.

**Как проверить:**

1. Корень редиректит на язык браузера (если он есть в `available_locales()`):
   ```bash
   curl -s -o /dev/null -w "%{http_code} → %{redirect_url}\n" -H "Accept-Language: de-DE,de;q=0.9" http://haccpilot.local/
   # 302 → http://haccpilot.local/de
   ```
2. Корень редиректит на `app.locale` (по умолчанию `en`), если язык браузера не из списка:
   ```bash
   curl -s -o /dev/null -w "%{http_code} → %{redirect_url}\n" -H "Accept-Language: ja-JP,ja;q=0.9" http://haccpilot.local/
   # 302 → http://haccpilot.local/en
   ```
3. Без заголовка тоже на `app.locale`:
   ```bash
   curl -s -o /dev/null -w "%{http_code} → %{redirect_url}\n" http://haccpilot.local/
   # 302 → http://haccpilot.local/en
   ```
4. В response-headers есть `Vary: Accept-Language`:
   ```bash
   curl -sI http://haccpilot.local/ | grep -i vary
   # Vary: Accept-Language
   ```
5. На целевой странице (`/en`, `/de`, …) Inertia рендерится корректно — это не сломалось A.6.

#### A.7. Demo — мигрировать на Inertia **✅ Выполнено**

Demo сейчас единственная страница, которая обслуживается через legacy catchall. После удаления legacy SPA она перестанет работать. Demo — публичная маркетинговая страница (есть в `public/sitemap.xml` × 25 локалей и в Header-меню), её **сохраняем** и переносим на Inertia.

**Sitemap.xml и robots.txt не трогаем** — Demo остаётся индексируемым на 25 локалях как и сейчас.

**Что сделано:**

- **[resources/js/Pages/Demo.vue](../../../../resources/js/Pages/Demo.vue)** — создана Inertia-обёртка: `<SeoHead>` + `<ClientOnly><DemoPage :section="section" /></ClientOnly>`. На сервере рендерится только meta-head (Demo — динамический UI, indexed body не нужен; для SEO достаточно title/description/canonical). Использует `defineOptions({ layout: PublicLayout })` — паттерн идентичный остальным 8 Inertia-страницам.
- **[routes/web.php](../../../../routes/web.php)** — внутри группы `prefix => '{locale}'` добавлен `Route::get('/demo/{section?}', $inertiaPage('Demo', fn ($r) => ['section' => (string) ($r->route('section') ?? 'dashboard')]))->where('section', 'dashboard|checklists|personnel|eudr|reports')`. Где-regex включает только пять валидных секций — `/demo/foobar` отдаёт 404, без серверной/клиентской валидации.
- **Удалён catchall `/{locale}/{any}`** — был сломан после A.1 (`view('index-client')` удалена) и больше не нужен. Любой неизвестный путь под локалью теперь честно 404 (раньше — 500 с `View not found`).
- **[resources/js/features/demo/page/DemoPage.vue](../../../../resources/js/features/demo/page/DemoPage.vue)** — рефакторинг с vue-router на Inertia:
    - Принимает `section: String` как prop вместо `route.params.section`. Серверный where-regex гарантирует валидность; локальная проверка `DEMO_SECTION_IDS.has(props.section) ? props.section : "dashboard"` — последний bumper если придёт что-то неожиданное.
    - `locale` через `useCurrentLocale()` (вместо `route.params.locale`).
    - `<RouterLink :to="surveyPath">` (×2) → `<Link :href="surveyPath">` от `@inertiajs/vue3`.
    - `setActiveSection()` теперь делает `inertiaRouter.visit('/{locale}/demo/{sectionId}', { preserveState: true, preserveScroll: true })` — partial-reload без сброса state Vue (открытые модалки, scroll-position) и без полной перезагрузки страницы.
    - Удалён watch на `route.params.section` с `router.replace()` (это была защита от невалидной секции — теперь её делает сервер через where-regex и client-side ternary в `activeSectionId`).
- **[DashboardSection.vue](../../../../resources/js/features/demo/components/sections/DashboardSection.vue)** — `<RouterLink :to="checklistsDemoRoute">` → `<Link :href>`. `useRoute()` → `useCurrentLocale()`. `checklistsDemoRoute` стало строкой `/{locale}/demo/checklists` вместо route-объекта.
- **[ReportsSection.vue](../../../../resources/js/features/demo/components/sections/ReportsSection.vue)** — убран `useRoute()`, `reportPageLocale` через `useCurrentLocale()`. Поскольку нет `<RouterLink>` в шаблоне, остальное не трогалось.
- **[EudrQrModal.vue](../../../../resources/js/features/demo/components/modals/EudrQrModal.vue)** — убран `useRoute()`, `batchPageLocale` через `useCurrentLocale()`. Ссылка на BatchPublic переписана с `<RouterLink target="_blank">` на обычный `<a target="_blank" :href="`/${locale}/batch/${batch.id}`">`. Inertia `<Link>` тут не подходит — он перехватывает клик и пытается сделать XHR; `target="_blank"` нужен реальный новотабовый `<a>`.
- **Grain-cooling сценарий — внутрипроектный API изменён:** `isGrainCoolingScenarioSuppressedForRoute(route)` (vue-router-объект) → `isGrainCoolingScenarioSuppressedForPath(pathname: string)`:
    - **[grainCoolingPublicRoutes.js](../../../../resources/js/features/demo/task_grain_cooling/grainCoolingPublicRoutes.js)** — функция теперь принимает чистый pathname-string, проверяет 4 regex для `/batch/...` и `/report/YYYY-MM-DD` с локалью и без. Удалена ветка `route.name === 'BatchPublic'` (с Inertia `route.name` отсутствует — определяем по path).
    - **[applyGrainCoolingMeasurement.js](../../../../resources/js/features/demo/task_grain_cooling/applyGrainCoolingMeasurement.js)** — `syncGrainCoolingScenarioProcessAllowed(demoStateRef, pathname)` принимает pathname вместо route-объекта.
    - **[grainCoolingDemoEntry.js](../../../../resources/js/features/demo/task_grain_cooling/grainCoolingDemoEntry.js)** — `useGrainCoolingDemoEntry()` использует `usePage()` от Inertia вместо `useRoute()`. `pathname` берётся из `window.location.pathname` (всегда актуальный для текущего URL). Реактивный watch — на `[demoState.value, page.url]` (Inertia `page.url` обновляется при каждом visit).
    - **[task_grain_cooling/index.js](../../../../resources/js/features/demo/task_grain_cooling/index.js)** — экспорт переименован: `isGrainCoolingScenarioSuppressedForRoute` → `isGrainCoolingScenarioSuppressedForPath`.
- **[PublicLayout.vue](../../../../resources/js/Layouts/PublicLayout.vue)** — добавлен `useGrainCoolingDemoEntry()` после `useSessionGuard()`. Теперь grain-cooling запускается на любой странице (раньше был отключён до правки хука).

**Архитектурные решения:**

- **Section в URL, а не в локальном state.** Дает deep-linking (`/en/demo/checklists` можно скопировать) и совместимость с sitemap (хотя там сейчас только `/demo/dashboard`). Inertia `router.visit()` с `preserveState: true` обновляет только props без перезагрузки — UX как в SPA.
- **`<ClientOnly>` для DemoPage.** На сервере рендерится только `<SeoHead>` (meta-теги). Body Demo-страницы доступен только после mount. Для SEO это приемлемо — Demo это interactive UI, а не текстовый контент; title/description/canonical в выдаче будут (сниппет), bot не теряет контент-ценности от пустого тела на сервере.
- **`where('section', 'dashboard|checklists|personnel|eudr|reports')`.** Серверный 404 для невалидной секции. Лучше чем client-side redirect: Google не индексирует мусорные URL, не нужна логика «404-as-200-with-canonical».
- **Pathname (а не route-объект) в grain-cooling.** Inertia не имеет понятия именованных роутов на клиенте, и это правильно — единственная стабильная информация о текущем URL это `window.location.pathname` / `usePage().url`. После рефакторинга grain-cooling работает одинаково на любом entry-point (Inertia, SSR-render, тестовая среда без Vue router).

**Как проверить:**

1. `php artisan route:list | grep demo` — показывает `GET {locale}/demo/{section?}` (других demo-роутов нет).
2. URL'ы возвращают правильные коды:
   ```bash
   curl -s -o /dev/null -w "/en/demo: %{http_code}\n" http://haccpilot.local/en/demo
   # 200 (default section=dashboard)
   curl -s -o /dev/null -w "/en/demo/checklists: %{http_code}\n" http://haccpilot.local/en/demo/checklists
   # 200
   curl -s -o /dev/null -w "/en/demo/foobar: %{http_code}\n" http://haccpilot.local/en/demo/foobar
   # 404 (where-regex отсек)
   curl -s -o /dev/null -w "/en/unknown: %{http_code}\n" http://haccpilot.local/en/unknown
   # 404 (catchall удалён)
   ```
3. `npm run build` (client + ssr) — оба ✓ без ошибок (`✓ 187 modules transformed` в SSR — Demo подтянул больше модулей).
4. `grep -rnE "from \"vue-router\"|RouterLink|useRoute\(|useRouter\(" resources/js/features/demo resources/js/Pages/Demo.vue` — пусто.
5. На странице `/en/demo` (любая локаль) после mount: видны все 5 секций в навигации, клик по «Checklists» → URL меняется на `/en/demo/checklists` без полного reload (DevTools → Network: XHR с `X-Inertia: true`), активная секция переключается, scroll-position и open-modals сохраняются.
6. Заходим на `/en/demo/dashboard`, ждём показа grain-cooling notification banner (если выполнены условия: consent принят + есть pending measurement) — он появляется. Это означает `useGrainCoolingDemoEntry()` отрабатывает в `PublicLayout`.
7. Header-меню «Demo» (`navConfig.menu` → `/demo/dashboard`) кликается через `<Link>` (после A.2) и приводит на работающую Inertia-страницу.

#### A.8. BatchPublic / DailyReportPublic — серверный resolver данных **✅ Выполнено (не требуется на текущем этапе)**

Сейчас на сервер уходит только `batchId` / `date` + SEO-meta, **контент** batch'а / отчёта строится на клиенте через `getBatchPublicRecord` / `getDailyReportSnapshot`. Это значит **сам контент не виден Googlebot'у в HTML до JS**.

Если эти страницы должны индексироваться с **полным контентом** (продукты, supply chain, CCP-задачи) — перенести `getBatchPublicRecord` и `getDailyReportSnapshot` в PHP (`app/Services/`), резолвить в роуте через `$inertiaPage` с `extraPropsResolver` и отдавать `batch`/`report`-объекты в props.

Если для SEO достаточно только title/description/canonical (snippets в выдаче) — оставить как есть, Googlebot всё равно умеет рендерить JS.

**Решение: оставить как есть. Никакого кода не трогали.**

**Почему не переносим в PHP:**

- **Данные = демо-моки**, не реальные записи из БД:
    - [resources/js/features/demo/data/eudrBatchPublic.js](../../../../resources/js/features/demo/data/eudrBatchPublic.js) — 3 hard-coded партии (`AB123` мясо / `CF762` кофе / `BR041` мука) с цепочкой поставок (operator/product/plot/supplyChain/role) и фейковыми контрагентами («Forest Meats», «Roast Trade», «Bread Supply»).
    - [resources/js/features/demo/data/dailyReportPublic.js](../../../../resources/js/features/demo/data/dailyReportPublic.js) — `getDailyReportSnapshot` собирается из тех же мок-партий через `getBatchPublicRecord(b.id)`.
    - Все user-facing поля (`operator.name`, `product.category`, `plot.country`, `chain_*_name`, …) — это **vue-i18n keys** (`batch.records.AB123.operator_name` и т. п.), переводятся на клиенте через `i18n.global.t(...)`.
- **Стоимость переноса несоразмерна выгоде** для моков:
    - Скопировать структуры из 2 JS-файлов в новые `app/Services/DemoBatchService.php` + `app/Services/DemoReportService.php` (около 250 строк JS → PHP, два слоя).
    - Дублировать **~50 i18n-ключей** `batch.records.*` / `batch.roles.*` из vue-i18n в Laravel `lang/{locale}/batch.php` (это две **разные** системы переводов; не получится один источник).
    - Перерефакторить две `Pages/BatchPublic.vue` + `Pages/DailyReportPublic.vue` (контент из props, а не из `getBatchPublicRecord`), а также Demo-секции `EudrSection.vue` + `ReportsSection.vue`, которые потребляют те же моки внутри `/demo/*`.
- **SEO-индексационная ценность близка к нулю**: бот, читающий «Forest Meats SE-09 продал партию AB123 в Роттердам 21.03.2026» — это шум, не business-value. Реальный SEO-сигнал у этих страниц — **title / description / canonical / og / hreflang**, и они уже отдаются сервером через `SeoMetaResolver::resolveForInertia()` (см. [routes/web.php](../../../../routes/web.php) — `$inertiaPage('BatchPublic', ...)` подмешивает `seo` в props на сервере).
- **Googlebot умеет рендерить JS** — на втором проходе он подтягивает client-side содержимое и индексирует его. Для демо-витрины этого с запасом достаточно.

**Когда вернуться к A.8:**

Когда `BatchPublic` / `DailyReportPublic` перестанут быть демо и станут реальными ресурсами (партии из БД через Eloquent, отчёты из `daily_reports` таблицы) — это будет нативный server-side resolver с моделями. Тогда:

- В `app/Services/` появятся `BatchService::findPublic($batchId)` / `DailyReportService::snapshot($date)` поверх Eloquent.
- В `routes/web.php` `$inertiaPage('BatchPublic', fn ($r) => ['batch' => $batchService->findPublic(...)])`.
- На фронте удалится `getBatchPublicRecord` / `getDailyReportSnapshot`, останутся только `Pages/BatchPublic.vue` принимающий `batch` как prop.

В планы Inertia-миграции A эта работа **не входит** — она появится как часть feature «реальные batch/report» (отдельный PR).

**Как проверить, что текущее поведение не сломано:**

1. `curl -s http://haccpilot.local/en/batch/AB123 | grep -E "<title|<meta name=\"description\""` — meta-теги для известного demo-batchId присутствуют (через server-side `seo` prop, не зависит от client-render).
2. `curl -s http://haccpilot.local/en/report/2026-03-21 | grep -E "<title|<meta name=\"description\""` — то же для daily report.
3. На странице `/en/batch/AB123` после mount: контент партии (operator, product, supply chain) рендерится через `getBatchPublicRecord('AB123')` на клиенте — это и есть текущее поведение, ничего не меняется.

#### A.9. Опционально — Contact submit на `useForm` Inertia

Сейчас POST через apiAxios. Можно переписать на `useForm` от `@inertiajs/vue3` + flash-сообщения через shared-props.
Идиоматичнее для Inertia, но требует переписывания honeypot-логики. Не критично — можно отложить.
