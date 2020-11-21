import React  from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { green } from '@material-ui/core/colors';

const greenTheme = createMuiTheme({
  palette: {
    primary: green,
  },
});

// Extend the parent theme with only the relevant part for the green theme.
const withGreenTheme = (theme) => ({
  ...theme,
  palette: {
    ...theme.palette,
    ...greenTheme.palette,
  },
});

const PositiveButton = ({
  children,
  ...props
}) => {
  return (
    <ThemeProvider theme={withGreenTheme}>
      <Button {...props} color="primary">
        {children}
      </Button>
    </ThemeProvider>
  );
};

export default PositiveButton;
