import React from 'react';

import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

import ColouredButton from './Coloured';

const redTheme = createMuiTheme({
  palette: {
    primary: red,
  },
});

const NegativeButton = ({ children, ...props }) => (
  <ColouredButton colouredTheme={redTheme} {...props}>
    {children}
  </ColouredButton>
);

export default NegativeButton;
