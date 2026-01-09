<template>
    <n-message-provider placement="top-right">
        <div class="app-wrapper">
            <Header />
            <main class="main-content">
                <router-view />
            </main>
<!--            <Footer />-->
        </div>
    </n-message-provider>
</template>

<script setup>
defineOptions({
    name: "PersonalPanel",
});

import Header from "../components/client/header/Header.vue";

</script>
