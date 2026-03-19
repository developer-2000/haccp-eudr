<template>
    <section class="metrics-section">
        <div class="metrics-grid">
            <article
                v-for="metric in metricCards"
                :key="metric.id"
                class="metric-card"
            >
                <div class="metric-card-header">
                    <div class="metric-icon" :class="metric.iconClass">
                        <Icon
                            :name="metric.iconName"
                            aria-hidden="true"
                        />
                    </div>
                    <h2 class="metric-title">
                        {{ metric.title }}
                    </h2>
                </div>
                <div class="metric-card-body metric-card-body--savings">
                    <div class="metric-card-body-col metric-card-body-col--left">
                        <p v-for="(line, idx) in metric.lines" :key="idx" class="metric-line">
                            <span class="metric-bold">
                                {{ line.word }}
                            </span>
                            <span class="metric-text" v-html="formatMetricValue(line.value, line.highlight)" />
                        </p>
                    </div>
                    <div
                        v-if="metric.right"
                        class="metric-card-body-col metric-card-body-col--right"
                    >
                        <p class="metric-line metric-details--accent">
                            {{ metric.right }}
                        </p>
                    </div>
                </div>
            </article>
        </div>
    </section>
</template>

<script setup>
defineOptions({
    name: "MetricsSection",
});

import Icon from "@/components/Icon.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Highlight classes for price amounts in metric lines */
const PRICE_HIGHLIGHT_CLASS = {
    competitor: "red-text",
    ours: "green-text",
};

/**
 * Wraps the first €-price in value with a highlight span.
 * @param {string} value - Raw text (e.g. "€99+ /month")
 * @param {'competitor'|'ours'} highlight - Which highlight class to use
 * @returns {string} HTML string with wrapped price, or escaped value if no highlight
 */
function formatMetricValue(value, highlight) {
    if (!highlight || !PRICE_HIGHLIGHT_CLASS[highlight]) {
        return value;
    }
    const cssClass = PRICE_HIGHLIGHT_CLASS[highlight];
    return value.replace(
        /€[\d,]+(?:\+)?/,
        (match) => `<span class="${cssClass}">${match}</span>`
    );
}

/**
 * Описывает набор карточек с метриками,
 * используемых в секции METRICS на главной странице.
 * Для части карточек используется SVG-иконка через общий компонент Icon.
 */
const metricCards = [
    {
        id: "profit",
        iconName: "account-balance-wallet-twotone",
        iconClass: "metric-icon--wallet",
        title: t("home.metrics.profit.title"),
        lines: [
            {
                word: t("home.metrics.profit.line1.word"),
                value: t("home.metrics.profit.line1.value"),
                highlight: "competitor",
            },
            {
                word: t("home.metrics.profit.line2.word"),
                value: t("home.metrics.profit.line2.value"),
                highlight: "ours",
            },
        ],
        right: t("home.metrics.profit.right"),
    },
    {
        id: "inspection",
        iconName: "schedule-twotone",
        iconClass: "metric-icon--inspection",
        title: t("home.metrics.inspection.title"),
        lines: [
            {
                word: t("home.metrics.inspection.line1.word"),
                value: t("home.metrics.inspection.line1.value"),
            },
            {
                word: t("home.metrics.inspection.line2.word"),
                value: t("home.metrics.inspection.line2.value"),
            },
        ],
    },
    {
        id: "time",
        iconName: "watch-later-twotone",
        iconClass: "metric-icon--time",
        title: t("home.metrics.time.title"),
        lines: [
            {
                word: t("home.metrics.time.line1.word"),
                value: t("home.metrics.time.line1.value"),
            },
            {
                word: t("home.metrics.time.line2.word"),
                value: t("home.metrics.time.line2.value"),
            },
        ],
    },
    {
        id: "eudr",
        iconName: "qr-code-twotone",
        iconClass: "metric-icon--eudr",
        title: t("home.metrics.eudr.title"),
        lines: [
            {
                word: t("home.metrics.eudr.line1.word"),
                value: t("home.metrics.eudr.line1.value"),
            },
            {
                word: t("home.metrics.eudr.line2.word"),
                value: t("home.metrics.eudr.line2.value"),
            },
        ],
    },
];
</script>

<style scoped lang="scss">
@use "../../../../scss/variables" as *;

.metrics-section {
    .metrics-grid {
        display: grid;
        grid-template-columns: repeat(1, minmax(0, 1fr));
        gap: $spacing-md;

        @media (min-width: $breakpoint-md) {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: $spacing-lg;
        }

        @media (min-width: $breakpoint-lg) {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: $spacing-xl;
        }
    }

    .metric-card {
        min-height: 202px;
        background-color: $bg-white;
        border: 1px solid $border-color;
        border-radius: $radius-xl;
        box-shadow: $shadow-sm;
        padding: $spacing-xl;
        display: flex;
        flex-direction: column;
        gap: $spacing-sm;
        transition: box-shadow $transition-base;

        &:hover {
            box-shadow: $shadow-sm-md;
        }
    }

    .metric-card-header {
        display: flex;
        align-items: center;
        gap: $spacing-md;
    }

    .metric-icon {
        width: 50px;
        display: flex;
        margin-bottom: 0;

        :deep(.xicon) {
            width: auto;
            height: auto;
            margin-left: -5px;
        }

        :deep(.xicon svg) {
            width: 50px;
            height: 50px;
        }

        :deep(svg) {
            width: 50px;
            height: 50px;
        }

        @media (max-width: 500px) {
            width: 45px;
            :deep(.xicon svg) {
                width: 45px;
                height: 45px;
            }
            :deep(svg) {
                width: 45px;
                height: 45px;
            }
        }
    }

    .metric-icon--inspection,
    .metric-icon--eudr{
        margin-left: -5px;
    }
    .metric-title {
        font-size: $font-size-2-25xl;
        line-height: 28px;
        font-weight: 700;
        margin: 0;

        @media (max-width: 500px) {
            font-size: $font-size-2xl;
            font-weight: 600;
        }
    }

    .metric-card-body--savings {
        display: flex;
        align-items: center;
        gap: $spacing-md;
        margin-top: 15px;
        min-width: 100%;

        @media (max-width: 900px) {
            flex-flow: column nowrap;
            align-items: flex-start;
        }
    }

    .metric-card-body-col {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .metric-card-body-col--right {
        flex: 1 1 auto;
    }

    .metric-line {
        font-size: $font-size-lg;
        line-height: 24px;
        font-weight: 400;
        color: $text-dark-grey;
        margin-bottom: 10px;

        &:last-child{
            margin: 0;
        }

        .metric-bold {
            font-weight: 600;
        }
    }

    .metric-details--accent {
        font-size: 20px;
        font-weight: 600;
        color: $accent-primary-dark;
        text-align: right;
    }

    .red-text {
        font-weight: 500;
    }

    .green-text {
        font-weight: 500;
    }
}
</style>

