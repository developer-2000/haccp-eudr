<template>
    <div v-if="visible && !isPrivacyRoute" class="consent-overlay">
        <div class="consent-card">
            <h2>{{ appName }}</h2>

            <div class="title">{{ t('consent.title') }}</div>

            <p>{{ t('consent.description_1') }}</p>
            <p>{{ t('consent.description_2', { name: appName }) }}</p>

            <div class="box-checkbox">
                <Link :href="privacyLink" rel="nofollow">
                    {{ t('consent.privacy_link') }}
                </Link>
                <n-space class="checkbox" @click="accepted = !accepted">
                    <n-switch size="medium" v-model:value="accepted" />
                    <span class="switch-label">
                        {{ t('consent.checkbox_label') }}
                    </span>
                </n-space>
            </div>

            <n-button
                type="info"
                size="large"
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
import { Link, usePage } from "@inertiajs/vue3";
import { useI18n } from "vue-i18n";
import { NButton, NSpace, NSwitch } from "naive-ui";
import { useCurrentLocale } from "@/composables/useCurrentLocale.js";
import { LS_CONSENT_VERSION } from "@/config/storageNames";

defineOptions({ name: "ConsentOverlay" });

const { t } = useI18n();

const page = usePage();
const appName = computed(() => page.props.siteConfig?.name || "");
const visible = ref(false);
const accepted = ref(false);
const currentLocale = ref(useCurrentLocale());
const currentPath = ref(typeof window !== "undefined" ? window.location.pathname : "");

const privacyLink = computed(() => `/${currentLocale.value}/privacy-policy`);

/**
 * На странице privacy-policy сам overlay не нужен — иначе закрыть консент можно
 * только через ту же ссылку, которая уже открыта (безвыходная петля).
 */
const isPrivacyRoute = computed(() => /\/privacy-policy\/?$/.test(currentPath.value));

onMounted(() => {
    currentLocale.value = useCurrentLocale();
    currentPath.value = window.location.pathname;
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
        margin: 0 20px;

        h2 {
            font-size: 20px;
        }

        .title{
            font-size: 14px;
            font-weight: 500;
            color: $text-logo;
            margin-bottom: 20px;
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
                margin-bottom: 30px;
                display: flex;
                align-items: center;
                flex-flow: inherit!important;
                cursor: pointer;

                &:hover {
                    .switch-label {
                        color: $accent-primary-dark;
                    }
                }

                .switch-label {
                    user-select: none;
                    transition: color 0.15s ease;
                }
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
    font-size: 14px;
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
