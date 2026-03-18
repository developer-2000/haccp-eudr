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
                            <span class="metric-text">
                                {{ line.value }}
                            </span>
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
        title: "Профит",
        lines: [
            { word: "Конкуренты → ", value: "€99+ /мес" },
            { word: "Мы → ", value: "€49/мес" },
        ],
        right: "€600/год",
    },
    {
        id: "inspection",
        iconName: "schedule-twotone",
        iconClass: "metric-icon--inspection",
        title: "Инспекция 100%",
        lines: [
            { word: "Сканирует QR → ", value: "видит ВСЁ" },
            { word: "Без → ", value: "логина/регистрации" },
        ],
    },
    {
        id: "time",
        iconName: "watch-later-twotone",
        iconClass: "metric-icon--time",
        title: "Свободных +2ч в день",
        lines: [
            { word: "Телефон → ", value: "2 мин/чек-лист" },
            { word: "1 клик → ", value: "запись сохранена" },
        ],
    },
    {
        id: "eudr",
        iconName: "qr-code-twotone",
        iconClass: "metric-icon--eudr",
        title: "EUDR QR",
        lines: [
            { word: "Berlin → ", value: "Paris" },
            { word: "Авто-QR → ", value: "на каждую партию" },
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
        background-color: $white-color;
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
        color: $primary-color-dark;
        text-align: right;
    }
}
</style>

