import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import babelParser from '@babel/eslint-parser';

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
                    presets: ['@babel/preset-env']
                }
            },
            globals: {
                console: 'readonly',
                process: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                module: 'readonly',
                require: 'readonly',
                exports: 'readonly',
                window: 'readonly',
                localStorage: 'readonly',
                document: 'readonly'
            }
        },
        plugins: {
            prettier
        },
        rules: {
            'prettier/prettier': 'error',
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'no-console': 'off'
        }
    },
    
    // Правила для Vue файлов
    {
        files: ['**/*.vue'],
        languageOptions: {
            globals: {
                console: 'readonly',
                window: 'readonly',
                document: 'readonly',
                localStorage: 'readonly'
            }
        },
        plugins: {
            prettier
        },
        rules: {
            'prettier/prettier': 'error',
            'vue/multi-word-component-names': 'off',
            'vue/no-reserved-component-names': 'off',
            'vue/html-self-closing': 'off',
            'vue/singleline-html-element-content-newline': 'off',
            'vue/multiline-html-element-content-newline': 'off',
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'no-console': 'off'
        }
    },
    
    // Игнорируемые файлы и папки
    {
        ignores: [
            'node_modules/**',
            'vendor/**',
            'public/build/**',
            'storage/**',
            'bootstrap/cache/**',
            '*.config.js',
            '*.config.mjs'
        ]
    }
];

