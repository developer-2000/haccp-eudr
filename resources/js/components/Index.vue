<template>
    <div class="app-wrapper">
        <Header />
        <main class="main-content">
            <router-view />
        </main>
        <Footer />
    </div>
</template>

<script setup>
import Header from './header/Header.vue';
import Footer from './Footer.vue';
</script>

