import { useState, useEffect, useCallback } from 'react';
import { useFetch } from '../hooks/requests';

// This is a hook that can be used to get a data from the website (as json)
// It assumes that 'url' is a valid, GET-able, url.
// Example of usage:
// const { data, loading, error, sync } = useLoadedData(`path/to/resource`);
const useLoadedData = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetcher } = useFetch();

  const sync = useCallback(() => {
    setLoading(true);
    setError(null);
    fetcher(url)
      .then((loaded) => {
        setData(loaded);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [url, setData, setError, fetcher]);

  useEffect(sync, [sync]);

  return {
    data,
    loading,
    error,
    sync,
  };
};

export default useLoadedData;
