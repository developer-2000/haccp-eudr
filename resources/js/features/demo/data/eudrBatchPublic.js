/**
 * Публичные данные партии для страницы `/batch/:id` или `/{locale}/batch/:id` (демо, мок для инспекции).
 * Единый источник id / продукт / поставщик для демо EUDR и QR.
 */

const origin =
    typeof window !== "undefined" && window.location?.origin
        ? window.location.origin
        : "https://HACCPilot.eu";

const formatDateToRu = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
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
    if (locale && typeof locale === "string") {
        return `${origin}/${locale}/batch/${batchId}`;
    }
    return `${origin}/batch/${batchId}`;
};

function resolveDemoLocaleForBatchUrls() {
    if (typeof window === "undefined") {
        return "en";
    }
    const fromApp = document.getElementById("app")?.getAttribute("data-locale");
    if (typeof fromApp === "string" && fromApp.length) {
        return fromApp.toLowerCase();
    }
    if (typeof window.locale === "string" && window.locale.length) {
        return window.locale;
    }
    return "en";
}

/**
 * Короткие подписи для таблицы демо.
 * `listDate` — дата строки в UI и фильтр дневного отчёта `/report/YYYY-MM-DD` (все партии в одном массиве `batches`).
 */
const DEMO_LIST_META = {
    AB123: {
        productShort: "Мясо",
        listDate: "21.03.2026",
        supplierShort: "Forest Meats",
    },
    CF762: {
        productShort: "Кофе",
        listDate: "21.03.2026",
        supplierShort: "Roast Trade",
    },
    BR041: {
        productShort: "Мука",
        listDate: "21.03.2026",
        supplierShort: "Bread Supply",
    },
};

/** Полная запись для страницы раскрытия (EUDR-style demo). */
export const EUDR_BATCH_PUBLIC = {
    AB123: {
        id: "AB123",
        ddsReference: "EU-EUDR-DDS-2026-AB123-01",
        status: "ok",
        statusLabel: "Satisfactory",
        statusDetail:
            "Due diligence information is complete for the purposes of this demo disclosure. No deforestation risk flags at default assessment tier.",
        operator: {
            name: "Piotr Bakery Sp. z o.o.",
            address: "ul. Przykładowa 12, 00-001 Warszawa, Poland",
            role: "EU operator placing on the market (trader)",
            eori: "PL1234567890000",
        },
        product: {
            name: "Fresh beef trimmings (chilled)",
            cnCode: "0201 30 00",
            category: "Cattle meat",
            quantity: "1 240 kg net",
            lot: "AB123-L1",
        },
        plot: {
            country: "Brazil",
            region: "Mato Grosso (illustrative)",
            geo: "Polygon reference: BR-MT-DEMO-01 (mock coordinates on file)",
        },
        harvestPeriod: "01.2025 – 02.2026 (production window covered by DDS)",
        supplierChain: [
            {
                role: "Producer / establishment",
                name: "Forest Meats S.A.",
                country: "Brazil",
                ref: "FM-BR-7788",
            },
            {
                role: "Exporter",
                name: "South Trade Logistics Ltd",
                country: "Brazil",
                ref: "STL-BR-221",
            },
            {
                role: "Importer (EU)",
                name: "Nordic Cold Chain AB",
                country: "Sweden",
                ref: "NCC-SE-09",
            },
            {
                role: "Operator (EU)",
                name: "Piotr Bakery Sp. z o.o.",
                country: "Poland",
                ref: "PB-PL-01",
            },
        ],
        evidence: [
            { label: "Supplier declarations", ref: "DECL-AB123-2026-03" },
            { label: "Traceability / mass balance", ref: "TB-AB123-2026-02" },
            { label: "Risk assessment (simplified)", ref: "RA-AB123-2026-01" },
        ],
        generatedAt: "21.03.2026",
        documentVersion: "1.0",
        disclaimer:
            "Demonstration document for product presentation only. Not a legally binding EU DDS submission. Replace with your regulatory workflow and official references.",
    },
    CF762: {
        id: "CF762",
        ddsReference: "EU-EUDR-DDS-2026-CF762-PEND",
        status: "review",
        statusLabel: "Verification",
        statusDetail:
            "Due diligence dataset is under verification: additional geolocation evidence requested from upstream supplier. Placement on the EU market should follow your internal release procedure.",
        operator: {
            name: "Roast Trade Europe B.V.",
            address: "Keizersgracht 100, 1015 CW Amsterdam, Netherlands",
            role: "EU operator (trader)",
            eori: "NL9876543210001",
        },
        product: {
            name: "Green coffee beans (Arabica)",
            cnCode: "0901 11 00",
            category: "Coffee",
            quantity: "19 500 kg net",
            lot: "CF762-R5",
        },
        plot: {
            country: "Colombia",
            region: "Huila (illustrative)",
            geo: "Plot bundle pending verification — ref: CO-HUILA-DEMO-PEND",
        },
        harvestPeriod: "Crop 2025/2026 (coverage subject to verification)",
        supplierChain: [
            {
                role: "Cooperative",
                name: "Roast Trade Origins SAS",
                country: "Colombia",
                ref: "RTO-CO-441",
            },
            {
                role: "Exporter",
                name: "Pacific Green Coffee Export",
                country: "Colombia",
                ref: "PGCE-CO-12",
            },
            {
                role: "Operator (EU)",
                name: "Roast Trade Europe B.V.",
                country: "Netherlands",
                ref: "RTE-NL-02",
            },
        ],
        evidence: [
            {
                label: "Initial supplier declaration",
                ref: "DECL-CF762-2026-01",
            },
            { label: "Verification queue", ref: "VQ-CF762-OPEN" },
        ],
        generatedAt: "15.03.2026",
        documentVersion: "0.9 (draft)",
        disclaimer:
            "Demonstration document for product presentation only. Not a legally binding EU DDS submission.",
    },
    BR041: {
        id: "BR041",
        ddsReference: "EU-EUDR-DDS-2026-BR041-01",
        status: "ok",
        statusLabel: "Satisfactory",
        statusDetail:
            "Due diligence information is complete for the purposes of this demo disclosure. Default risk assessment: low (cereals / flour supply chain).",
        operator: {
            name: "Piotr Bakery Sp. z o.o.",
            address: "ul. Przykładowa 12, 00-001 Warszawa, Poland",
            role: "EU operator (non-SME trader)",
            eori: "PL1234567890000",
        },
        product: {
            name: "Wheat flour (type 550)",
            cnCode: "1101 00 15",
            category: "Cereals / flour",
            quantity: "12 000 kg net",
            lot: "BR041-F9",
        },
        plot: {
            country: "Poland",
            region: "Wielkopolska (illustrative)",
            geo: "Farm cluster reference: PL-WP-DEMO-44 (aggregated)",
        },
        harvestPeriod: "Harvest 2025 (covered by supplier declarations)",
        supplierChain: [
            {
                role: "Miller",
                name: "Bread Supply Sp. z o.o.",
                country: "Poland",
                ref: "BS-PL-303",
            },
            {
                role: "Operator (EU)",
                name: "Piotr Bakery Sp. z o.o.",
                country: "Poland",
                ref: "PB-PL-01",
            },
        ],
        evidence: [
            { label: "Supplier declarations", ref: "DECL-BR041-2026-01" },
            { label: "Mass balance", ref: "MB-BR041-2026-01" },
        ],
        generatedAt: "15.03.2026",
        documentVersion: "1.0",
        disclaimer:
            "Demonstration document for product presentation only. Not a legally binding EU DDS submission.",
    },
};

/** @param {string} batchId */
export const getBatchPublicRecord = (batchId) => {
    if (!batchId || typeof batchId !== "string") {
        return null;
    }
    const row = EUDR_BATCH_PUBLIC[batchId] ?? null;
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
    Object.keys(EUDR_BATCH_PUBLIC).map((id) => {
        const r = EUDR_BATCH_PUBLIC[id];
        const meta = DEMO_LIST_META[id] ?? {};
        const loc = resolveDemoLocaleForBatchUrls();
        return {
            id: r.id,
            product: meta.productShort ?? r.product.name.split("(")[0].trim(),
            supplier: meta.supplierShort ?? r.supplierChain[0]?.name ?? "—",
            date: getTodayDateRu(),
            status: r.status,
            statusLabel: r.statusLabel,
            url: buildBatchPublicUrl(id, loc),
        };
    });
