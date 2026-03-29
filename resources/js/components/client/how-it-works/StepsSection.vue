<template>
    <section class="steps-section">
        <div class="container">
            <h1 class="steps-section__heading">Steps</h1>
            <div class="steps-section__list">
                <article
                    v-for="step in steps"
                    :key="step.id"
                    class="step-block"
                >
                    <div class="step-block__num" aria-hidden="true">
                        {{ step.id }}
                    </div>
                    <div class="step-block__content">
                        <h2 class="step-block__title">
                            <Icon
                                v-if="step.iconName"
                                :name="step.iconName"
                                :class="['step-block__icon', step.iconClass]"
                                aria-hidden="true"
                            />
                            <span class="step-block__title-text">{{
                                step.title
                            }}</span>
                        </h2>
                        <p
                            class="step-block__desc"
                            :class="{ 'step-block__desc--accent': step.accent }"
                        >
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
        title: "Download + Setup",
        iconName: "laptop-mac-twotone",
        desc: "Website in browser without installation + app on smartphone",
        accent: false,
        benefits: [
            "30 minutes = your system is ready",
            "Choose a niche → CCP is ready",
            "Set up notifications",
            "Add recipes/ingredients",
            "Upload documents/photos",
        ],
    },
    {
        id: 2,
        title: "Monitoring",
        iconName: "control-twotone",
        desc: "All CCP in 1 - 24/7 deviation alerts",
        accent: false,
        benefits: [
            "Hourly/daily staff tasks",
            "Room/fridge temperatures",
            "Goods receiving + storage",
            "Facility sanitation",
            "Cooking temperatures",
            "Equipment calibration",
        ],
    },
    {
        id: 3,
        title: "CCP Automation",
        iconName: "coffee-maker-twotone",
        desc: "Bluetooth thermometers + alerts + auto-logs",
        accent: false,
        benefits: [
            "Bluetooth thermometers auto-log",
            "Push/SMS alerts to staff",
            "Auto-corrections on deviations",
            "Real-time AI risk analysis",
            "Auto report generation",
        ],
    },
    {
        id: 4,
        title: "Checklist",
        iconName: "schedule-twotone",
        iconClass: "metric-icon--inspection",
        desc: "1 click = record saved + photo/voice",
        accent: false,
        benefits: [
            "Offline without failures",
            "Before/after photo (195°C) in 1 click",
            "Voice CCP input",
            "Second person confirmation",
            "GPS where it was done",
            "Auto timestamp + who did it",
            "Audit trail for inspector",
        ],
    },
    {
        id: 5,
        title: "QR Inspector",
        iconName: "qr-code-twotone",
        iconClass: "metric-icon--eudr",
        desc: "Inspector scans → online without your presence",
        accent: false,
        benefits: [
            "PDF in 1 click instead of 3 days of panic",
            "€0 fines forever",
            "EUDR export without blocks",
        ],
    },
    {
        id: 6,
        title: "Dashboard + Alerts",
        iconName: "dashboard-twotone",
        desc: "Intuitive UX + sync across all devices",
        accent: false,
        benefits: [
            "All data on 1 screen",
            "Push alerts → 0 misses",
            "Phone/tablet/PC sync",
            "Search across all logs",
            "Drag&drop widgets",
            "Notification personalization",
            "Dark/Light mode auto",
        ],
    },
    {
        id: 7,
        title: "EUDR Export",
        iconName: "tag-export",
        desc: "Each batch = QR + GPS + DDS ready",
        accent: false,
        benefits: [
            "100% EUDR compliance",
            "€0 fines (4% turnover)",
            "EU export without blocks",
        ],
    },
];
</script>

<style lang="scss" scoped>
@use "../../../../scss/variables" as *;

.steps-section {
    min-height: 1000px;
    padding: $spacing-2xl 0;
    background-color: $bg-light-grey;
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
    left: 52px;
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
    background-color: $bg-style-white;
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
    margin: -24px 0 -25px 0;
    background-color: $accent-primary;
    color: $bg-style-white;
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
    min-width: 0;
    line-height: 35px;

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

    @media (max-width: 530px) {
        font-size: 30px;

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
    flex: 1 1 auto;
    min-width: 0;
    white-space: normal;
    overflow-wrap: anywhere;
}

.step-block__desc {
    font-size: $font-size-lg;
    font-weight: 500;
    color: $text-color;
    margin: 0;
}

.step-block__desc--accent {
    color: $accent-success;
    font-weight: 700;
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
