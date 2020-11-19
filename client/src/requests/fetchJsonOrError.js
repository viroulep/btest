export function fetchJsonOrError(url, fetchOptions = {}) {
  // Cookie-based auth, make sure we include it.
  fetchOptions = {
    ...fetchOptions,
    mode: 'cors',
    credentials: 'include',
  };
  console.log(fetchOptions);
  return fetch(url, fetchOptions)
    .then((response) => response.json()
      .then((json) => {
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}\n${json.error}`);
        }
        return json;
      }));
}
