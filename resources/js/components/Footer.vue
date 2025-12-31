<template>
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-content">
                <p>&copy; {{ currentYear }} SafeBatch. All rights reserved.</p>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.footer {
    background-color: #ffffff;
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
    color: #6b7280;
    font-size: 0.875rem;
}
</style>

