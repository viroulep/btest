import React, { useReducer, useCallback, useState, useEffect } from 'react';
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
import { updateSnack } from '../../logic/snack';
import Snackbar from '../Snackbar/Snack';

const Game = ({
  game,
  me,
}) => {
  const [state, changeState] = useReducer(dispatcher, game);
  const [preview, setPreview] = useState(null);
  const [snack, setSnack] = useState({
    open: false,
    severity: 'success',
    message: '',
  });

  const snackCallback = useCallback((data) => updateSnack(data, setSnack), [setSnack]);

  const { slug, rankings, tracks, current_track } = state;

  // The subscription
  useEffect(() => {
    if (!slug)
      return;
    const sub = consumer.subscriptions.create({
      channel: "GameChannel",
      id: slug,
    }, {
      received: (data) => handleDataReceived(data, changeState, setPreview),
    })
    return () => {
      if (!slug)
        return;
      consumer.subscriptions.remove(sub);
    };
  }, [slug, changeState, setPreview]);
  return (
    <>
      <Snackbar snack={snack} setSnack={setSnack} />
      <h2>
        Selected game: {slug}
        <button onClick={() => startGame(slug, snackCallback)}>
          go
        </button>
        <button onClick={() => stopGame(slug, snackCallback)}>
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
