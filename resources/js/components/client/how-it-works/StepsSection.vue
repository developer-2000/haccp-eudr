<template>
    <section class="steps-section">
        <div class="container">
            <h2 class="steps-section__heading">ШАГИ</h2>
            <div class="steps-section__list">
                <article
                    v-for="step in steps"
                    :key="step.id"
                    class="step-block"
                >
                    <div class="step-block__num" aria-hidden="true">{{ step.id }}</div>
                    <div class="step-block__content">
                        <h3 class="step-block__title">
                            <Icon
                                v-if="step.iconName"
                                :name="step.iconName"
                                :class="['step-block__icon', step.iconClass]"
                                aria-hidden="true"
                            />
                            <span class="step-block__title-text">{{ step.title }}</span>
                        </h3>
                        <p class="step-block__desc" :class="{ 'step-block__desc--accent': step.accent }">
                            {{ step.desc }}
                        </p>
                        <ul
                            v-if="step.benefits?.length"
                            class="step-block__benefits"
                        >
                            <li
                                v-for="(benefit, i) in step.benefits"
                                :key="i"
                                class="step-block__benefit"
                            >
                                {{ benefit }}
                            </li>
                        </ul>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>

<script setup>
defineOptions({
    name: "StepsSection",
});

/**
 * Шаги процесса для секции ШАГИ.
 * accent: true — описание зелёным bold (шаг 6).
 */
import Icon from "@/components/Icon.vue";

const steps = [
    {
        id: 1,
        title: "Скачай + Setup",
        iconName: "laptop-mac-twotone",
        desc: "Сайт в браузере без установки + приложение на смартфон",
        accent: false,
        benefits: [
            "30 минут = твоя система готова",
            "Выбери нишу → CCP готово",
            "Установи уведомления",
            "Добавь рецепты/ингредиенты",
            "Загрузи документы/фото"
        ],
    },
    {
        id: 2,
        title: "CCP auto",
        iconName: "coffee-maker-twotone",
        desc: "Bluetooth температуры auto + авто-лог CCP",
        accent: false,
        benefits: ["Нет pencil whipping"],
    },
    {
        id: 3,
        title: "Чек-лист",
        iconName: "schedule-twotone",
        iconClass: "metric-icon--inspection",
        desc: "1 клик = запись сохранена, оффлайн синхронизация позже",
        accent: false,
        benefits: ["Оффлайн режим без срывов"],
    },
    {
        id: 4,
        title: "QR инспектору",
        iconName: "qr-code-twotone",
        iconClass: "metric-icon--eudr",
        desc: "QR инспектору без логина Berlin→Paris",
        accent: false,
        benefits: ["PDF 1 клик вместо 3 дней паники"],
    },
    {
        id: 5,
        title: "Dashboard + алерты",
        iconName: "dashboard-twotone",
        desc: "Авто-алерты 24/7 при отклонениях (темп >195°C)",
        accent: false,
        benefits: ["98% compliance dashboard"],
    },
    {
        id: 6,
        title: "EUDR экспорт",
        iconName: "tag-export",
        desc: "100% EUDR готовность и экспорт на каждую партию",
        accent: true,
        benefits: ["Штрафы €0 навсегда"],
    },
];
</script>

<style lang="scss" scoped>
@use "../../../../scss/variables" as *;

.steps-section {
    min-height: 1000px;
    padding: $spacing-2xl 0;
    background-color: $bg-light-primary;
}

.steps-section__heading {
    font-size: $font-size-2-5xl;
    font-weight: 700;
    color: $text-color;
    margin: 0 0 $spacing-xl;
    text-align: center;
}

.steps-section__list {
    display: flex;
    flex-direction: column;
    gap: 0;
    position: relative;
    max-width: 720px;
    margin: 0 auto;
}

.steps-section__list::before {
    content: "";
    position: absolute;
    left: 53px;
    top: 88px;
    bottom: 88px;
    width: 2px;
    background: $accent-primary;
    z-index: 0;
}

.step-block {
    min-height: 160px;
    display: flex;
    align-items: stretch;
    gap: $spacing-lg;
    background-color: $bg-white;
    border: 1px solid $border-color;
    border-radius: $radius-xl;
    padding: $spacing-lg;
    margin-bottom: $spacing-md;
    position: relative;
    z-index: 1;
    box-shadow: $shadow-sm;

    &:last-child {
        margin-bottom: 0;
    }
}

.step-block__num {
    flex-shrink: 0;
    width: 55px;
    align-self: stretch;
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: -24px 0 -24px 0;
    background-color: $accent-primary;
    color: $bg-white;
    font-size: $font-size-2xl;
    font-weight: 700;
}

.step-block__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: $spacing-sm;
}

.step-block__title {
    font-size: 2rem;
    font-weight: 700;
    color: $text-color;
    margin: 0;
    display: flex;
    align-items: center;
    gap: $spacing-sm;

    .step-block__icon {
        width: 50px;
        display: flex;
        margin-bottom: 0;
    }


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

.step-block__title-text {
    flex: 0 0 auto;
}

.step-block__desc {
    font-size: $font-size-lg;
    font-weight: 500;
    color: $text-color;
    margin: 0;

    &--accent {
        color: $accent-success;
        font-weight: 700;
    }
}

.step-block__benefits {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
}

.step-block__benefit {
    font-size: $font-size-base;
    color: $text-light-grey;
    position: relative;
    padding-left: 18px;

    &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0.62em;
        width: 7px;
        height: 7px;
        border-radius: $radius-full;
        background-color: rgba($accent-primary, 0.75);
        transform: translateY(-50%);
    }
}

</style>
