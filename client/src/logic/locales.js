import { useState, useEffect, useCallback } from 'react';
import ls from 'local-storage';
import {
  availableLocales,
  defaultLocale,
  localeImporters
} from '../locales/importers';
import I18n from 'i18n-js';

const getSessionLocaleForUser = (me) => {
  // TODO: get from me when implemented
  let requested = ls('locale');
  if (!availableLocales.includes(requested)) {
    requested = defaultLocale;
    ls('locale', requested);
  }
  return requested;
};

const setSessionLocaleForUser = (me, locale) => {
  if (availableLocales.includes(locale)) {
    ls('locale', locale);
    return true;
  } else {
    return false
  }
};

export const useLocale = (me) => {
  const [locale, setCurrentLocale] = useState(null);

  const importAndSetLocale = useCallback((requested) => {
    if (!Object.prototype.hasOwnProperty.call(I18n.translations, requested)) {
      localeImporters[requested]()
        .then(() => setCurrentLocale(requested));
    } else {
      setCurrentLocale(requested);
    }
  }, [setCurrentLocale]);

  useEffect(() => {
    const requested = getSessionLocaleForUser(me);
    // TODO: catch any error
    importAndSetLocale(requested);
  }, [me, importAndSetLocale]);

  const setLocale = useCallback((requested) => {
    if (setSessionLocaleForUser(me, requested)) {
      importAndSetLocale(requested);
    }
  }, [me, importAndSetLocale]);

  return { locale, setLocale };
};
