<template>
    <div class="vue-greeting">
        <h1>{{ message }}</h1>
    </div>
</template>

<script>
export default {
    name: 'Index',
    data() {
        return {
            message: 'Привет мир из Vue.js 22'
        };
    }
}
</script>

<style scoped>
.vue-greeting {
    text-align: center;
    padding: 2rem;
}

.vue-greeting h1 {
    font-size: 2rem;
    color: #FF2D20;
    margin: 0;
}
</style>

