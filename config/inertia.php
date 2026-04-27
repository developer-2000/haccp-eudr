<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Initial Page Element
    |--------------------------------------------------------------------------
    |
    | true → @inertia рендерит `<script type="application/json">…</script><div id="app"></div>`
    |        (формат Inertia v2, который ожидает frontend `@inertiajs/vue3@3.x`).
    | false (default Laravel-Inertia) → `<div id="app" data-page="…"></div>` (legacy v1),
    |        несовместимо с новым клиентом → `initialPage is null` в createInertiaApp.
    |
    */

    'use_script_element_for_initial_page' => true,

    /*
    |--------------------------------------------------------------------------
    | Server Side Rendering
    |--------------------------------------------------------------------------
    |
    | Параметры серверного рендеринга страниц через Node.js.
    | `enabled` — включает использование SSR для всех Inertia-ответов.
    | `url`     — адрес SSR-сервиса, который запускается через
    |             `php artisan inertia:start-ssr` (по умолчанию 13714).
    | `bundle`  — путь к собранному SSR-бандлу (vite build --ssr).
    |
    */

    'ssr' => [

        'enabled' => env('INERTIA_SSR_ENABLED', false),

        'url' => env('INERTIA_SSR_URL', 'http://127.0.0.1:13714'),

        'bundle' => base_path('bootstrap/ssr/ssr.js'),

    ],

    'testing' => [

        'ensure_pages_exist' => true,

        'page_paths' => [
            resource_path('js/Pages'),
        ],

        'page_extensions' => [
            'js',
            'jsx',
            'svelte',
            'ts',
            'tsx',
            'vue',
        ],

    ],

];
