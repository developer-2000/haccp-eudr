<template>
    <div class="reports-section">
        <div class="reports-public-link">
            <h3>{{ t('demo.reports.public_report') }}</h3>
            <div class="reports-public-link__row">
                <code class="reports-public-link__url">
                    <span class="reports-public-link__url-text">{{
                        publicReportUrl
                    }}</span>
                </code>
                <div class="reports-public-link__actions">
                    <n-button
                        type="success"
                        size="large"
                        @click="handleCopyLink"
                    >
                        {{ t('demo.reports.copy') }}
                    </n-button>
                    <n-button
                        type="info"
                        size="large"
                        @click="goToPublicReport"
                    >
                        {{ t('demo.reports.go_to') }}
                    </n-button>
                </div>
            </div>
        </div>

        <div class="report-preview">
            <h2>{{ t('demo.reports.daily_report') }}</h2>

            <h3 class="report-preview__category">{{ t('demo.reports.tasks') }}</h3>
            <div class="report-preview__desktop">
                <div class="report-preview__table-wrap">
                    <table class="report-preview__table">
                        <thead>
                            <tr>
                                <th>{{ t('demo.reports.col_date') }}</th>
                                <th>{{ t('demo.reports.col_point') }}</th>
                                <th>{{ t('demo.reports.col_value') }}</th>
                                <th>{{ t('demo.reports.col_assignee') }}</th>
                                <th>{{ t('demo.reports.col_photo') }}</th>
                                <th>{{ t('demo.reports.col_status') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in taskPreviewRows" :key="row.id">
                                <td>{{ row.date }}</td>
                                <td>{{ row.point }}</td>
                                <td>{{ row.value }}</td>
                                <td>{{ row.assignee }}</td>
                                <td>{{ row.photo }}</td>
                                <td>
                                    <span
                                        class="report-status"
                                        :class="`report-status--${row.statusKey}`"
                                    >
                                        {{ row.statusLabel }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="report-preview__mobile">
                <article
                    v-for="row in taskPreviewRows"
                    :key="row.id"
                    class="report-preview-card"
                >
                    <p class="report-preview-card__line">
                        <span class="report-preview-card__label">{{ t('demo.reports.col_date') }}:</span>
                        {{ row.date }}
                    </p>
                    <p class="report-preview-card__line">
                        <span class="report-preview-card__label">{{ t('demo.reports.col_point') }}:</span>
                        {{ row.point }}
                    </p>
                    <p class="report-preview-card__line">
                        <span class="report-preview-card__label">{{ t('demo.reports.col_value') }}:</span>
                        {{ row.value }}
                    </p>
                    <p class="report-preview-card__line">
                        <span class="report-preview-card__label">{{ t('demo.reports.col_assignee') }}:</span>
                        {{ row.assignee }}
                    </p>
                    <p class="report-preview-card__line">
                        <span class="report-preview-card__label">{{ t('demo.reports.col_photo') }}:</span>
                        {{ row.photo }}
                    </p>
                    <p
                        class="report-preview-card__line report-preview-card__line--status"
                    >
                        <span class="report-preview-card__label">{{ t('demo.reports.col_status') }}:</span>
                        <span
                            class="report-status"
                            :class="`report-status--${row.statusKey}`"
                        >
                            {{ row.statusLabel }}
                        </span>
                    </p>
                </article>
            </div>

            <h3 class="report-preview__category">{{ t('demo.reports.raw_materials') }}</h3>
            <div class="report-preview__desktop">
                <div class="report-preview__table-wrap">
                    <table class="report-preview__table">
                        <thead>
                            <tr>
                                <th>{{ t('demo.reports.col_date') }}</th>
                                <th>{{ t('demo.reports.col_point') }}</th>
                                <th>{{ t('demo.reports.col_value') }}</th>
                                <th>{{ t('demo.reports.col_photo') }}</th>
                                <th>{{ t('demo.reports.col_status') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in batchPreviewRows" :key="row.id">
                                <td>{{ row.date }}</td>
                                <td>{{ row.point }}</td>
                                <td>{{ row.value }}</td>
                                <td>{{ row.photo }}</td>
                                <td>
                                    <span
                                        class="report-status"
                                        :class="`report-status--${row.statusKey}`"
                                    >
                                        {{ row.statusLabel }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="report-preview__mobile">
                <article
                    v-for="row in batchPreviewRows"
                    :key="row.id"
                    class="report-preview-card"
                >
                    <p class="report-preview-card__line">
                        <span class="report-preview-card__label">{{ t('demo.reports.col_date') }}:</span>
                        {{ row.date }}
                    </p>
                    <p class="report-preview-card__line">
                        <span class="report-preview-card__label">{{ t('demo.reports.col_point') }}:</span>
                        {{ row.point }}
                    </p>
                    <p class="report-preview-card__line">
                        <span class="report-preview-card__label">{{ t('demo.reports.col_value') }}:</span>
                        {{ row.value }}
                    </p>
                    <p class="report-preview-card__line">
                        <span class="report-preview-card__label">{{ t('demo.reports.col_photo') }}:</span>
                        {{ row.photo }}
                    </p>
                    <p
                        class="report-preview-card__line report-preview-card__line--status"
                    >
                        <span class="report-preview-card__label">{{ t('demo.reports.col_status') }}:</span>
                        <span
                            class="report-status"
                            :class="`report-status--${row.statusKey}`"
                        >
                            {{ row.statusLabel }}
                        </span>
                    </p>
                </article>
            </div>
        </div>

        <div class="reports-footer-actions">
            <button
                type="button"
                class="btn-client btn-primary"
                @click="handleExportAction('pdf')"
            >
                {{ t('demo.reports.download_pdf') }}
            </button>
            <button
                type="button"
                class="btn-client btn-success"
                @click="handleExportAction('inspector')"
            >
                {{ t('demo.reports.to_inspector') }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useMessage } from "naive-ui";
import { useI18n } from "vue-i18n";
import { buildDailyReportPublicUrl } from "@/features/demo/data/dailyReportPublic";
import { taskDisplayStatusKey } from "@/features/demo/domain/checklistTaskModel";
import { resolveStaffFullName } from "@/features/demo/utils/demoStaff";

defineOptions({ name: "ReportsSection" });

const { t } = useI18n();
const message = useMessage();
const route = useRoute();

const reportPageLocale = computed(() => {
    const p = route.params.locale;
    if (typeof p === "string" && p.length) {
        return p;
    }
    if (typeof window !== "undefined" && typeof window.locale === "string") {
        return window.locale;
    }
    return "en";
});

const props = defineProps({
    report: {
        type: Object,
        required: true,
    },
    /** Все ниши и задачи — как в Checklists / Dashboard. */
    checklistsByNiche: {
        type: Object,
        required: true,
    },
    /** Партии EUDR — как в секции EUDR QR. */
    batches: {
        type: Array,
        required: true,
    },
    staff: {
        type: Array,
        default: () => [],
    },
});

const nicheLabel = (niche) => {
    const map = { coffee: 'niche_coffee', bakery: 'niche_bakery', meat: 'niche_meat' };
    return map[niche] ? t(`demo.reports.${map[niche]}`) : niche;
};

/** YYYY-MM-DD → DD.MM.YYYY */
function isoToRuDots(iso) {
    const [y, m, d] = String(iso).split("-");
    if (!y || !m || !d) {
        return "—";
    }
    return `${d.padStart(2, "0")}.${m}.${y}`;
}

function todayIso() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function formatTaskValue(task) {
    if (Array.isArray(task.measurements) && task.measurements.length) {
        const last = [...task.measurements]
            .reverse()
            .find((m) => m.status !== "pending");
        if (last) {
            return `${last.value} (${last.time})`;
        }
        const pend = task.measurements.find((m) => m.status === "pending");
        if (pend) {
            return `${pend.time} — ${pend.value}`;
        }
    }
    return "—";
}

function taskPhotoLabel(task) {
    if (Array.isArray(task.measurements) && task.measurements.length) {
        return t('demo.reports.photo_yes');
    }
    return "—";
}

function taskStatusRow(task) {
    if (Array.isArray(task.measurements) && task.measurements.length > 0) {
        const hasPending = task.measurements.some(
            (m) => m.status === "pending",
        );
        if (hasPending) {
            return { label: t('demo.reports.status_pending'), key: "review" };
        }
        return { label: t('demo.reports.status_success'), key: "ok" };
    }
    if (taskDisplayStatusKey(task) === "problem") {
        return { label: t('demo.reports.status_deviation'), key: "problem" };
    }
    return { label: t('demo.reports.status_ok'), key: "ok" };
}

const taskPreviewRows = computed(() => {
    const dayLabel = isoToRuDots(props.report.reportDayIso ?? todayIso());
    const rows = [];

    for (const [niche, tasks] of Object.entries(
        props.checklistsByNiche ?? {},
    )) {
        const nicheLbl = nicheLabel(niche);
        for (const task of tasks) {
            const st = taskStatusRow(task);
            rows.push({
                id: `ccp-${niche}-${task.id}`,
                date: dayLabel,
                point: `${nicheLbl} — ${task.title}`,
                value: formatTaskValue(task),
                assignee: resolveStaffFullName(
                    props.staff,
                    task.assignedStaffId,
                ),
                photo: taskPhotoLabel(task),
                statusLabel: st.label,
                statusKey: st.key,
            });
        }
    }

    return rows;
});

const batchPreviewRows = computed(() =>
    (props.batches ?? []).map((b) => ({
        id: `eudr-${b.id}`,
        date: b.date ?? "—",
        point: `EUDR — ${b.product} (${b.id})`,
        value: `${b.supplier} · ${b.statusLabel}`,
        photo: t('demo.reports.photo_no'),
        statusLabel: b.statusLabel,
        statusKey: b.status === "review" ? "review" : "ok",
    })),
);

/** URL из данных отчёта (дата → полный адрес с локалью из демо-роута). */
const publicReportUrl = computed(() =>
    buildDailyReportPublicUrl(
        props.report.reportDayIso ?? todayIso(),
        reportPageLocale.value,
    ),
);

const goToPublicReport = () => {
    const url = publicReportUrl.value;
    if (typeof window !== "undefined" && url) {
        window.open(url, "_blank", "noopener,noreferrer");
    }
};

/** Буфер без Secure Context (http) — clipboard API часто недоступен. */
function copyTextFallback(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
        return document.execCommand("copy");
    } finally {
        document.body.removeChild(ta);
    }
}

const handleCopyLink = async () => {
    const text = buildDailyReportPublicUrl(
        props.report.reportDayIso ?? todayIso(),
        reportPageLocale.value,
    );
    try {
        if (
            typeof navigator !== "undefined" &&
            navigator.clipboard?.writeText
        ) {
            await navigator.clipboard.writeText(text);
        } else if (!copyTextFallback(text)) {
            throw new Error("copy");
        }
        message.success(t('demo.reports.copy_success'));
    } catch {
        if (copyTextFallback(text)) {
            message.success(t('demo.reports.copy_success'));
        } else {
            message.error(t('demo.reports.copy_error'));
        }
    }
};

/**
 * Обрабатывает действия экспорта отчета.
 * Используется для mock-сценария PDF и отправки инспектору.
 */
const handleExportAction = (action) => {
    message.success(
        action === "pdf"
            ? t('demo.reports.pdf_success')
            : t('demo.reports.inspector_success'),
    );
};
</script>

<style scoped lang="scss">
@use "../../../../../scss/variables" as *;

.reports-section {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
}

.reports-public-link, .report-preview {
    background-color: $bg-style-white;
}

.reports-public-link {
    margin-bottom: 20px;

    h2 {
        color: $text-dark-grey;
    }
}

h2 {
    margin: 0 0 $spacing-sm;
    font-size: $font-size-xl;
}
h3 {
    margin: 0 0 $spacing-xs;
    font-size: $font-size-base;
}
.reports-public-link__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: $spacing-sm;
    min-width: 0;

    @media (max-width: 750px) {
        justify-content: flex-end;
    }
}

.reports-public-link__url {
    display: flex;
    min-width: 0;
    min-height: 44px;
    align-items: center;
    padding: 0 $spacing-md;
    border-radius: $radius-md;
    border: 1px solid $text-light-grey;
    background-color: $bg-gray;
    flex: 1 1 auto;
}

.reports-public-link__url-text {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.reports-public-link__actions {
    display: flex;
    gap: $spacing-sm;
    flex-wrap: wrap;
}

.reports-public-link__state {
    margin: $spacing-sm 0 0;
    color: $text-dark-grey;
}

.report-preview__category {
    margin: $spacing-lg 0 $spacing-sm;
    font-size: $font-size-base;
    font-weight: 700;
    color: $text-dark-grey;
    padding-bottom: $spacing-xs;
    border-bottom: 2px solid $accent-primary;
}

.report-preview__desktop {
    display: block;
}

.report-preview__mobile {
    display: none;
    flex-direction: column;
    gap: $spacing-md;
}

.report-preview-card {
    border: 1px solid $text-light-grey;
    border-radius: $radius-lg;
    padding: $spacing-md;
    background-color: $bg-gray;
}

.report-preview-card__line {
    margin: 4px 0 0;
    font-size: $font-size-sm;
    word-break: break-word;

    &:first-child {
        margin-top: 0;
    }
}

.report-preview-card__label {
    color: $text-dark-grey;
    margin-right: 4px;
}

.report-preview-card__line--status {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $spacing-xs;
}

.report-preview__table-wrap {
    overflow-x: auto;
}

.report-preview__table {
    width: 100%;
    border-collapse: collapse;
    min-width: 760px;

    th,
    td {
        text-align: left;
        padding: $spacing-sm;
        border-bottom: 1px solid $text-light-grey;
    }

    tbody tr {
        transition: background-color $transition-base ease;
    }

    tbody tr:hover {
        background-color: rgba($bg-light-grey, 0.55);
    }

    th {
        font-size: $font-size-sm;
        color: $text-dark-grey;
        font-weight: 600;
    }
}

.report-preview__table th:nth-child(5),
.report-preview__table td:nth-child(5) {
    text-align: center;
}

.report-preview__table th:nth-child(6),
.report-preview__table td:nth-child(6) {
    text-align: center;
}

.report-status {
    display: inline-flex;
    align-items: center;
    min-height: 28px;
    font-size: $font-size-sm;
}

.report-status--ok {
    color: $text-green;
}

.report-status--problem {
    color: $text-red;
}

.report-status--review {
    color: $accent-primary;
}

.reports-footer-actions {
    display: flex;
    gap: $spacing-sm;
    flex-wrap: wrap;
    justify-content: flex-end;
    margin-top: 20px;

    > .btn-client {
        flex: 1 1 0;
        min-width: 0;
        text-align: center;
        justify-content: center;
    }
}

@media (max-width: $breakpoint-lg) {
    .report-preview__desktop {
        display: none;
    }

    .report-preview__mobile {
        display: flex;
    }
}

</style>
