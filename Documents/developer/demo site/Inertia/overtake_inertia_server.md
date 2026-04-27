
## Работа на сервере
### B. Сделать на сервере (минимум для SSR)

Что делает INERTIA_SSR_ENABLED=true
Включает рендер страницы на сервере до того, как браузер получит HTML.

Поток без SSR (=false):

Laravel отдаёт пустой <div id="app"> + <script src="/build/inertia-app.js">.
Браузер качает JS-бандл → парсит → монтирует Vue → запрашивает данные → рендерит контент.
Только после этого появляются <title>, <meta>, текст. Googlebot всё это время видит пустой div.
Поток с SSR (=true):

Laravel при Inertia::render(...) стучится к локальному Node-сервису на 127.0.0.1:13714 (поднят php artisan inertia:start-ssr, читает bootstrap/ssr/ssr.js).
Node прогоняет тот же Vue-код в Node-окружении и отдаёт готовый HTML с <title>, <meta description>, <link rel="canonical">, hreflang и текстом страницы.
Laravel вставляет этот HTML в inertia.blade.php через @inertia / @inertiaHead и отдаёт клиенту первым byte'ом.
Браузер сразу видит контент; JS-бандл потом «оживляет» страницу (hydration) для SPA-навигации через <Link>.
Зачем нужен
Главная причина — SEO. Цель миграции (см. overtake_inertia.md раздел "Цель"): 8 публичных типов страниц × 25 локалей = 275 URL, которые Googlebot должен индексировать с полным контентом.

Конкретно:
Title / description / canonical / hreflang в HTML до выполнения JS — критично для индексации.
Survey-страница индексируется с вопросами, а не пустым каркасом.
BatchPublic / DailyReportPublic индексируются с продуктами и компаниями.
LCP / FCP сокращаются на 40–60% — пользователь и ранжирующий алгоритм видят контент быстрее.
Когда выключать (=false)
В dev (overtake_inertia.md:104-108): не нужен HMR ломать, Vite сам всё рендерит на клиенте.
На проде как аварийный откат: если SSR-сервис залип/упал и его нужно временно обойти — INERTIA_SSR_ENABLED=false + php artisan config:clear мгновенно переводят сайт на client-only без 500.
Защита от падений
Даже при включённом SSR, если Node-процесс на :13714 не отвечает — Inertia сам безопасно фоллбэчит на client-render, без 500-ошибок (overtake_inertia_server.md:22). На проде SSR держится живым через systemd-юнит inertia-ssr.service с Restart=always.

#### B.1. Установить Node.js на VPS (одной командой)

SSR-сервис — Node-процесс. Один пакет:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### B.2. Дополнить `/var/www/demo.haccpilot.eu/shared/.env`

```env
INERTIA_SSR_ENABLED=true
```

`INERTIA_SSR_URL=http://127.0.0.1:13714` оставить дефолтным (`http://127.0.0.1:13714` уже захардкожен в `config/inertia.php`).

Защита: если SSR отвалится — Inertia сам фоллбэчит на client-render без 500.

#### B.3. systemd-юнит для inertia-ssr (один файл, без supervisor)

`/etc/systemd/system/inertia-ssr.service`:

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

[Install]
WantedBy=multi-user.target
```

Активировать:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now inertia-ssr
sudo systemctl status inertia-ssr   # должен быть active (running)
```

#### B.4. В `deploy.sh` после `# 8. SWITCH RELEASE` добавить одну строку

```bash
sudo systemctl restart inertia-ssr
```

Чтобы deploy-юзеру не вводить пароль для этой команды — `sudo visudo`:

```
deploy ALL=(ALL) NOPASSWD: /bin/systemctl restart inertia-ssr
```

#### B.5. Проверка после деплоя

```bash
sudo systemctl status inertia-ssr
curl -s https://demo.haccpilot.eu/en | grep -E "<title>|<meta name=\"description\""
```

В выводе curl должен быть полный HTML с title и description — это и есть цель SEO-миграции. Если есть — задача выполнена.

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
