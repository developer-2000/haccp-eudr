
## Работа на сервере
### B. Сделать на сервере (минимум для SSR)

Цель: после деплоя Laravel при каждом запросе запрашивает HTML у локального Node-процесса на `127.0.0.1:13714` и отдаёт пользователю готовую страницу с meta-тегами уже на первом byte. Если Node-процесс упадёт — Inertia сам фоллбэчит на client-render без 500.

Подробное «зачем» и сравнение SSR/no-SSR — в [overtake_inertia.md](overtake_inertia.md). Ниже — только что и какой командой делать на сервере.

Все команды от пользователя `deploy` (если иначе — указано). Путь `/var/www/demo.haccpilot.eu/current` — symlink на актуальный release.

#### B.1. Node.js 20 на VPS

Один раз. Нужна версия ≥18, ставим LTS 20:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version    # должно быть v20.x
```

#### B.2. `.env`

Открыть `/var/www/demo.haccpilot.eu/shared/.env`, добавить:

```env
INERTIA_SSR_ENABLED=true
```

`INERTIA_SSR_URL` НЕ ставить — дефолт `http://127.0.0.1:13714` уже зашит в [config/inertia.php](../../../../config/inertia.php). Прописывать только если порт занят и нужно его сменить.

Применить:

```bash
cd /var/www/demo.haccpilot.eu/current && php artisan config:clear
```

#### B.3. systemd-юнит

Один файл. От root:

```bash
sudo nano /etc/systemd/system/inertia-ssr.service
```
нам его нужно сделать как мы сделали авто поднятие для выполнения очередей - найди его и посмотри как там сделано

Примерное Содержимое текущего файла:

```ini
[Unit]
Description=Inertia SSR for HACCPilot
After=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/var/www/demo.haccpilot.eu/current
ExecStart=/usr/bin/php artisan inertia:start-ssr
Restart=always
RestartSec=3
StandardOutput=append:/var/log/inertia-ssr.log
StandardError=append:/var/log/inertia-ssr.log

[Install]
WantedBy=multi-user.target
```

Активировать (от root):

```bash
sudo touch /var/log/inertia-ssr.log
sudo chown deploy:deploy /var/log/inertia-ssr.log
sudo systemctl daemon-reload
sudo systemctl enable --now inertia-ssr
sudo systemctl status inertia-ssr   # должен быть active (running)
```

`Restart=always` — если процесс упадёт, systemd поднимет его за 3 секунды.

#### B.4. Sudoers для deploy-юзера

Один раз. Чтобы `deploy.sh` мог рестартовать SSR без пароля:

```bash
sudo visudo -f /etc/sudoers.d/deploy-inertia-ssr
```

Содержимое:

```
deploy ALL=(ALL) NOPASSWD: /bin/systemctl restart inertia-ssr
```

#### B.5. Хук в `deploy.sh`

В `deploy.sh` после блока `# 8. SWITCH RELEASE` добавить одну строку:

```bash
sudo systemctl restart inertia-ssr
```

Это перечитывает свежий `bootstrap/ssr/ssr.js` после переключения `current` на новый release.

В `release.tar.gz` (билд CI) папка `bootstrap/ssr/` уже включена через `rsync -av ./` — менять воркфлоу не надо. Локально проверить:

```bash
tar -tzf release.tar.gz | grep "bootstrap/ssr/ssr.js"
```

#### B.6. Управление процессом

```bash
sudo systemctl status inertia-ssr      # статус (active / failed)
sudo systemctl restart inertia-ssr     # рестарт
sudo systemctl stop inertia-ssr        # остановить
sudo systemctl start inertia-ssr       # запустить
sudo journalctl -u inertia-ssr -f      # live-логи
sudo tail -f /var/log/inertia-ssr.log  # альтернатива (file logging)
```

#### B.7. Проверка после деплоя

Три команды:

```bash
# 1. Процесс жив:
sudo systemctl is-active inertia-ssr
# Ожидаемо: active

# 2. Порт слушается localhost:
ss -tlnp | grep 13714
# Ожидаемо: одна строка LISTEN 127.0.0.1:13714

# 3. SSR отдаёт реальный HTML с meta-тегами:
curl -s https://demo.haccpilot.eu/en | grep -E "<title>|<meta name=\"description\"|<link rel=\"canonical\""
# Ожидаемо: три строки с реальным title, description, canonical
```

Если `curl` показывает meta-теги в выводе — SSR работает end-to-end.

#### B.8. Аварийный откат на client-only

Если SSR начал падать и нужно срочно вернуть сайт без SSR (без downtime):

```bash
# В .env заменить:
INERTIA_SSR_ENABLED=false

# Применить:
cd /var/www/demo.haccpilot.eu/current && php artisan config:clear
```

Сайт сразу перестанет ходить за HTML в SSR-сервис. Node-процесс можно не убивать — он просто перестанет получать запросы. Дальше спокойно разбирать, что сломалось, без давления downtime.

Когда починили — поставить `INERTIA_SSR_ENABLED=true` обратно, `php artisan config:clear`, `sudo systemctl restart inertia-ssr`.

---

#### B.9. Известные грабли при первом запуске SSR на проде

Это шесть проблем, с которыми мы столкнулись на проде в процессе включения SSR. Каждая — реальная (не теоретическая), даю симптом → причина → фикс с указанием файла.

##### 9.1. `route:cache` ломает Inertia-роуты на closure'ах

**Симптом:** все публичные страницы возвращают **HTTP 500**, в `storage/logs/laravel.log`:

```
TypeError: Illuminate\Routing\RouteFileRegistrar::{closure}(): Argument #1 ($component) must be of type string, null given
```

**Причина:** `routes/web.php` использует closure-фабрику `$inertiaPage = fn (string $component, ...) => function (...) use ($component, ...) { return Inertia::render($component, ...); }`. Это **nested closure**. `php artisan route:cache` сериализует роуты через `SerializableClosure`, и при сериализации nested-closure теряет значение `use ($component)` → при выполнении `$component = null` → `Inertia::render(null, ...)` → TypeError.

**Фикс:** в [deploy.sh](deploy.sh) (раздел `# 6. LARAVEL CACHE`) закомментирован `php artisan route:cache`. `config:cache` оставлен — он работает.

```bash
php artisan optimize:clear
php artisan config:cache
# php artisan route:cache  # отключено: closure-routes несовместимы с SerializableClosure
```

**Когда вернуть:** после переписывания `routes/web.php` на классические `Controller@action` (без closure-фабрики).

##### 9.2. `config:cache` держит абсолютный путь к старому release

**Симптом:** после деплоя `config('inertia.ssr.bundle')` указывает на путь от **прошлого** release (`/var/www/.../releases/20260427_113725/...`), хотя `current` уже указывает на новый release. Inertia рендерит страницу через bundle старой версии (без последних SSR-фиксов) или вовсе не находит файл (если release уже почистили).

**Причина:** `config/inertia.php` использует `base_path('bootstrap/ssr/ssr.js')`. `base_path()` резолвится в **момент** выполнения `php artisan config:cache` — туда вписывается **абсолютный** путь текущего PWD. После `config:cache` файл `bootstrap/cache/config.php` зафризован с этим путём.

**Фикс деплоя:** `php artisan optimize:clear` в `deploy.sh` стоит **до** `config:cache`. Очистка нормально пересоздаёт кэш с новым путём, но **PHP-FPM воркеры** (через OPcache) могут продолжать читать старую версию `config.php`. Решение — после деплоя при первом проявлении проблемы:

```bash
cd /var/www/demo.haccpilot.eu/current && php artisan config:clear && php artisan config:cache
sudo systemctl restart php8.2-fpm
```

(Если хочется фиксировать в `deploy.sh` — добавить `sudo systemctl reload php8.2-fpm` в раздел 11; потребует NOPASSWD для команды `reload php8.2-fpm`.)

##### 9.3. SSR-сервис не перезапускается из deploy.sh без NOPASSWD-правила

**Симптом:** в `deploy.sh` после `# 8. SWITCH RELEASE` стоит `sudo systemctl restart inertia-ssr || true`, но в логе деплоя нет строки `Restarting SSR service...` — Node-процесс продолжает читать **старый** `bootstrap/ssr/ssr.js` (через старый release path в памяти), хотя на диске уже новый bundle.

**Причина:** sudo требует пароль для `deploy`-юзера, в неинтерактивном режиме `sudo` тихо падает, `|| true` маскирует ошибку.

**Фикс:** см. раздел [B.4 Sudoers для deploy-юзера](#b4-sudoers-для-deploy-юзера). Файл `/etc/sudoers.d/deploy-inertia-ssr`:

```
deploy ALL=(ALL) NOPASSWD: /bin/systemctl restart inertia-ssr
```

##### 9.4. `npm ci --omit=dev` требует чтобы Vue/Inertia/Pinia/i18n были в `dependencies`

**Симптом:** на проде SSR-процесс падает на `Cannot find module 'vue'` или подобном при первом запросе — модули не установлены потому что `npm ci --omit=dev` пропустил `devDependencies`.

**Причина:** Vite SSR-build с `noExternal` не вкладывает Vue/Inertia/etc. в bundle — они остаются external, грузятся из `node_modules` в Node-процессе. Если они в `devDependencies`, на проде их нет.

**Фикс:** [package.json](package.json) — `vue`, `vue-i18n`, `pinia`, `@inertiajs/vue3`, `@vue/server-renderer`, `naive-ui`, `axios` должны быть в `"dependencies"`. (У нас сейчас так — фикса делать не нужно, но при добавлении новых runtime-зависимостей помнить.)

##### 9.5. CloudFlare кэширует старый HTML после деплоя SSR

**Симптом:** прямой curl на сервер (`--resolve demo.haccpilot.eu:443:127.0.0.1`) возвращает SSR-HTML с meta-тегами, но через настоящий https://demo.haccpilot.eu/en — старая страница без них.

**Причина:** CloudFlare CDN держит закэшированную версию страницы из времени, когда SSR ещё не работал.

**Фикс:** один раз после первого включения SSR — в Cloudflare dashboard → demo.haccpilot.eu → Caching → Configuration → **Purge Everything**. Дальнейшие правки контента сами инвалидируют CF-кэш через стандартный TTL.

Также рекомендуется на nginx-уровне отдавать `Cache-Control: public, max-age=300` для публичных страниц — чтобы CF не держал HTML дольше 5 минут.

##### 9.6. `view:clear` в `optimize:clear` обязателен

**Симптом:** `@inertia` директива blade компилируется в `storage/framework/views/<hash>.php`. Storage **shared** между релизами (`ln -sfn $SHARED/storage`), значит компилированный blade переживает deploy. Если он создан до перехода на SSR (без вызова `Gateway::dispatch`) — даже после деплоя он продолжает рендерить старый формат без SSR.

**Причина:** Blade-cache не пересоздаётся автоматически между релизами.

**Фикс:** уже есть. `php artisan optimize:clear` в `deploy.sh` (раздел 6) очищает `storage/framework/views`. Тоже самое делает явный `php artisan view:clear`. Главное — **не заменять `optimize:clear` на отдельный `cache:clear`**, иначе view-cache не очистится.

---

#### B.10. Чек-лист первого запуска SSR на проде

После того как всё это сделано **один раз**, последующие деплои должны проходить чисто. Финальный чек-лист первого запуска:

- [ ] Node 20 установлен (B.1)
- [ ] `INERTIA_SSR_ENABLED=true` в shared `.env` (B.2)
- [ ] systemd-юнит `inertia-ssr.service` создан и `enable --now`-нут (B.3)
- [ ] sudoers `/etc/sudoers.d/deploy-inertia-ssr` для NOPASSWD restart (B.4)
- [ ] В `deploy.sh` хук `sudo systemctl restart inertia-ssr` (B.5)
- [ ] **`route:cache` в `deploy.sh` отключён** (B.9.1) ⚠
- [ ] CloudFlare `Purge Everything` после первого деплоя (B.9.5)
- [ ] `curl -s https://demo.haccpilot.eu/en | grep -c "data-inertia"` возвращает >30
- [ ] `curl -s https://demo.haccpilot.eu/en | grep -c "data-server-rendered"` возвращает 1

Если все пункты выполнены — Googlebot и пользователи получают полный HTML с meta-тегами и контентом на первом byte.

---## Регрессионное тестирование

Прогнать вручную после миграции каждой фазы:

1. **SEO-проверка через `curl`** — для каждой страницы проверить что title, description, canonical, hreflang **уже есть в HTML без выполнения JS**:
   ```bash
   curl -s http://haccpilot.local/en/about | grep -E "<title>|<meta name=\"description\"|<link rel=\"canonical\""
   ```
2. **Поведенческие проверки в браузере**:
    - Все страницы открываются без console-ошибок
    - Переключатель языков работает (URL меняется + контент меняется)
    - `<Link>` навигация — без полного reload
    - Contact-форма отправляется и показывает toast
    - Survey: вопросы видны сразу, submit с email → PIN-экран → верификация
    - BatchPublic / DailyReportPublic — данные на сервере + window.print() работает
    - Demo — после mount всё работает как сейчас
    - 419-handler в apiAxios + sessionGuard — продолжает работать
3. **Lighthouse / PageSpeed** на 5 главных страницах — LCP / FCP должны заметно вырасти.
4. **Googlebot simulation** — открыть в Chrome DevTools "Disable JavaScript", проверить что контент видим.
5. **Hreflang validator** (Screaming Frog или https://technicalseo.com/tools/hreflang/).
