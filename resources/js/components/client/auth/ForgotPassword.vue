<template>
    <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        size="large"
        class="forgot-password-form"
    >
        <p class="forgot-password-text">
            Please enter your email address and we will send you a link to change your password. If you do not find the password reset email in you inbox, check the spam and junk folder.
        </p>

        <n-form-item label="Work email" path="email">
            <n-input
                v-model:value="formData.email"
                placeholder=""
            />
        </n-form-item>

        <div class="login-link">
            <a href="javascript:void(0)" @click="handleLogin">
                Login
            </a>
        </div>

        <n-form-item>
            <n-button
                type="primary"
                size="large"
                block
                :loading="loading"
                class="submit-button"
                @click="handleSubmit"
            >
                Send
            </n-button>
        </n-form-item>
    </n-form>
</template>

<script setup>
/**
 * @fileoverview Компонент формы восстановления пароля
 */
defineOptions({
    name: "ForgotPassword",
});

// ============================================
// Импорты
// ============================================
import { ref, reactive } from "vue";
import { NForm, NFormItem, NInput, NButton, useMessage } from "naive-ui";
import apiAxios from "@/utils/apiAxios";

// ============================================
// Stores
// ============================================
const message = useMessage();

// ============================================
// Props
// ============================================
const props = defineProps({});

// ============================================
// Emits
// ============================================
const emit = defineEmits(["login", "success"]);

// ============================================
// State
// ============================================
const formRef = ref(null);
const loading = ref(false);

const formData = reactive({
    email: "thwglobal2000@gmail.com",
});

// ============================================
// Validation Rules
// ============================================
const rules = {
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
};

// ============================================
// Handlers
// ============================================
/**
 * SERVER - Валидирует форму, отправляет данные на сервер для восстановления пароля
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
            email: formData.email,
        };

        const { data } = await apiAxios.post("/api/auth/forgot-password", params);

        const responseData = data.data || data;

        message.success(
            responseData.message ||
            "Password reset link has been sent to your email address.",
        );

        // Эмитим событие успешной отправки
        emit("success");
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

const handleLogin = () => {
    emit("login");
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

.forgot-password-form {
    width: 100%;

    .forgot-password-text {
        font-size: $font-size-base-m;
        color: $text-dark-grey;
        margin: -30px 0 35px;
        line-height: 1.5;
    }

    .login-link {
        text-align: right;
        margin-top: -10px;

        a {
            font-size: 15px;
        }
    }
}
</style>
