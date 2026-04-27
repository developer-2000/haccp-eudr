
## Layout, общие компоненты, глобальные эффекты

Большая часть пунктов раздела уже выполнена в Шаге 0 и постраничной миграции (см. `overtake_inertia_0.md` и `overtake_inertia_pages.md`). Здесь — актуальный статус каждого подпункта и что осталось доделать.

### `Index.vue` → `Layouts/PublicLayout.vue` ✅ Выполнено

Сделано в Шаге 0.8 (минимальный layout) + 0.10 (полное наполнение).

**Что есть сейчас:** [resources/js/Layouts/PublicLayout.vue](../../../../resources/js/Layouts/PublicLayout.vue) с `<NMessageProvider>`, `<Header>`, `<ClientOnly><GrainCoolingNotificationBanner /></ClientOnly>`, `<main><slot /><Footer /></main>`, `<ClientOnly><ConsentOverlay /></ClientOnly>`. Класс `main-content--bg-style-white` определяется через `usePage().component === 'About'` (с doc-блоком на computed).

Старый [resources/js/basic/Index.vue](resources/js/basic/Index.vue) **не удалялся** — остаётся как layout для legacy SPA до финальной очистки.

**Как проверить:** `ls resources/js/Layouts/PublicLayout.vue` существует; на любой Inertia-странице (`/en`, `/en/about`, `/en/survey`) шапка/подвал/consent-overlay рендерятся.

### `Header.vue` ✅ Выполнено

Сделано в Шаге 0.10.

**Что сделано:** `<router-link>` → `<a :href>` для логотипа, `useRouter`/`useRoute` импорты убраны, `route.params.locale` → `useCurrentLocale()` (новый composable), `router.push("/.../survey")` → `window.location.href = ...`. `getLanguagesList()` расширен фолбэком на `window.localeCountries` (для Inertia-контекста где нет `data-languages` атрибута). `<NavMenuItem>` и `<DropdownMenu>` тоже отрефакторены.

POST `/locale` через axios оставлен как есть.

Финальная очистка (после удаления legacy): `<a href>` → `<Link>` от `@inertiajs/vue3` для SPA-навигации без перезагрузки.

### `Footer.vue` ✅ Выполнено

Сделано в Шаге 0.10.

**Что сделано:** 2 `<router-link>` → `<a :href>`, `useRoute` убран, `route.params.locale` → `useCurrentLocale()`, `route.path` → локальный ref `currentPath` через `window.location.pathname`. Логика `seoLocaleLinks` сохранена с doc-блоком.

Финальная очистка: `<a href>` → `<Link>`.

### `ConsentOverlay.vue` ✅ Выполнено

Сделано в Шаге 0.10.

**Что сделано:** `<router-link>` → `<a :href>`, `useRoute` убран. Проверка `route.name === "PrivacyPolicy"` заменена на regex `/\/privacy-policy\/?$/.test(currentPath.value)` — работает на любой локали и в обоих контекстах (legacy + Inertia).

### `GrainCoolingNotificationBanner.vue` ✅ Выполнено (обёртка в layout)

Подключён в `Layouts/PublicLayout.vue` через `<ClientOnly>` — на сервере не рендерится, на клиенте включается после `onMounted`.

**Важное замечание:** баннер визуально активируется только когда `task_grain_cooling.scenarioProcessAllowed === true`. Эту переменную ставит `useGrainCoolingDemoEntry()` (см. ниже), который **не вызывается** на Inertia-страницах. Поэтому **на мигрированных страницах баннер всегда скрыт**. На legacy SPA-страницах (Demo через catchall) — продолжает работать как раньше. Это плановый компромисс, потому что Demo не мигрирован (см. `overtake_inertia_pages.md` — секция Demo).

### `useGrainCoolingDemoEntry()` в App.vue ⏸ Оставлен в legacy (не подключён к Inertia)

> ⏸ **Отложено** → см. `overtake_inertia.md` → "Проверка отложенного" → **A.7 Demo — мигрировать или убрать** (вместе с этим хуком).

**Текущее состояние:** хук вызывается из [resources/js/components/App.vue](resources/js/components/App.vue) — корня legacy SPA. На Inertia-страницах не запускается (мы не подключали vue-router в `inertia-app.js`, а сам хук импортирует `useRoute` из vue-router).

**Почему не подключаем:**

1. Хук импортирует `useRoute()` — конфликт с архитектурой Inertia без vue-router.
2. Demo не мигрирован — главный потребитель grain-cooling сценария продолжает работать на legacy.
3. Адаптация хука на `useCurrentLocale()` + ручной watch URL — отдельный объём работы (~1 день), не оправдан в контексте текущей миграции.

**Когда подключать:** одновременно с миграцией Demo (если когда-нибудь будет). Тогда хук переписать без `useRoute()` и вызвать в `Layouts/PublicLayout.vue` через `onMounted`.

**Как проверить текущий статус:** на странице `/en/demo/dashboard` (legacy) — banner и demo-cycle работают как раньше. На `/en` (Inertia Home) — banner физически в DOM (ClientOnly его рендерит), но `task_grain_cooling.scenarioProcessAllowed === false`, поэтому visually пустой.

### `useSessionGuard()` ✅ Выполнено — подключён в `PublicLayout.vue`

**Текущее состояние:** composable [resources/js/composables/useSessionGuard.js](../../../../resources/js/composables/useSessionGuard.js) вызывается из legacy `App.vue` через `onMounted`/`onBeforeUnmount`. На мигрированных Inertia-страницах **НЕ запускается** — `App.vue` Inertia-bundle'ом не используется.

**Что это означает:**

- 419-handler в `apiAxios._handleError` (страховка на случай протухшей сессии) **работает** на Inertia-страницах — он не зависит от useSessionGuard.
- А вот **проактивный ping `/session/ping` при возврате во вкладку** (visibilitychange) на Inertia-страницах **отсутствует** — маленькая регрессия. Это значит юзер вернувшийся через час во вкладку Home/About не получит свежий CSRF до первого POST'а; на legacy — получит.

**Что нужно сделать:**

1. В [resources/js/Layouts/PublicLayout.vue](../../../../resources/js/Layouts/PublicLayout.vue) импортировать composable и вызвать в `<script setup>`:
   ```js
   import { useSessionGuard } from "@/composables/useSessionGuard.js";
   useSessionGuard();
   ```
2. Composable уже SSR-safe — `visibilitychange` listener навешивается в `onMounted`, так что серверный рендер ничего не сломает.

**Зачем:** обеспечить паритет UX между мигрированными и legacy-страницами по части обновления CSRF при возврате во вкладку.

**Что сделал:**

- В [resources/js/Layouts/PublicLayout.vue](../../../../resources/js/Layouts/PublicLayout.vue) импортировал `useSessionGuard` из `@/composables/useSessionGuard.js` и вызвал `useSessionGuard()` в `<script setup>` после `isAboutPage`-computed.
- Composable уже SSR-safe (всё в `onMounted`/`onBeforeUnmount`) — Vue в setup-фазе создаёт замыкания, навешивает listener только после mount на клиенте.
- На legacy `App.vue` хук **продолжает вызываться** — теперь useSessionGuard работает в обоих контекстах (legacy SPA + Inertia layout). Двойного навешивания не будет: каждый контекст использует свою собственную root-компоненту, которая существует только в одном bundle одновременно.
- `npm run build` отработал за 40 секунд без ошибок.

**Как проверить работоспособность:**

- **Bash/code-проверки** (выполнено):
    - `grep -n "useSessionGuard" resources/js/Layouts/PublicLayout.vue` — две строки (импорт + вызов).
    - `npm run build` без ошибок (40 сек).
- **Ручные проверки в браузере** (нужно выполнить):
    - Открыть `/en` (Inertia Home), переключиться на другую вкладку на >30 секунд, вернуться — DevTools → Network показывает GET `/session/ping`.
    - В ответе ping'а `data.csrf` — текущий токен. Если совпадает с `<meta name="csrf-token">` → ничего не делаем. Если отличается (сессия истекла, Laravel дал новую) → обновляются meta-тег и `axios.defaults.headers.common["X-CSRF-TOKEN"]`.
    - Тест с истёкшей сессией: удалить cookie `haccpilot_session`, переключиться на другую вкладку и вернуться — ping вернёт новый CSRF, следующий POST (например, попытка отправить Contact-форму) не упадёт с 419.
    - Открыть `/en` дважды (две вкладки) — visibilitychange ping'и НЕ дублируются, throttle 30 секунд работает (см. [useSessionGuard.js](../../../../resources/js/composables/useSessionGuard.js)).
    - На legacy SPA странице (`/en/demo/dashboard`) — visibilitychange ping тоже работает (legacy `App.vue` его уже вызывает) — паритет с Inertia.

### `useSiteConfigStore` ⏳ К удалению в финальной очистке legacy

> ⏳ **Отложено** → см. `overtake_inertia.md` → "Проверка отложенного" → **A.3 Удалить `useSiteConfigStore` и window-мост**.

**Текущее состояние:** Pinia-store [resources/js/stores/site_config.js](resources/js/stores/site_config.js) используется в legacy [Header.vue](../../../../resources/js/components/client/header/Header.vue), [Footer.vue](../../../../resources/js/components/client/footer/Footer.vue), legacy `pages/client/PrivacyPolicy.vue`. В Inertia store **синхронизируется** из shared-props в [resources/js/inertia-app.js](../../../../resources/js/inertia-app.js) — `name`, `adminEmail`, `loaded` ставятся явно перед монтированием. Header/Footer работают одинаково в обоих контекстах.

**Inertia-страница PrivacyPolicy** уже использует `usePage().props.siteConfig` напрямую (без store) — store там не нужен.

**Что нужно сделать в финальной очистке (одной волной):**

1. В Header/Footer заменить `useSiteConfigStore()` на `usePage().props.siteConfig` (с computed для реактивности при смене visit'ов).
2. Удалить файл `resources/js/stores/site_config.js`.
3. Удалить экспорт из `resources/js/stores/index.js` (если есть индекс).
4. Удалить инициализацию в `inertia-app.js` (блок где ставим `siteConfigStore.name`/`adminEmail`/`loaded`).
5. `grep -rn "useSiteConfigStore" resources/js/` — должно быть пусто.

**Когда:** после удаления старого `app.js` / `app.blade.php` / `pages/client/` — то есть единым PR'ом финальной очистки.

### `vue-i18n` инициализация ✅ Выполнено

Сделано в Шаге 0.5 (`inertia-app.js`).

**Что есть сейчас:**

- [resources/js/i18n.js](../../../../resources/js/i18n.js) создаёт инстанс с дефолтной локалью `en`.
- В [resources/js/inertia-app.js](../../../../resources/js/inertia-app.js) в `setup` функции `createInertiaApp`: `i18n.global.locale.value = initial.locale` + `i18n.global.setLocaleMessage(initial.locale, initial.translations[initial.locale])`. Локаль и переводы приходят из shared-props HandleInertiaRequests.
- Legacy `app.js` оставлен нетронутым — продолжает использовать `window.translations` и `router.beforeEach` для синхронизации.

**Что осталось:** при переходе между Inertia-страницами через `<Link>` (после финальной очистки legacy и переключения на SPA-навигацию Inertia) локаль может меняться, если фронт реализует in-page language-switcher через `Inertia.visit('/{newLocale}/...')`. Тогда нужно подвесить `router.on('navigate', ...)` или `usePage()` watch на `props.locale` для обновления `i18n.global.locale.value`. Сейчас не критично — переключатель языка делает full reload через `window.location.href`, после которого Inertia заново вызывает `setup` и выставляет правильную локаль.

> ℹ️ **Не критично сейчас** — переключатель языка делает full reload, после которого `setup` `inertia-app.js` снова инициализирует i18n из shared-props. Реализовать когда появится in-page language-switcher через `<Link>` (отдельная feature, не часть SEO-миграции).

**Как проверить:** на `/ro/about` (Inertia) переводы в шапке/подвале/контенте — на румынском; на `/en/about` — на английском.

---

## Что ещё осталось доделать в разделе

Только один пункт:

1. **Удалить `useSiteConfigStore`** — это часть финальной очистки legacy, не блокирует SSR (Фазу F). Делается в единый PR после полной миграции — одновременно с удалением `app.js`/`app.blade.php`/`pages/client/`/`router.js`/`basic/Index.vue`. Сейчас не делать: Header/Footer всё ещё работают в legacy SPA-контексте через store + Vue Router, удаление сейчас сломает legacy.

Все остальные пункты раздела зафиксированы и работают на текущей мигрированной части сайта.
