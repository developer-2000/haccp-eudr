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
 * - @tabler/icons-vue - Tabler (report-search / IconReportSearch, …)
 * - @vicons/antd - иконки Ant Design (info-circle-twotone, user-outlined, dashboard-outlined, и т.д.)
 * - @vicons/fluent - Fluent UI System Icons (people-community-24-filled, …)
 * - @vicons/ionicons4 - иконки Ionicons v4 (ios-mail-unread)
 * - @vicons/ionicons5 - иконки Ionicons v5 (exit-outline)
 * - встроенный SVG (hand-point-right — классический FA5-глиф, не пакет FA6)
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
import { computed, h } from "vue";

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
    XCircleIcon,
    CheckCircleIcon,
    InformationCircleIcon,
    EyeIcon,
    EyeSlashIcon,
} from "@heroicons/vue/24/outline";

import { IconReportSearch } from "@tabler/icons-vue";

/**
 * Иконки из библиотеки @vicons/antd
 * Требуют обертки в ViconsIcon для корректного отображения
 */
import {
    InfoCircleTwotone,
    ScheduleTwotone,
    ControlTwotone,
    UserOutlined,
    DashboardOutlined,
    FileTextOutlined,
    DatabaseOutlined,
    LogoutOutlined,
    SettingOutlined,
    RightOutlined,
    LeftOutlined,
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
import { TagExport, TaskComplete } from "@vicons/carbon";

/**
 * Иконки из библиотеки @vicons/material
 * Требуют обертки в ViconsIcon для корректного отображения
 */
import {
    BusinessCenterRound,
    BatteryCharging90Round,
    AccountBalanceTwotone,
    AccountBalanceWalletTwotone,
    CoffeeMakerTwotone,
    DashboardTwotone,
    LaptopMacTwotone,
    SmartphoneTwotone,
    WatchLaterTwotone,
    QrCodeTwotone,
    EventRepeatTwotone,
    DeleteForeverTwotone,
    MarkEmailReadTwotone,
} from "@vicons/material";

/** Fluent UI System Icons (Microsoft), через @vicons/fluent */
import {
    PeopleCommunity24Filled,
    TargetArrow24Regular,
} from "@vicons/fluent";

/**
 * ViconsIcon - компонент-обертка из @vicons/utils
 * Используется для правильного рендеринга иконок из библиотек @vicons
 */
import { Icon as ViconsIcon } from "@vicons/utils";

/** FA6 `faHandPointRight` — другой глиф; здесь путь как в FA5 / сайте Font Awesome. */
const HAND_POINT_RIGHT_PATH_D =
    "M512 199.652c0 23.625-20.65 43.826-44.8 43.826h-99.851c16.34 17.048 18.346 49.766-6.299 70.944c14.288 22.829 2.147 53.017-16.45 62.315C353.574 425.878 322.654 448 272 448c-2.746 0-13.276-.203-16-.195c-61.971.168-76.894-31.065-123.731-38.315C120.596 407.683 112 397.599 112 385.786V214.261l.002-.001c.011-18.366 10.607-35.889 28.464-43.845c28.886-12.994 95.413-49.038 107.534-77.323c7.797-18.194 21.384-29.084 40-29.092c34.222-.014 57.752 35.098 44.119 66.908c-3.583 8.359-8.312 16.67-14.153 24.918H467.2c23.45 0 44.8 20.543 44.8 43.826zM96 200v192c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V200c0-13.255 10.745-24 24-24h48c13.255 0 24 10.745 24 24zM68 368c0-11.046-8.954-20-20-20s-20 8.954-20 20s8.954 20 20 20s20-8.954 20-20z";

const HandPointRightIcon = {
    name: "HandPointRightIcon",
    inheritAttrs: false,
    setup(_, { attrs }) {
        return () =>
            h(
                "svg",
                {
                    xmlns: "http://www.w3.org/2000/svg",
                    viewBox: "0 0 512 512",
                    fill: "currentColor",
                    ...attrs,
                },
                [
                    h("path", {
                        d: HAND_POINT_RIGHT_PATH_D,
                    }),
                ],
            );
    },
};

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
    "x-circle": XCircleIcon,
    "check-circle": CheckCircleIcon,
    info: InformationCircleIcon,
    eye: EyeIcon,
    "eye-slash": EyeSlashIcon,
    // Tabler (@tabler/icons-vue), рендер напрямую
    "report-search": IconReportSearch,
    // Встроенный SVG (классический hand-point-right)
    "hand-point-right": HandPointRightIcon,
    // Иконки из @vicons (требуют обертки ViconsIcon)
    "info-circle-twotone": InfoCircleTwotone,
    "schedule-twotone": ScheduleTwotone,
    "control-twotone": ControlTwotone,
    "ios-mail-unread": IosMailUnread,
    "user-outlined": UserOutlined,
    "dashboard-outlined": DashboardOutlined,
    "file-text-outlined": FileTextOutlined,
    "database-outlined": DatabaseOutlined,
    "setting-outlined": SettingOutlined,
    "logout-outlined": LogoutOutlined,
    "right-outlined": RightOutlined,
    "left-outlined": LeftOutlined,
    "exit-outline": ExitOutline,
    "tag-export": TagExport,
    "task-complete": TaskComplete,
    "business-center-round": BusinessCenterRound,
    "battery-charging-90-round": BatteryCharging90Round,
    "account-balance-twotone": AccountBalanceTwotone,
    "account-balance-wallet-twotone": AccountBalanceWalletTwotone,
    "coffee-maker-twotone": CoffeeMakerTwotone,
    "dashboard-twotone": DashboardTwotone,
    "laptop-mac-twotone": LaptopMacTwotone,
    "smartphone-twotone": SmartphoneTwotone,
    "watch-later-twotone": WatchLaterTwotone,
    "qr-code-twotone": QrCodeTwotone,
    "event-repeat-twotone": EventRepeatTwotone,
    "delete-forever-twotone": DeleteForeverTwotone,
    "mark-email-read-twotone": MarkEmailReadTwotone,
    "people-community-24-filled": PeopleCommunity24Filled,
    "target-arrow-24-regular": TargetArrow24Regular,
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
    "info-circle-twotone", // @vicons/antd
    "ios-mail-unread", // @vicons/ionicons4
    "control-twotone", // @vicons/antd
    "user-outlined", // @vicons/antd
    "dashboard-outlined", // @vicons/antd
    "file-text-outlined", // @vicons/antd
    "database-outlined", // @vicons/antd
    "setting-outlined", // @vicons/antd
    "logout-outlined", // @vicons/antd
    "right-outlined", // @vicons/antd
    "left-outlined", // @vicons/antd
    "exit-outline", // @vicons/ionicons5
    "tag-export", // @vicons/carbon
    "task-complete", // @vicons/carbon
    "business-center-round", // @vicons/material
    "battery-charging-90-round", // @vicons/material
    "account-balance-twotone", // @vicons/material
    "account-balance-wallet-twotone", // @vicons/material
    "coffee-maker-twotone", // @vicons/material
    "dashboard-twotone", // @vicons/material
    "laptop-mac-twotone", // @vicons/material
    "smartphone-twotone", // @vicons/material
    "watch-later-twotone", // @vicons/material
    "event-repeat-twotone", // @vicons/material
    "delete-forever-twotone", // @vicons/material
    "mark-email-read-twotone", // @vicons/material
    "people-community-24-filled", // @vicons/fluent
    "target-arrow-24-regular", // @vicons/fluent
];

/**
 * isViconsIcon - вычисляемое свойство, определяющее является ли иконка из библиотеки @vicons
 * Проверяет, содержится ли props.name в массиве viconsIcons
 * Используется в template для условного рендеринга с оберткой ViconsIcon или без неё
 */
const isViconsIcon = computed(() => viconsIcons.includes(props.name));
</script>
