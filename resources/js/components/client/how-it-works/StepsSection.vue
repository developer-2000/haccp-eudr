<template>
    <section class="steps-section">
        <div class="container">
            <h1 class="steps-section__heading">{{ t('how_it_work.steps.heading') }}</h1>
            <div class="steps-section__list">
                <article v-for="step in steps" :key="step.id" class="step-block">
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
                            <span class="step-block__title-text">
                                {{ step.title }}
                            </span>
                        </h2>
                        <h3
                            class="step-block__desc"
                            :class="{ 'step-block__desc--accent': step.accent }"
                        >
                            {{ step.desc }}
                        </h3>
                        <ul v-if="step.benefits?.length" class="step-block__benefits">
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
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Icon from '@/components/Icon.vue';

defineOptions({
    name: 'StepsSection',
});

const { t } = useI18n();

/**
 * Шаги процесса для секции "Как это работает".
 * Тексты берутся из переводов; иконки и id остаются статичными.
 */
const steps = computed(() => [
    {
        id: 1,
        title: t('how_it_work.steps.step1_title'),
        iconName: 'laptop-mac-twotone',
        desc: t('how_it_work.steps.step1_desc'),
        accent: false,
        benefits: [
            t('how_it_work.steps.step1_benefit_1'),
            t('how_it_work.steps.step1_benefit_2'),
            t('how_it_work.steps.step1_benefit_3'),
            t('how_it_work.steps.step1_benefit_4'),
            t('how_it_work.steps.step1_benefit_5'),
        ],
    },
    {
        id: 2,
        title: t('how_it_work.steps.step2_title'),
        iconName: 'control-twotone',
        desc: t('how_it_work.steps.step2_desc'),
        accent: false,
        benefits: [
            t('how_it_work.steps.step2_benefit_1'),
            t('how_it_work.steps.step2_benefit_2'),
            t('how_it_work.steps.step2_benefit_3'),
            t('how_it_work.steps.step2_benefit_4'),
            t('how_it_work.steps.step2_benefit_5'),
            t('how_it_work.steps.step2_benefit_6'),
        ],
    },
    {
        id: 3,
        title: t('how_it_work.steps.step3_title'),
        iconName: 'coffee-maker-twotone',
        desc: t('how_it_work.steps.step3_desc'),
        accent: false,
        benefits: [
            t('how_it_work.steps.step3_benefit_1'),
            t('how_it_work.steps.step3_benefit_2'),
            t('how_it_work.steps.step3_benefit_3'),
            t('how_it_work.steps.step3_benefit_4'),
            t('how_it_work.steps.step3_benefit_5'),
        ],
    },
    {
        id: 4,
        title: t('how_it_work.steps.step4_title'),
        iconName: 'schedule-twotone',
        iconClass: 'metric-icon--inspection',
        desc: t('how_it_work.steps.step4_desc'),
        accent: false,
        benefits: [
            t('how_it_work.steps.step4_benefit_1'),
            t('how_it_work.steps.step4_benefit_2'),
            t('how_it_work.steps.step4_benefit_3'),
            t('how_it_work.steps.step4_benefit_4'),
            t('how_it_work.steps.step4_benefit_5'),
            t('how_it_work.steps.step4_benefit_6'),
            t('how_it_work.steps.step4_benefit_7'),
        ],
    },
    {
        id: 5,
        title: t('how_it_work.steps.step5_title'),
        iconName: 'qr-code-twotone',
        iconClass: 'metric-icon--eudr',
        desc: t('how_it_work.steps.step5_desc'),
        accent: false,
        benefits: [
            t('how_it_work.steps.step5_benefit_1'),
            t('how_it_work.steps.step5_benefit_2'),
            t('how_it_work.steps.step5_benefit_3'),
        ],
    },
    {
        id: 6,
        title: t('how_it_work.steps.step6_title'),
        iconName: 'dashboard-twotone',
        desc: t('how_it_work.steps.step6_desc'),
        accent: false,
        benefits: [
            t('how_it_work.steps.step6_benefit_1'),
            t('how_it_work.steps.step6_benefit_2'),
            t('how_it_work.steps.step6_benefit_3'),
            t('how_it_work.steps.step6_benefit_4'),
            t('how_it_work.steps.step6_benefit_5'),
            t('how_it_work.steps.step6_benefit_6'),
            t('how_it_work.steps.step6_benefit_7'),
        ],
    },
    {
        id: 7,
        title: t('how_it_work.steps.step7_title'),
        iconName: 'tag-export',
        desc: t('how_it_work.steps.step7_desc'),
        accent: false,
        benefits: [
            t('how_it_work.steps.step7_benefit_1'),
            t('how_it_work.steps.step7_benefit_2'),
            t('how_it_work.steps.step7_benefit_3'),
        ],
    },
]);
</script>

<style lang="scss" scoped>
@use '../../../../scss/variables' as *;

.steps-section {
    min-height: 1000px;
    padding: $spacing-2xl 0;
    background-color: $bg-light-grey;
}

.steps-section__heading {
    font-size: $font-size-2-5xl;
    font-weight: 700;
    color: $text-color;
    text-align: center;
    max-width: 630px;
    width: 100%;
    margin: 0 auto 40px;

    @media (max-width: 530px) {
        font-size: $font-size-2-25xl;
    }
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
    content: '';
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
    font-size: $font-size-2-375xl;
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
        font-size: $font-size-2-125xl;

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
        content: '';
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
