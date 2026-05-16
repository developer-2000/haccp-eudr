import { onBeforeUnmount, onMounted } from 'vue';
import apiAxios from '@/utils/apiAxios.js';

/** Не дёргаем сервер при быстром переключении вкладок (30 сек) */
const PING_THROTTLE_MS = 30_000;

/**
 * Берёт текущий CSRF-токен из meta-тега, отрендеренного Blade-layout.
 */
function readMetaCsrf() {
    return document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
}

/**
 * Подменяет CSRF-токен в meta-теге и в дефолтных axios-заголовках, чтобы
 * следующие POST/PUT/DELETE улетели со свежим токеном без перезагрузки страницы.
 */
function writeMetaCsrf(token) {
    const el = document.head.querySelector('meta[name="csrf-token"]');
    if (el) el.setAttribute('content', token);
    if (window.axios?.defaults?.headers?.common) {
        window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
    }
}

/**
 * Проактивная синхронизация сессии: при возврате во вкладку дёргает /session/ping,
 * получает актуальный CSRF и обновляет meta-тег. Если сессия истекла — Laravel
 * выдаст новый токен, и заполненная пользователем форма не потеряется.
 *
 * Реактивная страховка на случай "вкладка час видна без переключений" живёт
 * в apiAxios._handleError (статус 419 → toast + reload).
 */
export function useSessionGuard() {
    let lastPingAt = 0;
    let inflight = false;

    const pingSession = async () => {
        const now = Date.now();

        // Без дублей запроса
        if (inflight) {
            return;
        }

        // Не дёргаем сервер (30 сек)
        if (now - lastPingAt < PING_THROTTLE_MS) {
            return;
        }

        lastPingAt = now;
        inflight = true;

        try {
            const result = await apiAxios.get('/session/ping', {}, true);
            // Ошибка сети/сервера — apiAxios вернёт строку. Тихо игнорируем:
            // следующий реальный POST либо пройдёт (сессия жива), либо упадёт
            // в 419-handler (страница перезагрузится).
            if (!result || typeof result === 'string' || result?.status !== 'success') {
                return;
            }

            const fresh = result?.data?.csrf;
            if (fresh && fresh !== readMetaCsrf()) {
                writeMetaCsrf(fresh);
            }
        } finally {
            inflight = false;
        }
    };

    const onVisibilityChange = () => {
        if (!document.hidden) {
            void pingSession();
        }
    };

    onMounted(() => {
        document.addEventListener('visibilitychange', onVisibilityChange);
    });

    onBeforeUnmount(() => {
        document.removeEventListener('visibilitychange', onVisibilityChange);
    });
}
