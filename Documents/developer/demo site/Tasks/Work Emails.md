# Отправка писем — работа, Mailpit, очередь, тесты

Документ описывает реальный pipeline отправки писем проекта:
локальный SMTP через Mailpit,
очередь на драйвере `database`,
шесть Mailable-классов,
тестовая страница `/technical` и PHPUnit-тесты.

---

## 1) Mailpit как локальный SMTP

Локально всё идёт в Mailpit — почтовый sink:

- SMTP-приёмник на `127.0.0.1:1025`
- Web UI на `http://127.0.0.1:8025`

Фрагмент `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=noreply@haccpilot.local
MAIL_FROM_NAME="${APP_NAME}"
```

После правки `.env`:

```bash
php artisan config:clear
```

Особенности локального режима:

- `MAIL_USERNAME/PASSWORD/ENCRYPTION=null` —
  Mailpit принимает анонимно, без TLS.
- `MAIL_FROM_ADDRESS` может быть любым —
  DKIM/SPF локально не проверяются.
- Все письма приходят в UI `http://127.0.0.1:8025`
  во вкладку «Inbox».

---

## 2) Очередь на драйвере `database`

Все Mailable отправляются **только через очередь**,
синхронный SMTP-вызов из HTTP-запроса не используется —
это даёт фиксированное время ответа контроллера
и отсутствие UX-тормозов на письмах.

Конфигурация:

```env
QUEUE_CONNECTION=database
```

Таблицы:

- `jobs` — активные задания
- `failed_jobs` — упавшие задания
  (миграция `database/migrations/2026_04_08_101035_create_jobs_table.php`)

Воркер:

```bash
php artisan queue:work
```

---

## 3) Реальный поток письма

Конкретный пример — forma Contact, но схема общая для всех 6 писем.

1. Пользователь отправляет форму.
   Контроллер/сервис делает
   `SendContactAdminNotifyListener::dispatch(...)`.
2. Listener реализует `ShouldQueue` —
   Laravel сериализует объект и вставляет строку в `jobs`.
3. HTTP-ответ пользователю возвращается **сразу**,
   письмо в этот момент ещё не отправлено.
4. Воркер `queue:work` берёт строку из `jobs`,
   вызывает `handle()` у listener-а.
5. Внутри `handle()` —
   `Mail::send(new ContactAdminNotifyMail($toEmail, ...))`.
6. Mailable формирует `Envelope`
   (`from`, `to`, `replyTo`, `subject`) и `Content` (blade-шаблон).
7. Laravel отдаёт готовое письмо в SMTP-транспорт.
   Локально это Mailpit на `127.0.0.1:1025`.
8. Письмо появляется в UI `http://127.0.0.1:8025`.
   Строка из `jobs` удаляется.
   При ошибке (`n-ая` попытка) — уходит в `failed_jobs`.

Важная деталь:
email получателя живёт **внутри Envelope** (`to: [...]`),
а не в `Mail::to(...)->send(...)`.
Единый формат для всех 6 Mailable:
`from = config('mail.from.address')`,
`to = [$this->toEmail]`,
для админских писем дополнительно `replyTo = email пользователя`.

---

## 4) Mailable проекта

Шесть классов, все `extends Mailable`.
Отправляются через соответствующие listener-ы,
реализующие `ShouldQueue`.

**ContactAdminNotifyMail** —
`app/Mail/Contact/ContactAdminNotifyMail.php`.
Получатель: `EMAIL_ADMIN`.
Триггер: сабмит публичной Contact-формы.

**SurveyAdminNotifyMail** —
`app/Mail/Survey/SurveyAdminNotifyMail.php`.
Получатель: `EMAIL_ADMIN`.
Триггер: создание или обновление ответа опроса.

**SurveyThankYouMail** —
`app/Mail/Survey/SurveyThankYouMail.php`.
Получатель: email респондента.
Триггер: первичная отправка опроса.

**SurveyVerificationCodeMail** —
`app/Mail/Survey/SurveyVerificationCodeMail.php`.
Получатель: email респондента.
Триггер: попытка обновить уже отправленные ответы
(4-значный код).

**SurveyAnswersUpdatedMail** —
`app/Mail/Survey/SurveyAnswersUpdatedMail.php`.
Получатель: email респондента.
Триггер: успешное обновление ответов после ввода кода.

**TestMail** —
`app/Mail/Technical/TestMail.php`.
Получатель: произвольный.
Триггер: кнопка на `/technical`, техническая проверка SMTP.

Рядом с каждым Mailable — listener в `app/Listeners/**`,
который делает `Mail::send(new XMail(...))` из `handle()`.

---

## 5) Тестовая страница `/technical`

Страница для ручной проверки pipeline.

- Адрес: `/technical`
- UI: `resources/js/pages/technical/TechnicalPage.vue`
- Контроллер: `app/Http/Controllers/Technical/MailTestController.php`

Две кнопки:

**«Отправить тестовое письмо»** —
`POST /technical/mail-test/send` →
`QueueTestMailListener::dispatch('thwglobal2000@gmail.com')`.
В `jobs` добавляется 1 строка.

**«Поставить в очередь все 6 писем → EMAIL_ADMIN»** —
`POST /technical/mail-test/send-all` →
диспатчит все 6 listener-ов с получателем `config('mail.admin_email')`.
В `jobs` добавляется 6 строк.
Если `EMAIL_ADMIN` пуст — кнопка задизейблена,
контроллер ничего не ставит.

Ручная проверка:

1. В консоли:
   `php artisan queue:work`
2. В браузере:
   `http://haccpilot.local/technical`
3. Нажать любую кнопку.
4. В терминале worker-а появится лог обработки задания.
5. В UI Mailpit `http://127.0.0.1:8025` появится письмо(а).

---

## 6) PHPUnit-тесты

### Что тестируется

Файл: `tests/Feature/Technical/MailQueueAllTest.php`

`test_send_all_queued_inserts_six_real_jobs`

- Делает POST на `technical.mail-test.send-all`.
- Проверяет редирект + flash-статус.
- **Считает реальные строки в таблице `jobs`**:
  до запроса и после.
  Должно быть +6.
- Транзакций нет — после теста 6 строк **остаются в БД**,
  их можно увидеть глазами
  (`SELECT * FROM jobs` или через phpmyadmin),
  и потом обработать `php artisan queue:work`.

`test_send_all_queued_does_nothing_without_admin_email`

- Подменяет `config('mail.admin_email')` на пустую строку.
- Проверяет, что `jobs` не пополнилась ни одной строкой.

### Ключевые тонкости

- `phpunit.xml` задаёт `QUEUE_CONNECTION=sync` и `MAIL_MAILER=array` —
  глобально синхронный режим с перехватом почты.
- В `setUp()` теста **переопределяется** на `database`:
  `$this->app['config']->set('queue.default', 'database');`.
  Только так listener уйдёт в реальную таблицу `jobs`,
  а не выполнится синхронно.
- `VerifyCsrfToken` снят, `Cache::flush()` — сброс throttle.
- БД теста = dev-БД проекта (в `phpunit.xml` переопределения нет).
  Поэтому строки, добавленные тестом, появятся в той же `jobs`,
  что и в обычной работе.

### Команда запуска

```bash
php artisan test --filter=MailQueueAllTest
```

После прогона — в `jobs` 6 новых строк.
Чтобы письма приехали в Mailpit:

```bash
php artisan queue:work
```

---

## 7) Связанные файлы

Mailable:

- `app/Mail/Contact/ContactAdminNotifyMail.php`
- `app/Mail/Survey/SurveyAdminNotifyMail.php`
- `app/Mail/Survey/SurveyThankYouMail.php`
- `app/Mail/Survey/SurveyVerificationCodeMail.php`
- `app/Mail/Survey/SurveyAnswersUpdatedMail.php`
- `app/Mail/Technical/TestMail.php`

Listener-ы (все `implements ShouldQueue`):

- `app/Listeners/Contact/SendContactAdminNotifyListener.php`
- `app/Listeners/Survey/SendSurveyAdminNotifyListener.php`
- `app/Listeners/Survey/SendSurveyThankYouListener.php`
- `app/Listeners/Survey/SendSurveyVerificationCodeListener.php`
- `app/Listeners/Survey/SendSurveyAnswersUpdatedListener.php`
- `app/Listeners/Technical/QueueTestMailListener.php`

Техническая страница:

- `app/Http/Controllers/Technical/MailTestController.php`
  (методы `index`, `send`, `sendAllQueued`)
- `routes/web.php` группа `technical.*`
- `resources/js/pages/technical/TechnicalPage.vue`
- `resources/views/technical/index.blade.php`

Тест:

- `tests/Feature/Technical/MailQueueAllTest.php`

Конфиг:

- `.env` (`MAIL_*`, `QUEUE_CONNECTION=database`, `EMAIL_ADMIN=...`)
- `config/mail.php` (ключ `admin_email` читает `EMAIL_ADMIN`)
- `database/migrations/2026_04_08_101035_create_jobs_table.php`
