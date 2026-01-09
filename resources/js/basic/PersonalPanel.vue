<template>
    <n-message-provider placement="top-right">
        <n-layout class="admin-layout" has-sider>
            <!-- Боковая панель -->
            <n-layout-sider
                :width="240"
                :native-scrollbar="false"
                bordered
                class="admin-sidebar"
            >
                <div class="sidebar-header">
                    <router-link to="/personal-panel" class="logo-text">
                        {{ siteConfig.name }} Admin
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

            <!-- Основной контент -->
            <n-layout class="admin-main">
                <!-- Верхняя панель -->
                <n-layout-header bordered class="admin-header">
                    <div class="header-left"> </div>

                    <div class="header-center"> </div>

                    <div class="header-right">
                        <div ref="userButtonWrapperRef" class="user-button-wrapper">
                            <n-dropdown
                                :options="userMenuOptions"
                                trigger="click"
                                :width="dropdownWidth"
                                @select="handleMenuSelect"
                            >
                                <n-button quaternary class="btn-top-menu">
                                    <Icon name="user-outlined" class="user-icon" />
                                    {{ userName }}
                                </n-button>
                            </n-dropdown>
                        </div>
                    </div>
                </n-layout-header>

                <!-- Контент страницы -->
                <n-layout-content class="admin-content">
                    <router-view />
                </n-layout-content>
            </n-layout>
        </n-layout>
    </n-message-provider>
</template>

<script setup>
import { h, computed, ref, onMounted, nextTick, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { NMessageProvider, NLayout, NLayoutSider, NLayoutHeader, NLayoutContent, NMenu, NButton, NDropdown } from "naive-ui";
import siteConfig from "@/config/site";
import { useAuthStore } from "@/stores";
import Icon from "@/components/Icon.vue";

defineOptions({
    name: "PersonalPanel",
});

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const userName = computed(() => {
    return authStore.user?.name || "User";
});

const userButtonWrapperRef = ref(null);
const dropdownWidth = ref(undefined);

const updateDropdownWidth = () => {
    nextTick(() => {
        if (userButtonWrapperRef.value) {
            const button = userButtonWrapperRef.value.querySelector(".n-button");
            if (button) {
                dropdownWidth.value = button.offsetWidth;
            }
        }
    });
};

onMounted(() => {
    updateDropdownWidth();
});

// Обновляем ширину при изменении имени пользователя
watch(userName, () => {
    updateDropdownWidth();
});

const handleMenuSelect = (key) => {
    if (key === "logout") {
        authStore.logout();
        router.push("/");
    }
};

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
    return "dashboard";
});

const handleMenuUpdate = (key) => {
    const menuItem = findMenuItemByKey(menuOptions, key);
    if (menuItem && menuItem.path) {
        router.push(menuItem.path);
    }
};

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

const menuOptions = [
    {
        label: "Главная",
        key: "dashboard",
        path: "/personal-panel",
        icon: () => h(Icon, { name: "dashboard-outlined" }),
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

const defaultExpandedKeys = [];

const userMenuOptions = [
    {
        label: "Logout",
        key: "logout",
    },
];
</script>

<style scoped lang="scss">
@use "../../scss/variables" as *;

.admin-layout {
    height: 100vh;

    .admin-sidebar {
        .sidebar-header {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 64px;
            border-bottom: 1px solid var(--n-border-color);

            .logo-text {
                font-size: 18px;
                font-weight: 600;
                color: var(--n-text-color);
                text-decoration: none;
                cursor: pointer;
                transition: opacity 0.2s;

                &:hover {
                    opacity: 0.8;
                }
            }
        }

        .sidebar-menu {
            flex: 1;
            padding: 8px 0;
        }
    }

    .admin-main {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;

        .admin-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            height: 64px;
            background: var(--n-color);
            font-size: 16px;

            .header-left {
                display: flex;
                align-items: center;
            }

            .header-center {
                flex: 1;
                display: flex;
                justify-content: center;
                padding: 0 24px;
            }

            .header-right {
                display: flex;
                align-items: center;
                gap: 12px;

                .user-button-wrapper {
                    display: inline-block;
                }

                .btn-top-menu {
                    font-size: inherit;
                }
            }
        }

        .admin-content {
            flex: 1;
            min-height: calc(100vh - 64px);
            background: var(--n-color);
            overflow-y: auto;
        }
    }

    :deep(.xicon){
        width: 18px;
        height: 18px;
        margin-right: 5px;
        svg {
            width: 18px;
            height: 18px;
        }
    }
}
</style>
