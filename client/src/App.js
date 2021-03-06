import React, { useReducer, useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import pink from '@material-ui/core/colors/pink';
import blue from '@material-ui/core/colors/blue';
import { ThemeProvider } from '@material-ui/styles';
import { Grid, Container, CssBaseline } from '@material-ui/core';

import useLoadedData from './requests/loadable';
import { meUrl } from './requests/routes';
import Welcome from './components/Welcome/Welcome';
import Breadcrumb from './components/Nav/Breadcrumb';
import Header from './components/Nav/Header';
import Footer from './components/Nav/Footer';
import GamesIndex from './components/Games/Index';
import UsersIndex from './components/Users/Index';
import GameShow from './components/Games/Show';
import GameNew from './components/Games/New';
import AddMix from './components/DeezerMixes/Add';
import EditProfile from './components/Profile/Edit';
import UserContext from './contexts/UserContext';
import SnackContext from './contexts/SnackContext';
import useSnackbar from './hooks/snackbar';
import Snackbar from './components/Snackbar/Snack';
import WithLocale from './components/WithLocale/WithLocale';
import './App.css';

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
  // FIXME: to let useLoadedDate use the app-wide snackbar, there should be
  // another layer wrapping it, with the snackbar provider.
  // NOTE: we need to make *sure* to load the user before doing anything else!
  // Failure to do so may result to duplicate anonymous user.
  const { data, sync } = useLoadedData(meUrl());

  // A simple effect to track if the user has interacted with the page.
  // The aim is to check if we should display a modal when they join a game,
  // so that their browser doesn't block the autoplay of the songs.
  const [hasInteracted, setHasInteracted] = useState(false);
  useEffect(() => {
    const handler = () => setHasInteracted(true);
    // We just need the event listener until the user actually interacted.
    if (!hasInteracted) {
      window.addEventListener('click', handler, false);
    }
    return () => {
      if (!hasInteracted) {
        window.removeEventListener('click', handler, false);
      }
    };
  }, [hasInteracted, setHasInteracted]);

  const [theme, toggle] = useReducer((state) => {
    return state === 'light' ? 'dark' : 'light';
  }, 'light');

  const { snack, setSnack, openSnack } = useSnackbar();

  const muiTheme = createMuiTheme({
    palette: {
      primary: {
        main: pink[800],
      },
      secondary: {
        main: blue[700],
      },
      type: theme,
    },
    overrides: {
      MuiLink: {
        root: {
          color: pink[400],
        },
      },
      MuiTab: {
        textColorPrimary: {
          color: pink[400],
          '&$selected': {
            color: pink[400],
          },
        },
      },
    },
  });

  const classes = useStyles();

  // TODO: extract the main entry point with all the theme + route wrapping
  // to some "withRoot" hook taking an entry point as parameter.
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Snackbar snack={snack} setSnack={setSnack} />
      <SnackContext.Provider value={openSnack}>
        <div className={classes.root}>
          {data ? (
            <UserContext.Provider value={data}>
              <WithLocale>
                <Grid container direction="column" className={classes.grow}>
                  <Grid item>
                    <Header />
                  </Grid>
                  <Grid item>
                    <Container>
                      <Breadcrumb />
                      <Switch>
                        {data.admin && (
                          <Route path="/users" exact>
                            <UsersIndex />
                          </Route>
                        )}
                        <Route path="/games" exact>
                          <GamesIndex />
                        </Route>
                        <Route path="/games/new" exact>
                          {data.anonymous ? (
                            <Redirect to="/games" />
                          ) : (
                            <GameNew />
                          )}
                        </Route>
                        <Route path="/games/:gameId">
                          <GameShow hasInteracted={hasInteracted} />
                        </Route>
                        <Route path="/sources/add_deezer_mix" exact>
                          {data.admin ? <AddMix /> : <Redirect to="/" />}
                        </Route>
                        <Route path="/profile">
                          <EditProfile sync={sync} />
                        </Route>
                        <Route path="/">
                          <Welcome toggle={toggle} />
                        </Route>
                      </Switch>
                    </Container>
                  </Grid>
                  <Grid item className={classes.grow} />
                  <Grid item>
                    <Footer toggle={toggle} />
                  </Grid>
                </Grid>
              </WithLocale>
            </UserContext.Provider>
          ) : (
            <p>
              Still signing you in (if nothing happens within seconds, something
              is most likely wrong).
            </p>
          )}
        </div>
      </SnackContext.Provider>
    </ThemeProvider>
  );
}

export default App;
