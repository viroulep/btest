import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Link as RouterLink } from 'react-router-dom';
import { signoutUrl } from '../../requests/routes';

const styles = (theme) => ({
  grow: {
    flexGrow: 1,
  },
  mr: {
    marginRight: theme.spacing(1),
  },
});

const Header = ({
  classes,
  user,
}) => {
  // FIXME: mobile menu
  return (
    <Box mb={2}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h3" component="h1">
            Btest
          </Typography>
          <div className={classes.grow} />
          {user && (
            <>
              <Typography variant="h6" component="h2" className={classes.mr}>
                {user.name}
              </Typography>
              <IconButton
                edge="end"
                aria-label="account of current user"
                component={RouterLink}
                to="/profile"
                color="inherit"
                className={classes.mr}
              >
                <AccountCircle />
              </IconButton>
            </>
          )}
          {user && !user.anonymous && (
            <Button
              href={signoutUrl()}
              color='secondary'
              variant='contained'
            >
              signout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default withStyles(styles)(Header);
