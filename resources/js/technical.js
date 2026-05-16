import { createApp } from 'vue';
import { i18n } from './i18n';
import TechnicalPage from '@/admin/TechnicalPage.vue';

const root = document.getElementById('technical-app');

if (root) {
    const app = createApp(TechnicalPage, {
        targetEmail: root.dataset.targetEmail || '',
        adminEmail: root.dataset.adminEmail || '',
        mailer: root.dataset.mailer || '',
        queueConnection: root.dataset.queueConnection || '',
        requestTime: root.dataset.requestTime || '',
        mailSendUrl: root.dataset.mailSendUrl || '',
        mailSendAllUrl: root.dataset.mailSendAllUrl || '',
        mailTestUrl: root.dataset.mailTestUrl || '',
        statusMessage: root.dataset.statusMessage || '',
        csrfToken: root.dataset.csrfToken || '',
    });
    app.use(i18n);
    app.mount(root);
}
