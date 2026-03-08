<template>
    <n-message-provider placement="top-right">
        <div class="app-wrapper">
            <Header />
            <main class="main-content">
                <router-view />
            </main>
            <Footer v-if="!isAuthRoute" />
        </div>
    </n-message-provider>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Header from "../components/client/header/Header.vue";
import Footer from "../components/client/header/Footer.vue";

defineOptions({
    name: "Index",
});

const route = useRoute();
const isAuthRoute = computed(() => route.path.startsWith("/auth/"));
</script>
