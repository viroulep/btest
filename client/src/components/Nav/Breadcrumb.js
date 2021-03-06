import React, { useContext } from 'react';
import { Link as RouterLink, Route } from 'react-router-dom';

import { Breadcrumbs, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import LocaleContext from '../../contexts/LocaleContext';

const pathToName = (path) => {
  if (path === '/games') {
    return 'Your games';
  } else if (path.startsWith('/games/')) {
    return path.substring(7);
  } else if (path === '/profile') {
    return 'Profile';
  } else if (path === '/users') {
    return 'Users';
  } else if (path === '/sources') {
    return 'Tracks sources';
  } else if (path === '/sources/add_deezer_mix') {
    return 'Deezer Mixes';
  } else {
    return 'unknown';
  }
};

const useStyles = makeStyles((theme) => ({
  botSpace: {
    marginBottom: theme.spacing(2),
  },
}));

const Breadcrumb = () => {
  const { botSpace } = useStyles();
  const { I18n } = useContext(LocaleContext);
  return (
    <Route>
      {({ location }) => {
        const pathnames = location.pathname.split('/').filter((x) => x);

        return (
          <Breadcrumbs aria-label="breadcrumb" className={botSpace}>
            <Link color="inherit" to="/" component={RouterLink}>
              {I18n.t('nav.home')}
            </Link>
            {pathnames.map((value, index) => {
              const last = index === pathnames.length - 1;
              const to = `/${pathnames.slice(0, index + 1).join('/')}`;

              return last ? (
                <Typography color="textPrimary" key={to}>
                  {pathToName(to)}
                </Typography>
              ) : (
                <Link color="inherit" to={to} key={to} component={RouterLink}>
                  {pathToName(to)}
                </Link>
              );
            })}
          </Breadcrumbs>
        );
      }}
    </Route>
  );
};

export default Breadcrumb;
