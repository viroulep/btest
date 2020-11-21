import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Box, Toolbar, Button, Typography } from '@material-ui/core';

const styles = () => ({
  grow: {
    flexGrow: 1,
  },
});

const Header = ({
  classes,
  user,
}) => {
  return (
    <Box mb={2}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Btest
          </Typography>
          <div className={classes.grow} />
          {user && (
            user.name
          )}
          {(!user || user.anonymous) && (
            <Button color="inherit">Login-TODO</Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default withStyles(styles)(Header);
