import React from 'react';

const WithLoading = ({
  Component,
  loadedData,
  ...props
}) => {
  const { data, error, loading } = loadedData;
  return (
    <>
      {error && (
        <p>oups, an error happened!</p>
      )}
      {loading && (
        <p>loading</p>
      )}
      {!loading && data && (
        <Component {...props} />
      )}
    </>
  );
};

export default WithLoading;
