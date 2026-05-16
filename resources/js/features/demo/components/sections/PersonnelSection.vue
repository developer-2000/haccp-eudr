<template>
    <div class="personnel-section">
        <div class="personnel-section__toolbar">
            <n-button type="primary" size="large" @click="openCreateModal">
                {{ personnelSectionText.add }}
            </n-button>
        </div>

        <n-tabs v-model:value="activeSiteId" type="line" class="personnel-section__tabs" animated>
            <n-tab-pane v-for="site in sites" :key="site.id" :name="site.id">
                <template #tab>
                    <span class="personnel-section__tab-label">
                        {{ site.name }}
                        <span class="personnel-section__tab-emoji" aria-hidden="true">{{
                            siteEmoji(site.id)
                        }}</span>
                    </span>
                </template>
                <p v-if="site.address" class="personnel-section__site-address">
                    {{ site.address }}
                </p>

                <div class="personnel-section__desktop">
                    <div class="personnel-section__table-wrap">
                        <table class="personnel-section__table">
                            <thead>
                                <tr>
                                    <th>{{ personnelSectionText.colFullName }}</th>
                                    <th>{{ personnelSectionText.colRole }}</th>
                                    <th>{{ personnelSectionText.colPhone }}</th>
                                    <th>{{ personnelSectionText.colEmail }}</th>
                                    <th>{{ personnelSectionText.colStatus }}</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="member in staffBySite(site.id)" :key="member.id">
                                    <td>{{ member.fullName }}</td>
                                    <td>{{ member.role }}</td>
                                    <td>{{ member.phone || personnelSectionText.empty }}</td>
                                    <td>{{ member.email || personnelSectionText.empty }}</td>
                                    <td>
                                        <span
                                            class="personnel-section__status"
                                            :class="
                                                member.active === false
                                                    ? 'personnel-section__status--inactive'
                                                    : 'personnel-section__status--active'
                                            "
                                        >
                                            {{
                                                member.active === false
                                                    ? personnelSectionText.statusInactive
                                                    : personnelSectionText.statusActive
                                            }}
                                        </span>
                                    </td>
                                    <td class="personnel-section__actions">
                                        <div class="box-button">
                                            <n-button
                                                type="info"
                                                class="personnel-section__action-btn"
                                                size="large"
                                                @click="openEditModal(member)"
                                            >
                                                {{ personnelSectionText.edit }}
                                            </n-button>
                                            <n-popconfirm
                                                :positive-text="personnelSectionText.delete"
                                                :negative-text="personnelSectionText.cancel"
                                                :positive-button-props="{
                                                    type: 'info',
                                                }"
                                                :negative-button-props="{
                                                    type: 'warning',
                                                }"
                                                @positive-click="() => onConfirmRemove(member)"
                                            >
                                                <template #trigger>
                                                    <n-button
                                                        type="error"
                                                        class="personnel-section__action-btn"
                                                        size="large"
                                                    >
                                                        {{ personnelSectionText.delete }}
                                                    </n-button>
                                                </template>
                                                {{ removeConfirmText(member) }}
                                            </n-popconfirm>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="personnel-section__mobile">
                    <article
                        v-for="member in staffBySite(site.id)"
                        :key="member.id"
                        class="personnel-card"
                    >
                        <p class="personnel-card__line">
                            <span class="personnel-card__label">{{
                                personnelSectionText.labelFullName
                            }}</span>
                            {{ member.fullName }}
                        </p>
                        <p class="personnel-card__line">
                            <span class="personnel-card__label">{{
                                personnelSectionText.labelRole
                            }}</span>
                            {{ member.role }}
                        </p>
                        <p class="personnel-card__line">
                            <span class="personnel-card__label">{{
                                personnelSectionText.labelPhone
                            }}</span>
                            {{ member.phone || personnelSectionText.empty }}
                        </p>
                        <p class="personnel-card__line">
                            <span class="personnel-card__label">{{
                                personnelSectionText.labelEmail
                            }}</span>
                            {{ member.email || personnelSectionText.empty }}
                        </p>
                        <p class="personnel-card__line personnel-card__line--status">
                            <span class="personnel-card__label">{{
                                personnelSectionText.labelStatus
                            }}</span>
                            <span
                                class="personnel-section__status"
                                :class="
                                    member.active === false
                                        ? 'personnel-section__status--inactive'
                                        : 'personnel-section__status--active'
                                "
                            >
                                {{
                                    member.active === false
                                        ? personnelSectionText.statusInactive
                                        : personnelSectionText.statusActive
                                }}
                            </span>
                        </p>
                        <div class="personnel-card__actions">
                            <n-button
                                type="info"
                                block
                                class="personnel-section__action-btn"
                                size="large"
                                @click="openEditModal(member)"
                            >
                                {{ personnelSectionText.edit }}
                            </n-button>
                            <n-popconfirm
                                :positive-text="personnelSectionText.delete"
                                :negative-text="personnelSectionText.cancel"
                                :positive-button-props="{ type: 'info' }"
                                :negative-button-props="{ type: 'warning' }"
                                @positive-click="() => onConfirmRemove(member)"
                            >
                                <template #trigger>
                                    <n-button
                                        type="error"
                                        block
                                        class="personnel-section__action-btn"
                                        size="large"
                                    >
                                        {{ personnelSectionText.delete }}
                                    </n-button>
                                </template>
                                {{ removeConfirmText(member) }}
                            </n-popconfirm>
                        </div>
                    </article>
                </div>
            </n-tab-pane>
        </n-tabs>

        <CreateEditStaffModal ref="staffModalRef" :default-site-id="activeSiteId" />
    </div>
</template>

<script setup>
import { computed, onActivated, ref, watch } from 'vue';
import { NButton, NPopconfirm, NTabs, NTabPane, useMessage } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import CreateEditStaffModal from '@/features/demo/components/modals/create_edit_staff/CreateEditStaffModal.vue';
import { siteEmojiForDemo } from '@/features/demo/data/demoPersonnel';
import { useDemoState } from '@/features/demo/composables/useDemoState';

defineOptions({ name: 'PersonnelSection' });

const { t } = useI18n();

/** Все пользовательские строки секции (шаблон + сообщения). */
const personnelSectionText = computed(() => ({
    add: t('demo.personnel.add'),
    colFullName: t('demo.personnel.col_full_name'),
    colRole: t('demo.personnel.col_role'),
    colPhone: t('demo.personnel.col_phone'),
    colEmail: t('demo.personnel.col_email'),
    colStatus: t('demo.personnel.col_status'),
    labelFullName: t('demo.personnel.label_full_name'),
    labelRole: t('demo.personnel.label_role'),
    labelPhone: t('demo.personnel.label_phone'),
    labelEmail: t('demo.personnel.label_email'),
    labelStatus: t('demo.personnel.label_status'),
    empty: t('demo.personnel.empty'),
    statusActive: t('demo.personnel.status_active'),
    statusInactive: t('demo.personnel.status_inactive'),
    edit: t('demo.personnel.edit'),
    delete: t('demo.personnel.delete'),
    cancel: t('demo.personnel.cancel'),
    removeConfirmBase: 'demo.personnel.remove_confirm_base',
    removeConfirmWithTasks: 'demo.personnel.remove_confirm_with_tasks',
    removeSuccess: t('demo.personnel.remove_success'),
}));

const message = useMessage();
const { demoState, removeStaff } = useDemoState();

const sites = computed(() => demoState.value.sites ?? []);
const activeSiteId = ref('');

/** Эмодзи площадки во вкладках — общая функция с модалкой сотрудника (`demoPersonnel.js`). */
const siteEmoji = siteEmojiForDemo;

const staffModalRef = ref(null);

function resetActiveSiteToFirst() {
    const list = sites.value;
    if (!list.length) {
        activeSiteId.value = '';
        return;
    }
    activeSiteId.value = list[0].id;
}

watch(
    sites,
    (list) => {
        if (!list.length) {
            activeSiteId.value = '';
            return;
        }
        if (!list.some((s) => s.id === activeSiteId.value)) {
            activeSiteId.value = list[0].id;
        }
    },
    { immediate: true },
);

/** После ухода на другую секцию демо компонент остаётся в KeepAlive — при возврате на «Персонал» снова первая площадка. */
onActivated(() => {
    resetActiveSiteToFirst();
});

/**
 * Возвращает сотрудников выбранной площадки в стабильном порядке.
 * Используется в табах и в мобильной вёрстке.
 */
const staffBySite = (siteId) => demoState.value.staff.filter((m) => m.siteId === siteId);

/**
 * Считает задачи чек-листов, где указан этот сотрудник как ответственный.
 * Используется в тексте подтверждения удаления.
 */
const countAssignedTasks = (staffId) => {
    let n = 0;
    for (const tasks of Object.values(demoState.value.checklistsByNiche ?? {})) {
        for (const t of tasks) {
            if (t.assignedStaffId === staffId) {
                n += 1;
            }
        }
    }
    return n;
};

/**
 * Формирует текст для NPopconfirm: предупреждение о снятии назначений с CCP.
 */
const removeConfirmText = (member) => {
    const n = countAssignedTasks(member.id);
    const base = t(personnelSectionText.value.removeConfirmBase, { name: member.fullName });
    if (n === 0) {
        return base;
    }
    return `${base} ${t(personnelSectionText.value.removeConfirmWithTasks, { n: String(n) })}`;
};

/**
 * Удаляет сотрудника после подтверждения (ссылки в задачах обнуляются в `removeStaff`).
 */
const onConfirmRemove = (member) => {
    removeStaff(member.id);
    message.success(personnelSectionText.value.removeSuccess);
};

/**
 * Открывает модалку создания с предзаполненной площадкой из активной вкладки.
 */
const openCreateModal = () => {
    staffModalRef.value?.openCreate();
};

/**
 * Открывает модалку редактирования с данными выбранной записи.
 */
const openEditModal = (member) => {
    staffModalRef.value?.openEdit(member);
};
</script>

<style scoped lang="scss">
@use '../../../../../scss/variables' as *;

.personnel-section__toolbar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: $spacing-md;
}

.personnel-section__site-address {
    font-size: $font-size-sm;
    color: $text-dark-grey;
    margin: 0 0 $spacing-md;
}

.personnel-section__tab-label {
    display: inline-flex;
    align-items: center;
    gap: 0.3em;
}

.personnel-section__tab-emoji {
    font-size: 1.15em;
    line-height: 1;
}

.personnel-section__table-wrap {
    overflow-x: auto;
}

.personnel-section__table {
    width: 100%;
    border-collapse: collapse;
    font-size: $font-size-sm;

    th,
    td {
        padding: $spacing-sm $spacing-md;
        text-align: left;
        border-bottom: 1px solid $text-light-grey;
        vertical-align: middle;
    }

    th {
        font-weight: 600;
    }
}

.personnel-section__actions {
    .box-button {
        display: flex;
        gap: 8px;
    }
}

.personnel-section__desktop {
    display: block;
}

.personnel-section__mobile {
    display: none;
    flex-direction: column;
    gap: $spacing-md;
}

.personnel-card {
    border: 1px solid $text-light-grey;
    border-radius: $radius-lg;
    padding: $spacing-md;
    background-color: $bg-gray;
}

.personnel-card__line {
    margin: 4px 0 0;
    font-size: $font-size-sm;

    &:first-child {
        margin-top: 0;
    }
}

.personnel-card__label {
    color: $text-dark-grey;
    margin-right: 4px;
}

.personnel-card__line--status {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $spacing-xs;
}

.personnel-section__status {
    font-size: $font-size-sm;
}

.personnel-section__status--active {
    color: $accent-success-dark;
}

.personnel-section__status--inactive {
    color: $accent-orange;
}

.personnel-card__actions {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    margin-top: $spacing-md;
}

@media (max-width: $breakpoint-lg) {
    .personnel-section__desktop {
        display: none;
    }

    .personnel-section__mobile {
        display: flex;
    }
}
</style>
