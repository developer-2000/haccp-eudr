/**
 * Единый реестр ключей localStorage / sessionStorage, используемых в проекте.
 * Импортируйте нужную константу вместо хардкода строки.
 */

// ─── localStorage ────────────────────────────────────────────────────────────

/**
 * Состояние демо-режима (чеклисты, отчёты, партии и пр.).
 * Сохраняется между перезагрузками, чтобы пользователь продолжил с того же места.
 * @see resources/js/features/demo/composables/demoStatePersistence.js
 */
export const LS_DEMO_STATE = "haccp-demo-state";

/**
 * Флаг принятия cookie/consent-баннера (версия 1).
 * Если значение "true" — баннер больше не показывается.
 * @see resources/js/components/client/consent/ConsentOverlay.vue
 */
export const LS_CONSENT_VERSION = "consent_version_1";

/**
 * Post-submit состояние страницы Survey (submitted, timestamp, хеш email).
 * Позволяет после перезагрузки восстановить экран «Спасибо» вместо формы.
 * @see resources/js/Pages/Survey.vue
 */
export const LS_SURVEY_SUBMISSION_STATE = "survey_submission_state_v1";

// ─── sessionStorage ──────────────────────────────────────────────────────────

/**
 * Токен верификации email на странице Survey.
 * Живёт только в рамках текущей вкладки/сессии; после закрытия — сбрасывается.
 * @see resources/js/Pages/Survey.vue
 */
export const SS_VERIFICATION_TOKEN = "verification_token";

/**
 * Состояние сценария «Охлаждение зерна» (notification flow, статус, таймеры).
 * Хранит промежуточные снимки выполнения задачи в рамках одной сессии.
 * @see resources/js/features/demo/task_grain_cooling/config.js
 * @see resources/js/features/demo/task_grain_cooling/grainCoolingSessionStorage.js
 */
export const SS_TASK_GRAIN_COOLING = "task_grain_cooling";
