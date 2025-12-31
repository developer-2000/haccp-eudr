<template>
    <component :is="iconComponent" v-bind="$attrs" />
</template>

<script setup>
import { computed } from 'vue';
import {
    ChevronDownIcon,
    MagnifyingGlassIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/vue/24/outline';

// Статический объект иконок - не требует реактивности
const icons = Object.freeze({
    'chevron-down': ChevronDownIcon,
    'search': MagnifyingGlassIcon,
    'bars': Bars3Icon,
    'close': XMarkIcon
});

const props = defineProps({
    name: {
        type: String,
        required: true
    }
});

// Computed кеширует результат и пересчитывается только при изменении props.name
// Object.freeze гарантирует, что icons не изменится, что оптимизирует проверки Vue
const iconComponent = computed(() => icons[props.name] || null);
</script>

