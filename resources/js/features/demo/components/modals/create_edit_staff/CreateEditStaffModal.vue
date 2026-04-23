<template>
    <n-modal
        v-model:show="modalShow"
        preset="card"
        class="create-edit-staff-modal"
        :title="modalTitle"
        :style="modalCardStyle"
        :segmented="{ content: true, footer: true }"
        @after-leave="onModalAfterLeave"
    >
        <n-form
            class="create-edit-staff-modal__form"
            :model="form"
            label-placement="top"
            label-width="auto"
        >
            <n-form-item :label="t('demo.staff_modal.site')" path="siteId">
                <n-select
                    :key="siteSelectResetKey"
                    v-model:value="form.siteId"
                    :options="siteOptions"
                />
            </n-form-item>
            <n-form-item :label="t('demo.staff_modal.full_name')" path="fullName">
                <n-input
                    v-model:value="form.fullName"
                    :placeholder="t('demo.staff_modal.full_name_placeholder')"
                />
            </n-form-item>
            <n-form-item :label="t('demo.staff_modal.role')" path="role">
                <n-input v-model:value="form.role" :placeholder="t('demo.staff_modal.role_placeholder')" />
            </n-form-item>
            <n-form-item :label="t('demo.staff_modal.phone')" path="phone">
                <n-input
                    v-model:value="form.phone"
                    :placeholder="t('demo.staff_modal.phone_placeholder')"
                />
            </n-form-item>
            <n-form-item :label="t('demo.staff_modal.email')" path="email">
                <n-input
                    v-model:value="form.email"
                    :placeholder="t('demo.staff_modal.email_placeholder')"
                />
            </n-form-item>
            <n-form-item :label="t('demo.staff_modal.active')" path="active">
                <n-switch v-model:value="form.active" />
            </n-form-item>
        </n-form>
        <template #footer>
            <div class="create-edit-staff-modal__footer">
                <n-button type="warning" @click="modalShow = false">
                    {{ t('demo.staff_modal.cancel') }}
                </n-button>
                <n-button
                    type="info"
                    :loading="submitLoading"
                    @click="submitForm"
                >
                    {{ t('demo.staff_modal.save') }}
                </n-button>
            </div>
        </template>
    </n-modal>
</template>

<script setup>
import { computed, nextTick, ref, watch } from "vue";
import {
    NButton,
    NForm,
    NFormItem,
    NInput,
    NModal,
    NSelect,
    NSwitch,
    useMessage,
} from "naive-ui";
import { useI18n } from "vue-i18n";
import { siteEmojiForDemo } from "@/features/demo/data/demoPersonnel";
import { useDemoState } from "@/features/demo/composables/useDemoState";

defineOptions({ name: "CreateEditStaffModal" });

const { t } = useI18n();

const props = defineProps({
    /** Площадка по умолчанию для режима «Новый сотрудник» (активный таб секции). */
    defaultSiteId: {
        type: String,
        default: "",
    },
});

const message = useMessage();
const { demoState, addStaff, updateStaff } = useDemoState();

/**
 * Инлайн на корень модалки (как у других NModal в демо): Naive применяет `style` к нужному узлу диалога;
 * scoped-класс на `n-modal` на размер карточки не влияет так же надёжно.
 */
const modalCardStyle = {
    width: "520px",
    maxWidth: "calc(100vw - 32px)",
};

const sites = computed(() => demoState.value.sites ?? []);

const siteOptions = computed(() =>
    sites.value.map((s) => ({
        label: `${s.name} ${siteEmojiForDemo(s.id)}`.trim(),
        value: s.id,
    })),
);

/** Видимость модалки — только внутри компонента. */
const modalShow = ref(false);
/** Кого редактируем; `null` — создание новой записи. */
const editTarget = ref(null);

const submitLoading = ref(false);
const editingId = ref(null);
/** Сброс экземпляра NSelect при каждом открытии модалки (иначе остаётся визуально/внутреннее состояние). */
const siteSelectResetKey = ref(0);

const form = ref({
    siteId: "",
    fullName: "",
    role: "",
    phone: "",
    email: "",
    active: true,
});

const modalTitle = computed(() =>
    editingId.value ? t('demo.staff_modal.title_edit') : t('demo.staff_modal.title_create'),
);

const emptyForm = () => ({
    siteId: props.defaultSiteId || sites.value[0]?.id || "",
    fullName: "",
    role: "",
    phone: "",
    email: "",
    active: true,
});

const applyFormFromEditTarget = () => {
    const m = editTarget.value;
    if (m && typeof m === "object" && m.id) {
        editingId.value = m.id;
        form.value = {
            siteId: m.siteId,
            fullName: m.fullName,
            role: m.role,
            phone: m.phone ?? "",
            email: m.email ?? "",
            active: m.active !== false,
        };
        return;
    }
    editingId.value = null;
    form.value = emptyForm();
};

watch(
    () => modalShow.value,
    async (visible) => {
        if (!visible) {
            return;
        }
        applyFormFromEditTarget();
        await nextTick();
        if (!editingId.value) {
            form.value.siteId =
                props.defaultSiteId || sites.value[0]?.id || "";
        }
        siteSelectResetKey.value += 1;
    },
);

watch(
    () => props.defaultSiteId,
    () => {
        if (modalShow.value && !editingId.value) {
            form.value.siteId =
                props.defaultSiteId || sites.value[0]?.id || "";
        }
    },
);

/**
 * Сбрасывает режим редактирования после закрытия модалки.
 */
const onModalAfterLeave = () => {
    editingId.value = null;
    editTarget.value = null;
    form.value = emptyForm();
};

/**
 * Валидирует поля и вызывает addStaff / updateStaff.
 */
const submitForm = () => {
    if (
        !form.value.siteId ||
        !String(form.value.fullName ?? "").trim() ||
        !String(form.value.role ?? "").trim()
    ) {
        message.warning(t('demo.staff_modal.validation_required'));
        return;
    }
    submitLoading.value = true;
    try {
        if (editingId.value) {
            const ok = updateStaff({
                id: editingId.value,
                siteId: form.value.siteId,
                fullName: form.value.fullName,
                role: form.value.role,
                phone: form.value.phone || undefined,
                email: form.value.email || undefined,
                active: form.value.active,
            });
            if (!ok) {
                message.error(t('demo.staff_modal.save_error'));
                return;
            }
            message.success(t('demo.staff_modal.save_success'));
        } else {
            const id = addStaff({
                siteId: form.value.siteId,
                fullName: form.value.fullName,
                role: form.value.role,
                phone: form.value.phone || undefined,
                email: form.value.email || undefined,
                active: form.value.active,
            });
            if (!id) {
                message.error(t('demo.staff_modal.fill_required'));
                return;
            }
            message.success(t('demo.staff_modal.add_success'));
        }
        modalShow.value = false;
    } finally {
        submitLoading.value = false;
    }
};

/**
 * Открывает модалку создания (площадка из `defaultSiteId`).
 */
function openCreate() {
    editTarget.value = null;
    modalShow.value = true;
}

/**
 * Открывает модалку редактирования выбранного сотрудника.
 * @param {object} member — запись из `demoState.staff`
 */
function openEdit(member) {
    editTarget.value = member;
    modalShow.value = true;
}

defineExpose({ openCreate, openEdit });
</script>

<style scoped lang="scss">
@use "../../../../../../scss/variables" as *;

.create-edit-staff-modal__form {
    :deep(.n-select) {
        width: 100%;
    }

    :deep(.n-input) {
        width: 100%;
    }
}

.create-edit-staff-modal__footer {
    display: flex;
    justify-content: flex-end;
    gap: $spacing-sm;
    flex-wrap: wrap;
}
</style>
