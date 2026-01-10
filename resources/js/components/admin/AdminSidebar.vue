<template>
    <n-layout-sider
        :width="240"
        :native-scrollbar="false"
        bordered
        class="admin-sidebar"
    >
        <div class="sidebar-header">
            <router-link to="/personal-panel" class="logo-link">
                <span class="logo-site">{{ siteConfig.name }}</span>
            </router-link>
        </div>

        <n-menu
            :value="activeKey"
            :options="menuOptions"
            :default-expanded-keys="defaultExpandedKeys"
            @update:value="handleMenuUpdate"
            class="sidebar-menu"
        />
    </n-layout-sider>
</template>

<script setup>
/**
 * @fileoverview Компонент боковой панели административной панели
 *
 * Компонент отображает навигационное меню с логотипом сайта и пунктами меню:
 * - Главная (dashboard)
 * - Документы (с подпунктами: Все документы, Шаблоны)
 * - База данных
 * - Settings HACCP
 *
 * Автоматически определяет активный пункт меню на основе текущего маршрута
 */

defineOptions({
    name: "AdminSidebar",
});

// ============================================
// Импорты
// ============================================
import { h, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { NLayoutSider, NMenu } from "naive-ui";
import siteConfig from "@/config/site";
import Icon from "@/components/Icon.vue";

// ============================================
// State (Реактивное состояние)
// ============================================
const router = useRouter();
const route = useRoute();
/**
 * defaultExpandedKeys - массив ключей пунктов меню, которые должны быть развернуты по умолчанию
 * В данный момент пустой, но может быть использован для автоматического разворачивания подменю
 */
const defaultExpandedKeys = [];
// ============================================
// Конфигурация
// ============================================
/**
 * menuOptions - массив опций меню боковой панели
 * Каждый пункт содержит: label (название), key (уникальный ключ), path (маршрут), icon (иконка)
 * Подпункты определяются через children
 */
const menuOptions = [
    {
        label: "Главная",
        key: "dashboard",
        path: "/personal-panel",
        icon: () => h(Icon, { name: "dashboard-outlined" }),
    },
    {
        label: "Settings HACCP",
        key: "settings-haccp",
        path: "/personal-panel/settings-haccp",
        icon: () => h(Icon, { name: "setting-outlined" }),
    },
    {
        label: "Документы",
        key: "documents",
        icon: () => h(Icon, { name: "file-text-outlined" }),
        children: [
            {
                label: "Все документы",
                key: "documents-all",
                path: "/personal-panel/documents",
            },
            {
                label: "Шаблоны",
                key: "documents-templates",
                path: "/personal-panel/documents/templates",
            },
        ],
    },
    {
        label: "База данных",
        key: "database",
        path: "/personal-panel/database",
        icon: () => h(Icon, { name: "database-outlined" }),
    },
];
// ============================================
// Computed (Вычисляемые свойства)
// ============================================
/**
 * activeKey - вычисляемое свойство для определения активного пункта меню
 * Определяется на основе текущего маршрута (route.path)
 * Возвращает ключ пункта меню в зависимости от пути
 */
const activeKey = computed(() => {
    const path = route.path;
    if (path === "/personal-panel") {
        return "dashboard";
    }
    if (path.startsWith("/personal-panel/documents")) {
        return "documents";
    }
    if (path.startsWith("/personal-panel/database")) {
        return "database";
    }
    if (path.startsWith("/personal-panel/settings-haccp")) {
        return "settings-haccp";
    }
    return "dashboard";
});

// ============================================
// Методы
// ============================================
/**
 * handleMenuUpdate - обработчик обновления меню при клике на пункт
 * Находит пункт меню по ключу и выполняет навигацию на соответствующий путь
 * @param {string} key - ключ выбранного пункта меню
 */
const handleMenuUpdate = (key) => {
    const menuItem = findMenuItemByKey(menuOptions, key);
    if (menuItem && menuItem.path) {
        router.push(menuItem.path);
    }
};

/**
 * findMenuItemByKey - рекурсивная функция поиска пункта меню по ключу
 * Ищет в основном массиве и во вложенных children
 * @param {Array} options - массив опций меню
 * @param {string} key - ключ для поиска
 * @returns {Object|null} - найденный пункт меню или null
 */
const findMenuItemByKey = (options, key) => {
    for (const item of options) {
        if (item.key === key) {
            return item;
        }
        if (item.children) {
            const found = findMenuItemByKey(item.children, key);
            if (found) return found;
        }
    }
    return null;
};

</script>

<style scoped lang="scss">
@use "../../../scss/variables" as *;

.admin-sidebar {
    .sidebar-header {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 64px;
        border-bottom: 1px solid var(--n-border-color);

        .logo-site {
            font-size: 18px;
        }
    }

    .sidebar-menu {
        flex: 1;
        padding: 8px 0;
    }
}
</style>
