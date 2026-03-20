<template>
    <n-message-provider placement="top-right">
        <div class="app-wrapper">
            <Header />
            <main class="main-content">
                <router-view />
            </main>
        </div>
    </n-message-provider>
</template>

<script setup>
import Header from "../components/client/header/Header.vue";

defineOptions({
    name: "Index",
});
</script>
