<template>
    <ViconsIcon v-if="isViconsIcon" v-bind="$attrs">
        <component :is="iconComponent" />
    </ViconsIcon>
    <component :is="iconComponent" v-else v-bind="$attrs" />
</template>

<script setup>
defineOptions({
    name: "Icon",
});

import { computed } from "vue";
import {
    ChevronDownIcon,
    MagnifyingGlassIcon,
    Bars3Icon,
    XMarkIcon,
    CheckIcon as CheckIconOutline,
    InformationCircleIcon,
    EyeIcon,
    EyeSlashIcon,
} from "@heroicons/vue/24/outline";
import { InfoCircleTwotone } from "@vicons/antd";
import { IosMailUnread } from "@vicons/ionicons4";
import { Icon as ViconsIcon } from "@vicons/utils";

// Статический объект иконок - не требует реактивности
const icons = Object.freeze({
    "chevron-down": ChevronDownIcon,
    search: MagnifyingGlassIcon,
    bars: Bars3Icon,
    close: XMarkIcon,
    check: CheckIconOutline,
    info: InformationCircleIcon,
    "info-circle-twotone": InfoCircleTwotone,
    eye: EyeIcon,
    "eye-slash": EyeSlashIcon,
    "ios-mail-unread": IosMailUnread,
});

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
});

// Computed кеширует результат и пересчитывается только при изменении props.name
// Object.freeze гарантирует, что icons не изменится, что оптимизирует проверки Vue
const iconComponent = computed(() => icons[props.name] || null);

const viconsIcons = ["info-circle-twotone", "ios-mail-unread"];
const isViconsIcon = computed(() => viconsIcons.includes(props.name));
</script>
