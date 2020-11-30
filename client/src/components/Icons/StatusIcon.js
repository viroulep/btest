import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  valid: {
    color: 'green',
  },
}));

const StatusIcon = ({ Component, isValid }) => {
  const { valid } = useStyles();
  return <Component className={isValid ? valid : ''} fontSize="small" />;
};

export default StatusIcon;
