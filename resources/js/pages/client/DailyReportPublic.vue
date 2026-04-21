<template>
    <div class="daily-report"
        :class="{ 'daily-report--pdf-open': wantsAutoPrint }"
    >
        <div class="daily-report__toolbar no-print">
            <n-button type="warning" size="large" @click="close">
                {{ t('demo.show_task_modal.close') }}
            </n-button>
            <button
                v-if="snapshot"
                type="button"
                class="daily-report__print btn-client btn-outline-primary"
                @click="print"
            >
                {{ t('report.public.print_pdf') }}
            </button>
        </div>

        <div v-if="!snapshot" class="daily-report__missing container">
            <h1 class="daily-report__missing-title">
                {{ t('report.public.invalid_title') }}
            </h1>
            <p class="daily-report__missing-text">
                {{ t('report.public.invalid_text', { date: reportReferenceIso }) }}
            </p>

            <n-button type="warning" size="large" class="elem-right" @click="close">
                {{ t('demo.show_task_modal.close') }}
            </n-button>
        </div>

        <article v-else class="daily-report__paper">
            <header class="daily-report__head">
                <div class="daily-report__eu-band" aria-hidden="true" />
                <p class="daily-report__kicker">
                    {{ t('report.public.kicker') }}
                </p>
                <h1 class="daily-report__title">
                    {{ t('report.public.title') }}
                </h1>
                <p class="daily-report__sub">
                    {{ t('report.public.subtitle') }}
                </p>
                <div class="daily-report__refs">
                    <div>
                        <span class="daily-report__label">{{ t('report.public.report_reference') }}</span>
                        <strong>{{ snapshot.documentRef }}</strong>
                    </div>
                    <div>
                        <span class="daily-report__label">{{ t('report.public.calendar_date_utc') }}</span>
                        <strong>{{ snapshot.dateIso }}</strong>
                    </div>
                    <div>
                        <span class="daily-report__label">{{ t('report.public.localized') }}</span>
                        <strong>{{ snapshot.dateLongRu }}</strong>
                    </div>
                </div>
            </header>

            <section class="daily-report__section">
                <h2>{{ t('report.public.section_establishment') }}</h2>
                <dl class="daily-report__dl">
                    <div>
                        <dt>{{ t('report.public.legal_name') }}</dt>
                        <dd>{{ snapshot.establishment.legalName }}</dd>
                    </div>
                    <div>
                        <dt>{{ t('report.public.registered_address') }}</dt>
                        <dd>{{ snapshot.establishment.address }}</dd>
                    </div>
                    <div>
                        <dt>{{ t('report.public.eori_eu') }}</dt>
                        <dd>{{ snapshot.establishment.eori }}</dd>
                    </div>
                    <div>
                        <dt>{{ t('report.public.fda_note') }}</dt>
                        <dd>{{ snapshot.establishment.fdaRegistration }}</dd>
                    </div>
                    <div>
                        <dt>{{ t('report.public.competent_authority') }}</dt>
                        <dd>
                            {{ snapshot.establishment.competentAuthorityEu }}
                        </dd>
                    </div>
                    <div>
                        <dt>{{ t('report.public.operating_name') }}</dt>
                        <dd>{{ snapshot.companyShort }}</dd>
                    </div>
                </dl>
            </section>

            <section
                v-if="!snapshot.hasFullRecord"
                class="daily-report__section daily-report__section--muted"
            >
                <h2>{{ t('report.public.section_no_records') }}</h2>
                <p class="daily-report__lead">
                    {{ t('report.public.no_records_text') }}
                </p>
            </section>

            <template v-else>
                <section class="daily-report__section">
                    <h2>
                        {{ t('report.public.section_scope') }}
                    </h2>
                    <p class="daily-report__lead">
                        {{ t('report.public.scope_lead') }}
                    </p>
                    <div class="daily-report__summary">
                        <div class="daily-report__summary-item">
                            <span class="daily-report__label">{{ t('report.public.total_ccp_tasks') }}</span>
                            <strong>{{ snapshot.totalCcpTasks }}</strong>
                        </div>
                        <div class="daily-report__summary-item">
                            <span class="daily-report__label">{{ t('report.public.reporting_date') }}</span>
                            <strong>{{ snapshot.inspectionDateLabel }}</strong>
                        </div>
                    </div>
                    <div
                        class="daily-report__table-wrap daily-report__table-wrap--mt"
                    >
                        <p class="daily-report__register-caption-mobile">
                            {{ t('report.public.register_caption') }}
                        </p>
                        <div class="daily-report__register-desktop">
                            <table
                                class="daily-report__table daily-report__table--compact"
                            >
                                <caption class="daily-report__caption">
                                    {{ t('report.public.register_caption') }}
                                </caption>
                                <thead>
                                    <tr>
                                        <th scope="col">{{ t('report.public.col_process') }}</th>
                                        <th scope="col">{{ t('report.public.col_control_point') }}</th>
                                        <th scope="col">
                                            {{ t('report.public.col_recorded_value') }}
                                        </th>
                                        <th scope="col">{{ t('report.public.col_assignee') }}</th>
                                        <th scope="col">{{ t('report.public.col_status') }}</th>
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
                                    <span class="daily-report__register-label">{{ t('report.public.col_process') }}:</span>
                                    {{ row.niche }}
                                </p>
                                <p class="daily-report__register-line">
                                    <span class="daily-report__register-label">{{ t('report.public.col_control_point') }}:</span>
                                    {{ row.ccp }}
                                </p>
                                <p class="daily-report__register-line">
                                    <span class="daily-report__register-label">{{ t('report.public.col_recorded_value') }}:</span>
                                    {{ row.detail }}
                                </p>
                                <p class="daily-report__register-line">
                                    <span class="daily-report__register-label">{{ t('report.public.col_assignee') }}:</span>
                                    {{ row.assigneeName }}
                                </p>
                                <p
                                    class="daily-report__register-line daily-report__register-line--status"
                                >
                                    <span class="daily-report__register-label">{{ t('report.public.col_status') }}:</span>
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
                        {{ t('report.public.haccp_section_title', { label: section.nicheLabel }) }}
                    </h2>
                    <p class="daily-report__lead">
                        {{ t('report.public.haccp_section_lead') }}
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
                                <dt>{{ t('report.public.control_point_id') }}</dt>
                                <dd>
                                    <code class="daily-report__code">
                                        {{task.id}}
                                    </code>
                                </dd>
                            </div>
                            <div>
                                <dt>{{ t('report.public.last_recorded') }}</dt>
                                <dd>{{ task.value }}</dd>
                            </div>
                            <div>
                                <dt>{{ t('report.public.person_responsible_demo') }}</dt>
                                <dd>{{ task.assigneeName }}</dd>
                            </div>
                        </dl>

                        <div
                            v-if="task.measurements && task.measurements.length"
                            class="daily-report__subblock"
                        >
                            <h4 class="daily-report__h4">
                                {{ t('report.public.time_stamped_verification') }}
                            </h4>
                            <div
                                class="daily-report__table-wrap daily-report__table-wrap--meas"
                            >
                                <div class="daily-report__meas-desktop">
                                    <table class="daily-report__table">
                                        <thead>
                                            <tr>
                                                <th scope="col">{{ t('report.public.col_time') }}</th>
                                                <th scope="col">
                                                    {{ t('report.public.col_observed_value') }}
                                                </th>
                                                <th scope="col">{{ t('report.public.col_result') }}</th>
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
                                            <span class="daily-report__meas-label">{{ t('report.public.col_time') }}:</span>
                                            {{ m.time }}
                                        </p>
                                        <p class="daily-report__meas-line">
                                            <span class="daily-report__meas-label">{{ t('report.public.col_observed_value') }}:</span>
                                            {{ m.value }}
                                        </p>
                                        <p
                                            class="daily-report__meas-line daily-report__meas-line--result"
                                        >
                                            <span class="daily-report__meas-label">{{ t('report.public.col_result') }}:</span>
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
                                {{ t('report.public.corrective_actions_title') }}
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
                        {{ t('report.public.section_eudr') }}
                    </h2>
                    <p class="daily-report__lead">
                        {{ t('report.public.eudr_lead') }}
                    </p>
                    <p
                        v-if="snapshot.supplyRows.length === 0"
                        class="daily-report__lead daily-report__lead--warn"
                    >
                        {{ t('report.public.no_eudr_intake') }}
                    </p>
                    <template v-else>
                        <div
                            class="daily-report__table-wrap daily-report__table-wrap--supply"
                        >
                            <div class="daily-report__supply-desktop">
                                <table class="daily-report__table">
                                    <thead>
                                        <tr>
                                            <th scope="col">{{ t('report.public.col_batch_id') }}</th>
                                            <th scope="col">{{ t('report.public.col_product_list') }}</th>
                                            <th scope="col">{{ t('report.public.col_status') }}</th>
                                            <th scope="col">
                                                {{ t('report.public.col_public_disclosure') }}
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
                                        <span class="daily-report__supply-label">{{ t('report.public.col_batch_id') }}:</span>
                                        <strong>{{ b.id }}</strong>
                                    </p>
                                    <p class="daily-report__supply-line">
                                        <span class="daily-report__supply-label">{{ t('report.public.col_product_list') }}:</span>
                                        {{ b.product }}
                                    </p>
                                    <p class="daily-report__supply-line">
                                        <span class="daily-report__supply-label">{{ t('report.public.col_status') }}:</span>
                                        {{ b.statusLabel }}
                                    </p>
                                    <p
                                        class="daily-report__supply-line daily-report__supply-line--url"
                                    >
                                        <span class="daily-report__supply-label">{{ t('report.public.col_public_disclosure') }}:</span>
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
                                {{ t('report.public.eudr_detail_title', { n: idx + 1, id: sd.listRow.id }) }}
                            </h3>
                            <template v-if="sd.eudr">
                                <dl
                                    class="daily-report__dl daily-report__dl--tight"
                                >
                                    <div>
                                        <dt>{{ t('report.public.dds_reference') }}</dt>
                                        <dd>{{ sd.eudr.ddsReference }}</dd>
                                    </div>
                                    <div>
                                        <dt>{{ t('report.public.eu_operator') }}</dt>
                                        <dd>
                                            {{ sd.eudr.operator.name }} —
                                            {{ sd.eudr.operator.address }}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt>{{ t('report.public.product') }}</dt>
                                        <dd>
                                            {{ sd.eudr.product.name }} (CN
                                            {{ sd.eudr.product.cnCode }}) —
                                            {{ sd.eudr.product.quantity }}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt>{{ t('report.public.assessment') }}</dt>
                                        <dd>{{ sd.eudr.statusDetail }}</dd>
                                    </div>
                                </dl>
                            </template>
                            <p v-else class="daily-report__lead">
                                {{ t('report.public.extended_record_missing') }}
                            </p>
                        </div>
                    </template>
                </section>

                <section
                    class="daily-report__section daily-report__section--muted"
                >
                    <h2>{{ t('report.public.section_integrity') }}</h2>
                    <ul class="daily-report__checklist">
                        <li>{{ t('report.public.integrity_item_1') }}</li>
                        <li>{{ t('report.public.integrity_item_2') }}</li>
                        <li>{{ t('report.public.integrity_item_3') }}</li>
                        <li>{{ t('report.public.integrity_item_4') }}</li>
                    </ul>
                </section>
            </template>

            <footer class="daily-report__footer">
                <div class="daily-report__meta">
                    <span>{{ t('report.public.demo_inspection_preview') }}</span>
                    <span>{{ t('report.public.inspection_date_label', { label: snapshot.inspectionDateLabel }) }}</span>
                    <span class="no-print">{{ t('report.public.generated_client', { time: generatedAtFormatted }) }}</span>
                </div>
                <p class="daily-report__disclaimer">
                    {{ snapshot.disclaimer }}
                </p>
                <p class="daily-report__url no-print">
                    {{ t('report.public.public_link', { url: canonicalUrl }) }}
                </p>
            </footer>
        </article>

        <button
            v-show="showToTop"
            type="button"
            class="daily-report__to-top no-print"
            aria-label="Scroll to top"
            @click="scrollTop"
        >
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 14l6-6 6 6"
                />
            </svg>
        </button>
    </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { NButton } from "naive-ui";
import {
    buildDailyReportPublicUrl,
    getDailyReportSnapshot,
    parseIsoDateSafe,
    REPORT_REFERENCE_ISO,
} from "@/features/demo/data/dailyReportPublic";
import { usePageSeo } from "@/composables/usePageSeo";

defineOptions({ name: "DailyReportPublic" });

const { t } = useI18n();
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

const reportSeoParams = computed(() => ({
    date: snapshot.value?.dateIso ?? dateParam.value,
    company: snapshot.value?.companyShort ?? "",
    points: snapshot.value?.totalCcpTasks ?? "",
}));
usePageSeo({ i18nKey: "seo.report_public", i18nParams: reportSeoParams });

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

const generatedAtFormatted = computed(() => {
    if (!snapshot.value) {
        return "";
    }
    const localeTag = localeForCanonical.value || "en";
    return new Intl.DateTimeFormat(localeTag, {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(snapshot.value.generatedAtUtcHint));
});

const wantsAutoPrint = computed(() => route.query.print === "1");

const print = () => window.print();

const close = () => {
    window.close();
    if (!window.closed) {
        window.history.back();
    }
};

const SCROLL_TOP_THRESHOLD = 1500;
const showToTop = ref(false);
let scrollContainer = null;

const getWindowScrollTop = () =>
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0;

const onScroll = () => {
    const containerTop = scrollContainer ? scrollContainer.scrollTop : 0;
    const windowTop = getWindowScrollTop();
    let height = Math.max(containerTop, windowTop)
    showToTop.value = height > SCROLL_TOP_THRESHOLD;
};

const scrollTop = () => {
    if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
};

onMounted(() => {
    scrollContainer = document.querySelector(".main-content");
    window.addEventListener("scroll", onScroll, { passive: true });
    if (scrollContainer) {
        scrollContainer.addEventListener("scroll", onScroll, { passive: true });
    }
    onScroll();
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", onScroll);
    if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", onScroll);
    }
    scrollContainer = null;
});

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
    position: relative;
}

.daily-report--pdf-open .daily-report__toolbar {
    display: none;
}

.daily-report__toolbar {
    max-width: 960px;
    margin: 0 auto $spacing-md;
    display: flex;
    align-items: center;
    justify-content: space-between;
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

.daily-report__to-top {
    position: fixed;
    right: $spacing-lg;
    bottom: $spacing-lg;
    width: 48px;
    height: 48px;
    padding: 0;
    border: none;
    border-radius: $radius-full;
    background: $accent-primary;
    color: $text-white;
    box-shadow: $shadow-md;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    transition:
        background-color $transition-fast,
        transform $transition-fast,
        box-shadow $transition-fast;

    svg {
        width: 22px;
        height: 22px;
    }

    &:hover,
    &:focus-visible {
        background: $accent-primary-dark;
        box-shadow: $shadow-sm-md;
        transform: translateY(-2px);
        outline: none;
    }

    &:active {
        transform: translateY(0);
    }
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

    .no-print {
        display: none !important;
    }
}
</style>
