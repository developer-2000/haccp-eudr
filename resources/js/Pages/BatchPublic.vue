<template>
    <SeoHead :seo="seo" />

    <div class="batch-public">
        <div class="batch-public__toolbar no-print">
            <button type="button" class="btn-client btn-outline-primary" @click="close">
                {{ t('demo.show_task_modal.close') }}
            </button>
            <button
                v-if="record"
                type="button"
                class="batch-public__print btn-client btn-outline-primary"
                @click="runPrint"
            >
                {{ t('batch.public.print_pdf') }}
            </button>
        </div>

        <div v-if="!record" class="batch-public__missing container">
            <h1 class="batch-public__missing-title">{{ t('batch.public.not_found_title') }}</h1>
            <p class="batch-public__missing-text">
                {{ t('batch.public.not_found_text', { batchId }) }}
            </p>
            <button type="button" class="btn-client btn-outline-primary elem-right" @click="close">
                {{ t('demo.show_task_modal.close') }}
            </button>
        </div>

        <article v-else class="batch-public__paper">
            <header class="batch-public__head">
                <div class="batch-public__eu-band" aria-hidden="true" />
                <p class="batch-public__kicker">
                    {{ t('batch.public.kicker') }}
                </p>
                <h1 class="batch-public__title">
                    {{ t('batch.public.title') }}
                </h1>
                <p class="batch-public__sub">
                    {{ t('batch.public.subtitle') }}
                </p>
                <div class="batch-public__refs">
                    <div>
                        <span class="batch-public__label">{{
                            t('batch.public.batch_id_label')
                        }}</span>
                        <strong>{{ record.id }}</strong>
                    </div>
                    <div>
                        <span class="batch-public__label">{{
                            t('batch.public.dds_reference_label')
                        }}</span>
                        <strong>{{ record.ddsReference }}</strong>
                    </div>
                    <div>
                        <span class="batch-public__label">{{
                            t('batch.public.status_label')
                        }}</span>
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
                <h2>{{ t('batch.public.section_operator') }}</h2>
                <dl class="batch-public__dl">
                    <div>
                        <dt>{{ t('batch.public.operator_name') }}</dt>
                        <dd>{{ record.operator.name }}</dd>
                    </div>
                    <div>
                        <dt>{{ t('batch.public.operator_address') }}</dt>
                        <dd>{{ record.operator.address }}</dd>
                    </div>
                    <div>
                        <dt>{{ t('batch.public.operator_role') }}</dt>
                        <dd>{{ record.operator.role }}</dd>
                    </div>
                    <div>
                        <dt>{{ t('batch.public.operator_eori') }}</dt>
                        <dd>{{ record.operator.eori }}</dd>
                    </div>
                </dl>
            </section>

            <section class="batch-public__section">
                <h2>{{ t('batch.public.section_product') }}</h2>
                <dl class="batch-public__dl">
                    <div>
                        <dt>{{ t('batch.public.product_description') }}</dt>
                        <dd>{{ record.product.name }}</dd>
                    </div>
                    <div>
                        <dt>{{ t('batch.public.product_cn_code') }}</dt>
                        <dd>{{ record.product.cnCode }}</dd>
                    </div>
                    <div>
                        <dt>{{ t('batch.public.product_category') }}</dt>
                        <dd>{{ record.product.category }}</dd>
                    </div>
                    <div>
                        <dt>{{ t('batch.public.product_quantity') }}</dt>
                        <dd>{{ record.product.quantity }}</dd>
                    </div>
                    <div>
                        <dt>{{ t('batch.public.product_lot') }}</dt>
                        <dd>{{ record.product.lot }}</dd>
                    </div>
                </dl>
            </section>

            <section class="batch-public__section">
                <h2>{{ t('batch.public.section_origin') }}</h2>
                <dl class="batch-public__dl">
                    <div>
                        <dt>{{ t('batch.public.plot_country') }}</dt>
                        <dd>{{ record.plot.country }}</dd>
                    </div>
                    <div>
                        <dt>{{ t('batch.public.plot_region') }}</dt>
                        <dd>{{ record.plot.region }}</dd>
                    </div>
                    <div class="batch-public__dl-wide">
                        <dt>{{ t('batch.public.plot_geo') }}</dt>
                        <dd>{{ record.plot.geo }}</dd>
                    </div>
                    <div class="batch-public__dl-wide">
                        <dt>{{ t('batch.public.plot_harvest') }}</dt>
                        <dd>{{ record.harvestPeriod }}</dd>
                    </div>
                </dl>
            </section>

            <section class="batch-public__section">
                <h2>{{ t('batch.public.section_supply_chain') }}</h2>
                <div class="batch-public__table-wrap">
                    <div class="batch-public__chain-desktop">
                        <table class="batch-public__table">
                            <thead>
                                <tr>
                                    <th>{{ t('batch.public.chain_role') }}</th>
                                    <th>{{ t('batch.public.chain_participant') }}</th>
                                    <th>{{ t('batch.public.chain_country') }}</th>
                                    <th>{{ t('batch.public.chain_ref') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, idx) in record.supplierChain" :key="idx">
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
                                    >{{ t('batch.public.chain_role') }}:</span
                                >
                                {{ row.role }}
                            </p>
                            <p class="batch-public__chain-line">
                                <span class="batch-public__chain-label"
                                    >{{ t('batch.public.chain_participant') }}:</span
                                >
                                {{ row.name }}
                            </p>
                            <p class="batch-public__chain-line">
                                <span class="batch-public__chain-label"
                                    >{{ t('batch.public.chain_country') }}:</span
                                >
                                {{ row.country }}
                            </p>
                            <p class="batch-public__chain-line">
                                <span class="batch-public__chain-label"
                                    >{{ t('batch.public.chain_ref') }}:</span
                                >
                                {{ row.ref }}
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            <section class="batch-public__section">
                <h2>{{ t('batch.public.section_evidence') }}</h2>
                <p class="batch-public__lead">{{ record.statusDetail }}</p>
                <ul class="batch-public__evidence">
                    <li v-for="(ev, idx) in record.evidence" :key="idx">
                        <strong>{{ ev.label }}</strong>
                        <span class="batch-public__evidence-ref">{{ ev.ref }}</span>
                    </li>
                </ul>
            </section>

            <footer class="batch-public__footer">
                <div class="batch-public__meta">
                    <span>{{
                        t('batch.public.document_version', { version: record.documentVersion })
                    }}</span>
                    <span>{{ t('batch.public.generated_at', { date: record.generatedAt }) }}</span>
                </div>
                <p class="batch-public__disclaimer">{{ record.disclaimer }}</p>
                <p class="batch-public__url no-print">
                    {{ t('batch.public.public_link', { url: canonicalUrl }) }}
                </p>
            </footer>
        </article>
    </div>
</template>

<script setup>
import { computed, nextTick, watch } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { useI18n } from 'vue-i18n';
import { getBatchPublicRecord, buildBatchPublicUrl } from '@/features/demo/data/eudrBatchPublic';
import SeoHead from '@/components/SeoHead.vue';

defineOptions({
    name: 'BatchPublic',
});

const props = defineProps({
    seo: {
        type: Object,
        required: true,
    },
    batchId: {
        type: String,
        required: true,
    },
    print: {
        type: Boolean,
        default: false,
    },
});

const { t } = useI18n();
const page = usePage();
const batchId = computed(() => props.batchId);
const record = computed(() => getBatchPublicRecord(batchId.value));

const canonicalUrl = computed(() => buildBatchPublicUrl(batchId.value, page.props.locale ?? null));

const wantsAutoPrint = computed(() => props.print === true);

const runPrint = () => window.print();

const close = () => {
    window.close();
    if (!window.closed) {
        window.history.back();
    }
};

/**
 * Автопечать страницы при открытии из EUDR-модалки с `?print=1`.
 * Вызывается в watch'е, когда запись batch'а уже разрезолвлена и флаг auto-print активен.
 */
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

watch(
    () => [record.value?.id, props.print],
    () => runAutoPrint(),
    { flush: 'post', immediate: true },
);
</script>

<style scoped lang="scss">
@use '../../scss/variables' as *;

.batch-public {
    min-height: 100%;
    background: linear-gradient(180deg, rgba($bg-light-grey, 0.35) 0%, $bg-gray 40%);
    padding: $spacing-lg $spacing-md $spacing-2xl;
}

.batch-public__toolbar {
    max-width: 920px;
    margin: 0 auto $spacing-md;
    display: flex;
    align-items: center;
    justify-content: space-between;
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

    .batch-public__missing-title {
        margin: 0 0 $spacing-sm;
        font-size: $font-size-2xl;
    }

    .batch-public__missing-text {
        margin: 0 0 $spacing-lg;
        color: $text-dark-grey;
    }
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
