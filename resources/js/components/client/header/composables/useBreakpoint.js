import { ref, onMounted, onUnmounted } from 'vue';

/**
 * Composable для отслеживания размера экрана
 * @param {number} breakpoint - Breakpoint в пикселях (по умолчанию 1024px)
 * @returns {import('vue').Ref<boolean>} isMobile - true если ширина экрана меньше breakpoint
 */
export function useBreakpoint(breakpoint = 1024) {
    /** @type {import('vue').Ref<boolean>} */
    const isMobile = ref(false);

    const checkBreakpoint = () => {
        isMobile.value = window.innerWidth < breakpoint;
    };

    onMounted(() => {
        checkBreakpoint();
        window.addEventListener('resize', checkBreakpoint);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', checkBreakpoint);
    });

    return { isMobile };
}
