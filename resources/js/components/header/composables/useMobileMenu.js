import { ref, computed } from 'vue';

/**
 * Composable для управления состоянием мобильного меню
 * @returns {Object} Объект с реактивными данными и методами управления меню
 * @returns {import('vue').Ref<boolean>} returns.isOpen - Состояние открытости меню
 * @returns {import('vue').ComputedRef<string[]>} returns.openedDropdowns - Массив идентификаторов открытых dropdown
 * @returns {Function} returns.toggle - Переключает состояние меню
 * @returns {Function} returns.close - Закрывает меню
 * @returns {Function} returns.toggleDropdown - Переключает состояние dropdown по идентификатору
 * @returns {Function} returns.hasDropdown - Проверяет, открыт ли dropdown с указанным идентификатором
 */
export function useMobileMenu() {
    /** @type {import('vue').Ref<boolean>} */
    const isOpen = ref(false);
    
    // Используем Set для эффективного хранения уникальных идентификаторов
    /** @type {import('vue').Ref<Set<string>>} */
    const openedDropdownsSet = ref(new Set());

    /**
     * Computed массив для обратной совместимости с шаблоном
     * @type {import('vue').ComputedRef<string[]>}
     */
    const openedDropdowns = computed(() => Array.from(openedDropdownsSet.value));

    /**
     * Проверяет, открыт ли dropdown с указанным идентификатором
     * @param {string} identifier - Идентификатор dropdown
     * @returns {boolean}
     */
    const hasDropdown = (identifier) => {
        return openedDropdownsSet.value.has(identifier);
    };

    /**
     * Переключает состояние мобильного меню (открыть/закрыть)
     * При закрытии также очищает список открытых dropdown
     */
    const toggle = () => {
        isOpen.value = !isOpen.value;
        if (!isOpen.value) {
            openedDropdownsSet.value.clear();
        }
    };

    /**
     * Закрывает мобильное меню и очищает список открытых dropdown
     */
    const close = () => {
        isOpen.value = false;
        openedDropdownsSet.value.clear();
    };

    /**
     * Переключает состояние конкретного dropdown в мобильном меню
     * @param {string} identifier - Уникальный идентификатор элемента меню с dropdown
     * Если dropdown уже открыт - закрывает его
     * Если закрыт - закрывает все остальные и открывает только этот
     */
    const toggleDropdown = (identifier) => {
        if (openedDropdownsSet.value.has(identifier)) {
            // Если уже открыт - закрываем
            openedDropdownsSet.value.delete(identifier);
        } else {
            // Если закрыт - закрываем все остальные и открываем только этот
            openedDropdownsSet.value.clear();
            openedDropdownsSet.value.add(identifier);
        }
    };

    return {
        isOpen,
        openedDropdowns,
        toggle,
        close,
        toggleDropdown,
        hasDropdown
    };
}

