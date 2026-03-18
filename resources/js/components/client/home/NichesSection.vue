<template>
    <section class="niches">
        <div class="niches__grid">
            <article
                v-for="niche in niches"
                :key="niche.id"
                class="niche-card"
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

const router = useRouter();
const route = useRoute();

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
    router.push("/" + getCurrentLocale() + "/demo");
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
        title: "COFFEE",
        subtitle: "Roastery",
        points: ["195°C ростер", "+15°C зерно", "EUDR QR"],
        result: "Гигиена + экспорт без головной боли",
        cta: "ДЕМО",
    },
    {
        id: "bakery",
        emoji: "🍞",
        title: "BAKERY",
        subtitle: "Artisan",
        points: ["26°C тесто", "core 95°C", "опара +21°C"],
        result: "HACCP автоматически, без бумаги",
        cta: "ДЕМО",
    },
    {
        id: "meat",
        emoji: "🥩",
        title: "MEAT",
        subtitle: "Butcher",
        points: ["−18°C замороз", "дезинфекция", "EUDR QR"],
        result: "Температура + traceability",
        cta: "ДЕМО",
    },
    {
        id: "other",
        emoji: "💼",
        title: "ДРУГИЕ НИШИ",
        subtitle: "Хочешь €29 вместо €49?",
        points: [
            "Пройди опрос 1 минута",
            "CCP под твой бизнес",
            "30% скидка навсегда",
        ],
        result: "Адаптируем под ТЕБЯ",
        cta: "ПРОЙТИ ОПРОС",
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
    background-color: $white-color;
    border: 1px solid $border-color;
    border-radius: $radius-xl;
    box-shadow: $shadow-sm;
    padding: $spacing-xl;
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    height: 100%;
    min-height: 320px;
    transition: box-shadow $transition-base, border-color $transition-base;
    width: 100%;

    &:hover {
        box-shadow: $shadow-sm-md;
        border-color: rgba($primary-color, 0.35);
    }

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
        color: $text-color;
        letter-spacing: 0.02em;
    }

    .niche-card__subtitle {
        margin: 2px 0 0;
        font-size: $font-size-sm;
        font-weight: 600;
        color: $text-light-grey;
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
        color: $text-light-grey;
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

</style>

