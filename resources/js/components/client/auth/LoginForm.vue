<template>
    <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        size="large"
        class="login-form"
    >
        <n-form-item label="Work email" path="email">
            <n-input
                v-model:value="formData.email"
                placeholder=""
            />
        </n-form-item>

        <n-form-item label="Work password" path="password">
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

        <div class="forgot-password">
            <a href="javascript:void(0)" @click="handleForgotPassword">
                Forgot password?
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
                Log In
            </n-button>
        </n-form-item>
    </n-form>
</template>

<script setup>
/**
 * @fileoverview Компонент формы входа в систему
 */
defineOptions({
    name: "LoginForm",
});

// ============================================
// Импорты
// ============================================
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { NForm, NFormItem, NInput, NButton, useMessage } from "naive-ui";
import { v4 as uuidv4 } from "uuid";
import Icon from "../../Icon.vue";
import apiAxios from "@/utils/apiAxios";
import { useAuthStore } from "@/stores";

// ============================================
// Router & Stores
// ============================================
const router = useRouter();
const authStore = useAuthStore();
const message = useMessage();

// ============================================
// Props
// ============================================
const props = defineProps({});

// ============================================
// Emits
// ============================================
const emit = defineEmits(["forgot-password"]);

// ============================================
// State
// ============================================
const formRef = ref(null);
const loading = ref(false);
const showPassword = ref(false);

const formData = reactive({
    email: "thwglobal2000@gmail.com",
    password: "password1",
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
};

// ============================================
// Handlers
// ============================================
/**
 * SERVER - Валидирует форму, отправляет данные на сервер для авторизации
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
            password: formData.password,
            device_name: `web_${navigator.userAgent}_${uuidv4()}`,
        };

        const { data } = await apiAxios.post("/api/auth/login", params);

        const responseData = data.data || data;

        // Сохраняем данные авторизации в store
        authStore.login({
            user: responseData.user,
            token: responseData.token,
            profile_completion: responseData.profile_completion,
        });

        // Переход на страницу личного кабинета
        if (authStore.isProfileCompleted()) {
            await router.push("/personal-panel");
        }
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            "An error occurred during login. Please try again.";
        message.error(errorMessage);
    } finally {
        loading.value = false;
    }
};

const handleForgotPassword = () => {
    emit("forgot-password");
};

const handleTogglePassword = () => {
    showPassword.value = !showPassword.value;
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

.login-form {
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

    .forgot-password {
        text-align: right;
        margin-top: -10px;

        a {
            font-size: 15px;
        }
    }
}
</style>
