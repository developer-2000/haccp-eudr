<template>
    <ViconsIcon v-if="isViconsIcon" v-bind="$attrs">
        <component :is="iconComponent" />
    </ViconsIcon>
    <component :is="iconComponent" v-else v-bind="$attrs" />
</template>

<script setup>
/**
 * @fileoverview Универсальный компонент иконок
 *
 * Компонент Icon предоставляет единый интерфейс для работы с иконками из разных библиотек:
 * - @heroicons/vue - иконки Heroicons (chevron-down, search, bars, close, check, info, eye, eye-slash)
 * - @vicons/antd - иконки Ant Design (info-circle-twotone, user-outlined, dashboard-outlined, и т.д.)
 * - @vicons/ionicons4 - иконки Ionicons v4 (ios-mail-unread)
 * - @vicons/ionicons5 - иконки Ionicons v5 (exit-outline)
 *
 * КОМПОНЕНТ РАБОТАЕТ СЛЕДУЮЩИМ ОБРАЗОМ:
 * 1. Принимает пропс `name` - строковое имя иконки
 * 2. Ищет соответствующую иконку в объекте `icons` по ключу `name`
 * 3. Определяет, является ли иконка из библиотеки @vicons (через массив viconsIcons)
 * 4. Если иконка из @vicons - оборачивает её в компонент ViconsIcon для правильного рендеринга
 * 5. Если иконка из @heroicons/vue - рендерит напрямую без обертки
 *
 * ПОЧЕМУ НУЖЕН МАССИВ viconsIcons:
 * Иконки из библиотеки @vicons (antd, ionicons4, ionicons5) требуют специальной обертки
 * в компонент ViconsIcon из @vicons/utils для корректного отображения. Без этой обертки
 * иконки могут не отображаться или отображаться некорректно.
 *
 * Иконки из @heroicons/vue не требуют обертки и рендерятся напрямую.
 *
 * Массив viconsIcons содержит список всех иконок, которые нужно обернуть в ViconsIcon.
 * Это позволяет компоненту автоматически определять, какую иконку как рендерить.
 */

defineOptions({
    name: "Icon",
});

// ============================================
// Импорты
// ============================================
import { computed } from "vue";

/**
 * Иконки из библиотеки @heroicons/vue
 * Эти иконки рендерятся напрямую без обертки
 */
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

/**
 * Иконки из библиотеки @vicons/antd
 * Требуют обертки в ViconsIcon для корректного отображения
 */
import {
    InfoCircleTwotone,
    UserOutlined,
    DashboardOutlined,
    FileTextOutlined,
    DatabaseOutlined,
    LogoutOutlined,
    SettingOutlined,
} from "@vicons/antd";

/**
 * Иконки из библиотеки @vicons/ionicons4
 * Требуют обертки в ViconsIcon для корректного отображения
 */
import { IosMailUnread } from "@vicons/ionicons4";

/**
 * Иконки из библиотеки @vicons/ionicons5
 * Требуют обертки в ViconsIcon для корректного отображения
 */
import { ExitOutline } from "@vicons/ionicons5";

/**
 * ViconsIcon - компонент-обертка из @vicons/utils
 * Используется для правильного рендеринга иконок из библиотек @vicons
 */
import { Icon as ViconsIcon } from "@vicons/utils";

// ============================================
// Конфигурация
// ============================================
/**
 * icons - статический объект-маппинг имен иконок на их компоненты
 * Object.freeze() делает объект неизменяемым, что оптимизирует работу Vue:
 * - Vue не будет отслеживать изменения этого объекта (не нужна реактивность)
 * - Гарантирует, что объект не будет случайно изменен
 *
 * Ключи объекта - строковые имена иконок (используются в пропсе name)
 * Значения - компоненты иконок из разных библиотек
 */
const icons = Object.freeze({
    // Иконки из @heroicons/vue (рендерятся напрямую)
    "chevron-down": ChevronDownIcon,
    search: MagnifyingGlassIcon,
    bars: Bars3Icon,
    close: XMarkIcon,
    check: CheckIconOutline,
    info: InformationCircleIcon,
    eye: EyeIcon,
    "eye-slash": EyeSlashIcon,
    // Иконки из @vicons (требуют обертки ViconsIcon)
    "info-circle-twotone": InfoCircleTwotone,
    "ios-mail-unread": IosMailUnread,
    "user-outlined": UserOutlined,
    "dashboard-outlined": DashboardOutlined,
    "file-text-outlined": FileTextOutlined,
    "database-outlined": DatabaseOutlined,
    "setting-outlined": SettingOutlined,
    "logout-outlined": LogoutOutlined,
    "exit-outline": ExitOutline,
});

// ============================================
// Props
// ============================================
const props = defineProps({
    /**
     * name - имя иконки для отображения
     * Должно соответствовать одному из ключей в объекте icons
     */
    name: {
        type: String,
        required: true,
    },
});

// ============================================
// Computed (Вычисляемые свойства)
// ============================================
/**
 * iconComponent - вычисляемое свойство, возвращающее компонент иконки по имени
 * Computed кеширует результат и пересчитывается только при изменении props.name
 * Object.freeze гарантирует, что icons не изменится, что оптимизирует проверки Vue
 * Если иконка не найдена, возвращает null
 */
const iconComponent = computed(() => icons[props.name] || null);

/**
 * viconsIcons - массив имен иконок из библиотек @vicons
 *
 * ЗАЧЕМ НУЖЕН ЭТОТ МАССИВ:
 * Иконки из библиотек @vicons (antd, ionicons4, ionicons5) требуют специальной обертки
 * в компонент ViconsIcon из @vicons/utils для корректного отображения.
 *
 * БЕЗ ОБЕРТКИ ViconsIcon:
 * - Иконки могут не отображаться вообще
 * - Иконки могут отображаться с неправильными размерами
 * - Иконки могут не наследовать стили (цвет, размер) от родительских элементов
 *
 * С ОБЕРТКОЙ ViconsIcon:
 * - Иконки корректно рендерятся
 * - Правильно наследуют стили
 * - Работают с атрибутами (v-bind="$attrs")
 *
 * Иконки из @heroicons/vue НЕ требуют обертки и рендерятся напрямую.
 *
 * Этот массив используется для автоматического определения, нужно ли оборачивать
 * конкретную иконку в ViconsIcon или рендерить напрямую.
 */
const viconsIcons = [
    "info-circle-twotone",      // @vicons/antd
    "ios-mail-unread",          // @vicons/ionicons4
    "user-outlined",            // @vicons/antd
    "dashboard-outlined",       // @vicons/antd
    "file-text-outlined",       // @vicons/antd
    "database-outlined",        // @vicons/antd
    "setting-outlined",         // @vicons/antd
    "logout-outlined",          // @vicons/antd
    "exit-outline",             // @vicons/ionicons5
];

/**
 * isViconsIcon - вычисляемое свойство, определяющее является ли иконка из библиотеки @vicons
 * Проверяет, содержится ли props.name в массиве viconsIcons
 * Используется в template для условного рендеринга с оберткой ViconsIcon или без неё
 */
const isViconsIcon = computed(() => viconsIcons.includes(props.name));
</script>
