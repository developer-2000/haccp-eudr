<template>
    <div
        ref="rootRef"
        class="survey-country-select"
        :class="{ 'survey-country-select--open': open }"
    >
        <div
            class="survey-page__control survey-country-select__trigger-shell"
            :class="{
                'survey-country-select__trigger-shell--open': open,
                'survey-country-select__trigger-shell--has-value': modelValue,
            }"
        >
            <button
                :id="triggerId"
                ref="triggerRef"
                type="button"
                class="survey-country-select__trigger"
                :role="open ? undefined : 'combobox'"
                :aria-expanded="open ? 'true' : 'false'"
                :aria-controls="listboxId"
                aria-haspopup="listbox"
                :aria-label="ariaLabel"
                :aria-describedby="ariaDescribedby || undefined"
                :aria-required="ariaRequired ? 'true' : undefined"
                :tabindex="open ? -1 : 0"
                @click="onTriggerClick"
                @keydown="onTriggerKeydown"
            >
                <span class="survey-country-select__trigger-text">{{ selectedLabel }}</span>
            </button>
            <button
                v-if="modelValue"
                type="button"
                class="survey-country-select__clear"
                :aria-label="t('survey.ui.country_clear')"
                :tabindex="open ? -1 : 0"
                @click="onClearClick"
            >
                <Icon name="close" class="survey-country-select__clear-icon" aria-hidden="true" />
            </button>
            <span class="survey-country-select__chevron" aria-hidden="true" />
        </div>

        <div v-show="open" class="survey-country-select__popover" @focusout="onPopoverFocusOut">
            <input
                ref="filterRef"
                v-model="filterQuery"
                type="search"
                class="survey-page__control survey-country-select__filter"
                role="combobox"
                aria-expanded="true"
                :aria-controls="listboxId"
                :aria-activedescendant="activeDescendantId"
                aria-autocomplete="list"
                :aria-label="t('survey.ui.country_search')"
                autocomplete="off"
                autocorrect="off"
                spellcheck="false"
                enterkeyhint="search"
                :placeholder="t('survey.ui.country_search_placeholder')"
                @keydown="onFilterKeydown"
            />
            <ul
                :id="listboxId"
                ref="listRef"
                role="listbox"
                class="survey-country-select__list"
                tabindex="-1"
            >
                <li
                    v-for="(opt, idx) in filteredOptions"
                    :id="optionElementId(opt.value)"
                    :key="opt.value"
                    role="option"
                    :aria-selected="modelValue === opt.value ? 'true' : 'false'"
                    class="survey-country-select__option"
                    :class="{
                        'survey-country-select__option--active': idx === activeIndex,
                    }"
                    @mousedown.prevent="selectOption(opt.value)"
                >
                    {{ opt.label }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Icon from '../../Icon.vue';
import { filterCountryOptionsByLabel } from '../../../features/survey/surveyCountryComboboxUtils.js';

defineOptions({ name: 'SurveyCountrySelect' });

const props = defineProps({
    /** Значение ответа: ISO 3166-1 alpha-2. */
    modelValue: {
        type: String,
        default: '',
    },
    /** Список { value, label } из того же источника, что и конфиг вопроса. */
    options: {
        type: Array,
        required: true,
    },
    /** id кнопки-триггера; совпадает с `for` у подписи поля в шаге вопроса. */
    triggerId: {
        type: String,
        required: true,
    },
    /** Текст вопроса для доступности свёрнутого combobox. */
    ariaLabel: {
        type: String,
        required: true,
    },
    /** id подсказок (подзаголовок, field_caption), через пробел. */
    ariaDescribedby: {
        type: String,
        default: undefined,
    },
    /** Обязательный ответ на шаге (как у прежнего native select). */
    ariaRequired: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits({
    'update:modelValue': (v) => typeof v === 'string',
});
const { t } = useI18n();

const PLACEHOLDER = computed(() => t('survey.ui.select_placeholder'));

const rootRef = ref(null);
const triggerRef = ref(null);
const filterRef = ref(null);
const listRef = ref(null);

const open = ref(false);
const filterQuery = ref('');
const activeIndex = ref(-1);
let activeOptionScrollRafId = null;

const listboxId = computed(() => `${props.triggerId}-country-listbox`);

/**
 * id пункта listbox для aria-activedescendant и скролла к активной строке.
 * @param {string} value
 */
function optionElementId(value) {
    return `${props.triggerId}-opt-${value}`;
}

const selectedLabel = computed(() => {
    if (!props.modelValue) {
        return PLACEHOLDER.value;
    }
    const opt = props.options.find((o) => o.value === props.modelValue);
    return opt?.label ?? props.modelValue;
});

const filteredOptions = computed(() =>
    filterCountryOptionsByLabel(props.options, filterQuery.value),
);

const activeDescendantId = computed(() => {
    const list = filteredOptions.value;
    const i = activeIndex.value;
    if (i < 0 || i >= list.length) {
        return undefined;
    }
    return optionElementId(list[i].value);
});

watch(filteredOptions, (list) => {
    if (activeIndex.value >= list.length) {
        activeIndex.value = list.length > 0 ? list.length - 1 : -1;
    }
});

watch(filterQuery, () => {
    if (!open.value) {
        return;
    }
    const list = filteredOptions.value;
    activeIndex.value = list.length > 0 ? 0 : -1;
});

watch(open, (isOpen) => {
    if (!isOpen) {
        return;
    }
    filterQuery.value = '';
    activeIndex.value = filteredOptions.value.length > 0 ? 0 : -1;
    nextTick(() => {
        filterRef.value?.focus();
    });
});

/**
 * Прокручивает список только когда активный пункт выходит за видимую область listbox.
 * Используется для снижения лишних reflow при быстром перемещении по списку.
 */
function scrollActiveOptionIntoViewIfNeeded() {
    const listEl = listRef.value;
    if (!listEl) {
        return;
    }
    const id = activeDescendantId.value;
    if (!id) {
        return;
    }
    const optionEl = document.getElementById(id);
    if (!optionEl) {
        return;
    }
    const listRect = listEl.getBoundingClientRect();
    const optionRect = optionEl.getBoundingClientRect();
    if (optionRect.top < listRect.top) {
        listEl.scrollTop -= listRect.top - optionRect.top;
        return;
    }
    if (optionRect.bottom > listRect.bottom) {
        listEl.scrollTop += optionRect.bottom - listRect.bottom;
    }
}

/**
 * Планирует одну прокрутку активного пункта на кадр.
 * Используется при смене activeIndex, чтобы не выполнять повторные скроллы в одном тике.
 */
function scheduleActiveOptionScroll() {
    if (activeOptionScrollRafId != null) {
        cancelAnimationFrame(activeOptionScrollRafId);
    }
    activeOptionScrollRafId = requestAnimationFrame(() => {
        activeOptionScrollRafId = null;
        scrollActiveOptionIntoViewIfNeeded();
    });
}

watch(activeIndex, () => {
    nextTick(() => {
        scheduleActiveOptionScroll();
    });
});

/**
 * Закрывает панель, сбрасывает фильтр и подсветку; возвращает фокус на триггер после выбора или Escape.
 */
function closePanel() {
    open.value = false;
    filterQuery.value = '';
    activeIndex.value = -1;
}

/**
 * Записывает код страны в ответ, закрывает панель и отдаёт фокус кнопке-триггеру.
 * @param {string} value
 */
function selectOption(value) {
    emit('update:modelValue', value);
    closePanel();
    nextTick(() => triggerRef.value?.focus());
}

/**
 * Обработчик клика вне корня: закрывает список без потери выбранного значения.
 * @param {PointerEvent} e
 */
function onDocumentPointerDownCapture(e) {
    if (!open.value) {
        return;
    }
    const root = rootRef.value;
    if (root && e.target instanceof globalThis.Node && root.contains(e.target)) {
        return;
    }
    closePanel();
}

onMounted(() => {
    document.addEventListener('pointerdown', onDocumentPointerDownCapture, true);
});

onUnmounted(() => {
    if (activeOptionScrollRafId != null) {
        cancelAnimationFrame(activeOptionScrollRafId);
        activeOptionScrollRafId = null;
    }
    document.removeEventListener('pointerdown', onDocumentPointerDownCapture, true);
});

function onTriggerClick() {
    open.value = !open.value;
    if (!open.value) {
        nextTick(() => triggerRef.value?.focus());
    }
}

/**
 * Сбрасывает выбранную страну, открывает панель и фокусирует поле поиска (крестик на триггере).
 * @param {MouseEvent} e
 */
function onClearClick(e) {
    e.stopPropagation();
    emit('update:modelValue', '');
    filterQuery.value = '';
    const list = filteredOptions.value;
    activeIndex.value = list.length > 0 ? 0 : -1;
    open.value = true;
    nextTick(() => filterRef.value?.focus());
}

/**
 * Открытие панели с клавиатуры (Enter / Space / стрелки); закрытие — Escape на триггере в свёрнутом виде не требуется.
 * @param {KeyboardEvent} e
 */
function onTriggerKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!open.value) {
            open.value = true;
        }
    }
}

/**
 * Навигация по отфильтрованному listbox, выбор Enter, закрытие Escape.
 * @param {KeyboardEvent} e
 */
function onFilterKeydown(e) {
    const list = filteredOptions.value;
    if (e.key === 'Escape') {
        e.preventDefault();
        closePanel();
        nextTick(() => triggerRef.value?.focus());
        return;
    }
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (list.length === 0) {
            return;
        }
        if (activeIndex.value < 0) {
            activeIndex.value = 0;
        } else {
            activeIndex.value = Math.min(list.length - 1, activeIndex.value + 1);
        }
        return;
    }
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (list.length === 0) {
            return;
        }
        if (activeIndex.value <= 0) {
            activeIndex.value = 0;
        } else {
            activeIndex.value -= 1;
        }
        return;
    }
    if (e.key === 'Enter') {
        e.preventDefault();
        if (list.length === 0) {
            return;
        }
        const i = activeIndex.value >= 0 && activeIndex.value < list.length ? activeIndex.value : 0;
        selectOption(list[i].value);
    }
}

/**
 * При уходе фокуса из панели наружу закрывает выпадашку (Tab на «Далее», клик вне и т.д.).
 * @param {FocusEvent} e
 */
function onPopoverFocusOut(e) {
    if (!open.value) {
        return;
    }
    const next = e.relatedTarget;
    const root = rootRef.value;
    if (next instanceof globalThis.Node && root?.contains(next)) {
        return;
    }
    closePanel();
}
</script>

<style scoped lang="scss">
@use '../../../../scss/variables' as *;

.survey-country-select {
    position: relative;
    width: 100%;
    max-width: 100%;

    .survey-country-select__trigger-shell {
        position: relative;
        width: 100%;
        min-width: 280px;
        min-height: $spacing-2xl;
        box-sizing: border-box;
        border: 1px solid $border-color;
        background: $bg-white;
        border-radius: $radius-md;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;

        .survey-country-select__trigger {
            position: absolute;
            inset: 0;
            width: 100%;
            margin: 0;
            box-sizing: border-box;
            border: 0;
            padding: $spacing-sm-m $spacing-sm-m-m;
            padding-right: 2.75rem;
            background: transparent;
            cursor: pointer;
            text-align: left;
            font-size: $font-size-base;
            line-height: 1.35;
            font-weight: 500;
            color: #1e293b;
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;

            .survey-country-select__trigger-text {
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        &.survey-country-select__trigger-shell--has-value .survey-country-select__trigger {
            padding-right: calc(2.75rem + 28px);
        }

        .survey-country-select__clear {
            position: absolute;
            z-index: 1;
            right: 2.25rem;
            top: 50%;
            transform: translateY(-50%);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            padding: $spacing-xs;
            border: 0;
            background: transparent;
            cursor: pointer;
            color: $text-slate-500;
            line-height: 0;
            border-radius: $radius-sm;
            transition: color $transition-fast;

            &:hover,
            &:focus-visible {
                color: $text-red;
            }

            &:focus-visible {
                outline: 2px solid $accent-success-dark;
                outline-offset: 2px;
            }
        }

        .survey-country-select__clear-icon {
            width: 1.125rem;
            height: 1.125rem;
        }

        .survey-country-select__chevron {
            position: absolute;
            z-index: 0;
            right: 14px;
            top: 50%;
            margin-top: -8px;
            width: 1rem;
            height: 1rem;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%2364748b' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: center;
            background-size: 1rem 1rem;
            pointer-events: none;
        }
    }

    .survey-country-select--open .survey-country-select__trigger-shell {
        border-color: $accent-success-dark;
        box-shadow: 0 0 0 1px $accent-success-dark;
    }

    .survey-country-select__popover {
        position: absolute;
        left: 0;
        right: 0;
        top: calc(100% + $spacing-sm);
        z-index: 30;
        padding: $spacing-sm-m;
        background: $bg-white;
        border: 1px solid $border-color;
        border-radius: $radius-md;
        box-shadow:
            0 10px 25px -5px rgb(15 23 42 / 0.12),
            0 4px 6px -4px rgb(15 23 42 / 0.08);
    }

    .survey-country-select__filter {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        min-height: $spacing-2xl;
        margin-bottom: $spacing-sm-m;
    }

    .survey-country-select__list {
        max-height: min(240px, 50vh);
        overflow-y: auto;
        margin: 0;
        padding: 0;
        list-style: none;
        -webkit-overflow-scrolling: touch;
    }

    .survey-country-select__option {
        margin: 0;
        padding: $spacing-sm-m $spacing-sm-m-m;
        min-height: 44px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        font-size: $font-size-base;
        line-height: 1.35;
        color: #1e293b;
        cursor: pointer;
        border-radius: $radius-sm;
        transition:
            background-color $transition-fast,
            color $transition-fast;

        &:focus-visible {
            outline: 2px solid $accent-success-dark;
            outline-offset: 2px;
        }
    }

    .survey-country-select__option--active {
        background: $survey-choice-selected-bg;
        color: $text-slate-700;
    }

    .survey-country-select__option:active {
        background: color-mix(in srgb, $accent-success 18%, $bg-white);
    }
}
</style>
