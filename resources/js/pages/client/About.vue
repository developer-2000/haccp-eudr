<template>
    <div class="container about-page">
        <header class="about-page__title-bar">
            <h1 class="about-page__heading">О проекте.</h1>
        </header>
        <div class="about-page__split">
            <aside class="about-page__photo" aria-hidden="true">
                <img
                    class="about-page__photo-img"
                    :src="'/images/bagalov-shamil.jpg'"
                    alt=""
                    decoding="async"
                />
            </aside>

            <div class="about-page__fp">
                <div
                    ref="scrollRef"
                    class="about-page__fp-scroll"
                    tabindex="0"
                    role="region"
                    aria-label="Секции: о себе"
                >
                    <section class="about-fp-section">
                        <div class="about-fp">
                            <p class="about-fp__text">
                                Привет. Меня зовут Bagalov Shamil. Я разработчик,
                                и я создаю этот продукт один.
                            </p>
                            <p class="about-fp__text">
                                Уже много лет я работаю с веб-системами и
                                автоматизацией процессов.
                            </p>
                            <p class="about-fp__text">
                                И в какой-то момент я увидел одну и ту же
                                проблему у малого бизнеса снова и снова.
                            </p>
                        </div>
                    </section>

                    <section class="about-fp-section">
                        <div class="about-fp">
                            <h2
                                class="about-fp__title about-fp__title--with-icon"
                            >
                                <ExclamationCircleTwotone
                                    class="about-fp__title-icon about-fp__title-icon--danger"
                                    aria-hidden="true"
                                />
                                <span class="about-fp__title-label">В чем проблема</span>
                            </h2>
                            <p class="about-fp__text">
                                Если у тебя есть кухня, пекарня или работа с
                                продуктами — ты это знаешь:
                            </p>
                            <ul class="about-fp__list">
                                <li class="about-fp__list-item">
                                    Проверки приходят неожиданно
                                </li>
                                <li class="about-fp__list-item">
                                    Требования HACCP нужно соблюдать постоянно
                                </li>
                                <li class="about-fp__list-item">
                                    Отчётность либо неудобная, либо дорогая
                                </li>
                                <li class="about-fp__list-item">
                                    Ошибки → штрафы, стресс, потери времени
                                </li>
                            </ul>
                            <p class="about-fp__text">
                                И чаще всего у тебя есть только 2 варианта:
                            </p>
                            <ul class="about-fp__list">
                                <li class="about-fp__list-item">
                                    Платить за дорогие решения
                                </li>
                                <li class="about-fp__list-item">
                                    Или пытаться вести всё вручную
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section class="about-fp-section">
                        <div class="about-fp">
                            <h2
                                class="about-fp__title about-fp__title--with-icon"
                            >
                                <Bulb
                                    class="about-fp__title-icon about-fp__title-icon--accent-orange"
                                    aria-hidden="true"
                                />
                                <span class="about-fp__title-label">Что я делаю</span>
                            </h2>
                            <p class="about-fp__text">
                                Я создаю систему, которая упрощает соблюдение
                                HACCP, а не усложняет его.
                            </p>
                            <ul class="about-fp__list">
                                <li class="about-fp__list-item">
                                    Без перегруженных интерфейсов.
                                </li>
                                <li class="about-fp__list-item">
                                    Без лишних функций.
                                </li>
                                <li class="about-fp__list-item">
                                    Только то, что реально нужно в работе.
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section class="about-fp-section">
                        <div class="about-fp">
                            <h2
                                class="about-fp__title about-fp__title--with-icon"
                            >
                                <ManageAccountsTwotone
                                    class="about-fp__title-icon about-fp__title-icon--accent-success-dark"
                                    aria-hidden="true"
                                />
                                <span class="about-fp__title-label">Почему я</span>
                            </h2>
                            <p class="about-fp__text">
                                Я не компания и не стартап с инвесторами.
                            </p>
                            <p class="about-fp__text">
                                Я один разработчик, который:
                            </p>
                            <ul class="about-fp__list">
                                <li class="about-fp__list-item">
                                    Лично пишу этот продукт
                                </li>
                                <li class="about-fp__list-item">
                                    Лично отвечаю за его развитие
                                </li>
                                <li class="about-fp__list-item">
                                    Делаю его так, как сделал бы для себя
                                </li>
                            </ul>
                            <p class="about-fp__text">
                                Это означает простую вещь:
                            </p>
                            <p class="about-fp__text">
                                Мне важно, чтобы система действительно работала
                                для тебя, а не просто продавалась.
                            </p>
                        </div>
                    </section>

                    <section class="about-fp-section">
                        <div class="about-fp">
                            <h2
                                class="about-fp__title about-fp__title--with-icon"
                            >
                                <Icon
                                    name="schedule-twotone"
                                    class="about-fp__title-icon about-fp__title-icon--accent-primary"
                                    aria-hidden="true"
                                />
                                <span class="about-fp__title-label">Что ты получаешь</span>
                            </h2>
                            <ul class="about-fp__list">
                                <li class="about-fp__list-item">
                                    Меньше ручной работы
                                </li>
                                <li class="about-fp__list-item">
                                    Понятную отчётность
                                </li>
                                <li class="about-fp__list-item">
                                    Меньше риска ошибок
                                </li>
                                <li class="about-fp__list-item">
                                    Больше спокойствия при проверках
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section class="about-fp-section">
                        <div class="about-fp">
                            <h2
                                class="about-fp__title about-fp__title--with-icon"
                            >
                                <Icon
                                    name="target-arrow-24-regular"
                                    class="about-fp__title-icon about-fp__title-icon--danger"
                                    aria-hidden="true"
                                />
                                <span class="about-fp__title-label">Почему стоит пройти опрос</span>
                            </h2>
                            <p class="about-fp__text">
                                Сейчас я собираю реальные потребности бизнеса,
                                чтобы сделать продукт максимально полезным.
                            </p>
                            <p class="about-fp__text">
                                Если ты пройдёшь короткий опрос:
                            </p>
                            <ul class="about-fp__list">
                                <li class="about-fp__list-item">
                                    Система будет адаптирована под твой тип
                                    бизнеса
                                </li>
                                <li class="about-fp__list-item">
                                    Ты получишь пожизненную скидку 20%
                                </li>
                                <li class="about-fp__list-item">
                                    Станешь одним из первых пользователей, чьи
                                    задачи реально влияют на продукт
                                </li>
                            </ul>
                            <p
                                class="about-fp__text about-fp__text--with-inline-icon"
                            >
                                <Icon
                                    name="watch-later-twotone"
                                    class="about-fp__text-icon"
                                    aria-hidden="true"
                                />
                                <span>Это займет около 5 минут.</span>
                            </p>
                        </div>
                    </section>

                    <section class="about-fp-section about-fp-section--cta">
                        <div class="about-fp about-fp--cta">
                            <div class="about-fp__cta-surface">
                                <SurveyCtaSection />
                            </div>
                        </div>
                    </section>
                </div>

                <nav
                    class="about-page__nav-dots"
                    aria-label="Навигация по секциям"
                >
                    <div
                        v-for="i in sectionCount"
                        :key="i"
                        class="about-page__nav-dot-wrap"
                    >
                        <span
                            v-if="
                                activeIndex === i - 1 &&
                                sectionCount > 1 &&
                                i > 1
                            "
                            class="about-page__nav-arrow about-page__nav-arrow--up"
                            aria-hidden="true"
                        />
                        <button
                            type="button"
                            class="about-page__nav-dot"
                            :class="{
                                'about-page__nav-dot--active':
                                    activeIndex === i - 1,
                            }"
                            :aria-label="navDotAriaLabel(i - 1)"
                            :aria-current="
                                activeIndex === i - 1 ? 'true' : undefined
                            "
                            @click="goToSection(i - 1)"
                        >
                            <span
                                class="about-page__nav-dot-letter"
                                aria-hidden="true"
                                >{{ navDotLetter(i - 1) }}</span
                            >
                        </button>
                        <span
                            v-if="
                                activeIndex === i - 1 &&
                                sectionCount > 1 &&
                                i < sectionCount
                            "
                            class="about-page__nav-arrow about-page__nav-arrow--down"
                            aria-hidden="true"
                        />
                    </div>
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import { ExclamationCircleTwotone } from "@vicons/antd";
import { Bulb } from "@vicons/ionicons5";
import { ManageAccountsTwotone } from "@vicons/material";
import Icon from "@/components/Icon.vue";
import SurveyCtaSection from "@/components/client/home/SurveyCtaSection.vue";

defineOptions({
    name: "About",
});

/** Буквы «welcome» по одной на маркер секции (7 секций) */
const WELCOME_MARKERS = Object.freeze([
    "W",
    "E",
    "L",
    "C",
    "O",
    "M",
    "E",
]);

const scrollRef = ref(null);
const activeIndex = ref(0);
const sectionCount = ref(0);

function getSections() {
    const root = scrollRef.value;
    if (!root) {
        return [];
    }
    return [...root.querySelectorAll(".about-fp-section")];
}

/**
 * @param {number} index - 0-based индекс секции
 */
function navDotLetter(index) {
    const letter = WELCOME_MARKERS[index];
    if (letter) {
        return letter;
    }
    return String(index + 1);
}

/**
 * @param {number} index - 0-based индекс секции
 */
function navDotAriaLabel(index) {
    const letter = WELCOME_MARKERS[index];
    const n = index + 1;
    if (letter) {
        return `Секция ${n}, буква «${letter}» (welcome)`;
    }
    return `Секция ${n}`;
}

function updateActive() {
    const root = scrollRef.value;
    const sections = getSections();
    if (!root || !sections.length) {
        return;
    }
    const rootRect = root.getBoundingClientRect();
    let best = 0;
    let bestOverlap = -1;
    sections.forEach((sec, i) => {
        const r = sec.getBoundingClientRect();
        const overlap = Math.max(
            0,
            Math.min(r.bottom, rootRect.bottom) -
                Math.max(r.top, rootRect.top),
        );
        if (overlap > bestOverlap) {
            bestOverlap = overlap;
            best = i;
        }
    });
    activeIndex.value = best;
}

function goToSection(index) {
    const root = scrollRef.value;
    const sections = getSections();
    const sec = sections[index];
    if (!root || !sec) {
        return;
    }
    const rootRect = root.getBoundingClientRect();
    const secRect = sec.getBoundingClientRect();
    const top = root.scrollTop + (secRect.top - rootRect.top);
    root.scrollTo({ top, behavior: "smooth" });
}

let scrollHandler = null;
/** @type {HTMLElement | null} */
let scrollRootEl = null;

onMounted(() => {
    nextTick(() => {
        const root = scrollRef.value;
        if (!root) {
            return;
        }
        scrollRootEl = root;
        sectionCount.value = getSections().length;
        updateActive();
        scrollHandler = () => updateActive();
        root.addEventListener("scroll", scrollHandler, { passive: true });
    });
});

onUnmounted(() => {
    if (scrollRootEl && scrollHandler) {
        scrollRootEl.removeEventListener("scroll", scrollHandler);
    }
    scrollRootEl = null;
});
</script>

<style scoped lang="scss">
@use "../../../scss/variables" as *;

.about-page {
    position: relative;
    z-index: 0;
    flex: 1;
    min-height: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 60px 30px 0 80px;
    background-color: $bg-light-grey;

    &::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 0;
        background-image: url("/images/haccp_checklist.jpg");
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        opacity: 0.08;
        filter: blur(1px);
        pointer-events: none;
    }

    .about-page__title-bar {
        position: relative;
        z-index: 1;
        flex-shrink: 0;
        padding-bottom: $spacing-md;

        .about-page__heading {
            font-size: $font-size-2-5xl;
            font-weight: 700;
            color: $text-color;
        }
    }

    .about-page__split {
        position: relative;
        z-index: 1;
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: row;
        overflow: hidden;
        gap: $spacing-md;

        .about-page__photo {
            box-sizing: border-box;
            flex: 0 1 400px;
            width: 100%;
            max-width: 400px;
            min-width: 0;
            align-self: center;
            overflow: hidden;
            border-radius: 8px;

            .about-page__photo-img {
                display: block;
                width: 100%;
                max-width: 100%;
                height: auto;
            }
        }

        .about-page__fp {
            flex: 1;
            min-height: 0;
            min-width: 0;
            position: relative;
            display: flex;
            flex-direction: column;

            .about-page__fp-scroll {
                flex: 1;
                min-height: 0;
                height: 100%;
                overflow-y: auto;
                overflow-x: hidden;
                scroll-snap-type: y mandatory;
                scroll-behavior: smooth;
                padding-right: 40px;
                box-sizing: border-box;
                scrollbar-width: none;
                -ms-overflow-style: none;

                &::-webkit-scrollbar {
                    display: none;
                    width: 0;
                    height: 0;
                }

                .about-fp-section {
                    min-height: 100%;
                    scroll-snap-align: start;
                    scroll-snap-stop: always;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    box-sizing: border-box;

                    &.about-fp-section--cta {
                        justify-content: center;
                    }

                    .about-fp {
                        max-width: 42rem;
                        margin: 0 auto;
                        padding: $spacing-lg;
                        width: 100%;

                        &.about-fp--cta {
                            max-width: none;
                        }

                        .about-fp__cta-surface {
                            width: 100%;
                            border-radius: $radius-lg;
                            overflow: hidden;
                            background-color: $accent-primary;
                            padding: $spacing-xl $spacing-lg;
                            box-sizing: border-box;

                            :deep(.survey-cta) {
                                min-height: auto;
                            }
                        }

                        .about-fp__title {
                            margin: 0 0 $spacing-md 0;
                            font-size: $font-size-2xl;
                            font-weight: 700;
                            line-height: 1.25;
                            color: $text-color;

                            &.about-fp__title--with-icon {
                                display: flex;
                                align-items: center;
                                gap: $spacing-sm;
                            }

                            .about-fp__title-icon {
                                flex-shrink: 0;
                                width: 1.35em;
                                height: 1.35em;
                                display: inline-flex;
                                align-items: center;
                                justify-content: center;

                                :deep(svg) {
                                    width: 100%;
                                    height: 100%;
                                    display: block;
                                }

                                &.about-fp__title-icon--danger {
                                    color: $text-red;
                                }

                                &.about-fp__title-icon--accent-orange {
                                    color: $accent-orange;
                                }

                                &.about-fp__title-icon--accent-success-dark {
                                    color: $accent-primary;
                                }

                                &.about-fp__title-icon--accent-primary {
                                    color: $accent-success-dark;
                                }
                            }

                            .about-fp__title-label {
                                flex: 1;
                                min-width: 0;
                            }
                        }

                        .about-fp__text {
                            margin: 0 0 $spacing-md 0;
                            font-size: $font-size-lg;
                            line-height: 1.45;
                            color: $text-color;

                            &:last-child {
                                margin-bottom: 0;
                            }

                            &.about-fp__text--with-inline-icon {
                                display: flex;
                                align-items: center;
                                gap: $spacing-sm;

                                .about-fp__text-icon {
                                    flex-shrink: 0;
                                    width: 1.25em;
                                    height: 1.25em;
                                    color: $text-color;
                                    display: inline-flex;
                                    align-items: center;
                                    justify-content: center;

                                    :deep(svg) {
                                        width: 100%;
                                        height: 100%;
                                        display: block;
                                    }
                                }
                            }
                        }

                        .about-fp__list {
                            margin: 0 0 $spacing-md 0;
                            padding-left: 1.25rem;
                            list-style: disc;
                            color: $text-color;

                            .about-fp__list-item {
                                margin-bottom: $spacing-sm;
                                font-size: $font-size-lg;
                                line-height: 1.45;

                                &:last-child {
                                    margin-bottom: 0;
                                }
                            }
                        }

                        .about-fp__title + .about-fp__text,
                        .about-fp__title + .about-fp__list {
                            margin-top: 0;
                        }
                    }
                }
            }

            .about-page__nav-dots {
                position: absolute;
                right: 4px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 2;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
                margin: 0;
                padding: 0;
                pointer-events: auto;

                .about-page__nav-dot-wrap {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .about-page__nav-arrow {
                    display: block;
                    width: 0;
                    height: 0;
                    border-left: 5px solid transparent;
                    border-right: 5px solid transparent;
                }

                .about-page__nav-arrow.about-page__nav-arrow--up {
                    border-bottom: 7px solid #b3b3b3;
                }

                .about-page__nav-arrow.about-page__nav-arrow--down {
                    border-top: 7px solid #b3b3b3;
                }

                .about-page__nav-dot {
                    min-width: 30px;
                    min-height: 30px;
                    cursor: pointer;
                    border: 1px solid #b3b3b3;
                    background-color: #dfdfdf;
                    transition: background-color 0.3s ease;

                    .about-page__nav-dot-letter {
                        font-size: 20px;
                        font-weight: 400;
                        line-height: 1;
                        color: $text-color;
                        transition: color 0.3s ease;
                    }

                    &.about-page__nav-dot--active {
                        background: none;
                        border-color: transparent;

                        .about-page__nav-dot-letter {
                            color: $accent-primary;
                        }
                    }

                    &:hover:not(.about-page__nav-dot--active) {
                        background-color: $bg-light-grey-hover;
                        border-color: transparent;
                    }
                }
            }
        }

        .about-page__photo,
        .about-page__fp {
            margin-bottom: 5%;
        }
    }
}

@media (max-width: 768px) {
    .about-page {
        .about-page__split {
            flex-direction: column;
            overflow: auto;
        }

        .about-page__photo {
            flex: 0 1 auto;
            width: 100%;
            max-width: none;
            align-self: stretch;

            .about-page__photo-img {
                width: 100%;
                height: auto;
            }
        }

        .about-page__fp {
            flex: 1 1 auto;
            min-height: 60vh;
        }

        .about-page__fp-scroll {
            padding-right: 36px;
        }

        .about-page__nav-dots {
            right: 2px;
        }
    }
}
</style>
