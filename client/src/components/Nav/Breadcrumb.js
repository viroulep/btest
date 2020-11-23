import React from 'react';
import { Breadcrumbs, Link, Typography } from '@material-ui/core';
import { Link as RouterLink, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const pathToName = (path) => {
  if (path === '/games') {
    return 'Games';
  } else if (path.startsWith('/games/')) {
    return path.substring(7);
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
  return (
    <Route>
      {({ location }) => {
        const pathnames = location.pathname.split('/').filter((x) => x);

        return (
          <Breadcrumbs aria-label="breadcrumb" className={botSpace}>
            <Link color="inherit" to="/" component={RouterLink}>
              Home
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
