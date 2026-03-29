<template>
    <!-- Секция «Персонал» -->
    <div class="personnel-section">
        <!-- Открывает модалку создания сотрудника -->
        <div class="personnel-section__toolbar">
            <n-button type="primary" @click="openCreateModal">
                Добавить
            </n-button>
        </div>

        <!-- Переключение Табов ниш -->
        <n-tabs
            v-model:value="activeSiteId"
            type="line"
            class="personnel-section__tabs"
            animated
        >
            <!-- Вкладка = одна площадка; контент — список staff с siteId === site.id. -->
            <n-tab-pane v-for="site in sites" :key="site.id" :name="site.id">
                <!-- Заголовок вкладки: название площадки + эмодзи (визуальная связь с нишами демо). -->
                <template #tab>
                    <span class="personnel-section__tab-label">
                        {{ site.name }}
                        <span
                            class="personnel-section__tab-emoji"
                            aria-hidden="true"
                            >{{ siteEmoji(site.id) }}</span
                        >
                    </span>
                </template>
                <!-- Доп. контекст по площадке; скрыт, если адрес в данных не задан. -->
                <p v-if="site.address" class="personnel-section__site-address">
                    {{ site.address }}
                </p>

                <!-- Десктоп: таблица — удобный обзор и действия в одной строке. -->
                <div class="personnel-section__desktop">
                    <!-- Обёртка со скроллом по X на узких экранах внутри «десктопного» брейкпоинта. -->
                    <div class="personnel-section__table-wrap">
                        <!-- Таблица персонала текущей вкладки: те же данные, что и в карточках на mobile. -->
                        <table class="personnel-section__table">
                            <thead>
                                <tr>
                                    <th>ФИО</th>
                                    <th>Должность</th>
                                    <th>Телефон</th>
                                    <th>Email</th>
                                    <th>Статус</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Строка сотрудника: редактирование и удаление (удаление — с подтверждением и снятием назначений в чек-листах). -->
                                <tr
                                    v-for="member in staffBySite(site.id)"
                                    :key="member.id"
                                >
                                    <td>{{ member.fullName }}</td>
                                    <td>{{ member.role }}</td>
                                    <td>{{ member.phone || "—" }}</td>
                                    <td>{{ member.email || "—" }}</td>
                                    <td>
                                        {{
                                            member.active === false
                                                ? "Не активен"
                                                : "Активен"
                                        }}
                                    </td>
                                    <td class="personnel-section__actions">
                                        <!-- Действия строки: правка в общей модалке; удаление через NPopconfirm. -->
                                        <div class="box-button">
                                            <n-button
                                                type="info"
                                                class="personnel-section__action-btn"
                                                @click="openEditModal(member)"
                                            >
                                                Изменить
                                            </n-button>
                                            <!-- Подтверждение удаления: текст предупреждает о задачах с этим ответственным. -->
                                            <n-popconfirm
                                                :positive-text="'Удалить'"
                                                :negative-text="'Отмена'"
                                                :positive-button-props="{
                                                    type: 'info',
                                                }"
                                                :negative-button-props="{
                                                    type: 'warning',
                                                }"
                                                @positive-click="
                                                    () =>
                                                        onConfirmRemove(member)
                                                "
                                            >
                                                <template #trigger>
                                                    <n-button
                                                        type="error"
                                                        class="personnel-section__action-btn"
                                                    >
                                                        Удалить
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

                <!-- Мобильная вёрстка: те же сотрудники и действия, что в таблице; показывается по media вместо desktop. -->
                <div class="personnel-section__mobile">
                    <article
                        v-for="member in staffBySite(site.id)"
                        :key="member.id"
                        class="personnel-card"
                    >
                        <div class="personnel-card__head">
                            <p class="personnel-card__name">
                                {{ member.fullName }}
                            </p>
                            <p class="personnel-card__role">
                                {{ member.role }}
                            </p>
                        </div>
                        <p v-if="member.phone" class="personnel-card__line">
                            {{ member.phone }}
                        </p>
                        <p v-if="member.email" class="personnel-card__line">
                            {{ member.email }}
                        </p>
                        <p class="personnel-card__line">
                            {{
                                member.active === false
                                    ? "Не активен"
                                    : "Активен"
                            }}
                        </p>
                        <!-- Кнопки на всю ширину карточки — тот же сценарий, что в колонке действий таблицы. -->
                        <div class="personnel-card__actions">
                            <n-button
                                type="info"
                                block
                                class="personnel-section__action-btn"
                                @click="openEditModal(member)"
                            >
                                Изменить
                            </n-button>
                            <n-popconfirm
                                :positive-text="'Удалить'"
                                :negative-text="'Отмена'"
                                :positive-button-props="{ type: 'info' }"
                                :negative-button-props="{ type: 'warning' }"
                                @positive-click="() => onConfirmRemove(member)"
                            >
                                <template #trigger>
                                    <n-button
                                        type="error"
                                        block
                                        class="personnel-section__action-btn"
                                    >
                                        Удалить
                                    </n-button>
                                </template>
                                {{ removeConfirmText(member) }}
                            </n-popconfirm>
                        </div>
                    </article>
                </div>
            </n-tab-pane>
        </n-tabs>

        <!-- Модалка создания / редактирования сотрудника -->
        <CreateEditStaffModal
            ref="staffModalRef"
            :default-site-id="activeSiteId"
        />
    </div>
</template>

<script setup>
import { computed, onActivated, ref, watch } from "vue";
import { NButton, NPopconfirm, NTabs, NTabPane, useMessage } from "naive-ui";
import CreateEditStaffModal from "@/features/demo/components/modals/create_edit_staff/CreateEditStaffModal.vue";
import { siteEmojiForDemo } from "@/features/demo/data/demoPersonnel";
import { useDemoState } from "@/features/demo/composables/useDemoState";

defineOptions({ name: "PersonnelSection" });

const message = useMessage();
const { demoState, removeStaff } = useDemoState();

const sites = computed(() => demoState.value.sites ?? []);
const activeSiteId = ref("");

/** Эмодзи площадки во вкладках — общая функция с модалкой сотрудника (`demoPersonnel.js`). */
const siteEmoji = siteEmojiForDemo;

const staffModalRef = ref(null);

function resetActiveSiteToFirst() {
    const list = sites.value;
    if (!list.length) {
        activeSiteId.value = "";
        return;
    }
    activeSiteId.value = list[0].id;
}

watch(
    sites,
    (list) => {
        if (!list.length) {
            activeSiteId.value = "";
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
const staffBySite = (siteId) =>
    demoState.value.staff.filter((m) => m.siteId === siteId);

/**
 * Считает задачи чек-листов, где указан этот сотрудник как ответственный.
 * Используется в тексте подтверждения удаления.
 */
const countAssignedTasks = (staffId) => {
    let n = 0;
    for (const tasks of Object.values(
        demoState.value.checklistsByNiche ?? {},
    )) {
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
    const base = `Удалить сотрудника «${member.fullName}»?`;
    if (n === 0) {
        return base;
    }
    return `${base} С ${n} задач(и) будет убран этот сотрудник!`;
};

/**
 * Удаляет сотрудника после подтверждения (ссылки в задачах обнуляются в `removeStaff`).
 */
const onConfirmRemove = (member) => {
    removeStaff(member.id);
    message.success("Сотрудник удалён");
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
@use "../../../../../scss/variables" as *;

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

    th, td {
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

.personnel-card__head {
    margin-bottom: $spacing-sm;
}

.personnel-card__name {
    font-weight: 600;
    margin: 0 0 4px;
}

.personnel-card__role {
    margin: 0;
    font-size: $font-size-sm;
    color: $text-dark-grey;
}

.personnel-card__line {
    margin: 4px 0 0;
    font-size: $font-size-sm;
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
