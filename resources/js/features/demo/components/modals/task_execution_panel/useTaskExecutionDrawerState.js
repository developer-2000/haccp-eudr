import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {TASK_FIELD_TYPE_OPTIONS} from "@/features/demo/data/demoChecklistTaskFields";
import {
    EQUIPMENT_LABEL_BY_ID,
    ROOM_LABEL_BY_ID,
} from "@/features/demo/data/demoChecklistMaps";
import {
    normalizeEquipmentTargetIds,
} from "@/features/demo/data/demoChecklistEquipment";
import {
    normalizeRoomTargetIds,
} from "@/features/demo/data/demoChecklistRooms";
import {
    buildPhotoFileNameStamp,
    buildReportFileNameStamp,
    inferPendingDrawerFieldType,
} from "../show_task/utils.js";
import {isCurrentMeasurementRowPending} from "@/features/demo/task_grain_cooling/grainCoolingMeasurementRow";
import {applyPendingMeasurementFromKeypadOk} from "./applyPendingMeasurementFromKeypadOk.js";
import {sanitizeTemperatureNumericDraft} from "@/utils/helpers";

/**
 * Состояние и логика панели выполнения pending-замера (демо).
 */
export function useTaskExecutionDrawerState(props) {
    const isOpen = ref(false);
    const pendingDrawerMeasurement = ref(null);
    const pendingTemperatureDraft = ref("");
    const pendingPhotoNames = ref([]);
    const pendingReportFileName = ref("");
    const pendingSingleChoiceAnswer = ref("");
    const pendingSingleChoiceComment = ref("");
    const pendingTicketStatus = ref("not_completed");
    const pendingTicketComment = ref("");
    const viewportWidth = ref(
        typeof window !== "undefined" ? window.innerWidth : 1024,
    );

    const onResize = () => {
        viewportWidth.value = window.innerWidth;
    };

    onMounted(() => {
        window.addEventListener("resize", onResize, {passive: true});
    });

    onBeforeUnmount(() => {
        window.removeEventListener("resize", onResize);
    });

    const pendingDrawerTitle = computed(() => String(props.task?.title ?? "—"));

    const pendingDrawerWidth = computed(() => {
        const vw = Number(viewportWidth.value) || 0;
        const max = 502;
        const w = Math.min(max, Math.max(320, vw));
        return Number.isFinite(w) ? Math.round(w) : max;
    });

    const pendingDrawerTargetsDisplay = computed(() => {
        const task = props.task ?? {};
        if (task.taskScopeType === "equipment") {
            const ids = normalizeEquipmentTargetIds(task.equipmentTargetIds);
            const names = ids.map((id) => EQUIPMENT_LABEL_BY_ID.get(id) ?? id);
            return names.length ? names.join(", ") : "—";
        }
        if (task.taskScopeType === "rooms") {
            const ids = normalizeRoomTargetIds(task.roomTargetIds);
            const names = ids.map((id) => ROOM_LABEL_BY_ID.get(id) ?? id);
            return names.length ? names.join(", ") : "—";
        }
        return "—";
    });

    const pendingDrawerFieldTypeFromTask = computed(
        () => props.task?.taskFieldDefinitions?.[0]?.fieldType ?? null,
    );

    const pendingSingleChoiceDefinition = computed(() => {
        const def = props.task?.taskFieldDefinitions?.[0] ?? null;
        if (!def || def.fieldType !== "single_choice") {
            return null;
        }
        return def;
    });

    const pendingSingleChoiceQuestion = computed(() => {
        const q = pendingSingleChoiceDefinition.value?.config?.question;
        return String(q ?? "").trim() || "Выберите ответ";
    });

    const pendingSingleChoiceOptions = computed(() => {
        const raw = pendingSingleChoiceDefinition.value?.config?.options;
        if (!Array.isArray(raw)) {
            return [];
        }
        return raw.map((x) => String(x ?? "").trim()).filter(Boolean);
    });

    const pendingTicketDescription = computed(() => {
        const def = props.task?.taskFieldDefinitions?.[0] ?? null;
        if (!def || def.fieldType !== "ticket") {
            return "—";
        }
        const text = String(def?.config?.description ?? "").trim();
        return text || "—";
    });

    const pendingDrawerFieldType = computed(
        () =>
            pendingDrawerFieldTypeFromTask.value ??
            inferPendingDrawerFieldType(
                pendingDrawerMeasurement.value,
                props.task,
            ),
    );

    const showBluetoothAlert = computed(() => {
        const ft = pendingDrawerFieldType.value;
        return ft === "temperature" || ft === "timer";
    });

    /** Кнопка камеры в панели temp/timer: по умолчанию true; выкл. через `config.showCamera` у поля температуры. */
    const pendingShowCamera = computed(() => {
        const ft = pendingDrawerFieldType.value;
        if (ft !== "temperature" && ft !== "timer") {
            return false;
        }
        const def = props.task?.taskFieldDefinitions?.[0];
        const cfg = def?.config && typeof def.config === "object" ? def.config : {};
        if (Object.prototype.hasOwnProperty.call(cfg, "showCamera")) {
            return Boolean(cfg.showCamera);
        }
        return true;
    });

    const pendingDrawerFieldTypeDisplay = computed(() => {
        const ft = pendingDrawerFieldType.value;
        const label = TASK_FIELD_TYPE_OPTIONS.find((o) => o.value === ft)?.label;
        return label ?? (ft ? String(ft) : "—");
    });

    const pendingInputSuffix = computed(() =>
        pendingDrawerFieldType.value === "timer" ? "мин" : "°C",
    );

    const pendingInputPrefix = computed(() =>
        pendingDrawerFieldType.value === "timer" ? "⏱️" : "🌡️",
    );

    function openPendingDrawer(measurement) {
        /** Не открывать панель «редактирования» замера, если в актуальной задаче строка уже не `pending`. */
        if (!isCurrentMeasurementRowPending(props.task, measurement)) {
            return;
        }
        pendingDrawerMeasurement.value = measurement ?? null;
        pendingTemperatureDraft.value = "";
        pendingPhotoNames.value = [];
        pendingReportFileName.value = "";
        pendingSingleChoiceAnswer.value = "";
        pendingSingleChoiceComment.value = "";
        pendingTicketStatus.value = "not_completed";
        pendingTicketComment.value = "";
        viewportWidth.value =
            typeof window !== "undefined" ? window.innerWidth : 1024;
        isOpen.value = true;
    }

    function closeDrawer() {
        isOpen.value = false;
    }

    const applyPendingInputToMeasurement = () =>
        applyPendingMeasurementFromKeypadOk({
            task: props.task,
            measurementRow: pendingDrawerMeasurement.value,
            draft: pendingTemperatureDraft.value,
            fieldType: pendingDrawerFieldType.value,
        });

    const onKeypadPress = (key) => {
        const raw = String(pendingTemperatureDraft.value ?? "");
        if (key === "DEL") {
            pendingTemperatureDraft.value = raw.slice(0, -1);
            return;
        }
        if (key === "+/-") {
            pendingTemperatureDraft.value = raw.startsWith("-")
                ? raw.slice(1)
                : raw
                    ? `-${raw}`
                    : "-";
            return;
        }
        if (key === ".") {
            if (!raw.includes(".")) {
                if (raw === "-") {
                    pendingTemperatureDraft.value = "-0.";
                } else if (raw === "") {
                    pendingTemperatureDraft.value = "0.";
                } else {
                    pendingTemperatureDraft.value = `${raw}.`;
                }
            }
            return;
        }
        if (key === "✓") {
            applyPendingInputToMeasurement();
            isOpen.value = false;
            return;
        }
        if (/^\d$/.test(key)) {
            const nextRaw = raw === "-" ? `-${key}` : `${raw}${key}`;
            const sign = nextRaw.startsWith("-") ? "-" : "";
            const body = sign ? nextRaw.slice(1) : nextRaw;
            if (!body.includes(".")) {
                const normalizedBody = body.replace(/^0+(?=\d)/, "");
                pendingTemperatureDraft.value = `${sign}${normalizedBody || "0"}`;
            } else {
                pendingTemperatureDraft.value =
                    sanitizeTemperatureNumericDraft(nextRaw);
            }
        }
    };

    const submitSingleChoiceAnswer = () => {
        const m = pendingDrawerMeasurement.value;
        const answer = String(pendingSingleChoiceAnswer.value ?? "").trim();
        if (!m || !answer) {
            return;
        }
        if (!isCurrentMeasurementRowPending(props.task, m)) {
            return;
        }
        const comment = String(pendingSingleChoiceComment.value ?? "").trim();
        m.value = answer;
        m.status = "success";
        m.aiWarning = null;
        m.comment = comment || null;
        isOpen.value = false;
    };

    const submitTicketResult = () => {
        const m = pendingDrawerMeasurement.value;
        if (!m) {
            return;
        }
        if (!isCurrentMeasurementRowPending(props.task, m)) {
            return;
        }
        const completed = pendingTicketStatus.value === "completed";
        const comment = String(pendingTicketComment.value ?? "").trim();
        m.value = completed ? "Выполнен" : "Не выполнен";
        m.status = completed ? "success" : "problem";
        m.aiWarning = null;
        m.comment = comment || null;
        isOpen.value = false;
    };

    const simulateReportFileAttach = () => {
        pendingReportFileName.value = buildReportFileNameStamp();
    };

    const simulateCameraShot = () => {
        pendingPhotoNames.value = [
            ...pendingPhotoNames.value,
            `photo_${buildPhotoFileNameStamp()}.jpg`,
        ];
    };

    return {
        isOpen,
        pendingDrawerMeasurement,
        pendingTemperatureDraft,
        pendingPhotoNames,
        pendingReportFileName,
        pendingSingleChoiceAnswer,
        pendingSingleChoiceComment,
        pendingTicketStatus,
        pendingTicketComment,
        viewportWidth,
        pendingDrawerTitle,
        pendingDrawerWidth,
        pendingDrawerTargetsDisplay,
        pendingDrawerFieldType,
        showBluetoothAlert,
        pendingShowCamera,
        pendingSingleChoiceQuestion,
        pendingSingleChoiceOptions,
        pendingTicketDescription,
        pendingDrawerFieldTypeDisplay,
        pendingInputSuffix,
        pendingInputPrefix,
        openPendingDrawer,
        closeDrawer,
        onKeypadPress,
        submitSingleChoiceAnswer,
        submitTicketResult,
        simulateReportFileAttach,
        simulateCameraShot,
    };
}
