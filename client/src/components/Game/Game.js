import React, { useReducer, useCallback, useState, useEffect } from 'react';
import Preview from './Preview';
import { Box, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
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
import PositiveButton from '../Buttons/Positive';
import NegativeButton from '../Buttons/Negative';

const useStyles = makeStyles((theme) => ({
  botSpace: {
    marginBottom: theme.spacing(2),
  },
}));

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

  const { slug, rankings, tracks, currentTrack, started, available } = state;

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

  const { botSpace } = useStyles();

  return (
    <>
      <Snackbar snack={snack} setSnack={setSnack} />
      <Preview preview={preview} />
      <Grid container>
        {!started && available && (
          <Grid item xs={12} className={botSpace}>
            <PositiveButton fullWidth variant="contained" onClick={() => startGame(slug, snackCallback)}>
              Start
            </PositiveButton>
          </Grid>
        )}
        {started && available && (
          <Grid item xs={12} className={botSpace}>
            <NegativeButton fullWidth variant="contained" onClick={() => stopGame(slug, snackCallback)}>
              Abort game
            </NegativeButton>
          </Grid>
        )}
        <Grid container item xs={12} className={botSpace}>
          <GameState
            currentTrack={currentTrack}
            slug={slug}
            currentAnswer={currentAnswer(rankings, me)}
          />
        </Grid>
        <Grid item xs={12} md={6} className={botSpace}>
          <Box mr={{md: 2}}>
            <Rankings rankings={rankings} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <PastTracks slug={slug} tracks={tracks} />
        </Grid>
      </Grid>
    </>
  );
};

export default Game;
