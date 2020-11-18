import React, { useState, useEffect, useCallback } from 'react';
import logo from './logo.svg';
import _ from 'lodash';
import useLoadedData from './requests/loadable';
import './App.css';
import consumer from './consumer';

const BASE_URL = 'http://localhost:1235';
const gamesUrl = () => `${BASE_URL}/games`;
const gameUrl = (id) => `${gamesUrl()}/${id}`;
const meUrl = () => `${BASE_URL}/me`;
const attemptUrl = (id) => `${gameUrl(id)}/attempt`;

const statusForGame = game => {
  if (game.finished) {
    return "finished";
  } else if (game.running) {
    return "running";
  } else if (game.available) {
    return "will start";
  } else {
    return "TODO";
  }
};

const Game = ({
  gameId,
}) => {
  const {
    data, loading, error, sync,
  } = useLoadedData(
    gameUrl(gameId),
  );

  const [slug, setSlug] = useState(null);
  const [tracks, setTracks] = useState([]);
  // TODO: somehow merge joined and rankings!
  // idea: during ranking generation, set "is_connected" based on the
  // 'game_userable' table!
  const [joined, setJoined] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [current, setCurrent] = useState(0);

  const setStateFromData = useCallback((data) => {
    if (!data) return;
    setSlug(data.slug);
    setTracks(data.tracks);
    setRankings(data.rankings);
    setJoined(data.joined);
    setCurrent(data.current_track);
  }, [setTracks, setRankings, setCurrent]);

  // Set the initial game state when available/synced
  useEffect(() => setStateFromData(data), [data]);

  useEffect(() => {
    if (slug === null)
      return;
    // unsubscribe/subscribe
    console.log("gameId has changed to: " + slug);
    const sub = consumer.subscriptions.create({
      channel: "GameChannel",
      id: slug,
    }, {
      received(data) {
        console.log("received some data");
        console.log(data);
        if (data.action === "users_updated") {
          setJoined(data.users);
        }
      },
    })
    return () => {
      if (slug === null)
        return;
      consumer.subscriptions.remove(sub);
      console.log("cleanup for: " + slug);
    };
  }, [slug]);

  return (
    <div>
      {error && (
        <p>oups, an error happened!<br/>{error}</p>
      )}
      {loading && (
        <p>loading</p>
      )}
      {slug && (
        <>
          <h2>Selected game: {slug}</h2>
          <h3>State</h3>
          <p>{current + 1}/15</p>
          <h3>Users</h3>
          <ul>
            {joined.map((v, k) => (
              <li key={k}>{v.name}</li>
            ))}
          </ul>
          <h3>Rankings</h3>
          <ol>
            {rankings.map((v, k) => (
              <li key={k}>{v.name} ({v.points} points)</li>
            ))}
          </ol>
          <h3>Past songs</h3>
          <ul>
            {tracks.map((v, k) => (
              <li key={k}><img src={v.cover_url} /><b>{v.title}</b> - <b>{v.artist}</b></li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

const Games = () => {
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
        <Game gameId={selectedGame} />
      )}
    </>
  );
};

function App() {
  const {
    data
  } = useLoadedData(meUrl());
  return (
    <div className="App">
      {data && (
        <p>Welcome {data.name}</p>
      )}
      <Games />
    </div>
  );
}

export default App;
