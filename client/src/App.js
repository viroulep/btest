import React, { useReducer, useState, useEffect, useCallback, useRef } from 'react';
import logo from './logo.svg';
import _ from 'lodash';
import useLoadedData from './requests/loadable';
import { fetchJsonOrError } from './requests/fetchJsonOrError';
import './App.css';
import consumer from './consumer';
import Welcome from './components/Welcome/Welcome';
import Header from './components/Nav/Header';
import Footer from './components/Nav/Footer';
import WithLoading from './components/WithLoading/WithLoading';
import GamesIndex from './components/Games/Index';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/styles';
import { AppBar, Box, Grid, Container, CssBaseline, Toolbar, IconButton, Fab } from '@material-ui/core';
import {
  Switch,
  Route,
  Link,
  useParams,
} from 'react-router-dom';

const BASE_URL = 'http://localhost:1235';
const gamesUrl = () => `${BASE_URL}/games`;
const gameUrl = (id) => `${gamesUrl()}/${id}`;
const meUrl = () => `${BASE_URL}/me`;
const attemptUrl = (id) => `${gameUrl(id)}/attempt`;
const myAnswersUrl = (id) => `${gameUrl(id)}/mine`;
const gameStartUrl = (id) => `${gameUrl(id)}/start`;
const gameStopUrl = (id) => `${gameUrl(id)}/abort`;

// TODO reach router

const statusForGame = game => {
  if (game.finished) {
    return "finished";
  } else if (game.aborted) {
    return "aborted";
  } else if (game.running) {
    return "running";
  } else if (game.available) {
    return "will start";
  } else {
    return "TODO";
  }
};

const AnswerForm = ({
  gameId,
  currentTrack,
}) => {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState(null);

  // Reset on game change
  useEffect(() => {
    setValue("");
    setStatus(null);
  }, [gameId, currentTrack]);

  // TODO: use callback without dep!
  const submitAnswer = useCallback((ev) => {
    console.log("submitting!");
    ev.preventDefault();
    const query = ev.target.query.value;
    if (query.length <= 0) {
      return;
    }
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: ev.target.query.value })
    };
    fetchJsonOrError(attemptUrl(gameId), requestOptions)
        .then(setStatus);
    setValue("");
  }, [gameId, setValue, setStatus]);

  return (
    <div>
      <form onSubmit={submitAnswer}>
        <label>
          coucou:
          <input name="query" type="text" value={value} onChange={e => setValue(e.target.value)} />
        </label>
        <input type="submit" value="Submit" />
        <p style={{ minHeight: "30px" }}>
          {status && (
            <span>{status.message} (nice: {status.success ? "yes" : "no"})</span>
          )}
        </p>
      </form>
    </div>
  );
};

const PreviewElement = ({
  preview
}) => {
  const [audio, setAudio] = useState(new Audio);
  // FIXME: rework this with usereducer
  // Upon changing preview, pause any running song, and generate a new audio.
  useEffect(() => {
    if (!preview) return;
    audio.pause();
    audio.src = preview
    audio.play();
  }, [preview, audio]);

  return (
    <div>
      coucou audio
    </div>
  )
};

const AnswerMarks = ({
  data,
}) => {
  const answer = data ? data : {
    artist: false,
    title: false,
    fast: false,
    worthy_position: 0,
    total_points: 0,
  };
  return (
    <div>
      artist:
      {answer.artist ? (
        "ok"
      ) : (
        "ko"
      )}
      , title:
      {answer.title ? (
        "ok"
      ) : (
        "ko"
      )}
      , fast:
      {answer.fast ? (
        "ok"
      ) : (
        "ko"
      )}
      , worthy position:
      {answer.worthy_position}
      , points:
      {answer.total_points}
    </div>
  )
};

const PastTracksPanel = ({
  gameId,
  tracks,
}) => {
  const {
    data, loading, error, sync,
  } = useLoadedData(
    myAnswersUrl(gameId),
  );

  // Sync my past answers when tracks change (new song)
  useEffect(sync, [tracks, sync]);

  const myAnswers = data || {}
  const lastTrackIndex = tracks.length - 1;
  console.log("past tracks for me:");
  console.log(data);
  if (data) {
    console.log(data[1]);
    console.log(data[0]);
  }
  return (
    <>
      <h3>Past songs</h3>
      <ul>
        {tracks.map((v, k) => (
          <li key={k}>
            <img src={v.cover_url} /><b>{v.title}</b> - <b>{v.artist}</b>
            <br/>
            <AnswerMarks data={myAnswers[lastTrackIndex - k]} />
          </li>
        ))}
      </ul>
    </>
  );
};

const Game = ({
  gameId,
  setMsg,
  me,
}) => {
  const {
    data, loading, error, sync,
  } = useLoadedData(
    gameUrl(gameId),
  );

  // The state is split into 'state' and 'rankings' for some reasons:
  //   - 'rankings' will be updated often, whenever users joins or answers are
  //   given. It's probably worth to not redraw the full state because of that.
  //   Also we need a somehow fixed 'setRankings' to provide to the subscription
  //   'receive' handler.
  //   - The rest of the state will only be udpated when each round finishes.
  // useReducer! https://reactjs.org/docs/hooks-reference.html#usereducer
  const [state, setState] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [localAnswers, setLocalAnswers] = useState([]);
  const [preview, setPreview] = useState(null);

  const setStateFromData = useCallback((data) => {
    if (!data) return;
    console.log(data);
    setRankings(data.rankings);
    setState(data);
  }, [setState, setRankings]);

  const startGame = useCallback((id) => {
    fetchJsonOrError(gameStartUrl(id), { method: 'POST' })
      .then((data) => {
        setMsg(`Success: ${data.success ? "yes" : "no"}, msg: ${data.message}`);
      });
  }, [setMsg]);

  const stopGame = useCallback((id) => {
    fetchJsonOrError(gameStopUrl(id), { method: 'POST' })
      .then((data) => {
        setMsg(`Success: ${data.success ? "yes" : "no"}, msg: ${data.message}`);
      });
  }, [setMsg]);

  // Set the game state when available/synced
  useEffect(() => setStateFromData(data), [data, setStateFromData]);

  useEffect(() => {
    if (!gameId)
      return;
    // unsubscribe/subscribe
    console.log("gameId has changed to: " + gameId);
    const sub = consumer.subscriptions.create({
      channel: "GameChannel",
      id: gameId,
    }, {
      received(data) {
        console.log("received some data");
        console.log(data);
        if (data.rankings) {
          setRankings(data.rankings);
        }
        if (data.state) {
          setStateFromData(data.state);
          // If we receive a full state it's a sync from the server.
          // We should download our own answers!
        }
        if (data.preview) {
          const curr = data.state.current;
          setMsg(`Cheater mode: received ${curr.title} from ${curr.artist}`);
          setPreview(data.preview);
        }
      },
    })
    return () => {
      if (!gameId)
        return;
      consumer.subscriptions.remove(sub);
      console.log("cleanup for: " + gameId);
    };
  }, [gameId, setMsg, setStateFromData]);

  const myRanking = rankings.find(el => (el.id === me.id && el.anonymous === me.anonymous));
  const myLastAnswer = myRanking ? myRanking.current : null;
  console.log("mylast:");
  console.log(myLastAnswer);

  return (
    <div>
      {error && (
        <p>oups, an error happened!<br/>{error}</p>
      )}
      {loading && (
        <p>loading</p>
      )}
      {state && (
        <>
          <h2>
            Selected game: {state.slug}
              <button onClick={() => startGame(gameId)}>
                go
              </button>
              <button onClick={() => stopGame(gameId)}>
                stop
              </button>
          </h2>
          <PreviewElement preview={preview} />
          <h3>State</h3>
          <p>{state.current_track + 1}/15</p>
          <AnswerForm gameId={state.slug} currentTrack={state.current_track} />
          <div>
            Current answer:
            <AnswerMarks data={myLastAnswer} />
          </div>
          <h3>Rankings</h3>
          <ol>
            {rankings.map((v, k) => (
              <li key={k}>
                {v.name} ({v.points} points)
                (marks: <AnswerMarks data={v.current} />)
              </li>
            ))}
          </ol>
          <PastTracksPanel gameId={gameId} tracks={state.tracks} />
        </>
      )}
    </div>
  );
};

const Games = ({
  setMsg,
  me,
  loadedData,
}) => {
  const {
    data, loading, error, sync,
  } = loadedData;

  const createGame = useCallback(() => {
    fetchJsonOrError(gamesUrl(), { method: 'POST' })
      .then((data) => {
        setMsg(`Success: ${data.success ? "yes" : "no"}, msg: ${data.message}`);
        sync();
      });
  }, [setMsg, sync]);

  const [selectedGame, setGame] = useState(null);

  console.log(data);
  return (
    <>
      <h2>Games</h2>
      {error && (
        <p>oups, an error happened!</p>
      )}
      {loading && (
        <p>loading</p>
      )}
      <p><button onClick={createGame}>Create game</button></p>
      {!loading && data && (
        <ul>
          {data.map((v, k) => (
            <li key={k}>
              Game #{v.slug} ({statusForGame(v)})
              <button onClick={() => setGame(v.slug)}>
                go
              </button>
            </li>
          ))}
        </ul>
      )}
      {selectedGame && (
        <Game gameId={selectedGame} setMsg={setMsg} me={me} />
      )}
    </>
  );
};

const GlobalMessage = ({
  message,
}) => (
  <p style={{ minHeight: "20px" }}>
    Global info: {message}
  </p>
);

const GameTest = () => {
  const { gameId } = useParams();
  return (
    <p>Display game with id: {gameId}</p>
  );
};

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
    data
  } = useLoadedData(meUrl());
  // Some global message
  const [msg, setMsg] = useState("");
  // Note: usecontext for "me"
          //<GlobalMessage message={msg} />
          //<Games setMsg={setMsg} me={data} />
  const [theme, toggle] = useReducer((state) => {
    return state === "light" ? "dark" : "light"
  }, "light");

  const muiTheme = createMuiTheme({
    palette: {
      type: theme,
    },
  });

  const classes = useStyles();

  // TODO: extract the main entry point with all the theme + route wrapping
  // to some "withRoot" hook taking an entry point as parameter.

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div className={classes.root}>
      <Grid container direction="column" className={classes.grow}>
        <Grid item>
          <Header user={data} />
        </Grid>
        <Grid item>
          <Container>
            <p>msg: {msg}</p>
            {data ? (
              <Switch>
                <Route path="/games">
                  <GamesIndex me={data} setMsg={setMsg} />
                </Route>
                <Route path="/game/:gameId">
                  <GameTest />
                </Route>
                <Route path="/">
                  <Welcome user={data} toggle={toggle} />
                </Route>
              </Switch>
            ) : (
              <p>Still loging you in</p>
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
