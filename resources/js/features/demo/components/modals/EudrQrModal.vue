<template>
    <n-modal
        v-model:show="showModel"
        preset="card"
        title="Детали партии"
        class="eudr-qr-modal"
        content-scrollable
        :trap-focus="false"
        :style="{ width: '600px', maxWidth: 'calc(100vw - 32px)' }"
        :segmented="{ content: true, footer: true }"
        @update:show="onVisibilityChange"
    >
        <template v-if="batch">
            <!-- Скрытое поле для execCommand: в модалке динамический input часто не копирует -->
            <textarea
                ref="copyField"
                class="eudr-qr-modal__copy-field"
                tabindex="-1"
                aria-hidden="true"
            />
            <div class="eudr-qr-modal__content">
                <h3 class="eudr-qr-modal__title">{{ batch.id }}</h3>
                <div class="eudr-qr-modal__table-wrap">
                    <table class="eudr-qr-modal__table">
                        <thead>
                            <tr>
                                <th>Параметр</th>
                                <th>Значение</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Продукт</td>
                                <td>{{ batch.product }}</td>
                            </tr>
                            <tr>
                                <td>Поставщик</td>
                                <td>{{ batch.supplier }}</td>
                            </tr>
                            <tr>
                                <td>Дата</td>
                                <td>{{ batch.date }}</td>
                            </tr>
                            <tr>
                                <td>Ссылка</td>
                                <td>
                                    <RouterLink
                                        class="eudr-qr-modal__batch-link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        :to="{
                                            name: 'BatchPublic',
                                            params: {
                                                locale: batchPageLocale,
                                                batchId: batch.id,
                                            },
                                        }"
                                    >
                                        {{ displayedBatchUrl }}
                                    </RouterLink>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="eudr-qr-modal__code">
                    <img
                        v-if="qrImageUrl"
                        :src="qrImageUrl"
                        alt="EUDR QR code"
                    />
                </div>
            </div>
        </template>

        <template #footer>
            <div class="eudr-qr-modal__actions">
                <n-button type="warning" @click="emitAction('close')">
                    Отмена
                </n-button>
                <n-button type="info" @click="copyPageUrl">
                    Копировать
                </n-button>
                <n-button type="info" @click="openBatchPdf"> PDF </n-button>
            </div>
        </template>
    </n-modal>
</template>

<script setup>
import QRCode from "qrcode";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { NButton, NModal, useMessage } from "naive-ui";
import { buildBatchPublicUrl } from "@/features/demo/data/eudrBatchPublic";

defineOptions({ name: "EudrQrModal" });

const props = defineProps({
    show: {
        type: Boolean,
        required: true,
    },
    batch: {
        type: Object,
        default: null,
    },
});

const emit = defineEmits(["close", "action"]);
const message = useMessage();
const route = useRoute();
const qrImageUrl = ref("");
const copyField = ref(null);

/** Локаль из URL демо (`/ro/demo/...`) или `window.locale` / fallback. */
const batchPageLocale = computed(() => {
    const p = route.params.locale;
    if (typeof p === "string" && p.length) {
        return p;
    }
    if (typeof window !== "undefined" && typeof window.locale === "string") {
        return window.locale;
    }
    return "en";
});

const displayedBatchUrl = computed(() =>
    props.batch?.id
        ? buildBatchPublicUrl(String(props.batch.id), batchPageLocale.value)
        : "",
);

const showModel = computed({
    get: () => props.show,
    set: (value) => {
        if (!value) {
            emit("close");
        }
    },
});

watch(
    () => [props.batch?.id, displayedBatchUrl.value],
    async (tuple) => {
        const id = tuple?.[0];
        const url = tuple?.[1];
        if (!id || !url) {
            qrImageUrl.value = "";
            return;
        }
        qrImageUrl.value = await QRCode.toDataURL(url, {
            width: 200,
            margin: 1,
        });
    },
    { immediate: true },
);

/**
 * Закрывает модалку при внешнем изменении видимости.
 * Используется для корректного закрытия через overlay и esc.
 */
const onVisibilityChange = (visible) => {
    if (!visible) {
        emit("close");
    }
};

/**
 * Передает действие из футера модалки в родительский компонент.
 * Используется для обработки закрытия (legacy).
 */
const emitAction = (action) => {
    emit("action", action);
};

/**
 * Абсолютный URL страницы партии: из batch.url или из id (если url битый/пустой).
 */
const resolveAbsoluteBatchUrl = () => {
    if (!props.batch?.id) {
        return "";
    }
    return displayedBatchUrl.value || buildBatchPublicUrl(props.batch.id, batchPageLocale.value);
};

/**
 * Копирует URL.
 * 1) navigator.clipboard.writeText — не нужен фокус (в модалках execCommand часто даёт false).
 * 2) иначе textarea + execCommand.
 */
const copyPageUrl = async () => {
    const href = resolveAbsoluteBatchUrl().trim();
    if (!href) {
        message.warning("Нет ссылки для копирования");
        return;
    }

    let ok = false;

    if (navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(href);
            ok = true;
        } catch {
            ok = false;
        }
    }

    if (!ok && copyField.value) {
        const el = copyField.value;
        el.value = href;
        el.focus();
        el.select();
        el.setSelectionRange(0, href.length);
        try {
            ok = document.execCommand("copy");
        } catch {
            ok = false;
        }
    }

    if (ok) {
        message.success("URL страницы скопирован в буфер обмена");
        setTimeout(() => emit("close"), 0);
    } else {
        message.error(
            "Не удалось скопировать ссылку (нужен HTTPS или разрешение буфера)",
        );
    }
};

/**
 * Открывает публичную страницу партии с print=1: в новой вкладке откроется документ и диалог печати (Сохранить как PDF).
 */
const openBatchPdf = () => {
    const href = resolveAbsoluteBatchUrl().trim();
    if (!href) {
        return;
    }
    try {
        const url = new URL(href, window.location.origin);
        url.searchParams.set("print", "1");
        window.open(url.toString(), "_blank", "noopener,noreferrer");
    } catch {
        const sep = href.includes("?") ? "&" : "?";
        window.open(`${href}${sep}print=1`, "_blank", "noopener,noreferrer");
    }
};
</script>

<style scoped lang="scss">
@use "../../../../../scss/variables" as *;

.eudr-qr-modal__copy-field {
    position: fixed;
    left: 0;
    top: 0;
    width: 2px;
    height: 2px;
    margin: 0;
    padding: 0;
    border: 0;
    opacity: 0.02;
    z-index: 10;
    resize: none;
}

.eudr-qr-modal__meta {
    margin: 0 0 $spacing-sm;
}

.eudr-qr-modal__content {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
}

.eudr-qr-modal__title {
    margin: 0;
    font-size: $font-size-xl;
}

.eudr-qr-modal__table-wrap {
    width: 100%;
    overflow-x: auto;
}

.eudr-qr-modal__batch-link {
    color: $accent-primary;
    word-break: break-all;
    text-decoration: underline;

    &:hover {
        color: $accent-primary-dark;
    }
}

.eudr-qr-modal__table {
    width: 100%;
    border-collapse: collapse;
    min-width: 420px;

    th,
    td {
        text-align: left;
        padding: $spacing-sm;
        border-bottom: 1px solid $text-light-grey;
        vertical-align: middle;
    }

    th {
        font-size: $font-size-sm;
        color: $text-dark-grey;
        font-weight: 600;
    }
}

.eudr-qr-modal__code {
    display: flex;
    justify-content: center;
    margin: $spacing-md 0;
}

.eudr-qr-modal__hint {
    margin: 0;
    color: $text-dark-grey;
}

.eudr-qr-modal__actions {
    display: flex;
    gap: $spacing-sm;
    justify-content: flex-end;
    flex-wrap: wrap;
}
</style>
