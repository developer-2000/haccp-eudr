import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'url';
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync, writeFileSync, readFileSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Уникальный суффикс каждой сборки: новые имена `*.js` / `*.css` в `public/build`, клиенты не цепляются за старый кэш.
 * В CI задайте `VITE_BUILD_ID` (например номер пайплайна); иначе — время запуска `vite build`.
 */
const buildId =
    process.env.VITE_BUILD_ID?.trim() ||
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const buildAssetPattern = `assets/[name]-[hash]-${buildId}.[ext]`;

/**
 * После prod-сборки клиента регистрирует в `manifest.json` псевдо-entry для CSS-only
 * входов (например `resources/scss/app.scss`), ссылающийся на единый `style-XXX.css`.
 * С `cssCodeSplit:false` Vite сливает весь CSS в один файл и **теряет** запись для
 * CSS-входов — без этого `@vite('resources/scss/app.scss')` падает с
 * "Unable to locate file in Vite manifest". Сам `<link rel="stylesheet">` потом
 * выдаёт laravel-vite-plugin через эту запись (одиночный preload, без дублей).
 */
const linkCssToJsEntries = (cssEntries = []) => ({
    name: 'link-css-to-js-entries',
    apply: 'build',
    enforce: 'post',
    writeBundle(options) {
        if (options.dir?.includes('ssr')) return;
        const manifestPath = path.join(options.dir, 'manifest.json');
        if (!existsSync(manifestPath)) return;
        const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
        const styleCss = manifest['style.css']?.file;
        if (!styleCss) return;
        for (const cssEntry of cssEntries) {
            if (!manifest[cssEntry]) {
                manifest[cssEntry] = {
                    file: styleCss,
                    src: cssEntry,
                    isEntry: true,
                };
            }
        }
        writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
    },
});

/**
 * Кладёт `package.json` с `"type":"module"` рядом с SSR-бандлом — иначе Node 20
 * пытается грузить `ssr.js` как CommonJS и падает на `import`. В корневой
 * `package.json` этот флаг ставить нельзя (сломает CJS-инструменты Laravel/Vite),
 * поэтому переключаем в ESM только папку `bootstrap/ssr/`.
 */
const writeSsrPackageJson = () => ({
    name: 'write-ssr-package-json',
    apply: 'build',
    writeBundle(options) {
        if (!options.dir || !options.dir.includes('ssr')) return;
        writeFileSync(
            path.join(options.dir, 'package.json'),
            '{\n    "type": "module"\n}\n',
        );
    },
});

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

export default defineConfig(({ isSsrBuild }) => ({
    plugins: [
        laravel({
            // `app.scss` — отдельный entry. В dev (`npm run dev`) blade выдаёт
            // `<link rel="stylesheet" href="dev-server/.../app.scss">` — блокирующий тег,
            // браузер ждёт CSS перед рендером (нет FOUC). В prod с `cssCodeSplit:false`
            // запись манифеста `resources/scss/app.scss` указывает на единый `style.css`.
            input: [
                'resources/scss/app.scss',
                'resources/js/inertia-app.js',
                'resources/js/technical.js',
            ],
            ssr: 'resources/js/ssr.js',
            refresh: true,
            detectTls: false,
        }),
        vue(),
        copyPublicImages(),
        writeSsrPackageJson(),
        linkCssToJsEntries(['resources/scss/app.scss']),
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
        alias: [
            // Bundler-only сборка Vue нужна только для клиента (поддерживает runtime-компиляцию шаблонов).
            // На SSR (Node) её грузить нельзя — родительский package.json пакета `vue` без "type":"module",
            // Node ломается на named imports. Для SSR используем дефолтный exports-резолв пакета.
            ...(isSsrBuild
                ? []
                : [{ find: /^vue$/, replacement: 'vue/dist/vue.esm-bundler.js' }]),
            { find: '@', replacement: path.resolve(__dirname, 'resources/js') },
        ],
    },
    ssr: {
        // Бандлим только naive-экосистему — у неё CJS named imports, которые Node не умеет.
        // Остальные пакеты остаются external: Node загрузит их из node_modules через `exports`,
        // и пакеты с динамическим require (i18n-iso-countries, libphonenumber-js) сохранят CJS-резолв.
        noExternal: [
            'naive-ui',
            /^vueuc/,
            /^@css-render/,
            'css-render',
            'treemate',
            'vooks',
            'vdirs',
            'evtd',
            'seemly',
        ],
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
            },
        },
    },
    build: {
        // Один общий CSS-бандл вместо per-page чанков. SSR отдаёт HTML с классами уже на месте,
        // но per-page CSS-чанки тянутся только после mount Vue → пользователь видит FOUC
        // (всё прижато к левому краю), потом «прыжок» в layout. Один файл препрелоадится
        // в `<head>` через `@vite('resources/scss/app.scss')` — стили на месте до отрисовки.
        // Цена: ~163 KB CSS (~30 KB gzip) на первой загрузке вместо ~30 KB. После cache — ноль.
        cssCodeSplit: false,
        rollupOptions: {
            output: isSsrBuild
                ? {
                      // SSR-bundle: entry без хэша — Inertia ожидает фиксированное имя `ssr.js`
                      // в `bootstrap/ssr/`, чтобы `php artisan inertia:start-ssr` мог его запустить.
                      entryFileNames: '[name].js',
                      chunkFileNames: 'assets/[name]-[hash].js',
                      assetFileNames: 'assets/[name]-[hash].[ext]',
                  }
                : {
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
}));
