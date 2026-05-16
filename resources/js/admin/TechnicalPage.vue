<template>
    <div class="container">
        <h1>Technical Test Hub</h1>
        <p class="subtitle">
            Единая страница для ручных технических тестов проекта. Области разделены по типам
            проверок.
        </p>

        <div v-if="statusMessage" class="status">{{ statusMessage }}</div>

        <div class="grid">
            <section class="card">
                <h2>SMTP / Почта</h2>
                <p>
                    Проверка цепочки отправки письма через событие и очередь. Тестовый получатель
                    фиксированный.
                </p>
                <ul class="meta">
                    <li><strong>Получатель:</strong> {{ targetEmail }}</li>
                    <li><strong>EMAIL_ADMIN:</strong> {{ adminEmail || '—' }}</li>
                    <li><strong>Mailer:</strong> {{ mailer }}</li>
                    <li><strong>Queue connection:</strong> {{ queueConnection }}</li>
                    <li><strong>Время запроса:</strong> {{ requestTime }}</li>
                </ul>
                <form method="POST" :action="mailSendUrl">
                    <input type="hidden" name="_token" :value="csrfToken" />
                    <button class="btn" type="submit">Отправить тестовое письмо</button>
                </form>
                <form method="POST" :action="mailSendAllUrl" class="spacer-top">
                    <input type="hidden" name="_token" :value="csrfToken" />
                    <button class="btn" type="submit" :disabled="!adminEmail">
                        Поставить в очередь все 6 писем → EMAIL_ADMIN
                    </button>
                </form>
            </section>

            <section class="card">
                <h2>Очереди</h2>
                <p>Зона под тесты worker, retry, failed jobs и времени обработки заданий.</p>
                <span class="badge">Скоро</span>
                <div class="spacer-top">
                    <button class="btn btn-secondary" type="button" disabled>Тест очереди</button>
                </div>
            </section>

            <section class="card">
                <h2>События / Listener</h2>
                <p>
                    Область для проверки регистрации событий, listener-цепочек и диагностики
                    payload.
                </p>
                <span class="badge">Скоро</span>
                <div class="spacer-top">
                    <button class="btn btn-secondary" type="button" disabled>Тест события</button>
                </div>
            </section>

            <section class="card">
                <h2>Логи и диагностика</h2>
                <p>Быстрый доступ к логам и проверкам ошибок после запуска тестовых сценариев.</p>
                <span class="badge">Скоро</span>
                <div class="links">
                    <a :href="mailTestUrl">Совместимость: старый URL mail-test</a>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
defineProps({
    targetEmail: {
        type: String,
        required: true,
    },
    adminEmail: {
        type: String,
        default: '',
    },
    mailer: {
        type: String,
        required: true,
    },
    queueConnection: {
        type: String,
        required: true,
    },
    requestTime: {
        type: String,
        required: true,
    },
    mailSendUrl: {
        type: String,
        required: true,
    },
    mailSendAllUrl: {
        type: String,
        required: true,
    },
    mailTestUrl: {
        type: String,
        required: true,
    },
    statusMessage: {
        type: String,
        default: '',
    },
    csrfToken: {
        type: String,
        required: true,
    },
});
</script>

<style scoped>
.subtitle {
    margin: 0 0 20px;
    color: #4b5563;
}

.status {
    margin-bottom: 16px;
    padding: 12px 14px;
    border-radius: 8px;
    background: #ecfdf5;
    color: #065f46;
    border: 1px solid #a7f3d0;
}

.grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
}

.card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 16px;
}

.card h2 {
    margin: 0 0 10px;
    font-size: 18px;
}

.card p {
    margin: 0 0 12px;
    color: #374151;
    line-height: 1.5;
}

.meta {
    margin: 0;
    padding: 0;
    list-style: none;
}

.meta li {
    margin: 0 0 8px;
    color: #1f2937;
}

.badge {
    display: inline-block;
    padding: 3px 8px;
    font-size: 12px;
    border-radius: 999px;
    background: #eef2ff;
    color: #3730a3;
}

.btn {
    border: 0;
    background: #111827;
    color: #fff;
    border-radius: 8px;
    padding: 10px 14px;
    cursor: pointer;
}

.btn:hover {
    background: #0b1220;
}

.btn:disabled {
    background: #9ca3af;
    cursor: not-allowed;
}

.btn-secondary {
    background: #e5e7eb;
    color: #111827;
    cursor: not-allowed;
}

.spacer-top {
    margin-top: 10px;
}

.links {
    margin-top: 10px;
    font-size: 14px;
}

.links a {
    color: #1d4ed8;
    text-decoration: none;
}

.links a:hover {
    text-decoration: underline;
}

@media (max-width: 900px) {
    .grid {
        grid-template-columns: 1fr;
    }
}
</style>
