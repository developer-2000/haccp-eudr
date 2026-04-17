# QWEN.md — HACCP-EUDR Project Context

## Глобальное правило

**Всегда выполнять только то, что сказано. Не пытаться делать то, чего не просили.**

**Править, редактировать, создавать — именно там, где показано. Не принимать самостоятельных решений о том, куда вставлять код или в какие файлы вносить изменения.**

## Project Overview

**HACCP-EUDR** — это Laravel 10 SPA-приложение с Vue.js 3.4.0, предназначенное для работы с системами HACCP (Hazard Analysis and Critical Control Points) и EUDR (European Union Deforestation Regulation).

### Архитектура

- **Backend**: Laravel 10 (PHP 8.1+) с REST API
- **Frontend**: Vue.js 3.4.0 (Options API) — Single Page Application
- **Сборщик**: Vite 5.4 с laravel-vite-plugin
- **Стили**: SCSS
- **База данных**: MySQL 8.0 (через OpenServer/OSPanel на Windows)
- **State Management**: Pinia
- **UI Framework**: Naive UI
- **I18n**: vue-i18n с мультиязычной поддержкой
- **Роутинг**: vue-router с локализованными URL

### Ключевые возможности

- Мультиязычность (локаль в URL: `/{locale}/...`)
- Публичные карточки партий EUDR (`/batch/{id}`)
- Дневные отчёты HACCPilot (`/report/{date}`)
- Система опросов с вопросами и ответами
- Email уведомления через SMTP/Mailgun
- Очереди задач (Laravel Queue)
- QR-коды генерация
- Интеграция с телефонными номерами (libphonenumber-js)

---

## Directory Structure

```
haccp-eudr/
├── app/                    # Laravel application code
│   ├── Console/            # Artisan commands
│   ├── Enums/              # PHP enums
│   ├── Events/             # Event classes
│   ├── Exceptions/         # Exception handlers
│   ├── Helpers/            # Helper functions (helpers.php)
│   ├── Http/               # Controllers, Middleware, Requests
│   ├── Listeners/          # Event listeners
│   ├── Mail/               # Mailable classes
│   ├── Models/             # Eloquent models
│   ├── Notifications/      # Notification classes
│   ├── Providers/          # Service providers
│   └── Services/           # Service classes
├── bootstrap/              # Laravel bootstrap files
├── config/                 # Laravel configuration
├── database/               # Migrations, seeders, factories
├── Documents/              # Documentation files
├── lang/                   # Translation files
├── public/                 # Public assets
├── resources/              # Frontend source code
│   ├── js/                 # Vue.js application
│   │   ├── basic/          # Basic utilities
│   │   ├── components/     # Vue components
│   │   ├── composables/    # Vue composables
│   │   ├── config/         # Configuration
│   │   ├── features/       # Feature modules
│   │   ├── pages/          # Vue page components
│   │   ├── stores/         # Pinia stores
│   │   ├── utils/          # Utility functions
│   │   ├── app.js          # Main entry point
│   │   ├── router.js       # Vue Router configuration
│   │   ├── i18n.js         # Internationalization setup
│   │   └── technical.js    # Technical utilities entry point
│   ├── scss/               # SCSS stylesheets
│   └── views/              # Blade templates
├── routes/                 # Route definitions
│   ├── api.php             # API routes
│   ├── channels.php        # Broadcasting channels
│   ├── console.php         # Artisan console routes
│   └── web.php             # Web routes
├── storage/                # Logs, cache, uploads
└── tests/                  # PHPUnit tests
    ├── Unit/               # Unit tests
    └── Feature/            # Feature tests
```

---

## Key Files

| File | Description |
|------|-------------|
| `composer.json` | PHP зависимости и скрипты |
| `package.json` | JS зависимости и npm скрипты |
| `vite.config.mjs` | Конфигурация Vite сборки |
| `eslint.config.mjs` | ESLint конфигурация (flat config) |
| `phpunit.xml` | PHPUnit конфигурация |
| `.env.example` | Шаблон переменных окружения |
| `routes/web.php` | Основные маршруты приложения |
| `resources/js/app.js` | Точка входа Vue приложения |

---

## Technologies & Packages

### Backend (PHP / Laravel)
- `laravel/framework` ^10.0
- `laravel/sanctum` — API аутентификация
- `laravel/tinker` — REPL для Laravel
- `guzzlehttp/guzzle` — HTTP клиент

### Frontend (Vue)
- `vue` ^3.4.0
- `vue-router` ^4.6.4
- `pinia` ^3.0.4
- `vue-i18n` ^11.3.0
- `naive-ui` ^2.43.2
- `vue3-toastify` ^0.2.9
- `qrcode` ^1.5.4
- `uuid` ^13.0.0
- `libphonenumber-js` ^1.12.33
- `i18n-iso-countries` ^7.14.0
- `vue-tel-num-input` ^0.1.10

### Icon Libraries
- `@heroicons/vue` ^2.2.0
- `@tabler/icons-vue` ^3.41.0
- `@carbon/icons-vue` ^10.99.1
- `@vicons/*` (antd, carbon, fluent, ionicons4/5, material)

### Build & Code Quality
- `vite` ^5.4.0
- `@vitejs/plugin-vue` ^4.5.0
- `laravel-vite-plugin` ^1.0.0
- `sass` ^1.69.0
- `eslint` ^9.39.2
- `eslint-plugin-vue` ^10.6.2
- `eslint-plugin-prettier` ^5.5.4
- `prettier` ^3.7.4
- `laravel/pint` — PHP форматирование

### Testing
- `phpunit/phpunit` ^10.0
- `mockery/mockery` — Mock объекты
- `fakerphp/faker` — Генерация тестовых данных
- `nunomaduro/collision` — Улучшенные ошибки
- `spatie/laravel-ignition` — Страницы ошибок

---

## Building and Running

### Initial Setup

```bash
# 1. Установка PHP зависимостей
composer install

# 2. Установка JS зависимостей
npm install

# 3. Создание .env файла
cp .env.example .env

# 4. Генерация ключа приложения
php artisan key:generate

# 5. Миграции с заполнением тестовыми данными
php artisan migrate:fresh --seed
```

### Development

```bash
# Запуск Vite dev сервера (горячая перезагрузка)
npm run dev

# Запуск сервера для мобильного (доступ по сети)
npm run serve:mobile

# Запуск worker для обработки очередей
php artisan queue:work
```

### Production Build

```bash
# Сборка для продакшена
npm run build
```

### URLs

- **Основной проект**: http://haccp-eudr.local/
- **Мобильный доступ**: http://192.168.101.11:8000
- **Vite dev сервер**: http://192.168.101.11:5179
- **PhpMyAdmin**: http://phpmyadmin/index.php

---

## Code Quality Commands

### JavaScript/Vue

```bash
# Проверка кода (ESLint)
npm run lint

# Проверка и авто исправление (ESLint)
npm run lint:fix

# Проверка форматирования (Prettier)
npm run format:check

# Авто исправление форматирования (Prettier)
npm run format

# Комбинированная проверка и исправление (РЕКОМЕНДУЕТСЯ)
npm run lint:format
```

### PHP

```bash
# Форматирование PHP кода (Laravel Pint)
./vendor/bin/pint

# Запуск PHPUnit тестов
./vendor/bin/phpunit

# или через artisan
php artisan test
```

---

## Development Conventions

### JavaScript/Vue

- **ESLint**: flat config в `eslint.config.mjs`
- **Prettier**: авто форматирование JS/JSX/Vue/JSON/CSS/SCSS/Markdown
- **Vue**: Options API (не Composition API)
- **Парсер**: @babel/eslint-parser
- **Правила**:
  - `no-console`: off (разрешён)
  - `vue/multi-word-component-names`: off
  - `vue/no-reserved-component-names`: off
  - `vue/html-self-closing`: off
  -_unused vars_: warn с игнором `^_`

### PHP

- **Стандарт**: Laravel conventions
- **Форматирование**: Laravel Pint
- **PSR-4 Autoloading**: `App\` → `app/`
- **Helpers**: `app/Helpers/helpers.php` загружается автоматически

### Testing

- **Фреймворк**: PHPUnit ^10.0
- **Структура**: `tests/Unit/` и `tests/Feature/`
- **Суффикс файлов**: `*Test.php`
- **Тестовое окружение**: APP_ENV=testing, array drivers для cache/mail/session

### I18n (Мультиязычность)

- Локаль передаётся в URL: `/{locale}/...`
- Поддерживаемые локали определяются через `available_locales()`
- Middleware `SetLocale` устанавливает локаль из URL
- Переключение локали: POST `/locale` → сохранение в session/cookie
- vue-i18n синхронизируется с router при навигации

---

## Database

- **Driver**: MySQL 8.0
- **Host**: MySQL-8.0 (OpenServer)
- **Database**: `haccp-eudr`
- **Username**: root
- **Password**: (пустой)
- **Queue Driver**: sync (dev), database (prod)
- **Session Driver**: file
- **Cache Driver**: file

---

## Email Configuration

- **Mailer**: SMTP
- **Host**: 192.168.101.11 (dev)
- **Port**: 1025 (dev), 587 (prod с Mailgun)
- **Тестирование**: http://haccp-eudr.local/technical/mail-test

---

## Environment Variables (.env)

Основные переменные окружения:

```env
APP_NAME="HACCP-EUDR"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://haccp-eudr.local

DB_CONNECTION=mysql
DB_HOST=MySQL-8.0
DB_DATABASE=haccp-eudr
DB_USERNAME=root
DB_PASSWORD=

VITE_HOST=192.168.101.11
```

---

## Notes

- **OpenServer (OSPanel)**: проект работает под Windows через OpenPanel
- **Домен**: haccp-eudr.local настраивается в OpenServer
- **Vite Build Cache**: каждый билд получает уникальный суффикс для кэширования
- **Public Images**: плагин Vite копирует `public/images` → `public/build/images`
- **Naive UI Chunking**: отдельный чанк для naive-ui в production сборке
