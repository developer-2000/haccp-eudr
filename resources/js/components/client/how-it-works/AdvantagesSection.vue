<template>
    <section class="advantages-section">
        <div class="container">
            <h2 class="advantages-section__heading">ЧТО ВЫ ПОЛУЧАЕТЕ</h2>
            <div class="advantages-section__grid">
                <article
                    v-for="cat in advantageCategories"
                    :key="cat.id"
                    class="advantage-card"
                >
                    <h3 class="advantage-card__title">{{ cat.title }}</h3>
                    <ul class="advantage-card__list">
                        <li v-for="(point, i) in cat.points" :key="i">{{ point }}</li>
                    </ul>
                </article>
            </div>
        </div>
    </section>
</template>

<script setup>
defineOptions({
    name: "AdvantagesSection",
});

/**
 * Категории преимуществ для предпринимателя.
 */
const advantageCategories = [
    {
        id: "time",
        title: "⏰ Время + Эффективность",
        points: ["+2ч/день на человека", "1 клик = запись сохранена", "Масштабирование без доп. персонала"],
    },
    {
        id: "accuracy",
        title: "✅ Точность 0% ошибок",
        points: ["Нет pencil whipping", "Bluetooth авто-фиксация температур", "Реал-тайм алерты отклонений"],
    },
    {
        id: "inspection",
        title: "📋 Инспекции",
        points: ["100% готовность, QR без логина", "PDF экспорт 1 клик", "98% compliance dashboard"],
    },
    {
        id: "eudr",
        title: "🌍 EUDR 2026",
        points: ["QR traceability на каждую партию", "Berlin→Paris compliance", "Штрафы €0"],
    },
    {
        id: "money",
        title: "💰 Экономия",
        points: ["€49/мес вместо €99+", "€600/год на бизнес", "Нет консультантов €800/год"],
    },
];
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
    background-color: $bg-white;
    border: 1px solid $border-color;
    border-radius: $radius-xl;
    transition: box-shadow $transition-base;

    &:hover {
        box-shadow: $shadow-md;
    }
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
