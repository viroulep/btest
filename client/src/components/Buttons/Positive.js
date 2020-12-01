import React from 'react';

import { createMuiTheme } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

import ColouredButton from './Coloured';

const greenTheme = createMuiTheme({
  palette: {
    primary: green,
  },
});

const PositiveButton = ({ children, ...props }) => (
  <ColouredButton colouredTheme={greenTheme} {...props}>
    {children}
  </ColouredButton>
);

export default PositiveButton;
