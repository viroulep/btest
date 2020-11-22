import React, { useReducer, useState, useEffect } from 'react';
import Preview from './Preview';
import { Grid } from '@material-ui/core';
import PastTracks from './PastTracks';
import Rankings from './Rankings';
import consumer from '../../channels/consumer';
import GameState from './State';
import {
  dispatcher,
  currentAnswer,
  handleDataReceived,
  startGame,
  stopGame,
} from '../../logic/game';

const Game = ({
  game,
  setMsg,
  me,
}) => {
  const [state, changeState] = useReducer(dispatcher, game);
  const { slug, rankings, tracks, current_track } = state;
  const [preview, setPreview] = useState(null);

  // The subscription
  useEffect(() => {
    if (!slug)
      return;
    console.log("gameId has changed to: " + slug);
    const sub = consumer.subscriptions.create({
      channel: "GameChannel",
      id: slug,
    }, {
      received: (data) => handleDataReceived(data, setMsg, changeState, setPreview),
    })
    return () => {
      if (!slug)
        return;
      consumer.subscriptions.remove(sub);
      console.log("cleanup for: " + slug);
    };
  }, [slug, setMsg, changeState, setPreview]);
  console.log("game#show");
  console.log(state);
  return (
    <>
      <h2>
        Selected game: {slug}
        <button onClick={() => startGame(slug, setMsg)}>
          go
        </button>
        <button onClick={() => stopGame(slug, setMsg)}>
          stop
        </button>
      </h2>
      <Preview preview={preview} />
      <Grid container spacing={3}>
        <Grid container item xs={12}>
          <GameState
            currentTrack={current_track}
            slug={slug}
            currentAnswer={currentAnswer(rankings, me)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Rankings rankings={rankings} />
        </Grid>
        <Grid item xs={12} md={6}>
          <PastTracks slug={slug} tracks={tracks} />
        </Grid>
      </Grid>
    </>
  );
};

export default Game;
