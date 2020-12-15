import { useContext, useCallback } from 'react';

import SnackContext from '../contexts/SnackContext';

const useFetch = () => {
  const openSnack = useContext(SnackContext);
  // useCallback is there to avoid the function changing across rendering when
  // used from a component.
  const fetcher = useCallback(
    (url, options = {}) => {
      // Cookie-based auth, make sure we include it.
      options = {
        ...options,
        mode: 'cors',
        credentials: 'include',
      };
      return fetch(url, options)
        .then((response) =>
          response.json().then((json) => {
            // Generic error throw for non-200 response
            if (!response.ok) {
              throw new Error(
                `${response.status}: ${response.statusText}\n${json.error}`
              );
            }
            return json;
          })
        )
        .catch((data) => {
          openSnack(data);
          return Promise.reject(data);
        });
    },
    [openSnack]
  );
  return { fetcher, openSnack };
};

const usePostFetch = () => {
  const fetchHook = useFetch();
  const fetcher = useCallback(
    (url, body, options = {}) => {
      options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        ...options,
      };
      return fetchHook.fetcher(url, options);
    },
    [fetchHook]
  );

  return { fetcher, openSnack: fetchHook.openSnack };
};

export { useFetch, usePostFetch };
