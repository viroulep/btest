import React, { useContext } from 'react';

import UserContext from '../../contexts/UserContext';
import { useLocale } from '../../hooks/locale';
import LocaleContext from '../../contexts/LocaleContext';

const WithLocale = ({ children }) => {
  const user = useContext(UserContext);
  const { locale, setLocale, I18n } = useLocale(user.locale);
  // FIXME: use loading component
  return (
    <>
      {locale ? (
        <LocaleContext.Provider value={{ setLocale, I18n }}>
          {children}
        </LocaleContext.Provider>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default WithLocale;
