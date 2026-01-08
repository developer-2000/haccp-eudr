<template>
    <n-message-provider placement="top-right">
        <div class="app-wrapper">
            <Header />
            <main class="main-content">
                <router-view />
            </main>
            <Footer />
        </div>
    </n-message-provider>
</template>

<script setup>
defineOptions({
    name: "Index",
});

import Header from "./header/Header.vue";
import Footer from "./Footer.vue";
</script>
