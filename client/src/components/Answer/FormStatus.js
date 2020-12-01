import React from 'react';
import clsx from 'clsx';

import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    minHeight: '40px',
  },
  bgOk: {
    backgroundColor: 'green',
  },
  bgKo: {
    backgroundColor: 'red',
  },
}));

const FormStatus = ({ status }) => {
  const { message, success } = status;
  const hasMessage = message.length > 0;
  const valid = hasMessage && success;
  const invalid = hasMessage && !success;
  const { paper, bgOk, bgKo } = useStyles();
  return (
    <Paper
      variant="outlined"
      className={clsx(paper, valid && bgOk, invalid && bgKo)}
    >
      {hasMessage && <>{message}</>}
    </Paper>
  );
};

export default FormStatus;
