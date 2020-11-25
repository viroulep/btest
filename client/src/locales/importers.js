// This file is generated automatically by the i18n:export rake task!
// DO NOT EDIT IT MANUALLY!
const localeImporters = {
  en: () => import('./en'),
  fr: () => import('./fr'),
};

const availableLocales = Object.keys(localeImporters);
const defaultLocale = 'en';
export { localeImporters, availableLocales, defaultLocale };
