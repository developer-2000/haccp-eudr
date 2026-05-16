# PHPStan / Larastan

Статический анализатор для Laravel. Ловит то, что обычно ловит только тест в проде:
вызовы методов на `null`, несуществующие свойства, неверные сигнатуры, мёртвый код,
несовпадающие типы в коллекциях и т.п.

---

## Установка

```bash
composer require --dev larastan/larastan --ignore-platform-reqs
```

Установлено: `larastan/larastan` v2.11 + `phpstan/phpstan` v1.12 как транзитивная зависимость.

---

## Запуск

### Через composer-скрипт (рекомендуется)

В `composer.json` есть скрипт `stan`:

```bash
composer stan
```

### С увеличенной памятью (если упало по OOM)

```bash
vendor/bin/phpstan analyse --memory-limit=1G
```

### Проверка одного файла

```bash
vendor/bin/phpstan analyse app/Services/SurveyResponseService.php
```

## Как читать вывод

Пример из текущего проекта:

```txt
 ------ ---------------------------------------------------------------
  Line   app/Services/SurveyResponseService.php
 ------ ---------------------------------------------------------------
  318    Offset '1' on array<string, mixed> on left side of ?? does
         not exist.
 ------ ---------------------------------------------------------------
```

Значит: на 318-й строке к массиву обращаются по ключу `1`, которого по типу не существует —
надо либо уточнить тип массива (`array<int, string>` / shape), либо изменить логику.

Ещё пример:

```txt
  15     Cannot call method save() on App\Models\User|null
```

Значит: `$user` может быть `null`, а ты вызываешь `save()` без проверки.

Правильно:

```php
$user = $request->user();
if (!$user) {
    return;
}
$user->save();
```

Или короткая форма для цепочек:

```php
$post->author?->name
```

---

## Частые ошибки в Laravel

### `Request::user()` может быть null

`Auth` middleware ещё не отработал — для PHPStan тип `User|null`.

```php
$id = $request->user()->id;          // ругается
$id = $request->user()?->id;         // ok, но даёт null|int
```

### Eloquent-связи

```php
$post->author->name                  // author может быть null
$post->author?->name                 // ok
```

### Дженерики коллекций

Larastan не угадывает тип элементов:

```php
/** @var \Illuminate\Support\Collection<int, \App\Models\User> $users */
$users = User::all();
```

---

## Повышение уровня

Открыть `phpstan.neon`, заменить:

```neon
level: 5
```

на `6`, прогнать, починить ошибки, поднять до `7`, и т.д. Уровни:

- 0–2: базовые синтаксические/типовые проверки.
- 3–4: возвращаемые типы, доступ к свойствам.
- 5–6: типы аргументов, частичный analysis массивов.
- 7: nullable-обработка.
- 8: жёсткие проверки `null`.
- 9: типы `mixed` запрещены.

---

## CI/CD

Пример для GitHub Actions:

```yaml
- name: PHPStan
  run: vendor/bin/phpstan analyse --memory-limit=1G
```

Падение анализа должно блокировать merge — это ключевой смысл инструмента.
