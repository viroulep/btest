import React, { useReducer } from 'react';
import useLoadedData from './requests/loadable';
import { meUrl } from './requests/routes';
import './App.css';
import Welcome from './components/Welcome/Welcome';
import Breadcrumb from './components/Nav/Breadcrumb';
import Header from './components/Nav/Header';
import Footer from './components/Nav/Footer';
import GamesIndex from './components/Games/Index';
import GameShow from './components/Games/Show';
import EditProfile from './components/Profile/Edit';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { Grid, Container, CssBaseline } from '@material-ui/core';
import { Switch, Route } from 'react-router-dom';
import I18n from 'i18n-js';
import { useLocale } from './logic/locales';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100vh',
    flexDirection: 'column',
  },
  grow: {
    flexGrow: 1,
  },
}));

function App() {
  // NOTE: we need to make *sure* to load the user before doing anything else!
  // Failure to do so may result to duplicate anonymous user.
  const {
    data,
    sync,
  } = useLoadedData(meUrl());

  const [theme, toggle] = useReducer((state) => {
    return state === "light" ? "dark" : "light"
  }, "light");

  const { locale, setLocale } = useLocale(data);
  I18n.locale = locale;

  const muiTheme = createMuiTheme({
    palette: {
      type: theme,
    },
  });

  const classes = useStyles();

  // TODO: extract the main entry point with all the theme + route wrapping
  // to some "withRoot" hook taking an entry point as parameter.
  // TODO: create a loading component
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div className={classes.root}>
      <Grid container direction="column" className={classes.grow}>
        <Grid item>
          <Header user={data} setLocale={setLocale} />
        </Grid>
        <Grid item>
          <Container>
            {data && locale ? (
              <>
                <Breadcrumb />
                <Switch>
                  <Route path="/games" exact>
                    <GamesIndex me={data} />
                  </Route>
                  <Route path="/games/:gameId">
                    <GameShow me={data} />
                  </Route>
                  <Route path="/profile">
                    <EditProfile me={data} sync={sync} />
                  </Route>
                  <Route path="/">
                    <Welcome user={data} toggle={toggle} />
                  </Route>
                </Switch>
              </>
            ) : (
              <p>
                Still loging you in (if nothing happens within seconds, something is most likely wrong).
              </p>
            )}
          </Container>
        </Grid>
        <Grid item className={classes.grow} />
        <Grid item>
          <Footer toggle={toggle} />
        </Grid>
      </Grid>
      </div>
    </ThemeProvider>
  );
}

export default App;
