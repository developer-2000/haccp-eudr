<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## **АНАЛИЗ Demo.md — ТЕКУЩАЯ РЕАЛИЗАЦИЯ**

Demo построен на Vue 3 + Naive UI + localStorage. SPA с роутингом, 5 секций (Dashboard, Checklists, EUDR QR, Reports, Personnel), модалки, CRUD чек-листов. Persist состояния, mock backend, EUDR QR/PDF, CTA на survey.[^1]

## **✅ СДЕЛАНО ХОРОШО (Сильные стороны)**

- **Структура SPA:** Demo.vue с layout (topbar, sidebar/mobile nav), роуты batch/report работают через Laravel index-client.
- **Persist localStorage:** useDemoState composable с mergeChecklistsWithDefaults, DEMOSTATESCHEMAVERSION (до 12), F5-safe.
- **Checklists CRUD:** ChecklistModal с wizard (scope, frequency, equipment/rooms, fields: temp/singlechoice/ticket), measurements drawer.
- **Dashboard:** Metrics (compliance/total), hot tasks, CCP cards с проблемами.
- **EUDR УТП:** QR (qrcode.js), public batch/report URLs, PDF mock, buildDemoBatches.
- **UX:** Touch-friendly модалки, NSelect assignee, addWizardStep, pulse animations.
- **Personnel:** Sites/staff CRUD, assignedStaffId в checklists, resolveStaffFullName.
- **Responsive:** SCSS media breakpoints, sticky CTA/mobile bottom nav.
- **Конверсия:** CTA "Хочу под свой" везде, hover/focus polish.
- **Температурный ввод:** dedicated панели с большой numpad для перчаток (legacy timer в drawer — не glove-friendly).
- **Bluetooth mock:** у температурного режима - warning "БЛЮТУЗ ОТКЛЮЧЕН" + ручной ввод.
- **Live мониторинг:** real-time спустя минуту пребывания пользователя на сайте,
  выскакивает звуковое оповещение с кнопкой перехода к выполнению задачи

## **❌ НЕДОЧЁТЫ (Что сломано/недоделано)**

- **Фото/голос:** Camera mock только в legacy, нет speech recognition для "196°C".
- **Мульти-подтверждение:** Только assignedStaffId, нет 2-person confirm (Hans/Piotr).
- **Анимации:** Pulse/red shake есть, но нет confetti на ✓, haptic vibrate.
- **Offline/PWA:** Нет service worker, install prompt, offline badge.
- **Risk score AI:** Mock 72% warning не реализован.
- **Keyboard shortcuts:** Нет Ctrl+K search.
- **Drag\&drop widgets:** Нет sortable.js на dashboard.
- **Drag\&drop widgets:** Нет sortable.js на dashboard.
- **Ниши preset:** Coffee/bakery/meat — но нет quick-switch в header.
- **Inspector view:** QR → public page OK, но нет GPS map (Leaflet).
- **PDF real:** Только mock text, нет jsPDF с QR/GPS/compliance.
- **Notifications:** Нет browser Notification API + sound для alerts.
- **Team dashboard:** Personnel CRUD OK, но нет team view с assigned tasks.
- **Sync mock:** "Синхронизировано" статично, нет progress/queue.


## **🚀 НОВЫЕ ФИЧИ ДЛЯ 80% КОНВЕРСИИ**

### **Критично (Must-have)**

- **LiveSensors.vue:** setInterval temps ±1°C, push alerts, sound/vibrate.
- **VoiceInput:** Web Speech API → "196°C" → numpad fill.
- **Haptic + Confetti:** navigator.vibrate(100), canvas confetti на save.
- **PWA:** manifest.json + SW для offline demo.


### **Высокий приоритет**

- **Niсhe Switcher:** Header dropdown ☕🍞🥩 → перезагрузка checklistsByNiche.
- **Map in QR:** Leaflet static GPS для inspector.
- **jsPDF Export:** Real PDF с QR + temps + signatures.
- **Risk AI Mock:** Computed на основе temps/compliance → "72% risk → warning".
- **Search/Filter:** Global Ctrl+K по checklists/alerts.
- **Multi-confirm:** ChecklistModal step "Подтвердить: Hans ✓ / Piotr _".


### **Средний приоритет**

- **Team Dashboard:** /team → assigned tasks по staff/sites.
- **Offline Queue:** Fake sync progress, "5 задач в очереди".
- **Dark theme toggle:** localStorage prefs.theme.
- **Animations pack:** Skeleton loading, success toast, error shake.
- **Keyboard nav:** Tab/Enter на numpad, shortcuts sidebar.


### **Низкий приоритет**

- **Escalation alerts:** 5min → "SMS mock".
- **Batch traceability:** Chain Berlin→Paris в PDF.
- **Widgets drag:** Sortable dashboard metrics.
- **Multi-lang:** RU/EN toggle (Brașov + Europe).


## **📊 РЕКОМЕНДАЦИИ ПО КОНВЕРСИИ**

| Фича | Impact | Effort | Пример |
| :-- | :-- | :-- | :-- |
| Temp Numpad + Gloves | ★★★★★ | Low | "196° ✓ haptic" → "Работает в перчатках!" |
| Bluetooth Warning + Manual | ★★★★☆ | Low | "OFF → ручной OK" → доверие |
| Live Alerts Push | ★★★★★ | Med | "−16°C 🚨" → urgency |
| QR Inspector Instant | ★★★★☆ | Med | Тап → public PDF → "Инспектор увидит!" |
| Niсhe Quick-switch | ★★★☆☆ | Low | ☕→🍞 → personalization |
| Confetti + Toast | ★★★☆☆ | Low | Эмоции на ✓ |

**ПРИОРИТЕТ:** 1. TempInput (сегодня), 2. Live alerts, 3. PWA. Результат: 2мин демо → 80% "Хочу под свой ☕".[^1]

<div align="center">⁂</div>

[^1]: Demo.md

