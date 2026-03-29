<template>
    <section class="niches">
        <div class="niches__grid">
            <article
                v-for="niche in niches"
                :key="niche.id"
                class="niche-card card-shadow"
                :class="{ 'niche-card--other': niche.id === 'other' }"
            >
                <div class="niche-card__header">
                    <div class="niche-card__emoji" aria-hidden="true">
                        {{ niche.emoji }}
                    </div>
                    <div class="niche-card__titles">
                        <h3 class="niche-card__title">
                            {{ niche.title }}
                        </h3>
                        <p class="niche-card__subtitle">
                            {{ niche.subtitle }}
                        </p>
                    </div>
                </div>

                <ul class="niche-card__points">
                    <li v-for="(point, idx) in niche.points" :key="idx">
                        {{ point }}
                    </li>
                </ul>

                <p class="niche-card__result">
                    {{ niche.result }}
                </p>

                <button
                    v-if="niche.id !== 'other'"
                    type="button"
                    class="btn-client btn-outline-primary niche-card__cta"
                    @click="goToDemo"
                >
                    {{ niche.cta }}
                </button>
                <button
                    v-else
                    type="button"
                    class="btn-client btn-outline-primary niche-card__cta"
                    @click="goToSurvey"
                >
                    {{ niche.cta }}
                </button>
            </article>
        </div>
    </section>
</template>

<script setup>
defineOptions({
    name: "NichesSection",
});

import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

/**
 * Возвращает текущую локаль из параметров маршрута.
 * Используется для формирования локализованных ссылок.
 */
function getCurrentLocale() {
    return route.params.locale ?? "en";
}

/**
 * Переходит на страницу демо с учётом локали.
 * Используется в карточках ниш.
 */
function goToDemo() {
    router.push("/" + getCurrentLocale() + "/demo/dashboard");
}

/**
 * Переходит на страницу опроса с учётом локали.
 * Используется в карточке «Другие ниши».
 */
function goToSurvey() {
    router.push("/" + getCurrentLocale() + "/survey");
}

const niches = [
    {
        id: "coffee",
        emoji: "☕",
        title: t("home.niches.coffee.title"),
        subtitle: t("home.niches.coffee.subtitle"),
        points: [
            t("home.niches.coffee.points.roaster_195C"),
            t("home.niches.coffee.points.grain_plus_15C"),
            t("home.niches.coffee.points.eudr_qr"),
        ],
        result: t("home.niches.coffee.result"),
        cta: t("home.niches.coffee.cta"),
    },
    {
        id: "bakery",
        emoji: "🍞",
        title: t("home.niches.bakery.title"),
        subtitle: t("home.niches.bakery.subtitle"),
        points: [
            t("home.niches.bakery.points.dough_26C"),
            t("home.niches.bakery.points.core_95C"),
            t("home.niches.bakery.points.starter_plus21C"),
        ],
        result: t("home.niches.bakery.result"),
        cta: t("home.niches.bakery.cta"),
    },
    {
        id: "meat",
        emoji: "🥩",
        title: t("home.niches.meat.title"),
        subtitle: t("home.niches.meat.subtitle"),
        points: [
            t("home.niches.meat.points.frozen_minus18C"),
            t("home.niches.meat.points.disinfection"),
            t("home.niches.meat.points.eudr_qr"),
        ],
        result: t("home.niches.meat.result"),
        cta: t("home.niches.meat.cta"),
    },
    {
        id: "other",
        emoji: "💼",
        title: t("home.niches.other.title"),
        subtitle: t("home.niches.other.subtitle"),
        points: [
            t("home.niches.other.points.survey_5_min"),
            t("home.niches.other.points.ccp_for_your_business"),
            t("home.niches.other.points.discount_30_forever"),
        ],
        result: t("home.niches.other.result"),
        cta: t("home.niches.other.cta"),
    },
];
</script>

<style scoped lang="scss">
@use "../../../../scss/variables" as *;

.niches {
    .niches__grid {
        display: grid;
        grid-template-columns: repeat(1, minmax(0, 1fr));
        gap: $spacing-lg;

        .niche-card.niche-card--other {
            grid-column: 1 / -1;
        }

        @media (max-width: $breakpoint-lg) {
            .niche-card.niche-card--other {
                grid-column: auto;
            }
        }

        @media (min-width: $breakpoint-md) {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        @media (min-width: $breakpoint-lg) {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }
    }
}

.niche-card {
    background-color: $bg-dark-grey;
    border: 1px solid $border-color;
    border-radius: $radius-xl;
    padding: $spacing-xl;
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    height: 100%;
    min-height: 320px;
    transition: border-color $transition-base;
    width: 100%;

    .niche-card__header {
        display: flex;
        align-items: center;
        gap: $spacing-md;
    }

    .niche-card__emoji {
        font-size: 40px;
        line-height: 1;
    }

    .niche-card__title {
        margin: 0;
        font-size: $font-size-2xl;
        font-weight: 700;
        color: $text-logo;
        letter-spacing: 0.02em;
    }

    .niche-card__subtitle {
        margin: 2px 0 0;
        font-size: $font-size-sm;
        font-weight: 600;
        color: $text-dark-grey;
    }

    .niche-card__points {
        margin: 0;
        padding-left: 18px;
        color: $text-dark-grey;

        li {
            margin: 6px 0;
        }
    }

    .niche-card__result {
        margin: 0;
        font-size: $font-size-sm;
        color: $text-color;
        font-weight: 500;
    }

    .niche-card__cta {
        align-self: flex-end;
        margin-top: auto;
    }

    .niche-card__other-title {
        margin: 0;
        font-size: $font-size-sm;
        font-weight: 700;
        color: $text-light-grey;
        letter-spacing: 0.06em;
    }

    .niche-card__other-line {
        margin: 0;
        font-size: $font-size-lg;
        color: $text-color;
    }

    .niche-card__other-line--strong {
        font-weight: 700;
    }

    .niche-card__other-cta {
        align-self: flex-start;
        margin-top: $spacing-md;
    }
}

.niche-card.niche-card--other {
    position: relative;
    overflow: hidden;
}

.niche-card.niche-card--other::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 0;
    background-image: url("/images/man.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.15;
    pointer-events: none;
}

.niche-card.niche-card--other > * {
    position: relative;
    z-index: 1;
}
</style>
