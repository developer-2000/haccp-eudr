# HACCP-EUDR

Laravel 10 проект с Vue.js 3.4.0 и SCSS.

## Требования

- PHP >= 8.1
- Composer
- Node.js >= 16.x
- npm или yarn
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
```

## Адреса

- Проект: [haccp-eudr.local](http://haccp-eudr.local/)
- Смартфон: [http://192.168.101.11:8000](http://192.168.101.11:8000)
- Mysql: [PhpMyAdmin](http://phpmyadmin/index.php?route=/database/structure&db=haccp-eudr&server=8)

## Тестовая почта локально
### Запуск Mailpit
1. Открой командную строку (Win + R → `cmd` → Enter)
   Перейди в папку Mailpit:
   cd /d D:\programm\Mailpit\mailpit-windows-amd64
2. Запуск Mailpit браузера: Mailpit.exe
   http://192.168.101.11:8025

## Технологии

- **Backend**: Laravel 10
- **Frontend**: Vue.js 3.4.0 (Options API)
- **Сборщик**: Vite 4
- **Стили**: SCSS

## Используемые пакеты, сервисы, инструменты

- **Backend (PHP / Laravel):**
  - `laravel/framework` (Laravel 10)
  - `laravel/sanctum`
  - `laravel/tinker`
  - `guzzlehttp/guzzle`

- **Frontend (Vue):**
  - `vue` 3
  - `vue-router`
  - `pinia`
  - `vue-i18n`
  - `naive-ui`
  - `vue3-toastify`
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
  - `vite`
  - `@vitejs/plugin-vue`
  - `laravel-vite-plugin`
  - `sass` (SCSS)

- **Качество кода и форматирование:**
  - `eslint`
  - `eslint-plugin-vue`
  - `eslint-plugin-prettier`
  - `prettier`
  - `laravel/pint`

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

**Рекомендуется использовать:**

- `npm run lint:format` — **основная команда** для авто исправления всех проблем (сначала ESLint, затем Prettier)

**Отдельные команды:**

**ESLint:**

- `npm run lint` — проверка кода на ошибки и предупреждения
- `npm run lint:fix` — проверка и автоматическое исправление ошибок кода

    Команда `lint:fix` исправляет:
    - **Логические ошибки**: неиспользуемые переменные, недостижимый код, неправильное использование API
    - **Стилистические**: пробелы, отступы, лишние/недостающие пробелы вокруг операторов
    - **Кавычки**: одинарные/двойные кавычки (согласно правилам)
    - **Точки с запятой**: лишние или недостающие точки с запятой
    - **Импорты**: порядок и форматирование импортов
    - **Vue.js**: правила форматирования компонентов (атрибуты, теги)
    - **Prettier**: правила форматирования, интегрированные через eslint-plugin-prettier

**Prettier:**

- `npm run format` — авто исправление форматирования кода (JavaScript, JSX, Vue, JSON, CSS, SCSS, Markdown файлы)
- `npm run format:check` — проверка форматирования без изменений

    Команда `format` исправляет только форматирование:
    - **Отступы и пробелы**: неправильные отступы, лишние/недостающие пробелы
    - **Переносы строк**: длина строк, переносы длинных выражений
    - **Кавычки**: одинарные/двойные кавычки (согласно настройкам)
    - **Точки с запятой**: добавление/удаление точек с запятой
    - **Скобки и запятые**: пробелы вокруг скобок, запятые в конце массивов/объектов
    - **Стрелки функций**: форматирование стрелочных функций
    - **HTML/Vue теги**: форматирование атрибутов, отступы в шаблонах
    - **CSS/SCSS**: форматирование селекторов, свойств, значений
    - **JSON**: форматирование структуры, отступы, запятые

**Форматирование тегов (Vue `<template>`, разметка в `.vue`):**

- Приводит в порядок **Prettier** — в проекте он запускается через `npm run format` (или точечно: `npx prettier --write "путь/к/файлу.vue"`).
- Команда переписывает шаблон: переносы атрибутов, отступы вложенных тегов, разбиение длинных строк — по общим правилам Prettier для Vue.
- Проверка без изменений файлов: `npm run format:check`.
- Чтобы одновременно прогнать ESLint и затем Prettier по всему проекту: `npm run lint:format` (рекомендуется после правок в компонентах).

**Разница:**

- **ESLint** (`npm run lint:fix`) — исправляет логические ошибки и стилистические проблемы кода
- **Prettier** (`npm run format`) — исправляет только форматирование (внешний вид кода)
- **Комбинированная** (`npm run lint:format`) — исправляет всё сразу (рекомендуется)


