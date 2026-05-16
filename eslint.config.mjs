import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import babelParser from '@babel/eslint-parser';
import globals from 'globals';

export default [
    // Базовая конфигурация ESLint
    js.configs.recommended,

    // Конфигурация для Vue.js файлов
    ...vue.configs['flat/recommended'],

    // Конфигурация Prettier (отключает конфликтующие правила ESLint)
    prettierConfig,

    // Правила для JS/JSX файлов
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
                requireConfigFile: false,
                babelOptions: {
                    presets: ['@babel/preset-env'],
                },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            prettier,
        },
        rules: {
            'prettier/prettier': 'error',
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'no-console': 'off',
        },
    },

    // Правила для Vue файлов (Composition API, <script setup>)
    {
        files: ['**/*.vue'],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
        plugins: {
            prettier,
        },
        rules: {
            'prettier/prettier': 'error',
            'vue/multi-word-component-names': 'off',
            'vue/no-reserved-component-names': 'off',
            'vue/html-self-closing': 'off',
            'vue/singleline-html-element-content-newline': 'off',
            'vue/multiline-html-element-content-newline': 'off',
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'no-console': 'off',
        },
    },

    // Игнорируемые файлы и папки
    {
        ignores: [
            'node_modules/**',
            'vendor/**',
            'public/build/**',
            'storage/**',
            'bootstrap/cache/**',
            'bootstrap/ssr/**',
            'Documents/**',
            '*.config.js',
            '*.config.mjs',
        ],
    },
];
