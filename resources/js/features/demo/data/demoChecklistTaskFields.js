import { v4 as uuidv4 } from 'uuid';
import { i18n } from '@/i18n';
import { TASK_FIELD_TYPE, TASK_FIELD_TYPE_OPTIONS } from '@/config/tasks';

const tt = (...args) => i18n.global.t(...args);

export { TASK_FIELD_TYPE, TASK_FIELD_TYPE_OPTIONS };

const ALLOWED = new Set(Object.values(TASK_FIELD_TYPE));

const MAX_FIELDS = 20;

const numOrNull = (x) => {
    const n = Number(x);
    return Number.isFinite(n) ? n : null;
};

const strOrEmpty = (x) => (typeof x === 'string' ? x.trim() : '');

/**
 * Дефолтный объект `config` при выборе типа поля в форме.
 * Используется `ChecklistTaskFieldsSection` при смене типа в селекте.
 */
export const defaultConfigForFieldType = (fieldType) => {
    switch (fieldType) {
        case TASK_FIELD_TYPE.TEMPERATURE:
            return {
                label: '',
                minC: null,
                maxC: null,
            };
        case TASK_FIELD_TYPE.SINGLE_CHOICE:
            return { question: '', options: [''] };
        case TASK_FIELD_TYPE.TICKET:
            return {
                description: '',
            };
        default:
            return {};
    }
};

/**
 * Создаёт пустую строку «поле задачи» для списка в форме.
 * Используется кнопкой «Добавить поле».
 */
export const createEmptyTaskFieldRow = () => ({
    id: uuidv4(),
    fieldType: null,
    config: {},
});

const normalizeConfig = (fieldType, raw) => {
    const r = raw && typeof raw === 'object' ? raw : {};
    switch (fieldType) {
        case TASK_FIELD_TYPE.TEMPERATURE: {
            const base = {
                label: strOrEmpty(r.label) || tt('demo.task_field_summary.temperature_default'),
                minC: numOrNull(r.minC),
                maxC: numOrNull(r.maxC),
            };
            if (Object.prototype.hasOwnProperty.call(r, 'showCamera')) {
                base.showCamera = Boolean(r.showCamera);
            }
            return base;
        }
        case TASK_FIELD_TYPE.SINGLE_CHOICE: {
            let opts = Array.isArray(r.options)
                ? r.options.map((x) => String(x ?? '').trim()).filter(Boolean)
                : [];
            if (!opts.length) {
                opts = [''];
            }
            return {
                question: strOrEmpty(r.question),
                options: opts.slice(0, 20),
            };
        }
        case TASK_FIELD_TYPE.TICKET:
            return {
                description: strOrEmpty(r.description),
            };
        default:
            return {};
    }
};

/**
 * Нормализует один элемент `taskFieldDefinitions` для записи в задачу.
 * Используется при сборке payload и после загрузки из storage.
 */
export const normalizeTaskFieldDefinitionItem = (item) => {
    if (!item || typeof item !== 'object') {
        return null;
    }
    const ft = item.fieldType;
    if (!ft || !ALLOWED.has(ft)) {
        return null;
    }
    const id = typeof item.id === 'string' && item.id.trim() ? item.id.trim() : uuidv4();
    return {
        id,
        fieldType: ft,
        config: normalizeConfig(ft, item.config),
    };
};

/**
 * Нормализует массив определений полей задачи (лимит, фильтр пустых типов).
 * Используется в `buildChecklistTaskFromPayload` и при merge.
 */
export const normalizeTaskFieldDefinitions = (raw) => {
    if (!Array.isArray(raw)) {
        return [];
    }
    const out = [];
    for (const x of raw.slice(0, MAX_FIELDS)) {
        const n = normalizeTaskFieldDefinitionItem(x);
        if (n) {
            out.push(n);
        }
    }
    return out;
};

/**
 * Краткая подпись поля для read-only в модалке задачи.
 * Используется в `ShowTaskModal` для списка полей.
 */
export const formatTaskFieldSummaryLine = (def) => {
    if (!def?.fieldType) {
        return '';
    }
    const c = def.config ?? {};
    switch (def.fieldType) {
        case TASK_FIELD_TYPE.TEMPERATURE:
            // Одна строка: измеряемая величина + CCP. Где меряем — в строке оборудования/помещений выше, не дублируем `config.label`.
            return tt('demo.task_field_summary.temperature_line', {
                min: c.minC ?? '—',
                max: c.maxC ?? '—',
            });
        case TASK_FIELD_TYPE.SINGLE_CHOICE:
            return tt('demo.task_field_summary.single_choice_line', {
                question: c.question || '—',
                count: Array.isArray(c.options) ? c.options.length : 0,
            });
        case TASK_FIELD_TYPE.TICKET:
            return tt('demo.task_field_summary.ticket_line', {
                description: c.description || tt('demo.task_field_summary.ticket_no_desc'),
            });
        default:
            return def.fieldType;
    }
};
