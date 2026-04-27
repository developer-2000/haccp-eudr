
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
