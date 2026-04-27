<template>
    <template v-if="variant === 'desktop'">
        <div
            v-if="hasDropdown"
            class="nav-dropdown"
            role="button"
            aria-haspopup="true"
        >
            <Link
                :href="itemLink"
                class="nav-link"
                :class="{ 'nav-link--exact-page': isExactPageLink }"
                :aria-label="
                    $t('header.nav.item_menu_aria', {
                        item: $t(item.label),
                    })
                "
            >
                {{ $t(item.label) }}
                <Icon
                    name="chevron-down"
                    class="nav-arrow"
                    aria-hidden="true"
                />
            </Link>
            <DropdownMenu
                v-if="itemDropdown"
                :item="props.item"
                variant="desktop"
            />
        </div>
        <Link
            v-else
            :href="itemLink"
            class="nav-link"
            :class="{ 'nav-link--exact-page': isExactPageLink }"
        >
            {{ $t(item.label) }}
        </Link>
    </template>
    <template v-else>
        <div
            v-if="hasDropdown"
            class="mobile-menu-item"
            :class="{ 'mobile-menu-item-open': isOpen }"
        >
            <button
                class="mobile-menu-item-header"
                :aria-expanded="isOpen"
                :aria-label="
                    $t('header.nav.toggle_submenu_aria', {
                        item: $t(item.label),
                    })
                "
                role="menuitem"
                @click="handleToggle"
            >
                <span>{{ $t(item.label) }}</span>
                <Icon
                    name="chevron-down"
                    class="mobile-menu-item-arrow"
                    aria-hidden="true"
                />
            </button>
            <div class="mobile-menu-item-content">
                <DropdownMenu
                    v-if="itemDropdown"
                    :item="props.item"
                    variant="mobile"
                    :on-item-click="onItemClick"
                />
            </div>
        </div>
        <Link
            v-else
            :href="itemLink"
            class="mobile-menu-item-simple"
            :class="{ 'mobile-menu-item-simple--exact-page': isExactPageLink }"
            @click="handleItemClick"
        >
            {{ $t(item.label) }}
        </Link>
    </template>
</template>

<script setup>
/**
 * @fileoverview Компонент для рендеринга одного пункта навигационного меню
 * @typedef {import('./types/nav.types.js').NavMenuItem} NavMenuItem
 */
defineOptions({
    name: "NavMenuItem",
});
import { computed } from "vue";
import { Link, usePage } from "@inertiajs/vue3";
import Icon from "../../Icon.vue";
import DropdownMenu from "./DropdownMenu.vue";

const page = usePage();

/** Реактивный путь без query/hash; обновляется на каждый Inertia-визит (Header — persistent layout, onMounted сработал бы один раз). */
const currentPath = computed(() => {
    const url = page.url || "/";
    const qIdx = url.search(/[?#]/);
    return qIdx === -1 ? url : url.slice(0, qIdx);
});

/**
 * @typedef {Object} Props
 * @property {NavMenuItem} item - Элемент меню
 * @property {'desktop'|'mobile'} variant - Вариант отображения
 * @property {boolean} [isOpen] - Открыт ли dropdown (только для mobile)
 * @property {Function} [onToggle] - Callback для переключения dropdown (только для mobile)
 * @property {Function} [onItemClick] - Callback при клике на элемент (только для mobile)
 */

const props = defineProps({
    /** @type {import('vue').PropType<NavMenuItem>} */
    item: {
        type: Object,
        required: true,
        validator: (value) => {
            return (
                value &&
                typeof value === "object" &&
                typeof value.label === "string" &&
                typeof value.link === "string"
            );
        },
    },
    variant: {
        type: String,
        default: "desktop",
        validator: (value) => ["desktop", "mobile"].includes(value),
    },
    isOpen: {
        type: Boolean,
        default: false,
    },
    onToggle: {
        type: Function,
        default: null,
    },
    onItemClick: {
        type: Function,
        default: null,
    },
});

const hasDropdown = computed(() => Boolean(props.item?.hasDropdown));
const itemLink = computed(() => props.item?.link || "#");
const itemDropdown = computed(() => props.item?.dropdown || null);

/** Активная страница без хеша: только тогда подсвечиваем и делаем некликабельной (на /en не подсвечиваем якоря /en#...) */
const isExactPageLink = computed(() => {
    const path = currentPath.value;
    const prefix = props.item?.activePathPrefix;
    if (prefix) {
        return path === prefix || path.startsWith(`${prefix}/`);
    }
    const link = itemLink.value;
    const pathname = link.includes("#")
        ? link.slice(0, link.indexOf("#"))
        : link;
    return path === pathname && !link.includes("#");
});

const handleToggle = () => {
    props.onToggle?.();
};

const handleItemClick = () => {
    props.onItemClick?.();
};
</script>

<style scoped lang="scss">
@use "../../../../scss/variables" as *;

// Desktop стили
.nav-dropdown {
    position: relative;

    // Невидимый мост между кнопкой и dropdown для плавного перехода курсора
    &::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        height: 25px;
        background: transparent;
        pointer-events: auto;
        z-index: 1002;
    }

    &:hover .nav-arrow {
        transform: rotate(180deg);
    }

    &:hover .nav-link {
        background-color: rgba($accent-primary, 0.05);
        text-decoration: none;
    }

    &:hover :deep(.dropdown-menu) {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
    padding: $spacing-sm $spacing-md;
    border-radius: $radius-md;
    transition:
        color $transition-fast,
        background-color $transition-fast;
    position: relative;

    &:hover {
        color: $accent-primary;
        background-color: rgba($accent-primary, 0.05);
        text-decoration: none;
    }

    /* Только ссылка на текущую страницу без хеша (на /en не подсвечиваем /en#how-it-works) */
    &.nav-link--exact-page {
        color: $accent-primary;
        background-color: rgba($accent-primary, 0.05);
        text-decoration: none;
        pointer-events: none;
        cursor: default;
    }
}

.nav-arrow {
    width: 12px;
    height: 12px;
    color: currentColor;
    transition: transform $transition-fast;
    flex-shrink: 0;
}

// Mobile стили
.mobile-menu-item {
    width: 100%;
    border-bottom: 1px solid $border-color;

    .mobile-menu-item-header {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: $spacing-md;
        background: none;
        border: none;
        text-align: left;
        font-size: $font-size-base;
        font-weight: 400;
        color: $text-color;
        cursor: pointer;
        transition:
            color $transition-fast,
            background-color $transition-fast;

        &:hover {
            color: $accent-primary;
            background-color: rgba($accent-primary, 0.05);
        }

        .mobile-menu-item-arrow {
            width: 12px;
            height: 12px;
            color: currentColor;
            transition: transform $transition-fast;
            flex-shrink: 0;
        }
    }

    &.mobile-menu-item-open {
        .mobile-menu-item-arrow {
            transform: rotate(180deg);
        }

        .mobile-menu-item-content {
            max-height: 5000px;
            opacity: 1;
            padding: 0;
            transition:
                max-height $transition-base,
                opacity $transition-base,
                padding $transition-base;
        }
    }

    .mobile-menu-item-content {
        max-height: 0;
        overflow: hidden;
        opacity: 0;
        transition:
            max-height 0s,
            opacity 0s,
            padding 0s;
        padding: 0 $spacing-md;
        background-color: $bg-gray;
    }
}

.mobile-menu-item-simple {
    display: block;
    width: 100%;
    padding: $spacing-md;
    text-decoration: none;
    color: $text-color;
    font-size: $font-size-base;
    font-weight: 400;
    border-bottom: 1px solid $border-color;
    transition:
        color $transition-fast,
        background-color $transition-fast;

    &:hover {
        color: $accent-primary;
        background-color: rgba($accent-primary, 0.05);
    }

    &.mobile-menu-item-simple--exact-page {
        color: $accent-primary;
        background-color: rgba($accent-primary, 0.05);
        pointer-events: none;
        cursor: default;
    }
}
</style>
