# SendingMail - декомпозиция задачи

## 1) Настройка почты (Mailgun SMTP в Laravel)

### 1.1. Базовые переменные окружения

В `.env` уже указано:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=postmaster@sandboxe9f3215cb1d64ff6bd40a023af76057f.mailgun.org
MAIL_PASSWORD=мой пароль
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=postmaster@sandboxe9f3215cb1d64ff6bd40a023af76057f.mailgun.org
MAIL_FROM_NAME="${APP_NAME}"
```

### 1.2. Донастройка почтового конфига **✅ Выполнено **

1. Проверить,
   что `config/mail.php` использует значения из `.env`.
2. Убедиться,
   что адрес отправителя берется из `MAIL_FROM_ADDRESS` и `MAIL_FROM_NAME`.
3. Очистить и пересобрать кэш конфигурации:
   `config:clear`, `config:cache`.

Кратко:

- Проверен и донастроен `config/mail.php`.
- В секции `from` ключ `name` теперь использует `MAIL_FROM_NAME`
  с fallback на `APP_NAME`.
- Реализация: файл `config/mail.php`, секция `from`.

---

## 2) Отправка писем строго через очередь

### 2.1. Подготовка очередей **✅ Выполнено **

1. Выбрать и зафиксировать `QUEUE_CONNECTION`
   для среды (например, `database`).
2. Если используется `database`:
   создать таблицы очередей и запустить миграции.
3. Поднять worker очереди
   и убедиться, что задания обрабатываются без падений.

Кратко:

- `QUEUE_CONNECTION` переведен на `database`.
- Создана и применена миграция таблицы `jobs`.
- Проверка очереди выполнена:
  задача добавлена в `jobs`,
  обработана через `queue:work --once`,
  ошибок в `failed_jobs` нет.
- Реализация:
  файл `.env`, ключ `QUEUE_CONNECTION`;
  файл миграции `database/migrations/2026_04_08_101035_create_jobs_table.php`;
  обработка проверена на `app/Listeners/Technical/QueueTestMailListener.php`,
  метод `handle`.

---

## 3) Тест-страница (группа роутов `technical`) **✅ Выполнено **

```env
запуск в консоли для очередей - php artisan queue:work
страница тестового письма - http://haccpilot.local/technical
Смотреть в спаме на thwglobal2000@gmail.com
```

### 3.1. Роутинг **✅ Выполнено **

1. Добавить GET-роут страницы тестирования
   в `routes/web.php` внутри группы `technical`.
2. Добавить POST-роут
   для действия "Отправить тестовое письмо"
   в той же группе.
3. Ограничить доступ к странице
   только для технических/внутренних сценариев.

### 3.2. Контроллер/обработчик **✅ Выполнено **

1. Создать технический контроллер для страницы.
2. В POST-обработчике
   диспатчить queued-обработчик
   `QueueTestMailListener::dispatch(...)`.
3. Жестко зафиксировать адрес получателя:
   `thwglobal2000@gmail.com`.

### 3.3. UI страницы **✅ Выполнено **

1. Вывести кнопку `Отправить тестовое письмо`.
2. После нажатия показывать статус:
   "Запрос на отправку поставлен в очередь".
3. Показать базовую диагностику:
   время запроса и целевой email.
4. Адрес страницы - http://haccpilot.local/technical

### 3.4. Как получить результат (через очередь) **✅ Выполнено **

1. В консоли проекта запустить worker:
   `php artisan queue:work`
2. Открыть страницу:
   `http://haccpilot.local/technical`
3. Нажать кнопку:
   `Отправить тестовое письмо`.
4. Проверить результат:
   в консоли worker задача должна быть обработана без ошибки,
   письмо должно прийти на `thwglobal2000@gmail.com`
   (включая папку `Спам`).

Кратко:

- Поток теста зафиксирован через реальную очередь `database`.
- Реализация:
  обработка через `app/Http/Controllers/Technical/MailTestController.php`, метод `send`;
  выполнение задания в `app/Listeners/Technical/QueueTestMailListener.php`, метод `handle`.

Кратко:

- Реализована техническая страница
  и backend-цепочка отправки.
- Роуты: `routes/web.php`.
- Контроллер:
  `app/Http/Controllers/Technical/MailTestController.php`,
  методы `index`, `send`.
- Очередной обработчик:
  `app/Listeners/Technical/QueueTestMailListener.php`,
  методы `__construct`, `handle`.
- Письмо:
  `app/Mail/Technical/TestMail.php`,
  методы `envelope`, `content`.
- UI:
  `resources/views/technical/index.blade.php`.
- Шаблон письма:
  `resources/views/emails/technical/test-mail.blade.php`.

---
