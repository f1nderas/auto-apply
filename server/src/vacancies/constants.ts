const HH_BASE_URL = 'https://hh.ru';
const HH_STATIC_VERSION = '26.22.3.5';

const ESSENTIAL_COOKIES = new Set([
  '_xsrf',
  'hhtoken',
  'hhuid',
  'crypted_id',
  'crypted_hhuid',
  'hhul',
  'hhrole',
  'display',
  'regions',
  'redirect_host',
  'GMT',
  'TZ',
  // GIB (Group-IB) антибот — ротируются каждые несколько часов
  'fgsscgib-w-hh',
  'gsscgib-w-hh',
  'cfidsgib-w-hh',
  '__zzatgib-w-hh',
  // DataDome антибот — стабильный fingerprint браузера
  '__ddg1_',
]);

export { HH_BASE_URL, HH_STATIC_VERSION, ESSENTIAL_COOKIES };
