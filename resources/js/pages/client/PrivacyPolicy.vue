<template>
    <div class="privacy-page">
        <div class="container">

            <div class="privacy-header">
                <h1>{{ t('privacy_policy.page.title') }}</h1>
                <p class="subtitle">{{ t('privacy_policy.page.subtitle', { name: siteConfig.name }) }}</p>
            </div>

            <div class="privacy-content">

                <section>
                    <h2>{{ t('privacy_policy.general.heading') }}</h2>
                    <p>{{ t('privacy_policy.general.text', { name: siteConfig.name }) }}</p>
                </section>

                <section>
                    <h2>{{ t('privacy_policy.collected_data.heading') }}</h2>
                    <ul>
                        <li>{{ t('privacy_policy.collected_data.item_name') }}</li>
                        <li>{{ t('privacy_policy.collected_data.item_email') }}</li>
                        <li>{{ t('privacy_policy.collected_data.item_business') }}</li>
                        <li>{{ t('privacy_policy.collected_data.item_phone') }}</li>
                        <li>{{ t('privacy_policy.collected_data.item_type') }}</li>
                        <li>{{ t('privacy_policy.collected_data.item_country') }}</li>
                        <li>{{ t('privacy_policy.collected_data.item_answers') }}</li>
                    </ul>
                </section>

                <section>
                    <h2>{{ t('privacy_policy.purpose.heading') }}</h2>
                    <ul>
                        <li>{{ t('privacy_policy.purpose.item_analysis') }}</li>
                        <li>{{ t('privacy_policy.purpose.item_development') }}</li>
                        <li>{{ t('privacy_policy.purpose.item_contact') }}</li>
                        <li>{{ t('privacy_policy.purpose.item_launch') }}</li>
                    </ul>
                </section>

                <section>
                    <h2>{{ t('privacy_policy.legal_basis.heading') }}</h2>
                    <p>{{ t('privacy_policy.legal_basis.text') }}</p>
                </section>

                <section>
                    <h2>{{ t('privacy_policy.storage.heading') }}</h2>
                    <p>{{ t('privacy_policy.storage.text') }}</p>
                </section>

                <section>
                    <h2>{{ t('privacy_policy.retention.heading') }}</h2>
                    <p>{{ t('privacy_policy.retention.text') }}</p>
                </section>

                <section>
                    <h2>{{ t('privacy_policy.rights.heading') }}</h2>
                    <ul>
                        <li>{{ t('privacy_policy.rights.item_access') }}</li>
                        <li>{{ t('privacy_policy.rights.item_correction') }}</li>
                        <li>{{ t('privacy_policy.rights.item_deletion') }}</li>
                        <li>{{ t('privacy_policy.rights.item_restriction') }}</li>
                    </ul>
                </section>

                <section>
                    <h2>{{ t('privacy_policy.local_storage.heading') }}</h2>
                    <p>{{ t('privacy_policy.local_storage.text') }}</p>
                </section>

                <section>
                    <h2>{{ t('privacy_policy.changes.heading') }}</h2>
                    <p>{{ t('privacy_policy.changes.text') }}</p>
                </section>

                <section>
                    <h2>{{ t('privacy_policy.contacts.heading') }}</h2>
                    <p>{{ t('privacy_policy.contacts.text') }}</p>
                    <p class="contact-email">{{ siteConfig.adminEmail }}</p>
                </section>

            </div>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useSiteConfigStore } from "@/stores";
import { usePageSeo } from "@/composables/usePageSeo";

defineOptions({ name: "PrivacyPolicy" });

const { t } = useI18n();
const siteConfig = useSiteConfigStore();

usePageSeo({ i18nKey: "seo.privacy_policy" });
</script>

<style scoped lang="scss">
@use "../../../scss/variables" as *;

.privacy-page {
    background: $bg-gray;
    padding: 60px 20px;
    color: $text-color;

    @media (max-width: 768px) {
        padding: 30px 20px;
    }

    .container {
        max-width: 900px;
        margin: 0 auto;
        background: $bg-white;
        border-radius: 16px;
        padding: 40px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);

        @media (max-width: 768px) {
            padding: 20px;
        }
    }

    .privacy-header {
        margin-bottom: 40px;
        border-bottom: 1px solid $border-color;
        padding-bottom: 20px;

        h1 {
            font-size: 32px;
            font-weight: 700;
            color: $accent-primary;
            margin-bottom: 8px;

            @media (max-width: 768px) {
                    font-size: 24px;
            }
        }

        .subtitle {
            color: $text-light-grey;
            font-size: 14px;
        }
    }

    .privacy-content {
        section {
            margin-bottom: 30px;

            h2 {
                font-size: 20px;
                margin-bottom: 12px;
                color: $text-dark-grey;
                font-weight: 600;
            }

            p {
                line-height: 1.6;
                color: $text-light-grey;
            }

            ul {
                padding-left: 18px;

                li {
                    margin-bottom: 6px;
                    color: $text-light-grey;
                }
            }
        }

        .contact-email {
            font-weight: 600;
            color: $accent-primary;
            margin-top: 10px;
        }
    }
}

//@media (max-width: 768px) {
//    .privacy-page .container {
//        padding: 20px;
//    }
//
//    .privacy-header h1 {
//        font-size: 24px;
//    }
//}

</style>
