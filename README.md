# Safe Batch

Laravel 10 проект с Vue.js 2.6.12 и SCSS.

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

### 4. Установка JavaScript зависимостей

```bash
npm install
```

## Запуск проекта
Проект будет доступен по адресу: `https://safe-batch.local/`

### Режим разработки

```bash
npm run dev
```

### Сборка для продакшена

```bash
npm run build
```
