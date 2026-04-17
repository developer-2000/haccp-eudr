<template>
    <nav :class="rootNavClass" :aria-label="ariaLabel">
        <button
            v-for="item in links"
            :key="item.id"
            type="button"
            :class="buttonClassList(item.id)"
            :aria-label="bottomButtonAriaLabel(item)"
            @click="handleSelect(item.id)"
        >
            <Icon
                v-if="item.svg && props.variant === 'bottom'"
                :name="item.svg"
                class="demo-section-nav__icon"
                aria-hidden="true"
            />
            <span
                v-if="showNavTextLabel(item)"
                class="demo-section-nav__label"
                >{{ item.label }}</span
            >
        </button>
    </nav>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import Icon from "@/components/Icon.vue";

defineOptions({ name: "DemoSectionNavigation" });

/** Совпадает с `$breakpoint-lg`: пока видна `demo-bottom-nav` вместо сайдбара — только иконки */
const BOTTOM_ICONS_ONLY_MQ = "(max-width: 1024px)";

const isBottomIconsOnly = ref(
    typeof window !== "undefined" &&
        window.matchMedia(BOTTOM_ICONS_ONLY_MQ).matches,
);

let bottomNavMq = null;
/** @type {(() => void) | null} */
let syncBottomNavMq = null;

onMounted(() => {
    bottomNavMq = window.matchMedia(BOTTOM_ICONS_ONLY_MQ);
    syncBottomNavMq = () => {
        isBottomIconsOnly.value = bottomNavMq.matches;
    };
    syncBottomNavMq();
    bottomNavMq.addEventListener("change", syncBottomNavMq);
});

onUnmounted(() => {
    if (bottomNavMq && syncBottomNavMq) {
        bottomNavMq.removeEventListener("change", syncBottomNavMq);
    }
});

const props = defineProps({
    variant: {
        type: String,
        required: true,
        validator: (value) => value === "sidebar" || value === "bottom",
    },
    links: {
        type: Array,
        required: true,
    },
    activeId: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(["select"]);

/**
 * Сайдбар: всегда текст. Полоса снизу/сверху: при «компактном» брейкпинте без span,
 * если есть `svg` (иначе остаётся подпись — нет иконки в Icon).
 */
const showNavTextLabel = (item) => {
    if (props.variant === "sidebar") return true;
    if (props.variant !== "bottom") return false;
    if (!isBottomIconsOnly.value) return true;
    return !item.svg;
};

const bottomButtonAriaLabel = (item) => {
    if (
        props.variant === "bottom" &&
        isBottomIconsOnly.value &&
        item.svg
    ) {
        return item.label;
    }
    return undefined;
};

const rootNavClass = computed(() =>
    props.variant === "sidebar" ? "demo-sidebar__nav" : "demo-bottom-nav",
);

const ariaLabel = computed(() =>
    props.variant === "sidebar"
        ? "Demo sections"
        : "Demo mobile navigation",
);

/**
 * Возвращает классы кнопки пункта навигации для выбранного `variant` и состояния active.
 * Используется в шаблоне, чтобы не дублировать разметку desktop/mobile.
 */
const buttonClassList = (itemId) => {
    const active = props.activeId === itemId;
    if (props.variant === "sidebar") {
        return {
            "demo-sidebar__link": true,
            "demo-sidebar__link--active": active,
        };
    }
    return {
        "demo-bottom-nav__link": true,
        "demo-bottom-nav__link--active": active,
    };
};

/**
 * Пробрасывает выбор раздела родителю через emit `select`.
 * Используется при клике по пунктам боковой и нижней навигации.
 */
const handleSelect = (sectionId) => {
    emit("select", sectionId);
};
</script>

<style scoped lang="scss">
@use "../../../../../scss/variables" as *;

.demo-sidebar__nav {
    background-color: $bg-style-white;
    border: 1px solid $text-light-grey;
    border-radius: $radius-xl;
    padding: $spacing-sm;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    box-shadow: $shadow-sm;
}

.demo-section-nav__icon {
    flex-shrink: 0;
    width: 1.25em;
    height: 1.25em;
    color: currentColor;
}

.demo-section-nav__label {
    width: 100%;
    text-align: left;
}

.demo-sidebar__link {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    width: 100%;
    border: 1px solid transparent;
    background-color: transparent;
    cursor: pointer;
    min-height: 48px;
    padding: 0 $spacing-md;
    border-radius: $radius-lg;
    color: $text-color;
    font-weight: 500;
    transition: $transition-base;
    text-decoration: none;
    font-size: 18px;

    &:hover {
        background-color: $bg-light-grey;
        color: $accent-primary;
        text-decoration: none;
    }

    &:focus-visible {
        outline: 2px solid rgba($accent-primary, 0.55);
        outline-offset: 2px;
    }
}

.demo-sidebar__link--active {
    color: $accent-primary;
    background-color: $bg-light-grey;
}

/* Горизонтальная полоса секций на узких экранах: в DOM сразу над demo-topbar (см. DemoPage) */
.demo-bottom-nav {
    position: static;
    z-index: 25;
    padding: $spacing-sm $spacing-md;
    display: none;
    gap: $spacing-xs;
    background-color: rgba($bg-style-white, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid $text-light-grey;
    box-shadow: $shadow-sm;
}

.demo-bottom-nav__link {
    flex: 1;
    min-height: 44px;
    min-width: 0;
    border: 1px solid $text-light-grey;
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-xs;
    box-sizing: border-box;
    color: $text-color;
    font-size: $font-size-sm;
    font-weight: 500;
    background-color: $bg-style-white;
    transition: $transition-base;
    font-family: inherit;
    cursor: pointer;
    text-decoration: none;

    &:hover,
    &:focus-visible {
        border-color: $accent-primary;
        color: $accent-primary;
        text-decoration: none;
    }
}

.demo-bottom-nav__link--active {
    border-color: $accent-primary;
    color: $accent-primary;
}

:deep(.xicon) {
    width: auto;
    height: auto;
    margin-left: -5px;
}

:deep(.xicon svg) {
    width: 30px;
    height: 30px;
}

.demo-section-nav__icon {
    width: 30px;
    height: 30px;
}

@media (max-width: $breakpoint-lg) {
    .demo-bottom-nav {
        display: flex;
    }
}

@media (prefers-reduced-motion: reduce) {
    .demo-sidebar__link,
    .demo-bottom-nav__link {
        transition: none;
    }
}
</style>
