<!-- Intro-экран: приветствие, описание опроса, кнопка «Начать».
     Показывается когда пользователь ещё не проходил опрос (нет записи в localStorage). -->
<template>
    <div class="survey-page__block survey-page__block--intro">
        <div class="survey-page__intro-main">
            <h1
                id="survey-step-heading"
                class="survey-page__title survey-page__title--hero survey-page__text-wrap"
                tabindex="-1"
            >
                {{ t("survey.intro.title") }}
            </h1>
            <p class="survey-page__subtitle survey-page__text-wrap">
                {{ t("survey.intro.subtitle") }}
            </p>
            <p class="survey-page__trust survey-page__text-wrap">
                {{ t("survey.intro.trust") }}
            </p>
        </div>
        <footer class="survey-page__footer">
            <button
                type="button"
                class="survey-page__primary survey-primary-action"
                @click="emit('start')"
            >
                {{ t("survey.intro.start") }}
            </button>
        </footer>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

defineOptions({ name: "SurveyIntroScreen" });

const emit = defineEmits(["start"]);

const { t } = useI18n();
</script>

<style scoped lang="scss">
@use "../../../../../scss/variables" as *;

.survey-page__block {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
}

.survey-page__block--intro {
    padding-top: 4px;

    .survey-page__intro-main {
        text-align: center;
        margin-top: 5%;

        .survey-page__title {
            font-size: 1.25rem;
            line-height: 1.35;
            color: $text-color;
            margin: 0 0 12px;

            &.survey-page__title--hero {
                font-size: 1.5rem;
                line-height: 1.3;
                font-weight: 700;
            }
        }

        .survey-page__subtitle {
            font-size: 1rem;
            color: $text-slate-700;
            margin: 0 0 12px;
            line-height: 1.45;
        }

        .survey-page__trust {
            font-size: 0.8125rem;
            color: $text-slate-500;
            margin: 0 0 20px;
            line-height: 1.4;
        }
    }
}
</style>
