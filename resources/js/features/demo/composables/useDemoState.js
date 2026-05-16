import { ref, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { buildChecklistTaskFromPayload } from '@/features/demo/composables/demoChecklistCustomTask';
import { createDefaultState } from '@/features/demo/composables/demoDefaultState';
import { DEMO_CHECKLIST_NICHES } from '@/features/demo/composables/demoStateChecklistSeed';
import {
    loadStateFromStorage,
    saveStateToStorage,
} from '@/features/demo/composables/demoStatePersistence';
import { seedChecklistsTemperatureAi } from '@/features/demo/ai/temperature/seedChecklistsTemperatureAi';
import { clearAssigneeInChecklists } from '@/features/demo/utils/demoStaff';

export { createDefaultState } from '@/features/demo/composables/demoDefaultState';
export { loadPersistedDemoState } from '@/features/demo/composables/demoStatePersistence';

const demoState = ref(loadStateFromStorage() ?? createDefaultState());
watch(
    demoState,
    (nextState) => {
        saveStateToStorage(nextState);
    },
    { deep: true },
);

export const useDemoState = () => {
    /**
     * Заменяет текущие чек-листы новым объектом.
     * Используется секцией чек-листов для централизованного обновления state.
     */
    const setChecklistsByNiche = (nextChecklists) => {
        demoState.value = {
            ...demoState.value,
            checklistsByNiche: nextChecklists,
        };
    };

    /**
     * Добавляет сотрудника в справочник и сохраняет состояние.
     * Используется секцией персонала (форма «Добавить»).
     */
    const addStaff = (payload) => {
        const id = uuidv4();
        const next = {
            id,
            siteId: payload.siteId,
            fullName: String(payload.fullName ?? '').trim(),
            role: String(payload.role ?? '').trim(),
            phone: payload.phone ? String(payload.phone).trim() : undefined,
            email: payload.email ? String(payload.email).trim() : undefined,
            active: payload.active !== false,
        };
        if (!next.fullName || !next.role || !next.siteId) {
            return null;
        }
        demoState.value = {
            ...demoState.value,
            staff: [...demoState.value.staff, next],
        };
        return id;
    };

    /**
     * Обновляет поля сотрудника по id.
     * Используется секцией персонала (редактирование карточки).
     */
    const updateStaff = (patch) => {
        if (!patch?.id) {
            return false;
        }
        const idx = demoState.value.staff.findIndex((s) => s.id === patch.id);
        if (idx === -1) {
            return false;
        }
        const prev = demoState.value.staff[idx];
        const fullName = patch.fullName != null ? String(patch.fullName).trim() : prev.fullName;
        const role = patch.role != null ? String(patch.role).trim() : prev.role;
        const siteId = patch.siteId != null ? patch.siteId : prev.siteId;
        if (!fullName || !role || !siteId) {
            return false;
        }
        const phone =
            patch.phone !== undefined
                ? patch.phone
                    ? String(patch.phone).trim()
                    : undefined
                : prev.phone;
        const email =
            patch.email !== undefined
                ? patch.email
                    ? String(patch.email).trim()
                    : undefined
                : prev.email;
        const active = patch.active !== undefined ? patch.active !== false : prev.active !== false;
        const nextStaff = [...demoState.value.staff];
        nextStaff[idx] = {
            ...prev,
            fullName,
            role,
            siteId,
            phone,
            email,
            active,
        };
        demoState.value = { ...demoState.value, staff: nextStaff };
        return true;
    };

    /**
     * Удаляет сотрудника из справочника и снимает его с задач чек-листов.
     * Используется секцией персонала (подтверждение удаления).
     */
    const removeStaff = (staffId) => {
        demoState.value = {
            ...demoState.value,
            staff: demoState.value.staff.filter((s) => s.id !== staffId),
            checklistsByNiche: clearAssigneeInChecklists(
                demoState.value.checklistsByNiche,
                staffId,
            ),
        };
    };

    /**
     * Добавляет пользовательскую задачу в выбранную нишу чек-листа.
     * Используется секцией Checklists (форма «Добавить CCP»).
     */
    const addChecklistTask = (niche, payload) => {
        if (!DEMO_CHECKLIST_NICHES.has(niche)) {
            return null;
        }
        const task = buildChecklistTaskFromPayload(niche, payload);
        if (!task) {
            return null;
        }
        const prev = demoState.value.checklistsByNiche[niche] ?? [];
        const nextChecklistsByNiche = {
            ...demoState.value.checklistsByNiche,
            [niche]: [...prev, task],
        };
        demoState.value = {
            ...demoState.value,
            checklistsByNiche: nextChecklistsByNiche,
        };
        // Иначе у новых задач `parseMeasurement…` выставит status, но `aiWarning` останется null (сид только при load/дефолте).
        seedChecklistsTemperatureAi(demoState.value.checklistsByNiche);
        return task.id;
    };

    /**
     * Удаляет задачу из ниши по id (объект снимается целиком, вместе с полем ответственного).
     * Используется секцией Checklists после подтверждения удаления на карточке CCP.
     */
    const removeChecklistTask = (niche, taskId) => {
        if (!DEMO_CHECKLIST_NICHES.has(niche) || typeof taskId !== 'string') {
            return false;
        }
        const prev = demoState.value.checklistsByNiche[niche];
        if (!Array.isArray(prev)) {
            return false;
        }
        const next = prev.filter((t) => t.id !== taskId);
        if (next.length === prev.length) {
            return false;
        }
        demoState.value = {
            ...demoState.value,
            checklistsByNiche: {
                ...demoState.value.checklistsByNiche,
                [niche]: next,
            },
        };
        return true;
    };

    /**
     * Сбрасывает состояние демо к дефолтному.
     * Используется как безопасный способ восстановить исходные mock-данные.
     */
    const resetDemoState = () => {
        demoState.value = createDefaultState();
    };

    return {
        demoState,
        setChecklistsByNiche,
        addStaff,
        updateStaff,
        removeStaff,
        addChecklistTask,
        removeChecklistTask,
        resetDemoState,
    };
};
