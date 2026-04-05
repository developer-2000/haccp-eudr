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
- **Risk score AI:** For temperature coffee, meat, bread (4.2°C = 🟢 OK, 5.5°C = 🟡 "Риск >5°C!", 7°C = 🔴 "Переместить товар!".)
 
- 
## **❌ НЕДОЧЁТЫ (Что сломано/недоделано)**

- **Фото/голос:** Camera mock только в legacy, нет speech recognition для "196°C".
- Не в DEMO **Мульти-подтверждение:** Только assignedStaffId, нет 2-person confirm (Hans/Piotr).
- Не в DEMO **Анимации:** Pulse/red shake есть, но нет confetti на ✓, haptic vibrate.
- Не в DEMO **Offline/PWA:** Нет service worker, install prompt, offline badge.
- Не в DEMO **Drag\&drop widgets:** Нет sortable.js на dashboard.
- Не в DEMO **Ниши preset:** Coffee/bakery/meat — но нет quick-switch в header.
- **Inspector view:** QR → public page OK, но нет GPS map (Leaflet).
- **PDF real:** Только mock text, нет jsPDF с QR/GPS/compliance.
- Не в DEMO **Notifications:** Нет browser Notification API + sound для alerts.
  PWA = "Система всегда с тобой" (установить на телефон).
  Notifications = "Никогда не пропустишь CCP".
- **Team dashboard:** Personnel CRUD OK, но нет team view с assigned tasks.
- Не в DEMO **Sync mock:** "Синхронизировано" статично, нет progress/queue.



[^1]: Demo.md

