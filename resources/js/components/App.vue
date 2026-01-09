<template>
    <Index v-if="!isProfileCompleted" />
    <PersonalPanel v-else />
</template>

<script setup>
defineOptions({
    name: "App",
});

import { computed } from "vue";
import Index from "../basic/Index.vue";
import PersonalPanel from "../basic/PersonalPanel.vue";
import { useAuthStore } from "@/stores";

const authStore = useAuthStore();

const isProfileCompleted = computed(() => authStore.isProfileCompleted());
</script>
