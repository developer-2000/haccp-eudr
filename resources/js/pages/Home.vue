<template>
    <div class="container">
        <div class="section-container hero-section__content">
            <!-- Left Content -->
            <div class="hero-section__left">
                <h1>
                    Comply Easily with
                    <br />
                    Intuitive Food Safety Software
                </h1>
                <p class="hero-section__description">
                    Grow your business by cutting food safety labour and
                    boosting efficiency.
                    <strong
                        >Built for hospitality, healthcare, and retail – fully
                        adaptable for your needs.</strong
                    >
                </p>
                <div class="hero-section__buttons">
                    <button
                        class="btn-client btn-success btn-success-hero"
                        @click="goToRegistration"
                    >
                        TRY 14-DAY FREE TRIAL
                    </button>
                    <button class="btn-client btn-outline-primary">
                        GET A CUSTOM DEMO
                    </button>
                </div>
            </div>

            <!-- Right Content -->
            <div class="hero-section__right">
                <img
                    :src="'/images/devices.png'"
                    alt="Devices"
                    class="hero-image"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
defineOptions({
    name: "Home",
});

import { useRouter } from "vue-router";

const router = useRouter();

const goToRegistration = () => {
    router.push("/auth/register/account");
};
</script>

<style lang="scss" scoped>
@use "../../scss/variables" as *;

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
