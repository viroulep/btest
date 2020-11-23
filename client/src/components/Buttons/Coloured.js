import React  from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

// Extend the parent theme with only the relevant part for the theme.
const withColouredTheme = (theme, colouredTheme) => ({
  ...theme,
  palette: {
    ...theme.palette,
    ...colouredTheme.palette,
  },
});

const ColouredButton = ({
  children,
  colouredTheme,
  ...props
}) => {
  return (
    <ThemeProvider theme={(theme) => withColouredTheme(theme, colouredTheme)}>
      <Button {...props} color="primary">
        {children}
      </Button>
    </ThemeProvider>
  );
};

export default ColouredButton;
