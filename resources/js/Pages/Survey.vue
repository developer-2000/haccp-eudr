<template>
    <SeoHead :seo="seo" />

    <div class="survey-page container">
        <div v-if="questionsLoadError" class="survey-page__api-error" role="alert">
            {{ questionsLoadError }}
        </div>
        <SurveyDigitalCodeVerification
            v-if="activeScreen === 'verification'"
            ref="pinVerificationRef"
            :attempts-left="pinAttemptsLeft"
            :total-attempts="pinAttemptsTotal"
            @complete="handlePinComplete"
        />

        <SurveySubmittedState
            v-else-if="activeScreen === 'submitted'"
            :masked-email="submittedState.maskedEmail"
            :submitted-at="submittedState.submittedAt"
            @reset-survey="resetSurveyFromSubmittedState"
        />

        <SurveyIntroScreen
            v-else-if="activeScreen === 'intro'"
            @start="goNextSurveyStep"
        />

        <SurveySuccessScreen
            v-else-if="activeScreen === 'success'"
            :success-copy="successCopy"
            :home-href="surveyHomeHref"
        />

        <SurveyMainFlow
            v-else-if="activeScreen === 'survey'"
            :progress-numerator="progressNumerator"
            :progress-denominator="progressDenominator"
            :progress-percent="progressPercent"
            :progress-bar-aria-label="progressBarAriaLabel"
            :can-go-back="canGoBack"
            :render-ready="isSurveyRenderReady"
            :transition-step-key="transitionStepKey"
            :instant-transition="skipIntroQuestionTransitionOnce"
            @go-back="goPreviousSurveyStep"
        >
            <SurveyLeadScreen
                v-if="currentStepId === SURVEY_FLOW_STEP_LEAD"
                :answers="answers"
                :email-error="validation.leadEmailError"
                :loading="leadSubmitting"
                :submit-label="leadSubmitButtonLabel"
                :submit-error="validation.leadSubmitError"
                @submit="markSurveySubmitted"
            />

            <SurveyQuestionStep
                v-else-if="currentQuestion"
                :question="currentQuestion"
                :step-id="currentStepId"
                :answers="answers"
                :other-detail-key="otherDetailAnswerKey"
                :show-other-field="showOtherDetailField"
                :show-next-button="showQuestionNextButton"
                :next-disabled="questionStepNextDisabled"
                @pick-radio="onPickRadio"
                @toggle-checkbox="onToggleCheckbox"
                @next="goNextSurveyStep"
            />
        </SurveyMainFlow>
    </div>
</template>

<script setup>
import {
    computed,
    nextTick,
    onMounted,
    onUnmounted,
    reactive,
    ref,
    watch,
} from "vue";
import apiAxios from "@/utils/apiAxios.js";
import { toast } from "vue3-toastify";
import { useI18n } from "vue-i18n";
import {
    SURVEY_FLOW_STEP_INTRO,
    SURVEY_DIGITAL_CODE_VERIFICATION,
    SURVEY_FLOW_STEP_LEAD,
    SURVEY_FLOW_STEP_SUCCESS,
    getSurveyProgressTotal,
    buildVisibleSurveyStepIds,
    resolveBranchStepId,
    clearBranchDerivedAnswers,
    SURVEY_RADIO_AUTO_ADVANCE_MS,
    isSurveyQuestionAnswerValid,
    surveyRadioAllowsAutoAdvance,
    surveyQuestionUsesNextButton,
    surveyLeadEmailErrorMessage,
    maskSurveyEmail,
} from "@/features/survey/surveyFlow.js";
import {
    SURVEY_PAGE_SUCCESS,
    getSurveyQuestionByStepId,
    getSurveyQuestionsById,
    getSurveyBranchParentId,
    replaceSurveyQuestionsById,
    surveyOtherDetailKey,
    surveyQuestionAllOptions,
} from "@/features/survey/surveyQuestionsStub.js";
import SurveyQuestionStep from "@/components/client/survey/SurveyQuestionStep.vue";
import SurveySubmittedState from "@/components/client/survey/SurveySubmittedState.vue";
import SurveyMainFlow from "@/components/client/survey/screens/SurveyMainFlow.vue";
import SurveyIntroScreen from "@/components/client/survey/screens/SurveyIntroScreen.vue";
import SurveySuccessScreen from "@/components/client/survey/screens/SurveySuccessScreen.vue";
import SurveyLeadScreen from "@/components/client/survey/screens/SurveyLeadScreen.vue";

import SurveyDigitalCodeVerification from "@/components/client/survey/SurveyDigitalCodeVerification.vue";
import { LS_SURVEY_SUBMISSION_STATE, SS_VERIFICATION_TOKEN } from "@/config/storageNames";
import SeoHead from "@/components/SeoHead.vue";
import PublicLayout from "@/Layouts/PublicLayout.vue";
import { useCurrentLocale } from "@/composables/useCurrentLocale.js";

defineOptions({
    name: "Survey",
    layout: PublicLayout,
});

const props = defineProps({
    seo: {
        type: Object,
        required: true,
    },
    questions: {
        type: Object,
        required: true,
    },
});

const { t } = useI18n();

const surveyHomeHref = computed(() => `/${useCurrentLocale()}`);

// =============================================================================
// Константы
// =============================================================================
const SURVEY_LEAD_EMAIL_INPUT_ID = "survey-lead-email";
const SURVEY_SUBMISSION_STATE_KEY = LS_SURVEY_SUBMISSION_STATE;

/** П. 7.4: запас при прокрутке к полю (клавиатура на мобильных). */
const SURVEY_MOBILE_SCROLL_PADDING_BOTTOM =
    "calc(env(safe-area-inset-bottom, 0px) + 96px)";

// =============================================================================
// Данные страницы
// =============================================================================
const successCopy = SURVEY_PAGE_SUCCESS;

// =============================================================================
// Состояние (reactive/ref)
// =============================================================================
const answers = reactive({
    name: "",
    email: "",
    business_name: "",
    phone: "",
    whatsapp: "",
    telegram: "",
    hp_company: "",
});

const currentIndex = ref(0);
/** intro ↔ первый вопрос: без анимации Transition. */
const skipIntroQuestionTransitionOnce = ref(false);
const surveySubmitted = ref(false);
const leadSubmitting = ref(false);
const honeypotStartedAt = ref(null);

const validation = reactive({
    leadFormAttempted: false,
    leadEmailError: "",
    leadSubmitError: "",
});
const questionsLoadError = ref("");
const questionsLoadFailed = ref(false);
const questionsVersion = ref(0);
const submittedStateActive = ref(false);
const submittedState = reactive({
    maskedEmail: "",
    submittedAt: null,
});
const submittedStateResolved = ref(false);
/** Лимит попыток ввода 4-значного кода. Приходит с сервера в ответе на /survey/submit. */
const pinAttemptsTotal = ref(0);
const pinAttemptsLeft = ref(0);
const pinVerificationRef = ref(null);

let autoNextTimer = null;

// =============================================================================
// SERVER - методы связи с бэкендом (должны быть в начале блока методов)
// =============================================================================
/**
 * Принимает вопросы опроса из Inertia-prop'а (отрендерено сервером, готовы в HTML
 * до выполнения JS — это даёт SEO-индексацию текста вопросов) и заливает их в живой
 * стор `surveyQuestionsStub`. В случае невалидной формы — ставит блокирующую ошибку
 * как и прежний `loadSurveyQuestionsFromApi`.
 */
function applyServerProvidedQuestions() {
    try {
        const questions = props.questions;
        if (!questions || typeof questions !== "object" || Array.isArray(questions)) {
            throw new Error("bad_questions_shape");
        }
        const entries = Object.entries(questions);
        if (entries.length === 0) {
            throw new Error("empty_questions");
        }
        const normalized = {};
        for (const [stableId, question] of entries) {
            if (!question || typeof question !== "object") {
                throw new Error("bad_question_item");
            }
            if (typeof question.id !== "string" || question.id !== stableId) {
                throw new Error("bad_question_id");
            }
            normalized[stableId] = question;
        }
        replaceSurveyQuestionsById(normalized);
        questionsVersion.value++;
    } catch {
        questionsLoadError.value = t("survey.ui.questions_load_error");
        questionsLoadFailed.value = true;
    }
}

/**
 * SERVER - Выполняет отправку ответов на сервер.
 * Возвращает `true`, если сервер принял payload, иначе `false`.
 * @returns {Promise<boolean>}
 */
async function submitSurveyResponse(data = null) {

    const request = data !== null ? data : buildSurveySubmitPayload();

    const response = await apiAxios.post( "/survey/submit", request, true, );

    // Создал впервые -                           status = success, update_record = false
    // Ограничение между отправками ответов 1 min - status = warning, update_record = false, alert = cooldown
    // Обновление ответов указанного email -      status = success, update_record = true, attempt_counter = 2, verification_token = 'abc123'
    if(response?.status === "success"){
        const { status } = response.data
        if(status === "success"){
            const { update_record, attempt_counter, total_attempts, verification_token } = response.data

            // 1 Создал впервые
            if(!update_record){
                // Сообщение для пользователя
                toast.info(t('survey.ui.response_saved'), { autoClose: 5000 });
                // Запомнить указанный email
                await persistSurveySubmissionState(request.contacts.email);
                // Показать благодарность
                finalizeSurveyLocally();
            }
            // 2 Обновление ответов (с лимитом попыток из конфига бэка)
            else{
                // Сообщение для пользователя
                toast.info(t('survey.ui.verification_sent'), { autoClose: 5000 });
                // Сохранение токена доступа к его записи ответов draft
                sessionStorage.setItem(SS_VERIFICATION_TOKEN, verification_token);
                // Инициализация счётчиков попыток (текущий и максимальный)
                pinAttemptsLeft.value = attempt_counter;
                pinAttemptsTotal.value = Number(total_attempts) || attempt_counter;

                // Показ 4 значного цифрового блока верификации кода
                if(attempt_counter > 0){
                    const ids = visibleStepIds.value;
                    const idx = ids.indexOf(SURVEY_DIGITAL_CODE_VERIFICATION);
                    if (idx !== -1) {
                        currentIndex.value = idx;
                    }
                }
            }
        }
        else if(status === "warning"){
            const { update_record, alert } = response.data

            // Ограничение между отправками ответов
            if(!update_record && alert === "cooldown"){
                // Сообщение для пользователя
                toast.info(t('survey.ui.cooldown_wait'), { autoClose: 5000 });
                // Сбрасывает клиентские ответы и служебные флаги до стартового состояния intro.
                resetSurveyStateToIntro();
            }
        }
    }

}

/**
 * SERVER - Обработчик завершения ввода 4-значного кода.
 * Отправляет код и токен на сервер для верификации draft-записи.
 * @param {string} pin
 */
async function handlePinComplete(pin) {

    const token = sessionStorage.getItem(SS_VERIFICATION_TOKEN);
    if (!token) {
        toast.error(t('survey.ui.token_not_found'), { autoClose: 5000 });
        return;
    }

    try {
        const params = { token, code: pin }
        const response = await apiAxios.post("/survey/verify", params, true);

        if (response?.status === "success") {
            const { status, code, message } = response.data

            // 1 Обновление произошло
            if(status === "success"){
                toast.info(message, { autoClose: 5000 });
                // Записать факт успешного прохождения опроса в localStorage
                await persistSurveySubmissionState(answers.email);
                // Показать благодарность
                finalizeSurveyLocally();
            }
            // 2 Различные несовпадения
            else if(status === "warning"){
                // 1 Если код введен неверно
                if(code === 3){
                    pinAttemptsLeft.value--;
                    pinVerificationRef.value?.clearDigits();
                    toast.info(message, { autoClose: 5000 });
                }
                // 2 Если попытки закончились Или токен не совпадает
                else if(code === 1 || code === 2){
                    sessionStorage.removeItem(SS_VERIFICATION_TOKEN);
                    toast.info(message, { autoClose: 5000 });
                    resetSurveyStateToIntro();
                }
            }
        }
    } catch {
        toast.error(t('survey.ui.network_error'), { autoClose: 5000 });
    }
}

/**
 * Отправка lead: валидация email, honeypot, защита от двойного клика; после появления API —
 * выставлять `validation.leadSubmitError` при ошибке сети.
 */
async function markSurveySubmitted() {
    if (isSurveyFlowBlocked()) {
        return;
    }
    if (surveySubmitted.value || leadSubmitting.value) {
        return;
    }
    clearAutoNextTimer();
    validation.leadFormAttempted = true;
    if (String(answers.hp_company ?? "").trim() !== "") {
        finalizeSurveyLocally();
        return;
    }
    const emailErr = surveyLeadEmailErrorMessage(answers.email);
    if (emailErr) {
        validation.leadEmailError = t(emailErr);
        return;
    }
    validation.leadEmailError = "";
    validation.leadSubmitError = "";
    leadSubmitting.value = true;
    try {
        await submitSurveyResponse();
    } catch {
        validation.leadSubmitError = t("survey.ui.submit_failed");
    } finally {
        leadSubmitting.value = false;
    }
}

function nowUnixSeconds() {
    return Math.floor(Date.now() / 1000);
}

/**
 * Собирает payload отправки: контакты и ответы по вопросам.
 * Используется для передачи на бэкенд и сохранения в БД.
 * @returns {{
 *   contacts: {name: string, email: string, business_name: string, phone: string, whatsapp: string, telegram: string},
 *   answers: Record<string, string | string[]>,
 *   question_answers: Array<{id: string, value: string | string[] | null, other: string | null}>
 * }}
 */
function buildSurveySubmitPayload() {
    const contacts = collectSurveyLeadContacts();
    const questionAnswers = collectSurveyQuestionAnswers();
    const answersMap = {};
    for (const row of questionAnswers) {
        if (row.value !== null) {
            answersMap[row.id] = row.value;
        }
        if (row.other !== null && row.other.trim() !== "") {
            answersMap[`${row.id}__other`] = row.other;
        }
    }
    return {
        company: String(answers.hp_company ?? ""),
        hp_started_at: honeypotStartedAt.value,
        contacts,
        answers: answersMap,
        question_answers: questionAnswers,
    };
}

// =============================================================================
// Вычисляемые значения
// =============================================================================
const visibleStepIds = computed(() => {
    void questionsVersion.value;
    const branchParentId = getSurveyBranchParentId();
    const branchAnswers = branchParentId ? { [branchParentId]: answers[branchParentId] } : {};
    return buildVisibleSurveyStepIds(surveySubmitted.value, branchAnswers);
});

const currentStepId = computed(
    () => visibleStepIds.value[currentIndex.value] ?? null,
);

const transitionStepKey = computed(
    () => currentStepId.value ?? `idx-${currentIndex.value}`,
);

const currentQuestion = computed(() => {
    const id = currentStepId.value;
    if (
        !id ||
        id === SURVEY_FLOW_STEP_INTRO ||
        id === SURVEY_FLOW_STEP_LEAD ||
        id === SURVEY_FLOW_STEP_SUCCESS
    ) {
        return null;
    }
    return getSurveyQuestionByStepId(id);
});

const otherDetailAnswerKey = computed(() =>
    currentQuestion.value ? surveyOtherDetailKey(currentQuestion.value.id) : "",
);

const currentQuestionOptionsMap = computed(() => {
    const q = currentQuestion.value;
    const map = new Map();
    for (const opt of surveyQuestionAllOptions(q)) {
        map.set(opt.value, opt);
    }
    return map;
});

const showOtherDetailField = computed(() => {
    const q = currentQuestion.value;
    const optionsMap = currentQuestionOptionsMap.value;
    if (optionsMap.size === 0) {
        return false;
    }
    if (q.type === "radio" || q.type === "select") {
        const value = answers[q.id];
        const opt = optionsMap.get(value);
        return opt?.is_other === true;
    }
    if (q.type === "checkbox") {
        const arr = answers[q.id];
        if (!Array.isArray(arr)) {
            return false;
        }
        return arr.some((v) => optionsMap.get(v)?.is_other === true);
    }
    return false;
});

const showQuestionNextButton = computed(() => {
    const q = currentQuestion.value;
    if (!q) {
        return false;
    }
    if (surveyQuestionUsesNextButton(q)) {
        return true;
    }
    return showOtherDetailField.value;
});

/**
 * Кнопка «Далее» неактивна, пока ответ на текущем шаге не проходит валидацию (п. 6.5).
 */
const questionStepNextDisabled = computed(() => {
    const q = currentQuestion.value;
    if (!q || !showQuestionNextButton.value) {
        return false;
    }
    return !isSurveyQuestionAnswerValid(q, answers);
});

const leadSubmitButtonLabel = computed(() =>
    leadSubmitting.value
        ? t("survey.ui.submit_sending")
        : t("survey.ui.submit"),
);

const isSubmittedStateStep = computed(
    () => submittedStateActive.value && !surveySubmitted.value,
);
const isSurveyRenderReady = computed(
    () => submittedStateResolved.value || surveySubmitted.value,
);

/**
 * Определяет какой единственный экран показать на странице.
 * Используется в шаблоне как плоский переключатель вместо вложенных v-if.
 * @returns {'verification'|'submitted'|'intro'|'success'|'survey'|null}
 */
const activeScreen = computed(() => {
    if (questionsLoadFailed.value) return null;
    if (currentStepId.value === SURVEY_DIGITAL_CODE_VERIFICATION) return 'verification';
    if (!isSurveyRenderReady.value) return null;
    if (isSubmittedStateStep.value) return 'submitted';
    if (currentStepId.value === SURVEY_FLOW_STEP_INTRO) return 'intro';
    if (currentStepId.value === SURVEY_FLOW_STEP_SUCCESS) return 'success';
    return 'survey';
});

const progressDenominator = computed(() =>
    surveySubmitted.value ? 1 : getSurveyProgressTotal(),
);

const progressNumerator = computed(() =>
    surveySubmitted.value ? 1 : currentIndex.value + 1,
);

const progressBarAriaLabel = computed(
    () =>
        t("survey.progress.aria", {
            current: progressNumerator.value,
            total: progressDenominator.value,
        }),
);

/**
 * Доля заполнения полосы без учёта intro:
 * после "Start" (первый вопрос) остаётся 0%, далее растёт по шагам.
 */
const progressRealRatio = computed(() => {
    if (currentStepId.value === SURVEY_FLOW_STEP_INTRO) {
        return 0;
    }
    const d = progressDenominator.value;
    if (d <= 1) {
        return 1;
    }
    const completedAfterIntro = Math.max(0, progressNumerator.value - 2);
    const totalAfterIntro = d - 1;
    return Math.min(1, completedAfterIntro / totalAfterIntro);
});

/** Визуальная полоса прогресса в процентах. */
const progressPercent = computed(() => {
    return progressRealRatio.value * 100;
});

const canGoBack = computed(
    () =>
        currentIndex.value > 0 &&
        currentStepId.value !== SURVEY_FLOW_STEP_SUCCESS,
);

// =============================================================================
// Watchers
// =============================================================================
function clampCurrentIndexToVisibleSteps() {
    const ids = visibleStepIds.value;
    const max = ids.length - 1;
    if (max < 0) {
        return;
    }
    if (currentIndex.value > max) {
        currentIndex.value = max;
    }
}

watch(visibleStepIds, clampCurrentIndexToVisibleSteps, { flush: "sync" });

watch(
    () => [currentStepId.value, currentQuestion.value?.type],
    ([stepId, qType]) => {
        const needsEmptyStringInit = qType === "select" || qType === "text";
        if (
            needsEmptyStringInit &&
            stepId &&
            (answers[stepId] === undefined || answers[stepId] === null)
        ) {
            answers[stepId] = "";
        }
    },
    { flush: "post" },
);

let previousBranchParentAnswer = undefined;

/**
 * Следит за сменой ответа на вопрос с ветвлением и очищает ответы потомков ветки.
 */
watch(
    () => {
        const id = getSurveyBranchParentId();
        return id ? answers[id] : undefined;
    },
    (next) => {
        if (
            previousBranchParentAnswer !== undefined &&
            next !== previousBranchParentAnswer
        ) {
            clearBranchDerivedAnswers(answers);
        }
        previousBranchParentAnswer = next;
    },
);

watch(
    () => answers.email,
    () => {
        validation.leadEmailError = "";
    },
);

watch(
    () => validation.leadEmailError,
    (msg) => {
        if (!msg) {
            return;
        }
        nextTick(() => {
            document
                .getElementById(SURVEY_LEAD_EMAIL_INPUT_ID)
                ?.scrollIntoView?.({
                    block: "center",
                    behavior: "smooth",
                });
        });
    },
);

// =============================================================================
// UI focus / lifecycle
// =============================================================================
/**
 * Переносит фокус на заголовок активного шага для клавиатуры и читалок (п. 6.5).
 */
function focusSurveyStepHeading() {
    requestAnimationFrame(() => {
        document.getElementById("survey-step-heading")?.focus?.({
            preventScroll: true,
        });
    });
}

// Скролл страницы наверх при переходе с вопроса на вопрос
watch(transitionStepKey, async () => {
    await nextTick();

    const el = document.querySelector(".app-wrapper .main-content");
    if (!el) return;

    const observer = new ResizeObserver(() => {
        el.scrollTo({ top: 0, behavior: "smooth" });
        observer.disconnect();

        setTimeout(() => {
            if (el.scrollTop > 0) {
                el.scrollTo({ top: 0, behavior: "smooth" });
            }
        }, 500);
    });

    observer.observe(el);
    focusSurveyStepHeading();
});

watch(
    () => currentStepId.value,
    (stepId) => {
        if (!stepId) {
            return;
        }

        if (stepId === "1" && honeypotStartedAt.value === null) {
            honeypotStartedAt.value = nowUnixSeconds();
        }

        const startedAt = honeypotStartedAt.value;
        if (startedAt === null) {
            return;
        }

        const seconds = Math.max(0, nowUnixSeconds() - startedAt);
    },
    { flush: "post" },
);

applyServerProvidedQuestions();

onMounted(() => {
    hydrateSubmittedStateFromStorage();
    submittedStateResolved.value = true;
    if (questionsLoadFailed.value) {
        return;
    }
    const branchId = getSurveyBranchParentId();
    previousBranchParentAnswer = branchId ? answers[branchId] : undefined;
    clampCurrentIndexToVisibleSteps();
    if (typeof document !== "undefined") {
        document.querySelector(".app-wrapper .main-content")
            ?.style.setProperty(
                "scroll-padding-bottom",
                SURVEY_MOBILE_SCROLL_PADDING_BOTTOM,
            );
    }
    nextTick(() => {
        focusSurveyStepHeading();
    });
});

function clearAutoNextTimer() {
    if (autoNextTimer != null) {
        clearTimeout(autoNextTimer);
        autoNextTimer = null;
    }
}

/**
 * Проверяет, можно ли выполнять шаги взаимодействия с опросом.
 * Используется для раннего выхода из пользовательских action-методов при фатальной ошибке загрузки.
 * @returns {boolean}
 */
function isSurveyFlowBlocked() {
    return questionsLoadFailed.value;
}

onUnmounted(() => {
    clearAutoNextTimer();
    if (typeof document !== "undefined") {
        document.querySelector(".app-wrapper .main-content")
            ?.style.removeProperty("scroll-padding-bottom");
    }
});

// =============================================================================
// Навигация по шагам
// =============================================================================
function scheduleAutoNext(stepIdWhenScheduled) {
    clearAutoNextTimer();
    autoNextTimer = setTimeout(() => {
        autoNextTimer = null;
        if (
            !surveySubmitted.value &&
            currentStepId.value === stepIdWhenScheduled
        ) {
            goNextSurveyStep();
        }
    }, SURVEY_RADIO_AUTO_ADVANCE_MS);
}

function goPreviousSurveyStep() {
    if (isSurveyFlowBlocked()) {
        return;
    }
    clearAutoNextTimer();
    if (currentIndex.value <= 0) {
        return;
    }
    const prevId = visibleStepIds.value[currentIndex.value - 1];
    const toIntro = prevId === SURVEY_FLOW_STEP_INTRO;
    if (toIntro) {
        skipIntroQuestionTransitionOnce.value = true;
    }
    currentIndex.value -= 1;
    if (toIntro) {
        nextTick(() => {
            skipIntroQuestionTransitionOnce.value = false;
        });
    }
}

function goNextSurveyStep() {
    if (isSurveyFlowBlocked()) {
        return;
    }
    clearAutoNextTimer();
    if (surveySubmitted.value) {
        return;
    }
    const id = currentStepId.value;
    if (id === SURVEY_FLOW_STEP_LEAD) {
        return;
    }
    const q = getSurveyQuestionByStepId(id);
    if (q && !isSurveyQuestionAnswerValid(q, answers)) {
        return;
    }
    if (id === getSurveyBranchParentId() && !resolveBranchStepId(answers)) {
        return;
    }
    const last = visibleStepIds.value.length - 1;
    if (currentIndex.value >= last) {
        return;
    }
    const leaveIntro = id === SURVEY_FLOW_STEP_INTRO;
    if (leaveIntro) {
        skipIntroQuestionTransitionOnce.value = true;
    }
    currentIndex.value += 1;
    if (leaveIntro) {
        nextTick(() => {
            skipIntroQuestionTransitionOnce.value = false;
        });
    }
}

// =============================================================================
// Обработка ответов вопросов
// =============================================================================
/**
 * Проброс выбора radio из SurveyQuestionStep в общую логику ответа.
 * @param {string} value
 */
function onPickRadio(value) {
    if (isSurveyFlowBlocked()) {
        return;
    }
    const q = currentQuestion.value;
    if (!q) {
        return;
    }
    applyRadioAnswer(q.id, value);
}

/**
 * Проброс переключения checkbox из SurveyMultiChoice.
 * @param {string} value
 */
function onToggleCheckbox(value) {
    if (isSurveyFlowBlocked()) {
        return;
    }
    const q = currentQuestion.value;
    if (!q) {
        return;
    }
    toggleCheckboxOption(q.id, value);
}

/**
 * Возвращает определение вопроса и список его опций для текущего `questionId`.
 * Используется в обработчиках ответов, чтобы не дублировать обращения к источнику вопросов.
 * @param {string} questionId
 * @returns {{ question: object | null, options: Array<{ value: string, is_other?: boolean }> }}
 */
function getQuestionAndOptions(questionId) {
    const question = getSurveyQuestionsById()[questionId] ?? null;
    return {
        question,
        options: surveyQuestionAllOptions(question),
    };
}

function applyRadioAnswer(questionId, value) {
    if (isSurveyFlowBlocked()) {
        return;
    }
    if (surveySubmitted.value) {
        return;
    }
    const { question, options } = getQuestionAndOptions(questionId);
    if (!question) {
        return;
    }
    answers[questionId] = value;
    const opt = options.find((o) => o.value === value);
    if (!opt?.is_other) {
        delete answers[surveyOtherDetailKey(questionId)];
    }
    const stepId = currentStepId.value;
    if (questionId === getSurveyBranchParentId() && stepId === questionId) {
        const last = visibleStepIds.value.length - 1;
        if (currentIndex.value < last) {
            currentIndex.value += 1;
        }
        return;
    }
    if (surveyRadioAllowsAutoAdvance(question, value)) {
        scheduleAutoNext(stepId);
    }
}

function toggleCheckboxOption(questionId, value) {
    if (isSurveyFlowBlocked()) {
        return;
    }
    const { options } = getQuestionAndOptions(questionId);
    const opts = options;
    if (!opts.length) {
        return;
    }
    if (!Array.isArray(answers[questionId])) {
        answers[questionId] = [];
    }
    const arr = answers[questionId];
    const idx = arr.indexOf(value);
    if (idx === -1) {
        arr.push(value);
    } else {
        arr.splice(idx, 1);
        const removedOpt = opts.find((o) => o.value === value);
        if (removedOpt?.is_other) {
            delete answers[surveyOtherDetailKey(questionId)];
        }
    }
}

// =============================================================================
// Отладка и submit
// =============================================================================
/**
 * Собирает ответы только по вопросам опроса (без lead-полей) в удобный массив для отладки.
 * Используется перед финальной отправкой для проверки фактически собранных значений.
 * @returns {Array<{id: string, value: string | string[] | null, other: string | null}>}
 */
function collectSurveyQuestionAnswers() {
    const questions = getSurveyQuestionsById();
    return Object.keys(questions).map((id) => {
        const rawValue = answers[id];
        const otherKey = surveyOtherDetailKey(id);
        return {
            id,
            value:
                rawValue === undefined
                    ? null
                    : Array.isArray(rawValue)
                      ? [...rawValue]
                      : rawValue,
            other:
                typeof answers[otherKey] === "string"
                    ? answers[otherKey]
                    : null,
        };
    });
}

/**
 * Собирает контактные данные lead-шага в отдельный объект для отладки.
 * Используется вместе с массивом ответов по вопросам для полного снимка формы.
 * @returns {{name: string, email: string, business_name: string, phone: string, whatsapp: string, telegram: string}}
 */
function collectSurveyLeadContacts() {
    return {
        name: String(answers.name ?? ""),
        email: String(answers.email ?? ""),
        business_name: String(answers.business_name ?? ""),
        phone: String(answers.phone ?? ""),
        whatsapp: String(answers.whatsapp ?? ""),
        telegram: String(answers.telegram ?? ""),
    };
}

/**
 * Завершает опрос на клиенте единым способом без серверного запроса.
 * Используется для обычного локального успеха и для тихого сценария honeypot.
 */
function finalizeSurveyLocally() {
    nextTick(() => {
        surveySubmitted.value = true;
        currentIndex.value = 0;
    });
}

/**
 * Возвращает SHA-256 хэш email для техпроверок без хранения исходного email.
 * Используется при записи post-submit состояния в localStorage.
 * @param {string} email
 * @returns {Promise<string>}
 */
async function buildSubmissionEmailHash(email) {
    const normalizedEmail = String(email ?? "").trim().toLowerCase();
    if (typeof crypto === "undefined" || !crypto?.subtle) {
        return "";
    }
    const bytes = new TextEncoder().encode(normalizedEmail);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

/**
 * Сохраняет post-submit состояние опроса в localStorage после успешного ответа API.
 * Используется для фиксации факта отправки и технической верификации по email hash.
 * @param {string} email
 * @returns {Promise<void>}
 */
async function persistSurveySubmissionState(email) {
    if (typeof window === "undefined" || !window?.localStorage) {
        return;
    }

    const statePayload = {
        submitted: true,
        submitted_at: new Date().toISOString(),
        email_masked: maskSurveyEmail(email),
        email_raw_hash: await buildSubmissionEmailHash(email),
    };

    try {
        window.localStorage.setItem(
            SURVEY_SUBMISSION_STATE_KEY,
            JSON.stringify(statePayload),
        );
    } catch {}
}

/**
 * Читает сохранённое post-submit состояние из localStorage.
 * Используется при инициализации страницы для переключения в режим submitted-state.
 * @returns {void}
 */
function hydrateSubmittedStateFromStorage() {
    if (typeof window === "undefined" || !window?.localStorage) {
        return;
    }
    let parsedState = null;
    try {
        const raw = window.localStorage.getItem(SURVEY_SUBMISSION_STATE_KEY);
        if (!raw) {
            return;
        }
        parsedState = JSON.parse(raw);
    } catch {
        return;
    }
    if (!parsedState || parsedState.submitted !== true) {
        return;
    }
    const maskedEmailRaw =
        typeof parsedState.email_masked === "string"
            ? parsedState.email_masked.trim()
            : "";
    submittedState.maskedEmail = normalizeMaskedEmailForUi(maskedEmailRaw);
    submittedState.submittedAt =
        typeof parsedState.submitted_at === "string"
            ? parsedState.submitted_at
            : null;
    submittedStateActive.value = true;
}

/**
 * Приводит сохранённую маску email к каноничному формату `xxx*******yyy.zzz`.
 * Используется для совместимости со старыми версиями маски в localStorage.
 * @param {string} maskedEmail
 * @returns {string}
 */
function normalizeMaskedEmailForUi(maskedEmail) {
    const source = String(maskedEmail ?? "").trim().toLowerCase();
    const atIndex = source.indexOf("@");
    if (atIndex > 0 && atIndex < source.length - 1) {
        const localPart = source.slice(0, atIndex).replace(/\*/g, "");
        const domainPart = source.slice(atIndex + 1);
        const dotIndex = domainPart.lastIndexOf(".");
        if (dotIndex <= 0 || dotIndex === domainPart.length - 1) {
            return "***";
        }
        const domainName = domainPart.slice(0, dotIndex).replace(/\*/g, "");
        const domainZone = domainPart.slice(dotIndex + 1).replace(/\*/g, "");
        const localPrefix = localPart.slice(0, Math.min(3, localPart.length));
        const domainTail = domainName.slice(Math.max(0, domainName.length - 3));
        const zoneHead = domainZone.slice(0, Math.min(3, domainZone.length));
        if (!localPrefix || !domainTail || !zoneHead) {
            return "***";
        }
        return `${localPrefix}*******${domainTail}.${zoneHead}`;
    }
    return source || "***";
}

/**
 * Сбрасывает клиентские ответы и служебные флаги до стартового состояния intro.
 * Используется при сценарии повторного прохождения опроса из submitted-state.
 * @returns {void}
 */
function resetSurveyStateToIntro() {
    const staticLeadFields = [
        "name",
        "email",
        "business_name",
        "phone",
        "whatsapp",
        "telegram",
        "hp_company",
    ];
    for (const field of staticLeadFields) {
        answers[field] = "";
    }
    honeypotStartedAt.value = Math.floor(Date.now() / 1000);
    const questionIds = Object.keys(getSurveyQuestionsById());
    for (const questionId of questionIds) {
        delete answers[questionId];
        delete answers[surveyOtherDetailKey(questionId)];
    }
    currentIndex.value = 0;
    surveySubmitted.value = false;
    skipIntroQuestionTransitionOnce.value = false;
    validation.leadFormAttempted = false;
    validation.leadEmailError = "";
    validation.leadSubmitError = "";

    honeypotStartedAt.value = null;
}

/**
 * Обрабатывает клик «Обновить отзыв»: временно открывает повторный проход опроса с intro.
 * Сохранённый post-submit ключ не удаляется, чтобы при перезагрузке до повторной отправки
 * снова показывался экран завершённости.
 * Используется как обработчик события `reset-survey` компонента `SurveySubmittedState`.
 * @returns {void}
 */
function resetSurveyFromSubmittedState() {
    submittedStateActive.value = false;
    resetSurveyStateToIntro();
    currentIndex.value = 1;
    nextTick(() => {
        focusSurveyStepHeading();
    });
}

</script>

<style scoped lang="scss">
@use "../../scss/variables" as *;

.survey-page {
    display: flex;
    flex-direction: column;
    flex: 1;
    //min-height: 0;
    min-width: 0;

    @media (max-width: $breakpoint-md) {
        flex: 0 0 auto;
        min-height: 100%;
    }

    .survey-page__api-error {
        margin-bottom: $spacing-md;
        padding: $spacing-sm-m $spacing-md;
        border: 1px solid $text-red;
        border-radius: $radius-sm;
        background: $bg-error_color;
        color: $text-red;
        font-size: $font-size-sm;
        line-height: 1.4;
    }

    :deep(.survey-layout) {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
    }

    :deep(.survey-page__text-wrap) {
        overflow-wrap: anywhere;
        word-break: break-word;
    }

    :deep(#survey-step-heading:focus),
    :deep(#survey-step-heading:focus-visible) {
        outline: none;
    }

    :deep(.survey-page__footer) {
        padding: 20px 0 40px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    :deep(.survey-page__field) {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    :deep(.survey-page__field-label) {
        font-size: 0.875rem;
        color: $text-slate-700;
    }

    :deep(.survey-page__control) {
        min-height: $spacing-2xl;
        padding: $spacing-sm-w $spacing-sm-m;
        border: 1px solid $border-color;
        border-radius: $radius-sm-sm;
        font-size: $font-size-base;
        color: $text-color;
        background-color: $bg-white;
        max-width: 100%;
        box-sizing: border-box;

        &::placeholder {
            font-size: $font-size-sm;
            color: $text-light-grey;
            opacity: 1;
        }

        &::-webkit-input-placeholder {
            font-size: $font-size-sm;
            color: $text-light-grey;
        }

        &::-moz-placeholder {
            font-size: $font-size-sm;
            color: $text-light-grey;
            opacity: 1;
        }

        &:-ms-input-placeholder {
            font-size: $font-size-sm;
            color: $text-light-grey;
        }
    }

    :deep(.survey-page__control:focus-visible) {
        outline: 2px solid $accent-success-dark;
        outline-offset: 1px;
    }

    :deep(.survey-page__control.survey-lead-form__input--invalid) {
        border-color: $text-red;
    }

    :deep(.survey-lead-form__fields .survey-page__control) {
        scroll-margin-bottom: calc(
            #{$spacing-2xl} + #{$spacing-md-lg} +
                env(safe-area-inset-bottom, 0px)
        );
    }

    :deep(.survey-page__options-stack) {
        display: flex;
        flex-direction: column;
        gap: $spacing-sm-m;
        margin-bottom: $spacing-md;
        width: 100%;
    }

    :deep(.survey-choice-list__btn.survey-choice-list__btn--selected),
    :deep(.survey-multi-choice__row.survey-multi-choice__row--selected) {
        border-color: $accent-success-dark;
        background: $survey-choice-selected-bg;
    }

    :deep(.survey-multi-choice__row.survey-multi-choice__row--selected) {
        border-left-color: $accent-success-dark;
    }

    /* CTA в дочерних компонентах (scoped родителя на них не попадает без :deep). */
    :deep(.survey-primary-action) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        min-height: $spacing-2xl;
        padding: $spacing-sm-m $spacing-md-lg;
        width: auto;
        min-width: 160px;
        font-size: $font-size-base;
        font-weight: 500;
        line-height: 1.35;
        letter-spacing: 0.01em;
        color: $text-color;
        text-decoration: none;
        background-color: $bg-white;
        border: 1px solid $border-color;
        border-radius: $radius-md;
        cursor: pointer;
        touch-action: manipulation;
        transition:
            background-color $transition-fast,
            border-color $transition-fast;

        &:hover:not(:disabled) {
            background-color: $bg-light-blue;
            border-color: $accent-primary-dark;
        }

        &:focus-visible {
            outline: 2px solid $accent-primary-dark;
            outline-offset: 2px;
        }

        &:disabled {
            opacity: 0.55;
            cursor: not-allowed;
        }
    }
}
</style>
