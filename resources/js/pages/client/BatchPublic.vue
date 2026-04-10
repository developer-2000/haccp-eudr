<template>
    <div class="batch-public">
        <div v-if="record" class="batch-public__toolbar no-print">
            <button
                type="button"
                class="batch-public__print btn-client btn-outline-primary"
                @click="print"
            >
                Печать / PDF
            </button>
        </div>

        <div v-if="!record" class="batch-public__missing container">
            <h1 class="batch-public__missing-title">Партия не найдена</h1>
            <p class="batch-public__missing-text">
                Код «{{ batchId }}» не существует в демо-данных. Проверьте
                ссылку или откройте демо EUDR QR.
            </p>
            <RouterLink class="btn-client btn-outline-primary" :to="homePath"
                >На главную</RouterLink
            >
        </div>

        <article v-else class="batch-public__paper">
            <header class="batch-public__head">
                <div class="batch-public__eu-band" aria-hidden="true" />
                <p class="batch-public__kicker">
                    Regulation (EU) 2023/1115 — demo disclosure
                </p>
                <h1 class="batch-public__title">
                    EUDR — раскрытие сведений по партии
                </h1>
                <p class="batch-public__sub">
                    Не юридически обязательный документ; демонстрация для
                    инспектора / контрагента.
                </p>
                <div class="batch-public__refs">
                    <div>
                        <span class="batch-public__label"
                            >Batch / consignment ID</span
                        >
                        <strong>{{ record.id }}</strong>
                    </div>
                    <div>
                        <span class="batch-public__label"
                            >DDS reference (demo)</span
                        >
                        <strong>{{ record.ddsReference }}</strong>
                    </div>
                    <div>
                        <span class="batch-public__label">Статус</span>
                        <span
                            class="batch-public__status"
                            :class="`batch-public__status--${record.status}`"
                        >
                            {{ record.statusLabel }}
                        </span>
                    </div>
                </div>
            </header>

            <section class="batch-public__section">
                <h2>1. Оператор (EU)</h2>
                <dl class="batch-public__dl">
                    <div>
                        <dt>Наименование</dt>
                        <dd>{{ record.operator.name }}</dd>
                    </div>
                    <div>
                        <dt>Адрес</dt>
                        <dd>{{ record.operator.address }}</dd>
                    </div>
                    <div>
                        <dt>Роль</dt>
                        <dd>{{ record.operator.role }}</dd>
                    </div>
                    <div>
                        <dt>EORI</dt>
                        <dd>{{ record.operator.eori }}</dd>
                    </div>
                </dl>
            </section>

            <section class="batch-public__section">
                <h2>2. Продукт</h2>
                <dl class="batch-public__dl">
                    <div>
                        <dt>Описание</dt>
                        <dd>{{ record.product.name }}</dd>
                    </div>
                    <div>
                        <dt>CN code (illustrative)</dt>
                        <dd>{{ record.product.cnCode }}</dd>
                    </div>
                    <div>
                        <dt>Категория</dt>
                        <dd>{{ record.product.category }}</dd>
                    </div>
                    <div>
                        <dt>Масса / объём</dt>
                        <dd>{{ record.product.quantity }}</dd>
                    </div>
                    <div>
                        <dt>Внутренний лот</dt>
                        <dd>{{ record.product.lot }}</dd>
                    </div>
                </dl>
            </section>

            <section class="batch-public__section">
                <h2>3. Происхождение / участок (мок)</h2>
                <dl class="batch-public__dl">
                    <div>
                        <dt>Страна</dt>
                        <dd>{{ record.plot.country }}</dd>
                    </div>
                    <div>
                        <dt>Регион</dt>
                        <dd>{{ record.plot.region }}</dd>
                    </div>
                    <div class="batch-public__dl-wide">
                        <dt>Геоданные / ссылка</dt>
                        <dd>{{ record.plot.geo }}</dd>
                    </div>
                    <div class="batch-public__dl-wide">
                        <dt>Период урожая / покрытия</dt>
                        <dd>{{ record.harvestPeriod }}</dd>
                    </div>
                </dl>
            </section>

            <section class="batch-public__section">
                <h2>4. Цепочка поставок</h2>
                <div class="batch-public__table-wrap">
                    <div class="batch-public__chain-desktop">
                        <table class="batch-public__table">
                            <thead>
                                <tr>
                                    <th>Роль</th>
                                    <th>Участник</th>
                                    <th>Страна</th>
                                    <th>Реф. (demo)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(row, idx) in record.supplierChain"
                                    :key="idx"
                                >
                                    <td>{{ row.role }}</td>
                                    <td>{{ row.name }}</td>
                                    <td>{{ row.country }}</td>
                                    <td>{{ row.ref }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="batch-public__chain-mobile">
                        <article
                            v-for="(row, idx) in record.supplierChain"
                            :key="idx"
                            class="batch-public__chain-card"
                        >
                            <p class="batch-public__chain-line">
                                <span class="batch-public__chain-label"
                                    >Роль:</span
                                >
                                {{ row.role }}
                            </p>
                            <p class="batch-public__chain-line">
                                <span class="batch-public__chain-label"
                                    >Участник:</span
                                >
                                {{ row.name }}
                            </p>
                            <p class="batch-public__chain-line">
                                <span class="batch-public__chain-label"
                                    >Страна:</span
                                >
                                {{ row.country }}
                            </p>
                            <p class="batch-public__chain-line">
                                <span class="batch-public__chain-label"
                                    >Реф. (demo):</span
                                >
                                {{ row.ref }}
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            <section class="batch-public__section">
                <h2>5. Оценка / доказательства</h2>
                <p class="batch-public__lead">{{ record.statusDetail }}</p>
                <ul class="batch-public__evidence">
                    <li v-for="(ev, idx) in record.evidence" :key="idx">
                        <strong>{{ ev.label }}</strong>
                        <span class="batch-public__evidence-ref">{{
                            ev.ref
                        }}</span>
                    </li>
                </ul>
            </section>

            <footer class="batch-public__footer">
                <div class="batch-public__meta">
                    <span>Версия документа: {{ record.documentVersion }}</span>
                    <span>Сформировано: {{ record.generatedAt }}</span>
                </div>
                <p class="batch-public__disclaimer">{{ record.disclaimer }}</p>
                <p class="batch-public__url no-print">
                    Публичная ссылка: {{ canonicalUrl }}
                </p>
            </footer>
        </article>
    </div>
</template>

<script setup>
import { computed, nextTick, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import {
    getBatchPublicRecord,
    buildBatchPublicUrl,
} from "@/features/demo/data/eudrBatchPublic";

defineOptions({ name: "BatchPublic" });

const route = useRoute();
const batchId = computed(() => String(route.params.batchId ?? ""));
const record = computed(() => getBatchPublicRecord(batchId.value));

const homePath = "/en";

const localeForCanonical = computed(() => {
    const p = route.params.locale;
    if (typeof p === "string" && p.length) {
        return p;
    }
    if (typeof window !== "undefined" && typeof window.locale === "string") {
        return window.locale;
    }
    return null;
});

const canonicalUrl = computed(() =>
    buildBatchPublicUrl(batchId.value, localeForCanonical.value),
);

/** Открытие из модалки EUDR с ?print=1 — сразу готовим диалог печати / PDF. */
const wantsAutoPrint = computed(() => route.query.print === "1");

const print = () => window.print();

const runAutoPrint = () => {
    if (!record.value || !wantsAutoPrint.value) {
        return;
    }
    nextTick(() => {
        requestAnimationFrame(() => {
            setTimeout(() => window.print(), 400);
        });
    });
};

const syncTitle = () => {
    if (record.value) {
        document.title = `EUDR ${record.value.id} — ${record.value.product.name}`;
    } else {
        document.title = "Партия не найдена — EUDR demo";
    }
};

onMounted(syncTitle);
watch([record, batchId], syncTitle);

watch(
    () => [record.value?.id, route.query.print],
    () => runAutoPrint(),
    { flush: "post", immediate: true },
);
</script>

<style scoped lang="scss">
@use "../../../scss/variables" as *;

.batch-public {
    min-height: 100%;
    background: linear-gradient(
        180deg,
        rgba($bg-light-grey, 0.35) 0%,
        $bg-gray 40%
    );
    padding: $spacing-lg $spacing-md $spacing-2xl;
}

.batch-public__toolbar {
    max-width: 920px;
    margin: 0 auto $spacing-md;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: $spacing-md;
    flex-wrap: wrap;
}

.batch-public__missing {
    max-width: 560px;
    margin: 0 auto;
    padding: $spacing-xl;
    background: $bg-style-white;
    border-radius: $radius-xl;
    border: 1px solid $text-light-grey;
}

.batch-public__missing-title {
    margin: 0 0 $spacing-sm;
    font-size: $font-size-2xl;
}

.batch-public__missing-text {
    margin: 0 0 $spacing-lg;
    color: $text-dark-grey;
}

.batch-public__paper {
    max-width: 920px;
    margin: 0 auto;
    background: $bg-style-white;
    border: 1px solid $text-light-grey;
    border-radius: $radius-xxl;
    box-shadow: $shadow-md;
    padding: $spacing-xl $spacing-xl $spacing-lg;
}

.batch-public__eu-band {
    height: 6px;
    border-radius: $radius-sm;
    margin-bottom: $spacing-md;
    background: linear-gradient(
        90deg,
        #003399 0%,
        #003399 14%,
        #ffcc00 14%,
        #ffcc00 28%,
        #003399 28%,
        #003399 42%,
        #ffcc00 42%,
        #ffcc00 56%,
        #003399 56%,
        #003399 70%,
        #ffcc00 70%,
        #ffcc00 84%,
        #003399 84%,
        #003399 100%
    );
}

.batch-public__kicker {
    margin: 0 0 $spacing-xs;
    font-size: $font-size-sm;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: $text-dark-grey;
}

.batch-public__title {
    margin: 0 0 $spacing-xs;
    font-size: $font-size-2xl;
    color: $text-color;
    line-height: 1.2;
}

.batch-public__sub {
    margin: 0 0 $spacing-lg;
    color: $text-dark-grey;
    font-size: $font-size-sm;
}

.batch-public__refs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: $spacing-md;
    padding: $spacing-md;
    background: rgba($bg-light-grey, 0.5);
    border-radius: $radius-lg;
    border: 1px solid rgba($text-light-grey, 0.8);
}

.batch-public__label {
    display: block;
    font-size: $font-size-xs;
    color: $text-dark-grey;
    margin-bottom: 4px;
}

.batch-public__status {
    display: inline-block;
    margin-top: 4px;
    font-weight: 700;
    font-size: $font-size-sm;
}

.batch-public__status--ok {
    color: $text-green;
}

.batch-public__status--review {
    color: $accent-primary;
}

.batch-public__section {
    margin-top: $spacing-xl;
    padding-top: $spacing-lg;
    border-top: 1px solid $text-light-grey;

    h2 {
        margin: 0 0 $spacing-md;
        font-size: $font-size-lg;
        color: $text-color;
    }
}

.batch-public__dl {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: $spacing-md $spacing-lg;
    margin: 0;

    dt {
        font-size: $font-size-xs;
        color: $text-dark-grey;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        margin-bottom: 4px;
    }

    dd {
        margin: 0;
        font-size: $font-size-base;
        color: $text-color;
    }
}

.batch-public__dl-wide {
    grid-column: 1 / -1;
}

.batch-public__table-wrap {
    overflow-x: auto;
    border: 1px solid $text-light-grey;
    border-radius: $radius-lg;
}

.batch-public__chain-desktop {
    display: block;
}

.batch-public__chain-mobile {
    display: none;
    flex-direction: column;
    gap: $spacing-md;
}

.batch-public__chain-card {
    border: 1px solid $text-light-grey;
    border-radius: $radius-lg;
    padding: $spacing-md;
    background: $bg-gray;
}

.batch-public__chain-line {
    margin: 4px 0 0;
    font-size: $font-size-sm;
    word-break: break-word;

    &:first-child {
        margin-top: 0;
    }
}

.batch-public__chain-label {
    color: $text-dark-grey;
    margin-right: 4px;
    font-weight: 500;
}

.batch-public__table {
    width: 100%;
    border-collapse: collapse;
    min-width: 560px;
    font-size: $font-size-sm;

    th,
    td {
        padding: $spacing-sm $spacing-md;
        border-bottom: 1px solid $text-light-grey;
        text-align: left;
        vertical-align: top;
    }

    th {
        background: rgba($bg-light-grey, 0.4);
        font-weight: 600;
        color: $text-dark-grey;
    }

    tbody tr:last-child td {
        border-bottom: none;
    }
}

@media (max-width: $breakpoint-lg) {
    .batch-public__chain-desktop {
        display: none;
    }

    .batch-public__chain-mobile {
        display: flex;
    }

    .batch-public__table-wrap {
        overflow-x: visible;
        border: none;
    }
}

.batch-public__lead {
    margin: 0 0 $spacing-md;
    line-height: 1.5;
    color: $text-color;
}

.batch-public__evidence {
    margin: 0;
    padding-left: 1.1rem;
    color: $text-color;

    li {
        margin-bottom: $spacing-sm;
    }
}

.batch-public__evidence-ref {
    display: block;
    margin-top: 2px;
    font-size: $font-size-sm;
    color: $text-dark-grey;
    font-family: ui-monospace, monospace;
}

.batch-public__footer {
    margin-top: $spacing-xl;
    padding-top: $spacing-lg;
    border-top: 2px solid $text-light-grey;
}

.batch-public__meta {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-md;
    font-size: $font-size-sm;
    color: $text-dark-grey;
    margin-bottom: $spacing-md;
}

.batch-public__disclaimer {
    margin: 0;
    font-size: $font-size-xs;
    color: $text-dark-grey;
    line-height: 1.45;
}

.batch-public__url {
    margin: $spacing-md 0 0;
    font-size: $font-size-xs;
    word-break: break-all;
    color: $text-dark-grey;
}

@media print {
    .batch-public {
        background: #fff;
        padding: 0;
    }

    .batch-public__paper {
        border: none;
        box-shadow: none;
        max-width: 100%;
        padding: 0;
    }

    .batch-public__chain-desktop {
        display: block !important;
    }

    .batch-public__chain-mobile {
        display: none !important;
    }

    .no-print {
        display: none !important;
    }
}
</style>
