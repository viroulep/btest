import { useState, useCallback } from 'react';

const useSnackbar = () => {
  const [snack, setSnack] = useState({
    open: false,
    severity: 'success',
    message: '',
  });

  const openSnack = useCallback(
    (data) => {
      const { success, message } = data;
      setSnack({
        open: true,
        severity: success ? 'success' : 'error',
        message,
      });
    },
    [setSnack]
  );

  return { openSnack, snack, setSnack };
};

export default useSnackbar;
