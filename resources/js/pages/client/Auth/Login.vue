<template>
    <div class="container login-container">
        <!-- Left panel with illustration -->
        <div class="illustration-panel"></div>

        <!-- Right panel with login form -->
        <div class="login-form-panel">
            <!-- After sending the letter forgot pass -->
            <div v-if="emailSent" class="login-form-wrapper">
                <Icon name="ios-mail-unread" class="email-icon" />
                <p class="email-sent-message">
                    We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
                </p>
                <div class="divider"></div>
                <button
                    type="button"
                    class="btn-client btn-text"
                    @click="handleBackToLogin">
                    Back to login
                </button>
            </div>
            <!-- Authorization forms -->
            <div v-else class="login-form-wrapper">
                <h1>{{ pageTitle }}</h1>

                <!-- @ts-ignore -->
                <component
                    :is="currentComponent"
                    v-on="componentEvents"
                />

                <div class="divider"></div>

                <p class="signup-text">
                    New to {{ siteConfig.name }}?
                    <router-link to="/auth/register/account">
                        Sign up
                    </router-link>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
/**
 * @fileoverview Компонент страницы входа в систему
 */
defineOptions({
    name: "Login",
});

// ============================================
// Импорты
// ============================================
import { ref, computed } from "vue";
import siteConfig from "@/config/site";
import LoginForm from "@/components/client/auth/LoginForm.vue";
import ForgotPassword from "@/components/client/auth/ForgotPassword.vue";
import Icon from "@/components/Icon.vue";

// ============================================
// State
// ============================================
const showForgotPassword = ref(false);
const emailSent = ref(false);

// ============================================
// Handlers
// ============================================
const handleForgotPassword = () => {
    showForgotPassword.value = true;
};

const handleLogin = () => {
    showForgotPassword.value = false;
    emailSent.value = false;
};

const handleEmailSent = () => {
    emailSent.value = true;
};

const handleBackToLogin = () => {
    emailSent.value = false;
    showForgotPassword.value = false;
};

// ============================================
// Events Map
// ============================================
const eventsMap = {
    login: handleLogin,
    "forgot-password": handleForgotPassword,
};

// ============================================
// Computed
// ============================================
const currentComponent = computed(() => {
    return (showForgotPassword.value ? ForgotPassword : LoginForm);
});

const pageTitle = computed(() => {
    return showForgotPassword.value ? "Forgot password?" : "Welcome back";
});

const componentEvents = computed(() => {
    return showForgotPassword.value
        ? {
              login: eventsMap.login,
              success: handleEmailSent,
          }
        : { "forgot-password": eventsMap["forgot-password"] };
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

            .divider {
                width: 100%;
                height: 1px;
                background-color: $border-dark-color;
                margin: 10px 0 25px 0;
            }

            .email-icon {
                margin-bottom: $spacing-lg;
                display: inline-block;
                width: 100px;
                height: 100px;

                :deep(svg) {
                    width: 100px;
                    height: 100px;
                    fill: $color-points;
                }
            }

            .email-sent-message {
                font-size: $font-size-base-m;
                color: $text-light-grey;
                text-align: center;
                line-height: 1.6;
                margin-bottom: $spacing-lg;
            }
        }

    }
}

</style>
