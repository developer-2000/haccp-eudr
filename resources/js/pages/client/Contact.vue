<template>
    <div class="section-container-contact">
        <div class="container">
            <div class="contact-grid">
                <!-- Левая колонка: содержимое (editorial) -->
                <div class="contact-intro">
                    <span class="contact-intro__eyebrow">{{ t('contact.eyebrow') }}</span>
                    <h1 class="contact-intro__title">{{ t('contact.title') }}</h1>

                    <div class="box-contact-intro">
                        <p class="contact-intro__lead">{{ t('contact.lead') }}</p>
                    </div>

                    <div class="box-contact-intro">
                        <p class="contact-intro__text">{{ t('contact.text_intro') }}</p>
                        <ul class="contact-intro__list">
                            <li>
                                <span class="point-dot-shadow" aria-hidden="true" />
                                <span>{{ t('contact.list_1') }}</span>
                            </li>
                            <li>
                                <span class="point-dot-shadow" aria-hidden="true" />
                                <span>{{ t('contact.list_2') }}</span>
                            </li>
                            <li>
                                <span class="point-dot-shadow" aria-hidden="true" />
                                <span>{{ t('contact.list_3') }}</span>
                            </li>
                        </ul>
                    </div>

                    <div class="box-contact-intro">
                        <div class="contact-intro__badge">
                            <span class="point-dot-shadow animate-pulse" aria-hidden="true" />
                            {{ t('contact.badge_response') }}
                        </div>

                        <div class="contact-intro__author">
                            <div class="contact-intro__author-avatar">
                                <img
                                    :src="'/images/avatar_120_120.jpg'"
                                    :alt="t('contact.author_name')"
                                    class="contact-intro__author-photo"
                                />
                            </div>
                            <div class="contact-intro__author-info">
                                <p class="contact-intro__author-name">{{ t('contact.author_name') }}</p>
                                <p class="contact-intro__author-role">{{ t('contact.author_role') }}</p>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Правая колонка: форма / success-view -->
                <div class="contact-form-wrap">
                    <div v-if="sent" class="contact-sent-card">
                        <h2 class="contact-sent-card__title">{{ t('contact.sent_title') }}</h2>
                        <p class="contact-sent-card__text">{{ t('contact.sent_line_1') }}</p>
                        <p class="contact-sent-card__text">{{ t('contact.sent_line_2') }}</p>
                        <Icon name="mark-email-read-twotone" class="contact-sent-card__icon" />
                    </div>

                    <div v-else class="contact-form-card">
                        <n-form
                            ref="formRef"
                            :model="form"
                            :rules="rules"
                            label-placement="top"
                            label-width="auto"
                            class="contact-form"
                            @submit.prevent="submitForm"
                        >
                            <input
                                v-model="form.hp_company"
                                type="text"
                                name="company_hp"
                                class="contact-form__honeypot"
                                tabindex="-1"
                                autocomplete="new-password"
                                aria-hidden="true"
                            />
                            <div class="contact-form__row">
                                <n-form-item :label="t('contact.name_label')" path="name" required>
                                    <n-input
                                        v-model:value="form.name"
                                        size="large"
                                        :placeholder="t('contact.name_placeholder')"
                                    />
                                </n-form-item>
                                <n-form-item :label="t('contact.email_label')" path="email" required>
                                    <n-input
                                        v-model:value="form.email"
                                        size="large"
                                        :placeholder="t('contact.email_placeholder')"
                                    />
                                </n-form-item>
                            </div>
                            <n-form-item :label="t('contact.company_label')" path="company">
                                <n-input
                                    v-model:value="form.company"
                                    size="large"
                                    :placeholder="t('contact.company_placeholder')"
                                />
                            </n-form-item>
                            <n-form-item :label="t('contact.message_label')" path="message" required>
                                <n-input
                                    v-model:value="form.message"
                                    type="textarea"
                                    size="large"
                                    :placeholder="t('contact.message_placeholder')"
                                    :autosize="{ minRows: 5, maxRows: 10 }"
                                />
                            </n-form-item>
                            <div class="contact-form__submit">
                                <n-button
                                    type="primary"
                                    size="large"
                                    block
                                    attr-type="submit"
                                    :loading="submitting"
                                >
                                    {{ t('contact.submit') }}
                                </n-button>
                                <p class="contact-form__hint">
                                    <Icon name="check-circle" class="contact-form__hint-icon" />
                                    {{ t('contact.hint') }}
                                </p>
                            </div>
                        </n-form>
                    </div>

                    <div class="contact-trust">
                        <div class="contact-trust__card">
                            <Icon name="check-circle" class="contact-trust__icon" />
                            <div>
                                <h4>{{ t('contact.trust_compliance_title') }}</h4>
                                <p>{{ t('contact.trust_compliance_subtitle') }}</p>
                            </div>
                        </div>
                        <div class="contact-trust__card">
                            <Icon name="info" class="contact-trust__icon" />
                            <div>
                                <h4>{{ t('contact.trust_privacy_title') }}</h4>
                                <p>{{ t('contact.trust_privacy_subtitle') }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { NForm, NFormItem, NInput, NButton } from "naive-ui";
import { toast } from "vue3-toastify";
import apiAxios from "@/utils/apiAxios.js";
import Icon from "@/components/Icon.vue";

defineOptions({ name: "Contact" });

import { usePageSeo } from "@/composables/usePageSeo";

// vue-i18n: переводы берутся из window.translations (lang/{locale}.php)
const { t } = useI18n();

// SEO: title, description, og, canonical, hreflang из lang/en/seo.php → contact
usePageSeo({ i18nKey: "seo.contact" });
// Ссылка на инстанс n-form — нужен для вызова formRef.value.validate() перед сабмитом
const formRef = ref(null);
// Флаг «идёт отправка» — блокирует кнопку Send message через :loading
const submitting = ref(false);

// Флаг «сообщение отправлено» — при true форма скрывается, показывается success-view
const sent = ref(false);
// Unix-timestamp (сек) момента открытия формы — honeypot-таймер.
// На сервер уходит не абсолютное время, а уже посчитанный elapsed (см. submitForm),
// чтобы избежать зависимости от рассинхрона часов клиент/сервер.
const honeypotStartedAt = ref(0);

// Фиксирует время открытия формы при монтировании компонента
onMounted(() => {
    honeypotStartedAt.value = Math.floor(Date.now() / 1000);
});

// Реактивная модель формы: все видимые поля + hp_company (скрытый honeypot-input)
const form = reactive({
    name: "",
    email: "",
    company: "",
    message: "",
    hp_company: "",
});

// Правила клиентской валидации naive-ui (срабатывают на blur/input и при formRef.validate())
const rules = {
    name: { required: true, trigger: ["blur", "input"], message: t('contact.validation_name_required') },
    email: [
        { required: true, trigger: ["blur", "input"], message: t('contact.validation_email_required') },
        {
            trigger: ["blur", "input"],
            validator: (_, value) =>
                !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    ? true
                    : new Error(t('contact.validation_email_invalid')),
        },
    ],
    message: [
        { required: true, trigger: ["blur", "input"], message: t('contact.validation_message_required') },
        { min: 10, trigger: ["blur", "input"], message: t('contact.validation_message_min') },
    ],
};

/**
 * SERVER - отправляет письмо - POST /contact и обрабатывает статус ответа.
 * Для rate_limited / duplicate показывает warning без сброса формы;
 * для created — success + очистка полей; для любой ошибки — generic error-toast.
 */
async function submitForm() {

    // Валидация полей формы
    try {
        await formRef.value?.validate();
    } catch {
        return;
    }

    // Блокируем кнопку Send message (loader)
    submitting.value = true;

    // Сборка payload: видимые поля + honeypot (скрытое поле + elapsed посчитан на клиенте,
    // чтобы бэкенд не сравнивал клиентский timestamp со своим now() — клиентские часы могут расходиться)
    const payload = {
        name: form.name,
        email: form.email,
        company: form.company,
        message: form.message,
        hp_company: form.hp_company,
        hp_elapsed: Math.floor(Date.now() / 1000) - honeypotStartedAt.value,
    };

    // POST-запрос; 3-й аргумент true → при ошибке вернёт строку с текстом (а не null)
    const response = await apiAxios.post("/contact", payload, true);

    // Разблокируем кнопку независимо от результата
    submitting.value = false;

    // Любой не-success ответ: ошибка apiAxios (строка с текстом бэка) или неожиданный формат
    if (response?.status !== "success") {
        const errorText = typeof response === "string" ? response : "";
        toast.error(errorText || t('contact.toast_error'), { autoClose: 5000 });
        return;
    }

    // Бэк всегда отдаёт одинаковый success.
    sent.value = true;
    toast.success(t('contact.toast_success'), { autoClose: 5000 });
    form.name = "";
    form.email = "";
    form.company = "";
    form.message = "";
    form.hp_company = "";
}
</script>

<style scoped lang="scss">
@use "../../../scss/variables" as *;

.section-container-contact {
    padding: $spacing-2xl 0;
    background-color: $bg-gray;

    .contact-grid {
        display: grid;
        grid-template-columns: 5fr 7fr;
        gap: $spacing-2xl;
        align-items: start;

        @media (max-width: $breakpoint-lg) {
            grid-template-columns: 1fr;
            gap: $spacing-xl;
        }

        .contact-intro {
            display: flex;
            flex-direction: column;

            .box-contact-intro{
                margin-bottom: 25px;
            }

            .contact-intro__eyebrow {
                font-size: $font-size-xs;
                font-weight: 500;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                color: $accent-primary;
                margin-bottom: 15px;
            }

            .contact-intro__title {
                margin: 0;
                font-size: $font-size-3xl;
                font-weight: 500;
                line-height: 1.1;
            }

            .contact-intro__lead {
                margin: 0;
                font-size: $font-size-lg;
                line-height: 1.5;
                font-weight: 500;
            }

            .contact-intro__text {
                line-height: 1.6;
                color: $text-dark-grey;
                margin-bottom: 15px;
            }

            .contact-intro__list {
                list-style: none;
                margin: 0;
                padding: 0;
                display: flex;
                flex-direction: column;
                gap: $spacing-sm-m;
                color: $text-dark-grey;

                li {
                    display: flex;
                    align-items: center;
                    gap: $spacing-sm-m;
                    line-height: 1.5;

                    .point-dot-shadow {
                        background-color: $accent-primary-dark;
                    }
                }
            }

            .contact-intro__badge {
                align-self: flex-start;
                display: inline-flex;
                align-items: center;
                gap: $spacing-sm-w;
                color: $text-dark-grey;
                font-size: $font-size-sm;
                font-weight: 500;
                margin: 15px 0 10px 0;

                .point-dot-shadow {
                    background-color: $accent-success-dark;
                }
            }

            .contact-intro__author {
                display: flex;
                align-items: center;
                gap: $spacing-sm-m;

                .contact-intro__author-avatar {
                    flex-shrink: 0;
                    width: 48px;
                    height: 48px;
                    border-radius: $radius-full;
                    overflow: hidden;
                    background-color: $bg-light-grey;

                    .contact-intro__author-photo {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        display: block;
                    }
                }

                .contact-intro__author-info {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    font-family: $font-family-inter;

                    .contact-intro__author-name {
                        margin: 0;
                        font-size: $font-size-sm;
                        font-weight: 500;
                        color: $text-color;
                    }

                    .contact-intro__author-role {
                        margin: 0;
                        font-size: $font-size-xs;
                        color: $text-light-grey;
                    }
                }
            }
        }

        .contact-form-wrap {
            display: flex;
            flex-direction: column;
            gap: $spacing-lg;

            .contact-sent-card {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                padding: $spacing-2xl $spacing-xl;
                background-color: $bg-white;
                border: 1px solid $border-color;
                border-radius: $radius-xl;
                box-shadow: $shadow-sm-md;

                @media (max-width: $breakpoint-sm) {
                    padding: $spacing-xl $spacing-lg;
                }

                .contact-sent-card__title {
                    margin: 0 0 $spacing-md;
                    font-size: $font-size-2xl;
                    font-weight: 600;
                    color: $text-color;
                }

                .contact-sent-card__text {
                    color: $text-dark-grey;
                    line-height: 1.6;
                }

                :deep(.xicon) {
                    width: auto;
                    height: auto;
                }

                :deep(.xicon svg) {
                    margin-top: $spacing-lg;
                    width: 100px;
                    height: 100px;
                    color: $accent-primary;
                }
            }

            .contact-form-card {
                padding: $spacing-xl;
                background-color: $bg-white;
                border: 1px solid $border-color;
                border-radius: $radius-xl;
                box-shadow: $shadow-sm-md;

                @media (max-width: $breakpoint-sm) {
                    padding: $spacing-lg;
                }

                .contact-form {
                    display: flex;
                    flex-direction: column;
                    gap: $spacing-sm;

                    .contact-form__honeypot {
                        position: absolute;
                        left: -10000px;
                        width: 1px;
                        height: 1px;
                        opacity: 0;
                        pointer-events: none;
                    }

                    .contact-form__row {
                        display: grid;
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                        gap: $spacing-md;

                        @media (max-width: $breakpoint-sm) {
                            grid-template-columns: 1fr;
                        }
                    }

                    .contact-form__submit {
                        margin-top: $spacing-sm;
                        display: flex;
                        flex-direction: column;
                        gap: $spacing-sm;

                        .contact-form__hint {
                            margin: 0;
                            display: inline-flex;
                            justify-content: center;
                            align-items: center;
                            gap: $spacing-xs;
                            font-size: $font-size-xs;
                            color: $text-light-grey;

                            .contact-form__hint-icon {
                                width: 14px;
                                height: 14px;
                                color: $accent-success;
                            }
                        }
                    }
                }
            }

            .contact-trust {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: $spacing-md;

                @media (max-width: $breakpoint-sm) {
                    grid-template-columns: 1fr;
                }

                .contact-trust__card {
                    display: flex;
                    align-items: center;
                    gap: $spacing-sm-m;
                    padding: $spacing-md;
                    background-color: $bg-white;
                    border: 1px solid $border-color;
                    border-radius: $radius-lg;

                    h4 {
                        margin: 0 0 2px;
                        font-size: $font-size-sm;
                        font-weight: 700;
                    }

                    p {
                        margin: 0;
                        font-size: $font-size-xs;
                    }

                    .contact-trust__icon {
                        width: 28px;
                        height: 28px;
                        color: $accent-primary;
                        flex-shrink: 0;
                    }
                }
            }
        }
    }
}
</style>
