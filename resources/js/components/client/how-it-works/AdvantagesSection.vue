<template>
    <section class="advantages-section">
        <div class="container">
            <h2 class="advantages-section__heading">{{ t('how_it_work.advantages.heading') }}</h2>
            <div class="advantages-section__grid">
                <article
                    v-for="cat in advantageCategories"
                    :key="cat.id"
                    class="advantage-card card-shadow"
                >
                    <h3 class="advantage-card__title">{{ cat.title }}</h3>
                    <ul class="advantage-card__list">
                        <li v-for="(point, i) in cat.points" :key="i">
                            {{ point }}
                        </li>
                    </ul>
                </article>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

defineOptions({
    name: "AdvantagesSection",
});

const { t } = useI18n();

/**
 * Категории преимуществ для предпринимателя.
 * Реактивно обновляются при смене языка.
 */
const advantageCategories = computed(() => [
    {
        id: "setup-speed",
        title: t('how_it_work.advantages.cat1_title'),
        points: [
            t('how_it_work.advantages.cat1_point_1'),
            t('how_it_work.advantages.cat1_point_2'),
            t('how_it_work.advantages.cat1_point_3'),
        ],
    },
    {
        id: "full-control",
        title: t('how_it_work.advantages.cat2_title'),
        points: [
            t('how_it_work.advantages.cat2_point_1'),
            t('how_it_work.advantages.cat2_point_2'),
            t('how_it_work.advantages.cat2_point_3'),
        ],
    },
    {
        id: "smart-checklist",
        title: t('how_it_work.advantages.cat3_title'),
        points: [
            t('how_it_work.advantages.cat3_point_1'),
            t('how_it_work.advantages.cat3_point_2'),
            t('how_it_work.advantages.cat3_point_3'),
        ],
    },
    {
        id: "inspector-proof",
        title: t('how_it_work.advantages.cat4_title'),
        points: [
            t('how_it_work.advantages.cat4_point_1'),
            t('how_it_work.advantages.cat4_point_2'),
            t('how_it_work.advantages.cat4_point_3'),
        ],
    },
    {
        id: "pro-dashboard",
        title: t('how_it_work.advantages.cat5_title'),
        points: [
            t('how_it_work.advantages.cat5_point_1'),
            t('how_it_work.advantages.cat5_point_2'),
            t('how_it_work.advantages.cat5_point_3'),
        ],
    },
    {
        id: "eudr-safe",
        title: t('how_it_work.advantages.cat6_title'),
        points: [
            t('how_it_work.advantages.cat6_point_1'),
            t('how_it_work.advantages.cat6_point_2'),
            t('how_it_work.advantages.cat6_point_3'),
        ],
    },
]);
</script>

<style lang="scss" scoped>
@use "../../../../scss/variables" as *;

.advantages-section {
    padding: $spacing-2xl 0;
    background-color: $bg-gray;
}

.advantages-section__heading {
    font-size: $font-size-2-5xl;
    font-weight: 700;
    color: $text-color;
    margin: 0 0 $spacing-xl;
    text-align: center;
}

.advantages-section__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-lg;

    @media (min-width: $breakpoint-md) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: $breakpoint-xl) {
        grid-template-columns: repeat(3, 1fr);
    }
}

.advantage-card {
    padding: $spacing-xl;
    background-color: $bg-style-white;
    border: 1px solid $border-color;
    border-radius: $radius-xl;
}

.advantage-card__title {
    font-size: $font-size-xl;
    font-weight: 700;
    color: $text-color;
    margin: 0 0 $spacing-md;
}

.advantage-card__list {
    margin: 0;
    padding-left: $spacing-lg;
    color: $text-light-grey;
    font-size: $font-size-base;
    line-height: 1.6;

    li {
        margin-bottom: $spacing-xs;

        &:last-child {
            margin-bottom: 0;
        }
    }
}
</style>
