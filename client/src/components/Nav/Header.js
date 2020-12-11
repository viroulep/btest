import React, { useState, useCallback, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Box,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import TranslateRoundedIcon from '@material-ui/icons/TranslateRounded';

import { signoutUrl } from '../../requests/routes';
import { availableLocales } from '../../locales/importers';
import UserContext from '../../contexts/UserContext';
import LocaleContext from '../../contexts/LocaleContext';

const styles = (theme) => ({
  grow: {
    flexGrow: 1,
  },
  mr: {
    marginRight: theme.spacing(1),
  },
});

const Header = ({ classes }) => {
  const [open, setOpen] = useState(null);
  const { setLocale } = useContext(LocaleContext);
  const handleAction = (action, ev) => {
    if (action === 'open') {
      setOpen(ev.currentTarget);
    } else if (action === 'close') {
      setOpen(null);
    }
  };
  const handleSetLocale = useCallback(
    (locale) => {
      setLocale(locale);
      setOpen(null);
    },
    [setOpen, setLocale]
  );
  const user = useContext(UserContext);

  // FIXME: mobile menu
  return (
    <Box mb={2}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h3" component="h1">
            Btest
          </Typography>
          <div className={classes.grow} />
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
          <IconButton
            edge="end"
            aria-label="locale of current user"
            aria-haspopup="true"
            color="inherit"
            onClick={(ev) => handleAction('open', ev)}
            className={classes.mr}
          >
            <TranslateRoundedIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={open}
            keepMounted
            open={Boolean(open)}
            onClose={() => handleAction('close')}
          >
            {availableLocales.map((l) => (
              <MenuItem key={l} onClick={() => handleSetLocale(l)}>
                {l}
              </MenuItem>
            ))}
          </Menu>
          {!user.anonymous && (
            <Button href={signoutUrl()} color="secondary" variant="contained">
              signout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default withStyles(styles)(Header);
