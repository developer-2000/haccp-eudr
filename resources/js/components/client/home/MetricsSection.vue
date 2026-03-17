<template>
    <section class="section-container metrics-section">
        <div class="metrics-grid">
            <!-- Профит -->
            <article class="metric-card">
                <div class="metric-card-header">
                    <div class="metric-icon metric-icon--wallet">
                        <Icon
                            name="account-balance-wallet-twotone"
                            aria-hidden="true"
                        />
                    </div>
                    <h2 class="metric-title metric-title--profit">
                        Профит
                    </h2>
                </div>
                <div class="metric-card-body metric-card-body--savings">
                    <div class="metric-card-body-col metric-card-body-col--left">
                        <p class="metric-line">
                            <span class="metric-bold">
                                Конкуренты:
                            </span>
                            <span class="metric-text">
                                €99+ /мес
                            </span>
                        </p>
                        <p class="metric-line">
                            <span class="metric-bold">
                                Мы:
                            </span>
                            <span class="metric-text">
                                €49/мес
                            </span>
                        </p>
                    </div>
                    <div class="metric-card-body-col metric-card-body-col--right">
                        <p class="metric-line metric-details--accent">
                            €1,100/год × 3+ бизнесов
                        </p>
                    </div>
                </div>
            </article>

            <article
                v-for="metric in metricCards"
                :key="metric.id"
                class="metric-card"
            >
                <div class="metric-card-header">
                    <div
                        class="metric-icon"
                        :class="{
                            'metric-icon--time': metric.id === 'time',
                            'metric-icon--inspection': metric.id === 'inspection',
                            'metric-icon--eudr': metric.id === 'eudr',
                        }"
                    >
                        <Icon
                            :name="metric.iconName"
                            aria-hidden="true"
                        />
                    </div>
                    <h2 class="metric-title">
                        {{ metric.title }}
                    </h2>
                </div>
                <div class="metric-card-body">
                    <p class="metric-line">
                        {{ metric.description }}
                    </p>
                    <p class="metric-details">
                        {{ metric.details }}
                    </p>
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
        id: "time",
        iconName: "watch-later-twotone",
        title: "+2ч в день на человека",
        description: "Чек-листы вместо бумаги",
        details: "",
    },
    {
        id: "inspection",
        iconName: "schedule-twotone",
        title: "100% инспекционно ready",
        description: "Ссылка инспектору без логина",
        details: "",
    },
    {
        id: "eudr",
        iconName: "qr-code-twotone",
        title: "EUDR QR готов Berlin-Paris",
        description: "По каждой партии",
        details: "",
    },
];
</script>

<style scoped lang="scss">
@use "../../../../scss/variables" as *;

.metrics-section {
    padding-top: $spacing-2xl;
    padding-bottom: $spacing-2xl;

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
    }

    .metric-title {
        font-size: $font-size-2-25xl;
        line-height: 40px;
        font-weight: 700;
        color: $text-color;
        margin: 0;
    }

    .metric-card-body--savings {
        display: flex;
        align-items: center;
        gap: $spacing-md;
        margin-top: 15px;
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
        color: $primary-color;
        text-align: right;
    }
}
</style>

