<template>
    <div class="hero-section__content">
        <div class="hero-section__left">
            <h1>
                {{ $t("home.hero.title_line1") }}
            </h1>
            <p class="hero-section__description">
                <strong>{{ $t("home.hero.description_prefix") }}</strong>
                {{ $t("home.hero.description_emphasis") }}
            </p>
            <div class="hero-section__buttons">
                <button
                    class="btn-client btn-success btn-success-hero"
                    @click="goToSurvey"
                >
                    {{ $t("home.hero.tell_about_business") }}
                </button>
                <button
                    class="btn-client btn-outline-primary"
                    @click="goToDemo"
                >
                    {{ $t("home.hero.view_demo") }}
                </button>
            </div>
        </div>

        <div class="hero-section__right">
            <img
                :src="'/images/tablets.jpg'"
                :alt="$t('home.hero.devices_alt')"
                class="hero-image"
            />
        </div>
    </div>
</template>

<script setup>
defineOptions({
    name: "Hero",
});

import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const getCurrentLocale = () => route.params.locale ?? "en";

const goToSurvey = () => {
    router.push("/" + getCurrentLocale() + "/survey");
};

const goToDemo = () => {
    router.push("/" + getCurrentLocale() + "/demo/dashboard");
};
</script>

<style lang="scss" scoped>
@use "../../../../scss/variables" as *;

.hero-section__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 3rem;

    @media (min-width: 1024px) {
        flex-direction: row;
    }
}

.hero-section__left {
    width: 100%;
    text-align: center;

    @media (min-width: 1024px) {
        width: 50%;
        text-align: left;
    }
}

.hero-section__description {
    margin-top: 1.5rem;
    font-size: 1.125rem;
    color: $text-dark-grey;
    max-width: 36rem;
    margin-left: auto;
    margin-right: auto;
    text-align: left;

    @media (min-width: 1024px) {
        margin-left: 0;
        margin-right: 0;
    }

    strong {
        font-weight: 600;
    }
}

.hero-section__buttons {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    @media (min-width: 640px) {
        flex-direction: row;
    }

    @media (min-width: 1024px) {
        justify-content: flex-start;
    }

    .btn-success-hero {
        box-shadow: $shadow-lg, $shadow-sm-md;
    }
}

.hero-section__right {
    width: 100%;
    margin-top: 3rem;

    @media (min-width: 1024px) {
        width: 50%;
        margin-top: 0;
    }
}

.hero-image {
    width: 100%;
    height: auto;
    display: block;
}
</style>
