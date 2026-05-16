/**
 * Периодичность задачи CCP в демо-конструкторе («Добавить CCP»).
 * Хранится в объекте задачи как `frequency`.
 */

export const FREQUENCY_CODE = {
    WEEKLY: 'weekly',
    DAILY: 'daily',
    UNSPECIFIED: 'unspecified',
    CUSTOM: 'custom',
};

/**
 * Приводит значение из формы или storage к одному из `FREQUENCY_CODE`.
 * Используется при сборке задачи и при отображении карточки.
 *
 * Ранее в конструкторе были «раз в месяц» / «ежегодно»; из старых снимков
 * localStorage приводим к `weekly`, чтобы не терять задачу.
 */
export const normalizeFrequency = (raw) => {
    const v = raw == null ? '' : String(raw);
    if (v === 'monthly' || v === 'yearly') {
        return FREQUENCY_CODE.WEEKLY;
    }
    const allowed = new Set(Object.values(FREQUENCY_CODE));
    if (allowed.has(v)) {
        return v;
    }
    return FREQUENCY_CODE.UNSPECIFIED;
};

/**
 * Человекочитаемая подпись кода частоты для карточки и отчётов.
 * Используется только для отображения.
 */
export const frequencyLabel = (code) => {
    switch (normalizeFrequency(code)) {
        case FREQUENCY_CODE.WEEKLY:
            return 'Раз в неделю';
        case FREQUENCY_CODE.DAILY:
            return 'Один раз в день';
        case FREQUENCY_CODE.CUSTOM:
            return 'Регулярно';
        default:
            return 'Не указан';
    }
};
