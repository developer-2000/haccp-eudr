<template>
    <n-layout-header bordered class="admin-header">
        <div class="header-left"> </div>

        <div class="header-center"> </div>

        <div class="header-right">
            <div ref="userButtonWrapperRef" class="user-button-wrapper">
                <n-dropdown
                    :options="userMenuOptions"
                    trigger="click"
                    :width="dropdownWidth"
                    @select="handleMenuSelect"
                >
                    <n-button quaternary class="btn-top-menu">
                        <Icon name="user-outlined" class="user-icon" />
                        <span>{{ userName }}</span>
                    </n-button>
                </n-dropdown>
            </div>
        </div>
    </n-layout-header>
</template>

<script setup>
/**
 * @fileoverview Компонент верхней панели административной панели
 *
 * Компонент отображает шапку с меню пользователя в правой части.
 * Содержит кнопку с именем пользователя и выпадающее меню с опцией выхода.
 * Автоматически подстраивает ширину dropdown под ширину кнопки.
 */

defineOptions({
    name: "AdminHeader",
});

// ============================================
// Импорты
// ============================================
import { computed, ref, onMounted, nextTick, watch } from "vue";
import { useRouter } from "vue-router";
import { NLayoutHeader, NButton, NDropdown } from "naive-ui";
import { useAuthStore } from "@/stores";
import Icon from "@/components/Icon.vue";

// ============================================
// State (Реактивное состояние)
// ============================================
const router = useRouter();
const authStore = useAuthStore();

/**
 * userButtonWrapperRef - ref для обертки кнопки пользователя
 * Используется для получения DOM-элемента кнопки и вычисления её ширины
 */
const userButtonWrapperRef = ref(null);

/**
 * dropdownWidth - ширина dropdown меню
 * Автоматически вычисляется на основе ширины кнопки пользователя
 */
const dropdownWidth = ref(undefined);
// ============================================
// Конфигурация
// ============================================
/**
 * userMenuOptions - массив опций меню пользователя
 * Содержит пункты меню для dropdown (в данный момент только Logout)
 */
const userMenuOptions = [
    {
        label: "Logout",
        key: "logout",
    },
];
// ============================================
// Computed (Вычисляемые свойства)
// ============================================
/**
 * userName - вычисляемое свойство имени пользователя
 * Получает имя из authStore, если пользователь не авторизован, возвращает "User"
 */
const userName = computed(() => {
    return authStore.user?.name || "User";
});

// ============================================
// Методы
// ============================================
/**
 * updateDropdownWidth - функция обновления ширины dropdown меню
 * Вычисляет ширину кнопки пользователя и устанавливает её как ширину dropdown
 * Использует nextTick для гарантии, что DOM-элемент уже отрендерен
 */
const updateDropdownWidth = () => {
    nextTick(() => {
        if (userButtonWrapperRef.value) {
            const button = userButtonWrapperRef.value.querySelector(".n-button");
            if (button) {
                dropdownWidth.value = button.offsetWidth;
            }
        }
    });
};

/**
 * handleMenuSelect - обработчик выбора пункта в меню пользователя
 * Обрабатывает действие выхода из системы (logout)
 * @param {string} key - ключ выбранного пункта меню
 */
const handleMenuSelect = (key) => {
    if (key === "logout") {
        authStore.logout();
        router.push("/");
    }
};

// ============================================
// Lifecycle Hooks
// ============================================
/**
 * onMounted - хук монтирования компонента
 * Вызывает updateDropdownWidth для первоначальной установки ширины dropdown
 */
onMounted(() => {
    updateDropdownWidth();
});

// ============================================
// Watchers
// ============================================
/**
 * watch userName - отслеживает изменение имени пользователя
 * При изменении имени пользователя обновляет ширину dropdown,
 * так как длина текста кнопки может измениться
 */
watch(userName, () => {
    updateDropdownWidth();
});

</script>

<style scoped lang="scss">
@use "../../../scss/variables" as *;

.admin-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    height: 64px;
    background: var(--n-color);
    font-size: 16px;

    .header-left {
        display: flex;
        align-items: center;
    }

    .header-center {
        flex: 1;
        display: flex;
        justify-content: center;
        padding: 0 24px;
    }

    .header-right {
        display: flex;
        align-items: center;
        gap: 12px;

        .user-button-wrapper {
            display: inline-block;
        }

        .btn-top-menu {
            font-size: $font-size-base;
        }
    }
}
</style>
