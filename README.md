# HACCP-EUDR

Laravel 10 проект с Vue.js 3.4.0 и SCSS.

## Адреса
- Проект: [haccp-eudr.local](http://haccp-eudr.local/)
- Mysql: [PhpMyAdmin](http://phpmyadmin/index.php?route=/database/structure&db=haccp-eudr&server=8)

### Режим разработки

Запустите Vite dev server:

```bash
npm run dev
```

Vite будет доступен по адресу: `http://haccp-eudr.local:5179/`

### Сборка для продакшена

```bash
npm run build
```

## Технологии

- **Backend**: Laravel 10
- **Frontend**: Vue.js 3.4.0 (Options API)
- **Сборщик**: Vite 4
- **Стили**: SCSS

## Используемые пакеты

### Frontend зависимости

- **[Vue.js](https://vuejs.org/)** (^3.4.0) - Прогрессивный JavaScript фреймворк
- **[Vue Router](https://router.vuejs.org/)** (^4.6.4) - Официальный роутер для Vue.js
- **[Heroicons](https://heroicons.com/)** ([@heroicons/vue](https://github.com/tailwindlabs/heroicons) ^2.2.0) - Красивые SVG иконки от создателей Tailwind CSS
- **[Naive UI](https://www.naiveui.com/en-US/os-theme/components/button)** (^2.43.2) - UI библиотека компонентов для Vue 3
- **[Xicons](https://www.xicons.org/#/)** ([@vicons/antd](https://github.com/07akioni/xicons) ^0.13.0) - Иконки для библиотеки Naive UI
- **[@vicons/utils](https://github.com/07akioni/xicons)** (^0.1.4) - Утилиты для работы с иконками
- **[vue-tel-num-input](https://github.com/MarkMinerov/vue-tel-num-input)** (^0.1.10) - Компонент ввода телефонного номера с выбором страны и валидацией
- **[libphonenumber-js](https://github.com/catamphetamine/libphonenumber-js)** (^1.12.33) - Библиотека для валидации и форматирования телефонных номеров (peer dependency для vue-tel-num-input)

### Инструменты разработки

- **[Vite](https://vitejs.dev/)** (^5.4.0) - Сборщик и dev-сервер
- **[@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue)** (^4.5.0) - Плагин Vite для Vue.js
- **[Laravel Vite Plugin](https://github.com/laravel/vite-plugin)** (^1.0.0) - Плагин для интеграции Vite с Laravel
- **[Sass](https://sass-lang.com/)** (^1.69.0) - Препроцессор CSS
- **[Axios](https://axios-http.com/)** (^1.1.2) - HTTP клиент

### Инструменты качества кода

- **[ESLint](https://eslint.org/)** (^9.39.2) - Линтер для JavaScript и Vue
- **[@eslint/js](https://github.com/eslint/eslint)** (^9.39.2) - Базовая конфигурация ESLint
- **[@babel/eslint-parser](https://github.com/babel/babel/tree/main/eslint/babel-eslint-parser)** (^7.28.5) - Парсер Babel для ESLint
- **[eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue)** (^10.6.2) - Плагин ESLint для Vue.js
- **[eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)** (^10.1.8) - Отключает правила ESLint, конфликтующие с Prettier
- **[eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)** (^5.5.4) - Интеграция Prettier в ESLint
- **[@vue/eslint-config-prettier](https://github.com/vuejs/eslint-config-prettier)** (^10.2.0) - Конфигурация Prettier для Vue
- **[Prettier](https://prettier.io/)** (^3.7.4) - Форматтер кода

#### Команды для работы с инструментами качества кода

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

**Разница:**

- **ESLint** (`npm run lint:fix`) — исправляет логические ошибки и стилистические проблемы кода
- **Prettier** (`npm run format`) — исправляет только форматирование (внешний вид кода)
- **Комбинированная** (`npm run lint:format`) — исправляет всё сразу (рекомендуется)

## Требования

- PHP >= 8.1
- Composer
- Node.js >= 16.x
- npm или yarn
- OpenServer (для Windows)

## Установка

### 1. Клонирование и установка PHP зависимостей

```bash
composer install
```

### 2. Настройка окружения

Создайте файл `.env` на основе `.env.example` (если есть) или создайте новый:

```bash
cp .env.example .env
```

Или создайте `.env` вручную с базовыми настройками для OpenServer.

Сгенерируйте ключ приложения:

```bash
php artisan key:generate
```

### 3. Настройка базы данных

В файле `.env` укажите параметры подключения к БД:

```env
DB_CONNECTION=mysql
DB_HOST=MySQL-8.0
DB_PORT=3306
DB_DATABASE=haccp-eudr
DB_USERNAME=root
DB_PASSWORD=
```

Выполните миграции:

```bash
php artisan migrate
```

### 4. Настройка сессий для HTTP

В файле `.env` добавьте (для работы по HTTP):

```env
APP_URL=http://haccp-eudr.local
SESSION_SECURE_COOKIE=false
```

### 5. Установка JavaScript зависимостей

```bash
npm install
```

### Vue DevTools

Для Vue 3 используйте Vue DevTools v7 (поддерживает Vue 3).
