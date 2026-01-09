<template>
    <div class="container login-container">
        <!-- Left panel with illustration -->
        <div class="illustration-panel"></div>

        <!-- Right panel with reset password form -->
        <div class="login-form-panel">
            <div class="login-form-wrapper">
                <h1>Change password</h1>

                <n-form
                    ref="formRef"
                    :model="formData"
                    :rules="rules"
                    size="large"
                    class="reset-password-form"
                >
                    <n-form-item label="Set password" path="password">
                        <n-input
                            v-model:value="formData.password"
                            :type="showPassword ? 'text' : 'password'"
                            placeholder=""
                        >
                            <template #suffix>
                                <button
                                    type="button"
                                    class="password-toggle"
                                    @click="handleTogglePassword"
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

                    <n-form-item label="Repeat password" path="password_confirmation">
                        <n-input
                            v-model:value="formData.password_confirmation"
                            :type="showPasswordConfirm ? 'text' : 'password'"
                            placeholder=""
                        >
                            <template #suffix>
                                <button
                                    type="button"
                                    class="password-toggle"
                                    @click="handleTogglePasswordConfirm"
                                    aria-label="Toggle password visibility"
                                >
                                    <Icon
                                        :name="showPasswordConfirm ? 'eye-slash' : 'eye'"
                                        class="eye-icon"
                                    />
                                </button>
                            </template>
                        </n-input>
                    </n-form-item>

                    <n-form-item>
                        <n-button
                            type="primary"
                            size="large"
                            block
                            :loading="loading"
                            class="submit-button"
                            @click="handleSubmit"
                        >
                            Confirm
                        </n-button>
                    </n-form-item>
                </n-form>
            </div>
        </div>
    </div>
</template>

<script setup>
/**
 * @fileoverview Компонент страницы восстановления пароля
 */
defineOptions({
    name: "ResetPassword",
});

// ============================================
// Импорты
// ============================================
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { NForm, NFormItem, NInput, NButton, useMessage } from "naive-ui";
import Icon from "@/components/Icon.vue";
import apiAxios from "@/utils/apiAxios";

// ============================================
// Router & Stores
// ============================================
const router = useRouter();
const route = useRoute();
const message = useMessage();

// ============================================
// State
// ============================================
const formRef = ref(null);
const loading = ref(false);
const showPassword = ref(false);
const showPasswordConfirm = ref(false);

const formData = reactive({
    token: "",
    email: "",
    password: "",
    password_confirmation: "",
});

// ============================================
// Validation Rules
// ============================================
const rules = {
    password: {
        required: true,
        validator: (_, value) => {
            if (!value || value.trim() === "") {
                return new Error("Value is required");
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
    password_confirmation: {
        required: true,
        validator: (_, value) => {
            if (!value || value.trim() === "") {
                return new Error("Value is required");
            }
            if (value !== formData.password) {
                return new Error("Passwords do not match");
            }
            return true;
        },
        trigger: ["blur", "input"],
    },
};

// ============================================
// Lifecycle
// ============================================
onMounted(() => {
    // Получаем токен и email из query параметров
    formData.token = route.query.token || "";
    formData.email = route.query.email || "";

    if (!formData.token || !formData.email) {
        message.error("Invalid reset link. Please request a new password reset.");
        router.push("/auth/login");
    }
});

// ============================================
// Handlers
// ============================================
/**
 * SERVER - Валидирует форму, отправляет данные на сервер для сброса пароля
 */
const handleSubmit = async () => {
    try {
        await formRef.value?.validate();
    } catch {
        // Валидация не прошла, не отправляем форму
        return;
    }

    loading.value = true;

    try {
        const params = {
            token: formData.token,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.password_confirmation,
        };

        const { data } = await apiAxios.post("/api/auth/reset-password", params);

        const responseData = data.data || data;

        message.success(
            responseData.message || "Password has been reset successfully.",
        );

        await router.push("/auth/login");
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            "An error occurred. Please try again.";
        message.error(errorMessage);
    } finally {
        loading.value = false;
    }
};

const handleTogglePassword = () => {
    showPassword.value = !showPassword.value;
};

const handleTogglePasswordConfirm = () => {
    showPasswordConfirm.value = !showPasswordConfirm.value;
};

// ============================================
// Expose
// ============================================
defineExpose({
    formRef,
});
</script>

<style scoped lang="scss">
@use "../../../../scss/variables" as *;

.login-container {
    flex: 1;
    display: flex;
    flex-direction: column;

    @include respond-to(lg) {
        flex-direction: row;
    }

    .illustration-panel {
        display: none;
        width: 100%;
        background-image: url(/images/bg-login.png);
        background-repeat: no-repeat;
        background-size: auto 100%;
        background-position: center right;
        overflow: hidden;

        @include respond-to(lg) {
            display: block;
            max-width: 590px;
        }
    }

    .login-form-panel {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;

        @include respond-to(lg) {
            flex: 1;
            flex-shrink: 0;
            padding: $spacing-xl;
        }

        .login-form-wrapper {
            width: 100%;
            max-width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: $spacing-xl 15%;

            @include respond-to(lg) {
                padding: 0;
                max-width: 28rem;
            }

            h1 {
                font-weight: 500;
                font-size: 40px;
                margin-bottom: $font-size-3xl;
            }

            .reset-password-form {
                width: 100%;

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
    }
}
</style>
