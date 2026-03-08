<template>
    <div class="form-wrapper">
        <h2>Try {{ siteConfig.name }} free for 14 days</h2>
        <p class="form-subtitle">
            Try our Monitoring and Traceability System or create a HACCP Plan
        </p>
        <n-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            size="large"
            class="registration-form"
        >
            <n-form-item label="Your name" path="name">
                <n-input
                    v-model:value="formData.name"
                    placeholder=""
                    @input="debouncedValidateField('name')"
                />
            </n-form-item>
            <n-form-item label="Work email" path="email">
                <n-input
                    v-model:value="formData.email"
                    placeholder=""
                    @input="debouncedValidateField('email')"
                />
            </n-form-item>
            <n-form-item label="Set password" path="password">
                <n-input
                    v-model:value="formData.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder=""
                    @input="debouncedValidateField('password')"
                >
                    <template #suffix>
                        <button
                            type="button"
                            class="password-toggle"
                            @click="togglePasswordVisibility"
                            aria-label="Toggle password visibility"
                        >
                            <Icon
                                :name="showPassword ? 'eye-slash' : 'eye'"
                                class="eye-icon"
                            />
                        </button>
                    </template>
                </n-input>
            </n-form-item>
            <n-form-item label="Repeat password" path="repeatPassword">
                <n-input
                    v-model:value="formData.repeatPassword"
                    :type="showRepeatPassword ? 'text' : 'password'"
                    placeholder=""
                    @input="debouncedValidateField('repeatPassword')"
                >
                    <template #suffix>
                        <button
                            type="button"
                            class="password-toggle"
                            @click="toggleRepeatPasswordVisibility"
                            aria-label="Toggle repeat password visibility"
                        >
                            <Icon
                                :name="showRepeatPassword ? 'eye-slash' : 'eye'"
                                class="eye-icon"
                            />
                        </button>
                    </template>
                </n-input>
            </n-form-item>
            <div class="form-footer">
                <p class="form-terms">
                    By signing up you agree to our
                    <a href="javascript:void(0)">terms of use</a>
                    and
                    <a href="javascript:void(0)">privacy policy</a>
                    . This site is protected by reCAPTCHA and the Google
                    <a href="javascript:void(0)">privacy policy</a>
                    and
                    <a href="javascript:void(0)">terms of use</a>
                    apply.
                </p>
                <n-button
                    type="primary"
                    size="large"
                    :loading="loading"
                    @click="submitForm"
                >
                    Next
                </n-button>
            </div>
        </n-form>
    </div>
</template>

<script setup>
defineOptions({
    name: "RegistrationForm",
});

// ============================================
// Импорты
// ============================================
import { ref, computed } from "vue";
import { useMessage } from "naive-ui";
import { v4 as uuidv4 } from "uuid";
import apiAxios from "@/utils/apiAxios";
import siteConfig from "@/config/site";
import { useAuthStore } from "@/stores";
import { debounce } from "@/utils/helpers";
import Icon from "../../Icon.vue";

// ============================================
// State (Реактивное состояние)
// ============================================
const formRef = ref(null);
const formData = ref({
    name: "shamil",
    email: "asd@asd.asd",
    password: "asdasdasd",
    repeatPassword: "asdasdasd",
});
const loading = ref(false);
const showPassword = ref(false);
const showRepeatPassword = ref(false);
const message = useMessage();

// ============================================
// Computed (Вычисляемые свойства)
// ============================================
/**
 * Мемоизированное значение пароля из formData
 * Используется в валидаторе repeatPassword для оптимизации производительности
 */
const passwordValue = computed(() => formData.value.password);

// ============================================
// Конфигурация
// ============================================
const rules = {
    name: {
        required: true,
        validator: (_, value) => {
            if (!value || value.trim() === "") {
                return new Error("Please input your name");
            }
            if (value.length < 2) {
                return new Error("Name must be at least 2 characters");
            }
            return true;
        },
        trigger: ["blur"],
    },
    email: {
        required: true,
        validator: (_, value) => {
            if (!value || value.trim() === "") {
                return new Error("Please input your email");
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return new Error("Please input a valid email address");
            }
            return true;
        },
        trigger: ["blur"],
    },
    password: {
        required: true,
        validator: (_, value) => {
            if (!value || value.trim() === "") {
                return new Error("Please input password");
            }
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(value)) {
                return new Error(
                    "Password must be at least 8 characters and contain letters and numbers",
                );
            }
            return true;
        },
        trigger: ["blur"],
    },
    repeatPassword: {
        required: true,
        validator: (_, value) => {
            if (!value || value.trim() === "") {
                return new Error("Please repeat password");
            }
            if (value !== passwordValue.value) {
                return new Error("Passwords do not match");
            }
            return true;
        },
        trigger: ["blur"],
    },
};

// ============================================
// Методы
// ============================================
/**
 * SERVER - Отправка формы регистрации аккаунта
 * Валидирует форму, отправляет данные на сервер и сохраняет токен авторизации в store
 */
const submitForm = async () => {
    try {
        await formRef.value?.validate();
    } catch {
        // Валидация не прошла, не отправляем форму
        return;
    }

    loading.value = true;

    try {
        const params = {
            name: formData.value.name,
            email: formData.value.email,
            password: formData.value.password,
            password_confirmation: formData.value.repeatPassword,
            device_name: `web_${navigator.userAgent}_${uuidv4()}`,
        };

        const { data } = await apiAxios.post("/api/auth/register", params);

        const responseData = data.data || data;

        // используем Pinia для хранения auth
        const storeAuth = useAuthStore();
        storeAuth.login({
            user: responseData.user,
            token: responseData.token,
            profile_completion: responseData.profile_completion,
        });
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
 * Debounced валидация поля формы
 * Выполняет валидацию с задержкой 300ms для оптимизации производительности
 * Используется для валидации на событии input
 */
const validateField = (fieldPath) => {
    formRef.value?.validate(
        (errors) => {},
        (rule) => rule?.path === fieldPath,
    );
};

const debouncedValidateField = debounce(validateField, 300);

/**
 * Переключение видимости пароля
 */
const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};

/**
 * Переключение видимости повторного пароля
 */
const toggleRepeatPasswordVisibility = () => {
    showRepeatPassword.value = !showRepeatPassword.value;
};
</script>

<style scoped lang="scss">
@use "../../../../scss/variables" as *;

.registration-form {
    :deep(.n-input) {
        .password-toggle {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: $text-light-grey;
            transition: color $transition-fast;

            &:hover {
                color: $text-color;
            }

            .eye-icon {
                width: 20px;
                height: 20px;
            }
        }
    }
}
</style>
