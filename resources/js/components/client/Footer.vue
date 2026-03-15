<template>
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-content">
                <p>
                    &copy; {{ currentYear }} {{ siteConfig.name }}. All rights
                    reserved.
                </p>
            </div>
        </div>
    </footer>
</template>

<script setup>
defineOptions({
    name: "Footer",
});

import { computed } from "vue";
import siteConfig from "@/config/site";

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped lang="scss">
@use "../../../scss/variables" as *;

.footer {
    background-color: $bg-gray;
    border-top: 1px solid #e5e7eb;
    padding: 2rem 0;
    margin-top: auto;
}

.footer-container {
    max-width: 1380px;
    margin: 0 auto;
    padding: 0 1rem;
}

.footer-content {
    text-align: center;
    color: $text-light-grey;
    font-size: 0.875rem;
}
</style>
