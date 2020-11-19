import React, { useState, useEffect, useCallback, useRef } from 'react';
import logo from './logo.svg';
import _ from 'lodash';
import useLoadedData from './requests/loadable';
import { fetchJsonOrError } from './requests/fetchJsonOrError';
import './App.css';
import consumer from './consumer';

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
  const [audio, setAudio] = useState(null);
  // Upon changing preview, pause any running song, and generate a new audio.
  useEffect(() => {
    if (!preview) return;
    if (audio) {
      audio.pause();
    }
    setAudio(new Audio(preview));
  }, [preview]);

  // Upon new audio, play it.
  useEffect(() => {
    if (!audio) return;
    audio.play();
  }, [audio]);

  return (
    <div>
      coucou audio
    </div>
  )
};

const Game = ({
  gameId,
  setMsg,
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
  const [state, setState] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [preview, setPreview] = useState(null);

  const setStateFromData = useCallback((data) => {
    if (!data) return;
    console.log(data);
    setRankings(data.rankings);
    setState(data);
  }, [setState, setRankings]);

  const startGame = useCallback((id) => {
    fetchJsonOrError(gameStartUrl(id))
      .then((data) => {
        setMsg(`Success: ${data.success ? "yes" : "no"}, msg: ${data.message}`);
      });
  }, [setMsg]);

  const stopGame = useCallback((id) => {
    fetchJsonOrError(gameStopUrl(id))
      .then((data) => {
        setMsg(`Success: ${data.success ? "yes" : "no"}, msg: ${data.message}`);
      });
  }, [setMsg]);

  // Set the game state when available/synced
  useEffect(() => setStateFromData(data), [data]);

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
  }, [gameId]);

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
          <h3>Rankings</h3>
          <ol>
            {rankings.map((v, k) => (
              <li key={k}>{v.name} ({v.points} points)</li>
            ))}
          </ol>
          <h3>Past songs</h3>
          <ul>
            {state.tracks.map((v, k) => (
              <li key={k}><img src={v.cover_url} /><b>{v.title}</b> - <b>{v.artist}</b></li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

const Games = ({
  setMsg,
}) => {
  const {
    data, loading, error, sync,
  } = useLoadedData(
    gamesUrl(),
  );

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
        <Game gameId={selectedGame} setMsg={setMsg} />
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

function App() {
  const {
    data
  } = useLoadedData(meUrl());
  // Some global message
  const [msg, setMsg] = useState("");
  return (
    <div className="App">
      {data && (
        <p>Welcome {data.name}</p>
      )}
      <GlobalMessage message={msg} />
      <Games setMsg={setMsg} />
    </div>
  );
}

export default App;
