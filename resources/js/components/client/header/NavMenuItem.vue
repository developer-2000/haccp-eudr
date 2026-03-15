<template>
    <template v-if="variant === 'desktop'">
        <div
            v-if="hasDropdown"
            class="nav-dropdown"
            role="button"
            aria-haspopup="true"
        >
            <router-link
                :to="itemLink"
                class="nav-link"
                :aria-label="`${$t(item.label)} menu`"
            >
                {{ $t(item.label) }}
                <Icon
                    name="chevron-down"
                    class="nav-arrow"
                    aria-hidden="true"
                />
            </router-link>
            <DropdownMenu
                v-if="itemDropdown"
                :item="props.item"
                variant="desktop"
            />
        </div>
        <router-link v-else :to="itemLink" class="nav-link">
            {{ $t(item.label) }}
        </router-link>
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
                :aria-label="`Toggle ${$t(item.label)} submenu`"
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
        <router-link
            v-else
            :to="itemLink"
            class="mobile-menu-item-simple"
            @click="handleItemClick"
        >
            {{ $t(item.label) }}
        </router-link>
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
import Icon from "../../Icon.vue";
import DropdownMenu from "./DropdownMenu.vue";

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
        background-color: rgba($primary-color, 0.05);
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
    padding: $spacing-sm $spacing-md;
    border-radius: $radius-md;
    transition:
        color $transition-fast,
        background-color $transition-fast;
    position: relative;

    &:hover {
        color: $primary-color;
        background-color: rgba($primary-color, 0.05);
        text-decoration: none;
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
            color: $primary-color;
            background-color: rgba($primary-color, 0.05);
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
        color: $primary-color;
        background-color: rgba($primary-color, 0.05);
    }
}
</style>
