<template>
    <div ref="aboutPageRootRef" class="container about-page">
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
                    @scroll.passive="scheduleActiveFromScroll"
                    @pointerdown.passive="releaseProgrammaticNavFromUserInput"
                >
                    <section class="about-fp-section">
                        <div class="about-fp">
                            <p class="about-fp__text">
                                Привет. Меня зовут Bagalov Shamil. Я разработчик
                                и создаю этот продукт один.
                            </p>
                            <p class="about-fp__text">
                                Я много лет работаю с веб-системами и
                                автоматизацией процессов.
                            </p>
                            <p class="about-fp__text">
                                И в какой-то момент увидел одну и ту же
                                проблему у бизнеса, который работает с
                                продуктами питания.
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
                                Если у тебя есть кухня, пекарня или производство
                                — ты это знаешь.
                            </p>
                            <ul class="about-fp__list">
                                <li class="about-fp__list-item">
                                    Проверки приходят неожиданно.
                                </li>
                                <li class="about-fp__list-item">
                                    Требования HACCP нужно соблюдать постоянно.
                                </li>
                                <li class="about-fp__list-item">
                                    Записи часто делают «потом», а не в моменте.
                                </li>
                                <li class="about-fp__list-item">
                                    Персонал забывает или игнорирует задачи.
                                </li>
                            </ul>
                            <p class="about-fp__text">В результате.</p>
                            <ul class="about-fp__list">
                                <li class="about-fp__list-item">
                                    Данные теряют доверие.
                                </li>
                                <li class="about-fp__list-item">
                                    Возрастает риск ошибок.
                                </li>
                                <li class="about-fp__list-item">
                                    Появляются штрафы и стресс.
                                </li>
                            </ul>
                            <p class="about-fp__text">
                                И чаще всего у тебя есть только 2 варианта.
                            </p>
                            <ul class="about-fp__list">
                                <li class="about-fp__list-item">
                                    Платить за сложные и дорогие решения.
                                </li>
                                <li class="about-fp__list-item">
                                    Или вести всё вручную и надеяться, что всё в
                                    порядке.
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
                                Я создаю систему, которая фиксирует процессы в
                                момент выполнения, а не задним числом.
                            </p>
                            <p class="about-fp__text">Каждое действие.</p>
                            <ul class="about-fp__list">
                                <li class="about-fp__list-item">
                                    Записывается по времени.
                                </li>
                                <li class="about-fp__list-item">
                                    Привязывается к сотруднику.
                                </li>
                                <li class="about-fp__list-item">
                                    Остаётся в системе как факт.
                                </li>
                            </ul>
                            <p class="about-fp__text">
                                Если задача не выполнена — фиксируется причина.
                            </p>
                            <p class="about-fp__text">Это даёт главное.</p>
                            <p
                                class="about-fp__text about-fp__text--with-inline-icon"
                            >
                                <Icon
                                    name="hand-point-right"
                                    class="about-fp__title-icon about-fp__title-icon--accent-orange"
                                    aria-hidden="true"
                                />
                                <span>
                                    Доказуемую и прозрачную историю соблюдения
                                    HACCP.
                                </span>
                            </p>
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
                                Я разработчик, и для меня важно следующее.
                            </p>
                            <ul class="about-fp__list">
                                <li class="about-fp__list-item">
                                    Лично пишу этот продукт.
                                </li>
                                <li class="about-fp__list-item">
                                    Лично отвечаю за его развитие.
                                </li>
                                <li class="about-fp__list-item">
                                    Делаю его так, как сделал бы для себя.
                                </li>
                            </ul>
                            <p class="about-fp__text">
                                Это означает простую вещь.
                            </p>
                            <p
                                class="about-fp__text about-fp__text--with-inline-icon"
                            >
                                <Icon
                                    name="hand-point-right"
                                    class="about-fp__title-icon about-fp__title-icon--accent-orange"
                                    aria-hidden="true"
                                />
                                <span>
                                    Мне важно, чтобы система реально
                                    использовалась в работе, а не просто
                                    выглядела функциональной.
                                </span>
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
                                    Фиксацию действий сотрудников в реальном
                                    времени.
                                </li>
                                <li class="about-fp__list-item">
                                    Прозрачную и понятную отчётность.
                                </li>
                                <li class="about-fp__list-item">
                                    Контроль выполнения задач и смен.
                                </li>
                                <li class="about-fp__list-item">
                                    Меньше риска ошибок и штрафов.
                                </li>
                                <li class="about-fp__list-item">
                                    Спокойствие при проверках.
                                </li>
                            </ul>
                            <p class="about-fp__text">Дополнительно.</p>
                            <p class="about-fp__text">
                                Ты можешь вести внутренние задачи для команды
                                (они не попадают в отчёты и остаются внутри
                                бизнеса).
                            </p>
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
                                чтобы сделать систему максимально полезной на
                                практике.
                            </p>
                            <p class="about-fp__text">
                                Если ты пройдёшь короткий опрос.
                            </p>
                            <ul class="about-fp__list">
                                <li class="about-fp__list-item">
                                    Система будет адаптирована под твои
                                    процессы.
                                </li>
                                <li class="about-fp__list-item">
                                    Ты получишь пожизненную скидку 20%.
                                </li>
                                <li class="about-fp__list-item">
                                    Сможешь повлиять на развитие продукта.
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
                                <span>Это займёт около 5 минут.</span>
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

// =============================================================================
// Мета компонента
// =============================================================================
defineOptions({
    name: "About",
});

// =============================================================================
// Константы
// =============================================================================
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

// =============================================================================
// Состояние (ref)
// =============================================================================
const aboutPageRootRef = ref(null);
const scrollRef = ref(null);
const activeIndex = ref(0);
const sectionCount = ref(0);
/** Кэш `HTMLElement` секций: один `querySelectorAll` при инициализации, без повторов на каждый scroll/wheel. */
const sectionsRef = ref([]);

/**
 * Контейнер snap-скролла и кэш секций — одна точка доступа (DRY).
 * @returns {{ root: HTMLElement | null, sections: HTMLElement[] }}
 */
function getContext() {
    return {
        root: scrollRef.value,
        sections: sectionsRef.value,
    };
}

/**
 * @param {number} val
 * @param {number} min
 * @param {number} max
 */
function clamp(val, min, max) {
    return Math.min(max, Math.max(min, val));
}

/**
 * Есть контейнер скролла и хотя бы одна секция в кэше.
 * @param {HTMLElement | null | undefined} root
 * @param {unknown[]} sections
 */
function isReady(root, sections) {
    return Boolean(root && sections.length);
}

// =============================================================================
// Секции: DOM и прокрутка
// =============================================================================
/**
 * Заполняет `sectionsRef` из DOM (вызывать после того, как `scrollRef` смонтирован).
 */
function initSections() {
    const { root } = getContext();
    if (!root) {
        sectionsRef.value = [];
        return;
    }
    sectionsRef.value = [...root.querySelectorAll(".about-fp-section")];
}

/** rAF для синхронизации активной точки со скроллом (без лишних вызовов). */
let activeScrollRaf = null;

/**
 * Пока идёт `scrollTo(..., { behavior: 'smooth' })`, промежуточные `scrollTop`
 * иначе перезаписывали бы activeIndex — навбар отставал от цели на длительность анимации.
 */
let programmaticNavIndex = null;
/** Поколение программного скролла (игнор устаревших scrollend/timeout). */
let programmaticNavGen = 0;

/**
 * Активная секция: максимальное пересечение с вьюпортом (симметрично вверх/вниз).
 * Старый критерий «max i : offsetTop ≤ scrollTop» давал задержку вниз на длинных блоках:
 * индекс переключался только когда верх следующей секции доходил до верха контейнера.
 */
function syncActiveFromScroll() {
    if (programmaticNavIndex !== null) {
        return;
    }
    const { root, sections } = getContext();
    if (!isReady(root, sections)) {
        return;
    }
    const st = root.scrollTop;
    const maxScroll = Math.max(0, root.scrollHeight - root.clientHeight);
    const vh = root.clientHeight;
    const viewportTop = st;
    const viewportBottom = st + vh;
    const vCenter = viewportTop + vh / 2;

    if (maxScroll > 0 && st >= maxScroll - 1) {
        const last = sections.length - 1;
        if (activeIndex.value !== last) {
            activeIndex.value = last;
        }
        return;
    }

    let bestIdx = 0;
    let bestOverlap = -1;
    let bestCenterDist = Infinity;
    for (let i = 0; i < sections.length; i++) {
        const el = sections[i];
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;
        const overlap = Math.max(
            0,
            Math.min(bottom, viewportBottom) - Math.max(top, viewportTop),
        );
        const secCenter = (top + bottom) / 2;
        const centerDist = Math.abs(vCenter - secCenter);
        if (
            overlap > bestOverlap ||
            (overlap === bestOverlap &&
                overlap > 0 &&
                centerDist < bestCenterDist)
        ) {
            bestOverlap = overlap;
            bestCenterDist = centerDist;
            bestIdx = i;
        }
    }

    if (bestOverlap <= 0) {
        let idx = 0;
        for (let i = 0; i < sections.length; i++) {
            if (sections[i].offsetTop <= st + 1) {
                idx = i;
            } else {
                break;
            }
        }
        bestIdx = idx;
    }

    if (activeIndex.value !== bestIdx) {
        activeIndex.value = bestIdx;
    }
}

function scheduleActiveFromScroll() {
    if (activeScrollRaf != null) {
        return;
    }
    activeScrollRaf = requestAnimationFrame(() => {
        activeScrollRaf = null;
        syncActiveFromScroll();
    });
}

/**
 * Плавный скролл к началу секции по индексу (клик по точке, программный шаг).
 */
function goToSection(index) {
    const { root, sections } = getContext();
    if (!isReady(root, sections)) {
        return;
    }
    const sec = sections[index];
    if (!sec) {
        return;
    }
    const gen = ++programmaticNavGen;
    programmaticNavIndex = index;
    activeIndex.value = index;
    const rootRect = root.getBoundingClientRect();
    const secRect = sec.getBoundingClientRect();
    const top = root.scrollTop + (secRect.top - rootRect.top);
    root.scrollTo({ top, behavior: "smooth" });

    const finishProgrammaticNav = () => {
        if (gen !== programmaticNavGen) {
            return;
        }
        programmaticNavIndex = null;
        syncActiveFromScroll();
    };
    root.addEventListener("scrollend", finishProgrammaticNav, { once: true });
    window.setTimeout(finishProgrammaticNav, 900);
}

/** Снять пин при явном вводе в области контента (без wheel: иначе тачпад во время smooth-scroll снимал пин и навбар откатывался). */
function releaseProgrammaticNavFromUserInput() {
    if (programmaticNavIndex === null) {
        return;
    }
    programmaticNavGen += 1;
    programmaticNavIndex = null;
    scheduleActiveFromScroll();
}

// =============================================================================
// Навигация точками (подписи и a11y)
// =============================================================================
/**
 * Буква на кнопке точки (welcome W–E–L–C–O–M–E или номер при сбое данных).
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
 * Текст для `aria-label` кнопки точки (скринридеры).
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

// =============================================================================
// Колесо: вне .about-page__fp-scroll — шаг по секциям (document capture — шапка и зоны вне container)
// =============================================================================
/** @type {((e: WheelEvent) => void) | null} */
let wheelForwardHandler = null;

const FP_SCROLL_SNAP_OFF_CLASS = "about-page__fp-scroll--snap-off";

/**
 * Колесо вне snap-области (шапка сайта, фото, заголовок About): шаг по секциям как у snap.
 * Слушатель на `document` + capture — иначе не ловятся узлы вне `.container.about-page`.
 * Внутри `.about-page__fp-scroll` — выход без preventDefault (нативный snap).
 * Направление: `Math.sign(e.deltaY)` (без DOM_DELTA_LINE / PAGE).
 */
function handleAboutGlobalWheel(e) {
    const { root } = getContext();
    if (!root) {
        return;
    }
    const sc = root;
    const t = e.target;
    const inside = t instanceof Node && (sc === t || sc.contains(t));
    if (inside) {
        if (sc.classList.contains(FP_SCROLL_SNAP_OFF_CLASS)) {
            sc.classList.remove(FP_SCROLL_SNAP_OFF_CLASS);
        }
        return;
    }

    const dir = Math.sign(e.deltaY);

    e.preventDefault();
    e.stopPropagation();
    const total = sectionCount.value;
    const cur = activeIndex.value;
    const nextIdx =
        dir === 0 || total < 1
            ? cur
            : clamp(cur + dir, 0, total - 1);

    if (nextIdx === cur) {
        return;
    }

    sc.classList.remove(FP_SCROLL_SNAP_OFF_CLASS);
    goToSection(nextIdx);
}

// =============================================================================
// Жизненный цикл
// =============================================================================
/**
 * Инициализация секций, активной точки по скроллу; wheel на `document` (захват зон вне container About).
 */
onMounted(() => {
    nextTick(() => {
        initSections();
        const { root, sections } = getContext();
        if (isReady(root, sections)) {
            sectionCount.value = sections.length;
            syncActiveFromScroll();
        }

        wheelForwardHandler = handleAboutGlobalWheel;
        document.addEventListener("wheel", wheelForwardHandler, {
            passive: false,
            capture: true,
        });
    });
});

/**
 * Снятие wheel при уходе со страницы About.
 */
onUnmounted(() => {
    if (activeScrollRaf != null) {
        cancelAnimationFrame(activeScrollRaf);
        activeScrollRaf = null;
    }
    programmaticNavGen += 1;
    programmaticNavIndex = null;

    sectionsRef.value = [];

    if (wheelForwardHandler) {
        document.removeEventListener("wheel", wheelForwardHandler, {
            passive: false,
            capture: true,
        });
        wheelForwardHandler = null;
    }
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
    background-color: $bg-style-white;

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
                /* Плавный скролл — только в goToSection (scrollTo behavior: smooth). Не задавать scroll-behavior: smooth здесь: ломает программный scrollTo при wheel с фото. */
                padding-right: 40px;

                &.about-page__fp-scroll--snap-off {
                    scroll-snap-type: none;
                }
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

                                /* :deep — класс на корне Icon (часто <svg>, не только обёртка vicons) */
                                :deep(.about-fp__text-icon) {
                                    flex-shrink: 0;
                                    width: 1.25em;
                                    height: 1.25em;
                                    color: $text-color;
                                    display: inline-flex;
                                    align-items: center;
                                    justify-content: center;
                                }

                                :deep(.about-fp__text-icon svg) {
                                    width: 100%;
                                    height: 100%;
                                    display: block;
                                }

                                :deep(svg.about-fp__text-icon) {
                                    display: block;
                                    box-sizing: border-box;
                                }

                                :deep(.about-fp__title-icon) {
                                    flex-shrink: 0;
                                    width: 1.35em;
                                    height: 1.35em;
                                    display: inline-flex;
                                    align-items: center;
                                    justify-content: center;
                                }

                                :deep(.about-fp__title-icon.about-fp__title-icon--accent-orange) {
                                    color: $accent-orange;
                                }

                                :deep(.about-fp__title-icon svg) {
                                    width: 100%;
                                    height: 100%;
                                    display: block;
                                }

                                :deep(svg.about-fp__title-icon) {
                                    display: block;
                                    box-sizing: border-box;
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
                pointer-events: none;

                .about-page__nav-dot-wrap {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    pointer-events: none;
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
                    pointer-events: auto;
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

@media (max-width: 1050px) {
    .about-page {
        padding: 20px 15px 0 15px;

        .about-page__title-bar{
            padding-bottom: 0;

            .about-page__heading{
                text-align: center;
            }
        }

        .about-page__split {
            flex-direction: column;
            overflow: auto;

            .about-page__photo {
                max-width: 100px;
                margin-bottom: 0;
                flex: 0 1 100px;
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
