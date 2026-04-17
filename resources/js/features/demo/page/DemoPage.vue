<template>
    <div class="demo-page">
        <!-- Мобильная навигация по секциям: над топбаром демо (на lg+ скрыта в компоненте) -->
        <DemoSectionNavigation
            variant="bottom"
            :links="sectionLinks"
            :active-id="activeSectionId"
            @select="setActiveSection"
        />
        <!-- Верхняя панель: имитация выбора дня отчётов + дата -->
        <header class="demo-topbar">
            <div class="container demo-topbar__inner">
                <button
                    type="button"
                    class="demo-date-picker"
                    :title="t('demo.page.calendar_day')"
                    :aria-label="t('demo.page.calendar_day')"
                >
                    <span class="demo-date-picker__icon" aria-hidden="true">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <rect
                                x="3"
                                y="5"
                                width="18"
                                height="16"
                                rx="2"
                                stroke="currentColor"
                                stroke-width="1.75"
                            />
                            <path
                                stroke="currentColor"
                                stroke-width="1.75"
                                stroke-linecap="round"
                                d="M16 3v4M8 3v4M3 11h18"
                            />
                            <circle cx="8" cy="16" r="1" fill="currentColor" />
                            <circle cx="12" cy="16" r="1" fill="currentColor" />
                            <circle cx="16" cy="16" r="1" fill="currentColor" />
                        </svg>
                    </span>
                    <span class="demo-date-picker__text">{{ t('demo.page.calendar_day') }}</span>
                </button>
                <div class="demo-topbar__date">
                    <time class="demo-topbar__date-value" :datetime="todayIso"
                        >{{ todayFormatted }}
                    </time>
                </div>
            </div>
        </header>

        <!-- CTA на опрос: только на адаптиве, под топбаром, на всю ширину без скруглений -->
        <RouterLink
            :to="surveyPath"
            class="btn-client btn-success demo-topbar-cta"
        >
            {{ t('demo.page.cta_survey') }}
        </RouterLink>

        <!-- Лейаут: сайдбар (desktop) + основной контент -->
        <div class="container demo-layout">
            <!-- Сайдбар: навигация по секциям (/demo/dashboard … /demo/reports), CTA на опрос -->
            <aside class="demo-sidebar">
                <DemoSectionNavigation
                    variant="sidebar"
                    :links="sectionLinks"
                    :active-id="activeSectionId"
                    @select="setActiveSection"
                />
                <RouterLink
                    :to="surveyPath"
                    class="btn-client btn-success demo-sidebar__cta"
                >
                    {{ t('demo.page.cta_survey') }}
                </RouterLink>
            </aside>

            <main class="demo-main">
                <!-- Активная секция: лениво загружается при первом переходе -->
                <section class="demo-section" :id="activeSectionConfig.id" >
                    <h1 class="demo-section__title">
                        {{ activeSectionConfig.title }}
                    </h1>

                    <KeepAlive :max="sectionLinks.length" >
                        <component
                            :is="activeSectionComponent"
                            :key="activeSectionId"
                            v-bind="activeSectionProps"
                        />
                    </KeepAlive>
                </section>
            </main>
        </div>
    </div>
</template>

<script setup>
import { computed, defineAsyncComponent, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import DemoSectionNavigation from "@/features/demo/components/nav/DemoSectionNavigation.vue";
import { useDemoDashboardViewModel } from "@/features/demo/composables/useDemoDashboardViewModel";
import { useDemoState } from "@/features/demo/composables/useDemoState";
import { usePageSeo } from "@/composables/usePageSeo";

defineOptions({ name: "Demo" });

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const demoSeoKey = computed(() => {
    const section = route.params.section || "dashboard";
    return `seo.demo_${section}`;
});
usePageSeo({ i18nKey: demoSeoKey });

/** Допустимые сегменты URL после `/demo/` — совпадают с `id` в sectionLinks. */
const DEMO_SECTION_IDS = new Set([
    "dashboard",
    "checklists",
    "personnel",
    "eudr",
    "reports",
]);
const DashboardSectionAsync = defineAsyncComponent(
    () => import("@/features/demo/components/sections/DashboardSection.vue"),
);
const ChecklistsSectionAsync = defineAsyncComponent(
    () => import("@/features/demo/components/sections/ChecklistsSection.vue"),
);
const PersonnelSectionAsync = defineAsyncComponent(
    () => import("@/features/demo/components/sections/PersonnelSection.vue"),
);
const EudrSectionAsync = defineAsyncComponent(
    () => import("@/features/demo/components/sections/EudrSection.vue"),
);
const ReportsSectionAsync = defineAsyncComponent(
    () => import("@/features/demo/components/sections/ReportsSection.vue"),
);

const locale = computed(() => {
    const paramLocale = route.params.locale;
    return typeof paramLocale === "string" && paramLocale ? paramLocale : "en";
});

const surveyPath = computed(() => `/${locale.value}/survey`);
const { demoState } = useDemoState();
const { dashboardPanelData } = useDemoDashboardViewModel(demoState);

const activeSectionId = computed(() => {
    const s = route.params.section;
    if (typeof s === "string" && DEMO_SECTION_IDS.has(s)) {
        return s;
    }
    return "dashboard";
});

watch(
    () => route.params.section,
    (s) => {
        if (typeof s === "string" && s && !DEMO_SECTION_IDS.has(s)) {
            router.replace({
                name: "Demo",
                params: { locale: locale.value, section: "dashboard" },
            });
        }
    },
    { immediate: true },
);

const sectionLinks = computed(() => [
    { id: "dashboard", label: t('demo.page.section_dashboard'), svg: "laptop-mac-twotone" },
    { id: "checklists", label: t('demo.page.section_checklists'), svg: "task-complete" },
    { id: "personnel", label: t('demo.page.section_personnel'), svg: "people-community-24-filled" },
    { id: "eudr", label: t('demo.page.section_eudr'), svg: "qr-code-twotone" },
    { id: "reports", label: t('demo.page.section_reports'), svg: "report-search" },
]);

const sectionComponentMap = {
    dashboard: DashboardSectionAsync,
    checklists: ChecklistsSectionAsync,
    personnel: PersonnelSectionAsync,
    eudr: EudrSectionAsync,
    reports: ReportsSectionAsync,
};

const sectionConfigMap = computed(() => ({
    dashboard: { id: "dashboard", title: t('demo.page.section_dashboard'), inlineTitle: false },
    checklists: { id: "checklists", title: t('demo.page.section_checklists'), inlineTitle: false },
    personnel: { id: "personnel", title: t('demo.page.section_personnel'), inlineTitle: false },
    eudr: { id: "eudr", title: t('demo.page.section_eudr'), inlineTitle: false },
    reports: { id: "reports", title: t('demo.page.section_reports'), inlineTitle: true },
}));

const activeSectionComponent = computed(
    () => sectionComponentMap[activeSectionId.value] ?? null,
);

const activeSectionConfig = computed(
    () => sectionConfigMap.value[activeSectionId.value] ?? null,
);

const activeSectionProps = computed(() => {
    if (activeSectionId.value === "dashboard") {
        return {
            metrics: dashboardPanelData.value.metrics,
            hotTasks: dashboardPanelData.value.hotTasks,
            checklistsByNiche: demoState.value.checklistsByNiche,
            staff: demoState.value.staff,
        };
    }
    if (activeSectionId.value === "checklists") {
        return {
            checklistsByNiche: demoState.value.checklistsByNiche,
            staff: demoState.value.staff,
        };
    }
    if (activeSectionId.value === "eudr") {
        return {
            batches: demoState.value.batches,
        };
    }
    if (activeSectionId.value === "reports") {
        return {
            report: demoState.value.report,
            checklistsByNiche: demoState.value.checklistsByNiche,
            batches: demoState.value.batches,
            staff: demoState.value.staff,
        };
    }
    return {};
});

const setActiveSection = (sectionId) => {
    if (!DEMO_SECTION_IDS.has(sectionId)) return;
    router.push({
        name: "Demo",
        params: { locale: locale.value, section: sectionId },
    });
};

/** ISO YYYY-MM-DD для <time datetime> */
const todayIso = computed(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
});

/** Дата в локализованном формате на основе текущей локали из URL. */
const todayFormatted = computed(() => {
    return new Intl.DateTimeFormat(locale.value, {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date());
});

</script>

<style lang="scss" scoped>
@use "../../../../scss/variables" as *;

.demo-page {
    position: relative;
    flex: 1;
    background-color: $bg-gray;
    scroll-behavior: smooth;
}

.demo-topbar {
    background-color: $bg-style-white;
    border-bottom: 1px solid $text-light-grey;
    box-shadow: $shadow-sm;
}

.demo-topbar__inner {
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-md;
    flex-wrap: wrap;
    padding-top: $spacing-md;
    padding-bottom: $spacing-md;
}

.demo-date-picker {
    display: inline-flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-xs $spacing-sm-w $spacing-xs $spacing-md;
    min-height: 44px;
    border: 1px solid $text-light-grey;
    border-radius: $radius-lg;
    background-color: $bg-gray;
    color: $text-color;
    font-size: $font-size-sm;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: $transition-base;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65);

    &:hover {
        border-color: $accent-primary;
        color: $accent-primary;
        background-color: rgba($accent-primary, 0.06);
    }

    &:focus-visible {
        outline: 2px solid rgba($accent-primary, 0.55);
        outline-offset: 2px;
    }

    &::after {
        content: "▾";
        font-size: 20px;
        line-height: 1;
        opacity: 0.65;
        margin-left: -3px;
        flex-shrink: 0;
    }
}

.demo-date-picker__icon {
    display: flex;
    flex-shrink: 0;
    color: $accent-primary;
}

.demo-date-picker__text {
    white-space: nowrap;
}

.demo-topbar__date {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    text-align: right;
}

.demo-topbar__date-value {
    display: block;
    font-size: $font-size-lg;
    font-weight: 600;
    color: $text-color;
    font-variant-numeric: tabular-nums;
}

.demo-topbar-cta {
    display: none;
    margin: 25px auto 0 auto;
    width: fit-content;
    max-width: calc(100% - 32px);
    padding-left: $spacing-lg;
    padding-right: $spacing-lg;
    white-space: nowrap;
}

.demo-layout {
    display: flex;
    align-items: flex-start;
    gap: $spacing-xl;
    padding-top: $spacing-lg;
    padding-bottom: 40px;
}

.demo-sidebar {
    width: 280px;
    flex-shrink: 0;
    position: sticky;
    top: $spacing-xl;
    align-self: flex-start;
    z-index: 20;
    max-height: calc(100vh - #{$spacing-xl * 2});
    overflow-x: hidden;
    overflow-y: auto;
}

.demo-sidebar__cta {
    margin-top: $spacing-md;
    width: 100%;
    justify-content: center;
}

.demo-main {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
}

.demo-section {
    background-color: $bg-style-white;
    border: 1px solid $text-light-grey;
    border-radius: $radius-xxl;
    padding: $spacing-lg $spacing-xl $spacing-xl $spacing-xl;
    min-height: 220px;
    box-shadow: $shadow-sm;
    transition: box-shadow $transition-base ease;

    @media (max-width: 500px) {
        padding: $spacing-lg $spacing-md-lg $spacing-xl $spacing-md-lg;
    }

    &:hover {
        box-shadow: $shadow-md;
    }
}

.demo-section__title-row {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: $spacing-md;
    margin-bottom: 20px;
}

.demo-section__title {
    font-size: $font-size-2xl;
    color: $text-color;
    font-weight: 600;
    margin-bottom: 25px;
}

.demo-section__title--inline {
    margin-bottom: 0;
}

@media (max-width: $breakpoint-lg) {
    .demo-sidebar {
        display: none;
    }

    .demo-topbar-cta {
        display: flex;
    }
}

@media (min-width: $breakpoint-sm) {
    .demo-topbar__date {
        align-items: flex-start;
        text-align: left;
    }

    .demo-date-picker {
        justify-content: center;
    }
}

@media (prefers-reduced-motion: reduce) {
    .demo-section {
        transition: none;
    }
}
</style>
