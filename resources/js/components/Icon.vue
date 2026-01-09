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
import {
    InfoCircleTwotone,
    UserOutlined,
    DashboardOutlined,
    FileTextOutlined,
    DatabaseOutlined,
    LogoutOutlined,
} from "@vicons/antd";
import { IosMailUnread } from "@vicons/ionicons4";
import { ExitOutline } from "@vicons/ionicons5";
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
    "user-outlined": UserOutlined,
    "dashboard-outlined": DashboardOutlined,
    "file-text-outlined": FileTextOutlined,
    "database-outlined": DatabaseOutlined,
    "logout-outlined": LogoutOutlined,
    "exit-outline": ExitOutline,
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

const viconsIcons = [
    "info-circle-twotone",
    "ios-mail-unread",
    "user-outlined",
    "dashboard-outlined",
    "file-text-outlined",
    "database-outlined",
    "logout-outlined",
    "exit-outline",
];
const isViconsIcon = computed(() => viconsIcons.includes(props.name));
</script>
