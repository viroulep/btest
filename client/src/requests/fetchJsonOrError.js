// Ideally we would turn this into a hook that returns the fetch function,
// used like:
// const action = useFetch(url, fetchOptions);
// action().then(...);
// This way we could use the SnackContext to automatically set the error in
// the snackbar, and let the caller do whatever with the error.
export function fetchJsonOrError(url, fetchOptions = {}) {
  // Cookie-based auth, make sure we include it.
  fetchOptions = {
    ...fetchOptions,
    mode: 'cors',
    credentials: 'include',
  };
  return fetch(url, fetchOptions).then((response) =>
    response.json().then((json) => {
      // Generic error throw for non-200 response
      if (!response.ok) {
        throw new Error(
          `${response.status}: ${response.statusText}\n${json.error}`
        );
      }
      return json;
    })
  );
}
