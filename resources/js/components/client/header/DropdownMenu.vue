<template>
    <template v-if="hasColumns">
        <div
            v-if="variant === 'desktop'"
            class="dropdown-menu dropdown-menu-with-headers"
        >
            <div
                v-for="column in item.dropdown.columns"
                :key="column.title"
                class="dropdown-column"
            >
                <div class="dropdown-column-title">{{ column.title }}</div>
                <template
                    v-for="dropdownItem in column.items"
                    :key="`${dropdownItem.title}-${dropdownItem.link || ''}`"
                >
                    <router-link
                        v-if="
                            hasValidLink(dropdownItem) &&
                            !isDropdownLink(dropdownItem)
                        "
                        :to="dropdownItem.link"
                        class="dropdown-item"
                    >
                        <div class="dropdown-title">
                            {{ dropdownItem.title }}
                        </div>
                        <div
                            v-if="dropdownItem.description"
                            class="dropdown-desc"
                        >
                            {{ dropdownItem.description }}
                        </div>
                    </router-link>
                    <router-link
                        v-else-if="isDropdownLink(dropdownItem)"
                        :to="dropdownItem.link"
                        class="dropdown-link"
                    >
                        {{ dropdownItem.title }} →
                    </router-link>
                    <div v-else class="dropdown-item">
                        <div class="dropdown-title">
                            {{ dropdownItem.title }}
                        </div>
                        <div
                            v-if="dropdownItem.description"
                            class="dropdown-desc"
                        >
                            {{ dropdownItem.description }}
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <template v-else>
            <template
                v-for="column in item.dropdown.columns"
                :key="column.title"
            >
                <div class="mobile-menu-column">
                    <div class="mobile-menu-column-title">
                        {{ column.title }}
                    </div>
                    <template
                        v-for="dropdownItem in column.items"
                        :key="`${dropdownItem.title}-${dropdownItem.link || ''}`"
                    >
                        <router-link
                            v-if="
                                hasValidLink(dropdownItem) &&
                                !isDropdownLink(dropdownItem)
                            "
                            :to="dropdownItem.link"
                            class="mobile-menu-subitem"
                            @click="handleClick"
                        >
                            <div class="mobile-menu-subitem-title">
                                {{ dropdownItem.title }}
                            </div>
                            <div
                                v-if="dropdownItem.description"
                                class="mobile-menu-subitem-desc"
                            >
                                {{ dropdownItem.description }}
                            </div>
                        </router-link>
                        <router-link
                            v-else-if="isDropdownLink(dropdownItem)"
                            :to="dropdownItem.link"
                            class="mobile-menu-subitem-link"
                            @click="handleClick"
                        >
                            {{ dropdownItem.title }} →
                        </router-link>
                        <div v-else class="mobile-menu-subitem">
                            <div class="mobile-menu-subitem-title">
                                {{ dropdownItem.title }}
                            </div>
                            <div
                                v-if="dropdownItem.description"
                                class="mobile-menu-subitem-desc"
                            >
                                {{ dropdownItem.description }}
                            </div>
                        </div>
                    </template>
                </div>
            </template>
        </template>
    </template>
    <template v-else-if="isSimple">
        <div
            v-if="variant === 'desktop'"
            class="dropdown-menu"
            :class="{ 'dropdown-menu-columns': hasSecondColumn }"
        >
            <div class="dropdown-column">
                <template
                    v-for="dropdownItem in firstColumnItems"
                    :key="`${dropdownItem.title}-${dropdownItem.link || ''}`"
                >
                    <router-link
                        v-if="hasValidLink(dropdownItem)"
                        :to="dropdownItem.link"
                        class="dropdown-item"
                    >
                        <div class="dropdown-title">
                            {{ dropdownItem.title }}
                        </div>
                        <div class="dropdown-desc">
                            {{ dropdownItem.description }}
                        </div>
                    </router-link>
                    <div v-else class="dropdown-item">
                        <div class="dropdown-title">
                            {{ dropdownItem.title }}
                        </div>
                        <div class="dropdown-desc">
                            {{ dropdownItem.description }}
                        </div>
                    </div>
                </template>
            </div>
            <div v-if="hasSecondColumn" class="dropdown-column">
                <template
                    v-for="dropdownItem in secondColumnItems"
                    :key="`${dropdownItem.title}-${dropdownItem.link || ''}`"
                >
                    <router-link
                        v-if="hasValidLink(dropdownItem)"
                        :to="dropdownItem.link"
                        class="dropdown-item"
                    >
                        <div class="dropdown-title">
                            {{ dropdownItem.title }}
                        </div>
                        <div class="dropdown-desc">
                            {{ dropdownItem.description }}
                        </div>
                    </router-link>
                    <div v-else class="dropdown-item">
                        <div class="dropdown-title">
                            {{ dropdownItem.title }}
                        </div>
                        <div class="dropdown-desc">
                            {{ dropdownItem.description }}
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <template v-else>
            <template
                v-for="dropdownItem in item.dropdown"
                :key="`${dropdownItem.title}-${dropdownItem.link || ''}`"
            >
                <router-link
                    v-if="hasValidLink(dropdownItem)"
                    :to="dropdownItem.link"
                    class="mobile-menu-subitem"
                    @click="handleClick"
                >
                    <div class="mobile-menu-subitem-title">
                        {{ dropdownItem.title }}
                    </div>
                    <div
                        v-if="dropdownItem.description"
                        class="mobile-menu-subitem-desc"
                    >
                        {{ dropdownItem.description }}
                    </div>
                </router-link>
                <div v-else class="mobile-menu-subitem">
                    <div class="mobile-menu-subitem-title">
                        {{ dropdownItem.title }}
                    </div>
                    <div
                        v-if="dropdownItem.description"
                        class="mobile-menu-subitem-desc"
                    >
                        {{ dropdownItem.description }}
                    </div>
                </div>
            </template>
        </template>
    </template>
</template>

<script setup>
/**
 * @fileoverview Универсальный компонент dropdown меню для desktop и mobile версий
 * @typedef {import('./types/nav.types.js').NavMenuItem} NavMenuItem
 */
defineOptions({
    name: "DropdownMenu",
});
import { computed } from "vue";
import {
    hasDropdownColumns,
    isSimpleDropdown,
    hasValidLink,
    isDropdownLink,
} from "./utils/dropdownHelpers";

/**
 * @typedef {Object} Props
 * @property {NavMenuItem} item - Элемент меню с dropdown
 * @property {'desktop'|'mobile'} variant - Вариант отображения
 * @property {Function} [onItemClick] - Callback функция при клике на элемент (только для mobile)
 */

/** @type {import('vue').DefineComponent<Props>} */
const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
    variant: {
        type: String,
        default: "desktop",
        validator: (value) => ["desktop", "mobile"].includes(value),
    },
    onItemClick: {
        type: Function,
        default: null,
    },
});

/** @type {import('vue').ComputedRef<boolean>} */
const hasColumns = computed(() => {
    if (!props.item) {
        return false;
    }
    return hasDropdownColumns(props.item);
});

/** @type {import('vue').ComputedRef<boolean>} */
const isSimple = computed(() => {
    if (!props.item) {
        return false;
    }
    return isSimpleDropdown(props.item);
});

/** @type {import('vue').ComputedRef<any[]>} */
const firstColumnItems = computed(() => {
    if (!isSimple.value || !Array.isArray(props.item?.dropdown)) {
        return [];
    }
    return props.item.dropdown.slice(0, 4);
});

/** @type {import('vue').ComputedRef<any[]>} */
const secondColumnItems = computed(() => {
    if (!isSimple.value || !Array.isArray(props.item?.dropdown)) {
        return [];
    }
    return props.item.dropdown.slice(4);
});

/** @type {import('vue').ComputedRef<boolean>} */
const hasSecondColumn = computed(() => {
    return (
        Array.isArray(props.item?.dropdown) && props.item.dropdown.length > 4
    );
});

/**
 * Обработчик клика на элемент dropdown (только для mobile)
 */
const handleClick = () => {
    props.onItemClick?.();
};
</script>

<style scoped lang="scss">
@use "../../../../scss/variables" as *;

// ============================================
// Desktop стили
// ============================================

.dropdown-menu {
    position: absolute;
    top: calc(100% + 25px);
    border: 1px solid $border-color;
    left: 0;
    background-color: $white-color;
    border-radius: $radius-lg;
    box-shadow: $shadow-xl;
    padding: $spacing-md;
    min-width: 320px;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
    overscroll-behavior: contain;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition:
        opacity $transition-base,
        visibility $transition-base,
        transform $transition-base;
    z-index: 1001;

    // Стили для скроллбара (WebKit браузеры: Chrome, Safari, Edge)
    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: $bg-gray;
        border-radius: $radius-full;
        margin: $spacing-sm 0;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba($primary-color, 0.3);
        border-radius: $radius-full;
        transition: background $transition-fast;

        &:hover {
            background: rgba($primary-color, 0.5);
        }

        &:active {
            background: $primary-color;
        }
    }

    // Стили для скроллбара (Firefox)
    scrollbar-width: thin;
    scrollbar-color: rgba($primary-color, 0.3) $bg-gray;

    &.dropdown-menu-columns {
        display: flex;
        gap: $spacing-lg;
        min-width: 640px;

        .dropdown-column {
            flex: 1;
            min-width: 0;
        }
    }

    &.dropdown-menu-with-headers {
        display: flex;
        gap: $spacing-xl;
        min-width: 900px;
        padding: $spacing-xl;

        .dropdown-column {
            flex: 1;
            min-width: 0;
        }
    }

    .dropdown-column-title {
        font-size: $font-size-base;
        font-weight: 600;
        margin-bottom: $spacing-md;
        padding-bottom: $spacing-sm;
        border-bottom: 2px solid $primary-color;
    }

    .dropdown-item {
        padding: 16px 16px 10px 16px;
        cursor: pointer;
        transition: background-color $transition-fast;
        display: block;
        text-decoration: none;
        color: inherit;

        &:hover {
            background-color: rgba($primary-color, 0.05);
        }

        &:not(:last-child) {
            margin-bottom: $spacing-xs;
        }
    }

    .dropdown-title {
        font-size: $font-size-base;
        font-weight: 600;
        margin-bottom: 4px;
    }

    .dropdown-desc {
        font-size: $font-size-xs;
        color: $text-light-grey;
        line-height: 1.4;
    }

    .dropdown-link {
        display: inline-block;
        margin: 12px 0 12px 16px;
        color: $primary-color;
        text-decoration: none;
        font-size: $font-size-sm;
        font-weight: 500;
        transition: color $transition-fast;

        &:hover {
            color: $primary-color-dark;
        }
    }
}

// ============================================
// Mobile стили
// ============================================

.mobile-menu-column {
    .mobile-menu-column-title {
        font-size: $font-size-sm;
        font-weight: 600;
        color: $text-color;
        background: $white-color;
        padding-top: 15px;
    }
    .mobile-menu-column-title:first-child {
        padding: 0;
    }
}

.mobile-menu-subitem {
    display: block;
    padding: $spacing-sm $spacing-md;
    margin: 1px 0 0 0;
    text-decoration: none;
    color: inherit;
    transition: background-color $transition-fast;
    background-color: $bg-light-primary;

    &:hover {
        background-color: rgba($primary-color, 0.05);
    }

    .mobile-menu-subitem-title {
        font-size: $font-size-sm;
        font-weight: 600;
        margin-bottom: 2px;
        color: $text-color;
    }

    .mobile-menu-subitem-desc {
        font-size: $font-size-xs;
        color: $text-light-grey;
        line-height: 1.4;
    }
}

.mobile-menu-subitem-link {
    display: inline-block;
    color: $primary-color;
    text-decoration: none;
    font-size: $font-size-sm;
    font-weight: 500;
    transition: color $transition-fast;
    background: $white-color;
    width: 100%;
    margin: 0;
    padding: 8px 0 8px 16px;

    &:hover {
        color: $primary-color-dark;
    }
}
</style>
