import React, { useState, useEffect } from 'react';
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
  useEffect(() => {
    // unsubscribe/subscribe
    console.log("gameId has changed to: " + gameId);
    consumer.subscriptions.create({
      channel: "GameChannel",
      id: gameId,
    }, {
      received(data) {
        console.log("received some data");
        console.log(data);
      },
    })
    return () => {
      console.log("cleanup for: " + gameId);
    };
  }, [gameId]);
  console.log(gameId);
  console.log(data);
  return (
    <div>
      {error && (
        <p>oups, an error happened!<br/>{error}</p>
      )}
      {loading && (
        <p>loading</p>
      )}
      {!loading && data && (
        <>
          <h2>Selected game: {data.slug}</h2>
          <h3>State</h3>
          <p>{data.current_track + 1}/15</p>
          <h3>Rankings</h3>
          <ol>
            {data.rankings.map((v, k) => (
              <li key={k}>{v.name} ({v.points} points)</li>
            ))}
          </ol>
          <h3>Past songs</h3>
          <ul>
            {data.tracks.map((v, k) => (
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
