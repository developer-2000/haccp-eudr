<template>
    <div
        class="daily-report"
        :class="{ 'daily-report--pdf-open': wantsAutoPrint }"
    >
        <div v-if="snapshot" class="daily-report__toolbar no-print">
            <button
                type="button"
                class="daily-report__print btn-client btn-outline-primary"
                @click="print"
            >
                Print / PDF
            </button>
        </div>

        <div v-if="!snapshot" class="daily-report__missing container">
            <h1 class="daily-report__missing-title">
                Invalid or unknown report date
            </h1>
            <p class="daily-report__missing-text">
                Use a valid calendar date in the URL (YYYY-MM-DD), e.g.
                <code>{{ reportReferenceIso }}</code> for the demo daily bundle.
            </p>
            <RouterLink
                class="btn-client btn-outline-primary"
                :to="fallbackDemoEudr"
                >EUDR demo</RouterLink
            >
        </div>

        <article v-else class="daily-report__paper">
            <header class="daily-report__head">
                <div class="daily-report__eu-band" aria-hidden="true" />
                <p class="daily-report__kicker">
                    EU Regulation (EU) 2023/1115 (EUDR) · FSMA-style
                    recordkeeping (illustrative) — demo disclosure
                </p>
                <h1 class="daily-report__title">
                    Daily HACCP monitoring &amp; supply intake summary
                </h1>
                <p class="daily-report__sub">
                    Single-day operational snapshot for inspector / third-party
                    review. Not a legal DDS or official FDA filing.
                </p>
                <div class="daily-report__refs">
                    <div>
                        <span class="daily-report__label"
                            >Report reference</span
                        >
                        <strong>{{ snapshot.documentRef }}</strong>
                    </div>
                    <div>
                        <span class="daily-report__label"
                            >Calendar date UTC</span
                        >
                        <strong>{{ snapshot.dateIso }}</strong>
                    </div>
                    <div>
                        <span class="daily-report__label">Localized</span>
                        <strong>{{ snapshot.dateLongRu }}</strong>
                    </div>
                </div>
            </header>

            <section class="daily-report__section">
                <h2>1. Establishment</h2>
                <dl class="daily-report__dl">
                    <div>
                        <dt>Legal name</dt>
                        <dd>{{ snapshot.establishment.legalName }}</dd>
                    </div>
                    <div>
                        <dt>Registered address</dt>
                        <dd>{{ snapshot.establishment.address }}</dd>
                    </div>
                    <div>
                        <dt>EORI (EU)</dt>
                        <dd>{{ snapshot.establishment.eori }}</dd>
                    </div>
                    <div>
                        <dt>U.S. FDA / FSMA note</dt>
                        <dd>{{ snapshot.establishment.fdaRegistration }}</dd>
                    </div>
                    <div>
                        <dt>EU competent authority (illustrative)</dt>
                        <dd>
                            {{ snapshot.establishment.competentAuthorityEu }}
                        </dd>
                    </div>
                    <div>
                        <dt>Operating name (demo)</dt>
                        <dd>{{ snapshot.companyShort }}</dd>
                    </div>
                </dl>
            </section>

            <section
                v-if="!snapshot.hasFullRecord"
                class="daily-report__section daily-report__section--muted"
            >
                <h2>2. Records for this date</h2>
                <p class="daily-report__lead">
                    The demo dataset does not include a full daily bundle for
                    this calendar day. In production, this page would list CCP
                    readings and any EUDR-linked intakes recorded for the
                    selected date only.
                </p>
            </section>

            <template v-else>
                <section class="daily-report__section">
                    <h2>
                        2. Scope &amp; inventory (HACCP monitoring — same
                        calendar day)
                    </h2>
                    <p class="daily-report__lead">
                        Complete register of all control points in the demo
                        dataset for the reporting date. Scheduled checks include
                        full time-stamped readings. Single-point checks show the
                        last recorded value.
                    </p>
                    <div class="daily-report__summary">
                        <div class="daily-report__summary-item">
                            <span class="daily-report__label"
                                >Total control points (all niches)</span
                            >
                            <strong>{{ snapshot.totalCcpTasks }}</strong>
                        </div>
                        <div class="daily-report__summary-item">
                            <span class="daily-report__label"
                                >Reporting date (label)</span
                            >
                            <strong>{{ snapshot.inspectionDateLabel }}</strong>
                        </div>
                    </div>
                    <div
                        class="daily-report__table-wrap daily-report__table-wrap--mt"
                    >
                        <p class="daily-report__register-caption-mobile">
                            Consolidated register (summary)
                        </p>
                        <div class="daily-report__register-desktop">
                            <table
                                class="daily-report__table daily-report__table--compact"
                            >
                                <caption class="daily-report__caption">
                                    Consolidated register (summary)
                                </caption>
                                <thead>
                                    <tr>
                                        <th scope="col">Process / niche</th>
                                        <th scope="col">Control point</th>
                                        <th scope="col">
                                            Recorded value / schedule
                                        </th>
                                        <th scope="col">Person responsible</th>
                                        <th scope="col">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="row in snapshot.ccpRows"
                                        :key="row.id"
                                    >
                                        <td>{{ row.niche }}</td>
                                        <td>{{ row.ccp }}</td>
                                        <td>{{ row.detail }}</td>
                                        <td>{{ row.assigneeName }}</td>
                                        <td>
                                            <span
                                                class="daily-report__pill"
                                                :class="`daily-report__pill--${row.statusPillKey}`"
                                            >
                                                {{ row.statusLabel }}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="daily-report__register-mobile">
                            <article
                                v-for="row in snapshot.ccpRows"
                                :key="row.id"
                                class="daily-report__register-card"
                            >
                                <p class="daily-report__register-line">
                                    <span class="daily-report__register-label"
                                        >Process / niche:</span
                                    >
                                    {{ row.niche }}
                                </p>
                                <p class="daily-report__register-line">
                                    <span class="daily-report__register-label"
                                        >Control point:</span
                                    >
                                    {{ row.ccp }}
                                </p>
                                <p class="daily-report__register-line">
                                    <span class="daily-report__register-label"
                                        >Recorded value / schedule:</span
                                    >
                                    {{ row.detail }}
                                </p>
                                <p class="daily-report__register-line">
                                    <span class="daily-report__register-label"
                                        >Person responsible:</span
                                    >
                                    {{ row.assigneeName }}
                                </p>
                                <p
                                    class="daily-report__register-line daily-report__register-line--status"
                                >
                                    <span class="daily-report__register-label"
                                        >Status:</span
                                    >
                                    <span
                                        class="daily-report__pill"
                                        :class="`daily-report__pill--${row.statusPillKey}`"
                                    >
                                        {{ row.statusLabel }}
                                    </span>
                                </p>
                            </article>
                        </div>
                    </div>
                </section>

                <section
                    v-for="section in snapshot.nicheSections"
                    :key="section.nicheKey"
                    class="daily-report__section daily-report__section--niche"
                >
                    <h2 class="daily-report__h2-niche">
                        3.{{
                            section.nicheKey === "coffee"
                                ? "A"
                                : section.nicheKey === "bakery"
                                  ? "B"
                                  : "C"
                        }}
                        HACCP — {{ section.nicheLabel }}
                    </h2>
                    <p class="daily-report__lead">
                        All tasks for this process area. Where verification is
                        scheduled (repeat), all time slots and outcomes are
                        listed; corrective action templates available to staff
                        are enumerated for audit traceability.
                    </p>

                    <div
                        v-for="task in section.tasks"
                        :key="task.id"
                        class="daily-report__task-block"
                    >
                        <div class="daily-report__task-head">
                            <h3 class="daily-report__task-title">
                                {{ task.title }}
                            </h3>
                            <span
                                class="daily-report__pill"
                                :class="`daily-report__pill--${task.statusPillKey}`"
                            >
                                {{ task.statusLabel }}
                            </span>
                        </div>
                        <dl class="daily-report__task-dl">
                            <div>
                                <dt>Control point ID (demo)</dt>
                                <dd>
                                    <code class="daily-report__code">{{
                                        task.id
                                    }}</code>
                                </dd>
                            </div>
                            <div>
                                <dt>Last recorded / scheduled parameter</dt>
                                <dd>{{ task.value }}</dd>
                            </div>
                            <div>
                                <dt>Person responsible (demo roster)</dt>
                                <dd>{{ task.assigneeName }}</dd>
                            </div>
                        </dl>

                        <div
                            v-if="task.measurements && task.measurements.length"
                            class="daily-report__subblock"
                        >
                            <h4 class="daily-report__h4">
                                Time-stamped verification (same operating day)
                            </h4>
                            <div
                                class="daily-report__table-wrap daily-report__table-wrap--meas"
                            >
                                <div class="daily-report__meas-desktop">
                                    <table class="daily-report__table">
                                        <thead>
                                            <tr>
                                                <th scope="col">Time</th>
                                                <th scope="col">
                                                    Observed value
                                                </th>
                                                <th scope="col">Result</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr
                                                v-for="(
                                                    m, idx
                                                ) in task.measurements"
                                                :key="idx"
                                            >
                                                <td>{{ m.time }}</td>
                                                <td>{{ m.value }}</td>
                                                <td>
                                                    <span
                                                        class="daily-report__pill daily-report__pill--sm"
                                                        :class="`daily-report__pill--${m.resultPillKey}`"
                                                    >
                                                        {{ m.resultLabel }}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="daily-report__meas-mobile">
                                    <article
                                        v-for="(m, idx) in task.measurements"
                                        :key="idx"
                                        class="daily-report__meas-card"
                                    >
                                        <p class="daily-report__meas-line">
                                            <span
                                                class="daily-report__meas-label"
                                                >Time:</span
                                            >
                                            {{ m.time }}
                                        </p>
                                        <p class="daily-report__meas-line">
                                            <span
                                                class="daily-report__meas-label"
                                                >Observed value:</span
                                            >
                                            {{ m.value }}
                                        </p>
                                        <p
                                            class="daily-report__meas-line daily-report__meas-line--result"
                                        >
                                            <span
                                                class="daily-report__meas-label"
                                                >Result:</span
                                            >
                                            <span
                                                class="daily-report__pill daily-report__pill--sm"
                                                :class="`daily-report__pill--${m.resultPillKey}`"
                                            >
                                                {{ m.resultLabel }}
                                            </span>
                                        </p>
                                    </article>
                                </div>
                            </div>
                        </div>

                        <div
                            v-if="
                                task.correctiveActions &&
                                task.correctiveActions.length
                            "
                            class="daily-report__subblock"
                        >
                            <h4 class="daily-report__h4">
                                Corrective action template library (available
                                responses)
                            </h4>
                            <ol class="daily-report__ol">
                                <li
                                    v-for="(
                                        line, idx
                                    ) in task.correctiveActions"
                                    :key="idx"
                                >
                                    {{ line }}
                                </li>
                            </ol>
                        </div>
                    </div>
                </section>

                <section class="daily-report__section">
                    <h2>
                        4. EUDR — deforestation regulation: consignments
                        recorded this calendar day
                    </h2>
                    <p class="daily-report__lead">
                        Intake is intermittent; when a consignment is booked,
                        the batch disclosure URL points to the regulatory-style
                        traceability page (not a supplier postal address).
                        Below: summary row plus DDS operator/product
                        cross-check.
                    </p>
                    <p
                        v-if="snapshot.supplyRows.length === 0"
                        class="daily-report__lead daily-report__lead--warn"
                    >
                        No EUDR-linked intake recorded for this date in the demo
                        dataset.
                    </p>
                    <template v-else>
                        <div
                            class="daily-report__table-wrap daily-report__table-wrap--supply"
                        >
                            <div class="daily-report__supply-desktop">
                                <table class="daily-report__table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Batch ID</th>
                                            <th scope="col">Product (list)</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">
                                                Public disclosure (URL)
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            v-for="b in snapshot.supplyRows"
                                            :key="b.id"
                                        >
                                            <td>
                                                <strong>{{ b.id }}</strong>
                                            </td>
                                            <td>{{ b.product }}</td>
                                            <td>{{ b.statusLabel }}</td>
                                            <td>
                                                <a
                                                    class="daily-report__a"
                                                    :href="b.url"
                                                    target="_blank"
                                                    rel="noopener"
                                                >
                                                    {{ b.url }}
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="daily-report__supply-mobile">
                                <article
                                    v-for="b in snapshot.supplyRows"
                                    :key="b.id"
                                    class="daily-report__supply-card"
                                >
                                    <p class="daily-report__supply-line">
                                        <span class="daily-report__supply-label"
                                            >Batch ID:</span
                                        >
                                        <strong>{{ b.id }}</strong>
                                    </p>
                                    <p class="daily-report__supply-line">
                                        <span class="daily-report__supply-label"
                                            >Product (list):</span
                                        >
                                        {{ b.product }}
                                    </p>
                                    <p class="daily-report__supply-line">
                                        <span class="daily-report__supply-label"
                                            >Status:</span
                                        >
                                        {{ b.statusLabel }}
                                    </p>
                                    <p
                                        class="daily-report__supply-line daily-report__supply-line--url"
                                    >
                                        <span class="daily-report__supply-label"
                                            >Public disclosure (URL):</span
                                        >
                                        <a
                                            class="daily-report__a"
                                            :href="b.url"
                                            target="_blank"
                                            rel="noopener"
                                        >
                                            {{ b.url }}
                                        </a>
                                    </p>
                                </article>
                            </div>
                        </div>

                        <div
                            v-for="(sd, idx) in snapshot.supplyDetails"
                            :key="sd.listRow.id"
                            class="daily-report__eudr-detail"
                        >
                            <h3 class="daily-report__h3-eudr">
                                4.{{ idx + 1 }} Batch {{ sd.listRow.id }} — due
                                diligence snapshot (demo)
                            </h3>
                            <template v-if="sd.eudr">
                                <dl
                                    class="daily-report__dl daily-report__dl--tight"
                                >
                                    <div>
                                        <dt>DDS reference</dt>
                                        <dd>{{ sd.eudr.ddsReference }}</dd>
                                    </div>
                                    <div>
                                        <dt>EU operator</dt>
                                        <dd>
                                            {{ sd.eudr.operator.name }} —
                                            {{ sd.eudr.operator.address }}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt>Product</dt>
                                        <dd>
                                            {{ sd.eudr.product.name }} (CN
                                            {{ sd.eudr.product.cnCode }}) —
                                            {{ sd.eudr.product.quantity }}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt>Assessment (demo narrative)</dt>
                                        <dd>{{ sd.eudr.statusDetail }}</dd>
                                    </div>
                                </dl>
                            </template>
                            <p v-else class="daily-report__lead">
                                Extended record not loaded for this batch id.
                            </p>
                        </div>
                    </template>
                </section>

                <section
                    class="daily-report__section daily-report__section--muted"
                >
                    <h2>5. Record integrity (inspection checklist)</h2>
                    <ul class="daily-report__checklist">
                        <li>
                            All HACCP control points for the day are enumerated
                            above with time logic for scheduled PRPs/CCPs.
                        </li>
                        <li>
                            Corrective action templates are versioned in-system;
                            selection is logged at task level in production.
                        </li>
                        <li>
                            EUDR rows reference batch disclosure pages suitable
                            for competent authority review (demo).
                        </li>
                        <li>
                            Print/PDF export from browser — suitable for
                            third-party audit dossier appendix.
                        </li>
                    </ul>
                </section>
            </template>

            <footer class="daily-report__footer">
                <div class="daily-report__meta">
                    <span>Demo inspection preview</span>
                    <span
                        >Dataset inspection date label:
                        {{ snapshot.inspectionDateLabel }}</span
                    >
                    <span class="no-print"
                        >Generated (client):
                        {{ snapshot.generatedAtUtcHint }}</span
                    >
                </div>
                <p class="daily-report__disclaimer">
                    {{ snapshot.disclaimer }}
                </p>
                <p class="daily-report__url no-print">
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
    buildDailyReportPublicUrl,
    getDailyReportSnapshot,
    parseIsoDateSafe,
    REPORT_REFERENCE_ISO,
} from "@/features/demo/data/dailyReportPublic";

defineOptions({ name: "DailyReportPublic" });

const route = useRoute();
const dateParam = computed(() => String(route.params.date ?? ""));
const reportReferenceIso = REPORT_REFERENCE_ISO;

const snapshot = computed(() => {
    const safe = parseIsoDateSafe(dateParam.value);
    if (!safe) {
        return null;
    }
    return getDailyReportSnapshot(safe);
});

const fallbackDemoEudr = "/en/demo/eudr";

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
    buildDailyReportPublicUrl(dateParam.value, localeForCanonical.value),
);

const wantsAutoPrint = computed(() => route.query.print === "1");

const print = () => window.print();

const runAutoPrint = () => {
    if (!snapshot.value || !wantsAutoPrint.value) {
        return;
    }
    nextTick(() => {
        requestAnimationFrame(() => {
            setTimeout(() => window.print(), 400);
        });
    });
};

const syncTitle = () => {
    if (snapshot.value) {
        document.title = `Daily report ${snapshot.value.dateIso} — HACCP + EUDR (demo)`;
    } else {
        document.title = "Report not found — demo";
    }
};

onMounted(syncTitle);
watch([snapshot, dateParam], syncTitle);

watch(
    () => [snapshot.value?.dateIso, route.query.print],
    () => runAutoPrint(),
    { flush: "post", immediate: true },
);
</script>

<style scoped lang="scss">
@use "../../../scss/variables" as *;

.daily-report {
    min-height: 100%;
    background: linear-gradient(
        180deg,
        rgba($bg-light-grey, 0.35) 0%,
        $bg-gray 40%
    );
    padding: $spacing-lg $spacing-md $spacing-2xl;
}

.daily-report--pdf-open .daily-report__toolbar {
    display: none;
}

.daily-report__toolbar {
    max-width: 960px;
    margin: 0 auto $spacing-md;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: $spacing-md;
    flex-wrap: wrap;
}

.daily-report__missing {
    max-width: 560px;
    margin: 0 auto;
    padding: $spacing-xl;
    background: $bg-style-white;
    border-radius: $radius-xl;
    border: 1px solid $text-light-grey;
}

.daily-report__missing-title {
    margin: 0 0 $spacing-sm;
    font-size: $font-size-2xl;
}

.daily-report__missing-text {
    margin: 0 0 $spacing-lg;
    color: $text-dark-grey;

    code {
        font-size: $font-size-sm;
    }
}

.daily-report__paper {
    max-width: 960px;
    margin: 0 auto;
    background: $bg-style-white;
    border: 1px solid $text-light-grey;
    border-radius: $radius-xxl;
    box-shadow: $shadow-md;
    padding: $spacing-xl $spacing-xl $spacing-lg;

    @media (max-width: 650px) {
        padding: $spacing-xl $spacing-md $spacing-lg;
    }
}

.daily-report__eu-band {
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

.daily-report__kicker {
    margin: 0 0 $spacing-xs;
    font-size: $font-size-xs;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: $text-dark-grey;
}

.daily-report__title {
    margin: 0 0 $spacing-sm;
    font-size: $font-size-2-25xl;
    line-height: 1.2;
    color: $text-color;
}

.daily-report__sub {
    margin: 0 0 $spacing-md;
    color: $text-dark-grey;
    font-size: $font-size-base-m;
    max-width: 52rem;
}

.daily-report__refs {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr);
    gap: $spacing-md;
    padding: $spacing-md;
    background: $bg-gray;
    border-radius: $radius-lg;
    border: 1px solid $text-light-grey;

    > div {
        min-width: 0;
    }

    @media (max-width: $breakpoint-md) {
        grid-template-columns: 1fr;
    }
}

.daily-report__label {
    display: block;
    font-size: $font-size-xs;
    color: $text-dark-grey;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 4px;
}

.daily-report__section {
    margin-top: $spacing-xl;

    h2 {
        margin: 0 0 $spacing-sm;
        font-size: $font-size-xl;
        color: $text-color;
    }

    &--muted {
        padding: $spacing-md;
        background: rgba($bg-light-grey, 0.45);
        border-radius: $radius-lg;
    }
}

.daily-report__lead {
    margin: 0 0 $spacing-md;
    color: $text-dark-grey;
    line-height: 1.55;
}

.daily-report__dl {
    margin: 0;
    display: grid;
    gap: $spacing-sm;
    background: $bg-gray;
    padding: 0 20px;

    div {
        display: grid;
        grid-template-columns: minmax(140px, 220px) 1fr;
        gap: $spacing-md;
        padding: $spacing-sm 0;
        border-bottom: 1px solid $border-color;

        @media (max-width: $breakpoint-sm) {
            grid-template-columns: 1fr;
        }
    }

    dt {
        font-size: $font-size-sm;
        color: $text-dark-grey;
        font-weight: 600;
    }

    dd {
        margin: 0;
        color: $text-color;
    }
}

.daily-report__summary {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-lg;
    padding: $spacing-md;
    background: rgba($accent-primary, 0.06);
    border: 1px solid rgba($accent-primary, 0.25);
    border-radius: $radius-lg;
}

.daily-report__summary-item {
    display: flex;
    flex-direction: column;
    gap: 4px;

    strong {
        font-size: $font-size-lg;
        color: $text-color;
    }
}

.daily-report__table-wrap--mt {
    margin-top: $spacing-md;
    background: #fbfbfb;
    padding: 10px 20px 0;
}

.daily-report__caption {
    caption-side: top;
    text-align: left;
    font-size: $font-size-xs;
    font-weight: 600;
    color: $text-dark-grey;
    padding-bottom: $spacing-sm;
}

.daily-report__table--compact {
    min-width: 560px;
}

.daily-report__register-caption-mobile {
    display: none;
}

.daily-report__register-desktop {
    display: block;
}

.daily-report__register-mobile {
    display: none;
    flex-direction: column;
    gap: $spacing-md;
}

.daily-report__register-card {
    border: 1px solid $text-light-grey;
    border-radius: $radius-lg;
    padding: $spacing-md;
    background: $bg-gray;
}

.daily-report__register-line {
    margin: 4px 0 0;
    font-size: $font-size-sm;
    word-break: break-word;

    &:first-child {
        margin-top: 0;
    }
}

.daily-report__register-label {
    color: $text-dark-grey;
    margin-right: 4px;
    font-weight: 500;
}

.daily-report__register-line--status {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $spacing-xs;
}

.daily-report__meas-desktop {
    display: block;
}

.daily-report__meas-mobile {
    display: none;
    flex-direction: column;
    gap: $spacing-md;
}

.daily-report__meas-card {
    border: 1px solid $text-light-grey;
    border-radius: $radius-lg;
    padding: $spacing-md;
    background: $bg-gray;
}

.daily-report__meas-line {
    margin: 4px 0 0;
    font-size: $font-size-sm;
    word-break: break-word;

    &:first-child {
        margin-top: 0;
    }
}

.daily-report__meas-label {
    color: $text-dark-grey;
    margin-right: 4px;
    font-weight: 500;
}

.daily-report__meas-line--result {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $spacing-xs;
}

.daily-report__supply-desktop {
    display: block;
}

.daily-report__supply-mobile {
    display: none;
    flex-direction: column;
    gap: $spacing-md;
}

.daily-report__supply-card {
    border: 1px solid $text-light-grey;
    border-radius: $radius-lg;
    padding: $spacing-md;
    background: $bg-gray;
}

.daily-report__supply-line {
    margin: 4px 0 0;
    font-size: $font-size-sm;
    word-break: break-word;

    &:first-child {
        margin-top: 0;
    }
}

.daily-report__supply-label {
    color: $text-dark-grey;
    margin-right: 4px;
    font-weight: 500;
}

.daily-report__supply-line--url {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;

    .daily-report__a {
        word-break: break-all;
    }
}

@media (max-width: $breakpoint-lg) {
    .daily-report__register-caption-mobile {
        display: block;
        margin: 0 0 $spacing-sm;
        font-size: $font-size-xs;
        font-weight: 600;
        color: $text-dark-grey;
    }

    .daily-report__table-wrap--mt {
        padding-bottom: $spacing-md;
    }

    .daily-report__register-desktop {
        display: none;
    }

    .daily-report__register-mobile {
        display: flex;
    }

    .daily-report__meas-desktop {
        display: none;
    }

    .daily-report__meas-mobile {
        display: flex;
    }

    .daily-report__supply-desktop {
        display: none;
    }

    .daily-report__supply-mobile {
        display: flex;
    }
}

.daily-report__section--niche {
    padding-left: $spacing-md;
    border-left: 4px solid $accent-primary;
}

.daily-report__h2-niche {
    font-size: $font-size-xl;
    margin: 0 0 $spacing-sm;
}

.daily-report__task-block {
    margin-top: $spacing-lg;
    padding: $spacing-md;
    border: 1px solid $border-color;
    border-radius: $radius-lg;
    background: rgba($bg-gray, 0.5);
}

.daily-report__task-head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: $spacing-sm;
    margin-bottom: $spacing-sm;
}

.daily-report__task-title {
    margin: 0;
    font-size: $font-size-lg;
    color: $text-color;
}

.daily-report__task-dl {
    margin: 0;
    display: grid;
    gap: $spacing-xs;

    div {
        display: grid;
        grid-template-columns: minmax(160px, 220px) 1fr;
        gap: $spacing-sm;
        padding: $spacing-xs 0;
        border-bottom: 1px dashed $text-light-grey;
    }

    dt {
        font-size: $font-size-xs;
        color: $text-dark-grey;
        font-weight: 600;
    }

    dd {
        margin: 0;
        font-size: $font-size-sm;
    }
}

.daily-report__code {
    font-size: $font-size-sm;
    background: $bg-gray;
    padding: 2px 6px;
    border-radius: $radius-sm;
}

.daily-report__subblock {
    margin-top: $spacing-md;
}

.daily-report__h4 {
    margin: 0 0 $spacing-sm;
    font-size: $font-size-sm;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: $text-dark-grey;
}

.daily-report__h3-eudr {
    margin: $spacing-lg 0 $spacing-sm;
    font-size: $font-size-lg;
    color: $text-color;
}

.daily-report__ol {
    margin: 0;
    padding-left: 1.25rem;
    color: $text-color;
    font-size: $font-size-sm;
    line-height: 1.5;

    li {
        margin-bottom: $spacing-xs;
    }
}

.daily-report__eudr-detail {
    margin-top: $spacing-lg;
    padding: $spacing-md;
    border-radius: $radius-lg;
    border: 1px solid $text-light-grey;
    background: $bg-style-white;
}

.daily-report__dl--tight div {
    padding: $spacing-xs 0;
}

.daily-report__checklist {
    margin: 0;
    padding-left: 1.25rem;
    color: $text-color;
    line-height: 1.55;
    font-size: $font-size-sm;

    li {
        margin-bottom: $spacing-sm;
    }
}

.daily-report__lead--warn {
    border-left: 3px solid $accent-primary;
    padding-left: $spacing-sm;
}

.daily-report__pill--sm {
    font-size: 10px;
    padding: 1px 6px;
}

.daily-report__table-wrap {
    overflow-x: auto;
}

.daily-report__table {
    width: 100%;
    border-collapse: collapse;
    min-width: 640px;
    font-size: $font-size-sm;

    th,
    td {
        text-align: left;
        padding: $spacing-sm $spacing-sm;
        border-bottom: 1px solid $text-light-grey;
        vertical-align: top;
    }

    th {
        font-weight: 600;
        color: $text-dark-grey;
        background: rgba($bg-gray, 0.85);
    }
}

.daily-report__pill {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: $radius-md;
    font-size: $font-size-xs;
    font-weight: 600;
    background: $bg-yellow-2;
    color: $text-color;
}

.daily-report__pill--ok,
.daily-report__pill--success {
    background: rgba($accent-success, 0.15);
    color: $accent-success-dark;
}

.daily-report__pill--problem {
    background: rgba($text-red, 0.1);
    color: $text-red;
}

.daily-report__pill--repeat {
    background: rgba($accent-primary, 0.1);
    color: $accent-primary-dark;
}

.daily-report__pill--pending {
    background: rgba($text-light-grey, 0.35);
    color: $text-dark-grey;
}

.daily-report__a {
    color: $accent-primary;
    word-break: break-all;
}

.daily-report__footer {
    margin-top: $spacing-xl;
    padding-top: $spacing-md;
    border-top: 1px solid $text-light-grey;
}

.daily-report__meta {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-md;
    font-size: $font-size-xs;
    color: $text-dark-grey;
    margin-bottom: $spacing-sm;
}

.daily-report__disclaimer {
    margin: 0;
    font-size: $font-size-xs;
    color: $text-dark-grey;
    line-height: 1.5;
}

.daily-report__url {
    margin: $spacing-sm 0 0;
    font-size: $font-size-xs;
    word-break: break-all;
    color: $text-dark-grey;
}

@media print {
    .daily-report {
        background: #fff;
        padding: 0;
    }

    .daily-report__paper {
        box-shadow: none;
        border: none;
        max-width: none;
    }
}
</style>
