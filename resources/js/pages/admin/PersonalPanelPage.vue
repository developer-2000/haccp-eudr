<template>
    <div class="container">
        <div class="personal-panel">
            <h1>привет</h1>
        </div>
    </div>
</template>

<script setup>
defineOptions({
    name: "PersonalPanelPage",
});
</script>

<style scoped lang="scss">
@use "../../../scss/variables" as *;

.personal-panel {
    padding: 2rem 0;
    text-align: center;

    h1 {
        font-size: 2rem;
        color: $text-color;
    }
}
</style>
