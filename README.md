# HACCP-EUDR

Laravel 10 проект с Vue.js 3.4.0 и SCSS.

## Требования

- PHP >= 8.1 (тестировалось на 8.3)
- Composer
- Node.js >= 18.x
- npm
- OpenServer (для Windows)

## Настройка окружения

Создайте файл `.env` на основе `.env.example` (если есть) или создайте новый:

```bash
cp .env.example .env
```

## Настройка ENV

Параметры подключения к БД:

```env
DB_CONNECTION=mysql
DB_HOST=MySQL-8.0
DB_PORT=3306
DB_DATABASE=haccpilot
DB_USERNAME=root
DB_PASSWORD=
```

Параметры почты app.mailgun.com:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=мой логин
MAIL_PASSWORD=мой пароль
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=мой логин
MAIL_FROM_NAME="${APP_NAME}"
```

## Установка зависимостей

```env
 - Установка пакетов
composer install
npm install
 - Генерация уникального ключа приложения
php artisan key:generate
 - Миграции с seeder
php artisan migrate:fresh --seed
 - Отработка задач
php artisan queue:work
 - разработка в браузере
npm run dev
npm run build
 - просмотр в смартфоне
npm run serve:mobile
 - генерация sitemap.xml (запускать после добавления новых страниц или локалей, создает public/sitemap.xml со всеми публичными URL и hreflang)
php artisan sitemap:generate
```

## Адреса

- Проект: [haccp-eudr.local](http://haccp-eudr.local/)
- Смартфон: [http://192.168.101.11:8000](http://192.168.101.11:8000)
- Mysql: [PhpMyAdmin](http://phpmyadmin/index.php?route=/database/structure&db=haccp-eudr&server=8)
- Почта: [Почта](http://192.168.101.11:8025)

## Тестовая почта локально

### Запуск Mailpit

1. Открой командную строку (Win + R → `cmd` → Enter)
   Перейди в папку Mailpit:
   cd /d D:\programm\Mailpit\mailpit-windows-amd64
2. Запуск Mailpit браузера: Mailpit.exe
   http://192.168.101.11:8025

## Технологии

- **Backend**: Laravel 10 (PHP ^8.1)
- **Frontend**: Vue.js 3.4 + Inertia.js v2 (Composition API через `<script setup>`)
- **State**: Pinia 3
- **i18n**: vue-i18n 11
- **Сборщик**: Vite 5 (с SSR-сборкой через `vite build --ssr`)
- **Стили**: SCSS

## Используемые пакеты, сервисы, инструменты

- **Backend (PHP / Laravel):**
    - `laravel/framework` (Laravel 10)
    - `laravel/sanctum`
    - `laravel/tinker`
    - `guzzlehttp/guzzle`
    - `inertiajs/inertia-laravel` (адаптер Inertia для Laravel + SSR)
    - `sentry/sentry-laravel` (error tracking)

- **Frontend (Vue):**
    - `vue` 3.4
    - `@inertiajs/vue3` (SPA-навигация на Inertia)
    - `pinia` 3
    - `vue-i18n` 11
    - `vue-router` 4
    - `@unhead/vue` (управление `<head>` / SEO-meta)
    - `naive-ui`
    - `vue3-toastify` (на публичных страницах — основной toast)
    - `qrcode`
    - `uuid`
    - `libphonenumber-js`
    - `i18n-iso-countries`
    - `vue-tel-num-input`

- **Иконки:**
    - `@heroicons/vue`
    - `@tabler/icons-vue`
    - `@carbon/icons-vue`
    - `@vicons/*` (`antd`, `carbon`, `fluent`, `ionicons4`, `ionicons5`, `material`)

- **Сборка и стили:**
    - `vite` 5
    - `@vitejs/plugin-vue`
    - `laravel-vite-plugin`
    - `sass` (SCSS)
    - SSR-сборка: `npm run build` (= `vite build && vite build --ssr`)

- **Качество кода и форматирование:**
    - `eslint`
    - `eslint-plugin-vue`
    - `eslint-plugin-prettier`
    - `prettier`
    - `laravel/pint`
    - `larastan/larastan` (статический анализ, см. [PHPStan.md](Documents/developer/PHPStan.md))

- **Тестирование и отладка:**
    - `phpunit/phpunit`
    - `nunomaduro/collision`
    - `spatie/laravel-ignition`
    - `fakerphp/faker`
    - `mockery/mockery`

- **Почта и очереди:**
    - SMTP через `Mailgun` (`smtp.mailgun.org`)
    - Laravel Queue (`database` driver)
    - Worker: `php artisan queue:work`

- **База данных и окружение:**
    - `MySQL` (OpenServer / OSPanel)
    - `PhpMyAdmin` для администрирования БД
    - Локальный домен проекта: `http://haccpilot.local`

## Команды для работы с инструментами качества кода

**Основная команда:**

- `npm run lint:format` — прогоняет ESLint `--fix`, затем Prettier `--write` по всему проекту.

**ESLint** (логические ошибки + стилистические проблемы кода):

- `npm run lint` — проверка
- `npm run lint:fix` — авто-исправление

Конфиг: [eslint.config.mjs](eslint.config.mjs) (flat-config, ESLint 9). Browser/Node globals подключаются через пакет [`globals`](https://www.npmjs.com/package/globals) (`globals.browser`, `globals.node`). Игнорируемые пути: `node_modules`, `vendor`, `public/build`, `storage`, `bootstrap/cache`, `bootstrap/ssr`, `Documents`, `*.config.{js,mjs}`.

**Prettier** (форматирование: отступы, переносы, кавычки, trailing commas, длина строк):

- `npm run format` — авто-исправление
- `npm run format:check` — проверка без изменений (под маской `**/*.{js,jsx,vue,json,css,scss,md}`)

Конфиг: [.prettierrc.json](.prettierrc.json). Ключевые правила:

- `printWidth: 100`, `tabWidth: 4`, `useTabs: false`
- `singleQuote: true`, `trailingComma: 'all'`, `semi: true`
- `endOfLine: 'lf'`
- Override для `*.{json,yml,yaml}` → `tabWidth: 2` (стандарт JSON/YAML)
- Override для `*.md` → `proseWrap: 'preserve'` (не ломает ручные переносы)

Игноры Prettier: [.prettierignore](.prettierignore) — `node_modules`, `vendor`, build-артефакты (`bootstrap/ssr`, `bootstrap/cache`, `public/build`, `public/hot`, `public/sitemap.xml`, `storage`), lock/env-файлы, `Documents/` (рукописные планы), `*.php` (его форматирует Pint).

**Pint** (PHP-форматирование):

- `vendor/bin/pint` — авто-исправление PHP-файлов (`app/`, `routes/`, `database/`, `tests/`, `config/`).
- `vendor/bin/pint --test` — проверка без изменений.

**Разница:**

- **ESLint** — ловит ошибки логики и code style для JS/Vue (через `eslint-plugin-vue` + `eslint-plugin-prettier`)
- **Prettier** — приводит формат файла к каноническому виду (только внешний вид)
- **Pint** — то же самое, но для PHP-кода (на основе PHP-CS-Fixer)

## Статический анализ PHP (PHPStan / Larastan)

Конфиг: [phpstan.neon](phpstan.neon). Полная документация: [Documents/developer/PHPStan.md](Documents/developer/PHPStan.md).

- `composer stan` — прогон анализа (`phpstan analyse --memory-limit=1G`), уровень 5, пути `app` и `routes`.
- `vendor/bin/phpstan analyse app/Services/SurveyResponseService.php` — проверка одного файла.
- `vendor/bin/phpstan --version` — версия установленного PHPStan.

Ловит вызовы методов на `null`, неверные сигнатуры, несуществующие свойства/ключи массивов, типовые несостыковки. Уровень повышается постепенно (5 → 6 → 7) по мере чистки кода.
