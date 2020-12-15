import { useState, useEffect, useCallback } from 'react';

import { availableLocales, localeImporters } from '../locales/importers';
import I18n from 'i18n-js';
import { updateMeUrl } from '../requests/routes';
import { usePostFetch } from './requests';

// Always import the English locale to be able to fallback!
import '../locales/en';

export const useLocale = (defaultLocale) => {
  const [locale, setCurrentLocale] = useState(null);
  const { fetcher, openSnack } = usePostFetch();

  const importAndSetLocale = useCallback(
    (requested) => {
      if (!Object.prototype.hasOwnProperty.call(I18n.translations, requested)) {
        localeImporters[requested]()
          .then(() => {
            setCurrentLocale(requested);
          })
          .catch((e) =>
            openSnack({ message: `Error importing the locale: ${e}` })
          );
      } else {
        setCurrentLocale(requested);
      }
    },
    [setCurrentLocale, openSnack]
  );

  useEffect(() => {
    importAndSetLocale(defaultLocale);
  }, [defaultLocale, importAndSetLocale]);

  const setLocale = useCallback(
    (requested) => {
      if (availableLocales.includes(requested)) {
        // Set the locale locally
        importAndSetLocale(requested);
        // Then try saving the preference in the profile
        fetcher(updateMeUrl(), { user: { locale: requested } }).then(openSnack);
      } else {
        setTimeout(() => openSnack({ message: 'Invalid locale' }), 0);
      }
    },
    [importAndSetLocale, openSnack, fetcher]
  );

  // NOTE: we provide the I18n helper from here, so make the hook the source
  // of truth for the locale value.
  I18n.locale = locale || defaultLocale;
  I18n.fallbacks = true;

  return { locale, setLocale, I18n };
};
