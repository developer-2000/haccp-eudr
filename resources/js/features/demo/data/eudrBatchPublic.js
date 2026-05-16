/**
 * Публичные данные партии для страницы `/batch/:id` или `/{locale}/batch/:id` (демо, мок для инспекции).
 * Единый источник id / продукт / поставщик для демо EUDR и QR.
 */

import { i18n } from '@/i18n';
const tt = (...args) => i18n.global.t(...args);

const origin =
    typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : 'https://haccpilot.eu';

const formatDateToRu = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

const getTodayDateRu = () => formatDateToRu(new Date());

/**
 * Абсолютный URL публичной карточки партии (для QR и ссылок).
 *
 * @param {string} batchId
 * @param {string | null | undefined} [locale] — если задан, путь `/{locale}/batch/{id}`; иначе `/batch/{id}` (старые QR без префикса).
 * @returns {string}
 */
export const buildBatchPublicUrl = (batchId, locale = null) => {
    if (!batchId) {
        return origin;
    }
    if (locale && typeof locale === 'string') {
        return `${origin}/${locale}/batch/${batchId}`;
    }
    return `${origin}/batch/${batchId}`;
};

function resolveDemoLocaleForBatchUrls() {
    if (typeof window === 'undefined') {
        return 'en';
    }
    const fromApp = document.getElementById('app')?.getAttribute('data-locale');
    if (typeof fromApp === 'string' && fromApp.length) {
        return fromApp.toLowerCase();
    }
    if (typeof window.locale === 'string' && window.locale.length) {
        return window.locale;
    }
    return 'en';
}

/**
 * Короткие подписи для таблицы демо.
 * `listDate` — дата строки в UI и фильтр дневного отчёта `/report/YYYY-MM-DD` (все партии в одном массиве `batches`).
 */
const DEMO_LIST_META = {
    AB123: {
        productShort: tt('demo.batch_products.meat'),
        listDate: '21.03.2026',
        supplierShort: 'Forest Meats',
    },
    CF762: {
        productShort: tt('demo.batch_products.coffee'),
        listDate: '21.03.2026',
        supplierShort: 'Roast Trade',
    },
    BR041: {
        productShort: tt('demo.batch_products.flour'),
        listDate: '21.03.2026',
        supplierShort: 'Bread Supply',
    },
};

/**
 * Возвращает локализованную запись партии EUDR.
 * Все user-facing строки берутся из переводов, технические идентификаторы — статичные.
 */
function buildBatchRecord(id) {
    const builders = {
        AB123: () => ({
            id: 'AB123',
            ddsReference: 'EU-EUDR-DDS-2026-AB123-01',
            status: 'ok',
            statusLabel: tt('batch.status_labels.satisfactory'),
            statusDetail: tt('batch.records.AB123.status_detail'),
            operator: {
                name: tt('batch.records.AB123.operator_name'),
                address: tt('batch.records.AB123.operator_address'),
                role: tt('batch.records.AB123.operator_role'),
                eori: 'PL1234567890000',
            },
            product: {
                name: tt('batch.records.AB123.product_name'),
                cnCode: '0201 30 00',
                category: tt('batch.records.AB123.product_category'),
                quantity: tt('batch.records.AB123.product_quantity'),
                lot: 'AB123-L1',
            },
            plot: {
                country: tt('batch.records.AB123.plot_country'),
                region: tt('batch.records.AB123.plot_region'),
                geo: tt('batch.records.AB123.plot_geo'),
            },
            harvestPeriod: tt('batch.records.AB123.harvest_period'),
            supplierChain: [
                {
                    role: tt('batch.roles.producer'),
                    name: tt('batch.records.AB123.chain_producer_name'),
                    country: tt('batch.records.AB123.chain_producer_country'),
                    ref: 'FM-BR-7788',
                },
                {
                    role: tt('batch.roles.exporter'),
                    name: tt('batch.records.AB123.chain_exporter_name'),
                    country: tt('batch.records.AB123.chain_exporter_country'),
                    ref: 'STL-BR-221',
                },
                {
                    role: tt('batch.roles.importer_eu'),
                    name: tt('batch.records.AB123.chain_importer_name'),
                    country: tt('batch.records.AB123.chain_importer_country'),
                    ref: 'NCC-SE-09',
                },
                {
                    role: tt('batch.roles.operator_eu'),
                    name: tt('batch.records.AB123.chain_operator_name'),
                    country: tt('batch.records.AB123.chain_operator_country'),
                    ref: 'PB-PL-01',
                },
            ],
            evidence: [
                {
                    label: tt('batch.evidence_labels.supplier_declarations'),
                    ref: 'DECL-AB123-2026-03',
                },
                { label: tt('batch.evidence_labels.traceability'), ref: 'TB-AB123-2026-02' },
                { label: tt('batch.evidence_labels.risk_assessment'), ref: 'RA-AB123-2026-01' },
            ],
            generatedAt: '21.03.2026',
            documentVersion: tt('batch.common.document_version_1'),
            disclaimer: tt('batch.common.disclaimer_full'),
        }),
        CF762: () => ({
            id: 'CF762',
            ddsReference: 'EU-EUDR-DDS-2026-CF762-PEND',
            status: 'review',
            statusLabel: tt('batch.status_labels.verification'),
            statusDetail: tt('batch.records.CF762.status_detail'),
            operator: {
                name: tt('batch.records.CF762.operator_name'),
                address: tt('batch.records.CF762.operator_address'),
                role: tt('batch.records.CF762.operator_role'),
                eori: 'NL9876543210001',
            },
            product: {
                name: tt('batch.records.CF762.product_name'),
                cnCode: '0901 11 00',
                category: tt('batch.records.CF762.product_category'),
                quantity: tt('batch.records.CF762.product_quantity'),
                lot: 'CF762-R5',
            },
            plot: {
                country: tt('batch.records.CF762.plot_country'),
                region: tt('batch.records.CF762.plot_region'),
                geo: tt('batch.records.CF762.plot_geo'),
            },
            harvestPeriod: tt('batch.records.CF762.harvest_period'),
            supplierChain: [
                {
                    role: tt('batch.roles.cooperative'),
                    name: tt('batch.records.CF762.chain_cooperative_name'),
                    country: tt('batch.records.CF762.chain_cooperative_country'),
                    ref: 'RTO-CO-441',
                },
                {
                    role: tt('batch.roles.exporter'),
                    name: tt('batch.records.CF762.chain_exporter_name'),
                    country: tt('batch.records.CF762.chain_exporter_country'),
                    ref: 'PGCE-CO-12',
                },
                {
                    role: tt('batch.roles.operator_eu'),
                    name: tt('batch.records.CF762.chain_operator_name'),
                    country: tt('batch.records.CF762.chain_operator_country'),
                    ref: 'RTE-NL-02',
                },
            ],
            evidence: [
                {
                    label: tt('batch.evidence_labels.initial_supplier_declaration'),
                    ref: 'DECL-CF762-2026-01',
                },
                { label: tt('batch.evidence_labels.verification_queue'), ref: 'VQ-CF762-OPEN' },
            ],
            generatedAt: '15.03.2026',
            documentVersion: tt('batch.common.document_version_draft'),
            disclaimer: tt('batch.common.disclaimer_short'),
        }),
        BR041: () => ({
            id: 'BR041',
            ddsReference: 'EU-EUDR-DDS-2026-BR041-01',
            status: 'ok',
            statusLabel: tt('batch.status_labels.satisfactory'),
            statusDetail: tt('batch.records.BR041.status_detail'),
            operator: {
                name: tt('batch.records.BR041.operator_name'),
                address: tt('batch.records.BR041.operator_address'),
                role: tt('batch.records.BR041.operator_role'),
                eori: 'PL1234567890000',
            },
            product: {
                name: tt('batch.records.BR041.product_name'),
                cnCode: '1101 00 15',
                category: tt('batch.records.BR041.product_category'),
                quantity: tt('batch.records.BR041.product_quantity'),
                lot: 'BR041-F9',
            },
            plot: {
                country: tt('batch.records.BR041.plot_country'),
                region: tt('batch.records.BR041.plot_region'),
                geo: tt('batch.records.BR041.plot_geo'),
            },
            harvestPeriod: tt('batch.records.BR041.harvest_period'),
            supplierChain: [
                {
                    role: tt('batch.roles.miller'),
                    name: tt('batch.records.BR041.chain_miller_name'),
                    country: tt('batch.records.BR041.chain_miller_country'),
                    ref: 'BS-PL-303',
                },
                {
                    role: tt('batch.roles.operator_eu'),
                    name: tt('batch.records.BR041.chain_operator_name'),
                    country: tt('batch.records.BR041.chain_operator_country'),
                    ref: 'PB-PL-01',
                },
            ],
            evidence: [
                {
                    label: tt('batch.evidence_labels.supplier_declarations'),
                    ref: 'DECL-BR041-2026-01',
                },
                { label: tt('batch.evidence_labels.mass_balance'), ref: 'MB-BR041-2026-01' },
            ],
            generatedAt: '15.03.2026',
            documentVersion: tt('batch.common.document_version_1'),
            disclaimer: tt('batch.common.disclaimer_short'),
        }),
    };
    return builders[id] ? builders[id]() : null;
}

/** Список ID партий для итерации в демо-данных. */
const BATCH_IDS = ['AB123', 'CF762', 'BR041'];

/** @param {string} batchId */
export const getBatchPublicRecord = (batchId) => {
    if (!batchId || typeof batchId !== 'string') {
        return null;
    }
    const row = buildBatchRecord(batchId);
    if (!row) {
        return null;
    }
    return {
        ...row,
        generatedAt: getTodayDateRu(),
    };
};

/**
 * Список партий для демо-состояния (id, короткие поля, url).
 */
export const buildDemoBatches = () =>
    BATCH_IDS.map((id) => {
        const r = buildBatchRecord(id);
        const meta = DEMO_LIST_META[id] ?? {};
        const loc = resolveDemoLocaleForBatchUrls();
        return {
            id: r.id,
            product: meta.productShort ?? r.product.name.split('(')[0].trim(),
            supplier: meta.supplierShort ?? r.supplierChain[0]?.name ?? '—',
            date: getTodayDateRu(),
            status: r.status,
            statusLabel: r.statusLabel,
            url: buildBatchPublicUrl(id, loc),
        };
    });
