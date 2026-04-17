<template>
    <div v-if="visible && !isPrivacyRoute" class="consent-overlay">
        <div class="consent-card">
            <h2>{{ appName }}</h2>

            <div class="title">{{ t('consent.title') }}</div>

            <p>{{ t('consent.description_1') }}</p>
            <p>{{ t('consent.description_2', { name: appName }) }}</p>

            <div class="box-checkbox">
                <router-link :to="privacyLink" rel="nofollow">
                    {{ t('consent.privacy_link') }}
                </router-link>
                <n-space item-style="display: inline-flex;" align="center"  class="checkbox">
                    <n-checkbox
                        :label="t('consent.checkbox_label')"
                        v-model:checked="accepted"
                        :theme-overrides="{
                            colorChecked: '#3782d2',
                            borderChecked: '1px solid #3782d2',
                            borderFocus: '1px solid #1062b9',
                            boxShadowFocus: '0 0 0 2px rgba(16, 98, 185, 0.2)',
                        }"/>
                </n-space>
            </div>

            <n-button
                type="info"
                :disabled="!accepted"
                @click="continueToApp"
            >
                {{ t('consent.continue') }}
            </n-button>

        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { LS_CONSENT_VERSION } from "@/config/storageNames";

defineOptions({ name: "ConsentOverlay" });

const { t } = useI18n();
const route = useRoute();

const visible = ref(false);
const accepted = ref(false);
const appName = window.appName || "";

const privacyLink = computed(() => {
    const locale = route?.params?.locale || "en";
    return `/${locale}/privacy-policy`;
});

const isPrivacyRoute = computed(() => route?.name === "PrivacyPolicy");

onMounted(() => {
    // localStorage.removeItem(LS_CONSENT_VERSION);
    const consent = localStorage.getItem(LS_CONSENT_VERSION);
    if (!consent) {
        visible.value = true;
    }
});

function continueToApp() {
    localStorage.setItem(LS_CONSENT_VERSION, "true");
    visible.value = false;
}

</script>

<style lang="scss">
@use "../../../../scss/variables" as *;

.consent-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;

    .consent-card {
        width: 420px;
        background: $bg-white;
        border-radius: 16px;
        padding: 28px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        animation: pop 0.25s ease-out;

        h2 {
            font-size: 20px;
        }

        .title{
            font-size: 14px;
            font-weight: 500;
            color: $accent-success-dark;
            margin-bottom: 10px;
        }

        p {
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 16px;
        }

        .box-checkbox{
            a{
                display: inline-block;
                margin-bottom: 15px;
                font-size: 12px;
                font-weight: 400;

                &:hover{
                    color: $accent-primary-dark
                }
            }
            .checkbox {
                gap: 8px;
                font-size: 13px;
                margin-bottom: 15px;
            }
        }

        button {
            width: 100%;
        }
    }
}

.n-checkbox {
    display: flex;
    align-items: center;
}

.n-checkbox .n-checkbox__label {
    line-height: 16px;
    font-size: 12px;
}

@keyframes pop {
    from {
        transform: scale(0.95);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
