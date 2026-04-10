<template>
    <div class="technical-section">

        <div class="message-pin-code">
            {{ t('survey.ui.pin_instruction') }}
        </div>

        <div class="pin-header warning"
             v-if="attemptsLeft === 1"
        >
            {{ t('survey.ui.pin_attempts_left') }}
        </div>

        <div class="pin-box" :aria-label="t('survey.ui.pin_container_aria')">
            <div class="pin-inputs" role="group" :aria-label="t('survey.ui.pin_group_aria')">
                <input
                    v-for="(_, index) in digits"
                    :key="index"
                    :ref="(el) => setInputRef(el, index)"
                    v-model="digits[index]"
                    class="digit"
                    type="text"
                    inputmode="numeric"
                    maxlength="1"
                    autocomplete="one-time-code"
                    :aria-label="`Digit ${index + 1}`"
                    @input="onInput(index)"
                    @paste="onPaste($event, index)"
                    @keydown="onKeydown($event, index)"
                    @focus="onFocus(index)"
                >
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useI18n } from "vue-i18n";

const digits = ref(["", "", "", ""]);
const inputRefs = ref([null, null, null, null]);

const props = defineProps({
    attemptsLeft: {
        type: Number,
        default: 2,
    },
});

const emit = defineEmits({
    complete: (pin) => typeof pin === "string" && /^\d{4}$/.test(pin),
});

const { t } = useI18n();

/**
 * Очищает все 4 поля и ставит фокус на первый.
 * Используется при неверном вводе кода для сброса.
 */
const clearDigits = () => {
    digits.value = ["", "", "", ""];
    nextTick(() => {
        focusInput(0);
    });
};

defineExpose({ clearDigits });

/**
 * Сохраняет ссылку на DOM-элемент input для последующего фокуса.
 * Используется через :ref в v-for цикле.
 * @param {HTMLInputElement|null} el
 * @param {number} index
 */
const setInputRef = (el, index) => {
    inputRefs.value[index] = el;
};

/**
 * Автофокус первого input при монтировании компонента.
 */
onMounted(() => {
    nextTick(() => {
        focusInput(0);
    });
});

/**
 * Оставляет только одну цифру из введённого символа.
 * @param {string} value
 * @returns {string}
 */
const normalizeDigit = (value) => value.replace(/\D/g, "").slice(0, 1);

/**
 * Проверяет заполненность всех 4 полей и эмитит PIN-код родителю.
 * Используется для отправки кода верификации при готовности 4 цифр.
 */
const emitPinIfComplete = () => {
    const pin = digits.value.join("");
    if (/^\d{4}$/.test(pin)) {
        emit("complete", pin);
    }
};

/**
 * Ставит фокус на input по его индексу.
 * Используется при автопереходе, Backspace, стрелках, вставке.
 * @param {number} index
 */
const focusInput = (index) => {
    const element = inputRefs.value[index];
    if (element) {
        element.focus();
    }
};

/**
 * Обработка ввода символа: нормализует до цифры, автопереход к следующему input.
 * Срабатывает при каждом изменении значения в поле.
 * @param {number} index
 */
const onInput = (index) => {
    digits.value[index] = normalizeDigit(digits.value[index]);

    if (digits.value[index] !== "" && index < digits.value.length - 1) {
        focusInput(index + 1);
    }

    emitPinIfComplete();
};

/**
 * Обработка вставки из буфера: раскладывает цифры по input начиная с позиции курсора.
 * Игнорирует нецифровые символы, фокус ставится на последний заполненный или следующий.
 * @param {ClipboardEvent} event
 * @param {number} startIndex
 */
const onPaste = (event, startIndex) => {
    event.preventDefault();

    const clipboardText = event.clipboardData?.getData("text") ?? "";
    const pastedDigits = clipboardText.replace(/\D/g, "").split("");

    if (!pastedDigits.length) {
        return;
    }

    let lastFilledIndex = startIndex;
    for (let offset = 0; offset < pastedDigits.length; offset += 1) {
        const targetIndex = startIndex + offset;
        if (targetIndex >= digits.value.length) {
            break;
        }

        digits.value[targetIndex] = pastedDigits[offset];
        lastFilledIndex = targetIndex;
    }

    if (lastFilledIndex < digits.value.length - 1) {
        focusInput(lastFilledIndex + 1);
    } else {
        focusInput(lastFilledIndex);
    }

    emitPinIfComplete();
};

/**
 * Обработка специальных клавиш: Backspace (возврат к предыдущему),
 * ArrowLeft/ArrowRight (навигация между полями).
 * @param {KeyboardEvent} event
 * @param {number} index
 */
const onKeydown = (event, index) => {
    if (event.key === "Backspace" && digits.value[index] === "" && index > 0) {
        focusInput(index - 1);
        return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
        event.preventDefault();
        focusInput(index - 1);
        return;
    }

    if (event.key === "ArrowRight" && index < digits.value.length - 1) {
        event.preventDefault();
        focusInput(index + 1);
    }
};

/**
 * При фокусе input выделяет весь текст для быстрой замены.
 * Используется для удобства — при клике или автопереходе.
 * @param {number} index
 */
const onFocus = (index) => {
    const element = inputRefs.value[index];
    if (element) {
        element.select();
    }
};
</script>

<style scoped lang="scss">
@use "../../../../scss/variables" as *;

.technical-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 8px 0;
    min-height: 60vh;

    .message-pin-code{
        text-align: center;
        margin-bottom: 20px;
        font-weight: 500;
    }

    .pin-box {
        width: 320px;
        height: 170px;
        border: 1px solid $accent-primary-dark;
        border-radius: 18px;
        margin: 0 auto;
        display: grid;
        place-items: center;

        .pin-inputs {
            display: grid;
            grid-template-columns: repeat(4, 56px);
            gap: 12px;

            .digit {
                width: 56px;
                height: 56px;
                border: 1px solid $accent-primary-dark;
                border-radius: 14px;
                background: #ffffff;
                text-align: center;
                font-size: 26px!important;
                font-weight: 500;
                line-height: 1;
                color: #0f172a;
                transition: border-color 0.18s ease, box-shadow 0.18s ease;

                &:hover {
                    border-color: $accent-primary;
                }

                &:focus {
                    outline: none;
                    border-color: $accent-primary;
                }
            }
        }
    }
}

.pin-header {
    width: 320px;
    margin: 0 auto 10px auto;
    text-align: center;
    font-size: 13px;
    color: #64748b;
    font-weight: 500;

    &.warning {
        color: #e11d48;
        font-weight: 600;
    }
}

@media (max-width: 640px) {
    .pin-inputs {
        grid-template-columns: repeat(4, 50px);
        gap: 10px;
    }

    .pin-inputs input.digit {
        width: 50px;
        height: 50px;
        font-size: 22px;
    }
}
</style>
