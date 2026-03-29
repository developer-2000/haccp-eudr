<template>
    <div class="eudr-section">
        <div class="eudr-table-wrap">
            <table class="eudr-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Продукт</th>
                        <th>Поставщик</th>
                        <th>Дата</th>
                        <th>Статус</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="batch in props.batches" :key="batch.id">
                        <td>{{ batch.id }}</td>
                        <td>{{ batch.product }}</td>
                        <td>{{ batch.supplier }}</td>
                        <td>{{ batch.date }}</td>
                        <td>
                            <span
                                class="eudr-status"
                                :class="`eudr-status--${batch.status}`"
                            >
                                {{ batch.statusLabel }}
                            </span>
                        </td>
                        <td>
                            <n-button type="info" @click="openQrModal(batch)">
                                Показать QR
                            </n-button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <EudrQrModal
            :show="isQrModalOpen"
            :batch="selectedBatch"
            @close="closeQrModal"
            @action="handleQrAction"
        />
    </div>
</template>

<script setup>
import { ref } from "vue";
import EudrQrModal from "@/features/demo/components/modals/EudrQrModal.vue";

defineOptions({ name: "EudrSection" });

const props = defineProps({
    batches: {
        type: Array,
        required: true,
    },
});

const isQrModalOpen = ref(false);
const selectedBatch = ref(null);

/**
 * Открывает QR модалку выбранной партии.
 * Используется для показа инспекторского сценария по конкретной записи.
 */
const openQrModal = (batch) => {
    selectedBatch.value = batch;
    isQrModalOpen.value = true;
};

/**
 * Закрывает QR модалку и очищает выбранную партию.
 * Используется для корректного сброса состояния между открытиями.
 */
const closeQrModal = () => {
    isQrModalOpen.value = false;
    selectedBatch.value = null;
};

/**
 * Обрабатывает действия из QR модалки.
 * Используется для mock-логики отправки, PDF и перехода в опрос.
 */
const handleQrAction = (action) => {
    closeQrModal();
};
</script>

<style scoped lang="scss">
@use "../../../../../scss/variables" as *;

.eudr-section {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
}

.eudr-section__header {
    h2 {
        margin: 0;
        font-size: $font-size-xl;
    }

    p {
        margin: $spacing-xs 0 0;
        color: $text-dark-grey;
    }
}

.eudr-table-wrap {
    overflow-x: auto;
}

.eudr-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 720px;

    th,
    td {
        text-align: left;
        padding: $spacing-sm $spacing-md;
        border-bottom: 1px solid $text-light-grey;
        vertical-align: middle;
    }

    tbody tr {
        transition: background-color $transition-base ease;
    }

    tbody tr:hover {
        background-color: rgba($bg-light-grey, 0.6);
    }

    th {
        font-size: $font-size-sm;
        color: $text-dark-grey;
        font-weight: 600;
    }

    th:nth-child(5),
    td:nth-child(5) {
        text-align: center;
    }
}

.eudr-status {
    display: inline-flex;
    min-height: 28px;
    align-items: center;
    font-size: $font-size-sm;
}

.eudr-status--ok {
    color: $text-green;
}

.eudr-status--review {
    color: $accent-primary;
}

.eudr-table__button {
    min-height: 44px;
}

@media (prefers-reduced-motion: reduce) {
    .eudr-table tbody tr {
        transition: none;
    }
}
</style>
