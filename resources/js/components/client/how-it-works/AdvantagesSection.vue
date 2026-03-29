<template>
    <section class="advantages-section">
        <div class="container">
            <h2 class="advantages-section__heading">WHAT YOU GET</h2>
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
defineOptions({
    name: "AdvantagesSection",
});

/**
 * Категории преимуществ для предпринимателя.
 */
const advantageCategories = [
    {
        id: "setup-speed",
        title: "🚀 30 minutes = everything ready",
        points: [
            "Downloaded → chose niche → CCP auto",
            "Notifications + recipes set up",
            "System works without consultants",
        ],
    },
    {
        id: "full-control",
        title: "🔍 Full control 24/7",
        points: [
            "All temperatures + tasks in 1 app",
            "Fridges/cooking/sanitation",
            "Bluetooth auto + AI risks",
        ],
    },
    {
        id: "smart-checklist",
        title: "📱 Checklist like Instagram",
        points: [
            "1 click + photo/voice/GPS",
            "Offline sync + audit trail",
            "2 people confirm → no fraud",
        ],
    },
    {
        id: "inspector-proof",
        title: "🔗 Inspector scans → OK",
        points: [
            "QR → dashboard without presence",
            "PDF in 1 click instead of 3 days of panic",
            "€0 fines (HACCP + EUDR)",
        ],
    },
    {
        id: "pro-dashboard",
        title: "📊 Dashboard like Apple",
        points: [
            "All data 1 screen + cross-device",
            "Push alerts + drag&drop widgets",
            "Dark/Light + log search",
        ],
    },
    {
        id: "eudr-safe",
        title: "🌍 EUDR export without risk",
        points: [
            "QR + GPS + DDS for each batch",
            "100% compliance → €0 fines",
            "EU market open forever",
        ],
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
