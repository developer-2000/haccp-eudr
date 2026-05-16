/**
 * Конфигурация панелей и прочего для задач
 */
import { i18n } from '@/i18n';
const tt = (...args) => i18n.global.t(...args);

/**
 * Коды типов полей секции «Суть задачи».
 * Используются в данных задачи (`taskFieldDefinitions`) и в UI-условиях.
 */
export const TASK_FIELD_TYPE = {
    TEMPERATURE: 'temperature',
    SINGLE_CHOICE: 'single_choice',
    TICKET: 'ticket',
};

/**
 * Опции селекта для выбора типа поля в секции «Суть задачи».
 */
function getTaskFieldTypeOptionsBase() {
    return [
        { label: tt('demo.task_fields.single_choice'), value: TASK_FIELD_TYPE.SINGLE_CHOICE },
        { label: tt('demo.task_fields.ticket'), value: TASK_FIELD_TYPE.TICKET },
    ];
}

function getTaskFieldTypeOptionsEquipment() {
    return [
        { label: tt('demo.task_fields.temperature'), value: TASK_FIELD_TYPE.TEMPERATURE },
        ...getTaskFieldTypeOptionsBase(),
    ];
}

export const TASK_FIELD_TYPE_OPTIONS_BASE = getTaskFieldTypeOptionsBase;
export const TASK_FIELD_TYPE_OPTIONS_EQUIPMENT = getTaskFieldTypeOptionsEquipment;
export const TASK_FIELD_TYPE_OPTIONS = getTaskFieldTypeOptionsEquipment;

/**
 * Собирает опции селекта по выбранному типу задачи.
 * Для rooms доступны только single_choice и ticket; для остальных — полный набор.
 */
export const taskFieldTypeOptionsByScopeType = (taskScopeType) =>
    taskScopeType === 'rooms' ? getTaskFieldTypeOptionsBase() : getTaskFieldTypeOptionsEquipment();

/**
 * Ниша группы оборудования относительно табов чек-листа (`coffee` | `bakery` | `meat`).
 * `different` — общие группы, показываются при создании задачи в любой нише.
 *
 * @typedef {'meat'|'bread'|'coffee'|'different'} EquipmentGroupTypeEquipment
 */

/**
 * Группы и элементы «Предмета задачи» для типа «Оборудование».
 * Используются в чекбоксах выбора оборудования в модалке добавления задачи.
 *
 * У каждой группы поле **`typeEquipment`** — рядом с **`groupTitle`**, не на элементах `items`.
 */
export const EQUIPMENT_GROUPS = [
    {
        groupTitle: tt('demo.equipment.group_coffee_roasting'),
        typeEquipment: 'coffee',
        items: [
            { id: 'eq-coffee-roaster', label: tt('demo.equipment.eq_roaster') },
            { id: 'eq-coffee-destoner', label: tt('demo.equipment.eq_destoner') },
            { id: 'eq-coffee-machine', label: tt('demo.equipment.eq_coffee_machine') },
        ],
    },
    {
        groupTitle: tt('demo.equipment.group_coffee_cooling'),
        typeEquipment: 'coffee',
        items: [
            { id: 'eq-coffee-bean-cooler', label: tt('demo.equipment.eq_bean_cooler') },
            { id: 'eq-coffee-shock-cooler', label: tt('demo.equipment.eq_shock_cooler') },
        ],
    },
    {
        groupTitle: tt('demo.equipment.group_coffee_storage'),
        typeEquipment: 'coffee',
        items: [
            { id: 'eq-coffee-vacuum-containers', label: tt('demo.equipment.eq_vacuum_containers') },
            { id: 'eq-coffee-warehouse-shelving', label: tt('demo.equipment.eq_storage_racks') },
            { id: 'eq-coffee-grain-canisters', label: tt('demo.equipment.eq_bean_canisters') },
        ],
    },
    {
        groupTitle: tt('demo.equipment.group_bread_sponge'),
        typeEquipment: 'bread',
        items: [
            { id: 'eq-bread-spiral-mixer', label: tt('demo.equipment.eq_dough_mixer') },
            { id: 'eq-bread-preferment-vat', label: tt('demo.equipment.eq_sponge_vat') },
        ],
    },
    {
        groupTitle: tt('demo.equipment.group_bread_proofing'),
        typeEquipment: 'bread',
        items: [
            { id: 'eq-bread-proofing-cabinet', label: tt('demo.equipment.eq_proofing_cabinet') },
            { id: 'eq-bread-proofing-trays', label: tt('demo.equipment.eq_proofing_trays') },
        ],
    },
    {
        groupTitle: tt('demo.equipment.group_bread_baking'),
        typeEquipment: 'bread',
        items: [
            { id: 'eq-bread-rotary-oven', label: tt('demo.equipment.eq_rotary_oven') },
            { id: 'eq-bread-crumb-probe', label: tt('demo.equipment.eq_core_thermometer') },
        ],
    },
    {
        groupTitle: tt('demo.equipment.group_bread_cooling'),
        typeEquipment: 'bread',
        items: [
            { id: 'eq-bread-cooling-conveyor', label: tt('demo.equipment.eq_cooling_conveyor') },
            { id: 'eq-bread-ventilated-racks', label: tt('demo.equipment.eq_ventilation_racks') },
        ],
    },
    {
        groupTitle: tt('demo.equipment.group_meat_chilled'),
        typeEquipment: 'meat',
        items: [
            { id: 'eq-meat-chilled-room', label: tt('demo.equipment.eq_cold_chamber') },
            { id: 'eq-meat-chilled-cabinet', label: tt('demo.equipment.eq_cold_cabinet') },
            { id: 'eq-meat-chilled-display', label: tt('demo.equipment.eq_cold_display') },
            {
                id: 'eq-meat-chilled-semi-finished',
                label: tt('demo.equipment.eq_semi_finished_chamber'),
            },
        ],
    },
    {
        groupTitle: tt('demo.equipment.group_meat_frozen'),
        typeEquipment: 'meat',
        items: [
            { id: 'eq-meat-freezer-room', label: tt('demo.equipment.eq_freezer_chamber') },
            { id: 'eq-meat-shock-freezer', label: tt('demo.equipment.eq_shock_freezer') },
            { id: 'eq-meat-freezer-cabinet', label: tt('demo.equipment.eq_freezer_cabinet') },
            { id: 'eq-meat-deep-freezer', label: tt('demo.equipment.eq_deep_freezer') },
        ],
    },
    {
        groupTitle: tt('demo.equipment.group_cooking'),
        typeEquipment: 'different',
        items: [
            { id: 'eq-stove', label: tt('demo.equipment.eq_stove') },
            { id: 'eq-combi-oven', label: tt('demo.equipment.eq_combi_oven') },
            { id: 'eq-fryer', label: tt('demo.equipment.eq_fryer') },
        ],
    },
    {
        groupTitle: tt('demo.equipment.group_cold_storage'),
        typeEquipment: 'different',
        items: [
            { id: 'eq-fridge-1', label: tt('demo.equipment.eq_fridge_1') },
            { id: 'eq-fridge-2', label: tt('demo.equipment.eq_fridge_2') },
            { id: 'eq-freezer', label: tt('demo.equipment.eq_freezer') },
            { id: 'eq-cold-storage', label: tt('demo.equipment.eq_cold_storage') },
            { id: 'eq-frozen-storage', label: tt('demo.equipment.eq_frozen_storage') },
            { id: 'eq-cold-display', label: tt('demo.equipment.eq_cold_display_gen') },
            { id: 'eq-dry-goods', label: tt('demo.equipment.eq_dry_goods') },
            { id: 'eq-vacuum-packer', label: tt('demo.equipment.eq_vacuum_packer') },
            { id: 'eq-ice-maker', label: tt('demo.equipment.eq_ice_maker') },
        ],
    },
    {
        groupTitle: tt('demo.equipment.group_control'),
        typeEquipment: 'different',
        items: [
            { id: 'eq-probe-1', label: tt('demo.equipment.eq_probe_1') },
            { id: 'eq-probe-2', label: tt('demo.equipment.eq_probe_2') },
            { id: 'eq-scale', label: tt('demo.equipment.eq_scale') },
        ],
    },
    {
        groupTitle: tt('demo.equipment.group_surfaces'),
        typeEquipment: 'different',
        items: [
            { id: 'eq-countertop', label: tt('demo.equipment.eq_countertop') },
            { id: 'eq-cutting-boards', label: tt('demo.equipment.eq_cutting_boards') },
            { id: 'eq-door-handles', label: tt('demo.equipment.eq_door_handles') },
            { id: 'eq-switches', label: tt('demo.equipment.eq_switches') },
            { id: 'eq-windows', label: tt('demo.equipment.eq_windows') },
            { id: 'eq-ceiling', label: tt('demo.equipment.eq_ceiling') },
            { id: 'eq-floors', label: tt('demo.equipment.eq_floors') },
            { id: 'eq-tables', label: tt('demo.equipment.eq_tables') },
            { id: 'eq-toilet', label: tt('demo.equipment.eq_toilet') },
        ],
    },
    {
        groupTitle: tt('demo.equipment.group_sanitation'),
        typeEquipment: 'different',
        items: [
            { id: 'eq-sinks', label: tt('demo.equipment.eq_sinks') },
            { id: 'eq-handwash', label: tt('demo.equipment.eq_handwash') },
            { id: 'eq-dishwasher', label: tt('demo.equipment.eq_dishwasher') },
            { id: 'eq-pre-rinse', label: tt('demo.equipment.eq_pre_rinse') },
            { id: 'eq-dishes', label: tt('demo.equipment.eq_dishes') },
            { id: 'eq-cutlery-containers', label: tt('demo.equipment.eq_cutlery_containers') },
        ],
    },
    {
        groupTitle: tt('demo.equipment.group_logistics'),
        typeEquipment: 'different',
        items: [
            { id: 'eq-transport-box', label: tt('demo.equipment.eq_transport_box') },
            { id: 'eq-trolley', label: tt('demo.equipment.eq_trolley') },
            { id: 'eq-trash-bins', label: tt('demo.equipment.eq_trash_bins') },
            { id: 'eq-wall-shelf', label: tt('demo.equipment.eq_wall_shelf') },
            { id: 'eq-cleaning-cabinet', label: tt('demo.equipment.eq_cleaning_cabinet') },
        ],
    },
];

/**
 * Таб чек-листа (`ChecklistsSection`): `coffee` | `bakery` | `meat` → тип группы оборудования.
 * Пекарня в данных — `bakery`, в группах — `bread`.
 *
 * @param {string|null|undefined} checklistNiche
 * @returns {EquipmentGroupTypeEquipment}
 */
export function checklistNicheToEquipmentGroupType(checklistNiche) {
    const n = String(checklistNiche ?? '').trim();
    if (n === 'bakery') {
        return 'bread';
    }
    if (n === 'coffee' || n === 'meat') {
        return n;
    }
    return 'different';
}

/**
 * Группы оборудования для модалки создания задачи: нишевая выборка + общие (`different`).
 *
 * @param {string|null|undefined} checklistNiche
 * @returns {typeof EQUIPMENT_GROUPS}
 */
export function equipmentGroupsForChecklistNiche(checklistNiche) {
    const want = checklistNicheToEquipmentGroupType(checklistNiche);
    return EQUIPMENT_GROUPS.filter(
        (g) => g.typeEquipment === want || g.typeEquipment === 'different',
    );
}
