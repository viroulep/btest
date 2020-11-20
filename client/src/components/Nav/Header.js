import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Button, Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  grow: {
    flexGrow: 1,
  },
}));

const Header = ({
  user,
}) => {
  const classes = useStyles();
  return (
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
  );
};

export default Header;
