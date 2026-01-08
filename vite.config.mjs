import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'url';
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
            input: ['resources/scss/app.scss', 'resources/js/app.js'],
            refresh: true,
            detectTls: false,
        }),
        vue(),
        copyPublicImages(),
    ],
    server: {
        host: 'haccp-eudr.local',
        port: 5179,
        https: false,
        strictPort: false,
        cors: true,
        hmr: {
            host: 'haccp-eudr.local',
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
});
