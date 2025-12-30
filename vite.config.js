import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.scss', 'resources/js/app.js'],
            refresh: true,
            detectTls: false,
        }),
        vue(),
    ],
    server: {
        host: 'safe-batch.local',
        port: 5179,
        https: false,
        strictPort: false,
        cors: true,
        hmr: {
            host: 'safe-batch.local',
        },
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm-bundler.js',
        },
    },
});
