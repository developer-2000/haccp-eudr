import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'url';
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Уникальный суффикс каждой сборки: новые имена `*.js` / `*.css` в `public/build`, клиенты не цепляются за старый кэш.
 * В CI задайте `VITE_BUILD_ID` (например номер пайплайна); иначе — время запуска `vite build`.
 */
const buildId =
    process.env.VITE_BUILD_ID?.trim() ||
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const buildAssetPattern = `assets/[name]-[hash]-${buildId}.[ext]`;

// Универсальный плагин для копирования всех файлов из public/images в build/images
const copyPublicImages = () => {
    return {
        name: 'copy-public-images',
        writeBundle() {
            const publicImagesDir = path.resolve(__dirname, 'public/images');
            const buildImagesDir = path.resolve(__dirname, 'public/build/images');

            if (!existsSync(publicImagesDir)) {
                return;
            }

            if (!existsSync(buildImagesDir)) {
                mkdirSync(buildImagesDir, { recursive: true });
            }

            const copyRecursive = (src, dest) => {
                const entries = readdirSync(src, { withFileTypes: true });

                for (const entry of entries) {
                    const srcPath = path.join(src, entry.name);
                    const destPath = path.join(dest, entry.name);

                    if (entry.isDirectory()) {
                        if (!existsSync(destPath)) {
                            mkdirSync(destPath, { recursive: true });
                        }
                        copyRecursive(srcPath, destPath);
                    } else if (entry.isFile()) {
                        copyFileSync(srcPath, destPath);
                    }
                }
            };

            copyRecursive(publicImagesDir, buildImagesDir);
        }
    };
};

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/scss/app.scss', 'resources/js/app.js', 'resources/js/technical.js'],
            refresh: true,
            detectTls: false,
        }),
        vue(),
        copyPublicImages(),
    ],
    server: {
        host: '0.0.0.0',
        port: 5179,
        https: false,
        strictPort: false,
        cors: true,
        hmr: {
            host: '192.168.101.11',
            port: 5179,
        },
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm-bundler.js',
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
            },
        },
    },
    build: {
        rollupOptions: {
            output: {
                entryFileNames: `assets/[name]-[hash]-${buildId}.js`,
                chunkFileNames: `assets/[name]-[hash]-${buildId}.js`,
                assetFileNames: buildAssetPattern,
                /**
                 * Один чанк на naive-ui: иначе Rollup ругается, что entry (`import naive from "naive-ui"`)
                 * и async-чанки (`import { NButton } from "naive-ui"`) тянут один пакет по разным границам.
                 */
                manualChunks(id) {
                    if (id.includes('node_modules/naive-ui')) {
                        return 'naive-ui';
                    }
                },
            },
        },
    },
});
