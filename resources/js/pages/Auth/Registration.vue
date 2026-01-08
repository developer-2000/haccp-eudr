<template>
    <div class="registration-page">
        <div class="container registration-grid">
            <div class="left-panel">
                <div class="left-panel-main">
                    <h1>Start your smart food safety journey</h1>
                    <ul class="features-list">
                        <li class="feature-item">
                            <Icon name="check" />
                            <span class="feature-text">
                                Switch to digital food safety in 15 min with an
                                automated setup
                            </span>
                        </li>
                        <li class="feature-item">
                            <Icon name="check" />
                            <span class="feature-text">
                                Create custom monitoring tasks with educative
                                instructions
                            </span>
                        </li>
                        <li class="feature-item">
                            <Icon name="check" />
                            <span class="feature-text">
                                Access to smart in-app tools, HACCP builder, and
                                traceability
                            </span>
                        </li>
                    </ul>
                    <div class="testimonial-wrapper">
                        <div class="testimonial">
                            <div class="testimonial-content">
                                <blockquote class="testimonial-quote">
                                    "Great user-friendly system. Very mobile
                                    friendly. The system is set up to be easy
                                    and flow nicely without wasting time. The
                                    customer support is amazing and efficient in
                                    everything they do and always prompt with
                                    responses."
                                </blockquote>
                                <footer class="testimonial-footer">
                                    Bagalov Shamil, Quality Assurance, Romania
                                    Brasov
                                </footer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="right-panel">
                <div class="steps-indicator">
                    <div
                        v-for="stepState in stepStates"
                        :key="stepState.alias"
                        class="step"
                        :class="stepState.classes"
                    >
                        <div class="step-line" :class="stepState.classes"></div>
                        <div class="step-text">{{ stepState.text }}</div>
                    </div>
                </div>
                <component
                    :is="currentStepComponent"
                    v-if="currentStepComponent"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
/**
 * @fileoverview Компонент страницы регистрации с многошаговой формой
 *
 * Компонент управляет трехшаговым процессом регистрации:
 * 1. Account (имя, email, пароль)
 * 2. Company (данные компании)
 * 3. Phone (номер телефона и согласие на рассылку)
 */

defineOptions({
    name: "Registration",
});

// ============================================
// Импорты
// ============================================
import { computed } from "vue";
import Icon from "../../components/Icon.vue";
import { useAuthStore } from "@/stores";

/**
 * RegistrationForm - компонент первого шага регистрации
 * Содержит поля: name, email, password
 */
import RegistrationForm from "../../components/registration/RegistrationForm.vue";

/**
 * RegistrationCompanyForm - компонент второго шага регистрации
 * Содержит поля для данных компании
 */
import RegistrationCompanyForm from "../../components/registration/RegistrationCompanyForm.vue";

/**
 * RegistrationPhoneForm - компонент третьего шага регистрации
 * Содержит: поле телефона (vue-tel-num-input) и чекбокс согласия на рассылку
 */
import RegistrationPhoneForm from "../../components/registration/RegistrationPhoneForm.vue";

// ============================================
// Константы
// ============================================
const STEP_ACCOUNT = "account";
const STEP_COMPANY = "company";
const STEP_PHONE = "phone";

// ============================================
// State (Реактивное состояние)
// ============================================
const authStore = useAuthStore();

// ============================================
// Конфигурация
// ============================================
/**
 * steps - массив конфигурации шагов для индикатора прогресса
 */
const steps = [
    {
        alias: STEP_ACCOUNT,
        text: "Step 1. Account",
    },
    {
        alias: STEP_COMPANY,
        text: "Step 2. Company",
    },
    {
        alias: STEP_PHONE,
        text: "Step 3. Phone",
    },
];

/**
 * stepComponents - объект-маппинг для связи alias шага с компонентом
 * Используется в currentStepComponent для возврата нужного компонента
 */
const stepComponents = {
    [STEP_ACCOUNT]: RegistrationForm, // Компонент для шага account
    [STEP_COMPANY]: RegistrationCompanyForm, // Компонент для шага company
    [STEP_PHONE]: RegistrationPhoneForm, // Компонент для шага phone
};

// ============================================
// Computed (Вычисляемые свойства)
// ============================================
/**
 * @typedef {Object} ProfileCompletion
 * @property {boolean} account
 * @property {boolean} company
 * @property {boolean} phone
 * @property {boolean} completed
 */

/**
 * profileCompletion - мемоизированное значение статуса завершения профиля из store
 * Используется для оптимизации: единая точка чтения из store вместо множественных обращений
 */
const profileCompletion = computed(() => {
    return authStore.profileCompletion;
});

/**
 * currentStepAlias - единый источник истины для определения текущего шага
 * Если все шаги завершены -> null (регистрация завершена)
 * Использует мемоизированное profileCompletion для оптимизации производительности
 */
const currentStepAlias = computed(() => {
    /** @type {ProfileCompletion | null} */
    const completion = profileCompletion.value;

    // 1. Если юзер не авторизован ИЛИ нет изначальных данных аккаунта -> STEP_ACCOUNT
    if (completion === null || !completion.account) {
        return STEP_ACCOUNT;
    }
    // 2. Если нет данных компании -> STEP_COMPANY
    else if (!completion.company) {
        return STEP_COMPANY;
    }
    // 3. Если нет данных контактного Tell -> STEP_PHONE
    else if (!completion.phone) {
        return STEP_PHONE;
    }

    return null;
});

/**
 * currentStepComponent - вычисляемое свойство, определяющее какой компонент показать
 * Использует currentStepAlias как единый источник истины
 */
const currentStepComponent = computed(() => {
    const alias = currentStepAlias.value;
    return alias ? stepComponents[alias] : null;
});

/**
 * stepStates - вычисляемое свойство для оптимизации рендеринга шагов
 * Мемоизирует состояние каждого шага (active/completed) на основе profileCompletion
 * Использует строку для classes вместо объекта и единое computed свойство profileCompletion для оптимизации производительности
 */
const stepStates = computed(() => {
    const currentStep = currentStepAlias.value;
    const completion = profileCompletion.value;

    return steps.map((step) => {
        const alias = step.alias;
        const isCompleted = completion?.[alias] === true;
        const isActive = currentStep === alias;

        const classArray = [];
        if (isActive) classArray.push('active');
        if (isCompleted) classArray.push('completed');
        const classes = classArray.join(' ');

        return {
            ...step,
            isActive,
            isCompleted,
            classes,
        };
    });
});

</script>

<style scoped lang="scss">
@use "../../../scss/variables" as *;

.registration-page {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: linear-gradient(
        to right,
        $color-orange-light 50%,
        $white-color 50%
    );

    @include respond-to(max-lg) {
        background: none;
    }

    .registration-grid {
        display: grid;
        grid-template-columns: 1fr;

        @include respond-to(lg) {
            grid-template-columns: 1fr 1fr;
        }

        .left-panel {
            padding: 3rem 2rem;

            @include respond-to(sm) {
                padding: 3rem 4rem;
            }

            @include respond-to(lg) {
                background-color: $color-orange-light;
                padding: 107px 3rem 5rem;
            }

            .left-panel-main {
                .features-list {
                    list-style: none;
                    margin-top: 2.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;

                    .feature-item {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        font-size: 1.125rem;
                        color: #374151;

                        svg {
                            width: $font-size-2xl;
                            height: $font-size-2xl;
                            stroke: $color-points;
                            stroke-width: 3.5;
                        }

                        .feature-text {
                            flex: 1;
                        }
                    }
                }
            }

            .testimonial-wrapper {
                margin-top: 3rem;

                .testimonial {
                    .testimonial-content {
                        background-color: $naive-bg-color;
                        padding: 1.5rem;
                        border: 1px solid $border-dark-color;
                        border-radius: 0.5rem;
                    }

                    .testimonial-quote {
                        color: $text-dark-grey;
                        font-style: italic;
                        margin: 0;
                    }

                    .testimonial-footer {
                        margin-top: 1rem;
                        font-size: 0.875rem;
                        color: #1f2937;
                        font-weight: 600;
                    }
                }
            }
        }

        .right-panel {
            padding: 3rem 2rem;

            @include respond-to(sm) {
                padding: 3rem 4rem;
            }

            @include respond-to(lg) {
                padding: 0 3rem 5rem;
            }

            .steps-indicator {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                margin: 30px 0 40px 0;

                .step {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;

                    .step-line {
                        width: 100%;
                        height: 4px;
                        background-color: $text-light-w-grey;
                        transition: all $transition-fast;

                        &.active,
                        &.completed {
                            background-color: $color-points;
                        }
                    }

                    .step-text {
                        font-size: $font-size-sm;
                        color: $text-light-w-grey;
                        text-align: center;
                        transition: color $transition-fast;
                    }

                    &.completed .step-text,
                    &.active .step-text {
                        color: $color-points;
                        font-weight: 500;
                    }
                }
            }

            :deep(.form-wrapper) {
                max-width: 28rem;
                margin: 0 auto;
                width: 100%;

                h2 {
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                    font-size: $font-size-2-25xl;
                }

                .form-subtitle {
                    color: $text-dark-grey;
                    font-size: $font-size-sm;
                }

                .registration-form {
                    margin-top: $font-size-2-5xl;

                    .form-group {
                        display: flex;
                        flex-direction: column;

                        .form-label {
                            display: block;
                            font-size: $font-size-sm;
                            font-weight: 500;
                            color: #374151;
                            margin-bottom: 0.25rem;
                        }
                    }

                    .form-footer {
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                        gap: 1rem;
                        margin-top: 1rem;

                        .form-terms {
                            font-size: $font-size-xs;
                            color: $text-light-grey;

                            a {
                                font-size: $font-size-xs;
                            }
                        }

                        .btn-success {
                            border-radius: $radius-sm-sm;
                        }
                    }

                    :deep(.tel-num-input) {
                        position: relative;
                        z-index: 1;

                        &.expanded {
                            z-index: 1003;
                        }

                        .tel-num-input__body {
                            position: absolute;
                            z-index: 1003;
                        }

                        .prefix-container__country-name {
                            white-space: nowrap;
                        }
                    }

                    .checkbox-wrapper {
                        margin-bottom: 2rem;
                    }
                }
            }
        }

        h1 {
            margin-bottom: 2.5rem;
            font-weight: 500;
            font-size: $font-size-2-5xl;
        }
    }
}
</style>
