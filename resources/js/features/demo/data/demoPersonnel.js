/**
 * Дефолтные площадки и персонал для демо HACCP (без backend).
 */
import { i18n } from '@/i18n';
const tt = (...args) => i18n.global.t(...args);

/**
 * Увеличивать при смене дефолтных `sites`/`staff` в коде: тогда из localStorage подтянутся новые моки,
 * а не старые поля, сохранённые поверх merge.
 */
export const DEMO_STATE_SCHEMA_VERSION = 12;

export const DEFAULT_SITES = [
    {
        id: 'site-coffee',
        name: 'Grain & Fire Roastery',
        address: "Roasters' Quay 14, 1012 AB Amsterdam, Netherlands",
    },
    {
        id: 'site-bakery',
        name: 'Piotr Bakery',
        address: 'Chlebna 12, 00-001 Warsaw, Poland',
    },
    {
        id: 'site-meat',
        name: 'Columbus Meat Processing',
        address: '2450 Industrial Blvd, Suite 300, Columbus, OH 43215, USA',
    },
];

export const DEFAULT_STAFF = [
    {
        id: 'staff-coffee-1',
        siteId: 'site-coffee',
        fullName: 'Morgan James',
        role: tt('demo.staff_roles.senior_roaster'),
        phone: '+31 20 555 0101',
        email: 'j.morgan@demo.local',
        active: true,
    },
    {
        id: 'staff-coffee-2',
        siteId: 'site-coffee',
        fullName: 'Richardson Emma',
        role: tt('demo.staff_roles.food_technologist'),
        phone: '+31 20 555 0102',
        email: 'e.richardson@demo.local',
        active: true,
    },
    {
        id: 'staff-coffee-3',
        siteId: 'site-coffee',
        fullName: "O'Brien Michael",
        role: tt('demo.staff_roles.warehouse_keeper'),
        phone: '+31 20 555 0103',
        email: 'm.obrien@demo.local',
        active: true,
    },
    {
        id: 'staff-bakery-1',
        siteId: 'site-bakery',
        fullName: 'Laurent Sophie',
        role: tt('demo.staff_roles.bakery_technologist'),
        phone: '+48 22 555 0101',
        email: 's.laurent@demo.local',
        active: true,
    },
    {
        id: 'staff-bakery-2',
        siteId: 'site-bakery',
        fullName: 'Keller Thomas',
        role: tt('demo.staff_roles.baker_6th_grade'),
        phone: '+48 22 555 0102',
        email: 't.keller@demo.local',
        active: true,
    },
    {
        id: 'staff-bakery-3',
        siteId: 'site-bakery',
        fullName: 'Kowalska Anna',
        role: tt('demo.staff_roles.shift_supervisor'),
        phone: '+48 22 555 0103',
        email: 'a.kowalska@demo.local',
        active: true,
    },
    {
        id: 'staff-meat-1',
        siteId: 'site-meat',
        fullName: 'Hayes David',
        role: tt('demo.staff_roles.meat_shop_foreman'),
        phone: '+1 614 555 0101',
        email: 'd.hayes@demo.local',
        active: true,
    },
    {
        id: 'staff-meat-2',
        siteId: 'site-meat',
        fullName: 'Walsh Jennifer',
        role: tt('demo.staff_roles.cold_chain_specialist'),
        phone: '+1 614 555 0102',
        email: 'j.walsh@demo.local',
        active: true,
    },
    {
        id: 'staff-meat-3',
        siteId: 'site-meat',
        fullName: 'Chen Robert',
        role: tt('demo.staff_roles.qc_inspector'),
        phone: '+1 614 555 0103',
        email: 'r.chen@demo.local',
        active: true,
    },
];

/**
 * Эмодзи площадки в UI демо (табы «Персонал», подписи в селекте площадки в модалке сотрудника).
 */
export const DEMO_SITE_EMOJI = Object.freeze({
    'site-coffee': '☕',
    'site-bakery': '🥐',
    'site-meat': '🥩',
});

/**
 * @param {string} siteId
 * @returns {string}
 */
export function siteEmojiForDemo(siteId) {
    return DEMO_SITE_EMOJI[siteId] ?? '';
}

/**
 * Дефолтный ответственный по id задачи CCP (ниша уже задана сценарием демо).
 * Используется при первом создании state и при восстановлении битых ссылок на персонал.
 */
export const DEFAULT_TASK_ASSIGNEE_IDS = {
    'coffee-1': 'staff-coffee-1',
    'coffee-2': 'staff-coffee-1',
    'coffee-3': 'staff-coffee-3',
    'coffee-4': 'staff-coffee-2',
    'coffee-5': 'staff-coffee-2',
    'bakery-1': 'staff-bakery-2',
    'bakery-2': 'staff-bakery-2',
    'bakery-3': 'staff-bakery-3',
    'bakery-4': 'staff-bakery-1',
    'bakery-5': 'staff-bakery-1',
    'meat-1': 'staff-meat-2',
    'meat-2': 'staff-meat-3',
    'meat-3': 'staff-meat-2',
    'meat-4': 'staff-meat-3',
    'meat-5': 'staff-meat-1',
};
