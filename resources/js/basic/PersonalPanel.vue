<template>
    <n-message-provider placement="top-right">
        <n-layout class="admin-layout" has-sider>
            <!-- Боковая панель -->
            <AdminSidebar />

            <!-- Основной контент -->
            <n-layout class="admin-main">
                <!-- Верхняя панель -->
                <AdminHeader />

                <!-- Контент страницы -->
                <n-layout-content class="admin-content">
                    <router-view />
                </n-layout-content>
            </n-layout>
        </n-layout>
    </n-message-provider>
</template>

<script setup>
import { NMessageProvider, NLayout, NLayoutContent } from "naive-ui";
import AdminSidebar from "@/components/admin/AdminSidebar.vue";
import AdminHeader from "@/components/admin/AdminHeader.vue";

defineOptions({
    name: "PersonalPanel",
});
</script>

<style scoped lang="scss">
@use "../../scss/variables" as *;

.admin-layout {
    height: 100vh;

    .admin-main {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;

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
