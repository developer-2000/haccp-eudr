# Safe Batch

Laravel 10 проект с Vue.js 3.4.0 и SCSS.

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

### Инструменты разработки

- **[Vite](https://vitejs.dev/)** (^4.0.0) - Сборщик и dev-сервер
- **[@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue)** (^4.5.0) - Плагин Vite для Vue.js
- **[Laravel Vite Plugin](https://github.com/laravel/vite-plugin)** (^0.7.2) - Плагин для интеграции Vite с Laravel
- **[Sass](https://sass-lang.com/)** (^1.69.0) - Препроцессор CSS
- **[Axios](https://axios-http.com/)** (^1.1.2) - HTTP клиент

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
DB_DATABASE=safe-batch
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
APP_URL=http://safe-batch.local
SESSION_SECURE_COOKIE=false
```

### 5. Установка JavaScript зависимостей

```bash
npm install
```

## Запуск проекта

Проект будет доступен по адресу: `http://safe-batch.local/`

### Режим разработки

Запустите Vite dev server:

```bash
npm run dev
```

Vite будет доступен по адресу: `http://safe-batch.local:5179/`

### Сборка для продакшена

```bash
npm run build
```

### Vue DevTools

Для Vue 3 используйте Vue DevTools v7 (поддерживает Vue 3).
