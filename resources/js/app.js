import './bootstrap';
import { createApp } from 'vue';
import Index from './components/Index.vue';
import router from './router';

const app = createApp(Index);

app.use(router);

app.mount('#app');
