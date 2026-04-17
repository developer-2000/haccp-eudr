# SEO-план проекта HACCPilot

> **Дата:** 2026-04-14  
> **Стек:** Laravel 10 + Vue 3 SPA + Vue Router + Vue i18n  
> **Языки:** en (основной), ro (резервный), планируется расширение на 25 локалей  
> **Рендеринг:** CSR (Client-Side Rendering), SSR отсутствует  

---

## Текущее состояние

| Параметр | Статус |
|---|---|
| Динамические `<title>` | Только на 2 из 13 страниц (BatchPublic, DailyReportPublic) |
| Meta description | Отсутствует полностью |
| Open Graph / Twitter Cards | Отсутствует |
| Canonical URL | Отсутствует |
| hreflang (языковые альтернативы) | Отсутствует |
| Structured Data (JSON-LD) | Отсутствует |
| Sitemap XML | Отсутствует |
| robots.txt | Базовый, без ссылки на sitemap |
| SSR / Prerendering | Отсутствует |
| Head-менеджер (unhead и т.д.) | Отсутствует |
| Prerender для ботов | Отсутствует |

---

## Этап 1 — Инфраструктура управления мета-тегами

**Цель:** установить централизованный механизм управления `<head>` из Vue-компонентов.

### 1.1 Установка `@unhead/vue` — **✅ Выполнено**

- Установить пакет `@unhead/vue` (рекомендуемый head-менеджер для Vue 3)
- Зарегистрировать плагин в `resources/js/app.js`
- Проверить совместимость с текущим Vite-конфигом

> **Реализация:**
> - Установлен `@unhead/vue@^2.1.13` (v3 требует Vite >= 6.4.2, несовместима с текущим Vite 5.4)
> - Зарегистрирован в `resources/js/app.js`: `createHead()` из `unhead/client` + `app.provide(headSymbol, head)`
> - Сборка Vite пройдена успешно, composables `useHead()` и `useSeoMeta()` доступны во всех компонентах

### 1.2 Базовая конфигурация — **✅ Выполнено**

- Создать composable `resources/js/composables/usePageSeo.js` — обёртка для формирования стандартного набора мета-тегов (title, description, og, canonical, hreflang)
- Определить шаблон данных: `{ title, description, ogImage, path }`
- Автоматически формировать:
  - `<title>` — с суффиксом бренда: `"Название страницы | HACCPilot"`
  - `<meta name="description">` — из переданного description
  - `<link rel="canonical">` — из текущего полного URL (без query params)
  - `<meta property="og:*">` — из тех же данных
  - `<meta name="twitter:*">` — из тех же данных
  - `<link rel="alternate" hreflang="x">` — для каждого доступного языка

> **Реализация:**
> - Создан composable `resources/js/composables/usePageSeo.js`
> - функция `usePageSeo({ title, description, ogImage, ogType })`
> - Формирует: title с суффиксом " | HACCPilot", meta description, canonical, og:title/description/image/url/type/site_name,
> - twitter:card/title/description/image, hreflang для всех локалей из `window.availableLocales` + x-default
> - Принимает как строки, так и ref/computed для реактивных данных
> - Подключён к `resources/js/pages/client/Home.vue` с тестовыми данными для проверки

### 1.3 Защита качества мета-тегов — **✅ Выполнено**

- Добавить в composable `usePageSeo` fallback-логику:
  - `title` — если пустой или отсутствует, использовать `"HACCPilot"`
  - `description` — если пустой, использовать дефолтное описание сайта
  - dev-предупреждения в консоль если description < 50 или > 160 символов
- Очистка canonical URL от query params (`?ref=`, `?utm_*`, и т.д.):
  - `canonical = origin + pathname` (без `search`)
- Контроль дублей: не допускать одинаковых title/description на разных страницах (проверяется на этапе review)

> **Реализация:**
> - Файл `resources/js/composables/usePageSeo.js`:
> - `DEFAULT_DESCRIPTION` — fallback-описание, используется если description пустой или не передан
> - `resolvedTitle` — fallback на `"HACCPilot"` если title пустой
> - `resolvedDescription` — fallback на `DEFAULT_DESCRIPTION` если description пустой
> - `warnDescriptionQuality()` — в dev-режиме (`import.meta.env.DEV`) выводит предупреждение если description < 50 или > 160 символов
> - `canonicalUrl` — формируется из `origin + route.path` (без query params и hash)
> - `unref()` — вспомогательная функция для единообразного разворачивания ref/computed/string

### 1.4 Интеграция с i18n — **✅ Выполнено**

Используем файл словарь `lang/en/seo.php`
- Мета-данные каждой страницы должны быть переведены через Vue i18n
- В каждом языковом файле (`lang/{locale}/`) предусмотреть секцию `seo` с ключами `title` и `description` для каждой страницы
- Composable должен автоматически подставлять текущую локаль
- Если перевод отсутствует — fallback на `en`, а не пустая строка

> **Реализация:**
> - `lang/en/seo.php` — словарь SEO-переводов для всех 13 страниц (title + description), подключён в `lang/en.php`
> - `lang/ro.php` — подготовлен для подключения `lang/ro/seo.php` (с file_exists-проверкой, fallback на en через vue-i18n)
> - `resources/js/composables/usePageSeo.js` — добавлены параметры `i18nKey` и `i18nParams`:
>   - `i18nKey: "seo.home"` — автоматически берёт `seo.home.title` и `seo.home.description` из словаря
>   - `i18nParams: { id, date }` — для интерполяции в динамических страницах (batch, report)
>   - `translate()` — вспомогательная функция, проверяет `te()` перед `t()`, возвращает "" если ключ не найден
>   - Fallback: i18n → fallbackLocale "en" → DEFAULT_DESCRIPTION
> - `resources/js/pages/client/Home.vue` — заменены тестовые строки на `usePageSeo({ i18nKey: "seo.home" })`

---

## Этап 2 — Prerendering для ботов (критично)

**Цель:** сделать контент SPA видимым для поисковых и социальных ботов. Это фундамент всего SEO — без этого остальные этапы дают ограниченный эффект.

### 2.1 Серверные мета-теги в Blade (Вариант C — быстрый старт) — **✅ Выполнено**

Минимальная мера: боты видят meta-теги без выполнения JS.

- Создать `app/Services/SeoMetaResolver.php` — сервис, который по URL определяет title/description/og для текущей страницы
- В `app.blade.php` вставить мета-теги из серверных переменных (до стилей):
  ```html
  <meta name="description" content="{{ $seo['description'] }}">
  <meta property="og:title" content="{{ $seo['og_title'] }}">
  <meta property="og:description" content="{{ $seo['og_description'] }}">
  <meta property="og:image" content="{{ asset($seo['og_image']) }}">
  ```
- Для динамических страниц (batch, report) — подтягивать данные из БД в контроллере
- Покрывает: соцсети (Facebook, Telegram, Twitter), частично поисковики

> **Реализация:**
> - `app/Services/SeoMetaResolver.php` — сервис `resolve(path, locale)`:
>   - `ROUTE_MAP` — маппинг URL-сегментов на ключи seo.php (11 статических маршрутов)
>   - `matchEntry()` — определяет SEO-запись по пути, включая динамические (batch/{id}, report/{date})
>   - `interpolate()` — подстановка {id}, {date} и т.д. в серверные тексты
>   - `loadSeoData()` — загрузка из lang/{locale}/seo.php с fallback на en
> - `app/Providers/AppServiceProvider.php` — View Composer для `layouts.app`:
>   - зарегистрирован singleton `SeoMetaResolver`
>   - передаёт массив `$seo` во все страницы через `View::composer`
> - `resources/views/layouts/app.blade.php` — серверные мета-теги до стилей:
>   - `<title>`, `<meta name="description">`, полный набор `og:*` и `twitter:*` тегов
>   - Теперь боты (Facebook, Telegram, Twitter, Google) видят мета-теги в исходном HTML без JS

### 2.2 Self-hosted Prerender (Вариант B) — **⏸ Отложено**

Полноценное решение: боты получают отрендеренный HTML со всем контентом.

- Установить Puppeteer (self-hosted, не SaaS — контроль, дешевле, гибче)
- Создать Laravel middleware `PrerenderIfBot`:
  - определение ботов по User-Agent (Googlebot, Bingbot, facebookexternalhit, Twitterbot, TelegramBot, LinkedInBot, Slackbot)
  - запрос к Puppeteer/Rendertron для получения полного HTML
  - кеширование prerender-страниц (file/Redis, TTL 24ч для статики, 1ч для динамики)
  - whitelist только для ботов, обычные пользователи получают SPA
- Логирование: писать в лог User-Agent + URL + prerender hit/miss (для мониторинга)
- Альтернатива: nginx-уровневый prerender через upstream

> **Почему отложено:**
> - Этап 2.1 (серверные мета-теги в Blade) уже покрывает основную задачу: боты соцсетей (Facebook, Telegram, Twitter) видят OG-теги без JS
> - Google умеет рендерить JS-страницы самостоятельно (с задержкой, но индексирует)
> - В проекте 13 страниц — Google справится без prerender
> - Puppeteer требует отдельный сервер, кеширование, мониторинг — значительные инфраструктурные затраты
> - **Когда вернуться:** если Google Search Console покажет проблемы с индексацией, или при масштабировании до сотен динамических страниц (batch/report)

### 2.3 OG-изображения

- Подготовить дефолтное OG-изображение (`public/images/og-default.jpg`, 1200x630px)
- Для ключевых страниц — индивидуальные OG-изображения при необходимости

---

## Этап 3 — Мета-теги на всех страницах — **✅ Выполнено**

**Цель:** каждая страница должна иметь уникальные title, description и OG-теги.

### 3.1 Страницы для настройки — **✅ Выполнено**

| Страница | Компонент | Маршрут | Ключ i18n |
|---|---|---|---|
| Главная | `Home.vue` | `/:locale` | `seo.home` |
| О нас | `About.vue` | `/:locale/about` | `seo.about` |
| Как это работает | `HowWorks.vue` | `/:locale/how-it-works` | `seo.how_it_works` |
| Опрос | `Survey.vue` | `/:locale/survey` | `seo.survey` |
| Демо — Dashboard | `DashboardSection.vue` | `/:locale/demo/dashboard` | `seo.demo_dashboard` |
| Демо — Checklists | `ChecklistsSection.vue` | `/:locale/demo/checklists` | `seo.demo_checklists` |
| Демо — EUDR | `EudrSection.vue` | `/:locale/demo/eudr` | `seo.demo_eudr` |
| Демо — Personnel | `PersonnelSection.vue` | `/:locale/demo/personnel` | `seo.demo_personnel` |
| Демо — Reports | `ReportsSection.vue` | `/:locale/demo/reports` | `seo.demo_reports` |
| Политика конфиденциальности | `PrivacyPolicy.vue` | `/:locale/privacy-policy` | `seo.privacy_policy` |
| Контакт | `Contact.vue` | `/:locale/contact` | `seo.contact` |
| Публичный батч (EUDR) | `BatchPublic.vue` | `/:locale/batch/:batchId` | `seo.batch_public` |
| Публичный отчёт | `DailyReportPublic.vue` | `/:locale/report/:date` | `seo.report_public` |

### 3.2 Задачи по каждой странице — **✅ Выполнено**

- Вызвать `usePageSeo()` в `<script setup>` каждого компонента
- Передать переведённые title и description (уникальные для каждой страницы)
- Для динамических страниц (BatchPublic, DailyReportPublic) — использовать реактивный computed с данными из API
- Удалить ручные `document.title = ...` из BatchPublic.vue и DailyReportPublic.vue

### 3.3 Требования к мета-тегам — **✅ Выполнено**

- title: 30-60 символов, уникальный на каждой странице
- description: 50-160 символов, уникальный, содержит ключевые слова
- Не допускать пустых значений — всегда fallback на дефолт
- Динамические страницы: если данные ещё не загружены, показывать общий title до получения данных

> **Реализация:**
> - Клиентский слой: `usePageSeo({ i18nKey })` подключён во всех 9 компонентах (13 страниц), включая DemoPage с динамическим computed-ключом
> - Серверный слой: `SeoMetaResolver` в Blade покрывает все маршруты через `ROUTE_MAP` + динамические (batch, report, demo)
> - Словарь `lang/en/seo.php`: уникальные title, description, og_title, og_description, og_image, twitter_title, twitter_description для каждой страницы
> - Ручные `document.title` удалены из `BatchPublic.vue` и `DailyReportPublic.vue`
> - Fallback и dev-предупреждения о длине реализованы в composable (этап 1.3)

---

## Этап 4 — Мультиязычное SEO (hreflang)

**Цель:** корректная индексация языковых версий, исключение дублирования контента.

### 4.1 hreflang-теги — **✅ Выполнено**

- В composable `usePageSeo` автоматически генерировать `<link rel="alternate">` для всех доступных локалей
- Формат: `<link rel="alternate" hreflang="en" href="https://domain.com/en/about">`
- Добавить `<link rel="alternate" hreflang="x-default">` с указанием на основную локаль (en)
- Каждая языковая версия должна ссылаться на все остальные (полный граф) — это уже реализовано в composable

### 4.2 Canonical URL для мультиязычности — **✅ Выполнено**

- Canonical всегда указывает на текущую языковую версию страницы
- Пример: страница `/ro/about` → canonical = `https://domain.com/ro/about`
- Canonical формируется как `origin + pathname` (без query params)

### 4.3 lang-атрибут `<html>` — **✅ Выполнено**

- В `app.blade.php` динамически устанавливать `<html lang="{{ app()->getLocale() }}">`
- Это влияет на доступность и понимание языка поисковиками

### 4.4 Масштабирование на новые языки — **✅ Выполнено**

- Архитектура должна автоматически подхватывать новые локали из `config/site/languages.php`
- При добавлении нового языка: добавить папку `lang/{locale}/`, заполнить ключи `seo.*` — hreflang и meta подхватятся автоматически
- Неполные переводы хуже отсутствующих: Google деиндексирует страницы с пустыми мета-тегами. Перед публикацией новой локали — проверять наличие всех `seo.*` ключей

> **Реализация:**
> - `app/Services/SeoMetaResolver.php` — добавлены `buildHreflang()` и `canonical` в `resolve()`:
>   - canonical формируется из `config('app.url')` + `/{locale}/{path}` (без query params)
>   - hreflang: полный граф из всех локалей `config('site.languages.countries')` + x-default → en
> - `resources/views/layouts/app.blade.php` — серверные `<link rel="canonical">` и `<link rel="alternate" hreflang>` для ботов без JS
> - Клиентский слой (unhead в `usePageSeo.js`) обновляет canonical и hreflang при SPA-навигации
> - `<html lang>` уже был на месте: `str_replace('_', '-', app()->getLocale())`
> - Локали берутся из `config/site/languages.countries` — новый язык подхватывается автоматически

---

## Этап 5 — Structured Data (JSON-LD)

**Цель:** помочь поисковикам понять тип контента, повысить шансы на rich snippets.

> JSON-LD в SPA без prerender невидим для ботов. Этот этап эффективен только после реализации этапа 2.

### 5.1 Глобальная разметка Organization — **✅ Выполнено**

- На всех страницах добавить JSON-LD `@type: Organization`:
  - name, url, logo, contactPoint
- Вставлять через `useHead()` в корневом `App.vue` или layout
- Это даёт 80% пользы от structured data — начинать с этого

> **Реализация:**
> - `resources/views/layouts/app.blade.php` — серверный `<script type="application/ld+json">` с `@type: Organization`
> - Поля: name, url, logo, description, sameAs
> - Рендерится серверно в Blade — боты видят без JS
> - sameAs оставлен пустым — заполнить при появлении соцсетей (LinkedIn, Twitter и т.д.)

### 5.2 Разметка по типу страницы (низкий приоритет)

| Страница | Schema.org type |
|---|---|
| Главная | `WebSite` |
| О нас | `AboutPage` |
| Как это работает | `HowTo` или `FAQPage` (если формат Q&A) |
| Опрос | `WebPage` |
| Демо (все 5 секций) | `SoftwareApplication` / `WebApplication` |
| Публичный батч | `Product` или `Dataset` (зависит от контента) |
| Публичный отчёт | `Report` / `DataSet` |

### 5.3 BreadcrumbList (низкий приоритет)

- Добавить JSON-LD `BreadcrumbList` на все внутренние страницы
- Формировать автоматически из маршрута Vue Router

---

## Этап 6 — Техническое SEO

**Цель:** обеспечить техническую доступность контента для краулеров.

### 6.1 Sitemap XML — **✅ Выполнено**

- Создать Artisan-команду `php artisan sitemap:generate`
- Генерировать `public/sitemap.xml` со всеми публичными страницами
- Обязательно включить `<lastmod>` для каждого URL (Google использует для приоритизации краулинга)
- Для каждой страницы — варианты на всех доступных языках с hreflang
- Настроить `<changefreq>` и `<priority>` для разных типов страниц

> **Реализация:**
> - `app/Console/Commands/GenerateSitemap.php` — Artisan-команда `sitemap:generate`
>   - `STATIC_PATHS` — 11 статических страниц с changefreq и priority
>   - `buildAlternates()` — hreflang для всех 32 локалей + x-default
>   - `buildUrlEntry()` — формирует XML-блок `<url>` с loc, lastmod, changefreq, priority, xhtml:link
>   - Без внешних пакетов — собственная генерация XML
> - Результат: `public/sitemap.xml` с 275 URL (11 страниц x 25 локалей)
> - Динамические страницы (batch/report) — добавить когда появятся реальные данные из БД

### 6.2 robots.txt — **✅ Выполнено**

Обновить `public/robots.txt`:
```
User-agent: *
Disallow: /technical
Disallow: /api/
Disallow: /survey/submit
Disallow: /survey/verify

Sitemap: https://haccpilot.com/sitemap.xml
```

> **Реализация:**
> - `public/robots.txt` — закрыты /technical, /api/, /survey/submit, /survey/verify
> - Добавлена ссылка на sitemap.xml

### 6.3 Оптимизация производительности (Core Web Vitals)

Критично для ранжирования — Google использует CWV как фактор:

- **LCP (Largest Contentful Paint):**
  - оптимизировать загрузку hero-изображения на главной
  - preload критических шрифтов (Rubik уже через preconnect)
  - lazy load для изображений ниже fold
- **CLS (Cumulative Layout Shift):**
  - задавать явные width/height для изображений и контейнеров
  - шрифт с `font-display: swap` (уже есть через Google Fonts)
- **INP (Interaction to Next Paint):**
  - проверить тяжёлые обработчики (naive-ui 1.5MB чанк — следить за влиянием)
- Проверить и настроить HTTP-кеширование статических ресурсов (Vite уже добавляет хэши)
- Проверить сжатие (gzip/brotli) на уровне веб-сервера (OpenServer)
- Оптимизировать изображения: конвертация в WebP

---

## Этап 7 — Мониторинг и валидация

**Цель:** убедиться что SEO работает, настроить отслеживание.

### 7.1 Инструменты проверки

- Валидация OG-тегов: Facebook Sharing Debugger, Twitter Card Validator
- Валидация structured data: Google Rich Results Test
- Проверка hreflang: hreflang tag checker
- Проверка рендеринга: Google Search Console → URL Inspection
- Core Web Vitals: PageSpeed Insights, Lighthouse

### 7.2 Google Search Console

- Подтвердить владение доменом
- Отправить sitemap.xml
- Мониторить покрытие индексации и ошибки

### 7.3 Логирование ботов

- Логировать User-Agent для запросов ботов (Googlebot, Bingbot, и т.д.)
- Фиксировать prerender hit/miss (после реализации этапа 2.2)
- Отслеживать какие страницы краулятся и как часто

### 7.4 Аналитика

- Подключить Google Analytics 4 (или аналог) с учётом GDPR
- Настроить отслеживание по языковым версиям (dimension: locale)

---

## Порядок выполнения и приоритеты

```
Приоритет    Этап                                       Зависимости
─────────    ────                                       ───────────
КРИТИЧ.      1    Инфраструктура head + защита качества  —
КРИТИЧ.      2.1  Серверные meta в Blade (Вариант C)     —
КРИТИЧ.      2.2  Self-hosted Prerender (Вариант B)      —
КРИТИЧ.      3    Мета-теги на всех страницах             Этап 1
Высокий      6.1  Sitemap XML + lastmod                  —
Высокий      6.2  robots.txt                             —
Высокий      4.3  lang-атрибут <html>                    —
Средний      4    hreflang полностью                     Этап 1, 3
Средний      5.1  JSON-LD Organization                   Этап 2
Средний      2.3  OG-изображения                         —
Низкий       5.2  JSON-LD по типам страниц               Этап 5.1
Низкий       5.3  BreadcrumbList                         Этап 5.1
Низкий       6.3  Core Web Vitals                        —
Низкий       7    Мониторинг + логирование ботов         Этап 2, 6.1
```

---

## Критические замечания

1. **SPA без prerender — главная проблема.** Без рендеринга для ботов все мета-теги (unhead), structured data (JSON-LD), контент страниц — невидимы. Этап 2 — фундамент, без которого остальное имеет ограниченный эффект.

2. **Вариант C (серверные meta) — быстрый старт, но не решение.** Покрывает только meta-теги для соцсетей, но не контент страниц для индексации. Реализовать как первый шаг, затем обязательно Вариант B (prerender).

3. **Мультиязычность требует стратегии.** При добавлении новых языков каждый должен иметь полный набор SEO-переводов. Неполные переводы хуже отсутствующих — Google деиндексирует страницы с пустыми мета-тегами.

4. **Динамические страницы (батчи, отчёты)** генерируются из БД — для них нужен серверный fallback мета-тегов в Blade + prerender для полного контента.

5. **Контроль качества meta обязателен.** Пустые title/description, дубли, отсутствие fallback — всё это хуже, чем отсутствие мета-тегов.

---

## Вне текущего плана (учесть при масштабировании)

Эти пункты не входят в техническую реализацию, но критичны для SEO-результатов:

- **Keyword-стратегия:** семантическое ядро, кластеры, search intent — без этого мета-теги пишутся вслепую
- **Контентная стратегия:** 13 страниц мало для органического роста, нужен блог или knowledge base
- **Internal linking:** критично для SPA, страницы должны ссылаться друг на друга
- **Pagination/filters handling:** если появятся списки батчей с фильтрами — нужна стратегия для предотвращения SEO-дублей (noindex на фильтрованные, canonical на основную)
