<template>
    <div class="form-wrapper">
        <h2>Last step...</h2>
        <p class="form-subtitle">
            We ask for your phone number, so we can validate your account.
        </p>

        <n-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            size="large"
            class="registration-form"
        >
            <n-form-item label="Phone" path="phoneNumber">
                <vue-tel-num-input
                    v-model="formData.phoneNumber"
                    default-country-code="RO"
                    :valid-characters-only="true"
                    :silent="true"
                    @validate="onPhoneValidate"
                />
            </n-form-item>

            <div class="checkbox-wrapper">
                <n-checkbox v-model:checked="formData.receiveUpdates">
                    Get useful tips, news, and inspiration via email and SMS.
                </n-checkbox>
            </div>

            <div class="form-footer">
                <n-button
                    type="primary"
                    size="large"
                    :loading="loading"
                    @click="submitForm"
                >
                    Finish
                </n-button>
            </div>
        </n-form>
    </div>
</template>

<script setup>
defineOptions({
    name: "RegistrationPhoneForm",
});

// ============================================
// Импорты
// ============================================
import { ref } from "vue";
import { useMessage } from "naive-ui";
import VueTelNumInput from "vue-tel-num-input";
import "vue-tel-num-input/style.css";
import "vue-tel-num-input/flags.css";
import apiAxios from "@/utils/apiAxios";
import { useAuthStore } from "@/stores";

// ============================================
// State (Реактивное состояние)
// ============================================
const formRef = ref(null);
const loading = ref(false);
const message = useMessage();

const formData = ref({
    phoneNumber: "",
    receiveUpdates: true,
});

const phoneValid = ref(false);
const phoneNumberE164 = ref("");

// ============================================
// Конфигурация
// ============================================
const rules = {
    phoneNumber: {
        required: true,
        validator: (rule, value) => {
            let phoneStr = "";
            let isValid = false;

            if (typeof value === "object" && value !== null) {
                phoneStr = value.value || value.number || "";
                isValid =
                    value.valid !== undefined ? value.valid : phoneValid.value;
            } else {
                phoneStr =
                    typeof value === "string" ? value : String(value || "");
                isValid = phoneValid.value;
            }

            if (!phoneStr || phoneStr.trim() === "") {
                return new Error("Please input phone number");
            }

            const digitsOnly = phoneStr.replace(/[^\d]/g, "");
            if (digitsOnly.length < 7) {
                return new Error("Please enter a valid phone number");
            }

            if (!isValid) {
                return new Error("Please enter a valid phone number");
            }
            return true;
        },
        trigger: ["input", "blur", "change"],
    },
};

// ============================================
// Методы
// ============================================

/**
 * SERVER - Отправка формы регистрации телефона
 * Валидирует форму, извлекает номер телефона, отправляет данные на сервер и обновляет статус завершения профиля в store
 */
const submitForm = async () => {
    try {
        await formRef.value?.validate();
    } catch {
        // Валидация не прошла, не отправляем форму
        return;
    }

    // Извлекаем номер телефона (валидация уже прошла)
    const phoneNumber = extractPhoneNumber();

    loading.value = true;

    try {
        const params = {
            phone_number: phoneNumber,
            receive_updates: formData.value.receiveUpdates,
        };

        const { data } = await apiAxios.post(
            "/api/auth/register/phone",
            params,
        );

        const responseData = data.data || data;
        const { profile_completion } = responseData;
        const { message: successMessage } = data;

        // 1 используем Pinia для хранения profile_completion
        if (profile_completion) {
            const authStore = useAuthStore();
            authStore.updateProfileCompletion(profile_completion);
        }

        // 2 Показываем сообщение об успехе из ответа сервера
        if (successMessage) {
            message.success(successMessage);
        }
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            "An error occurred during registration. Please try again.";
        message.error(errorMessage);
    } finally {
        loading.value = false;
    }
};

/**
 * Обработчик валидации номера телефона от vue-tel-num-input
 * Сохраняет статус валидности и номер в формате E164, затем перезапускает валидацию формы
 * @param {Object} payload - Объект с результатами валидации от vue-tel-num-input
 */
const onPhoneValidate = (payload) => {
    phoneValid.value = payload.isValid;

    if (payload.isValid && payload.number) {
        phoneNumberE164.value = payload.number;
    }

    formRef.value?.validate(undefined, () => {}).catch(() => {});
};

/**
 * Извлечение номера телефона из formData после успешной валидации
 * @returns {string} Номер телефона в формате E164 без пробелов
 */
const extractPhoneNumber = () => {
    const phoneValue = formData.value.phoneNumber;
    let phoneNumber = "";

    if (typeof phoneValue === "object" && phoneValue !== null) {
        if (phoneNumberE164.value) {
            phoneNumber = phoneNumberE164.value;
        } else if (phoneValue.valid && phoneValue.value) {
            phoneNumber = phoneValue.value;
        } else if (phoneValue.value) {
            phoneNumber = phoneValue.value;
        }
    } else {
        phoneNumber = phoneNumberE164.value || "";
    }

    return phoneNumber.replace(/\s/g, "");
};

</script>
