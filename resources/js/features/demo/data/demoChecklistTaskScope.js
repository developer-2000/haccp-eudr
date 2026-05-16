/**
 * Тип охвата пользовательской задачи CCP в демо (конструктор «Добавить CCP»).
 * Используется в форме создания и в объекте задачи (`taskScopeType`).
 */

export const TASK_SCOPE_TYPE = {
    EQUIPMENT: 'equipment',
    ROOMS: 'rooms',
    STANDALONE: 'standalone',
};

/**
 * Приводит значение из формы или storage к одному из `TASK_SCOPE_TYPE`.
 * Используется при сборке задачи и при загрузке старых записей без поля.
 */
export const normalizeTaskScopeType = (raw) => {
    const v = raw == null ? '' : String(raw);
    if (
        v === TASK_SCOPE_TYPE.EQUIPMENT ||
        v === TASK_SCOPE_TYPE.ROOMS ||
        v === TASK_SCOPE_TYPE.STANDALONE
    ) {
        return v;
    }
    return TASK_SCOPE_TYPE.EQUIPMENT;
};

/**
 * Короткая подпись типа охвата для карточки CCP и списков.
 * Используется только для отображения.
 */
export const taskScopeTypeLabel = (scope) => {
    switch (normalizeTaskScopeType(scope)) {
        case TASK_SCOPE_TYPE.ROOMS:
            return 'Комнаты';
        case TASK_SCOPE_TYPE.STANDALONE:
            return 'Отдельная';
        default:
            return 'Оборудование';
    }
};
