import React from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

const Snack = ({ snack, setSnack }) => {
  const { open, severity, message } = snack;
  const closeSnack = () =>
    setSnack({
      ...snack,
      open: false,
    });
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      onClose={closeSnack}
    >
      <Alert
        variant="filled"
        onClose={closeSnack}
        severity={severity || 'success'}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Snack;
