<template>
    <div class="survey-lead-form" :aria-busy="loading ? 'true' : 'false'">
        <h2
            :id="stepHeadingId"
            class="survey-lead-form__title survey-page__text-wrap"
            tabindex="-1"
        >
            {{ title }}
        </h2>
        <ul v-if="bullets?.length" class="survey-lead-form__bullets">
            <li
                v-for="(line, i) in bullets"
                :key="'b' + i"
                class="survey-lead-form__bullet"
            >
                {{ line }}
            </li>
        </ul>
        <p
            v-if="expectation"
            class="survey-lead-form__expectation survey-page__text-wrap"
        >
            {{ expectation }}
        </p>
        <div class="survey-lead-form__fields">
            <input
                v-model="answers.hp_company"
                type="text"
                name="company"
                class="survey-lead-form__honeypot"
                tabindex="-1"
                autocomplete="new-password"
                aria-label="Website"
            />
            <div class="survey-lead-form__row survey-lead-form__row--two">
                <label class="survey-page__field">
                    <span class="survey-page__field-label">{{
                        t("survey.lead.field_name")
                    }}</span>
                    <input
                        v-model="answers.name"
                        type="text"
                        class="survey-page__control"
                        autocomplete="name"
                    />
                </label>
                <label class="survey-page__field">
                    <span class="survey-page__field-label"
                        >{{ t("survey.lead.field_business_name") }}</span
                    >
                    <input
                        v-model="answers.business_name"
                        type="text"
                        class="survey-page__control"
                        autocomplete="organization"
                    />
                </label>
            </div>
            <label class="survey-page__field">
                <span class="survey-page__field-label">
                    {{ t("survey.lead.field_email") }}
                    <span class="survey-lead-form__star" aria-hidden="true"
                        >*</span
                    >
                    <span class="survey-lead-form__sr-only">{{
                        t("survey.lead.field_email_required_sr")
                    }}</span>
                </span>
                <input
                    :id="emailInputId"
                    v-model="answers.email"
                    type="email"
                    name="email"
                    class="survey-page__control"
                    :class="{
                        'survey-lead-form__input--invalid': !!emailError,
                    }"
                    autocomplete="email"
                    inputmode="email"
                    aria-required="true"
                    :aria-invalid="emailError ? 'true' : 'false'"
                    :aria-describedby="emailError ? emailErrorId : undefined"
                />
                <p
                    v-if="emailError"
                    :id="emailErrorId"
                    class="survey-lead-form__error"
                    role="alert"
                >
                    {{ emailError }}
                </p>
            </label>
            <div class="survey-lead-form__row survey-lead-form__row--three">
                <label class="survey-page__field">
                    <span class="survey-page__field-label">{{
                        t("survey.lead.field_phone")
                    }}</span>
                    <input
                        v-model="answers.phone"
                        type="tel"
                        class="survey-page__control"
                        autocomplete="tel"
                        inputmode="tel"
                        :placeholder="t('survey.lead.placeholder_phone')"
                    />
                </label>
                <label class="survey-page__field">
                    <span class="survey-page__field-label">{{
                        t("survey.lead.field_whatsapp")
                    }}</span>
                    <input
                        v-model="answers.whatsapp"
                        type="text"
                        class="survey-page__control"
                        autocomplete="tel"
                        inputmode="tel"
                        :placeholder="t('survey.lead.placeholder_whatsapp')"
                    />
                </label>
                <label class="survey-page__field">
                    <span class="survey-page__field-label">{{
                        t("survey.lead.field_telegram")
                    }}</span>
                    <input
                        v-model="answers.telegram"
                        type="text"
                        class="survey-page__control"
                        autocomplete="off"
                        spellcheck="false"
                        :placeholder="t('survey.lead.placeholder_telegram')"
                    />
                </label>
            </div>
        </div>
        <p
            v-if="submitError"
            class="survey-lead-form__submit-error"
            role="alert"
        >
            {{ submitError }}
        </p>
        <footer class="survey-page__footer">
            <button
                type="button"
                class="survey-lead-form__submit survey-primary-action"
                :disabled="loading"
                :aria-busy="loading ? 'true' : 'false'"
                @click="$emit('submit')"
            >
                {{ submitLabel }}
            </button>
        </footer>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

defineOptions({ name: "SurveyLeadForm" });
const { t } = useI18n();

defineProps({
    /** Объект ответов страницы (мутация полей lead + honeypot). */
    answers: {
        type: Object,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    bullets: {
        type: Array,
        default: () => [],
    },
    /** П. 7.3: короткий текст ожиданий перед полями (последний шаг, зачем контакты). */
    expectation: {
        type: String,
        default: "",
    },
    emailError: {
        type: String,
        default: "",
    },
    emailInputId: {
        type: String,
        required: true,
    },
    emailErrorId: {
        type: String,
        required: true,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    submitLabel: {
        type: String,
        default: "",
    },
    /** Текст ошибки сети/API под полями (п. 6.5). */
    submitError: {
        type: String,
        default: "",
    },
    /** id заголовка экрана для фокуса при переходе на lead. */
    stepHeadingId: {
        type: String,
        default: "survey-step-heading",
    },
});

defineEmits({
    /** Отправка формы — родитель валидирует и вызывает API. */
    submit: () => true,
});
</script>

<style scoped lang="scss">
@use "../../../../scss/variables" as *;

.survey-lead-form {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    max-width: 640px;
    margin: 5% auto 0;

    .survey-lead-form__title {
        font-size: 1.25rem;
        line-height: 1.35;
        font-weight: 600;
        color: #1e293b;
        margin: 0 0 12px;
    }

    .survey-lead-form__bullets {
        margin: 0 0 $spacing-sm-m;
        padding-left: 1.25rem;
        color: #334155;
        line-height: 1.5;

        .survey-lead-form__bullet {
            margin-bottom: 6px;
        }
    }

    .survey-lead-form__expectation {
        margin: 16px 0;
        font-size: $font-size-sm;
        line-height: 1.45;
        color: #475569;
    }

    .survey-lead-form__fields {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 14px;
        margin-bottom: 20px;

        .survey-lead-form__honeypot {
            position: absolute;
            left: -10000px;
            top: auto;
            width: 1px;
            height: 1px;
            overflow: hidden;
            opacity: 0;
            pointer-events: none;
        }

        .survey-lead-form__row {
            display: flex;
            flex-wrap: wrap;
            gap: 14px;
            width: 100%;

            .survey-page__field {
                flex: 1 1 0;
                min-width: 0;
            }

            &.survey-lead-form__row--two {
                .survey-page__field {
                    flex: 1 1 calc(50% - 7px);
                    min-width: min(100%, 140px);
                }
            }

            &.survey-lead-form__row--three {
                .survey-page__field {
                    flex: 1 1 calc(33.333% - 10px);
                    min-width: min(100%, 7.5rem);
                }
            }

            @media (max-width: $breakpoint-sm) {
                &.survey-lead-form__row--two .survey-page__field,
                &.survey-lead-form__row--three .survey-page__field {
                    flex: 1 1 100%;
                }
            }
        }

        .survey-page__field {
            .survey-page__field-label {
                .survey-lead-form__star {
                    color: #dc2626;
                    font-weight: 600;
                    margin-left: 2px;
                }

                .survey-lead-form__sr-only {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    white-space: nowrap;
                    border: 0;
                }
            }

            .survey-lead-form__error {
                margin: 6px 0 0;
                font-size: 0.8125rem;
                line-height: 1.35;
                color: #b91c1c;
            }
        }
    }

    .survey-lead-form__submit-error {
        margin: 0 0 12px;
        font-size: 0.8125rem;
        line-height: 1.35;
        color: #b91c1c;
    }
}
</style>
