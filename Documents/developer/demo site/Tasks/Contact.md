# Форма Contact

Публичная форма обратной связи. Страница `/{locale}/contact`, эндпоинт `POST /contact`,
администратор получает письмо после каждого валидного сабмита.

---

## Правила вывода user-контента (XSS-safety)

В БД хранится **сырой текст** юзера — `strip_tags` / HTMLPurifier не применяются.
Защита от XSS делается **на выводе**, на конкретном шаблоне.

**Blade:**
- Обычное поле: `{{ $contactMessage->message }}` — автоэкранирование.
- Многострочный текст: `{!! nl2br(e($text)) !!}` — сначала escape, потом `<br>`.

**Vue:**
- `{{ contactMessage.message }}` или `v-text="..."` — автоэкранирование.
- Для переносов строк: `<div style="white-space: pre-wrap">{{ ... }}</div>`.

**Нельзя:**
- `v-html="userText"` / `innerHTML = ...` — исполнит `<script>`.
- Sanitize на входе (`strip_tags`) — разрушит легитимные символы (`A < B`, `<user@site>`).
- Если реально нужен rich-HTML — DOMPurify/HTMLPurifier на **выводе**, не на входе.

---

## Структура реализации

### Фронт (`resources/js/pages/client/Contact.vue`)

- Страница + форма на naive-ui (`n-form`, `n-input`, `n-button`).
- Вся UI-строка через `t('contact.*')` — ключи в `lang/en/contact.php`.
- Honeypot: скрытый `<input name="company_hp">` + `hp_started_at` (unix-timestamp в `onMounted`).
- Success-view: после `created` прячется форма, показывается блок «Message sent» + иконка `mark-email-read-twotone`.
- Тосты через `vue3-toastify` (`toast.error/success`).
- POST через `apiAxios.post('/contact', payload, true)`.
- Маршрут: `resources/js/router.js` — `/{locale}/contact`, ссылка в `Footer.vue`.

### Локализация

- `lang/en/contact.php` — плоские ключи (eyebrow, title, lead, list_1..3, *_label/_placeholder, validation_*, toast_*, sent_*, trust_*, response_*, admin_*).
- Регистрация в `lang/en.php`: `'contact' => require __DIR__.'/en/contact.php'` (обязательно — без этого vue-i18n не получит ключи через `window.translations`).
- **Нюанс:** `@` в `your@email.com` парсится vue-i18n как linked-message. Экранирование: `"your{'@'}email.com"`.
- Другие локали пока не заполнены — fallback в `en`.

### Бэк

- **Маршрут** `POST /contact` → `ContactController@submit`, middleware `['setLocale', 'throttle:5,1']`, имя `client.contact.submit`.
- **FormRequest** `App\Http\Requests\Client\ContactSubmitRequest`:
  - `name|email:rfc|max:255`, `message|min:10|max:2000`, honeypot-поля.
  - `prepareForValidation()` через trait `NormalizesPayload` (`nullableString`, `nullableInt`, `normalizeEmail` — trim + lowercase).
- **Контроллер** `App\Http\Controllers\Client\ContactController`:
  - Honeypot в private-методе: `hp_company` заполнено или `hp_started_at <= 0` или прошло < 5 сек → silent success.
  - Делегирует всё `ContactMessageService::store`.
  - `status === 'error'` → `getErrorResponse(..., [], 500)`; иначе всегда `getSuccessResponse(...)` без `data.status` (не палим защиты).
- **Service** `App\Services\ContactMessageService::store($payload, $userMeta)`:
  - Проверяет rate-limit по email (1/мин) и дубликаты (email+message в БД) — оба ведут к silent `skipped`.
  - `DB::transaction` вокруг `ContactMessage::create` + `SendContactAdminNotifyListener::dispatch`.
  - `try/catch (Throwable)` на транзакции — при сбое возвращает `['status' => 'error']`.
  - Возврат: `['status' => 'created'|'skipped'|'error']`.
- **Listener** `App\Listeners\Contact\SendContactAdminNotifyListener` — `implements ShouldQueue`, в `handle()` шлёт `ContactAdminNotifyMail` на `config('mail.admin_email')`. Если адрес не настроен — тихий выход.
- **Mailable** `App\Mail\Contact\ContactAdminNotifyMail` — readonly-конструктор `(name, email, company, message, userMeta)`, view `emails.contact.admin-notify`. **Важно:** в `content()->with` переменную message передаём как `messageText` — иначе коллизия с Laravel-автоинжектом `$message = Illuminate\Mail\Message`.
- **Blade** `resources/views/emails/contact/admin-notify.blade.php` — таблица HTML, все метки через `__('contact.admin_label_*')`, `{!! nl2br(e($messageText)) !!}` для тела сообщения.

### БД

Таблица `contact_messages` (миграция `2026_04_16_120000_create_contact_messages_table.php`):

- `id`, `name`, `email` (index), `company` nullable, `message` text,
- `type_site` default `'demo'` (возможные значения: `demo | product`),
- `user_meta` json nullable — `{ locale, ip, user_agent }`,
- `timestamps`, индекс `created_at`.

Модель `App\Models\ContactMessage` — `$casts['user_meta' => 'array']`.

### Визуальные утилиты в `resources/scss/app.scss`

- `.point-dot-shadow` — кружок 8×8 с box-shadow, цвет переопределяется в контексте (list/badge).
- `.animate-pulse` + `@keyframes pulse` — Tailwind-подобный pulse, для точки в badge «Response within 24 hours».

### Шрифты

- Локальные woff2 в `resources/fonts/{rubik,inter}/` (веса 300/400/500/600/700/800, subsets latin+cyrillic).
- `@font-face` в `resources/scss/app.scss` с относительными путями `url("../fonts/...")`.
- Переменные: `$font-family-rubik`, `$font-family-inter` (`resources/scss/variables.scss`).
- Блок `<!-- Fonts -->` из `resources/views/layouts/app.blade.php` удалён — больше не тянем CDN Google Fonts.

---

## Защита (сводка по чек-листу)

- **Validation** — `ContactSubmitRequest` (required, email:rfc, min/max length).
- **CSRF** — web-group автоматом + axios XSRF-TOKEN cookie (same-origin).
- **Rate limit IP** — `throttle:5,1` на маршруте.
- **Rate limit email** — в сервисе, 1 сообщение в минуту.
- **Honeypot** — двойной: скрытое поле `hp_company` + таймер `hp_started_at`.
- **Duplicate** — `email + message` в БД → silent skip.
- **DB transaction** — `create` + `dispatch` атомарно, сбой не оставляет мусор.
- **Silent contract** — все anti-spam срабатывания (honeypot/rate-limit/duplicate) возвращают одинаковый success. Фронт не различает — не палим логику защит.
- **Generic error** — 500 вместо раскрытия деталей сбоя.
- **XSS** — escape на выводе (`{{ }}` / `e()`), raw в БД, без `strip_tags` на входе.
- **Автоответ отправителю не шлём** — email неверифицирован, вектор email-amplification abuse.

---

## Тесты

`tests/Feature/Contact/ContactSubmitTest.php` — 18 кейсов, все зелёные.

Покрыто: happy path + dispatch admin-listener; silent contract; нормализация (trim/lowercase email, дефолт type_site, наличие user_meta); валидация (missing/invalid/too-short/too-long); honeypot (3 сценария); rate-limit per email + окно; duplicate; IP throttle 429.

Стек тестов: `DatabaseTransactions`, `Queue::fake()`, `Cache::flush()` в setUp, отключение `VerifyCsrfToken`.

**Запуск:**

```
php -d memory_limit=1G vendor/phpunit/phpunit/phpunit --filter ContactSubmitTest
```

`artisan test` упирается в дефолтные 128M (большие `lang/*.php`).

---

## Файлы

**Backend:**
- `database/migrations/2026_04_16_120000_create_contact_messages_table.php`
- `app/Models/ContactMessage.php`
- `app/Http/Requests/Client/ContactSubmitRequest.php`
- `app/Http/Requests/Concerns/NormalizesPayload.php`
- `app/Http/Controllers/Client/ContactController.php`
- `app/Services/ContactMessageService.php`
- `app/Listeners/Contact/SendContactAdminNotifyListener.php`
- `app/Mail/Contact/ContactAdminNotifyMail.php`
- `resources/views/emails/contact/admin-notify.blade.php`
- `routes/web.php` (маршрут `client.contact.submit`)

**Frontend:**
- `resources/js/pages/client/Contact.vue`
- `resources/js/router.js` (маршрут страницы)
- `resources/js/components/client/footer/Footer.vue` (ссылка)
- `resources/js/components/Icon.vue` (иконка `mark-email-read-twotone`)
- `resources/scss/app.scss` (`.point-dot-shadow`, `.animate-pulse`, шрифты)
- `resources/scss/variables.scss` (`$font-family-inter`)

**i18n:**
- `lang/en/contact.php`
- `lang/en.php` (регистрация)

**Тесты:**
- `tests/Feature/Contact/ContactSubmitTest.php`


